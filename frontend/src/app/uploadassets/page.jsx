"use client";
import { Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import axios from "axios";

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
  const [file, setFile] = useState(null);
  const handleUploadAsset = () => {
    console.log(file);
    const formData = new FormData();
    formData.append("asset", file);
    formData.append("uid", "modi-ji");
    axios.post("/api/uploadasset", formData).then((response) => {
      console.log(response.data);
    });
  };
  return (
    <div className="w-full h-full flex justify-start items-center ">
      <div className="w-[40%] h-[20%] flex-col item-center justify-between p-2">
        <InputFile file={file} setFile={setFile} />

        <button
          className="rounded text-center font-medium py-3 px-4 text-white bg-blue-600 mt-3"
          onClick={handleUploadAsset}
        >
          Upload
        </button>
      </div>
    </div>
  );
}

export default Uploadassets;
