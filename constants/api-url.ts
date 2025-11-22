export const ApiUrl = {
  // Auth
  GET_PROFILE: "/users/profile",
  UPDATE_PROFILE: "/users/update-profile",
  AVATAR: "/users/upload-avatar",
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",

  // Posts
  POSTS: "/posts",
  POST_BY_ID: (id: string | number) => `/posts/${id}`,
  CREATE_POST: "/posts/create",
  GET_MY_POSTS: "/posts/list-my-post",
  UPDATE_POST: (id: string | number) => `/posts/${id}`,
  DELETE_POST: (id: string | number) => `/posts/${id}`,

  SEARCH_POSTS: "/posts/search",
  RECOMMENDED_POSTS: "/posts/recommended",
  UPLOAD_POST_IMAGE: "/posts/upload-post-image",

  CREATE_COMMENT: "/comments/create",
  GET_COMMENTS: "/comments/list-comment",

  // Customers
  CUSTOMERS: "/customers",
  CUSTOMER_BY_ID: (id: string | number) => `/customers/${id}`,

  // Categories
  CATEGORIES: "/categories",
};
