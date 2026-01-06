
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage.ts";
import { api, errorSchemas } from "@shared/routes";
import { z } from "zod";
import { randomBytes } from "crypto";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Helper to generate random slug
  function generateSlug(length = 6): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  app.get(api.rooms.get.path, async (req, res) => {
    try {
      const { slug } = req.params;
      const room = await storage.getRoom(slug);

      if (!room) {
        try {
          const newRoom = await storage.createRoom({
            slug,
            content: "",
            isPrivate: false,
            passwordHash: undefined,
            expiresAt: undefined,
            createdIp: req.ip
          });
          return res.json(newRoom);
        } catch (createErr) {
          // If creation fails (e.g. race condition), try getting it one more time
          const secondTry = await storage.getRoom(slug);
          if (secondTry) return res.json(secondTry);
          throw createErr;
        }
      }


      // Check access
      if (room.isPrivate) {
        // If it's private, we expect a password verification or prior session
        // For REST MVP, we can check a header or just return 403 and let client call verify
        // But the 'get' route usually returns content.
        // If private, we return the metadata but NOT the content, unless authorized.
        // Or we stick to the contract: 403 if private.
        // The contract says 403 returns { isPrivate: true, message: "Password required" }
        // We'll assume the client calls verify separately to get a token, or sends password in header.
        // BUT, for simplicity in MVP:
        // Client tries GET. If 403, Client shows Modal -> POST /verify -> Success.
        // Then Client knows it's verified.
        // BUT how does the Client GET the content after verification?
        // Maybe POST /verify returns the content?
        // Or GET accepts ?password=... (insecure query param) or header `x-room-password`.
        // Let's implement `x-room-password` header check for simplicity.

        const passwordHeader = req.headers['x-room-password'] as string;
        if (!passwordHeader) {
          return res.status(403).json({ isPrivate: true, message: "Password required" });
        }

        const isValid = await storage.verifyPassword(passwordHeader, room.passwordHash!);
        if (!isValid) {
          return res.status(403).json({ isPrivate: true, message: "Invalid password" });
        }
      }

      // If we get here, access is granted (public or valid password)
      res.json(room);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.rooms.create.path, async (req, res) => {
    try {
      const input = api.rooms.create.input.parse(req.body);

      let slug = input.slug;
      if (!slug) {
        // Generate unique slug
        let attempts = 0;
        while (attempts < 5) {
          const candidate = generateSlug();
          const existing = await storage.getRoom(candidate);
          if (!existing) {
            slug = candidate;
            break;
          }
          attempts++;
        }
        if (!slug) {
          return res.status(500).json({ message: "Failed to generate unique slug" });
        }
      } else {
        // Check provided slug
        const existing = await storage.getRoom(slug);
        if (existing) {
          return res.status(409).json({ message: "Slug already exists" });
        }
      }

      let passwordHash = undefined;
      let isPrivate = false;

      if (input.password) {
        passwordHash = await storage.hashPassword(input.password);
        isPrivate = true;
      }

      const expiresAt = input.expiresIn ? new Date(Date.now() + input.expiresIn * 60 * 60 * 1000) : undefined;

      const room = await storage.createRoom({
        slug,
        content: input.content || "",
        isPrivate,
        passwordHash,
        expiresAt,
        createdIp: req.ip
      });

      res.status(201).json(room);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put(api.rooms.update.path, async (req, res) => {
    try {
      const { slug } = req.params;
      const input = api.rooms.update.input.parse(req.body);

      const room = await storage.getRoom(slug);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      // Authorization check
      if (room.isPrivate) {
        const password = input.password || (req.headers['x-room-password'] as string);
        if (!password) {
          return res.status(403).json({ message: "Password required" });
        }
        const isValid = await storage.verifyPassword(password, room.passwordHash!);
        if (!isValid) {
          return res.status(403).json({ message: "Invalid password" });
        }
      }

      const updates: any = {};
      if (input.content !== undefined) updates.content = input.content;

      // Update lock settings
      if (input.lockPassword) {
        updates.passwordHash = await storage.hashPassword(input.lockPassword);
        updates.isPrivate = true;
      }
      if (input.isPrivate !== undefined) {
        // Only allow disabling private mode if authenticated (already checked above)
        updates.isPrivate = input.isPrivate;
        if (!input.isPrivate) {
          updates.passwordHash = null;
        }
      }

      const updatedRoom = await storage.updateRoom(slug, updates);
      res.json(updatedRoom);

    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.rooms.verify.path, async (req, res) => {
    try {
      const { slug } = req.params;
      const { password } = api.rooms.verify.input.parse(req.body);

      const room = await storage.getRoom(slug);
      if (!room) {
        // To prevent enumeration, maybe 404 is okay
        return res.status(404).json({ message: "Room not found" });
      }

      if (!room.isPrivate) {
        return res.json({ success: true });
      }

      const isValid = await storage.verifyPassword(password, room.passwordHash!);
      if (isValid) {
        res.json({ success: true });
      } else {
        res.status(403).json({ message: "Invalid password" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
