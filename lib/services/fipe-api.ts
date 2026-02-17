const FIPE_BASE_URL = 'https://parallelum.com.br/fipe/api/v1';

export interface FipeBrand {
  codigo: string;
  nome: string;
}

export interface FipeModel {
  codigo: number;
  nome: string;
}

export interface FipeYear {
  codigo: string;
  nome: string;
}

export interface FipePrice {
  TipoVeiculo: number;
  Valor: string;
  Marca: string;
  Modelo: string;
  AnoModelo: number;
  Combustivel: string;
  CodigoFipe: string;
  MesReferencia: string;
}

// Tipo de veículo: carros, motos, caminhoes
type VehicleType = 'carros' | 'motos' | 'caminhoes';

export async function getFipeBrands(type: VehicleType = 'carros'): Promise<FipeBrand[]> {
  const response = await fetch(`${FIPE_BASE_URL}/${type}/marcas`);
  return response.json();
}

export async function getFipeModels(type: VehicleType, brandCode: string): Promise<{ modelos: FipeModel[] }> {
  const response = await fetch(`${FIPE_BASE_URL}/${type}/marcas/${brandCode}/modelos`);
  return response.json();
}

export async function getFipeYears(type: VehicleType, brandCode: string, modelCode: number): Promise<FipeYear[]> {
  const response = await fetch(`${FIPE_BASE_URL}/${type}/marcas/${brandCode}/modelos/${modelCode}/anos`);
  return response.json();
}

export async function getFipePrice(type: VehicleType, brandCode: string, modelCode: number, yearCode: string): Promise<FipePrice> {
  const response = await fetch(`${FIPE_BASE_URL}/${type}/marcas/${brandCode}/modelos/${modelCode}/anos/${yearCode}`);
  return response.json();
}
