"use client";

import { useEffect, useState } from "react";

export default function TeamClient({ teamId }) {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeam() {
        //fetch the teams
      const res = await fetch(`/api/team/${teamId}`, {
        credentials: "include",
      });

      if (!res.ok) {
        console.error("Failed to fetch team");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setTeam(data.team);
      setLoading(false);
    }

    fetchTeam();
  }, [teamId]);

  if (loading) return <p>Loading team...</p>;
  if (!team) return <p>Team not found</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{team.name}</h1>
      <p className="text-sm text-muted-foreground mt-1">
        Role: {team.role}
      </p>
    </div>
  );
}
