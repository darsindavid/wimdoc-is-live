import { db } from "../../core/db.js";

// Struct types for clarity
export interface Doctor {
  id: number;
  name: string;
  specialization: string;
}

export interface NewDoctor {
  name: string;
  specialization: string;
}

export async function getAllDoctors(): Promise<Doctor[]> {
  const result = await db.query<Doctor>("SELECT * FROM doctors ORDER BY id ASC");
  return result.rows;
}

// -----------------------------
// Fetch one doctor by ID
// -----------------------------
export async function getDoctorById(id: number): Promise<Doctor | null> {
  const result = await db.query<Doctor>(
    "SELECT * FROM doctors WHERE id = $1",
    [id]
  );
  return (result.rows[0] ?? null) as Doctor | null;
}

// -----------------------------
// Create new doctor
// -----------------------------
export async function addDoctor(data: NewDoctor): Promise<Doctor> {
  const result = await db.query<Doctor>(
    `
      INSERT INTO doctors (name, specialization)
      VALUES ($1, $2)
      RETURNING *
    `,
    [data.name, data.specialization]
  );

return result.rows[0] as Doctor;
}

// -----------------------------
// Update doctor
// -----------------------------
export async function updateDoctor(
  id: number,
  updates: Partial<NewDoctor>
): Promise<Doctor | null> {
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

  const result = await db.query<Doctor>(
    `
      UPDATE doctors
      SET ${fields.join(", ")}
      WHERE id = $${index}
      RETURNING *
    `,
    values
  );

  return (result.rows[0] ?? null) as Doctor | null;
}

// -----------------------------
// Delete doctor + its slots
// -----------------------------
export async function deleteDoctor(id: number): Promise<boolean> {
  // Cascade delete slots first
  await db.query("DELETE FROM slots WHERE doctor_id = $1", [id]);

  const result = await db.query(
    "DELETE FROM doctors WHERE id = $1 RETURNING *",
    [id]
  );

  return (result.rowCount ?? 0) > 0;
}

// -----------------------------
// Generate doctor schedule
// -----------------------------
export async function generateDoctorSchedule(
  doctorId: number,
  date: string,          // YYYY-MM-DD
  startHour: number,
  endHour: number,
  durationMinutes: number
) {
  const slots: { start: Date; end: Date }[] = [];

  const base = new Date(`${date}T00:00:00`);
  const start = new Date(base.getTime() + startHour * 3600000);
  const end = new Date(base.getTime() + endHour * 3600000);

  let cursor = new Date(start);

  while (cursor < end) {
    const slotStart = new Date(cursor);
    const slotEnd = new Date(cursor.getTime() + durationMinutes * 60000);

    slots.push({ start: slotStart, end: slotEnd });
    cursor = slotEnd;
  }

  const values = slots
    .map((_, i) => `($1, $${i * 2 + 2}, $${i * 2 + 3}, FALSE)`)
    .join(",");

  const params: any[] = [doctorId];
  slots.forEach((s) => params.push(s.start, s.end));

  const result = await db.query(
    `
      INSERT INTO slots (doctor_id, start_time, end_time, is_booked)
      VALUES ${values}
      RETURNING *
    `,
    params
  );

  return result.rows;
}
