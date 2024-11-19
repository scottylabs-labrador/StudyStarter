"use client";
import { redirect, useRouter } from "next/navigation";
import "~/styles/globals.css";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";


export default function HomePage() {
  const { user } = useUser();
  const [classes, setClasses] = useState<any[]>([]);

  
  classes.map((cls) => (
    console.log(cls.id)
  ))
  console.log(classes);

  const router = useRouter();

  useEffect(() => {
    const doStuff = () => {
      const id = setInterval(() => {
        if (classes.length != 0) { 
          console.log("feed");
          router.push("/feed");
        }
      }, 10);
      setTimeout(() => {
        if (classes.length === 0) { 
          console.log("create");
          router.push("/create_account");
        } else {
          console.log("feed");
          router.push("/feed");
        }
        clearInterval(id);
      }, 1000);
    };
    doStuff();
  }, [classes, router]);
}