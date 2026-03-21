"use client";

import { ArrowUpCircle, ArrowDownCircle, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Transaction {
  id: string;
  workshop_id: string;
  type: "income" | "expense";
  category: string;
  description: string;
  amount: number;
  date: string;
  payment_method?: string;
  status: string;
  created_at: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
}

export default function TransactionList({
  transactions,
  onEdit,
  onDelete,
}: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-sm">Nenhuma transação encontrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group"
        >
          <div className="flex items-center gap-3 flex-1">
            <div
              className={`p-2 rounded-lg ${
                transaction.type === "income" ? "bg-green-100" : "bg-red-100"
              }`}
            >
              {transaction.type === "income" ? (
                <ArrowUpCircle className="w-5 h-5 text-green-600" />
              ) : (
                <ArrowDownCircle className="w-5 h-5 text-red-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {transaction.description}
              </p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <p className="text-xs text-gray-500">
                  {format(new Date(transaction.date), "dd/MM/yyyy", { locale: ptBR })}
                </p>
                <span className="text-xs text-gray-400">•</span>
                <p className="text-xs text-gray-500">{transaction.category}</p>
                {transaction.payment_method && (
                  <>
                    <span className="text-xs text-gray-400">•</span>
                    <p className="text-xs text-gray-500">{transaction.payment_method}</p>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <p
              className={`text-sm sm:text-base font-bold ${
                transaction.type === "income" ? "text-green-600" : "text-red-600"
              }`}
            >
              {transaction.amount.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
            {(onEdit || onDelete) && (
              <div className="hidden sm:flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {onEdit && (
                  <button
                    onClick={() => onEdit(transaction)}
                    className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4 text-blue-600" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(transaction)}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
