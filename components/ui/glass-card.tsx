"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "highlighted";
  hover?: boolean;
  onClick?: () => void;
}

const variantStyles = {
  default: "bg-white/80 backdrop-blur-sm border border-gray-100",
  elevated: "bg-white/90 backdrop-blur-md border border-gray-200 shadow-lg",
  highlighted: "bg-gradient-to-br from-blue-50/90 to-white/90 backdrop-blur-md border border-blue-200/50",
};

export function GlassCard({ 
  children, 
  className = "", 
  variant = "default",
  hover = false,
  onClick 
}: GlassCardProps) {
  const baseStyles = "rounded-2xl transition-all duration-300";
  const hoverStyles = hover ? "hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-200/50 cursor-pointer" : "";
  
  if (hover) {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={cn(
          baseStyles,
          variantStyles[variant],
          hoverStyles,
          className
        )}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className={cn(
        baseStyles,
        variantStyles[variant],
        hoverStyles,
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
