"use client";

import { FC } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { cn } from "@/lib/utils";
import { ArrowDownWideNarrow } from "lucide-react";

export interface SortOption {
  id: string;
  label: string;
}

export const SORT_OPTIONS: SortOption[] = [
  { id: "popularity.desc", label: "Most Popular" },
  { id: "vote_average.desc", label: "Top Rated" },
  { id: "release_date.desc", label: "Newest Releases" },
  { id: "vote_count.desc", label: "Most Voted" },
  { id: "release_date.asc", label: "Oldest / Classics" },
];

interface SelectSortProps {
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
  type?: "movie" | "tv";
}

const SelectSort: FC<SelectSortProps> = ({
  value = "popularity.desc",
  onValueChange,
  className,
  placeholder = "Sort By",
}) => {
  return (
    <Select
      value={value}
      onValueChange={(val) => onValueChange?.(val)}
    >
      <SelectTrigger
        className={cn(
          "bg-white/5 border-white/10 text-white/80 hover:text-white transition-colors",
          className
        )}
      >
        <div className="flex items-center gap-2 truncate">
          <ArrowDownWideNarrow className="size-3.5 text-formovies-gold shrink-0" />
          <SelectValue placeholder={placeholder} />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-formovies-surface border-white/10 text-white max-h-[300px]">
        {SORT_OPTIONS.map((opt) => (
          <SelectItem key={opt.id} value={opt.id} className="cursor-pointer">
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectSort;
