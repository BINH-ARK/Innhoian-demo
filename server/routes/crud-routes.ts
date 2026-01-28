import type { Express } from "express";
import { storage } from "../core/storage";
import { z } from "zod";

/**
 * CRUD Routes cho Projects, Posts, Services
 * PUT (Update) và DELETE operations
 */

export function registerCrudRoutes(app: Express) {

    // ==================== PROJECTS CRUD ====================

    /**
     * UPDATE Project
     * PUT /api/admin/projects/:id
     */
    app.put('/api/admin/projects/:id', async (req, res) => {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    message: "Invalid project ID",
                });
            }

            const updateData = req.body;
            console.log(`[PUT /api/admin/projects/${id}] Update data:`, updateData);

            // Validate có data không
            if (!updateData || Object.keys(updateData).length === 0) {
                return res.status(400).json({
                    message: "No update data provided",
                });
            }

            // Update project
            const updated = await storage.updateProject(id, updateData);

            if (!updated) {
                return res.status(404).json({
                    message: `Project with ID ${id} not found`,
                });
            }

            console.log(`[PUT /api/admin/projects/${id}] Updated successfully:`, updated);
            return res.json(updated);

        } catch (error) {
            console.error('[PUT /api/admin/projects/:id] Error:', error);
            return res.status(500).json({
                message: "Failed to update project",
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    });

    /**
     * DELETE Project
     * DELETE /api/admin/projects/:id
     */
    app.delete('/api/admin/projects/:id', async (req, res) => {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    message: "Invalid project ID",
                });
            }

            console.log(`[DELETE /api/admin/projects/${id}] Deleting project`);

            const deleted = await storage.deleteProject(id);

            if (!deleted) {
                return res.status(404).json({
                    message: `Project with ID ${id} not found`,
                });
            }

            console.log(`[DELETE /api/admin/projects/${id}] Deleted successfully`);
            return res.json({
                success: true,
                message: "Project deleted successfully",
            });

        } catch (error) {
            console.error('[DELETE /api/admin/projects/:id] Error:', error);
            return res.status(500).json({
                message: "Failed to delete project",
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    });

    // ==================== POSTS CRUD ====================

    /**
     * UPDATE Post
     * PUT /api/posts/:id
     */
    app.put('/api/posts/:id', async (req, res) => {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    message: "Invalid post ID",
                });
            }

            const updateData = req.body;

            if (!updateData || Object.keys(updateData).length === 0) {
                return res.status(400).json({
                    message: "No update data provided",
                });
            }

            const updated = await storage.updatePost(id, updateData);

            if (!updated) {
                return res.status(404).json({
                    message: `Post with ID ${id} not found`,
                });
            }

            console.log(`[PUT /api/posts/${id}] Updated successfully`);
            return res.json(updated);

        } catch (error) {
            console.error('[PUT /api/posts/:id] Error:', error);
            return res.status(500).json({
                message: "Failed to update post",
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    });

    /**
     * DELETE Post
     * DELETE /api/posts/:id
     */
    app.delete('/api/posts/:id', async (req, res) => {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    message: "Invalid post ID",
                });
            }

            const deleted = await storage.deletePost(id);

            if (!deleted) {
                return res.status(404).json({
                    message: `Post with ID ${id} not found`,
                });
            }

            console.log(`[DELETE /api/posts/${id}] Deleted successfully`);
            return res.json({
                success: true,
                message: "Post deleted successfully",
            });

        } catch (error) {
            console.error('[DELETE /api/posts/:id] Error:', error);
            return res.status(500).json({
                message: "Failed to delete post",
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    });

    // ==================== SERVICES CRUD ====================

    /**
     * UPDATE Service
     * PUT /api/services/:id
     */
    app.put('/api/services/:id', async (req, res) => {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    message: "Invalid service ID",
                });
            }

            const updateData = req.body;

            if (!updateData || Object.keys(updateData).length === 0) {
                return res.status(400).json({
                    message: "No update data provided",
                });
            }

            const updated = await storage.updateService(id, updateData);

            if (!updated) {
                return res.status(404).json({
                    message: `Service with ID ${id} not found`,
                });
            }

            console.log(`[PUT /api/services/${id}] Updated successfully`);
            return res.json(updated);

        } catch (error) {
            console.error('[PUT /api/services/:id] Error:', error);
            return res.status(500).json({
                message: "Failed to update service",
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    });

    /**
     * DELETE Service
     * DELETE /api/services/:id
     */
    app.delete('/api/services/:id', async (req, res) => {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    message: "Invalid service ID",
                });
            }

            const deleted = await storage.deleteService(id);

            if (!deleted) {
                return res.status(404).json({
                    message: `Service with ID ${id} not found`,
                });
            }

            console.log(`[DELETE /api/services/${id}] Deleted successfully`);
            return res.json({
                success: true,
                message: "Service deleted successfully",
            });

        } catch (error) {
            console.error('[DELETE /api/services/:id] Error:', error);
            return res.status(500).json({
                message: "Failed to delete service",
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    });

    console.log('[CRUD Routes] Registered successfully:');
    console.log('  Projects:');
    console.log('    - PUT /api/admin/projects/:id');
    console.log('    - DELETE /api/admin/projects/:id');
    console.log('  Posts:');
    console.log('    - PUT /api/posts/:id');
    console.log('    - DELETE /api/posts/:id');
    console.log('  Services:');
    console.log('    - PUT /api/services/:id');
    console.log('    - DELETE /api/services/:id');
}
