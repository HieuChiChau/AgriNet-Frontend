import { PostDetailClient } from "@/components/pages/post/post-detail-client";

interface PostPageProps {
  params: { id: string };
  searchParams: { from?: string };
}

export default function PostDetailPage({ params, searchParams }: PostPageProps) {
  return <PostDetailClient postId={params.id} from={searchParams.from} />;
}

