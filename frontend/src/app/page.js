


import { currentUser } from "@clerk/nextjs";

export default function Home() {
 
async function current(){
  const user=await currentUser();
 console.log(user)


}

current();


  return (
    <h1>trancoding</h1>
  );
}
