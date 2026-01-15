const pool = require('../config/database');

class Task {
  static async create({
    userId,
    subject,
    title,
    description,
    deadline,
    priority,
    status = 'todo',
    isRecurring = false,
    recurrenceType = null,
  }) {
    const query = `
      INSERT INTO tasks (user_id, subject, title, description, deadline, priority, status, is_recurring, recurrence_type)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const result = await pool.query(query, [
      userId,
      subject,
      title,
      description,
      deadline,
      priority,
      status,
      isRecurring,
      recurrenceType,
    ]);
    return result.rows[0];
  }

  static async findByUserId(userId, filters = {}) {
    let query = 'SELECT * FROM tasks WHERE user_id = $1';
    const params = [userId];
    let paramIndex = 2;

    if (filters.status) {
      query += ` AND status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }

    if (filters.priority) {
      query += ` AND priority = $${paramIndex}`;
      params.push(filters.priority);
      paramIndex++;
    }

    if (filters.startDate) {
      query += ` AND deadline >= $${paramIndex}`;
      params.push(filters.startDate);
      paramIndex++;
    }

    if (filters.endDate) {
      query += ` AND deadline <= $${paramIndex}`;
      params.push(filters.endDate);
      paramIndex++;
    }

    query += ' ORDER BY deadline ASC, priority DESC';

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async findById(id, userId) {
    const query = 'SELECT * FROM tasks WHERE id = $1 AND user_id = $2';
    const result = await pool.query(query, [id, userId]);
    return result.rows[0];
  }

  static async update(id, userId, updates) {
    const allowedFields = [
      'subject',
      'title',
      'description',
      'deadline',
      'priority',
      'status',
      'is_recurring',
      'recurrence_type',
    ];
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
      UPDATE tasks
      SET ${setClause.join(', ')}
      WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1}
      RETURNING *
    `;

    const result = await pool.query(query, params);
    return result.rows[0];
  }

  static async delete(id, userId) {
    const query = 'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *';
    const result = await pool.query(query, [id, userId]);
    return result.rows[0];
  }

  static async findOverdue(userId) {
    const query = `
      SELECT * FROM tasks
      WHERE user_id = $1
        AND status != 'done'
        AND deadline < NOW()
      ORDER BY deadline ASC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }
}

module.exports = Task;
