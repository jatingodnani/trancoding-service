import Link from "next/link";
import Header from "../navbar/Header";
import { SignOutButton } from "@clerk/nextjs";

function Home() {
  return (
    <div className="w-[100%]">
      <Header />
      <div className="flex flex-col">
        <Link href={"/uploadassets"}>Upload Assets</Link>
        <Link href={"/signin"}>Sign in</Link>
        <Link href={"/profile"}>Profile</Link>
        <button type="button">Signout</button>
        <SignOutButton />
      </div>
    </div>
  );
}

export default Home;
