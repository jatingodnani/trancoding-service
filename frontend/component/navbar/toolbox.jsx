import { Button } from "@/components/ui/button";
import { UserButton, currentUser } from "@clerk/nextjs";
import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";

function Toolbox() {
  const current = currentUser();
  return (
    <div className="flex items-center justify-center gap-6">
      {/* <Button className="text-lg bg-primary hover:bg-primary-dark transition-colors text-white">
        Start Trial
      </Button> */}

      {current && (
        <Link href={"/dashboard"}>
          <svg
            className="text-white hover:text-primary transition-colors"
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
      {!current ? <Link href={"/sign-in"}>Login</Link> : <UserButton />}
    </div>
  );
}

export default Toolbox;
