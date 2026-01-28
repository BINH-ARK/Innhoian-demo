import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { type User } from "@shared/schema";
import MemoryStore from "memorystore";
import createMemoryStore from "memorystore";

export function setupAuth(app: Express) {
    const sessionSettings: session.SessionOptions = {
        secret: process.env.SESSION_SECRET || "inn-hoian-secret-key",
        resave: false,
        saveUninitialized: false,
        // Tạo Store trước

    };
    const MemoryStore = createMemoryStore(session);
    // ... bên trong object cấu hình session
    session({
        secret: process.env.SESSION_SECRET || "secret",
        resave: false,
        saveUninitialized: false,

        // 2. Sử dụng Class đã tạo ở trên
        store: new MemoryStore({
            checkPeriod: 86400000 // prune expired entries every 24h
        }),

        cookie: {
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        }
    })

    app.use(session(sessionSettings));
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(
        new LocalStrategy(
            { usernameField: "email" },
            async (email, password, done) => {
                try {
                    const user = await storage.getUserByEmail(email);

                    if (!user) {
                        return done(null, false, { message: "Incorrect email." });
                    }

                    const isValidPassword = await bcrypt.compare(password, user.password);

                    if (!isValidPassword) {
                        return done(null, false, { message: "Incorrect password." });
                    }

                    return done(null, user);
                } catch (err) {
                    return done(err);
                }
            }
        )
    );

    passport.serializeUser((user: any, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id: number, done) => {
        try {
            const user = await storage.getUser(id);

            if (!user) {
                return done(null, false);
            }

            done(null, user);
        } catch (err) {
            done(err);
        }
    });
}
