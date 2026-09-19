"use client";

import { UserInfo } from "@/types/user.interface";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../dropdown-menu";
import { Button } from "../../button";
import Link from "next/link";
import { Settings, User } from "lucide-react";
import { logoutUser } from "@/services/auth/logoutUser";
import LogoutButton from "../../shared/LogoutButton";

interface UserDropdownProps {
  userInfo: UserInfo | null;
}

const UserDropdown = ({ userInfo }: UserDropdownProps) => {
    const handleLogout = async() => {
        await logoutUser();
    };
    console.log("userInfo from userdropdown", userInfo)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <span className="text-sm font-semibold">
            {userInfo?.name.charAt(0).toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{userInfo?.name}</p>
            <p className="text-xs text-muted-foreground">{userInfo?.email}</p>
            <p className="text-xs text-primary capitalize">
              {userInfo?.role.toLowerCase()}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={"/my-profile"} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={"/change-password"} className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Change Password
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-red-600"
        >
          <LogoutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
