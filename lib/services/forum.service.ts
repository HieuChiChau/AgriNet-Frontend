import { forumComments, forumPosts } from "@/constants/mock-data/forum";
import { forumUsersMap } from "@/constants/mock-data/forum";
import { ForumComment, ForumPost } from "@/types/forum";

function delay(ms = 200) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const forumService = {
  getPosts: async (): Promise<ForumPost[]> => {
    await delay();
    return forumPosts;
  },

  getPostById: async (id: string | number): Promise<ForumPost | null> => {
    await delay();
    const post = forumPosts.find((item) => item.id === Number(id));
    return post ?? null;
  },

  getCommentsByPostId: async (id: string | number): Promise<ForumComment[]> => {
    await delay();
    return forumComments.filter((comment) => comment.postId === Number(id));
  },

  getAuthorById: (id: string | number) => {
    return forumUsersMap[id];
  },
};
