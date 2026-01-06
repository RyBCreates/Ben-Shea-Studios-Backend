const router = require("express").Router();

const {
  signupForDiscount,
  getAllDiscountEmails,
  validateDiscountCode,
} = require("../controllers/discountController");

router.post("/signup", signupForDiscount);
router.get("/emails", getAllDiscountEmails);
router.post("/validate", validateDiscountCode);

module.exports = router;
