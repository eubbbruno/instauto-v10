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
  const url = `${FIPE_BASE_URL}/${type}/marcas`;
  console.log('🔍 [FIPE] Buscando marcas:', url);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
  const data = await response.json();
  console.log('✅ [FIPE] Marcas carregadas:', data.length);
  return data;
}

export async function getFipeModels(type: VehicleType, brandCode: string): Promise<{ modelos: FipeModel[] }> {
  const url = `${FIPE_BASE_URL}/${type}/marcas/${brandCode}/modelos`;
  console.log('🔍 [FIPE] Buscando modelos:', url);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
  const data = await response.json();
  console.log('✅ [FIPE] Modelos carregados:', data.modelos?.length);
  return data;
}

export async function getFipeYears(type: VehicleType, brandCode: string, modelCode: number): Promise<FipeYear[]> {
  const url = `${FIPE_BASE_URL}/${type}/marcas/${brandCode}/modelos/${modelCode}/anos`;
  console.log('🔍 [FIPE] Buscando anos:', url);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
  const data = await response.json();
  console.log('✅ [FIPE] Anos carregados:', data.length);
  return data;
}

export async function getFipePrice(type: VehicleType, brandCode: string, modelCode: number, yearCode: string): Promise<FipePrice> {
  const url = `${FIPE_BASE_URL}/${type}/marcas/${brandCode}/modelos/${modelCode}/anos/${yearCode}`;
  console.log('🔍 [FIPE] Buscando preço:', url);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
  const data = await response.json();
  console.log('✅ [FIPE] Preço obtido:', data.Valor);
  return data;
}
