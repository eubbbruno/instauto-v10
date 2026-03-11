import { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

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
    <div className={`relative bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl p-4 md:p-5 shadow-lg ${colors.shadow} hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group`}>
      {/* Background decoration */}
      <div className={`absolute top-0 right-0 w-24 h-24 ${colors.bg} rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-opacity -mr-12 -mt-12`} />
      
      <div className="relative">
        {/* Header com ícone */}
        <div className="flex items-start justify-between mb-3">
          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${colors.gradient} shadow-md ${colors.shadow} group-hover:scale-105 transition-transform duration-300`}>
            <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          
          {trend && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
              trend.positive 
                ? "bg-green-100 text-green-700" 
                : "bg-red-100 text-red-700"
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
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {title}
          </p>
          
          {loading ? (
            <div className="h-8 md:h-10 w-24 bg-gray-200 animate-pulse rounded-lg" />
          ) : (
            <p className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              {value}
            </p>
          )}
          
          {description && (
            <p className="text-xs text-gray-600 font-medium hidden sm:block">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
