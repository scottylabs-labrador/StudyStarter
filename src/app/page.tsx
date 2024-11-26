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
          router.push("/feed");
        }
      }, 10);
      setTimeout(() => {
        if (classes.length === 0) { 
          router.push("/create_account");
        } else {
          router.push("/feed");
        }
        clearInterval(id);
      }, 1500);
    };
    doStuff();
  }, [classes, router]);
}