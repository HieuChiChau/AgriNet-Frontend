import { Icons } from "@/components/icons";

interface ForumPostHighlightsProps {
  items: string[];
}

export function ForumPostHighlights({ items }: ForumPostHighlightsProps) {
  if (!items.length) return null;

  return (
    <ul className="mt-6 space-y-2 rounded-2xl border border-green-100 bg-green-50/80 p-4 text-sm text-gray-700">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <Icons.check className="mt-0.5 h-4 w-4 text-green-600" />
          {item}
        </li>
      ))}
    </ul>
  );
}

