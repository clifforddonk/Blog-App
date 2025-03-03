"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Don't redirect while still loading

    if (status === "unauthenticated") {
      router.replace("/auth/login"); // Prevents redirect loop
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Loading...</p>; // Show loading while session is being checked
  }

  if (session) {
    return <p>Welcome, {session.user.name}!</p>;
  }

  return null;
}
