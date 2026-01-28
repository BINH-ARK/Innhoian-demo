import type { Express } from "express";
import type { Server } from "http";
import { storage } from "../core/storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { registerViewDetailRoutes } from "./view-detail-routes";
import { registerCrudRoutes } from "./crud-routes";
import { registerAuthRoutes } from "./auth-routes";
import { seedDatabase } from "../core/seed";

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
    const project = await storage.getProjectBySlug(req.params.slug as string);
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
    const post = await storage.getPostBySlug(req.params.slug as string);
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

      const roomId = parseInt(req.params.id as string);

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

  // Seed Database (Safe wrapping)
  try {
    await seedDatabase();
  } catch (err) {
    console.warn("[Database] Selection or Seeding failed:",
      err instanceof Error ? err.message : err);
  }

  return httpServer;
}
