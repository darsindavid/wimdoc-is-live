import { db } from "../../core/db.js";

/* -------------------------------------------------------
   GET ALL BOOKINGS (JOINED WITH DOCTORS + SLOTS)
-------------------------------------------------------- */
export async function getAllBookings() {
  const result = await db.query(
    `
    SELECT
      b.id,
      b.slot_id,
      b.user_name,
      b.status,
      b.created_at AS booking_created_at,
      s.start_time,
      s.end_time,
      s.doctor_id,
      d.name AS doctor_name
    FROM bookings b
    LEFT JOIN slots s ON s.id = b.slot_id
    LEFT JOIN doctors d ON d.id = s.doctor_id
    ORDER BY b.created_at DESC
    `
  );

  return result.rows;
}

/* -------------------------------------------------------
   CREATE BOOKING (TRANSACTION + SLOT LOCKING)
-------------------------------------------------------- */
export async function createBookingForSlot(
  slotId: number,
  userName: string | null = null
) {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const slotRes = await client.query(
      `
      SELECT id, doctor_id, is_booked
      FROM slots
      WHERE id = $1
      FOR UPDATE
      `,
      [slotId]
    );

    if (slotRes.rowCount === 0) {
      throw Object.assign(new Error("Slot not found"), { code: "SLOT_NOT_FOUND" });
    }

    const slot = slotRes.rows[0];

    if (slot.is_booked) {
      throw Object.assign(new Error("Slot already booked"), { code: "SLOT_ALREADY_BOOKED" });
    }

    const bookingRes = await client.query(
      `
      INSERT INTO bookings (slot_id, doctor_id, user_name, status)
      VALUES ($1, $2, $3, 'CONFIRMED')
      RETURNING *
      `,
      [slotId, slot.doctor_id, userName]
    );

    await client.query(
      `
      UPDATE slots
      SET is_booked = TRUE
      WHERE id = $1
      `,
      [slotId]
    );

    await client.query("COMMIT");
    return bookingRes.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

/* -------------------------------------------------------
   EXPIRE OLD PENDING BOOKINGS
-------------------------------------------------------- */
export async function expireOldBookings() {
  const result = await db.query(
    `
    UPDATE bookings
    SET status = 'FAILED'
    WHERE status = 'PENDING'
      AND created_at < NOW() - INTERVAL '2 minutes'
    RETURNING *
    `
  );

  return result.rows;
}