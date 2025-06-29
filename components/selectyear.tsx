import { FC } from "react";
import { MultiSelect, MultiSelectContent, MultiSelectOption, MultiSelectTrigger } from "./multiselect"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { cn } from "@/lib/utils";

interface SelectYearProps {
    onValueChange?: (value: string) => void;
    className?: string;
}
const SelectYear:FC<SelectYearProps> = ({onValueChange, className}) => {
    const data = [ "2024","2023","2022","2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014", "2013", "2012"];
    return(
        <Select onValueChange={(value)=>onValueChange?.(value)}>
                    <SelectTrigger className={cn("w-1/5 bg-gray-100 p-5", className)}>
                        <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {
                        data?.map((year:string, index)=>(
                          <SelectItem value={year} key={index}  >
                            {year}
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                </Select>
    )
}

export default SelectYear;