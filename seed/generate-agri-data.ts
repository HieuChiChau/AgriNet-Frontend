import { faker } from "@faker-js/faker";
import * as fs from "fs";

export enum UserRole {
  SUPER_ADMIN = 1,
  CUSTOMER = 2,
  FARMER = 3,
}

const CATEGORIES = [
  { name: "Rau củ" },
  { name: "Cây ăn quả" },
  { name: "Cây công nghiệp" },
] as const;

type CategoryName = (typeof CATEGORIES)[number]["name"];

interface Farmer {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 3; // FARMER
  latitude?: number;
  longitude?: number;
  address?: string;
  status: 1;
}

interface Customer {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 2; // CUSTOMER
  latitude?: number;
  longitude?: number;
  address?: string;
  status: 1;
}

interface Post {
  title: string;
  content: string;
  categoryName: CategoryName;
  customerEmail: string;
  status: 1;
  productName: string;
  price?: string;
  quantity?: string;
}

const VI_LAST_NAMES = [
  "Nguyễn",
  "Trần",
  "Lê",
  "Phạm",
  "Phan",
  "Hoàng",
  "Huỳnh",
  "Vũ",
  "Võ",
  "Đặng",
  "Bùi",
  "Đỗ",
  "Hồ",
  "Ngô",
];

const VI_MID_NAMES = ["Văn", "Hữu", "Đức", "Thị", "Ngọc", "Thanh", "Minh"];

const VI_FIRST_NAMES_MALE = [
  "Anh",
  "Bình",
  "Cường",
  "Dũng",
  "Huy",
  "Khang",
  "Long",
  "Nam",
  "Phúc",
  "Quân",
  "Sơn",
  "Thành",
  "Tuấn",
  "Vinh",
];

const VI_FIRST_NAMES_FEMALE = [
  "Anh",
  "Chi",
  "Dung",
  "Giang",
  "Hà",
  "Hương",
  "Lan",
  "Linh",
  "Mai",
  "Ngân",
  "Ngọc",
  "Như",
  "Phương",
  "Thảo",
  "Trang",
];

const VI_STREET_NAMES = [
  "Lê Lợi",
  "Lê Duẩn",
  "Nguyễn Huệ",
  "Nguyễn Văn Linh",
  "Nguyễn Thị Minh Khai",
  "Trần Hưng Đạo",
  "Hai Bà Trưng",
  "Điện Biên Phủ",
  "Hoàng Diệu",
  "Hùng Vương",
  "Phan Châu Trinh",
  "Quang Trung",
];

const VN_BASE_LOCATIONS = [
  {
    province: "Hà Nội",
    district: "Quận Hoàn Kiếm",
    ward: "Phường Hàng Trống",
    lat: 21.0285,
    lng: 105.8353,
    delta: 0.015,
  },
  {
    province: "Hà Nội",
    district: "Quận Cầu Giấy",
    ward: "Phường Dịch Vọng",
    lat: 21.0365,
    lng: 105.7896,
    delta: 0.02,
  },
  {
    province: "TP. Hồ Chí Minh",
    district: "Quận 1",
    ward: "Phường Bến Nghé",
    lat: 10.7769,
    lng: 106.7009,
    delta: 0.02,
  },
  {
    province: "TP. Hồ Chí Minh",
    district: "TP. Thủ Đức",
    ward: "Phường Linh Trung",
    lat: 10.8696,
    lng: 106.8032,
    delta: 0.02,
  },
  {
    province: "Đà Nẵng",
    district: "Quận Hải Châu",
    ward: "Phường Thạch Thang",
    lat: 16.0678,
    lng: 108.2208,
    delta: 0.015,
  },
  {
    province: "Đà Nẵng",
    district: "Quận Liên Chiểu",
    ward: "Phường Hòa Khánh Bắc",
    lat: 16.0765,
    lng: 108.1502,
    delta: 0.015,
  },
  {
    province: "Thừa Thiên Huế",
    district: "TP. Huế",
    ward: "Phường Phú Hội",
    lat: 16.4637,
    lng: 107.5909,
    delta: 0.015,
  },
  {
    province: "Khánh Hòa",
    district: "TP. Nha Trang",
    ward: "Phường Tân Lập",
    lat: 12.2388,
    lng: 109.1967,
    delta: 0.015,
  },
  {
    province: "Lâm Đồng",
    district: "TP. Đà Lạt",
    ward: "Phường 1",
    lat: 11.9404,
    lng: 108.4583,
    delta: 0.015,
  },
  {
    province: "Cần Thơ",
    district: "Quận Ninh Kiều",
    ward: "Phường An Khánh",
    lat: 10.0452,
    lng: 105.7469,
    delta: 0.02,
  },
  {
    province: "Hải Phòng",
    district: "Quận Lê Chân",
    ward: "Phường An Biên",
    lat: 20.8449,
    lng: 106.6881,
    delta: 0.02,
  },
  {
    province: "Nghệ An",
    district: "TP. Vinh",
    ward: "Phường Hồng Sơn",
    lat: 18.6796,
    lng: 105.6813,
    delta: 0.02,
  },
  {
    province: "Gia Lai",
    district: "TP. Pleiku",
    ward: "Phường Hoa Lư",
    lat: 13.9833,
    lng: 108.0,
    delta: 0.02,
  },
  {
    province: "Đắk Lắk",
    district: "TP. Buôn Ma Thuột",
    ward: "Phường Tân Lập",
    lat: 12.6662,
    lng: 108.0378,
    delta: 0.02,
  },
];

const VEGETABLE_ITEMS = [
  "rau cải xanh",
  "rau muống",
  "cải bó xôi",
  "bắp cải",
  "cà rốt",
  "bí đỏ",
  "dưa leo",
  "đậu cô ve",
  "mướp hương",
  "cà chua",
];

const FRUIT_ITEMS = [
  "xoài cát Hòa Lộc",
  "thanh long ruột đỏ",
  "sầu riêng Ri6",
  "chuối già hương",
  "bưởi da xanh",
  "cam sành",
  "mít Thái",
  "nhãn lồng",
  "vải thiều",
  "dưa hấu",
];

const INDUSTRIAL_ITEMS = [
  "cà phê nhân Robusta",
  "cà phê Arabica",
  "hạt tiêu đen",
  "hạt điều nhân",
  "cao su thiên nhiên",
  "chè xanh",
  "mía nguyên liệu",
  "điều tươi",
  "cọ dầu",
];

function removeVietnameseTones(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

function makeVietnameseFullName(): { firstName: string; lastName: string } {
  const gender = faker.helpers.arrayElement<"male" | "female">([
    "male",
    "female",
  ]);
  const lastName = faker.helpers.arrayElement(VI_LAST_NAMES);
  const midName = faker.helpers.arrayElement(VI_MID_NAMES);
  const firstNameCore =
    gender === "male"
      ? faker.helpers.arrayElement(VI_FIRST_NAMES_MALE)
      : faker.helpers.arrayElement(VI_FIRST_NAMES_FEMALE);

  const firstName = `${midName} ${firstNameCore}`;
  return { firstName, lastName };
}

function makeEmailFromName(firstName: string, lastName: string): string {
  const full = `${lastName} ${firstName}`;
  const noTone = removeVietnameseTones(full)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, ".");

  const num = faker.number.int({ min: 1, max: 999 });
  return `${noTone}${num}@example.com`;
}

function makeVietnamPhone(): string {
  const prefixes = ["03", "05", "07", "08", "09"];
  const prefix = faker.helpers.arrayElement(prefixes);
  const rest = faker.number.int({ min: 10000000, max: 99999999 });
  return `${prefix}${rest}`;
}

function randomVNLocation() {
  const base = faker.helpers.arrayElement(VN_BASE_LOCATIONS);
  const latOffset = faker.number.float({
    min: -base.delta,
    max: base.delta,
    fractionDigits: 4,
  });
  const lngOffset = faker.number.float({
    min: -base.delta,
    max: base.delta,
    fractionDigits: 4,
  });

  const latitude = Number((base.lat + latOffset).toFixed(6));
  const longitude = Number((base.lng + lngOffset).toFixed(6));

  const streetName = faker.helpers.arrayElement(VI_STREET_NAMES);
  const streetNumber = faker.number.int({ min: 1, max: 250 });
  const wardNumber = faker.number.int({ min: 1, max: 20 });

  const address = `Số ${streetNumber} ${streetName}, Phường ${wardNumber}, ${base.district}, ${base.province}, Việt Nam`;

  return { address, latitude, longitude, province: base.province };
}

function createFarmer(): Farmer {
  const { firstName, lastName } = makeVietnameseFullName();
  const email = makeEmailFromName(firstName, lastName);
  const { address, latitude, longitude } = randomVNLocation();

  return {
    email,
    firstName,
    lastName,
    phone: makeVietnamPhone(),
    role: 3, // FARMER
    latitude,
    longitude,
    address,
    status: 1,
  };
}

function createCustomer(): Customer {
  const { firstName, lastName } = makeVietnameseFullName();
  const email = makeEmailFromName(firstName, lastName);
  const { address, latitude, longitude } = randomVNLocation();

  return {
    email,
    firstName,
    lastName,
    phone: makeVietnamPhone(),
    role: 2, // CUSTOMER
    latitude,
    longitude,
    address,
    status: 1,
  };
}

function pickProductName(categoryName: CategoryName): string {
  if (categoryName === "Rau củ") {
    return faker.helpers.arrayElement(VEGETABLE_ITEMS);
  }
  if (categoryName === "Cây ăn quả") {
    return faker.helpers.arrayElement(FRUIT_ITEMS);
  }
  return faker.helpers.arrayElement(INDUSTRIAL_ITEMS);
}

function makePostTitle(
  categoryName: CategoryName,
  productName: string,
  province: string
): string {
  const action = faker.helpers.arrayElement([
    "Cần bán",
    "Cần mua",
    "Tìm đầu ra cho",
    "Tìm nguồn cung",
  ]);
  const locationTail = faker.helpers.arrayElement([
    `tại ${province}`,
    `khu vực ${province}`,
    `ở ${province}`,
  ]);

  return `${action} ${productName} ${locationTail}`;
}

function makePostContent(
  categoryName: CategoryName,
  productName: string,
  province: string,
  quantityKg: number,
  pricePerKg: number
): string {
  const quality = faker.helpers.arrayElement([
    "đạt chuẩn an toàn thực phẩm",
    "trồng theo hướng hữu cơ",
    "canh tác theo quy trình VietGAP",
    "nguồn gốc rõ ràng, có nhật ký sản xuất",
  ]);
  const packing = faker.helpers.arrayElement([
    "đóng bao 25kg",
    "đóng thùng 10kg",
    "đóng sọt theo yêu cầu",
    "đóng gói hút chân không",
  ]);

  const buyerTypes =
    categoryName === "Cây công nghiệp"
      ? "nhà máy chế biến, cơ sở rang xay và đối tác xuất khẩu"
      : "chợ đầu mối, siêu thị mini, cửa hàng nông sản sạch và bếp ăn tập thể";

  const p1 = `Bên mình đang có ${quantityKg.toLocaleString(
    "vi-VN"
  )} kg ${productName} vụ hiện tại tại khu vực ${province}, chất lượng ${quality}. Hàng được thu hoạch và sơ chế trong ngày, bảo quản đúng quy trình để giữ độ tươi ngon.`;

  const p2 = `Giá đề xuất khoảng ${pricePerKg.toLocaleString(
    "vi-VN"
  )} đ/kg (có thể thương lượng theo số lượng và thời điểm lấy hàng). Hàng được ${packing}, hỗ trợ vận chuyển nội tỉnh và các khu vực lân cận nếu số lượng đủ lớn.`;

  const p3 = `Ưu tiên hợp tác lâu dài với ${buyerTypes}. Nếu anh/chị quan tâm, vui lòng liên hệ trực tiếp qua số điện thoại hoặc email để trao đổi chi tiết về mẫu thử, lịch giao hàng và điều khoản thanh toán.`;

  return `${p1}\n\n${p2}\n\n${p3}`;
}

function createPost(customers: Customer[]): Post {
  const customer = faker.helpers.arrayElement(customers);
  const loc = randomVNLocation();
  const category = faker.helpers.arrayElement(CATEGORIES);
  const productName = pickProductName(category.name);

  const quantityKg = faker.number.int({ min: 100, max: 5000 });
  const pricePerKg = faker.number.int({ min: 5000, max: 60000 });

  const title = makePostTitle(category.name, productName, loc.province);
  const content = makePostContent(
    category.name,
    productName,
    loc.province,
    quantityKg,
    pricePerKg
  );

  const priceString = `${pricePerKg.toLocaleString("vi-VN")} đ/kg`;
  const quantityString = `${quantityKg.toLocaleString("vi-VN")} kg`;

  return {
    title,
    content,
    categoryName: category.name,
    customerEmail: customer.email,
    status: 1,
    productName,
    price: priceString,
    quantity: quantityString,
  };
}

function main() {
  const farmerCount = 100;
  const customerCount = 300;
  const postCount = 800;

  const farmers: Farmer[] = [];
  const customers: Customer[] = [];
  const posts: Post[] = [];

  for (let i = 0; i < farmerCount; i++) {
    farmers.push(createFarmer());
  }

  for (let i = 0; i < customerCount; i++) {
    customers.push(createCustomer());
  }

  for (let i = 0; i < postCount; i++) {
    posts.push(createPost(customers));
  }

  const output = {
    categories: CATEGORIES,
    farmers,
    customers,
    posts,
  };

  const outputPath = "seed/agri-seed.json";
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), "utf-8");

  console.log(`✅ Generated seed data to ${outputPath}`);
  console.log(
    `   - categories: ${CATEGORIES.length}\n   - farmers: ${farmers.length}\n   - customers: ${customers.length}\n   - posts: ${posts.length}`
  );
}

main();
