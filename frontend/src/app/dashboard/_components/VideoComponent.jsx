"use client";

const { useState } = require("react");

const VideoComponent = ({ links, className, videoClassName }) => {
  const [quality, setQuality] = useState(Object.keys(links)?.[0]);
  console.log(quality);
  if (!links) return null;
  return (
    <div className={className}>
      <video src={links?.[quality]?.S} controls className={videoClassName}>
        Video not supported by browser.
      </video>
      <div>
        <select
          className="w-full rounded-xl p-2 cursor-pointer"
          onChange={(e) => setQuality(e.target.value)}
          value={quality}
        >
          {Object.keys(links).map((linkQuality) => (
            <option key={links[linkQuality]} value={linkQuality}>
              {linkQuality}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
export default VideoComponent;
