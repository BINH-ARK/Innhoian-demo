import { storage } from "./storage";

export async function seedDatabase() {
    const existingProjects = await storage.getProjects();
    if (existingProjects.length > 0) {
        console.log("[Database] Data already exists, skipping seed.");
        return;
    }

    console.log("[Database] Seeding professional production dataset...");

    // 1. Projects (Homestays/Villas)
    const p1 = await storage.createProject({
        name: "Hội An Riverside Oasis",
        slug: "hoian-riverside-oasis",
        slogan: "Trải nghiệm kỳ nghỉ bình yên bên dòng sông Thu Bồn",
        description: "Nằm nép mình bên dòng sông Thu Bồn thơ mộng, Riverside Oasis mang đến không gian nghỉ dưỡng sang trọng với kiến trúc kết hợp giữa nét cổ điển Hội An và sự tiện nghi hiện đại. Chúng tôi tự hào mang đến cho khách hàng sự riêng tư tuyệt đối và góc nhìn toàn cảnh sông nước lung linh về đêm.",
        airbnbUrl: "https://airbnb.com/h/hoian-riverside",
        isFeatured: true,
        tags: ["Riverside", "Luxury", "Pool"],
        images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200"],
        type: "villa"
    });

    const p2 = await storage.createProject({
        name: "Ancient Town Heritage Inn",
        slug: "ancient-town-heritage",
        slogan: "Chạm vào linh hồn của Phố Cổ",
        description: "Chỉ cách Chùa Cầu 5 phút đi bộ, Heritage Inn là ngôi nhà cổ được phục dựng giữ nguyên vẹn cấu trúc gỗ truyền thống. Đây là nơi lý tưởng cho những ai muốn tìm lại cảm giác hoài niệm và trải nghiệm nhịp sống chậm rãi của con người Hội An xưa.",
        airbnbUrl: "https://airbnb.com/h/heritage-inn",
        isFeatured: true,
        tags: ["Heritage", "Old Town", "Traditional"],
        images: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200"],
        type: "homestay"
    });

    const p3 = await storage.createProject({
        name: "Phù Sa Terrace & Rice Field",
        slug: "phu-sa-terrace",
        slogan: "Thức dậy giữa cánh đồng lúa xanh mướt",
        description: "Tọa lạc tại vùng ven thanh bình của Hội An, Phù Sa Terrace mang đến góc nhìn 360 độ ra cánh đồng lúa An Mỹ. Với không gian mở và nhiều cây xanh, đây là thiên đường cho những người yêu thiên nhiên và muốn trốn khỏi sự ồn ào của phố thị.",
        airbnbUrl: "https://airbnb.com/h/phu-sa-terrace",
        isFeatured: true,
        tags: ["Rice Field", "Nature", "Eco-friendly"],
        images: ["https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200"],
        type: "homestay"
    });

    // 2. Services
    await storage.createService({
        title: "Tour Khám Phá Rừng Dừa",
        description: "Trải nghiệm chèo thúng truyền thống tại rừng dừa Bảy Mẫu, tham gia các hoạt động dân gian và thưởng thức hải sản địa phương.",
        icon: "ship"
    });

    await storage.createService({
        title: "Lớp Học Nấu Ăn Hội An",
        description: "Học cách chế biến các món đặc sản như Cao Lầu, Mì Quảng và Bánh Xèo dưới sự hướng dẫn của các đầu bếp bản địa dày dặn kinh nghiệm.",
        icon: "chef-hat"
    });

    await storage.createService({
        title: "Dịch Vụ Cho Thuê Xe Đạp",
        description: "Cung cấp xe đạp miễn phí hoặc cho thuê xe điện để bạn thoải mái khám phá các ngõ ngách và bãi biển quanh Hội An.",
        icon: "bike"
    });

    await storage.createService({
        title: "Dịch Vụ Đưa Đón Sân Bay",
        description: "Xe đưa đón riêng từ sân bay Đà Nẵng về Hội An với đội ngũ tài xế chuyên nghiệp, đúng giờ và nhiệt tình.",
        icon: "car"
    });

    // 3. Blog Posts
    await storage.createPost({
        title: "Top 5 Quán Cà Phê Có Tầm Nhìn Đẹp Nhất Hội An",
        slug: "top-5-cafe-hoian",
        content: "Hội An không chỉ có phố cổ hay biển An Bàng, mà còn có những góc cà phê trên cao nhìn xuống những mái ngói rêu phong cực kỳ lãng mạn. Trong bài viết này, chúng tôi sẽ gợi ý cho bạn...",
        category: "Cẩm nang du lịch",
        imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
        author: "INN Team"
    });

    await storage.createPost({
        title: "Kinh Nghiệm Chọn Homestay Phù Hợp Khi Đến Hội An",
        slug: "kinh-nghiem-chon-homestay",
        content: "Việc chọn đúng nơi lưu trú quyết định 50% sự thành công của chuyến đi. Bạn thích ở gần phố cổ để tiện đi bộ, hay ở gần biển để tận hưởng gió trời? Hãy cùng phân tích các ưu nhược điểm...",
        category: "Người trong nghề",
        imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
        author: "Founder"
    });

    // 4. Rooms for Projects
    // Rooms for p1 (Riverside Oasis)
    await storage.createRoom({
        name: "Premier River Suite",
        type: "suite",
        price: 2500000,
        status: "available",
        projectId: p1.id,
        description: "Suite hạng sang với ban công hướng thẳng ra sông Thu Bồn, bồn tắm nằm cao cấp.",
        amenities: ["AC", "WiFi", "Minibar", "Bathtub", "Balcony", "River View"],
        images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800"]
    });

    await storage.createRoom({
        name: "Deluxe Pool View",
        type: "double",
        price: 1800000,
        status: "available",
        projectId: p1.id,
        description: "Phòng đôi rộng rãi với cửa sổ lớn nhìn ra hồ bơi xanh mát.",
        amenities: ["AC", "WiFi", "Smart TV", "Private Bathroom", "Pool Access"],
        images: ["https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800"]
    });

    // Rooms for p2 (Heritage Inn)
    await storage.createRoom({
        name: "Old World Double Room",
        type: "double",
        price: 1200000,
        status: "available",
        projectId: p2.id,
        description: "Phòng được decor theo phong cách Indochine với nội thất gỗ cổ điển và tranh sơn mài.",
        amenities: ["AC", "WiFi", "Tea/Coffee Maker", "Traditional Decor"],
        images: ["https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800"]
    });

    // Rooms for p3 (Phù Sa Terrace)
    await storage.createRoom({
        name: "Rice Field View Terrace",
        type: "twin",
        price: 950000,
        status: "occupied",
        projectId: p3.id,
        description: "Phòng có hiên rộng, nơi bạn có thể ngồi thưởng trà và ngắm đàn cò bay trên cánh đồng lúa.",
        amenities: ["AC", "WiFi", "Terrace", "Kitchenette", "Rice Field View"],
        images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800"]
    });

    console.log("[Database] Production dataset seeded successfully!");
}
