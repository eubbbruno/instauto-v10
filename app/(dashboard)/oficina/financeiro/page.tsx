"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Transaction, TransactionType } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PlanGuard from "@/components/auth/PlanGuard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import {
  Loader2,
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Edit,
  Trash2,
  ArrowUpCircle,
  ArrowDownCircle,
  Filter,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";

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
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [workshopId, setWorkshopId] = useState<string | null>(null);

  // Filtros
  const [filterType, setFilterType] = useState<"all" | TransactionType>("all");
  const [filterPeriod, setFilterPeriod] = useState<"today" | "week" | "month" | "year" | "custom">("month");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  // Modal states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    type: "income" as TransactionType,
    category: "",
    description: "",
    amount: 0,
    payment_method: "",
    date: format(new Date(), "yyyy-MM-dd"),
    notes: "",
  });

  const supabase = createClient();

  const loadWorkshopAndTransactions = async (signal?: AbortSignal) => {
    try {
      setLoading(true);

      let query1 = supabase
        .from("workshops")
        .select("id")
        .eq("profile_id", profile?.id);

      if (signal) query1 = query1.abortSignal(signal);

      const { data: workshop, error: workshopError } = await query1.single();

      if (workshopError) throw workshopError;
      setWorkshopId(workshop.id);

      let query2 = supabase
        .from("transactions")
        .select("*")
        .eq("workshop_id", workshop.id);

      if (signal) query2 = query2.abortSignal(signal);

      const { data: transactionsData, error: transactionsError } = await query2
        .order("date", { ascending: false })
        .order("created_at", { ascending: false });

      if (transactionsError) throw transactionsError;
      setTransactions(transactionsData || []);
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error("Erro ao carregar transações:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar as transações.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!profile?.id) return;

    const abortController = new AbortController();
    let mounted = true;

    const load = async () => {
      if (mounted) {
        await loadWorkshopAndTransactions(abortController.signal);
      }
    };

    load();

    return () => {
      mounted = false;
      abortController.abort();
    };
  }, [profile?.id]);

  useEffect(() => {
    filterTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType, filterPeriod, filterCategory, customStartDate, customEndDate, transactions]);

  const filterTransactions = () => {
    let filtered = [...transactions];

    // Filtro por tipo
    if (filterType !== "all") {
      filtered = filtered.filter((t) => t.type === filterType);
    }

    // Filtro por categoria
    if (filterCategory !== "all") {
      filtered = filtered.filter((t) => t.category === filterCategory);
    }

    // Filtro por período
    const now = new Date();
    let startDate: Date;
    let endDate: Date = now;

    switch (filterPeriod) {
      case "today":
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case "week":
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case "month":
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      case "year":
        startDate = startOfYear(now);
        endDate = endOfYear(now);
        break;
      case "custom":
        if (customStartDate && customEndDate) {
          startDate = new Date(customStartDate);
          endDate = new Date(customEndDate);
        } else {
          setFilteredTransactions(filtered);
          return;
        }
        break;
      default:
        startDate = startOfMonth(now);
    }

    filtered = filtered.filter((t) => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });

    setFilteredTransactions(filtered);
  };

  const openCreateDialog = (type: TransactionType) => {
    setEditingTransaction(null);
    setFormData({
      type,
      category: type === "income" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0],
      description: "",
      amount: 0,
      payment_method: PAYMENT_METHODS[0],
      date: format(new Date(), "yyyy-MM-dd"),
      notes: "",
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      type: transaction.type,
      category: transaction.category || "",
      description: transaction.description,
      amount: transaction.amount,
      payment_method: transaction.payment_method || "",
      date: transaction.date,
      notes: transaction.notes || "",
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.description.trim() || formData.amount <= 0) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Preencha descrição e valor válido.",
      });
      return;
    }

    if (!workshopId) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "ID da oficina não encontrado.",
      });
      return;
    }

    setSaving(true);
    try {
      if (editingTransaction) {
        const { error } = await supabase
          .from("transactions")
          .update({
            type: formData.type,
            category: formData.category,
            description: formData.description.trim(),
            amount: formData.amount,
            payment_method: formData.payment_method || null,
            date: formData.date,
            notes: formData.notes.trim() || null,
          })
          .eq("id", editingTransaction.id);

        if (error) throw error;

        toast({
          title: "Sucesso!",
          description: "Transação atualizada com sucesso.",
        });
      } else {
        const { error } = await supabase.from("transactions").insert({
          workshop_id: workshopId,
          type: formData.type,
          category: formData.category,
          description: formData.description.trim(),
          amount: formData.amount,
          payment_method: formData.payment_method || null,
          date: formData.date,
          notes: formData.notes.trim() || null,
        });

        if (error) throw error;

        toast({
          title: "Sucesso!",
          description: "Transação cadastrada com sucesso.",
        });
      }

      setIsDialogOpen(false);
      loadWorkshopAndTransactions();
    } catch (error) {
      console.error("Erro ao salvar transação:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar a transação.",
      });
    } finally {
      setSaving(false);
    }
  };

  const openDeleteDialog = (transaction: Transaction) => {
    setDeletingTransaction(transaction);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingTransaction) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", deletingTransaction.id);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Transação removida com sucesso.",
      });

      setIsDeleteDialogOpen(false);
      loadWorkshopAndTransactions();
    } catch (error) {
      console.error("Erro ao deletar transação:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível remover a transação.",
      });
    } finally {
      setSaving(false);
    }
  };

  // Calcular totais
  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // Dados para o gráfico (últimos 6 meses)
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
    <PlanGuard>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="space-y-6 sm:space-y-8">
          {/* Header Premium */}
          <div className="mb-6 sm:mb-8">
            <p className="text-xs sm:text-sm text-gray-500 mb-1">Dashboard / Financeiro</p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Financeiro</h1>
                <div className="flex items-center gap-3 flex-wrap">
                  <p className="text-gray-600">Gerencie receitas e despesas da oficina</p>
                  <Badge className={`${balance >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} text-sm font-medium px-3 py-1 rounded-full`}>
                    Saldo: {balance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => openCreateDialog("income")}
                  className="flex-1 sm:flex-none px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <ArrowUpCircle className="w-5 h-5" />
                  Receita
                </button>
                <button
                  onClick={() => openCreateDialog("expense")}
                  className="flex-1 sm:flex-none px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <ArrowDownCircle className="w-5 h-5" />
                  Despesa
                </button>
              </div>
            </div>
          </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-gray-600">
                Receitas
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {totalIncome.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {filteredTransactions.filter((t) => t.type === "income").length} transações
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-gray-600">
                Despesas
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {totalExpense.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {filteredTransactions.filter((t) => t.type === "expense").length} transações
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-gray-600">
                Saldo do Período
              </CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${balance >= 0 ? "text-blue-600" : "text-red-600"}`}>
                {balance.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {balance >= 0 ? "Positivo" : "Negativo"}
              </p>
            </CardContent>
          </Card>
        </div>

          {/* Gráfico Premium */}
          <Card className="border-2 border-green-100 shadow-2xl hover:shadow-green-200/50 transition-all duration-300 overflow-hidden">
            <CardHeader className="border-b-2 border-green-100 bg-gradient-to-r from-green-50 via-emerald-50 to-green-50/50 py-6">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-gray-900">Receitas vs Despesas (Últimos 6 Meses)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value) =>
                    (value || 0).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })
                  }
                />
                <Legend />
                <Bar dataKey="Receitas" fill="#10B981" />
                <Bar dataKey="Despesas" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

          {/* Filtros Premium */}
          <Card className="border-2 shadow-lg">
            <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-green-50/30">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Filter className="h-5 w-5 text-green-600" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label>Tipo</Label>
                <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="income">Receitas</SelectItem>
                    <SelectItem value="expense">Despesas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Período</Label>
                <Select value={filterPeriod} onValueChange={(value: any) => setFilterPeriod(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Hoje</SelectItem>
                    <SelectItem value="week">Última Semana</SelectItem>
                    <SelectItem value="month">Este Mês</SelectItem>
                    <SelectItem value="year">Este Ano</SelectItem>
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {filterPeriod === "custom" && (
                <>
                  <div>
                    <Label>Data Início</Label>
                    <Input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Data Fim</Label>
                    <Input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                    />
                  </div>
                </>
              )}

              <div>
                <Label>Categoria</Label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {[...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES].map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

          {/* Tabela de Transações Premium */}
          {filteredTransactions.length === 0 ? (
            <Card className="border-2 shadow-xl bg-gradient-to-br from-white to-gray-50">
              <CardContent className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center">
                  <DollarSign className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Nenhuma transação encontrada
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Comece adicionando uma receita ou despesa para controlar suas finanças
                </p>
                <div className="flex gap-3 justify-center">
                  <Button 
                    onClick={() => openCreateDialog("income")}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 font-bold shadow-lg shadow-green-600/30 hover:scale-105 transition-transform"
                    size="lg"
                  >
                    <ArrowUpCircle className="mr-2 h-5 w-5" />
                    Nova Receita
                  </Button>
                  <Button 
                    onClick={() => openCreateDialog("expense")}
                    className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 font-bold shadow-lg shadow-red-600/30 hover:scale-105 transition-transform"
                    size="lg"
                  >
                    <ArrowDownCircle className="mr-2 h-5 w-5" />
                    Nova Despesa
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-2 border-green-100 shadow-2xl hover:shadow-green-200/50 transition-all duration-300 overflow-hidden">
              <CardHeader className="border-b-2 border-green-100 bg-gradient-to-r from-green-50 via-emerald-50 to-green-50/50 py-6">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <span className="font-bold text-gray-900">Transações</span>
                  <Badge className="ml-auto bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 text-base px-4 py-2 shadow-lg">
                    {filteredTransactions.length} {filteredTransactions.length === 1 ? "transação" : "transações"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-gray-50 to-green-50/30 border-b-2 border-green-100">
                        <TableHead className="font-bold text-gray-900 text-base py-4">Data</TableHead>
                        <TableHead className="font-bold text-gray-900 text-base py-4">Tipo</TableHead>
                        <TableHead className="font-bold text-gray-900 text-base py-4">Categoria</TableHead>
                        <TableHead className="font-bold text-gray-900 text-base py-4">Descrição</TableHead>
                        <TableHead className="font-bold text-gray-900 text-base py-4">Método</TableHead>
                        <TableHead className="text-right font-bold text-gray-900 text-base py-4">Valor</TableHead>
                        <TableHead className="text-right font-bold text-gray-900 text-base py-4">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.map((transaction, index) => (
                        <TableRow 
                          key={transaction.id}
                          className="group hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50/30 transition-all duration-300 border-b border-gray-100 hover:border-green-200"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <TableCell className="font-medium text-gray-900 py-4">
                            {format(new Date(transaction.date), "dd/MM/yyyy", { locale: ptBR })}
                          </TableCell>
                          <TableCell className="py-4">
                            {transaction.type === "income" ? (
                              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 px-3 py-1.5 text-sm font-bold shadow-lg shadow-green-500/40">
                                <ArrowUpCircle className="h-4 w-4 mr-1" />
                                Receita
                              </Badge>
                            ) : (
                              <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 px-3 py-1.5 text-sm font-bold shadow-lg shadow-red-500/40">
                                <ArrowDownCircle className="h-4 w-4 mr-1" />
                                Despesa
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="py-4">
                            <Badge className="bg-gray-100 text-gray-800 border-gray-300 font-medium">
                              {transaction.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-bold text-gray-900 py-4 group-hover:text-green-700 transition-colors">
                            {transaction.description}
                          </TableCell>
                          <TableCell className="text-gray-600 py-4 font-medium group-hover:text-gray-900 transition-colors">
                            {transaction.payment_method || "-"}
                          </TableCell>
                          <TableCell className={`text-right font-bold py-4 text-base ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                            {transaction.amount.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </TableCell>
                          <TableCell className="text-right py-4">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditDialog(transaction)}
                                className="hover:bg-blue-500 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/50"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openDeleteDialog(transaction)}
                                className="hover:bg-red-500 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-500/50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

        {/* Dialog Criar/Editar */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingTransaction ? "Editar Transação" : `Nova ${formData.type === "income" ? "Receita" : "Despesa"}`}
              </DialogTitle>
              <DialogDescription>
                {editingTransaction
                  ? "Atualize as informações da transação"
                  : `Cadastre uma nova ${formData.type === "income" ? "receita" : "despesa"}`}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="type">Tipo *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: TransactionType) => {
                    setFormData({
                      ...formData,
                      type: value,
                      category: value === "income" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0],
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Receita</SelectItem>
                    <SelectItem value="expense">Despesa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="category">Categoria *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(formData.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="payment_method">Método de Pagamento</Label>
                <Select value={formData.payment_method} onValueChange={(value) => setFormData({ ...formData, payment_method: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Label htmlFor="description">Descrição *</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ex: Serviço de troca de óleo"
                />
              </div>

              <div>
                <Label htmlFor="amount">Valor (R$) *</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div>
                <Label htmlFor="date">Data *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Informações adicionais..."
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={saving}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

          {/* Dialog Deletar */}
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar Exclusão</DialogTitle>
                <DialogDescription>
                  Tem certeza que deseja remover a transação <strong>{deletingTransaction?.description}</strong>?
                  Esta ação não pode ser desfeita.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={saving}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={handleDelete} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Removendo...
                    </>
                  ) : (
                    "Remover"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </PlanGuard>
  );
}

