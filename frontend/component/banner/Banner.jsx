import React from "react";

export default function Banner() {
  return (
    <div className="h-screen w-full relative">
      <video
        autoPlay
        loop
        muted
        playsInline
        src="https://videocdn.cdnpk.net/joy/content/video/free/video0485/large_preview/_import_61bac813196e63.98247957.mp4?filename=1118630_4k_search_noise_3840x2160.mp4"
        className="h-full w-full object-cover relative"
      ></video>
      <div className="absolute top-0 left-0 h-full w-full bg-black/80">
        <div className="absolute text-white top-1/2 left-4">
          <h1 className="text-6xl font-bold ">Video Transcoding</h1>
        </div>
      </div>
    </div>
  );
}
