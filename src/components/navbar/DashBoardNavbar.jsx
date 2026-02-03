"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateTeamForm from "@/components/teams/CreateTeamForm";

export default function DashboardNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between border-b px-6 py-3">
      <h1 className="text-lg font-semibold">Dashboard</h1>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Create Team</Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create a new team</DialogTitle>
          </DialogHeader>

          <CreateTeamForm onSuccess={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </nav>
  );
}
