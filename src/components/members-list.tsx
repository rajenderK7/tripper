import React from "react";
import { Badge } from "./ui/badge";

interface MembersProps {
  members: string[];
}

const MembersList = ({ members }: MembersProps) => {
  return (
    <div className="flex flex-wrap">
      {members.map((m, i) => {
        return (
          <Badge className="mr-2 mb-2" key={i} variant="outline">
            {m}
          </Badge>
        );
      })}
    </div>
  );
};

export default MembersList;
