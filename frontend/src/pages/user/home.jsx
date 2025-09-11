import React from "react"
import Navbar from "./HomeComponents/navbar"
import PostSection from "./HomeComponents/mainSection"

function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="ml-64 px-6 pt-24 pb-12 sm:px-8 lg:px-12 transition-all duration-300">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 mb-4">
            Welcome Home
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Share your thoughts, explore amazing posts, and connect with a vibrant community of creators and thinkers.
          </p>
          <div className="mt-6 w-24 h-1 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
        </section>

        {/* Posts Section */}
        <section className="max-w-4xl mx-auto">
          <PostSection />
        </section>
      </div>
    </div>
  );
}


export default Home