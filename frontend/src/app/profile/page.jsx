import React from "react";
import { UserProfile, currentUser } from "@clerk/nextjs";
export default async function page() {
  const user = await currentUser();
  return (
    <div>
      <UserProfile />
      <div>
        <div>{user.id}</div>
        <div>{user.firstName}</div>
        <div>{user.emailAddresses[0].emailAddress}</div>
        <div>{user.lastName}</div>
        <img src={user.imageUrl} alt="" />
      </div>
    </div>
  );
}
