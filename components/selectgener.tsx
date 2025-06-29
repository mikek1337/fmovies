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
    <Select onValueChange={(value) => onValueChange?.(value)} >
      <SelectTrigger className={cn("w-1/5 p-5 bg-gray-100", className)}>
        <SelectValue placeholder="Adult" className="w-1/5" />
      </SelectTrigger>
      <SelectContent>

        <SelectItem value='true'>
          True
        </SelectItem>
        <SelectItem value='false'>
          False
        </SelectItem>
      </SelectContent>
    </Select>
    /* </div> */
  );
};

export default SelectGener;
