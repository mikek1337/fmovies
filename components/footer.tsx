import { FC } from "react";

const Footer:FC = () =>{
    return(
         <footer className="bg-gray-100 py-6 px-4 md:px-10 text-center text-gray-700 text-sm rounded-t-lg mt-8">
        <p>&copy; 2025 Movie Streaming App. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-2">
            <a href="#" className="hover:text-indigo-600 transition duration-300">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-600 transition duration-300">Terms of Service</a>
            <a href="#" className="hover:text-indigo-600 transition duration-300">Contact Us</a>
        </div>
    </footer>

    )
}

export default Footer