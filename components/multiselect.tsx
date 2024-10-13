"use client"
import { cn } from "@/lib/utils";
import React, {  forwardRef, useState  } from "react";
import * as SelectPrimitive from '@radix-ui/react-select'
import { CaretSortIcon } from "@radix-ui/react-icons";
import { CheckIcon, ChevronDown, ChevronUp } from "lucide-react";


/* const MultiSelect = SelectPrimitive.Root */
let checkValue:string[] = []
interface MultiSelectProps extends React.HTMLAttributes<HTMLInputElement>{
  children: React.ReactNode,
  onValueChange?: (value: string[]) => void
}
const MultiSelect = ({children, onValueChange, ...props}:MultiSelectProps)=>{
  const [open, setOpen] = React.useState(false);
  let contentChildren:React.ReactElement[] = []; 
  const selectTrigger = React.Children.toArray(children).find((child)=>React.isValidElement(child) && child.type === MultiSelectTrigger) as React.ReactElement;
  const selectContent = React.Children.toArray(children).find((child)=>React.isValidElement(child) && child.type === MultiSelectContent) as React.ReactElement;
  const selectOption = React.Children.map(selectContent?.props.children, (child:React.ReactNode)=>{
    if(React.isValidElement(child) && child.type === MultiSelectOption){
     const newOption = React.cloneElement(child, {...child.props, fn:onValueChange});
      contentChildren.push(newOption);
    }
  }
  );
  console.log(selectOption);
  if(selectTrigger !== undefined && selectOption){
    const newTrigger = React.cloneElement(selectTrigger, {defaultText:selectTrigger.props.defaultText, open:open, setOpen:setOpen});
   // const newOption = React.cloneElement(selectOption, {...selectOption.props, fn:onValueChange});
    const newContent = React.cloneElement(selectContent, {open:open, children:contentChildren});
    return(
      <div className="relative">
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

/* const MultiSelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <CaretSortIcon className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
 */

interface MultiSelectContentProps{
  open?:boolean,
  children?:React.ReactNode
}
const MultiSelectContent =({open, children}:MultiSelectContentProps)=>{
  return(
    <div
    className={cn(
      "absolute z-10 flex items-center gap-5 bg-white  rounded-md shadow-md",
      { hidden: !open }
    )}
  >
    <div className="grid grid-cols-3 items-center gap-1 flex-wrap  w-[500px] p-2">
      {children}
      </div>
  </div>
  )
} 

/* const MultiSelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className      
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>    
)) */




const MultiSelectValue = React.forwardRef<
React.ElementRef<typeof SelectPrimitive.Value>,
React.ComponentPropsWithoutRef<typeof SelectPrimitive.Value>
>(({className, children, ...props}, ref)=>(
    <SelectPrimitive.Value ref={ref} className={cn("flex-1", className)} {...props}>
        {children}
    </SelectPrimitive.Value>        
))

MultiSelectValue.displayName = "MultiSelectValue";


interface MultiSelectOptionProps{
  value:string,
  fn?:(value:string[])=>void
}
const MultiSelectOption = ({children, value, fn}:React.PropsWithChildren<MultiSelectOptionProps>)=>{
  ;
  const onCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      checkValue.push(value);
    } else {
      checkValue = checkValue.filter((name) => name !== value);
    }
    console.log(value);
    console.log(checkValue)
    if(fn){
      fn(checkValue)
    }
  }
  return(
    <div className="flex items-center gap-2" >
              <input type="checkbox" className="rounded-md" value={value} onChange={onCheck}/>
              {children}
            </div>
  )
}
/* const MultiSelectOption = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  
   <SelectPrimitive.Item ref={ref}  {...props}>
            
            <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
            <SelectPrimitive.ItemIndicator>
              <CheckIcon className="w-5 h-5" />
            </SelectPrimitive.ItemIndicator>
  </SelectPrimitive.Item>
 
)); */

/* const MultiSelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
  >(({ className, children, ...props}, ref)=>(
    <div ref={ref} className="flex items-center gap-2">
      <input type="checkbox" className="rounded-md" {...props}/>
      {children}
    </div>
  )); */


/* MultiSelectItem.displayName = "MultiSelectItem";

MultiSelectOption.displayName = "MultiSelectOption";

MultiSelectContent.displayName = "MultiSelectContent";

MultiSelectTrigger.displayName = "MultiSelectTrigger"; */



export{
    MultiSelect,
    MultiSelectTrigger,
    MultiSelectContent,
    MultiSelectOption,
    MultiSelectValue,
   
}