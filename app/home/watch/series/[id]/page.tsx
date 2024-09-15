import Recommendation from "@/components/recommendation";
import Series from "@/components/series";

import { Suspense } from "react";

const Page = ({params}:{params:{id:string}})=>{

    return(        
    <>
        <Series id={parseInt(params.id)}/>
        <div>
            <Suspense fallback={<div>Loading...</div>}>
            <Recommendation id={parseInt(params.id)}/>
            </Suspense>
        </div>
        </>)
}

export default Page;