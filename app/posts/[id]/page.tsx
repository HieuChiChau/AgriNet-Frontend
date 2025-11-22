import { ForumPostDetailClient } from "@/components/pages/forum/forum-post-detail-client";

interface PostPageProps {
  params: { id: string };
}

export default function PostDetailPage({ params }: PostPageProps) {
  return <ForumPostDetailClient postId={params.id} />;
}

