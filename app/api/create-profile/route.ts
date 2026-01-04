import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { userType, email, name } = await request.json();
    
    // Verificar se o usuário está autenticado
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    // Se não estiver autenticado mas tiver email, buscar o usuário pelo email
    let userId: string;
    let userEmail: string;
    let userName: string;
    
    if (authError || !user) {
      if (!email) {
        return NextResponse.json(
          { error: "Não autenticado e email não fornecido" },
          { status: 401 }
        );
      }
      
      // Buscar usuário pelo email usando admin client
      const supabaseAdmin = createSupabaseAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      );
      
      const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      
      if (listError) {
        console.error("Error listing users:", listError);
        return NextResponse.json(
          { error: "Erro ao buscar usuário", details: listError },
          { status: 500 }
        );
      }
      
      console.log("Total users found:", users.users.length);
      console.log("Looking for email:", email);
      
      const foundUser = users.users.find(u => u.email === email);
      
      if (!foundUser) {
        console.error("User not found with email:", email);
        console.log("Available emails:", users.users.map(u => u.email));
        return NextResponse.json(
          { error: "Usuário não encontrado", email, availableUsers: users.users.length },
          { status: 404 }
        );
      }
      
      console.log("Found user:", foundUser.id, foundUser.email);
      
      userId = foundUser.id;
      userEmail = foundUser.email!;
      userName = name || foundUser.user_metadata?.name || foundUser.email?.split("@")[0] || "Usuário";
    } else {
      userId = user.id;
      userEmail = user.email!;
      userName = name || user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Usuário";
    }

    // Criar admin client para bypass RLS
    const supabaseAdmin = createSupabaseAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Verificar se já existe profile
    const { data: existingProfile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single();

    // Criar profile se não existir
    if (!existingProfile) {
      const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .insert({
          id: userId,
          email: userEmail,
          name: userName,
          type: userType,
        });

      if (profileError) {
        console.error("Error creating profile:", profileError);
        return NextResponse.json(
          { error: "Erro ao criar profile", details: profileError },
          { status: 500 }
        );
      }
    }

    // Se for motorista, criar registro em motorists
    if (userType === 'motorista') {
      const { data: existingMotorist } = await supabaseAdmin
        .from("motorists")
        .select("id")
        .eq("profile_id", userId)
        .single();

      if (!existingMotorist) {
        const { error: motoristError } = await supabaseAdmin
          .from("motorists")
          .insert({
            profile_id: userId,
          });

        if (motoristError) {
          console.error("Error creating motorist:", motoristError);
          return NextResponse.json(
            { error: "Erro ao criar motorist", details: motoristError },
            { status: 500 }
          );
        }
        
        console.log("Motorist created successfully for user:", userId);
      }
    } else if (userType === 'oficina') {
      // Se for oficina, criar registro básico em workshops
      const { data: existingWorkshop } = await supabaseAdmin
        .from("workshops")
        .select("id")
        .eq("profile_id", userId)
        .single();

      if (!existingWorkshop) {
        const { error: workshopError } = await supabaseAdmin
          .from("workshops")
          .insert({
            profile_id: userId,
            name: userName,
            plan_type: "free",
            trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 dias
          });

        if (workshopError) {
          console.error("Error creating workshop:", workshopError);
          return NextResponse.json(
            { error: "Erro ao criar workshop", details: workshopError },
            { status: 500 }
          );
        }
        
        console.log("Workshop created successfully for user:", userId);
      }
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error in create-profile:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

