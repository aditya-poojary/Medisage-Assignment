const express = require("express");
const { body, param, query, validationResult } = require("express-validator");

const {
  createProject,
  getProjects,
  getProjectById,
  deleteProjectById,
} = require("../controllers/projectController");
const {
  createTaskForProject,
  getTasksForProject,
} = require("../controllers/taskController");

const router = express.Router();

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  return next();
};

router.post(
  "/",
  [body("name").isString().trim().notEmpty(), body("description").optional().isString()],
  handleValidation,
  createProject
);

router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1 }),
  ],
  handleValidation,
  getProjects
);

router.get("/:id", [param("id").isMongoId()], handleValidation, getProjectById);
router.delete(
  "/:id",
  [param("id").isMongoId()],
  handleValidation,
  deleteProjectById
);

router.post(
  "/:project_id/tasks",
  [
    param("project_id").isMongoId(),
    body("title").isString().trim().notEmpty(),
    body("description").optional().isString(),
    body("status").optional().isIn(["todo", "in-progress", "done"]),
    body("priority").optional().isIn(["low", "medium", "high"]),
    body("due_date").optional().isISO8601(),
  ],
  handleValidation,
  createTaskForProject
);

router.get(
  "/:project_id/tasks",
  [
    param("project_id").isMongoId(),
    query("status").optional().isIn(["todo", "in-progress", "done"]),
    query("sort").optional().isIn(["asc", "desc"]),
  ],
  handleValidation,
  getTasksForProject
);

module.exports = router;
