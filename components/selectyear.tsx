"use client"
import { FC } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { cn } from "@/lib/utils";

interface SelectYearProps {
    onValueChange?: (value: string) => void;
    className?: string;
}

const SelectYear: FC<SelectYearProps> = ({ onValueChange, className }) => {
    const data = ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014", "2013", "2012"];
    return (
        <Select onValueChange={(value) => onValueChange?.(value)}>
            <SelectTrigger className={cn("bg-white/5 border-white/10 text-white/70", className)}>
                <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent className="bg-formovies-surface border-white/10 text-white">
                {data?.map((year) => (
                    <SelectItem value={year} key={year}>
                        {year}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

export default SelectYear;
