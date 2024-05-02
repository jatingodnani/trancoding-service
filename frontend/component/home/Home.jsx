import Link from "next/link";
import Header from "../navbar/Header";

import Banner from "../banner/Banner";
import Footer from "./footer";

function Home() {
  return (
    <div className="w-[100%]">
      <Header />
      <Banner />
      <Footer/>
    </div>
  );
}

export default Home;
