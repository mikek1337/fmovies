'use client'
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import React, { Children, cloneElement, FC, isValidElement, ReactElement, useEffect, useState } from "react";
interface FlipProps {
  children: React.ReactNode;
}
const Flip: FC<FlipProps> = ({ children }) => {
    const [newChildren, setNewChildren] = useState<React.ReactNode[]>([]);
    const filpChildren = Children.toArray(children);
    const [current, setCurrent] = useState(0);
    const totalChildren = filpChildren.length;
    useEffect(()=>{
        filpChildren.map((child:React.ReactNode, index) => {
            if(isValidElement(child)){
                let newChild
            if (index == current) {
                newChild = cloneElement(child, { className: "scale-125", ...child.props });
            }
            else{
                 newChild = cloneElement(child, { className: "scale-50", ...child.props });
            }
            setNewChildren((prev)=>[...prev, newChild]);
            console.log(newChildren );
        }
        })
    },[current])
    const handleNext = () => {
        console.log(current);
        setNewChildren([]);
        if(current <= totalChildren){
            setCurrent(prev=>prev + 1);
            console.log(current);
       /*      filpChildren.map((child, index) => {
                if(isValidElement(child)){
                    let newChild
                if (index == current) {
                    newChild = cloneElement(child as React.ReactElement<any>, { className: "scale-100", ...child.props });
                }
                else{
                     newChild = cloneElement(child as React.ReactElement<any>, { className: "scale-50", ...child.props });
                }
                newChildren.push(newChild as React.ReactNode);
                
            }
            }) */
        }
        else{
            setCurrent(0);
        }
    }
    
  return (
    <div className="w-full flex items-center justify-around ">
        <div className="rounded-full border">
            <ChevronLeft className="w-5 h-5" />
        </div>
      <div className="flex items-center gap-1">{
            newChildren
        }</div>
      <div className="rounded-full border" onClick={handleNext}>
        <ChevronRight className="w-5 h-5" />
      </div>
    </div>
  );
};
interface FlipFrontProps {
    image: string;
    title: string;
    className?: string;
}
const FlipFront: FC<FlipFrontProps> = ({image, title, ...props}) => {
  return (
    <div className={`border relative w-[300px] h-[400px] hover:shadow-2xl hover:translate-z-10 transition-transform rounded-md  ${props.className || ''}`}>
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
