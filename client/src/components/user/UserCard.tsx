import React from "react";
import { User } from "@/types/user";

interface UserCardProps {
  user: User;
  description?: string;
}

const UserCard = ({ user, description }: UserCardProps) => {
  return (
    <div className="p-4 border-b last:border-b-0">
      <p className="font-medium">{user.firstName} {user.lastName}</p>
      {description && (
        <p className="text-sm text-gray-600">{description}</p>
      )}
    </div>
  );
};

export default UserCard;