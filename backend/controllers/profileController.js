const { db } = require("../db");

exports.getProfile = async (req, res) => {
  const result = await db.query(
    `
    SELECT
      email,
      name,
      height,
      weight,
      diseases,
      photo,
      position,
      workplace,
      approved
    FROM users
    WHERE id = $1
    `,
    [req.user.id]
  );

  res.json(result.rows[0] || {});
};

exports.updateProfile = async (req, res) => {
  const {
    name,
    height,
    weight,
    diseases,
    photo,
    position,
    workplace,
  } = req.body;

  await db.query(
    `
    UPDATE users SET
      name = $1,
      height = $2,
      weight = $3,
      diseases = $4,
      photo = $5,
      position = $6,
      workplace = $7
    WHERE id = $8
    `,
    [
      name,
      height,
      weight,
      diseases,
      photo,
      position,
      workplace,
      req.user.id,
    ]
  );

  res.json({
    name,
    height,
    weight,
    diseases,
    photo,
    position,
    workplace,
  });
};

exports.approvePatient = async (req, res) => {
  await db.query(
    "UPDATE users SET approved = true WHERE id = $1",
    [req.params.id]
  );

  res.json({ success: true });
};

exports.getPatientProfile = async (req, res) => {
  const result = await db.query(
    `
    SELECT
      email,
      name,
      height,
      weight,
      diseases,
      photo,
      approved
    FROM users
    WHERE id = $1
    `,
    [req.params.id]
  );

  res.json(result.rows[0] || {});
};
