import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const plate = request.nextUrl.searchParams.get('plate');
  
  if (!plate) {
    return NextResponse.json({ error: 'Placa não informada' }, { status: 400 });
  }
  
  const cleanPlate = plate.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  
  try {
    // Tentar API Brasil primeiro
    const response = await fetch(`https://brasilapi.com.br/api/fipe/preco/v1/${cleanPlate}`, {
      headers: { 'Accept': 'application/json' }
    });
    
    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    }
    
    // Se não encontrou, retornar null
    return NextResponse.json({ error: 'Veículo não encontrado' }, { status: 404 });
    
  } catch (error) {
    console.error('Erro na API de placa:', error);
    return NextResponse.json({ error: 'Erro ao consultar placa' }, { status: 500 });
  }
}
