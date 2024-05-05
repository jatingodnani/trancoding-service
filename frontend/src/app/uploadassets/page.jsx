"use client";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, File, Upload, X } from "lucide-react";
import toast from "react-hot-toast";

function Uploadassets() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const handleUploadFile = async () => {
    if (file === null) return;
    if (confirm("Are you sure you want to start the video transcoding?")) {
      setLoading(true);
      const toastId = toast.loading("Uploading... Please wait!");
      try {
        // GET PRESIGNED URL
        const {
          data: { signedUrl, file: fileData },
        } = await axios.post("/api/uploadurl", {
          mime: file.type,
        });
        console.log(fileData);
        // UPLOAD FILE TO S3
        await axios.put(signedUrl, file, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        // START TASK
        await axios.post("/api/start-transcoding", fileData);
        toast.success("Your file has been queued successfully!");
        router.push("/dashboard");
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
        toast.dismiss(toastId);
      }
    }
  };
  return (
    <div className="w-full min-h-screen flex justify-center items-center p-10 pt-20">
      <div className=" border-slate-700 border rounded-xl flex flex-col item-center justify-between p-6">
        {/* <InputFile file={file} setFile={setFile} /> */}
        <h1 className="font-semibold text-center text-xl mb-2">UPLOAD FILE</h1>
        <div className="flex flex-col gap-2">
          {file && (
            <div className="flex flex-col items-center">
              <p title={file.name}>
                {file.name?.length < 25
                  ? file.name
                  : file.name.slice(0, 25) +
                    "..." +
                    file.name?.split(".")[file.name.split(".").length - 1]}
              </p>
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
          {!loading && (
            <div className="flex gap-2">
              {file && (
                <button
                  className="flex-1 bg-red-500 hover:bg-red-700 text-white  py-2 px-4 rounded text-center w-full "
                  onClick={() => setFile(null)}
                >
                  <div className="flex items-center gap-2 justify-center">
                    <X /> Remove File
                  </div>
                </button>
              )}
              <label htmlFor="upload-file" className="flex-1">
                <div className="bg-green-500 hover:bg-green-700 text-white  py-2 px-4 rounded text-center w-full cursor-pointer">
                  {file ? (
                    <div className="flex items-center gap-2 justify-center">
                      <File /> Change File
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 justify-center">
                      <Upload /> Upload File
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  name="upload-file"
                  id="upload-file"
                  accept="video/mp4,video/mov,video/x-matroska,video/webm"
                  onChange={(e) => {
                    const selectedFile = e.target.files[0];
                    if (selectedFile && selectedFile.size / 1024 / 1024 < 50) {
                      setFile(selectedFile);
                    } else toast.error("File size should be less than 50MB");
                  }}
                />
              </label>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {!loading && (
            <Link
              className="rounded text-center font-medium py-3 px-4 text-white bg-slate-600 mt-3 hover:bg-slate-700 flex-1"
              href={"/dashboard"}
            >
              <div className="flex gap-2 justify-center items-center">
                <ArrowLeft />
                Back
              </div>
            </Link>
          )}
          <button
            disabled={file === null || loading}
            className="rounded text-center font-medium py-3 px-4 text-white bg-blue-600 mt-3 hover:bg-blue-700 flex-1 whitespace-nowrap disabled:bg-gray-800"
            onClick={handleUploadFile}
          >
            {loading ? (
              <span className="animate-pulse">Uploading...</span>
            ) : (
              "Start Processing"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Uploadassets;
