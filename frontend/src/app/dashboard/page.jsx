"use client";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import VideoComponent from "./_components/VideoComponent";
import { Audio } from "react-loader-spinner";
import { useEffect, useState } from "react";
import { FilePlusIcon, RefreshCcw, Trash } from "lucide-react";
import toast from "react-hot-toast";

const statusColors = {
  completed: "text-green-700",
  processing: "text-blue-700",
  waiting: "text-orange-700",
  failed: "text-red-700",
};

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
  const handleDelete = async (aid) => {
    if (confirm("Are you sure you want to delete this asset")) {
      const loadingId = toast.loading("Deleting file...!");
      try {
        await axios.post("/api/delete-asset", { aid });
        await fetchAssets();
        toast.success("File deleted successfully");
      } catch (error) {
        console.error("Error fetching assets:", error);
        toast.error("Error deleting file");
      } finally {
        toast.dismiss(loadingId);
      }
    }
  };
  useEffect(() => {
    fetchAssets();
  }, []);
  return (
    <div className="p-6 pt-20 min-h-screen">
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
        <>
          {assets.length > 0 ? (
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
                              className={`${statusColors[asset?.status?.S]} ${
                                ["processing", "waiting"].includes(
                                  asset?.status?.S
                                )
                                  ? "animate-pulse"
                                  : ""
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
                      <div>
                        <button
                          type="button"
                          className="bg-[#232627] hover:bg-primary-dark text-white font-semibold py-1 px-2 rounded flex items-center gap-2 text-xs my-2"
                          onClick={() => handleDelete(asset?.aid?.S)}
                        >
                          <Trash /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center mt-12 flex-col gap-2">
              <img
                className="w-72 h-72"
                src={"/no-asset.png"}
                alt="No assets found"
              />
              <p className="text-xl md:text-2xl">No assets... YET!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
