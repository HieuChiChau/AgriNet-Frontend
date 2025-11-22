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
  CREATE_POST: "/posts",
  UPDATE_POST: (id: string | number) => `/posts/${id}`,
  DELETE_POST: (id: string | number) => `/posts/${id}`,
  SEARCH_POSTS: "/posts/search",
  RECOMMENDED_POSTS: "/posts/recommended",

  // Customers
  CUSTOMERS: "/customers",
  CUSTOMER_BY_ID: (id: string | number) => `/customers/${id}`,

  // Categories
  CATEGORIES: "/categories",
};
