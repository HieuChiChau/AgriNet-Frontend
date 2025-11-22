export const ApiUrl = {
  // Auth
  GET_PROFILE: "/auth/profile",
  UPDATE_PROFILE: (id: string | number) => `/auth/profile/${id}`,
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

  // Customers (Khách hàng)
  CUSTOMERS: "/customers",
  CUSTOMER_BY_ID: (id: string | number) => `/customers/${id}`,

  // Categories
  CATEGORIES: "/categories",
};
