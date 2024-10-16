import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { FC, PropsWithChildren } from "react";
interface FlipProps {
  children: React.ReactNode;
}
const Flip: FC<FlipProps> = ({ children }) => {
  return (
    <div className="w-full flex items-center justify-between ">
        <div className="rounded-full shadow-md">
            <ChevronLeft className="w-5 h-5" />
        </div>
      <div className="flex items-center gap-1">{children}</div>
      <div className="rounded-full shadow-md">
        <ChevronRight className="w-5 h-5" />
      </div>
    </div>
  );
};
interface FlipFrontProps {
    image:string,
    title:string,
}
const FlipFront: FC<FlipFrontProps> = ({image, title}) => {
  return (
    <div className="relative w-[300px] h-[300px] skew-y-12 ">
      <div className="w-full h-full">
        <div className="absolute w-full h-full shadow-lg">
            <Image src={image} alt={title} className="w-full h-full" width={500} height={500} />
          <h1 className="text-center">{title}</h1>
        </div>
      </div>
    </div>
  );
};

export { Flip, FlipFront };
