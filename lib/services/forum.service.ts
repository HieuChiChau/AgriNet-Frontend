import { httpRequest } from "@/lib/apis/httpRequest";
import { ApiUrl } from "@/constants/api-url";
import { ForumPost } from "@/types/forum";
import { Post, ProductCategory, PostStatus } from "@/types/post";
import { authService } from "./auth.service";

interface ApiPostItem {
  id: string;
  title: string;
  content: string;
  status?: number;
  latitude?: string | null;
  longitude?: string | null;
  address?: string | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  category?: {
    id: string;
    name: string;
    image: string;
  } | null;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    avatar: string | null;
    latitude: string;
    longitude: string;
    address: string;
    role: number;
    status: number;
  };
  images: {
    id: string;
    fileName: string | null;
    url: string;
  }[];
  embedding?: {
    id: string;
    productName: string;
    price: string;
    quantity: string;
  } | null;
}

function transformApiPostToPost(apiPost: ApiPostItem): Post {
  const transformedUser = authService.transformUser(apiPost.user);

  return {
    id: apiPost.id,
    title: apiPost.title,
    description: apiPost.content,
    category: apiPost.category
      ? (apiPost.category.name
          .toLowerCase()
          .replace(/\s+/g, "-") as ProductCategory)
      : ProductCategory.OTHER,
    price: apiPost.embedding?.price
      ? parseFloat(apiPost.embedding.price.replace(/[^\d.]/g, ""))
      : 0,
    quantity: apiPost.embedding?.quantity
      ? parseFloat(apiPost.embedding.quantity.replace(/[^\d.]/g, ""))
      : 0,
    unit: apiPost.embedding?.quantity?.includes("kg")
      ? "kg"
      : apiPost.embedding?.quantity?.includes("tấn")
      ? "tấn"
      : "kg",
    location: {
      province: (apiPost.address || apiPost.user.address)
        ? (apiPost.address || apiPost.user.address).split(",").slice(-2, -1)[0]?.trim() || ""
        : "",
      district: (apiPost.address || apiPost.user.address)
        ? (apiPost.address || apiPost.user.address).split(",").slice(-3, -2)[0]?.trim() || ""
        : "",
      address: apiPost.address || apiPost.user.address || "",
      coordinates: {
        lat: parseFloat(apiPost.latitude || apiPost.user.latitude) || 0,
        lng: parseFloat(apiPost.longitude || apiPost.user.longitude) || 0,
      },
    },
    images: apiPost.images.map((img) => img.url),
    status: PostStatus.PUBLISHED,
    farmer: transformedUser,
    farmerId: apiPost.user.id,
    createdAt: apiPost.createdAt || "",
    updatedAt: apiPost.updatedAt || "",
  };
}

function transformPostToForumPost(post: Post): ForumPost {
  const excerpt = post.description
    ? post.description.length > 150
      ? post.description.substring(0, 150) + "..."
      : post.description
    : "";

  const categoryTags: Record<string, string> = {
    rice: "lúa gạo",
    vegetables: "rau củ",
    fruits: "trái cây",
    coffee: "cà phê",
    cassava: "sắn",
    corn: "ngô",
    other: "khác",
  };
  const tags = post.category
    ? [categoryTags[post.category] || post.category]
    : [];

  return {
    ...post,
    excerpt,
    tags,
    likes: 0,
    commentsCount: 0,
    bookmarked: false,
  };
}

export const forumService = {
  getPosts: async (): Promise<ForumPost[]> => {
    const response = await httpRequest.get<{
      status: string;
      result: {
        data: ApiPostItem[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
      message?: string;
    }>(ApiUrl.POSTS);

    const apiPosts = response.data.result?.data || [];

    const posts = apiPosts.map(transformApiPostToPost);
    return posts.map(transformPostToForumPost);
  },

  getPostById: async (id: string | number): Promise<ForumPost | null> => {
    try {
      const response = await httpRequest.get(ApiUrl.POST_BY_ID(id));
      const postData = response.data.result;

      const post: Post = {
        id: postData.id,
        title: postData.title,
        description: postData.content,
        category: postData.category
          ? (postData.category.name.toLowerCase().replace(/\s+/g, "-") as any)
          : "other",
        price: postData.embedding?.price
          ? parseFloat(postData.embedding.price.replace(/[^\d.]/g, ""))
          : 0,
        quantity: postData.embedding?.quantity
          ? parseFloat(postData.embedding.quantity.replace(/[^\d.]/g, ""))
          : 0,
        unit: postData.embedding?.quantity?.includes("kg")
          ? "kg"
          : postData.embedding?.quantity?.includes("tấn")
          ? "tấn"
          : "kg",
        location: {
          province: postData.user.address
            ? postData.user.address.split(",").slice(-2, -1)[0]?.trim() || ""
            : "",
          district: postData.user.address
            ? postData.user.address.split(",").slice(-3, -2)[0]?.trim() || ""
            : "",
          address: postData.user.address || "",
          coordinates: {
            lat: parseFloat(postData.user.latitude) || 0,
            lng: parseFloat(postData.user.longitude) || 0,
          },
        },
        images: postData.images.map((img) => img.url),
        status: "published" as any,
        farmer: authService.transformUser(postData.user),
        farmerId: postData.user.id,
        createdAt: "",
        updatedAt: "",
      };

      return transformPostToForumPost(post);
    } catch (error) {
      return null;
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getCommentsByPostId: async (_id?: string | number): Promise<any[]> => {
    return [];
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getAuthorById: (_id?: string | number) => {
    return null;
  },
};
