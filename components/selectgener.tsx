"use client";
import React, { FC } from "react";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "./ui/select";
import { cn } from "@/lib/utils";

interface SelectGenerProps {
  onValueChange?: (value: string) => void;
  value?: string;
  className?: string;
}

const SelectGener: FC<SelectGenerProps> = ({ onValueChange, className }) => {
  return (
    <Select onValueChange={(value) => onValueChange?.(value)}>
      <SelectTrigger className={cn("bg-white/5 border-white/10 text-white/70", className)}>
        <SelectValue placeholder="Content Rating" />
      </SelectTrigger>
      <SelectContent className="bg-formovies-surface border-white/10 text-white">
        <SelectItem value="true">Adult (18+)</SelectItem>
        <SelectItem value="false">All Ages</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default SelectGener;
