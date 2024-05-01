
import "./globals.css";
import localFont from "next/font/local";

const clashDisplay = localFont({
  src: "../assets/font/ClashDisplay-Variable (1).ttf",
  variable: "--font-clashDisplay",
  weight: "700"
})
import { ClerkProvider } from "@clerk/nextjs";
import "@radix-ui/themes/styles.css";


export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={`${clashDisplay.variable}`}>{children}</body>
    </html>
    </ClerkProvider>
  );
}
