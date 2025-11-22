import { ForumComment, ForumPost, ForumUser } from "@/types/forum";
import { PostStatus, ProductCategory } from "@/types/post";
import { UserRole } from "@/constants/role";

const forumUsers: ForumUser[] = [
  {
    id: 1,
    name: "Nguyễn Văn Nông",
    email: "farmer@agrinet.com",
    role: UserRole.Farmer,
    avatar: "/assets/images/farmers/farmer-1.jpg",
    location: "Cao Lãnh, Đồng Tháp",
    company: "Hợp tác xã Lúa An Bình",
    badge: "Nông dân tiêu biểu",
  },
  {
    id: 2,
    name: "Trần Thị Mua",
    email: "customer@agrinet.com",
    role: UserRole.Customer,
    avatar: "/assets/images/customers/customer-1.jpg",
    location: "Bình Thạnh, TP.HCM",
    company: "Thương lái Tân Phú",
    badge: "Thương lái uy tín",
  },
  {
    id: 3,
    name: "Lê Quốc Đạt",
    email: "customer2@agrinet.com",
    role: UserRole.Customer,
    avatar: "/assets/images/customers/customer-2.jpg",
    location: "Thủ Đức, TP.HCM",
    company: "Logistics GreenWay",
  },
  {
    id: 4,
    name: "Phạm Thị Hòa",
    email: "farmer2@agrinet.com",
    role: UserRole.Farmer,
    avatar: "/assets/images/farmers/farmer-2.jpg",
    location: "Châu Phú, An Giang",
    company: "Trang trại Hòa Phát",
  },
];

export const forumUsersMap = Object.fromEntries(
  forumUsers.map((user) => [user.id, user])
);

export const forumPosts: ForumPost[] = [
  {
    id: 101,
    title: "Lúa ST25 vụ Đông Xuân 2025, chuẩn GlobalGAP",
    description:
      "Lúa ST25 canh tác theo tiêu chuẩn GlobalGAP, thu hoạch trong 2 tuần nữa. Độ ẩm đảm bảo dưới 14%.",
    excerpt:
      "Cần kết nối thương lái hoặc doanh nghiệp xuất khẩu cho 250 tấn lúa ST25 đạt chuẩn GlobalGAP.",
    category: ProductCategory.RICE,
    price: 7200,
    quantity: 250,
    unit: "kg",
    location: {
      province: "Sóc Trăng",
      district: "Mỹ Xuyên",
      address: "Ấp Phú Mỹ, xã Thạnh Qưới",
    },
    images: [
      "/assets/images/posts/st25-1.jpg",
      "/assets/images/posts/st25-2.jpg",
    ],
    status: PostStatus.PUBLISHED,
    farmer: forumUsersMap[1] as any,
    farmerId: 1,
    createdAt: "2025-02-18T08:30:00Z",
    updatedAt: "2025-02-18T08:30:00Z",
    tags: ["ST25", "GlobalGAP", "Đang trổ bông"],
    likes: 48,
    commentsCount: 12,
    highlights: [
      "Độ ẩm dự kiến 13.5%",
      "Đã ký hợp đồng với đơn vị vận chuyển",
      "Có mẫu thử gửi miễn phí",
    ],
  },
  {
    id: 102,
    title: "Xoài cát Hòa Lộc hữu cơ",
    description:
      "Xoài cát Hòa Lộc trồng hữu cơ tại Hậu Giang, trọng lượng trung bình 450-500g/trái.",
    excerpt:
      "Sẵn sàng cung ứng xoài hữu cơ với chứng nhận VietGAP, số lượng 8 tấn cho đợt đầu.",
    category: ProductCategory.FRUITS,
    price: 38000,
    quantity: 8000,
    unit: "kg",
    location: {
      province: "Hậu Giang",
      district: "Phụng Hiệp",
    },
    images: ["/assets/images/posts/mango-1.jpg"],
    status: PostStatus.SOLD,
    farmer: forumUsersMap[4] as any,
    farmerId: 4,
    createdAt: "2025-02-16T10:00:00Z",
    updatedAt: "2025-02-16T10:00:00Z",
    tags: ["Hữu cơ", "VietGAP", "Xuất khẩu"],
    likes: 65,
    commentsCount: 18,
  },
  {
    id: 103,
    title: "Cần nguồn cà phê robusta xuất khẩu",
    description:
      "Thương lái tìm nguồn cà phê robusta nhân xô ướt tại Tây Nguyên, yêu cầu độ ẩm < 12%.",
    excerpt:
      "Cần kết nối nông hộ hoặc hợp tác xã cung ứng cà phê robusta ướt, giao hàng tại Gia Nghĩa.",
    category: ProductCategory.COFFEE,
    price: 0,
    quantity: 12000,
    unit: "kg",
    location: {
      province: "Đắk Nông",
      district: "Gia Nghĩa",
    },
    images: ["/assets/images/posts/coffee-1.jpg"],
    status: PostStatus.EXPIRED,
    farmer: forumUsersMap[2] as any,
    farmerId: 2,
    createdAt: "2025-02-15T07:20:00Z",
    updatedAt: "2025-02-15T07:20:00Z",
    tags: ["Robusta", "Thu mua", "Xuất khẩu EU"],
    likes: 30,
    commentsCount: 5,
  },
];

export const forumComments: ForumComment[] = [
  {
    id: "c1",
    postId: 101,
    content:
      "Cho mình xin thông số test độ ẩm mới nhất với nhé. Bên mình mua 100 tấn.",
    createdAt: "2025-02-18T10:15:00Z",
    author: forumUsersMap[2],
    replies: [
      {
        id: "c1-1",
        postId: 101,
        content:
          "Độ ẩm hôm nay là 13.4%. Mình gửi bảng test qua mail cho bạn nhé.",
        createdAt: "2025-02-18T10:45:00Z",
        author: forumUsersMap[1],
      },
    ],
  },
  {
    id: "c2",
    postId: 101,
    content: "Có hỗ trợ đóng gói bao PP 50kg không anh?",
    createdAt: "2025-02-18T12:00:00Z",
    author: forumUsersMap[3],
  },
  {
    id: "c3",
    postId: 102,
    content:
      "Xoài có thể giao theo lô nhỏ 2 tấn được không? Mình muốn test thị trường.",
    createdAt: "2025-02-16T12:30:00Z",
    author: forumUsersMap[2],
    replies: [
      {
        id: "c3-1",
        postId: 102,
        content: "Được nhé, mình có thể chia lô. Inbox mình trao đổi thêm.",
        createdAt: "2025-02-16T13:00:00Z",
        author: forumUsersMap[4],
      },
    ],
  },
];
