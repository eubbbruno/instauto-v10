"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, Loader2 } from "lucide-react";

interface AddressAutocompleteProps {
  onSelect: (address: string) => void;
}

export default function AddressAutocomplete({ onSelect }: AddressAutocompleteProps) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Fechar sugestões ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Buscar endereços
  useEffect(() => {
    const searchAddress = async () => {
      if (input.length < 3) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);

      try {
        // Se for CEP (apenas números)
        const cepOnly = input.replace(/\D/g, "");
        if (cepOnly.length === 8) {
          const response = await fetch(`https://viacep.com.br/ws/${cepOnly}/json/`);
          const data = await response.json();
          
          if (!data.erro) {
            const fullAddress = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
            setSuggestions([fullAddress, `${data.localidade} - ${data.uf}`, data.bairro]);
            setShowSuggestions(true);
          }
        } else {
          // Buscar cidades brasileiras
          const response = await fetch("https://brasilapi.com.br/api/ibge/municipios/v1");
          const cities = await response.json();
          
          const filtered = cities
            .filter((city: any) => 
              city.nome.toLowerCase().includes(input.toLowerCase())
            )
            .slice(0, 5)
            .map((city: any) => `${city.nome} - ${city.microrregiao.mesorregiao.UF.sigla}`);
          
          setSuggestions(filtered);
          setShowSuggestions(filtered.length > 0);
        }
      } catch (error) {
        console.error("Erro ao buscar endereço:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(searchAddress, 300);
    return () => clearTimeout(debounce);
  }, [input]);

  const handleSelect = (suggestion: string) => {
    setInput(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
    onSelect(suggestion);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder="Digite seu CEP, cidade ou bairro"
          className="w-full px-4 py-4 text-gray-900 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none text-lg pr-12"
          autoComplete="off"
        />
        {isLoading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
          </div>
        )}
      </div>

      {/* Sugestões */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-2xl border-2 border-gray-100 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSelect(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center gap-3 border-b border-gray-100 last:border-b-0"
            >
              <MapPin className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <span className="text-gray-900 font-sans">{suggestion}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

