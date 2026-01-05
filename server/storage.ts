
import { rooms, type Room, type InsertRoom, type UpdateRoomRequest } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export interface IStorage {
  getRoom(slug: string): Promise<Room | undefined>;
  createRoom(room: InsertRoom): Promise<Room>;
  updateRoom(slug: string, updates: Partial<InsertRoom>): Promise<Room | undefined>;
  hashPassword(password: string): Promise<string>;
  verifyPassword(password: string, hash: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getRoom(slug: string): Promise<Room | undefined> {
    const [room] = await db.select().from(rooms).where(eq(rooms.slug, slug));
    return room;
  }

  async createRoom(insertRoom: InsertRoom): Promise<Room> {
    const [room] = await db.insert(rooms).values(insertRoom).returning();
    return room;
  }

  async updateRoom(slug: string, updates: Partial<InsertRoom>): Promise<Room | undefined> {
    const [room] = await db
      .update(rooms)
      .set({ ...updates, updatedAt: new Date() }) // Manually update updatedAt if needed, though defaultNow() is for creation
      .where(eq(rooms.slug, slug))
      .returning();
    return room;
  }

  async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString("hex");
    const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${salt}:${derivedKey.toString("hex")}`;
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    const [salt, key] = hash.split(":");
    const keyBuffer = Buffer.from(key, "hex");
    const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
    return timingSafeEqual(keyBuffer, derivedKey);
  }
}

export const storage = new DatabaseStorage();
