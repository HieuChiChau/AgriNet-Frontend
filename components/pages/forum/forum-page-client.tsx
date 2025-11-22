"use client";

import { ForumPostFeed } from "@/components/organisms/forum-post-feed";
import { ForumSidebar } from "@/components/organisms/forum-sidebar";
import { ForumPost } from "@/types/forum";

interface ForumPageClientProps {
  initialPosts?: ForumPost[];
}

export function ForumPageClient({ initialPosts }: ForumPageClientProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <ForumPostFeed posts={initialPosts} />
      <ForumSidebar />
    </div>
  );
}

