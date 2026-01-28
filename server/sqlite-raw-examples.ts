/**
 * EXAMPLE: Sử dụng sqlite3 thuần túy (không dùng Drizzle ORM)
 * 
 * Lưu ý: Dự án hiện tại đang sử dụng better-sqlite3 với Drizzle ORM
 * File này chỉ để tham khảo cách sử dụng sqlite3 thuần túy
 */

import Database from 'better-sqlite3';
import { join } from 'path';

// Kết nối database
const dbPath = join(__dirname, '..', '.local', 'db.sqlite');
const db = new Database(dbPath);

/**
 * VÍ DỤ 1: Lấy tất cả rooms bằng db.all()
 */
export function getAllRoomsRaw() {
    try {
        // Sử dụng prepare() và all() để lấy tất cả records
        const stmt = db.prepare('SELECT * FROM rooms ORDER BY created_at DESC');
        const rooms = stmt.all();

        // Parse JSON fields
        return rooms.map((room: any) => ({
            ...room,
            amenities: room.amenities ? JSON.parse(room.amenities) : null,
            images: room.images ? JSON.parse(room.images) : null,
        }));
    } catch (error) {
        console.error('Error fetching rooms:', error);
        throw error;
    }
}

/**
 * VÍ DỤ 2: Lấy một room theo ID bằng db.get()
 */
export function getRoomByIdRaw(id: number) {
    try {
        const stmt = db.prepare('SELECT * FROM rooms WHERE id = ?');
        const room = stmt.get(id);

        if (!room) return null;

        return {
            ...room,
            amenities: (room as any).amenities ? JSON.parse((room as any).amenities) : null,
            images: (room as any).images ? JSON.parse((room as any).images) : null,
        };
    } catch (error) {
        console.error('Error fetching room:', error);
        throw error;
    }
}

/**
 * VÍ DỤ 3: Thêm room mới bằng db.run()
 */
export function createRoomRaw(roomData: {
    name: string;
    type: string;
    price: number;
    status?: string;
    projectId?: number;
    description?: string;
    amenities?: string[];
    images?: string[];
}) {
    try {
        const stmt = db.prepare(`
      INSERT INTO rooms (name, type, price, status, project_id, description, amenities, images)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

        const result = stmt.run(
            roomData.name,
            roomData.type,
            roomData.price,
            roomData.status || 'available',
            roomData.projectId || null,
            roomData.description || null,
            roomData.amenities ? JSON.stringify(roomData.amenities) : null,
            roomData.images ? JSON.stringify(roomData.images) : null
        );

        // Lấy room vừa tạo
        return getRoomByIdRaw(result.lastInsertRowid as number);
    } catch (error) {
        console.error('Error creating room:', error);
        throw error;
    }
}

/**
 * VÍ DỤ 4: Cập nhật room bằng db.run()
 */
export function updateRoomRaw(id: number, updates: {
    name?: string;
    type?: string;
    price?: number;
    status?: string;
    description?: string;
    amenities?: string[];
    images?: string[];
}) {
    try {
        const fields: string[] = [];
        const values: any[] = [];

        if (updates.name !== undefined) {
            fields.push('name = ?');
            values.push(updates.name);
        }
        if (updates.type !== undefined) {
            fields.push('type = ?');
            values.push(updates.type);
        }
        if (updates.price !== undefined) {
            fields.push('price = ?');
            values.push(updates.price);
        }
        if (updates.status !== undefined) {
            fields.push('status = ?');
            values.push(updates.status);
        }
        if (updates.description !== undefined) {
            fields.push('description = ?');
            values.push(updates.description);
        }
        if (updates.amenities !== undefined) {
            fields.push('amenities = ?');
            values.push(JSON.stringify(updates.amenities));
        }
        if (updates.images !== undefined) {
            fields.push('images = ?');
            values.push(JSON.stringify(updates.images));
        }

        if (fields.length === 0) {
            throw new Error('No fields to update');
        }

        values.push(id);

        const stmt = db.prepare(`
      UPDATE rooms 
      SET ${fields.join(', ')}
      WHERE id = ?
    `);

        stmt.run(...values);

        return getRoomByIdRaw(id);
    } catch (error) {
        console.error('Error updating room:', error);
        throw error;
    }
}

/**
 * VÍ DỤ 5: Xóa room bằng db.run()
 */
export function deleteRoomRaw(id: number) {
    try {
        const stmt = db.prepare('DELETE FROM rooms WHERE id = ?');
        const result = stmt.run(id);

        return result.changes > 0;
    } catch (error) {
        console.error('Error deleting room:', error);
        throw error;
    }
}

/**
 * VÍ DỤ 6: Tìm kiếm rooms với điều kiện
 */
export function searchRoomsRaw(filters: {
    type?: string;
    status?: string;
    minPrice?: number;
    maxPrice?: number;
}) {
    try {
        const conditions: string[] = [];
        const values: any[] = [];

        if (filters.type) {
            conditions.push('type = ?');
            values.push(filters.type);
        }
        if (filters.status) {
            conditions.push('status = ?');
            values.push(filters.status);
        }
        if (filters.minPrice !== undefined) {
            conditions.push('price >= ?');
            values.push(filters.minPrice);
        }
        if (filters.maxPrice !== undefined) {
            conditions.push('price <= ?');
            values.push(filters.maxPrice);
        }

        const whereClause = conditions.length > 0
            ? `WHERE ${conditions.join(' AND ')}`
            : '';

        const stmt = db.prepare(`
      SELECT * FROM rooms 
      ${whereClause}
      ORDER BY created_at DESC
    `);

        const rooms = stmt.all(...values);

        return rooms.map((room: any) => ({
            ...room,
            amenities: room.amenities ? JSON.parse(room.amenities) : null,
            images: room.images ? JSON.parse(room.images) : null,
        }));
    } catch (error) {
        console.error('Error searching rooms:', error);
        throw error;
    }
}

/**
 * VÍ DỤ 7: Đếm số lượng rooms
 */
export function countRoomsRaw() {
    try {
        const stmt = db.prepare('SELECT COUNT(*) as count FROM rooms');
        const result = stmt.get() as { count: number };
        return result.count;
    } catch (error) {
        console.error('Error counting rooms:', error);
        throw error;
    }
}

/**
 * VÍ DỤ 8: Transaction - Tạo nhiều rooms cùng lúc
 */
export function createMultipleRoomsRaw(roomsData: Array<{
    name: string;
    type: string;
    price: number;
    status?: string;
    projectId?: number;
    description?: string;
    amenities?: string[];
    images?: string[];
}>) {
    try {
        // Bắt đầu transaction
        const insertMany = db.transaction((rooms) => {
            const stmt = db.prepare(`
        INSERT INTO rooms (name, type, price, status, project_id, description, amenities, images)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

            for (const room of rooms) {
                stmt.run(
                    room.name,
                    room.type,
                    room.price,
                    room.status || 'available',
                    room.projectId || null,
                    room.description || null,
                    room.amenities ? JSON.stringify(room.amenities) : null,
                    room.images ? JSON.stringify(room.images) : null
                );
            }
        });

        // Thực thi transaction
        insertMany(roomsData);

        return true;
    } catch (error) {
        console.error('Error creating multiple rooms:', error);
        throw error;
    }
}

/**
 * CÁCH SỬ DỤNG TRONG EXPRESS ROUTE
 */
export function exampleExpressRoute() {
    // Ví dụ route handler
    const exampleCode = `
  import express from 'express';
  import { getAllRoomsRaw, createRoomRaw } from './sqlite-raw-examples';
  
  const app = express();
  
  // GET /api/admin/rooms - Lấy tất cả rooms
  app.get('/api/admin/rooms', async (req, res) => {
    try {
      const rooms = getAllRoomsRaw();
      res.json(rooms);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch rooms' });
    }
  });
  
  // POST /api/admin/rooms - Tạo room mới
  app.post('/api/admin/rooms', async (req, res) => {
    try {
      const newRoom = createRoomRaw(req.body);
      res.status(201).json(newRoom);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create room' });
    }
  });
  `;

    return exampleCode;
}

// Export database instance nếu cần sử dụng trực tiếp
export { db };
