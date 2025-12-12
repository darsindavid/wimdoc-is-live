import { db } from "../../core/db.js";

export interface Slot {
  id: number;
  doctor_id: number;
  start_time: Date;
  end_time: Date;
  is_booked: boolean;
}

export interface NewSlot {
  doctor_id: number;
  start_time: Date;
  end_time: Date;
}

// -----------------------------
// Get ALL slots
// -----------------------------
export async function getAllSlots(): Promise<Slot[]> {
  const result = await db.query<Slot>("SELECT * FROM slots ORDER BY start_time ASC");
  return result.rows;
}

// -----------------------------
// Get slot by ID
// -----------------------------
export async function getSlotById(id: number): Promise<Slot | null> {
  const result = await db.query<Slot>(
    "SELECT * FROM slots WHERE id = $1",
    [id]
  );
  return (result.rows[0] ?? null) as Slot | null;
}

// -----------------------------
// Create manual slot
// -----------------------------
export async function addSlot(data: NewSlot): Promise<Slot> {
  const result = await db.query<Slot>(
    `
      INSERT INTO slots (doctor_id, start_time, end_time, is_booked)
      VALUES ($1, $2, $3, FALSE)
      RETURNING *
    `,
    [data.doctor_id, data.start_time, data.end_time]
  );

return result.rows[0] as Slot;
}

// -----------------------------
// Update slot
// -----------------------------
export async function updateSlot(
  id: number,
  updates: Partial<Omit<Slot, "id">>
): Promise<Slot | null> {
  const fields = [];
  const values: any[] = [];
  let index = 1;

  for (const key in updates) {
    fields.push(`${key} = $${index}`);
    values.push((updates as any)[key]);
    index++;
  }

  if (fields.length === 0) return null;

  values.push(id);

  const result = await db.query<Slot>(
    `
      UPDATE slots
      SET ${fields.join(", ")}
      WHERE id = $${index}
      RETURNING *
    `,
    values
  );

  return (result.rows[0] ?? null) as Slot | null;
}

// -----------------------------
// Delete slot
// -----------------------------
export async function deleteSlot(id: number): Promise<boolean> {
  const x = await db.query("DELETE FROM slots WHERE id = $1", [id]);
  return (x.rowCount ?? 0) > 0;
}

// -----------------------------
// Available slots
// -----------------------------
export async function getAvailableSlots(): Promise<Slot[]> {
  const result = await db.query<Slot>(
    `
      SELECT * FROM slots
      WHERE is_booked = FALSE
      ORDER BY start_time ASC
    `
  );
  return result.rows;
}

// -----------------------------
// Search slots
// -----------------------------
export async function searchSlots(
  doctorId?: number,
  date?: string,
  onlyAvailable?: boolean
): Promise<Slot[]> {
  const conditions = [];
  const values: any[] = [];

  if (doctorId) {
    conditions.push(`doctor_id = $${values.length + 1}`);
    values.push(doctorId);
  }

  if (date) {
    conditions.push(`DATE(start_time) = $${values.length + 1}`);
    values.push(date);
  }

  if (onlyAvailable) {
    conditions.push(`is_booked = FALSE`);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const query = `
    SELECT * FROM slots
    ${whereClause}
    ORDER BY start_time ASC
  `;

  const result = await db.query<Slot>(query, values);
  return result.rows;
}

// -----------------------------
// Pagination
// -----------------------------
export async function getPaginatedSlots(
  page: number,
  limit: number,
  sort: string = "start_time",
  order: "asc" | "desc" = "asc"
): Promise<Slot[]> {
  const offset = (page - 1) * limit;

  const allowedSorts = ["start_time", "end_time", "doctor_id"];
  if (!allowedSorts.includes(sort)) sort = "start_time";

  const result = await db.query<Slot>(
    `
      SELECT * FROM slots
      ORDER BY ${sort} ${order}
      LIMIT $1 OFFSET $2
    `,
    [limit, offset]
  );

  return result.rows;
}

// -----------------------------
// Concurrency-safe atomic booking
// -----------------------------
export async function reserveSlotAtomically(
  slotId: number
): Promise<Slot | null> {
  const result = await db.query<Slot>(
    `
      UPDATE slots
      SET is_booked = TRUE
      WHERE id = $1 AND is_booked = FALSE
      RETURNING *
    `,
    [slotId]
  );

  return (result.rows[0] ?? null) as Slot | null;
}
