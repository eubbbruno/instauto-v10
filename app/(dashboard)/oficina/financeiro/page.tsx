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
import BillModal from "@/components/financeiro/BillModal";
import ReceivableModal from "@/components/financeiro/ReceivableModal";

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

  const [showBillModal, setShowBillModal] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);

  const [showReceivableModal, setShowReceivableModal] = useState(false);
  const [editingReceivable, setEditingReceivable] = useState<Receivable | null>(null);

  const [filterType, setFilterType] = useState<"all" | TransactionType>("all");
  const [filterPeriod, setFilterPeriod] = useState<"today" | "week" | "month" | "all">("month");
  const [filterCategory, setFilterCategory] = useState<string>("all");

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

  const handleMarkBillAsPaid = async (bill: Bill) => {
    try {
      const { error } = await supabase
        .from("bills")
        .update({
          status: "paid",
          paid_date: new Date().toISOString().split("T")[0],
        })
        .eq("id", bill.id);

      if (error) throw error;

      toast.success("Conta marcada como paga!");
      loadData();
    } catch (error) {
      console.error("Erro ao marcar conta como paga:", error);
      toast.error("Erro ao atualizar conta");
    }
  };

  const handleDeleteBill = async (id: string) => {
    try {
      const { error } = await supabase.from("bills").delete().eq("id", id);

      if (error) throw error;

      toast.success("Conta excluída com sucesso!");
      loadData();
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
      toast.error("Erro ao excluir conta");
    }
  };

  const handleMarkReceivableAsReceived = async (receivable: Receivable) => {
    try {
      const { error } = await supabase
        .from("receivables")
        .update({
          status: "received",
          received_date: new Date().toISOString().split("T")[0],
        })
        .eq("id", receivable.id);

      if (error) throw error;

      toast.success("Conta marcada como recebida!");
      loadData();
    } catch (error) {
      console.error("Erro ao marcar conta como recebida:", error);
      toast.error("Erro ao atualizar conta");
    }
  };

  const handleDeleteReceivable = async (id: string) => {
    try {
      const { error } = await supabase.from("receivables").delete().eq("id", id);

      if (error) throw error;

      toast.success("Conta excluída com sucesso!");
      loadData();
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
      toast.error("Erro ao excluir conta");
    }
  };

  const getFilteredTransactions = () => {
    let filtered = [...transactions];

    if (filterType !== "all") {
      filtered = filtered.filter((t) => t.type === filterType);
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter((t) => t.category === filterCategory);
    }

    const now = new Date();
    if (filterPeriod === "today") {
      filtered = filtered.filter((t) => {
        const tDate = new Date(t.date);
        return tDate.toDateString() === now.toDateString();
      });
    } else if (filterPeriod === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter((t) => new Date(t.date) >= weekAgo);
    } else if (filterPeriod === "month") {
      filtered = filtered.filter((t) => {
        const tDate = new Date(t.date);
        return (
          tDate.getMonth() === now.getMonth() &&
          tDate.getFullYear() === now.getFullYear()
        );
      });
    }

    return filtered;
  };

  const isOverdue = (dueDate: string, status: string) => {
    if (status === "paid" || status === "received") return false;
    return new Date(dueDate) < new Date();
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
        <>
          {/* Filtros */}
          <FadeIn delay={0.2}>
            <GlassCard className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Tipo
                  </label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Todos</option>
                    <option value="income">Receitas</option>
                    <option value="expense">Despesas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Período
                  </label>
                  <select
                    value={filterPeriod}
                    onChange={(e) => setFilterPeriod(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="today">Hoje</option>
                    <option value="week">Últimos 7 dias</option>
                    <option value="month">Este mês</option>
                    <option value="all">Todos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Categoria
                  </label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Todas</option>
                    <optgroup label="Receitas">
                      {["Serviço", "Venda de peças", "Outros"].map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Despesas">
                      {[
                        "Peças/Fornecedores",
                        "Aluguel",
                        "Energia",
                        "Água",
                        "Salários",
                        "Ferramentas",
                        "Marketing",
                        "Outros",
                      ].map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>
            </GlassCard>
          </FadeIn>

          <FadeIn delay={0.3}>
            <GlassCard className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                Transações ({getFilteredTransactions().length})
              </h2>
              <TransactionList
                transactions={getFilteredTransactions()}
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
        </>
      )}

      {activeTab === "pagar" && (
        <FadeIn delay={0.2}>
          <GlassCard className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Contas a Pagar ({bills.filter((b) => b.status === "pending").length})
              </h2>
              <button
                onClick={() => setShowBillModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl flex items-center gap-2 transition-all text-sm min-h-[44px]"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Nova Conta</span>
              </button>
            </div>

            {bills.length > 0 ? (
              <div className="space-y-2">
                {bills.map((bill) => {
                  const overdue = isOverdue(bill.due_date, bill.status);
                  return (
                    <div
                      key={bill.id}
                      className={`p-4 rounded-xl transition-colors ${
                        bill.status === "paid"
                          ? "bg-green-50 border border-green-200"
                          : overdue
                          ? "bg-red-50 border border-red-200"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="text-sm font-bold text-gray-900">{bill.description}</p>
                            {bill.status === "paid" ? (
                              <span className="px-2 py-0.5 bg-green-600 text-white text-xs font-medium rounded-full">
                                Pago
                              </span>
                            ) : overdue ? (
                              <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-medium rounded-full">
                                Vencido
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-yellow-600 text-white text-xs font-medium rounded-full">
                                Pendente
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600 flex-wrap">
                            {bill.supplier && (
                              <>
                                <span>{bill.supplier}</span>
                                <span>•</span>
                              </>
                            )}
                            <span>Vencimento: {format(new Date(bill.due_date), "dd/MM/yyyy", { locale: ptBR })}</span>
                            {bill.paid_date && (
                              <>
                                <span>•</span>
                                <span>Pago em: {format(new Date(bill.paid_date), "dd/MM/yyyy", { locale: ptBR })}</span>
                              </>
                            )}
                            {bill.category && (
                              <>
                                <span>•</span>
                                <span>{bill.category}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="text-base font-bold text-red-600 whitespace-nowrap">
                            {bill.amount.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </p>
                          {bill.status === "pending" && (
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleMarkBillAsPaid(bill)}
                                className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                                title="Marcar como pago"
                              >
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingBill(bill);
                                  setShowBillModal(true);
                                }}
                                className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                                title="Editar"
                              >
                                <Edit className="w-4 h-4 text-blue-600" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm("Tem certeza que deseja excluir esta conta?")) {
                                    handleDeleteBill(bill.id);
                                  }
                                }}
                                className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                                title="Excluir"
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm">Nenhuma conta a pagar cadastrada</p>
                <p className="text-xs text-gray-400 mt-2">Clique em "Nova Conta" para adicionar</p>
              </div>
            )}
          </GlassCard>
        </FadeIn>
      )}

      {activeTab === "receber" && (
        <FadeIn delay={0.2}>
          <GlassCard className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Contas a Receber ({receivables.filter((r) => r.status === "pending").length})
              </h2>
              <button
                onClick={() => setShowReceivableModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl flex items-center gap-2 transition-all text-sm min-h-[44px]"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Nova Conta</span>
              </button>
            </div>

            {receivables.length > 0 ? (
              <div className="space-y-2">
                {receivables.map((receivable) => {
                  const overdue = isOverdue(receivable.due_date, receivable.status);
                  return (
                    <div
                      key={receivable.id}
                      className={`p-4 rounded-xl transition-colors ${
                        receivable.status === "received"
                          ? "bg-green-50 border border-green-200"
                          : overdue
                          ? "bg-red-50 border border-red-200"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="text-sm font-bold text-gray-900">{receivable.description}</p>
                            {receivable.status === "received" ? (
                              <span className="px-2 py-0.5 bg-green-600 text-white text-xs font-medium rounded-full">
                                Recebido
                              </span>
                            ) : overdue ? (
                              <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-medium rounded-full">
                                Vencido
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-yellow-600 text-white text-xs font-medium rounded-full">
                                Pendente
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600 flex-wrap">
                            {receivable.client_name && (
                              <>
                                <span>{receivable.client_name}</span>
                                <span>•</span>
                              </>
                            )}
                            <span>Vencimento: {format(new Date(receivable.due_date), "dd/MM/yyyy", { locale: ptBR })}</span>
                            {receivable.received_date && (
                              <>
                                <span>•</span>
                                <span>Recebido em: {format(new Date(receivable.received_date), "dd/MM/yyyy", { locale: ptBR })}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="text-base font-bold text-green-600 whitespace-nowrap">
                            {receivable.amount.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </p>
                          {receivable.status === "pending" && (
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleMarkReceivableAsReceived(receivable)}
                                className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                                title="Marcar como recebido"
                              >
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingReceivable(receivable);
                                  setShowReceivableModal(true);
                                }}
                                className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                                title="Editar"
                              >
                                <Edit className="w-4 h-4 text-blue-600" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm("Tem certeza que deseja excluir esta conta?")) {
                                    handleDeleteReceivable(receivable.id);
                                  }
                                }}
                                className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                                title="Excluir"
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm">Nenhuma conta a receber cadastrada</p>
                <p className="text-xs text-gray-400 mt-2">Clique em "Nova Conta" para adicionar</p>
              </div>
            )}
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

      {/* Modal Conta a Pagar */}
      <BillModal
        isOpen={showBillModal}
        onClose={() => {
          setShowBillModal(false);
          setEditingBill(null);
        }}
        workshopId={workshopId || ""}
        onSuccess={loadData}
        editingBill={editingBill}
      />

      {/* Modal Conta a Receber */}
      <ReceivableModal
        isOpen={showReceivableModal}
        onClose={() => {
          setShowReceivableModal(false);
          setEditingReceivable(null);
        }}
        workshopId={workshopId || ""}
        onSuccess={loadData}
        editingReceivable={editingReceivable}
      />
    </div>
  );
}
