export const AgriNetRoutes = {
  Public: ["/", "/login", "/signup", "/farmer", "/customer"],
  Customer: [
    "/customer",
    "/customer/posts",
    "/customer/search",
    "/customer/recommendations",
  ],
  Farmer: [
    "/farmer",
    "/farmer/posts",
    "/farmer/create",
    "/farmer/customers",
    "/farmer/posts/:id",
  ],
  Admin: ["/manage"],
};
