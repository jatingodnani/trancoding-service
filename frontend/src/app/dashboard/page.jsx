"use client";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import VideoComponent from "./_components/VideoComponent";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import CheckUser from "@/lib/checkUser";

const Dashboard = () => {
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const user = CheckUser();
  if (!user) router.push("/sign-in");

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
    <div className="p-6">
      <div className="my-4 flex justify-between gap-2">
        <h1 className="text-3xl flex-1">Assets</h1>
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => fetchAssets()}
        >
          Reload
        </button>
        <Link
          href="/uploadassets"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Asset
        </Link>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex flex-col gap-4">
          {assets.map((asset, index) => (
            <div
              key={asset?.aid?.S}
              className="flex gap-4 p-6 bg-slate-200 hover:bg-slate-100 rounded-xl min-h-[200px] items-center transition-colors border border-slate-200"
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
      )}
    </div>
  );
};

export default Dashboard;
