"use client";
import { useState } from "react";
import { teamMembers as defaultMembers } from "@/lib/teamData";
import TeamCard from "./TeamCard";
import TeamBioModal from "./TeamBioModal";

export default function TeamGrid({ members }) {
  const teamMembers = members ?? defaultMembers;
  const [selected, setSelected] = useState(null);
  const [featured, ...rest] = teamMembers;

  return (
    <>
      <div className="space-y-10">
        <div className="flex justify-center">
          <div className="w-full max-w-xs">
            <TeamCard {...featured} featured={true} onClick={() => setSelected(featured)} />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {rest.map((member) => (
            <TeamCard key={member.image} {...member} onClick={() => setSelected(member)} />
          ))}
        </div>
      </div>
      {selected && (
        <TeamBioModal member={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
