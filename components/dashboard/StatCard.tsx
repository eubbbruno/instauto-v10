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
    <div className={`relative bg-white rounded-2xl p-6 border-2 ${colors.border} shadow-lg ${colors.shadow} hover:shadow-xl hover:scale-[1.02] transition-all duration-300 overflow-hidden group`}>
      {/* Background decoration */}
      <div className={`absolute top-0 right-0 w-32 h-32 ${colors.bg} rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity -mr-16 -mt-16`} />
      
      <div className="relative">
        {/* Header com ícone */}
        <div className="flex items-start justify-between mb-4">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br ${colors.gradient} shadow-lg ${colors.shadow} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
          
          {trend && (
            <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold ${
              trend.positive 
                ? "bg-green-100 text-green-700" 
                : "bg-red-100 text-red-700"
            }`}>
              {trend.positive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>

        {/* Conteúdo */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            {title}
          </p>
          
          {loading ? (
            <div className="h-12 w-32 bg-gray-200 animate-pulse rounded-lg" />
          ) : (
            <p className="text-4xl font-bold text-gray-900 tracking-tight">
              {value}
            </p>
          )}
          
          {description && (
            <p className="text-sm text-gray-600 font-medium">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
