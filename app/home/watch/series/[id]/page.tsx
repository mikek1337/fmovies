import Series from "@/components/series";
const Page = ({params}:{params:{id:string}})=>{

    return(        
    <>
        <Series id={parseInt(params.id)}/>
        
        </>)
}

export default Page;