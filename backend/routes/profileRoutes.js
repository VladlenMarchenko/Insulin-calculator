const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const c = require("../controllers/profileController");

// профиль текущего пользователя
router.get("/", auth, c.getProfile);

// обновление профиля
router.post("/", auth, c.updateProfile);

// профиль пациента для врача
router.get("/patient/:id", auth, c.getPatientProfile);

// ✅ подтверждение пациента врачом
router.post("/approve/:id", auth, c.approvePatient);

module.exports = router;
