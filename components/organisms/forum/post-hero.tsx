import { ForumPost } from "@/types/forum";
import { ForumPostMeta } from "@/components/molecules/forum/post-meta";
import { ForumPostHighlights } from "@/components/molecules/forum/post-highlights";
import { ForumPostGallery } from "@/components/molecules/forum/post-gallery";

interface ForumPostHeroProps {
  post: ForumPost;
}

export function ForumPostHero({ post }: ForumPostHeroProps) {
  return (
    <section className="rounded-3xl border border-green-100 bg-white/90 p-8 shadow-sm">
      <ForumPostMeta
        category={post.category}
        location={post.location}
        views={post.views}
      />

      <h1 className="mt-4 text-4xl font-bold text-gray-900">{post.title}</h1>
      <p className="mt-3 text-lg text-gray-700">{post.description}</p>

      {post.highlights && post.highlights.length > 0 && (
        <ForumPostHighlights items={post.highlights} />
      )}

      {post.images && post.images.length > 0 && (
        <ForumPostGallery title={post.title} images={post.images} />
      )}
    </section>
  );
}

