const router = require("express").Router();

const {
  signupForDiscount,
  getAllDiscountEmails,
} = require("../controllers/discountController");

router.post("/signup", signupForDiscount);
router.get("/emails", getAllDiscountEmails);

module.exports = router;
