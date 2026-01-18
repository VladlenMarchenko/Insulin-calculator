const { db } = require("../db");

exports.addCalculation = async (req, res) => {
  try {
    const { breadUnits, glucose, dose, interpretation } = req.body;

    await db.query(
      `
      INSERT INTO calculations
      (user_id, bread_units, glucose, dose, interpretation)
      VALUES ($1, $2, $3, $4, $5)
      `,
      [req.user.id, breadUnits, glucose, dose, interpretation]
    );

    res.json({ message: "Saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyHistory = async (req, res) => {
  const result = await db.query(
    `
    SELECT * FROM calculations
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
    [req.user.id]
  );

  res.json(result.rows);
};

exports.getPatients = async (req, res) => {
  const result = await db.query(
    `
    SELECT id, email, name
    FROM users
    WHERE role = 'patient'
    `
  );

  res.json(result.rows);
};

exports.getPatientHistory = async (req, res) => {
  const result = await db.query(
    `
    SELECT *
    FROM calculations
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
    [req.params.id]
  );

  res.json(result.rows);
};

exports.approveDose = async (req, res) => {
  try {
    const { comment } = req.body;

    await db.query(
      `
      UPDATE calculations
      SET dose_approved = true,
          doctor_comment = $1
      WHERE id = $2
      `,
      [comment || null, req.params.id]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
