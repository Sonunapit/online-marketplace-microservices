import Navbar from "../components/navbar/Navbar";

const HomePage = () => {

  return (

    <div className="min-h-screen bg-gray-100 pb-24">

      <Navbar />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-5 py-10 md:py-20">

        <div className="grid md:grid-cols-2 gap-10 items-center">

          {/* Left */}
          <div>

            <span className="bg-black text-white px-4 py-2 rounded-full text-sm">

              New Marketplace Experience

            </span>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight mt-6">

              Discover Amazing Products Online

            </h1>

            <p className="text-gray-600 mt-6 text-base md:text-lg leading-relaxed">

              Buy and sell amazing products with secure authentication and modern user experience.

            </p>

            <div className="flex flex-wrap gap-4 mt-8">

              <button className="bg-black text-white px-6 py-3 rounded-2xl">

                Explore Products

              </button>

              <button className="bg-white border px-6 py-3 rounded-2xl">

                Watch Reels

              </button>

            </div>

          </div>

          {/* Right */}
          <div>

            <img
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30"
              alt="banner"
              className="rounded-3xl h-[300px] md:h-[550px] w-full object-cover shadow-xl"
            />

          </div>

        </div>

      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-5 pb-20">

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white p-8 rounded-3xl shadow-sm">

            <div className="text-5xl mb-5">
              🔒
            </div>

            <h2 className="text-2xl font-bold mb-3">
              Secure Authentication
            </h2>

            <p className="text-gray-500">
              JWT based secure authentication system.
            </p>

          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm">

            <div className="text-5xl mb-5">
              🚀
            </div>

            <h2 className="text-2xl font-bold mb-3">
              Fast Performance
            </h2>

            <p className="text-gray-500">
              Optimized modern React frontend experience.
            </p>

          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm">

            <div className="text-5xl mb-5">
              🎬
            </div>

            <h2 className="text-2xl font-bold mb-3">
              Product Reels
            </h2>

            <p className="text-gray-500">
              Short video content for better engagement.
            </p>

          </div>

        </div>

      </div>

    </div>

  );

};

export default HomePage;