// src/pages/FollowingPage.jsx
import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import { politicians as politiciansData } from "@/data/politicians";
import PoliticianCard from "@/components/PoliticianCard";
import AlertSettings from "@/components/AlertSettings";
import { Button } from "@/components/ui/button";
import { ChevronDown, Bell } from "lucide-react";

const FollowingPage = () => {
  const { followed } = useUser();
  const [openAlerts, setOpenAlerts] = useState({}); // { [name]: true/false }

  const followedList = followed
    .map((name) => {
      const data = politiciansData[name];
      return data ? { name, ...data } : null;
    })
    .filter(Boolean);

  const toggleAlerts = (name) => {
    setOpenAlerts((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <div className="px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold">Following</h1>
      {followedList.length === 0 ? (
        <p className="text-muted-foreground">You’re not following anyone yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {followedList.map((p) => (
            <div key={p.name} className="space-y-2">
              <PoliticianCard data={p} />
              <Button
                variant="outline"
                size="sm"
                className="w-full flex items-center gap-2"
                onClick={() => toggleAlerts(p.name)}
              >
                <Bell className="h-4 w-4" />
                {openAlerts[p.name] ? "Hide Alerts" : "Edit Alerts"}
                <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${openAlerts[p.name] ? "rotate-180" : ""}`} />
              </Button>
              {openAlerts[p.name] && (
                <div className="mt-2">
                  <AlertSettings politicianName={p.name} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FollowingPage;
