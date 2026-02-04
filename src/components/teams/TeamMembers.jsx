"use client";

import { useEffect, useState } from "react";

export default function TeamMembers({ teamId }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMembers() {
      const res = await fetch(`/api/team/${teamId}/members`, {
        credentials: "include",
      });

      if (!res.ok) {
        console.error("Failed to load members");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setMembers(data.members);
      setLoading(false);
    }

    fetchMembers();
  }, [teamId]);

  if (loading) return <p>Loading members...</p>;

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-3">Members</h2>

      <ul className="space-y-2">
        {members.map((member) => (
          <li
            key={member.id}
            className="flex justify-between items-center border rounded p-3"
          >
            <div>
              <p className="font-medium">{member.name}</p>
              <p className="text-sm text-muted-foreground">
                {member.email}
              </p>
            </div>

            <span className="text-xs bg-slate-100 px-2 py-1 rounded">
              {member.role}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
