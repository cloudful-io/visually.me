"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Loading from "@/app/loading";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/"); 
    }, 300);

    return () => clearTimeout(timer);
  }, [router]);

  return <Loading/>; 
}
