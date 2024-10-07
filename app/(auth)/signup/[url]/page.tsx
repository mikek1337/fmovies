import Signup from "@/components/signup"

const Page = ({params}:{params:{url:string}})=>{
    return(
        <Signup url={params.url} />
    )
}