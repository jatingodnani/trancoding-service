import { currentUser } from "@clerk/nextjs";

function Dashboard() {
    const current = currentUser();
console.log(current);
  return (
    <div>
     Welcome {current?current.id:""}
    </div>
  )
}

export default Dashboard
