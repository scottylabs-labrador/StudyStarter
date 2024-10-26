import { redirect } from "next/navigation";

export default function HomePage() {
  // change this to /login 
  /* if account exists and required profile fields known
  redirect("/feed");
  else */
  redirect("/create_account");
  
}
