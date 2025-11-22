import Link from "next/link";
import { ForumPost, ForumComment } from "@/types/forum";
import { ForumPostHero } from "@/components/organisms/forum/post-hero";
import { ForumPostSidebar } from "@/components/organisms/forum/post-sidebar";
import { ForumCommentThread } from "@/components/organisms/forum-comment-thread";
import { Icons } from "@/components/icons";

interface ForumPostDetailTemplateProps {
  post: ForumPost;
  comments: ForumComment[];
  authorLocation?: string;
  isCommentsLoading?: boolean;
}

export function ForumPostDetailTemplate({
  post,
  comments,
  authorLocation,
  isCommentsLoading = false,
}: ForumPostDetailTemplateProps) {
  return (
    <div className="bg-gradient-to-b from-green-50 via-white to-yellow-50">
      <article className="container space-y-8 py-12">
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
          <Link
            href="/forum"
            className="inline-flex items-center gap-2 rounded-full border border-green-100 bg-white/90 px-3 py-1 text-green-700 shadow-sm transition hover:border-green-200 hover:text-green-800"
          >
            <Icons.chevronLeft className="h-4 w-4" />
            Quay lại diễn đàn
          </Link>
          <span className="hidden text-gray-400 sm:block">/</span>
          <span className="hidden max-w-[260px] truncate text-gray-600 sm:block">
            {post.title}
          </span>
        </div>

        <section className="rounded-3xl border border-green-100 bg-white/95 p-2 shadow-sm">
          <ForumPostHero post={post} />
        </section>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6 rounded-3xl border border-green-100 bg-white/95 p-6 shadow-sm">
            {isCommentsLoading ? (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Icons.spinner className="h-4 w-4 animate-spin" />
                Đang tải bình luận...
              </div>
            ) : (
              <ForumCommentThread comments={comments} />
            )}
          </div>
          <ForumPostSidebar post={post} authorLocation={authorLocation} />
        </div>
      </article>
    </div>
  );
}

