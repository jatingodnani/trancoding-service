"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

function InputFile({ file, setFile }) {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="picture">Upload here</Label>
      <Input
        id="picture"
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />
    </div>
  );
}

function Uploadassets() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const handleUploadAsset = () => {
    if (confirm("Are you sure you want to start the video transcoding?")) {
      if (file === null) return;
      const formData = new FormData();
      formData.append("asset", file);
      setLoading(true);
      axios
        .post("/api/uploadasset", formData)
        .then((response) => {
          console.log(response.data);
          router.push("/dashboard");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="bg-slate-200 rounded-xl flex flex-col item-center justify-between p-6">
        {/* <InputFile file={file} setFile={setFile} /> */}
        <h1 className="font-semibold text-center text-xl mb-2">UPLOAD FILE</h1>
        <div className="flex flex-col gap-2">
          {file && (
            <div className="flex flex-col items-center">
              <p>{file.name}</p>
              {file.type.startsWith("video/") && (
                <video
                  className="max-w-full w-96 mx-auto rounded-xl mt-4"
                  controls
                  src={URL.createObjectURL(file)}
                >
                  Video preview not supported
                </video>
              )}
            </div>
          )}
          <div className="flex gap-2">
            {file && (
              <button
                className="flex-1 bg-red-500 hover:bg-red-700 text-white  py-2 px-4 rounded text-center w-full "
                onClick={() => setFile(null)}
              >
                Remove File
              </button>
            )}
            <label htmlFor="upload-file" className="flex-1">
              <p className="bg-green-500 hover:bg-green-700 text-white  py-2 px-4 rounded text-center w-full cursor-pointer">
                {file ? "Change File" : "Upload File"}
              </p>
              <input
                type="file"
                className="hidden"
                name="upload-file"
                id="upload-file"
                accept="video/mp4,video/mov,video/x-matroska,video/webm"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            className="rounded text-center font-medium py-3 px-4 text-white bg-slate-600 mt-3 hover:bg-slate-700 flex-1"
            href={"/dashboard"}
          >
            Back
          </Link>
          <button
            disabled={file === null}
            className="rounded text-center font-medium py-3 px-4 text-white bg-blue-600 mt-3 hover:bg-blue-700 flex-1 whitespace-nowrap disabled:bg-gray-400"
            onClick={handleUploadAsset}
          >
            {loading ? "Uploading..." : "Start Processing"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Uploadassets;
