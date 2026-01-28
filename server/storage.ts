import { db } from "./db";
import {
  projects, services, posts, messages, rooms, users,
  type Project, type InsertProject,
  type Service, type InsertService,
  type Post, type InsertPost,
  type Message, type InsertMessage,
  type Room, type InsertRoom,
  type User, type InsertUser
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Projects
  getProjects(): Promise<Project[]>;
  getProjectBySlug(slug: string): Promise<Project | undefined>;
  getProjectById(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  getProjectsCount(): Promise<number>;

  // Services
  getServices(): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: number): Promise<boolean>;
  getServicesCount(): Promise<number>;

  // Posts
  getPosts(): Promise<Post[]>;
  getPostBySlug(slug: string): Promise<Post | undefined>;
  getPostById(id: number): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: number, post: Partial<InsertPost>): Promise<Post | undefined>;
  deletePost(id: number): Promise<boolean>;
  getPostsCount(): Promise<number>;

  // Messages
  createMessage(message: InsertMessage): Promise<Message>;
  getMessages(): Promise<Message[]>;
  getMessagesCount(): Promise<number>;

  // Rooms
  getRooms(): Promise<Room[]>;
  getRoomById(id: number): Promise<Room | undefined>;
  createRoom(room: InsertRoom): Promise<Room>;
  updateRoom(id: number, room: Partial<InsertRoom>): Promise<Room | undefined>;
  deleteRoom(id: number): Promise<boolean>;

  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  // Projects
  async getProjects(): Promise<Project[]> {
    const results = await db.select().from(projects).orderBy(desc(projects.createdAt));
    return results.map(project => ({
      ...project,
      tags: project.tags ? JSON.parse(project.tags as string) : null,
      images: project.images ? JSON.parse(project.images as string) : null,
    })) as Project[];
  }

  async getProjectBySlug(slug: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.slug, slug));
    if (!project) return undefined;
    return {
      ...project,
      tags: project.tags ? JSON.parse(project.tags as string) : null,
      images: project.images ? JSON.parse(project.images as string) : null,
    } as Project;
  }

  async getProjectById(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    if (!project) return undefined;
    return {
      ...project,
      tags: project.tags ? JSON.parse(project.tags as string) : null,
      images: project.images ? JSON.parse(project.images as string) : null,
    } as Project;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const projectData = {
      ...insertProject,
      tags: insertProject.tags ? JSON.stringify(insertProject.tags) : null,
      images: insertProject.images ? JSON.stringify(insertProject.images) : null,
    };
    const [project] = await db.insert(projects).values(projectData as any).returning();
    return {
      ...project,
      tags: project.tags ? JSON.parse(project.tags as string) : null,
      images: project.images ? JSON.parse(project.images as string) : null,
    } as Project;
  }

  async updateProject(id: number, updateData: Partial<InsertProject>): Promise<Project | undefined> {
    const projectData: any = { ...updateData };

    if (updateData.tags) {
      projectData.tags = JSON.stringify(updateData.tags);
    }

    if (updateData.images) {
      projectData.images = JSON.stringify(updateData.images);
    }

    const [updated] = await db
      .update(projects)
      .set(projectData)
      .where(eq(projects.id, id))
      .returning();

    if (!updated) return undefined;

    return {
      ...updated,
      tags: updated.tags ? JSON.parse(updated.tags as string) : null,
      images: updated.images ? JSON.parse(updated.images as string) : null,
    } as Project;
  }

  async deleteProject(id: number): Promise<boolean> {
    const result = await db
      .delete(projects)
      .where(eq(projects.id, id))
      .returning();

    return result.length > 0;
  }

  async getProjectsCount(): Promise<number> {
    try {
      const { rawDb } = await import("./db");
      const result = rawDb.prepare("SELECT COUNT(*) as count FROM projects").get() as { count: number };
      return result.count || 0;
    } catch (error) {
      console.log("[Storage] 'projects' table not found or empty, returning 0 count");
      return 0;
    }
  }

  // Services
  async getServices(): Promise<Service[]> {
    return await db.select().from(services);
  }

  async createService(insertService: InsertService): Promise<Service> {
    const [service] = await db.insert(services).values(insertService).returning();
    return service;
  }

  async updateService(id: number, updateData: Partial<InsertService>): Promise<Service | undefined> {
    const [updated] = await db
      .update(services)
      .set(updateData)
      .where(eq(services.id, id))
      .returning();

    return updated;
  }

  async deleteService(id: number): Promise<boolean> {
    const result = await db
      .delete(services)
      .where(eq(services.id, id))
      .returning();

    return result.length > 0;
  }

  async getServicesCount(): Promise<number> {
    const { rawDb } = await import("./db");
    const result = rawDb.prepare("SELECT COUNT(*) as count FROM services").get() as { count: number };
    return result.count;
  }

  // Posts
  async getPosts(): Promise<Post[]> {
    return await db.select().from(posts).orderBy(desc(posts.publishedAt));
  }

  async getPostBySlug(slug: string): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.slug, slug));
    return post;
  }

  async getPostById(id: number): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post;
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const [post] = await db.insert(posts).values(insertPost).returning();
    return post;
  }

  async updatePost(id: number, updateData: Partial<InsertPost>): Promise<Post | undefined> {
    const [updated] = await db
      .update(posts)
      .set(updateData)
      .where(eq(posts.id, id))
      .returning();

    return updated;
  }

  async deletePost(id: number): Promise<boolean> {
    const result = await db
      .delete(posts)
      .where(eq(posts.id, id))
      .returning();

    return result.length > 0;
  }

  async getPostsCount(): Promise<number> {
    const { rawDb } = await import("./db");
    const result = rawDb.prepare("SELECT COUNT(*) as count FROM posts").get() as { count: number };
    return result.count;
  }

  // Messages
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages).values(insertMessage).returning();
    return message;
  }

  async getMessages(): Promise<Message[]> {
    return await db.select().from(messages).orderBy(desc(messages.createdAt));
  }

  async getMessagesCount(): Promise<number> {
    const { rawDb } = await import("./db");
    const result = rawDb.prepare("SELECT COUNT(*) as count FROM messages").get() as { count: number };
    return result.count;
  }

  // Rooms
  async getRooms(): Promise<Room[]> {
    const results = await db.select().from(rooms).orderBy(desc(rooms.createdAt));
    return results.map(room => ({
      ...room,
      amenities: room.amenities ? JSON.parse(room.amenities as string) : null,
      images: room.images ? JSON.parse(room.images as string) : null,
    })) as Room[];
  }

  async getRoomById(id: number): Promise<Room | undefined> {
    const [room] = await db.select().from(rooms).where(eq(rooms.id, id));
    if (!room) return undefined;
    return {
      ...room,
      amenities: room.amenities ? JSON.parse(room.amenities as string) : null,
      images: room.images ? JSON.parse(room.images as string) : null,
    } as Room;
  }

  async createRoom(insertRoom: InsertRoom): Promise<Room> {
    const roomData = {
      ...insertRoom,
      amenities: insertRoom.amenities ? JSON.stringify(insertRoom.amenities) : null,
      images: insertRoom.images ? JSON.stringify(insertRoom.images) : null,
    };
    const [room] = await db.insert(rooms).values(roomData as any).returning();
    return {
      ...room,
      amenities: room.amenities ? JSON.parse(room.amenities as string) : null,
      images: room.images ? JSON.parse(room.images as string) : null,
    } as Room;
  }

  async updateRoom(id: number, updateData: Partial<InsertRoom>): Promise<Room | undefined> {
    const roomData: any = { ...updateData };

    // Convert arrays to JSON strings
    if (updateData.amenities) {
      roomData.amenities = JSON.stringify(updateData.amenities);
    }
    if (updateData.images) {
      roomData.images = JSON.stringify(updateData.images);
    }

    const [updatedRoom] = await db
      .update(rooms)
      .set(roomData)
      .where(eq(rooms.id, id))
      .returning();

    if (!updatedRoom) return undefined;

    return {
      ...updatedRoom,
      amenities: updatedRoom.amenities ? JSON.parse(updatedRoom.amenities as string) : null,
      images: updatedRoom.images ? JSON.parse(updatedRoom.images as string) : null,
    } as Room;
  }

  async deleteRoom(id: number): Promise<boolean> {
    try {
      // Use raw SQLite3 for DELETE operation
      const { rawDb } = await import("./db");

      // Prepare and execute DELETE statement
      const stmt = rawDb.prepare("DELETE FROM rooms WHERE id = ?");
      const result = stmt.run(id);

      // Log the number of rows affected
      console.log(`[DELETE] Room ID ${id}: ${result.changes} row(s) deleted`);

      // Return true if at least one row was deleted
      return result.changes > 0;
    } catch (error) {
      console.error(`[DELETE ERROR] Failed to delete room ${id}:`, error);
      throw error;
    }
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
}

export const storage = new DatabaseStorage();
