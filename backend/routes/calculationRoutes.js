const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const c = require("../controllers/calculationController");

router.post("/", auth, c.addCalculation);
router.get("/my", auth, c.getMyHistory);
router.get("/patients", auth, c.getPatients);
router.get("/patients/:id", auth, c.getPatientHistory);

// ✅ подтверждение дозы
router.post("/approve-dose/:id", auth, c.approveDose);

module.exports = router;
