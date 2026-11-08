"use client";

import { FC, useState, ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  User,
  Calendar,
  MapPin,
  Star,
  Loader2,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { PersonApiResponse } from "@/app/api/person/route";

interface PersonModalProps {
  personId: number;
  personName?: string;
  trigger?: ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const PersonModal: FC<PersonModalProps> = ({
  personId,
  personName,
  trigger,
  isOpen: controlledIsOpen,
  onOpenChange: controlledOnOpenChange,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [person, setPerson] = useState<PersonApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedBio, setExpandedBio] = useState(false);

  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const handleOpenChange = (open: boolean) => {
    if (isControlled) {
      controlledOnOpenChange?.(open);
    } else {
      setInternalIsOpen(open);
    }

    if (open && (!person || person.id !== personId)) {
      fetchPersonData(personId);
    }
  };

  const fetchPersonData = async (id: number) => {
    setLoading(true);
    setExpandedBio(false);
    try {
      const res = await axios.get<PersonApiResponse>(`/api/person?id=${id}`);
      setPerson(res.data);
    } catch (err) {
      console.warn("Failed to fetch person details:", err);
      setPerson(null);
    } finally {
      setLoading(false);
    }
  };

  // Helper to calculate age from birth/death date
  const getAgeDisplay = (birthday?: string | null, deathday?: string | null) => {
    if (!birthday) return null;
    const birthYear = new Date(birthday).getFullYear();
    const endYear = deathday ? new Date(deathday).getFullYear() : new Date().getFullYear();
    const age = endYear - birthYear;
    return deathday ? `${age} at death` : `${age} years old`;
  };

  const ageText = person ? getAgeDisplay(person.birthday, person.deathday) : null;
  const isBioLong = (person?.biography?.length || 0) > 380;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="!max-w-4xl w-[95vw] sm:w-[92vw] lg:w-[85vw] p-0 bg-[#0d0e12]/95 border-white/10 text-white rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.9)] backdrop-blur-2xl max-h-[90vh] flex flex-col">
        {loading && (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Loader2 className="size-10 animate-spin text-formovies-gold" />
            <p className="text-sm font-medium text-white/50 animate-pulse">
              Loading {personName || "biography & filmography"}...
            </p>
          </div>
        )}

        {!loading && person && (
          <div className="overflow-y-auto scrollbar-thin flex-1 p-6 sm:p-8 space-y-8">
            {/* Top Profile Header */}
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Profile Photo */}
              <div className="relative aspect-[3/4] w-32 sm:w-40 md:w-48 rounded-2xl overflow-hidden bg-formovies-deeper border border-white/10 shrink-0 shadow-xl shadow-black/40">
                {person.profile_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/h632${person.profile_path}`}
                    alt={person.name}
                    fill
                    className="object-cover"
                    sizes="192px"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-white/5 text-white/30">
                    <User className="size-12 stroke-1" />
                    <span className="text-xs mt-1">No Photo</span>
                  </div>
                )}
              </div>

              {/* Personal Info & Bio */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider bg-formovies-gold/15 text-formovies-gold border border-formovies-gold/25">
                    {person.known_for_department || "Cast & Crew"}
                  </span>

                  {person.birthday && (
                    <span className="flex items-center gap-1.5 text-xs text-white/60 bg-white/5 px-2.5 py-0.5 rounded-md">
                      <Calendar className="size-3 text-formovies-gold" />
                      {new Date(person.birthday).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                      {ageText && ` (${ageText})`}
                    </span>
                  )}

                  {person.place_of_birth && (
                    <span className="flex items-center gap-1.5 text-xs text-white/50 bg-white/5 px-2.5 py-0.5 rounded-md">
                      <MapPin className="size-3 text-white/40" />
                      {person.place_of_birth}
                    </span>
                  )}
                </div>

                <DialogHeader className="mb-3 text-left">
                  <DialogTitle className="font-display text-3xl sm:text-4xl text-white tracking-wide">
                    {person.name}
                  </DialogTitle>
                </DialogHeader>

                {person.biography ? (
                  <div className="text-xs sm:text-sm text-white/70 leading-relaxed font-body whitespace-pre-line">
                    <p>
                      {isBioLong && !expandedBio
                        ? `${person.biography.slice(0, 380)}...`
                        : person.biography}
                    </p>
                    {isBioLong && (
                      <button
                        type="button"
                        onClick={() => setExpandedBio(!expandedBio)}
                        className="mt-2 text-xs font-semibold text-formovies-gold hover:text-formovies-amber transition-colors"
                      >
                        {expandedBio ? "Show less" : "Read full biography"}
                      </button>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-white/40 italic">
                    No detailed biography available for this artist yet.
                  </p>
                )}
              </div>
            </div>

            {/* Filmography Section */}
            {person.known_for && person.known_for.length > 0 && (
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-formovies-gold" />
                    <h3 className="font-display text-xl text-white tracking-wider">
                      Known For & Notable Titles
                    </h3>
                  </div>
                  <span className="text-xs text-white/40">
                    {person.known_for.length} titles
                  </span>
                </div>

                <div className="flex items-stretch gap-3 overflow-x-auto pb-4 scrollbar-thin">
                  {person.known_for.map((item) => (
                    <Link
                      key={`filmography-${item.media_type}-${item.id}`}
                      href={`/home/watch/${item.media_type === "tv" ? "series" : "movie"}/${item.id}`}
                      onClick={() => handleOpenChange(false)}
                      className="w-28 sm:w-32 shrink-0 group flex flex-col"
                    >
                      <div className="formovies-card p-2 h-full flex flex-col justify-between hover:border-formovies-gold/40 transition-all duration-300">
                        <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-formovies-deeper mb-2">
                          <Image
                            src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="128px"
                          />

                          {/* Media Type Tag */}
                          <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider bg-black/60 text-formovies-gold border border-formovies-gold/30 backdrop-blur-sm">
                            {item.media_type === "tv" ? "TV" : "Movie"}
                          </span>

                          {/* Rating Pill */}
                          {item.vote_average > 0 && (
                            <span className="absolute top-1.5 right-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-black/60 text-formovies-gold backdrop-blur-sm">
                              <Star className="size-2.5 fill-formovies-gold" />
                              {item.vote_average.toFixed(1)}
                            </span>
                          )}
                        </div>

                        <div className="flex-1 flex flex-col justify-center px-1">
                          <h4 className="font-body text-xs font-semibold text-white/90 line-clamp-1 group-hover:text-formovies-gold transition-colors">
                            {item.title}
                          </h4>
                          {item.character && (
                            <p className="font-body text-[10px] text-white/50 line-clamp-1 mt-0.5">
                              {item.character}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PersonModal;
