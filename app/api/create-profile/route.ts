import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { userType } = await request.json();
    
    // Verificar se o usuário está autenticado
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
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

    const userName = user.user_metadata?.name || 
                    user.user_metadata?.full_name || 
                    user.email?.split("@")[0] || 
                    "Usuário";

    // Verificar se já existe profile
    const { data: existingProfile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    // Criar profile se não existir
    if (!existingProfile) {
      const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .insert({
          id: user.id,
          email: user.email,
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
        .eq("profile_id", user.id)
        .single();

      if (!existingMotorist) {
        const { error: motoristError } = await supabaseAdmin
          .from("motorists")
          .insert({
            profile_id: user.id,
            name: userName,
          });

        if (motoristError) {
          console.error("Error creating motorist:", motoristError);
          return NextResponse.json(
            { error: "Erro ao criar motorist", details: motoristError },
            { status: 500 }
          );
        }
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

