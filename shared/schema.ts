
import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const rooms = pgTable("rooms", {
  slug: text("slug").primaryKey(),
  content: text("content").default(""),
  isPrivate: boolean("is_private").default(false),
  passwordHash: text("password_hash"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  lastAccessedAt: timestamp("last_accessed_at").defaultNow(),
  createdIp: text("created_ip"), // Basic auditing
});

export const insertRoomSchema = createInsertSchema(rooms).omit({
  createdAt: true,
  lastAccessedAt: true,
  createdIp: true
});

export type Room = typeof rooms.$inferSelect;
export type InsertRoom = z.infer<typeof insertRoomSchema>;

// Custom types for API
export type CreateRoomRequest = {
  slug?: string;
  content?: string;
  password?: string;
  expiresIn?: number; // hours
};

export type UpdateRoomRequest = {
  content?: string;
  password?: string; // To verify if private
  newPassword?: string; // To set/change password
  isPrivate?: boolean;
};
