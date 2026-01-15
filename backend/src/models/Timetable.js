const pool = require('../config/database');

class Timetable {
  static async create({ userId, subject, dayOfWeek, startTime, endTime, location }) {
    const query = `
      INSERT INTO timetable_entries (user_id, subject, day_of_week, start_time, end_time, location)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const result = await pool.query(query, [
      userId,
      subject,
      dayOfWeek,
      startTime,
      endTime,
      location,
    ]);
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const query = `
      SELECT * FROM timetable_entries
      WHERE user_id = $1
      ORDER BY day_of_week ASC, start_time ASC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  static async findById(id, userId) {
    const query = 'SELECT * FROM timetable_entries WHERE id = $1 AND user_id = $2';
    const result = await pool.query(query, [id, userId]);
    return result.rows[0];
  }

  static async update(id, userId, updates) {
    const allowedFields = ['subject', 'day_of_week', 'start_time', 'end_time', 'location'];
    const setClause = [];
    const params = [];
    let paramIndex = 1;

    Object.keys(updates).forEach((key) => {
      if (allowedFields.includes(key)) {
        setClause.push(`${key} = $${paramIndex}`);
        params.push(updates[key]);
        paramIndex++;
      }
    });

    if (setClause.length === 0) {
      throw new Error('No valid fields to update');
    }

    params.push(id, userId);
    const query = `
      UPDATE timetable_entries
      SET ${setClause.join(', ')}
      WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1}
      RETURNING *
    `;

    const result = await pool.query(query, params);
    return result.rows[0];
  }

  static async delete(id, userId) {
    const query = 'DELETE FROM timetable_entries WHERE id = $1 AND user_id = $2 RETURNING *';
    const result = await pool.query(query, [id, userId]);
    return result.rows[0];
  }

  static async getSubjects(userId) {
    const query = `
      SELECT DISTINCT subject FROM timetable_entries
      WHERE user_id = $1
      ORDER BY subject ASC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows.map((row) => row.subject);
  }
}

module.exports = Timetable;
