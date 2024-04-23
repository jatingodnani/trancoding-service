import { Button } from "@/components/ui/button";
import Link from "next/link";

function Toolbox() {
  return (
    <>
       <Button  className="text-lg bg-blue-600 text-white">
        Start Trial
      </Button>
      <Link href={"/sign-in"}>Login</Link>
    </>
  )
}

export default Toolbox