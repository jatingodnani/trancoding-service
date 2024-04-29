import Link from "next/link";
import Header from "../navbar/Header";
import { SignOutButton } from "@clerk/nextjs";

function Home() {
  return (
    <div className="w-[100%]">
      <Header />
      <div className="flex flex-col gap-2 p-4 items-center">
        <Link
          href={"/profile"}
          className="bg-blue-600 text-white hover:bg-blue-700 transition-colors px-3 py-2 rounded-xl"
        >
          Profile
        </Link>
        <Link
          href={"/dashboard"}
          className="bg-blue-600 text-white hover:bg-blue-700 transition-colors px-3 py-2 rounded-xl"
        >
          Dashboard
        </Link>
        <SignOutButton />
      </div>
    </div>
  );
}

export default Home;
