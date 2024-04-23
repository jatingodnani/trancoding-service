import { Loader2 } from "lucide-react"


import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


 function InputFile() {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="picture">Upload here</Label>
      <Input id="picture" type="file" />
    </div>
  )
}





function Uploadassets() {
  return (
    <div className="w-full h-full flex justify-start items-center ">
        <div className="w-[40%] h-[20%] flex-col item-center justify-between p-2">
            <InputFile/>

           <button className="w-100 h-[50px] rounded text-center font-medium p-4 text-white bg-blue-600 mt-3">Upload</button>
           </div>
    </div>
  )
}

export default Uploadassets
