import { useRef, useState, useEffect } from "react";

const ReelCard = ({ reel }) => {

  const videoRef = useRef();

  const [muted, setMuted] =
    useState(true);

  const [liked, setLiked] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  // Auto Play
  useEffect(() => {

    const video = videoRef.current;

    if (video) {

      video.play().catch((error) => {
        console.log(error);
      });

    }

  }, []);

  // Toggle Sound
  const toggleSound = async () => {

    const video = videoRef.current;

    try {

      video.muted = !video.muted;

      setMuted(video.muted);

      await video.play();

    } catch (error) {

      console.log(error);

    }

  };

  // Share
  const handleShare = async () => {

    try {

      await navigator.share({
        title: reel.productName,
        text: reel.description,
        url: window.location.href,
      });

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="relative h-screen snap-start bg-black overflow-hidden md:rounded-3xl">

      {/* Video */}
      <video
        ref={videoRef}
        src={reel.video}
        className="h-full w-full object-cover"
        autoPlay
        loop
        playsInline
        muted={muted}
        onClick={toggleSound}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      {/* Sound Button */}
      <button
        onClick={toggleSound}
        className="absolute top-5 right-5 z-30 bg-black/50 backdrop-blur-lg text-white p-3 rounded-full"
      >

        {
          muted
            ? "🔇"
            : "🔊"
        }

      </button>

      {/* Product Details */}
      <div className="absolute bottom-24 left-5 text-white z-20 max-w-[75%]">

        <h1 className="text-2xl md:text-3xl font-bold">
          {reel.productName}
        </h1>

        <p className="mt-3 text-sm md:text-base text-gray-200 leading-relaxed">
          {reel.description}
        </p>

        <h2 className="mt-4 text-2xl font-bold">
          {reel.price}
        </h2>

        <button className="mt-5 bg-white text-black px-6 py-3 rounded-2xl font-semibold hover:scale-105 transition">

          View Product

        </button>

      </div>

      {/* Right Buttons */}
      <div className="absolute right-4 md:right-5 bottom-28 flex flex-col gap-6 text-white z-20">

        {/* Like */}
        <button
          onClick={() => setLiked(!liked)}
          className="flex flex-col items-center"
        >

          <span className="text-4xl hover:scale-110 transition">

            {
              liked
                ? "❤️"
                : "🤍"
            }

          </span>

          <span className="text-xs md:text-sm">
            Like
          </span>

        </button>

        {/* Save */}
        <button
          onClick={() => setSaved(!saved)}
          className="flex flex-col items-center"
        >

          <span className="text-4xl hover:scale-110 transition">

            {
              saved
                ? "🔖"
                : "📑"
            }

          </span>

          <span className="text-xs md:text-sm">
            Save
          </span>

        </button>

        {/* Share */}
        <button
          onClick={handleShare}
          className="flex flex-col items-center"
        >

          <span className="text-4xl hover:scale-110 transition">
            📤
          </span>

          <span className="text-xs md:text-sm">
            Share
          </span>

        </button>

      </div>

    </div>

  );

};

export default ReelCard;