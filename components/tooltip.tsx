import { FC } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
interface ToolTipProps{
    children: React.ReactNode;
    text: string;
}
const ToolTip:FC<ToolTipProps> = ({ children, text }) => {
    return(
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent>
                    <p>{text}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export default ToolTip;