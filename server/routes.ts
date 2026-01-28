import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { registerViewDetailRoutes } from "./view-detail-routes";
import { registerCrudRoutes } from "./crud-routes";
import { registerAuthRoutes } from "./auth-routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Authentication Routes (Register, Login)
  registerAuthRoutes(app);

  // View Detail Routes (Projects, Posts, Rooms by ID)
  registerViewDetailRoutes(app);

  // CRUD Routes (PUT, DELETE for Projects, Posts, Services)
  registerCrudRoutes(app);

  // Projects
  app.get(api.projects.list.path, async (req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.get(api.projects.get.path, async (req, res) => {
    const project = await storage.getProjectBySlug(req.params.slug);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  });

  // Create Project
  app.post('/api/projects', async (req, res) => {
    try {
      console.log('[POST /api/projects] Creating new project:', req.body);

      const project = await storage.createProject(req.body);

      console.log('[POST /api/projects] Created successfully:', project);
      return res.status(201).json(project);
    } catch (error) {
      console.error('[POST /api/projects] Error:', error);
      return res.status(500).json({
        message: 'Failed to create project',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // Services
  app.get(api.services.list.path, async (req, res) => {
    const services = await storage.getServices();
    res.json(services);
  });

  // Create Service
  app.post('/api/services', async (req, res) => {
    try {
      console.log('[POST /api/services] Creating new service:', req.body);
      const service = await storage.createService(req.body);
      console.log('[POST /api/services] Created successfully:', service);
      return res.status(201).json(service);
    } catch (error) {
      console.error('[POST /api/services] Error:', error);
      return res.status(500).json({
        message: 'Failed to create service',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // Posts
  app.get(api.posts.list.path, async (req, res) => {
    const posts = await storage.getPosts();
    res.json(posts);
  });

  app.get(api.posts.get.path, async (req, res) => {
    const post = await storage.getPostBySlug(req.params.slug);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  });

  // Create Post
  app.post('/api/posts', async (req, res) => {
    try {
      console.log('[POST /api/posts] Creating new post:', req.body);
      const post = await storage.createPost(req.body);
      console.log('[POST /api/posts] Created successfully:', post);
      return res.status(201).json(post);
    } catch (error) {
      console.error('[POST /api/posts] Error:', error);
      return res.status(500).json({
        message: 'Failed to create post',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // Contact
  app.post(api.contact.submit.path, async (req, res) => {
    try {
      const input = api.contact.submit.input.parse(req.body);
      const message = await storage.createMessage(input);
      res.status(201).json(message);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Messages - Get all messages for Admin Dashboard
  app.get('/api/messages', async (req, res) => {
    try {
      const messages = await storage.getMessages();
      res.json(messages);
    } catch (err) {
      console.error('Error fetching messages:', err);
      return res.status(500).json({
        message: 'Failed to fetch messages',
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    }
  });

  // ==================== ADMIN ROUTES ====================
  // Admin-specific endpoints with /api/admin prefix

  // Admin Projects
  app.get('/api/admin/projects', async (req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  // Admin Posts
  app.get('/api/admin/posts', async (req, res) => {
    const posts = await storage.getPosts();
    res.json(posts);
  });

  // Admin Services
  app.get('/api/admin/services', async (req, res) => {
    const services = await storage.getServices();
    res.json(services);
  });

  // Admin Messages
  app.get('/api/admin/messages', async (req, res) => {
    try {
      const messages = await storage.getMessages();
      res.json(messages);
    } catch (err) {
      console.error('Error fetching messages:', err);
      return res.status(500).json({
        message: 'Failed to fetch messages',
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    }
  });

  // Admin Create Project
  app.post('/api/admin/projects', async (req, res) => {
    try {
      console.log('[POST /api/admin/projects] Creating new project:', req.body);

      const project = await storage.createProject(req.body);

      console.log('[POST /api/admin/projects] Created successfully:', project);
      return res.status(201).json(project);
    } catch (error) {
      console.error('[POST /api/admin/projects] Error:', error);
      return res.status(500).json({
        message: 'Failed to create project',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // Admin Create Post
  app.post('/api/admin/posts', async (req, res) => {
    try {
      console.log('[POST /api/admin/posts] Creating new post:', req.body);
      const post = await storage.createPost(req.body);
      console.log('[POST /api/admin/posts] Created successfully:', post);
      return res.status(201).json(post);
    } catch (error) {
      console.error('[POST /api/admin/posts] Error:', error);
      return res.status(500).json({
        message: 'Failed to create post',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // Admin Create Service
  app.post('/api/admin/services', async (req, res) => {
    try {
      console.log('[POST /api/admin/services] Creating new service:', req.body);
      const service = await storage.createService(req.body);
      console.log('[POST /api/admin/services] Created successfully:', service);
      return res.status(201).json(service);
    } catch (error) {
      console.error('[POST /api/admin/services] Error:', error);
      return res.status(500).json({
        message: 'Failed to create service',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // Admin Dashboard - Lấy thống kê tổng hợp
  app.get(api.admin.dashboard.path, async (req, res) => {
    try {
      // Sử dụng Promise.all để chạy đồng thời 4 câu truy vấn COUNT(*)
      // Điều này tối ưu hiệu suất so với chạy tuần tự
      const [
        totalProjects,
        totalServices,
        totalPosts,
        totalMessages
      ] = await Promise.all([
        storage.getProjectsCount(),
        storage.getServicesCount(),
        storage.getPostsCount(),
        storage.getMessagesCount()
      ]);

      // Tính toán tỷ lệ phần trăm tăng trưởng
      // Giả định: So sánh với baseline (80% của total hiện tại)
      // Trong thực tế, bạn có thể lưu số liệu tháng trước vào DB
      const calculateGrowth = (current: number): number => {
        if (current === 0) return 0;
        const baseline = Math.floor(current * 0.8); // Giả định baseline
        const growth = ((current - baseline) / baseline) * 100;
        return Math.round(growth * 10) / 10; // Làm tròn 1 chữ số thập phân
      };

      // Trả về dữ liệu thống kê
      res.json({
        stats: {
          projects: {
            total: totalProjects,
            growth: calculateGrowth(totalProjects)
          },
          services: {
            total: totalServices,
            growth: calculateGrowth(totalServices)
          },
          posts: {
            total: totalPosts,
            growth: calculateGrowth(totalPosts)
          },
          messages: {
            total: totalMessages,
            growth: calculateGrowth(totalMessages)
          }
        }
      });

    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      return res.status(500).json({
        message: 'Failed to fetch dashboard statistics',
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    }
  });

  // Rooms
  app.get(api.rooms.list.path, async (req, res) => {
    const rooms = await storage.getRooms();
    res.json(rooms);
  });

  // POST /api/admin/rooms/save - Create or Update room
  app.post(api.rooms.save.path, async (req, res) => {
    try {
      // Validate input data
      const input = api.rooms.save.input.parse(req.body);

      let savedRoom;

      // If id exists, UPDATE the room
      if (input.id) {
        const { id, ...updateData } = input;
        savedRoom = await storage.updateRoom(id, updateData);

        if (!savedRoom) {
          return res.status(404).json({
            message: `Room with id ${id} not found`
          });
        }

        // Return 200 for successful update
        return res.status(200).json(savedRoom);
      }
      // If no id, INSERT new room
      else {
        const { id, ...createData } = input;
        savedRoom = await storage.createRoom(createData);

        // Return 201 for successful creation
        return res.status(201).json(savedRoom);
      }

    } catch (err) {
      // Handle validation errors
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }

      // Handle database errors
      console.error('Database error in /api/admin/rooms/save:', err);
      return res.status(500).json({
        message: 'Database error: Failed to save room',
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    }
  });

  // DELETE /api/admin/rooms/:id - Delete room
  app.delete(api.rooms.delete.path, async (req, res) => {
    try {
      // Log incoming request
      console.log(`[DELETE REQUEST] Received request to delete room ID: ${req.params.id}`);

      const roomId = parseInt(req.params.id);

      // Validate room ID
      if (isNaN(roomId)) {
        console.log(`[DELETE ERROR] Invalid room ID: ${req.params.id}`);
        return res.status(400).json({
          message: 'Invalid room ID - must be a number'
        });
      }

      console.log(`[DELETE] Attempting to delete room ID: ${roomId}`);

      // Attempt to delete the room
      const deleted = await storage.deleteRoom(roomId);

      if (!deleted) {
        console.log(`[DELETE FAILED] Room ID ${roomId} not found in database`);
        return res.status(404).json({
          message: `Room with id ${roomId} not found`
        });
      }

      console.log(`[DELETE SUCCESS] Room ID ${roomId} deleted successfully`);
      return res.status(200).json({
        success: true,
        message: `Room ${roomId} deleted successfully`
      });

    } catch (err) {
      console.error('[DELETE ERROR] Exception occurred:', err);
      return res.status(500).json({
        message: 'Failed to delete room',
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    }
  });

  // Seed Database
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingProjects = await storage.getProjects();
  if (existingProjects.length === 0) {
    // Projects
    await storage.createProject({
      name: "Camf",
      slug: "camf",
      slogan: "A second home in the heart of Hoi An",
      description: "Located amidst the An Mỹ rice fields, Camf offers a serene escape with rustic charm and modern comforts. Perfect for those seeking tranquility.",
      airbnbUrl: "https://airbnb.com",
      isFeatured: true,
      tags: ["Rice Fields", "Rustic", "Peaceful"],
      images: ["https://drive.google.com/uc?export=view&id=1PL0QlH49ImSoxj20nJ4y0W-05eX6oF70"],
      type: "homestay"
    });

    await storage.createProject({
      name: "Lekchi",
      slug: "lek-chi",
      slogan: "Cozy, rustic, and peaceful",
      description: "A place for family bonding, where simplicity meets warmth. Experience the authentic local lifestyle.",
      airbnbUrl: "https://airbnb.com",
      isFeatured: true,
      tags: ["Family", "Cozy", "Authentic"],
      images: ["https://drive.google.com/uc?export=view&id=1PL0QlH49ImSoxj20nJ4y0W-05eX6oF70"],
      type: "homestay"
    });

    await storage.createProject({
      name: "Dủ dẻ",
      slug: "du-de",
      slogan: "A place to breathe deeply",
      description: "Cast aside all worries and immerse yourself in nature. Tươi is designed to rejuvenate your spirit.",
      airbnbUrl: "https://airbnb.com",
      isFeatured: true,
      tags: ["Nature", "Rejuvenation", "Wellness"],
      images: ["https://drive.google.com/uc?export=view&id=1PL0QlH49ImSoxj20nJ4y0W-05eX6oF70"],
      type: "homestay"
    });

    // Services
    await storage.createService({
      title: "Management & Operations",
      description: "Comprehensive homestay management ensuring smooth operations and high guest satisfaction.",
      icon: "settings"
    });

    await storage.createService({
      title: "Business Consulting",
      description: "Expert advice on homestay business models, pricing strategies, and market positioning.",
      icon: "briefcase"
    });

    await storage.createService({
      title: "Renovation",
      description: "Transforming spaces into soulful homes with our design and renovation services.",
      icon: "hammer"
    });

    // Blog Posts
    await storage.createPost({
      title: "Awakening the Soul of a Home",
      slug: "awakening-soul",
      content: "At INN HoiAn, we believe that every house has a soul waiting to be awakened. Our journey begins with understanding the history and the potential of each space...",
      category: "Operating Stories",
      imageUrl: "https://drive.google.com/uc?export=view&id=1PL0QlH49ImSoxj20nJ4y0W-05eX6oF70",
      author: "INN Team"
    });

    await storage.createPost({
      title: "The Story of Tươi",
      slug: "story-of-tuoi",
      content: "Tươi was born from a desire to create a sanctuary. We found an old house covered in vines and saw its potential...",
      category: "People & Stories",
      imageUrl: "https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=2880&auto=format&fit=crop",
      author: "Founder"
    });

    // Rooms
    await storage.createRoom({
      name: "Deluxe Garden View",
      type: "double",
      price: 800000,
      status: "available",
      projectId: 1,
      description: "Spacious room with beautiful garden view, perfect for couples",
      amenities: ["Air Conditioning", "WiFi", "Mini Bar", "Private Bathroom", "Garden View"],
      images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"]
    });

    await storage.createRoom({
      name: "Superior Twin Room",
      type: "twin",
      price: 650000,
      status: "available",
      projectId: 1,
      description: "Comfortable twin beds with modern amenities",
      amenities: ["Air Conditioning", "WiFi", "TV", "Private Bathroom"],
      images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800"]
    });

    await storage.createRoom({
      name: "Family Suite",
      type: "suite",
      price: 1200000,
      status: "occupied",
      projectId: 2,
      description: "Large suite perfect for families with children",
      amenities: ["Air Conditioning", "WiFi", "Kitchen", "Living Room", "2 Bathrooms", "Balcony"],
      images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800"]
    });

    await storage.createRoom({
      name: "Standard Single",
      type: "single",
      price: 450000,
      status: "available",
      projectId: 2,
      description: "Cozy single room for solo travelers",
      amenities: ["Air Conditioning", "WiFi", "Desk", "Private Bathroom"],
      images: ["https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800"]
    });

    await storage.createRoom({
      name: "Honeymoon Suite",
      type: "suite",
      price: 1500000,
      status: "available",
      projectId: 3,
      description: "Romantic suite with private jacuzzi and rice field view",
      amenities: ["Air Conditioning", "WiFi", "Jacuzzi", "King Bed", "Private Terrace", "Champagne"],
      images: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800"]
    });
  }
}
