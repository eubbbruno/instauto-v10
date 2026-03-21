"use client";

import { TrendingUp, TrendingDown, DollarSign, Clock } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { StaggerContainer, StaggerItem } from "@/components/ui/motion";

interface FinanceStatsProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  totalReceivable: number;
}

export default function FinanceStats({
  totalIncome,
  totalExpense,
  balance,
  totalReceivable,
}: FinanceStatsProps) {
  return (
    <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <StaggerItem>
        <GlassCard hover className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-green-100 rounded-xl">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Receitas do Mês</p>
          <p className="text-lg sm:text-2xl font-bold text-green-600">
            {totalIncome.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </GlassCard>
      </StaggerItem>

      <StaggerItem>
        <GlassCard hover className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-red-100 rounded-xl">
              <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
            </div>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Despesas do Mês</p>
          <p className="text-lg sm:text-2xl font-bold text-red-600">
            {totalExpense.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </GlassCard>
      </StaggerItem>

      <StaggerItem>
        <GlassCard hover className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2 rounded-xl ${balance >= 0 ? "bg-blue-100" : "bg-red-100"}`}>
              <DollarSign
                className={`w-5 h-5 sm:w-6 sm:h-6 ${balance >= 0 ? "text-blue-600" : "text-red-600"}`}
              />
            </div>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Saldo do Mês</p>
          <p
            className={`text-lg sm:text-2xl font-bold ${
              balance >= 0 ? "text-blue-600" : "text-red-600"
            }`}
          >
            {balance.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </GlassCard>
      </StaggerItem>

      <StaggerItem>
        <GlassCard hover className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-yellow-100 rounded-xl">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mb-1">A Receber</p>
          <p className="text-lg sm:text-2xl font-bold text-yellow-600">
            {totalReceivable.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </GlassCard>
      </StaggerItem>
    </StaggerContainer>
  );
}
