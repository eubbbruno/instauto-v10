import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  iconColor?: string;
  iconBgColor?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  iconColor = "text-gray-400",
  iconBgColor = "bg-gray-100",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {/* Ícone */}
      <div className={`w-20 h-20 ${iconBgColor} rounded-2xl flex items-center justify-center mb-6`}>
        <Icon className={`w-10 h-10 ${iconColor}`} />
      </div>

      {/* Título */}
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        {title}
      </h3>

      {/* Descrição */}
      <p className="text-gray-600 max-w-md mb-6">
        {description}
      </p>

      {/* Ação */}
      {(actionLabel && (actionHref || onAction)) && (
        <>
          {actionHref ? (
            <Link
              href={actionHref}
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-sm"
            >
              {actionLabel}
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-sm"
            >
              {actionLabel}
            </button>
          )}
        </>
      )}
    </div>
  );
}
