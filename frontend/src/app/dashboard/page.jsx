"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function Dashboard() {
  const [assets, setAssets] = useState(null);
  const getAllAssets = () => {
    axios.get("/api/assets/modi-ji").then((response) => {
      setAssets(response.data);
      console.log(response.data);
    });
  };
  useEffect(() => {
    getAllAssets();
  }, []);
  return (
    <div className="p-6">
      <h1 className="text-3xl my-4">Assets</h1>
      <div className="flex flex-col gap-4">
        {assets?.map((asset, index) => (
          <div
            key={asset?.aid?.S}
            className="flex gap-4 p-6 bg-slate-200 hover:bg-slate-100 rounded-xl min-h-[200px] items-center transition-colors"
          >
            {asset?.links?.M ? (
              <VideoComponent
                links={asset?.links?.M}
                className="h-full w-64 flex flex-col gap-2"
                videoClassName="object-cover rounded-xl"
              />
            ) : (
              <div className="w-64">
                <Skeleton className="w-full h-32 rounded-xl mb-4" />
                <Skeleton className="w-full h-8 rounded-xl" />
              </div>
            )}
            <div className="flex flex-col">
              <table>
                <tbody>
                  <tr>
                    <td className="font-semibold pr-4 align-text-top whitespace-nowrap">
                      Asset Id:
                    </td>
                    <td>{asset?.aid?.S}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold pr-4 align-text-top whitespace-nowrap">
                      Status :
                    </td>
                    <td
                      className={`${
                        asset?.status?.S === "completed"
                          ? "text-green-700"
                          : "text-yellow-600"
                      } capitalize`}
                    >
                      {asset?.status?.S}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold pr-4 align-text-top whitespace-nowrap">
                      Created At :
                    </td>
                    <td>{new Date(asset?.createdAt?.S).toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
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
export default Dashboard;
