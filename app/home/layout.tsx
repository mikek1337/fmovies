import Footer from "@/components/footer"
import Header from "@/components/header"

interface HomeLayoutProps{
    children:React.ReactNode
    searchModal:React.ReactNode
}
export default function HomeLayout({children, searchModal}:HomeLayoutProps){
    return(
        <>
            <Header/>
            {children}
            <Footer/>
            {searchModal}
        </>
    )
}