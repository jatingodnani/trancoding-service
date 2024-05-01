"use client";

import { ClipboardCopy, Copy } from "lucide-react";

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
      <div className="flex gap-2 items-center">
        <select
          className="w-full rounded-xl p-2 cursor-pointer bg-black border-slate-700 border"
          onChange={(e) => setQuality(e.target.value)}
          value={quality}
        >
          {Object.keys(links).map((linkQuality) => (
            <option key={links[linkQuality]} value={linkQuality}>
              {linkQuality}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="hover:bg-slate-700 transition-colors rounded-full p-2 active:bg-slate-800"
          onClick={() => {
            navigator.clipboard.writeText(links[quality].S);
            alert("Link copied to clipboard");
          }}
        >
          <Copy />
        </button>
      </div>
    </div>
  );
};
export default VideoComponent;
