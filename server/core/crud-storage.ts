import { db } from "./db";
import { projects, posts, services } from "@shared/schema";
import { eq } from "drizzle-orm";
import type { InsertProject, Project, InsertPost, Post, InsertService, Service } from "@shared/schema";

/**
 * CRUD Storage Methods cho Projects, Posts, Services
 * Implement update và delete operations
 */

// ==================== PROJECTS ====================

/**
 * Update Project by ID
 * @returns Updated project hoặc undefined nếu không tìm thấy
 */
export async function updateProject(
    id: number,
    updateData: Partial<InsertProject>
): Promise<Project | undefined> {
    try {
        // Prepare data với JSON stringify cho arrays
        const projectData: any = { ...updateData };

        if (updateData.tags) {
            projectData.tags = JSON.stringify(updateData.tags);
        }

        if (updateData.images) {
            projectData.images = JSON.stringify(updateData.images);
        }

        // Update trong database
        const [updated] = await db
            .update(projects)
            .set(projectData)
            .where(eq(projects.id, id))
            .returning();

        if (!updated) return undefined;

        // Parse JSON fields trước khi return
        return {
            ...updated,
            tags: updated.tags ? JSON.parse(updated.tags as string) : null,
            images: updated.images ? JSON.parse(updated.images as string) : null,
        } as Project;
    } catch (error) {
        console.error('[updateProject] Error:', error);
        throw error;
    }
}

/**
 * Delete Project by ID
 * @returns true nếu xóa thành công, false nếu không tìm thấy
 */
export async function deleteProject(id: number): Promise<boolean> {
    try {
        const result = await db
            .delete(projects)
            .where(eq(projects.id, id))
            .returning();

        return result.length > 0;
    } catch (error) {
        console.error('[deleteProject] Error:', error);
        throw error;
    }
}

// ==================== POSTS ====================

/**
 * Update Post by ID
 */
export async function updatePost(
    id: number,
    updateData: Partial<InsertPost>
): Promise<Post | undefined> {
    try {
        const [updated] = await db
            .update(posts)
            .set(updateData)
            .where(eq(posts.id, id))
            .returning();

        return updated;
    } catch (error) {
        console.error('[updatePost] Error:', error);
        throw error;
    }
}

/**
 * Delete Post by ID
 */
export async function deletePost(id: number): Promise<boolean> {
    try {
        const result = await db
            .delete(posts)
            .where(eq(posts.id, id))
            .returning();

        return result.length > 0;
    } catch (error) {
        console.error('[deletePost] Error:', error);
        throw error;
    }
}

// ==================== SERVICES ====================

/**
 * Update Service by ID
 */
export async function updateService(
    id: number,
    updateData: Partial<InsertService>
): Promise<Service | undefined> {
    try {
        const [updated] = await db
            .update(services)
            .set(updateData)
            .where(eq(services.id, id))
            .returning();

        return updated;
    } catch (error) {
        console.error('[updateService] Error:', error);
        throw error;
    }
}

/**
 * Delete Service by ID
 */
export async function deleteService(id: number): Promise<boolean> {
    try {
        const result = await db
            .delete(services)
            .where(eq(services.id, id))
            .returning();

        return result.length > 0;
    } catch (error) {
        console.error('[deleteService] Error:', error);
        throw error;
    }
}
