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
interface SelectGenerProps {
  onValueChange?: (value: string[]) => void;
}
const SelectGener:FC<SelectGenerProps> = ({onValueChange}) => {
  const { data } = useQuery({
    queryKey: ["geners"],
    queryFn: async () => {
      return await (
        await axios("/api/geners")
      ).data;
    },
    retry: (failureCount, error) => {
      if (error.cause === 404) return false;
      return failureCount < 3;
    },
  });

  return (
      <MultiSelect onValueChange={onValueChange}>
        <MultiSelectTrigger defaultText="Select Gener"/>
        <MultiSelectContent >
          {data?.map((gener: Gener) => (
           <MultiSelectOption key={gener.id} value={gener.id.toString()}>
             {gener.name}
            </MultiSelectOption>
          ))}
        </MultiSelectContent>
      </MultiSelect>
    /* </div> */
  );
};

export default SelectGener;
