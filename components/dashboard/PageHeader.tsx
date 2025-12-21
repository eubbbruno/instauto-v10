import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-10">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-heading font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent leading-tight">
          {title}
        </h1>
        {description && (
          <div className="text-gray-600 text-sm md:text-base leading-relaxed">{description}</div>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

