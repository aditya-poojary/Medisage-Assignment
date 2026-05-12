const express = require("express");
const { body, param, validationResult } = require("express-validator");

const {
  updateTaskById,
  deleteTaskById,
} = require("../controllers/taskController");

const router = express.Router();

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  return next();
};

router.put(
  "/:id",
  [
    param("id").isMongoId(),
    body("title").optional().isString().trim().notEmpty(),
    body("description").optional().isString(),
    body("status").optional().isIn(["todo", "in-progress", "done"]),
    body("priority").optional().isIn(["low", "medium", "high"]),
    body("due_date").optional().isISO8601(),
  ],
  handleValidation,
  updateTaskById
);

router.delete("/:id", [param("id").isMongoId()], handleValidation, deleteTaskById);

module.exports = router;
