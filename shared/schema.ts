import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

// === TABLE DEFINITIONS ===

// Projects / Homestays
export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(), // for friendly URLs
  slogan: text("slogan"), // e.g., "A second home..."
  description: text("description").notNull(),
  airbnbUrl: text("airbnb_url"), // External booking link
  isFeatured: integer("is_featured", { mode: "boolean" }).default(false),
  tags: text("tags"), // JSON string of tags
  images: text("images"), // JSON string of image URLs
  type: text("type").default("homestay"), // homestay, renovation, etc.
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Services
export const services = sqliteTable("services", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon"), // Identifier for icon to use on frontend
});

// Blog Posts
export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  category: text("category").notNull(), // 'Operating Stories', 'People & Stories'
  author: text("author"),
  imageUrl: text("image_url"),
  publishedAt: text("published_at").default(sql`CURRENT_TIMESTAMP`),
});

// Contact Messages
export const messages = sqliteTable("messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Rooms
export const rooms = sqliteTable("rooms", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'single', 'double', 'suite', etc.
  price: integer("price").notNull(), // Price per night
  status: text("status").default("available"), // 'available', 'occupied', 'maintenance'
  projectId: integer("project_id"), // Foreign key to projects
  description: text("description"),
  amenities: text("amenities"), // JSON string of amenities
  images: text("images"), // JSON string of image URLs
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// === SCHEMAS ===

export const insertProjectSchema = createInsertSchema(projects)
  .omit({ id: true, createdAt: true })
  .extend({
    tags: z.array(z.string()).optional().nullable(),
    images: z.array(z.string()).optional().nullable(),
  });
export const insertServiceSchema = createInsertSchema(services).omit({ id: true });
export const insertPostSchema = createInsertSchema(posts).omit({ id: true, publishedAt: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });

// Custom schema for rooms to handle arrays properly
export const insertRoomSchema = createInsertSchema(rooms)
  .omit({ id: true, createdAt: true })
  .extend({
    amenities: z.array(z.string()).optional().nullable(),
    images: z.array(z.string()).optional().nullable(),
  });

// === EXPLICIT API CONTRACT TYPES ===

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;

export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type Room = typeof rooms.$inferSelect;
export type InsertRoom = z.infer<typeof insertRoomSchema>;

export type CreateMessageRequest = InsertMessage;

// Users (Admin Authentication)
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(), // Hashed password
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const insertUserSchema = createInsertSchema(users)
  .omit({ id: true, createdAt: true })
  .extend({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
  });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
