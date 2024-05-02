"use client";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import VideoComponent from "./_components/VideoComponent";
import { Audio } from "react-loader-spinner";
import { useEffect, useState } from "react";
import { FilePlusIcon, RefreshCcw } from "lucide-react";

const Dashboard = () => {
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAssets = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/assets");
      setAssets(response.data);
    } catch (error) {
      console.error("Error fetching assets:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchAssets();
  }, []);
  return (
    <div className="p-6 min-h-screen">
      <div className="my-4 flex justify-between gap-2">
        <h1 className="text-3xl flex-1 font-bold">Assets</h1>
        <button
          type="button"
          className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded flex items-center gap-2"
          onClick={() => fetchAssets()}
        >
          <RefreshCcw />
          Reload
        </button>
        <Link
          href="/uploadassets"
          className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded flex items-center gap-2"
        >
          <FilePlusIcon />
          Add Asset
        </Link>
      </div>
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center">
          <Audio
            height="80"
            width="80"
            radius="9"
            color="red"
            ariaLabel="loading"
            wrapperStyle
            wrapperClass
            className=""
          />
        </div>
      ) : (
        <div className="flex flex-col gap-4 max-w-5xl mx-auto mt-12">
          {[...assets]
            .sort((a, b) => b?.createdAt?.S?.localeCompare(a?.createdAt?.S))
            .map((asset, index) => (
              <div
                key={asset?.aid?.S}
                className="flex gap-4 p-6 rounded-xl min-h-[200px] items-center transition-colors border border-slate-700 md:flex-row flex-col"
              >
                {asset?.links?.M ? (
                  <VideoComponent
                    links={asset?.links?.M}
                    className="w-full md:w-64 flex flex-col gap-2"
                    videoClassName="object-cover h-48 md:h-32 rounded-xl border border-slate-700"
                  />
                ) : (
                  <div className="w-full md:w-64">
                    <Skeleton className="w-full h-48 md:h-32 rounded-xl mb-4 bg-white/50" />
                    <div className="flex gap-2">
                      <Skeleton className="w-full h-8 rounded-xl bg-white/50" />
                      <Skeleton className="w-10 h-8 rounded-xl bg-white/50" />
                    </div>
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
                        <td>
                          {new Date(asset?.createdAt?.S).toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
