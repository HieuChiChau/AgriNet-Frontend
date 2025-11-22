"use client";

import { ForumPostFeed } from "@/components/organisms/forum/forum-post-feed";
import { ForumSidebar } from "@/components/organisms/forum/forum-sidebar";

export function ForumPageClient() {
  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <ForumPostFeed />
      <ForumSidebar />
    </div>
  );
}

