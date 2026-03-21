"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { GlassCard } from "@/components/ui/glass-card";
import {
  Loader2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpCircle,
  ArrowDownCircle,
  Calendar,
  CreditCard,
  FileText,
  Plus,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import TransactionModal from "@/components/financeiro/TransactionModal";
import TransactionList from "@/components/financeiro/TransactionList";
import FinanceStats from "@/components/financeiro/FinanceStats";

type TransactionType = "income" | "expense";

interface Transaction {
  id: string;
  workshop_id: string;
  type: TransactionType;
  category: string;
  description: string;
  amount: number;
  date: string;
  payment_method?: string;
  status: string;
  created_at: string;
}

interface Bill {
  id: string;
  workshop_id: string;
  supplier?: string;
  description: string;
  amount: number;
  due_date: string;
  paid_date?: string;
  status: "pending" | "paid" | "overdue" | "cancelled";
  category?: string;
}

interface Receivable {
  id: string;
  workshop_id: string;
  client_name?: string;
  description: string;
  amount: number;
  due_date: string;
  received_date?: string;
  status: "pending" | "received" | "overdue" | "cancelled";
}

const INCOME_CATEGORIES = ["Serviço", "Venda de peças", "Outros"];
const EXPENSE_CATEGORIES = [
  "Peças/Fornecedores",
  "Aluguel",
  "Energia",
  "Água",
  "Salários",
  "Ferramentas",
  "Marketing",
  "Outros",
];
const PAYMENT_METHODS = ["Dinheiro", "Cartão Débito", "Cartão Crédito", "PIX", "Boleto", "Outros"];

export default function FinanceiroPage() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"resumo" | "transacoes" | "pagar" | "receber">("resumo");
  const [workshopId, setWorkshopId] = useState<string | null>(null);
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [receivables, setReceivables] = useState<Receivable[]>([]);
  
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionType, setTransactionType] = useState<TransactionType>("income");
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const supabase = createClient();

  useEffect(() => {
    if (!profile?.id) return;
    loadData();
  }, [profile?.id]);

  const loadData = async () => {
    try {
      setLoading(true);

      const { data: workshop, error: workshopError } = await supabase
        .from("workshops")
        .select("id")
        .eq("profile_id", profile?.id)
        .single();

      if (workshopError) throw workshopError;
      setWorkshopId(workshop.id);

      const [transactionsRes, billsRes, receivablesRes] = await Promise.all([
        supabase
          .from("transactions")
          .select("*")
          .eq("workshop_id", workshop.id)
          .order("date", { ascending: false }),
        supabase
          .from("bills")
          .select("*")
          .eq("workshop_id", workshop.id)
          .order("due_date", { ascending: true }),
        supabase
          .from("receivables")
          .select("*")
          .eq("workshop_id", workshop.id)
          .order("due_date", { ascending: true }),
      ]);

      setTransactions(transactionsRes.data || []);
      setBills(billsRes.data || []);
      setReceivables(receivablesRes.data || []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error("Erro ao carregar dados financeiros");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      const { error } = await supabase.from("transactions").delete().eq("id", id);

      if (error) throw error;

      toast.success("Transação excluída com sucesso!");
      loadData();
    } catch (error) {
      console.error("Erro ao excluir transação:", error);
      toast.error("Erro ao excluir transação");
    }
  };

  const thisMonthTransactions = transactions.filter((t) => {
    const tDate = new Date(t.date);
    const now = new Date();
    return (
      tDate.getMonth() === now.getMonth() &&
      tDate.getFullYear() === now.getFullYear()
    );
  });

  const totalIncome = thisMonthTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = thisMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const totalReceivable = receivables
    .filter((r) => r.status === "pending")
    .reduce((sum, r) => sum + r.amount, 0);

  const getChartData = () => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);

      const monthTransactions = transactions.filter((t) => {
        const tDate = new Date(t.date);
        return tDate >= monthStart && tDate <= monthEnd;
      });

      const income = monthTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

      const expense = monthTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      months.push({
        month: format(date, "MMM/yy", { locale: ptBR }),
        Receitas: income,
        Despesas: expense,
      });
    }
    return months;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              Financeiro
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Gerencie receitas, despesas e fluxo de caixa
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setTransactionType("income");
                setShowTransactionModal(true);
              }}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all min-h-[44px]"
            >
              <ArrowUpCircle className="w-5 h-5" />
              <span className="hidden sm:inline">Nova Receita</span>
              <span className="sm:hidden">Receita</span>
            </button>
            <button
              onClick={() => {
                setTransactionType("expense");
                setShowTransactionModal(true);
              }}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all min-h-[44px]"
            >
              <ArrowDownCircle className="w-5 h-5" />
              <span className="hidden sm:inline">Nova Despesa</span>
              <span className="sm:hidden">Despesa</span>
            </button>
          </div>
        </div>
      </FadeIn>

      {/* Stats Cards */}
      <FinanceStats
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        balance={balance}
        totalReceivable={totalReceivable}
      />

      {/* Tabs */}
      <FadeIn delay={0.2}>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab("resumo")}
            className={`px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
              activeTab === "resumo"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Resumo
          </button>
          <button
            onClick={() => setActiveTab("transacoes")}
            className={`px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
              activeTab === "transacoes"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Transações
          </button>
          <button
            onClick={() => setActiveTab("pagar")}
            className={`px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
              activeTab === "pagar"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            A Pagar
          </button>
          <button
            onClick={() => setActiveTab("receber")}
            className={`px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
              activeTab === "receber"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            A Receber
          </button>
        </div>
      </FadeIn>

      {/* Tab Content */}
      {activeTab === "resumo" && (
        <>
          {/* Gráfico */}
          <FadeIn delay={0.3}>
            <GlassCard className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Fluxo de Caixa (Últimos 6 Meses)
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    formatter={(value: any) =>
                      value.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })
                    }
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="Receitas" fill="#10b981" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="Despesas" fill="#ef4444" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>
          </FadeIn>

          {/* Resumo Rápido */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FadeIn delay={0.4}>
              <GlassCard className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Últimas Transações
                </h3>
                {transactions.slice(0, 5).length > 0 ? (
                  <div className="space-y-3">
                    {transactions.slice(0, 5).map((t) => (
                      <div key={t.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${t.type === "income" ? "bg-green-100" : "bg-red-100"}`}>
                            {t.type === "income" ? (
                              <ArrowUpCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <ArrowDownCircle className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{t.description}</p>
                            <p className="text-xs text-gray-500">{format(new Date(t.date), "dd/MM/yyyy")}</p>
                          </div>
                        </div>
                        <p className={`text-sm font-bold ${t.type === "income" ? "text-green-600" : "text-red-600"}`}>
                          {t.amount.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-8">Nenhuma transação registrada</p>
                )}
              </GlassCard>
            </FadeIn>

            <FadeIn delay={0.5}>
              <GlassCard className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  Contas Pendentes
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-2">A Pagar</p>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-900">
                        {bills.filter((b) => b.status === "pending").length} contas
                      </span>
                      <span className="text-sm font-bold text-red-600">
                        {bills
                          .filter((b) => b.status === "pending")
                          .reduce((sum, b) => sum + b.amount, 0)
                          .toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-2">A Receber</p>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-900">
                        {receivables.filter((r) => r.status === "pending").length} contas
                      </span>
                      <span className="text-sm font-bold text-green-600">
                        {totalReceivable.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </FadeIn>
          </div>
        </>
      )}

      {activeTab === "transacoes" && (
        <FadeIn delay={0.2}>
          <GlassCard className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Todas as Transações</h2>
            <TransactionList
              transactions={transactions}
              onEdit={(t) => {
                setEditingTransaction(t);
                setTransactionType(t.type);
                setShowTransactionModal(true);
              }}
              onDelete={(t) => {
                if (confirm("Tem certeza que deseja excluir esta transação?")) {
                  handleDeleteTransaction(t.id);
                }
              }}
            />
          </GlassCard>
        </FadeIn>
      )}

      {activeTab === "pagar" && (
        <FadeIn delay={0.2}>
          <GlassCard className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Contas a Pagar</h2>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl flex items-center gap-2 transition-all text-sm">
                <Plus className="w-4 h-4" />
                Nova Conta
              </button>
            </div>
            <div className="text-center py-12 text-gray-500">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm">Módulo de contas a pagar em desenvolvimento</p>
              <p className="text-xs text-gray-400 mt-2">Em breve você poderá gerenciar todas as suas contas</p>
            </div>
          </GlassCard>
        </FadeIn>
      )}

      {activeTab === "receber" && (
        <FadeIn delay={0.2}>
          <GlassCard className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Contas a Receber</h2>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl flex items-center gap-2 transition-all text-sm">
                <Plus className="w-4 h-4" />
                Nova Conta
              </button>
            </div>
            <div className="text-center py-12 text-gray-500">
              <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm">Módulo de contas a receber em desenvolvimento</p>
              <p className="text-xs text-gray-400 mt-2">Em breve você poderá gerenciar todos os recebimentos</p>
            </div>
          </GlassCard>
        </FadeIn>
      )}

      {/* Modal Nova Transação */}
      <TransactionModal
        isOpen={showTransactionModal}
        onClose={() => {
          setShowTransactionModal(false);
          setEditingTransaction(null);
        }}
        workshopId={workshopId || ""}
        type={transactionType}
        onSuccess={loadData}
        editingTransaction={editingTransaction}
      />
    </div>
  );
}
