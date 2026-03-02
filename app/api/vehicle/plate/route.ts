import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const plate = request.nextUrl.searchParams.get('plate');
  
  console.log('🔍 [Placa API] Buscando placa:', plate);
  
  if (!plate) {
    return NextResponse.json({ error: 'Placa não informada' }, { status: 400 });
  }
  
  const cleanPlate = plate.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  console.log('🔍 [Placa API] Placa limpa:', cleanPlate);
  
  try {
    // Tentar API 1: WDAPI (gratuita com limite)
    console.log('🔍 [Placa API] Tentando WDAPI...');
    const response1 = await fetch(
      `https://wdapi2.com.br/consulta/${cleanPlate}/json`,
      { 
        headers: { "Authorization": "Bearer free" },
        next: { revalidate: 86400 }
      }
    );

    console.log('🔍 [Placa API] WDAPI status:', response1.status);

    if (response1.ok) {
      const data = await response1.json();
      console.log('🔍 [Placa API] WDAPI data:', data);
      
      if (data && data.MARCA) {
        console.log('✅ [Placa API] Veículo encontrado via WDAPI');
        return NextResponse.json({
          marca: data.MARCA,
          modelo: data.MODELO,
          ano: data.ano,
          anoModelo: data.anoModelo,
          cor: data.cor,
          combustivel: data.combustivel,
        });
      }
    }

    // Tentar API 2: Placa Fácil
    console.log('🔍 [Placa API] Tentando Placa Fácil...');
    const response2 = await fetch(
      `https://api.placafacil.com.br/v1/placa/${cleanPlate}`,
      { next: { revalidate: 86400 } }
    );

    console.log('🔍 [Placa API] Placa Fácil status:', response2.status);

    if (response2.ok) {
      const data = await response2.json();
      console.log('🔍 [Placa API] Placa Fácil data:', data);
      
      if (data && data.marca) {
        console.log('✅ [Placa API] Veículo encontrado via Placa Fácil');
        return NextResponse.json({
          marca: data.marca,
          modelo: data.modelo,
          ano: data.ano,
          anoModelo: data.anoModelo || data.ano,
          cor: data.cor,
          combustivel: data.combustivel,
        });
      }
    }

    // Se nenhuma API funcionou, retornar 404
    console.log('⚠️ [Placa API] Nenhuma API retornou dados');
    return NextResponse.json(
      { error: 'Busca automática indisponível no momento. Por favor, preencha os dados manualmente.' },
      { status: 404 }
    );

  } catch (error) {
    console.error('❌ [Placa API] Erro na busca:', error);
    return NextResponse.json(
      { error: 'Busca automática indisponível no momento. Por favor, preencha os dados manualmente.' },
      { status: 500 }
    );
  }
}
