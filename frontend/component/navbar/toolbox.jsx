import { Button } from "@/components/ui/button";
import { currentUser } from "@clerk/nextjs";
import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";

function  Toolbox() {
  const current = currentUser();
  return (
    <div className="flex items-center justify-center gap-6">
      <Button className="text-lg bg-blue-600 text-white">Start Trial</Button>
      {current && (
        <Link
          href={"/dashboard"}
        
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-aperture"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m14.31 8 5.74 9.94" />
            <path d="M9.69 8h11.48" />
            <path d="m7.38 12 5.74-9.94" />
            <path d="M9.69 16 3.95 6.06" />
            <path d="M14.31 16H2.83" />
            <path d="m16.62 12-5.74 9.94" />
          </svg>
        </Link>
      )}
      {!current ? (
        <Link href={"/sign-in"}>Login</Link>
      ) : (
        <Link href={"/profile"} className="pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-circle-user-round"
          >
            <path d="M18 20a6 6 0 0 0-12 0" />
            <circle cx="12" cy="10" r="4" />
            <circle cx="12" cy="12" r="10" />
          </svg>
        </Link>
      ) }
    </div>
  );
}

export default Toolbox;
