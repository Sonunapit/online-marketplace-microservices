import Navbar from "../../../components/navbar/Navbar";

import ReelCard from "../../../components/reel/Reelcard.jsx";

import reelsData from "../../../components/reel/reelsData.js";

const ReelPage = () => {

  return (

    <div className="bg-black min-h-screen overflow-hidden">

      <Navbar />

      {/* Desktop Center Layout */}
      <div className="flex justify-center">

        {/* Reel Container */}
        <div className="w-full md:w-[430px] h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide">

          {
            reelsData.map((reel) => (

              <ReelCard
                key={reel.id}
                reel={reel}
              />

            ))
          }

        </div>

      </div>

    </div>

  );

};

export default ReelPage;