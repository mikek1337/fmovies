import { FC } from "react";
import { MultiSelect, MultiSelectContent, MultiSelectOption, MultiSelectTrigger } from "./multiselect"

interface SelectYearProps {
    onValueChange?: (value: string[]) => void;
}
const SelectYear:FC<SelectYearProps> = ({onValueChange}) => {
    const data = [ "2024","2023","2022","2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014", "2013", "2012"];
    return(
        <MultiSelect onValueChange={onValueChange}>
        <MultiSelectTrigger defaultText="Select Year"/>
        <MultiSelectContent >
          {data?.map((year) => (
           <MultiSelectOption key={year} value={year}>
             {year}
            </MultiSelectOption>
          ))}
        </MultiSelectContent>
      </MultiSelect>
    )
}

export default SelectYear;