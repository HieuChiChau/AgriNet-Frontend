import { Badge } from "@/components/atoms/badge";
import { Icons } from "@/components/icons";
import { ForumPost } from "@/types/forum";

type ForumPostMetaProps = Pick<
  ForumPost,
  "category" | "location" | "views"
>;

export function ForumPostMeta({ category, location, views }: ForumPostMetaProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm text-green-700">
      <Badge variant="secondary" className="bg-green-100">
        {category}
      </Badge>
      <span className="flex items-center gap-1 text-gray-500">
        <Icons.locations className="h-4 w-4" />
        {location.district}, {location.province}
      </span>
      <span className="flex items-center gap-1 text-gray-500">
        <Icons.media className="h-4 w-4" />
        {views ?? 0} lượt xem
      </span>
    </div>
  );
}

