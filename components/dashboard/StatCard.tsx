"use client";

import { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: { value: number; positive: boolean };
  color: "blue" | "green" | "yellow" | "purple" | "red" | "sky";
  loading?: boolean;
}

const colorClasses = {
  blue: {
    gradient: "from-blue-500 to-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
    text: "text-blue-600",
    shadow: "shadow-blue-500/20"
  },
  green: {
    gradient: "from-green-500 to-green-600",
    bg: "bg-green-50",
    border: "border-green-100",
    text: "text-green-600",
    shadow: "shadow-green-500/20"
  },
  yellow: {
    gradient: "from-yellow-400 to-yellow-500",
    bg: "bg-yellow-50",
    border: "border-yellow-100",
    text: "text-yellow-600",
    shadow: "shadow-yellow-500/20"
  },
  purple: {
    gradient: "from-purple-500 to-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-100",
    text: "text-purple-600",
    shadow: "shadow-purple-500/20"
  },
  red: {
    gradient: "from-red-500 to-red-600",
    bg: "bg-red-50",
    border: "border-red-100",
    text: "text-red-600",
    shadow: "shadow-red-500/20"
  },
  sky: {
    gradient: "from-sky-500 to-sky-600",
    bg: "bg-sky-50",
    border: "border-sky-100",
    text: "text-sky-600",
    shadow: "shadow-sky-500/20"
  },
};

export function StatCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  color, 
  loading 
}: StatCardProps) {
  const colors = colorClasses[color];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative bg-white/5 border border-white/8 rounded-2xl p-4 md:p-5 shadow-lg hover:shadow-xl hover:bg-white/8 transition-all duration-300 overflow-hidden group"
    >
      {/* Background decoration */}
      <motion.div
        className={`absolute top-0 right-0 w-24 h-24 ${colors.bg} rounded-full blur-3xl opacity-10 -mr-12 -mt-12`}
        animate={{ opacity: [0.1, 0.18, 0.1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative">
        {/* Header com ícone */}
        <div className="flex items-start justify-between mb-3">
          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${colors.gradient} shadow-md group-hover:scale-105 transition-transform duration-300`}>
            <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>

          {trend && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
              trend.positive
                ? "bg-green-400/10 text-green-400"
                : "bg-red-400/10 text-red-400"
            }`}>
              {trend.positive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>

        {/* Conteúdo */}
        <div className="space-y-1">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wide">
            {title}
          </p>

          {loading ? (
            <div className="h-8 md:h-10 w-24 bg-white/10 animate-pulse rounded-lg" />
          ) : (
            <p className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              {value}
            </p>
          )}

          {description && (
            <p className="text-xs text-white/40 font-medium hidden sm:block">
              {description}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
