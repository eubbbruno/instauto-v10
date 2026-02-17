"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, DollarSign, Car, Calendar, Fuel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  getFipeBrands, 
  getFipeModels, 
  getFipeYears, 
  getFipePrice,
  FipeBrand,
  FipeModel,
  FipeYear,
  FipePrice
} from "@/lib/services/fipe-api";

export function FipeConsult() {
  const [brands, setBrands] = useState<FipeBrand[]>([]);
  const [models, setModels] = useState<FipeModel[]>([]);
  const [years, setYears] = useState<FipeYear[]>([]);
  const [result, setResult] = useState<FipePrice | null>(null);
  
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [loadingBrands, setLoadingBrands] = useState(true);

  // Carregar marcas no mount
  useEffect(() => {
    async function loadBrands() {
      try {
        const data = await getFipeBrands('carros');
        setBrands(data);
      } catch (error) {
        console.error('Erro ao carregar marcas:', error);
      } finally {
        setLoadingBrands(false);
      }
    }
    loadBrands();
  }, []);

  // Carregar modelos quando marca mudar
  useEffect(() => {
    if (!selectedBrand) {
      setModels([]);
      return;
    }
    
    async function loadModels() {
      try {
        const data = await getFipeModels('carros', selectedBrand);
        setModels(data.modelos);
        setSelectedModel("");
        setYears([]);
        setResult(null);
      } catch (error) {
        console.error('Erro ao carregar modelos:', error);
      }
    }
    loadModels();
  }, [selectedBrand]);

  // Carregar anos quando modelo mudar
  useEffect(() => {
    if (!selectedBrand || !selectedModel) {
      setYears([]);
      return;
    }
    
    async function loadYears() {
      try {
        const data = await getFipeYears('carros', selectedBrand, parseInt(selectedModel));
        setYears(data);
        setSelectedYear("");
        setResult(null);
      } catch (error) {
        console.error('Erro ao carregar anos:', error);
      }
    }
    loadYears();
  }, [selectedBrand, selectedModel]);

  const handleConsult = async () => {
    if (!selectedBrand || !selectedModel || !selectedYear) return;
    
    setLoading(true);
    try {
      const data = await getFipePrice('carros', selectedBrand, parseInt(selectedModel), selectedYear);
      setResult(data);
    } catch (error) {
      console.error('Erro ao consultar preço:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Consulta Tabela FIPE</h2>
          <p className="text-sm text-gray-500">Descubra o valor do seu veículo</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Marca */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Marca</label>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            disabled={loadingBrands}
            className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione a marca</option>
            {brands.map((brand) => (
              <option key={brand.codigo} value={brand.codigo}>
                {brand.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Modelo */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Modelo</label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={!selectedBrand || models.length === 0}
            className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione o modelo</option>
            {models.map((model) => (
              <option key={model.codigo} value={model.codigo}>
                {model.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Ano */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Ano</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            disabled={!selectedModel || years.length === 0}
            className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione o ano</option>
            {years.map((year) => (
              <option key={year.codigo} value={year.codigo}>
                {year.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Button
        onClick={handleConsult}
        disabled={!selectedBrand || !selectedModel || !selectedYear || loading}
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-semibold py-3 rounded-xl"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Consultando...
          </>
        ) : (
          <>
            <Search className="w-5 h-5 mr-2" />
            Consultar Valor
          </>
        )}
      </Button>

      {/* Resultado */}
      {result && (
        <div className="mt-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600 mb-1">Valor FIPE</p>
            <p className="text-4xl font-bold text-green-600">{result.Valor}</p>
            <p className="text-xs text-gray-500 mt-1">Ref: {result.MesReferencia}</p>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center p-3 bg-white rounded-xl">
              <Car className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <p className="text-xs text-gray-500">Marca</p>
              <p className="text-sm font-medium">{result.Marca}</p>
            </div>
            <div className="text-center p-3 bg-white rounded-xl">
              <Calendar className="w-5 h-5 text-purple-600 mx-auto mb-1" />
              <p className="text-xs text-gray-500">Ano</p>
              <p className="text-sm font-medium">{result.AnoModelo}</p>
            </div>
            <div className="text-center p-3 bg-white rounded-xl">
              <Fuel className="w-5 h-5 text-orange-600 mx-auto mb-1" />
              <p className="text-xs text-gray-500">Combustível</p>
              <p className="text-sm font-medium">{result.Combustivel}</p>
            </div>
          </div>
          
          <p className="text-xs text-gray-400 text-center mt-4">
            Código FIPE: {result.CodigoFipe}
          </p>
        </div>
      )}
    </div>
  );
}
