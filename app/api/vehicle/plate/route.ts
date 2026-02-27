import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const plate = request.nextUrl.searchParams.get('plate');
  
  if (!plate) {
    return NextResponse.json({ error: 'Placa não informada' }, { status: 400 });
  }
  
  const cleanPlate = plate.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  
  try {
    // Tentar API 1: WDAPI (gratuita com limite)
    const response1 = await fetch(
      `https://wdapi2.com.br/consulta/${cleanPlate}/json`,
      { 
        headers: { "Authorization": "Bearer free" },
        next: { revalidate: 86400 }
      }
    );

    if (response1.ok) {
      const data = await response1.json();
      
      if (data && data.MARCA) {
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
    const response2 = await fetch(
      `https://api.placafacil.com.br/v1/placa/${cleanPlate}`,
      { next: { revalidate: 86400 } }
    );

    if (response2.ok) {
      const data = await response2.json();
      
      if (data && data.marca) {
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
    return NextResponse.json(
      { error: 'Veículo não encontrado. Preencha os dados manualmente.' },
      { status: 404 }
    );

  } catch (error) {
    console.error('Erro na busca de placa:', error);
    return NextResponse.json(
      { error: 'Serviço temporariamente indisponível. Preencha os dados manualmente.' },
      { status: 500 }
    );
  }
}
