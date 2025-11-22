import { ForumPost } from "@/types/forum";
import { Icons } from "@/components/icons";

interface ForumPostSidebarProps {
  post: ForumPost;
  authorLocation?: string;
}

export function ForumPostSidebar({
  post,
  authorLocation,
}: ForumPostSidebarProps) {
  const locationLabel = authorLocation || post.location.province;

  return (
    <aside className="space-y-6 rounded-3xl border border-green-100 bg-white/90 p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700 font-semibold">
          {post.farmer.name.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{post.farmer.name}</p>
          <p className="flex items-center gap-1 text-sm text-gray-500">
            <Icons.mapPin className="h-4 w-4" />
            {locationLabel}
          </p>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <p>
          <strong>Giá đề xuất:</strong>{" "}
          {post.price?.toLocaleString()} VND / {post.unit}
        </p>
        <p>
          <strong>Số lượng:</strong> {post.quantity.toLocaleString()} {post.unit}
        </p>
        <p>
          <strong>Thời gian tạo:</strong>{" "}
          {new Date(post.createdAt).toLocaleDateString("vi-VN")}
        </p>
      </div>
    </aside>
  );
}

