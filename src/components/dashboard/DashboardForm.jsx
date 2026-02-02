
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
       const res = await fetch("/api/auth/current-user", {
      credentials: "include", 
    });

     if (!res.ok) {
  router.replace("/login");
  return;
}

      const data = await res.json();
      setUser(data.user);
      setLoading(false);
    }

    fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">
        Welcome, {user.name}
      </h1>
      <p>Email: {user.email}</p>
    </div>
  );
}
