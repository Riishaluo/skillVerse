import React from "react";
import Navbar from "./HomeComponents/navbar";
import PostSection from "./HomeComponents/mainSection";



function Home() {
    return (
        <div className="w-full md:max-w-3xl mx-auto mt-6 p-4" >
            <Navbar />
            <PostSection />
        </div>
    )
}




export default Home