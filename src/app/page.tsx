import { redirect } from "next/navigation";

export default function HomePage() {
  // change this to /login 
  redirect("/feed");
  
}
