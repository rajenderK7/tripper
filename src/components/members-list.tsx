import React from "react";
import { Badge } from "./ui/badge";

interface MembersProps {
  members: string[];
}

const MembersList = ({ members }: MembersProps) => {
  return (
    <div className="flex">
      {members.map((m) => {
        return (
          <Badge className="mr-2" key={m} variant="outline">
            {m}
          </Badge>
        );
      })}
    </div>
  );
};

export default MembersList;
