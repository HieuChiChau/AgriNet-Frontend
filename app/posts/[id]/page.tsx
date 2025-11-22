import { PostDetailClient } from "@/components/pages/post/post-detail-client";

interface PostPageProps {
  params: { id: string };
}

export default function PostDetailPage({ params }: PostPageProps) {
  return <PostDetailClient postId={params.id} />;
}

