"use server"
import { currentUser } from "@clerk/nextjs";


export default async function CheckUser(){
   const current=await currentUser();
   

   if(!current){
    return false;
   }
   return true;
}