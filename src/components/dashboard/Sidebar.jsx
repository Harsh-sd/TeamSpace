"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardSidebar() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  //to make  sidebar in limelight
  const pathname = usePathname();

  useEffect(() => {
    async function fetchTeams() {
      try {
        //fetch the teams 
        const res = await fetch("/api/team", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch teams");

        const data = await res.json();
        setTeams(data.teams || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchTeams();
  }, []);

  return (
    <aside className="w-64 bg-slate-900 text-white p-4">
      <h2 className="text-xs font-semibold text-slate-400 uppercase mb-3">
        Teams
      </h2>

      {loading ? (
        <p className="text-sm text-slate-400">Loading…</p>
      ) : teams.length === 0 ? (
        <p className="text-sm text-slate-400">No teams yet</p>
      ) : (
        <ul className="space-y-1">
          {teams.map((team) => {
            //making the team active by setting path just for  attractive purpose
            const active = pathname.includes(team.id);

            return (
              <li key={team.id}>
                <Link
                  href={`/dashboard/team/${team.id}`}
                  className={`block rounded px-3 py-2 text-sm
                    ${active ? "bg-slate-800" : "hover:bg-slate-800"}
                  `}
                >
                  {team.name}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}
