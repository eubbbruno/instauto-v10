"use client";

import { useState, useEffect } from "react";
import { X, ChevronRight, ChevronLeft } from "lucide-react";

interface Step {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface OnboardingModalProps {
  steps: Step[];
  storageKey: string;
}

export function OnboardingModal({ steps, storageKey }: OnboardingModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const done = localStorage.getItem(storageKey);
    if (!done) {
      // Delay para não aparecer imediatamente
      setTimeout(() => setIsOpen(true), 1000);
    }
  }, [storageKey]);

  const handleClose = () => {
    localStorage.setItem(storageKey, 'true');
    setIsOpen(false);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-lg w-full p-8 relative shadow-2xl">
        
        {/* Botão fechar */}
        <button 
          onClick={handleClose} 
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-xl transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Indicadores */}
        <div className="flex justify-center gap-2 mb-8">
          {steps.map((_, index) => (
            <div 
              key={index} 
              className={`h-2 rounded-full transition-all ${
                index === currentStep 
                  ? 'w-8 bg-blue-600' 
                  : 'w-2 bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Conteúdo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            {steps[currentStep].icon}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {steps[currentStep].title}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {steps[currentStep].description}
          </p>
        </div>

        {/* Navegação */}
        <div className="flex justify-between items-center">
          <button 
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-colors ${
              currentStep === 0 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Anterior
          </button>
          
          <button 
            onClick={handleNext}
            className="px-6 py-3 bg-yellow-400 text-yellow-900 font-semibold rounded-xl hover:bg-yellow-300 flex items-center gap-2 transition-all shadow-lg shadow-yellow-400/30"
          >
            {currentStep === steps.length - 1 ? 'Começar' : 'Próximo'}
            {currentStep < steps.length - 1 && <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
