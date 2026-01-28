import type { Express } from "express";
import { storage } from "../core/storage";
import { api } from "@shared/routes";

/**
 * View Detail Routes
 * GET endpoints để xem chi tiết Projects, Posts và Rooms theo ID
 */

export function registerViewDetailRoutes(app: Express) {

    /**
     * GET Project by ID
     * Endpoint: /api/projects/id/:id
     * 
     * Response 200: Project object
     * Response 404: { message: "Project not found" }
     */
    app.get(api.projects.getById.path, async (req, res) => {
        try {
            const id = parseInt(req.params.id);

            // Validate ID
            if (isNaN(id)) {
                return res.status(400).json({
                    message: "Invalid project ID. ID must be a number.",
                });
            }

            // Fetch project from database
            const project = await storage.getProjectById(id);

            // Handle not found
            if (!project) {
                return res.status(404).json({
                    message: `Project with ID ${id} not found.`,
                });
            }

            // Return project data
            return res.json(project);

        } catch (error) {
            console.error('[GET /api/projects/id/:id] Error:', error);
            return res.status(500).json({
                message: "Internal server error while fetching project.",
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    });

    /**
     * GET Post by ID
     * Endpoint: /api/posts/id/:id
     * 
     * Response 200: Post object
     * Response 404: { message: "Post not found" }
     */
    app.get(api.posts.getById.path, async (req, res) => {
        try {
            const id = parseInt(req.params.id);

            // Validate ID
            if (isNaN(id)) {
                return res.status(400).json({
                    message: "Invalid post ID. ID must be a number.",
                });
            }

            // Fetch post from database
            const post = await storage.getPostById(id);

            // Handle not found
            if (!post) {
                return res.status(404).json({
                    message: `Post with ID ${id} not found.`,
                });
            }

            // Return post data
            return res.json(post);

        } catch (error) {
            console.error('[GET /api/posts/id/:id] Error:', error);
            return res.status(500).json({
                message: "Internal server error while fetching post.",
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    });

    /**
     * GET Room by ID
     * Endpoint: /api/admin/rooms/id/:id
     * 
     * Response 200: Room object
     * Response 404: { message: "Room not found" }
     */
    app.get(api.rooms.getById.path, async (req, res) => {
        try {
            const id = parseInt(req.params.id);

            // Validate ID
            if (isNaN(id)) {
                return res.status(400).json({
                    message: "Invalid room ID. ID must be a number.",
                });
            }

            // Fetch room from database
            const room = await storage.getRoomById(id);

            // Handle not found
            if (!room) {
                return res.status(404).json({
                    message: `Room with ID ${id} not found.`,
                });
            }

            // Return room data
            return res.json(room);

        } catch (error) {
            console.error('[GET /api/admin/rooms/id/:id] Error:', error);
            return res.status(500).json({
                message: "Internal server error while fetching room.",
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    });

    console.log('[View Detail Routes] Registered successfully:');
    console.log('  - GET /api/projects/id/:id');
    console.log('  - GET /api/posts/id/:id');
    console.log('  - GET /api/admin/rooms/id/:id');
}
