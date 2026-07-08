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
  default: "bg-white border border-[#0B1120]/8 shadow-sm",
  elevated: "bg-white border border-[#0B1120]/8 shadow-md",
  highlighted: "bg-gradient-to-br from-blue-50 to-white border border-[#1e3a8a]/15",
};

export function GlassCard({ 
  children, 
  className = "", 
  variant = "default",
  hover = false,
  onClick 
}: GlassCardProps) {
  const baseStyles = "rounded-2xl transition-all duration-300";
  const hoverStyles = hover ? "hover:shadow-md hover:border-[#1e3a8a]/20 cursor-pointer" : "";
  
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
