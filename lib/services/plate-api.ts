interface VehicleData {
  placa: string;
  marca: string;
  modelo: string;
  ano: number;
  anoModelo: number;
  cor: string;
  combustivel: string;
  uf: string;
  municipio: string;
}

export async function searchByPlate(plate: string): Promise<VehicleData | null> {
  try {
    // Limpar placa (remover hífen e espaços)
    const cleanPlate = plate.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    
    // Usar API Brasil (gratuita)
    const response = await fetch(`https://brasilapi.com.br/api/fipe/preco/v1/${cleanPlate}`);
    
    if (!response.ok) {
      // Tentar API alternativa se a primeira falhar
      const altResponse = await fetch(`/api/vehicle/plate?plate=${cleanPlate}`);
      if (!altResponse.ok) return null;
      return altResponse.json();
    }
    
    return response.json();
  } catch (error) {
    console.error('Erro ao buscar placa:', error);
    return null;
  }
}
