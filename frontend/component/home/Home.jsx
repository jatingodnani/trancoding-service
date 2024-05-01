import Link from "next/link";
import Header from "../navbar/Header";

import Banner from "../banner/Banner";

function Home() {
  return (
    <div className="w-[100%]">
      <Header />
      <Banner />
      
    </div>
  );
}

export default Home;
