"use client"
import { cn } from "@/lib/utils";
import { useRef, useState, Children, ReactElement, isValidElement, cloneElement } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";



let checkValue:string[] = []
interface MultiSelectProps extends React.HTMLAttributes<HTMLInputElement>{
  children: React.ReactNode,
  onValueChange?: (value: string[]) => void
}
const MultiSelect = ({children, onValueChange, ...props}:MultiSelectProps)=>{
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line prefer-const
  let contentChildren:ReactElement[] = [];
  const selectTrigger = Children.toArray(children).find((child)=>isValidElement(child) && child.type === MultiSelectTrigger) as React.ReactElement;
  const selectContent = Children.toArray(children).find((child)=>isValidElement(child) && child.type === MultiSelectContent) as React.ReactElement;
  const selectOption = Children.map(selectContent?.props.children, (child:React.ReactNode)=>{
    if(isValidElement(child) && child.type === MultiSelectOption){
     const newOption = cloneElement(child, {...child.props, fn:onValueChange});
      contentChildren.push(newOption);
    }
  }
  );
  
  document?.addEventListener("mousedown", (e)=>{
    if(open){
     if(e.target && ref.current && !ref.current.contains(e.target as Node) ){
       setOpen(false);
     }
    }
  })
  console.log(selectOption);
  if(selectTrigger !== undefined && selectOption){
    const newTrigger = cloneElement(selectTrigger, {defaultText:selectTrigger.props.defaultText, open:open, setOpen:setOpen});
    const newContent = cloneElement(selectContent, {open:open, children:contentChildren});
    return(
      <div className="relative" ref={ref} {...props}>
        {newTrigger}
        {newContent}
        </div>
    )
  }
  return(<div className="relative">
    {children}
  </div>)
}

interface MultiSelectTriggerProps{
  defaultText?:string
  open?:boolean,
  setOpen?:React.Dispatch<React.SetStateAction<boolean>>
}
const MultiSelectTrigger = ({defaultText,open, setOpen}:MultiSelectTriggerProps)=>{
  return(
    <div
    className="flex cursor-pointer w-fit justify-between items-center border rounded-lg p-2"
    onClick={() => setOpen && setOpen(!open)}
    
  >
    <span className="line-clamp-1 max-w-[100px]">
      {defaultText}
    </span>
    {open ? (
      <ChevronUp className="w-5 h-5" />
    ) : (
      <ChevronDown className="w-5 h-5" />
    )}
  </div>
  )
}

interface MultiSelectContentProps{
  open?:boolean,
  children?:React.ReactNode
}
const MultiSelectContent =({open, children}:MultiSelectContentProps)=>{
  return(
    <div
    className={cn(
      "absolute z-10 flex items-center gap-5 bg-white transition-all duration-150  ease-in-out opacity-100  rounded-md shadow-md max-h-[200px]",
      { "opacity-0 -z-0": !open }
    )}
  >
    <div className="grid grid-cols-3 items-center gap-1 flex-wrap  w-[500px] p-2">
      {children}
      </div>
  </div>
  )
} 


interface MultiSelectOptionProps{
  value:string,
  fn?:(value:string[])=>void
}
const MultiSelectOption = ({children, value, fn}:React.PropsWithChildren<MultiSelectOptionProps>)=>{
  ;
  const onCheck = (e: CheckedState) => {
    if (e) {
      checkValue.push(value);
    } else {
      checkValue = checkValue.filter((name) => name !== value);
    }
    
    if(fn){
      fn(checkValue)
    }
  }
  return(
    <div className="flex items-center gap-2" >
            <Checkbox value={value} onCheckedChange={onCheck}/>
              {children}
            </div>
  )
}

export{
    MultiSelect,
    MultiSelectTrigger,
    MultiSelectContent,
    MultiSelectOption,
   
}