"use client";
import React, { FC, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { cn } from "@/lib/utils";
import { FALLBACK_MOVIE_GENRES, FALLBACK_TV_GENRES } from "@/lib/tmdb";
import { Gener } from "@/app/types/gener";
import axios from "axios";

interface SelectGenerProps {
  type?: "movie" | "tv";
  onValueChange?: (value: string) => void;
  value?: string;
  className?: string;
  placeholder?: string;
}

const SelectGener: FC<SelectGenerProps> = ({
  type = "movie",
  onValueChange,
  value,
  className,
  placeholder = "Select Genre",
}) => {
  const initialGenres =
    type === "tv" ? FALLBACK_TV_GENRES : FALLBACK_MOVIE_GENRES;
  const [genres, setGenres] = useState<Gener[]>(initialGenres);

  useEffect(() => {
    // Attempt to fetch fresh genres from TMDB API route, falling back to static list
    axios
      .get<Gener[]>(`/api/geners?type=${type}`)
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setGenres(res.data);
        }
      })
      .catch(() => {
        // Fallback is already loaded
      });
  }, [type]);

  return (
    <Select
      value={value}
      onValueChange={(val) => onValueChange?.(val === "all" ? "" : val)}
    >
      <SelectTrigger
        className={cn("bg-white/5 border-white/10 text-white/70", className)}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-formovies-surface border-white/10 text-white max-h-[300px]">
        <SelectItem value="all">All Genres</SelectItem>
        {genres.map((genre) => (
          <SelectItem key={genre.id} value={genre.id.toString()}>
            {genre.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectGener;
