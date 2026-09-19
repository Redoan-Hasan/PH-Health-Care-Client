"use client";

import { UserInfo } from "@/types/user.interface";
import { Search } from "lucide-react";
import { Input } from "../../input";
import UserDropdown from "./UserDropdown";

interface DashboardNavbarContentProps {
  userInfo: UserInfo | null;
}
const DashboardNavbarContent = ({ userInfo }: DashboardNavbarContentProps) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        {/* Search Bar & AI Search */}
        <div className="flex-1 flex items-center justify-end gap-2">
          {/* Search Input */}
          <div className="relative w-full hidden sm:block">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer"
            //   onClick={handleSearchIconClick}
            />
            <Input
              type="text"
              placeholder="Search doctors by symptoms..."
              className="pl-9 pr-4"
            //   value={searchQuery}
            //   onChange={(e) => setSearchQuery(e.target.value)}
            //   onKeyDown={handleSearchKeyDown}
            />
          </div>

          {/* AI Search Dialog */}
          {/* <AISearchDialog
            initialSymptoms={searchQuery}
            externalOpen={aiDialogOpen}
            onOpenChange={(open) => {
              setAiDialogOpen(open);
              if (!open) setSearchQuery("");
            }}
            onSearchComplete={() => setSearchQuery("")}
          /> */}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          {/* <NotificationDropdown /> */}

          {/* User Dropdown */}
          <UserDropdown userInfo={userInfo} />
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbarContent;
