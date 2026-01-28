import type { Express } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import passport from "passport";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";

/**
 * Register authentication routes
 * Handles user registration, login, and logout
 */
export function registerAuthRoutes(app: Express) {

    // POST /api/auth/register - Register a new admin user
    app.post("/api/auth/register", async (req, res, next) => {
        try {
            console.log("[POST /api/auth/register] Registration attempt:", {
                email: req.body.email,
                fullName: req.body.fullName
            });

            // Validate request body with Zod
            const validationResult = insertUserSchema.safeParse(req.body);

            if (!validationResult.success) {
                const firstError = validationResult.error.errors[0];
                console.log("[POST /api/auth/register] Validation failed:", firstError);
                return res.status(400).json({
                    error: firstError.message,
                    field: firstError.path.join("."),
                });
            }

            const { email, password, fullName } = validationResult.data;

            // Check if user already exists
            const existingUser = await storage.getUserByEmail(email);

            if (existingUser) {
                console.log("[POST /api/auth/register] Email already exists:", email);
                return res.status(409).json({
                    error: "Email already exists",
                });
            }

            // Hash password using bcrypt
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Create new user
            const newUser = await storage.createUser({
                email,
                password: hashedPassword,
                fullName,
            });

            console.log("[POST /api/auth/register] User created successfully:", {
                id: newUser.id,
                email: newUser.email,
            });

            // Log the user in after registration
            req.login(newUser, (err) => {
                if (err) {
                    console.error("Login after registration failed:", err);
                    return next(err);
                }

                return res.status(201).json({
                    message: "User created and logged in successfully",
                    user: {
                        id: newUser.id,
                        email: newUser.email,
                        fullName: newUser.fullName,
                    },
                });
            });

        } catch (error) {
            console.error("[POST /api/auth/register] Error:", error);
            return res.status(500).json({
                error: "Internal server error",
                message: error instanceof Error ? error.message : "Unknown error",
            });
        }
    });

    // POST /api/auth/login
    app.post("/api/auth/login", (req, res, next) => {
        passport.authenticate("local", (err: any, user: any, info: any) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(401).json({ error: info?.message || "Invalid credentials" });
            }
            req.login(user, (err) => {
                if (err) {
                    return next(err);
                }
                return res.status(200).json({
                    message: "Login successful",
                    user: {
                        id: user.id,
                        email: user.email,
                        fullName: user.fullName,
                    },
                });
            });
        })(req, res, next);
    });

    // POST /api/auth/logout
    app.post("/api/auth/logout", (req, res, next) => {
        req.logout((err) => {
            if (err) {
                return next(err);
            }
            res.json({ message: "Logout successful" });
        });
    });

    // GET /api/user - Get current logged in user
    app.get("/api/user", (req, res) => {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ user: null });
        }
        // req.user is populated by passport
        const user = req.user as any;
        res.json({
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
            }
        });
    });
}
