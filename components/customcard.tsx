import { cn } from "@/lib/utils";
import Image from "next/image";
import { FC } from "react";
import { buttonVariants } from "./ui/button";
import Link from "next/link";
import { Play } from "lucide-react";

type CustomCardProps = {
    title: string;
    overview: string;
    image: string;
    id: string;
    mediaType: string;
    className?: string;
    hasBtn?: boolean;
    children?: React.ReactNode;
};

const CustomCard: FC<CustomCardProps> = ({ title, overview, image, id, mediaType, className, hasBtn, children }) => {
    return (
        <div className={cn("formovies-card group", className)} key={`copy${id}`}>
            <div className="aspect-[2/3] relative overflow-hidden">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-formovies-dark via-transparent to-transparent" />
                <span className="absolute top-3 left-3 px-2 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-formovies-gold/20 text-formovies-gold border border-formovies-gold/30 backdrop-blur-sm">
                    {mediaType === "tv" ? "Series" : "Movie"}
                </span>

                {hasBtn && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="size-14 rounded-full bg-formovies-gold/90 flex items-center justify-center backdrop-blur-sm transform scale-75 group-hover:scale-100 transition-transform duration-500">
                            <Play className="size-6 text-formovies-dark fill-current ml-0.5" />
                        </div>
                    </div>
                )}
            </div>
            <div className="p-4">
                <h3 className="font-body text-sm font-semibold text-white/90 line-clamp-1 group-hover:text-formovies-gold transition-colors duration-300">
                    {title}
                </h3>
                <p className="text-xs text-white/40 line-clamp-2 mt-1.5 leading-relaxed">{overview}</p>
            </div>
            {children && <div className="px-4 pb-4 flex flex-col gap-2">{children}</div>}
            {hasBtn && (
                <div className="px-4 pb-4">
                    <Link
                        className={cn(
                            buttonVariants({ variant: "default" }),
                            "w-full bg-formovies-gold text-formovies-dark hover:bg-formovies-amber font-semibold"
                        )}
                        href={`/home/watch/${mediaType === "tv" ? "series" : "movie"}/${id}`}
                    >
                        <Play className="size-4 fill-current" />
                        Resume
                    </Link>
                </div>
            )}
        </div>
    );
};

export default CustomCard;
