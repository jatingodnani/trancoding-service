import { currentUser } from "@clerk/nextjs";
import Home from "../../component/home/Home";
import { Toaster } from "react-hot-toast";

export default function Page() {
  return (
    <div className="w-full">
      <Home />
    </div>
  );
}
