import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { redirect } from "next/navigation";


export default async function LoginPage() {
    return (
      <main className="flex h-[95vh] flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-black sm:text-[5rem]">
            Welcome!
          </h1>
          <SignedOut>
            <SignInButton mode="modal" forceRedirectUrl="/create_account">
              <button className="bg-blue-500 rounded-lg p-4 text-2xl"> 🪵 📥</button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            { redirect("/create_account") }
          </SignedIn>
        </div>
      </main>
    );
  }
  