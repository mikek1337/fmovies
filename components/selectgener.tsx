"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Gener } from "@/app/types/gener";
import React, { FC } from "react";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectOption,
  MultiSelectTrigger,
} from "./multiselect";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";
import { SelectItem } from "@radix-ui/react-select";
import { cn } from "@/lib/utils";
interface SelectGenerProps {
  onValueChange?: (value: string) => void;
  value?: string;
  className?: string;
}
const SelectGener:FC<SelectGenerProps> = ({onValueChange,className}) => {
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
