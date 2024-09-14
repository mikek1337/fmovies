import { FC } from "react";

const Footer:FC = () =>{
    return(
        <div className="border-t p-3 text-center">
            
            <p className="text-indigo-900">Movies &copy; {new Date().getFullYear()}</p>
        </div>
    )
}

export default Footer