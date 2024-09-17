import Recommendation from "@/components/recommendation";
import Series from "@/components/series";

import { Suspense } from "react";

const Page = ({params}:{params:{id:string}})=>{

    return(        
    <>
        <Series id={parseInt(params.id)}/>
        
        </>)
}

export default Page;