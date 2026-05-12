const Task = require("../models/Task");
const Project = require("../models/Project");

const createTaskForProject = async (req, res) => {
  const project = await Project.findById(req.params.project_id);

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  const task = await Task.create({
    project_id: req.params.project_id,
    title: req.body.title,
    description: req.body.description,
    status: req.body.status,
    priority: req.body.priority,
    due_date: req.body.due_date,
  });

  return res.status(201).json(task);
};

const getTasksForProject = async (req, res) => {
  const project = await Project.findById(req.params.project_id);

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  const status = req.query.status;
  const sort = req.query.sort;
  const filter = { project_id: req.params.project_id };

  if (status) {
    filter.status = status;
  }

  const tasks = await Task.find(filter).sort({
    due_date: sort === "asc" ? 1 : -1,
  });

  return res.status(200).json(tasks);
};

const updateTaskById = async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      priority: req.body.priority,
      due_date: req.body.due_date,
    },
    { new: true, runValidators: true }
  );

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  return res.status(200).json(task);
};

const deleteTaskById = async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  return res.status(200).json({ message: "Task deleted successfully" });
};

module.exports = {
  createTaskForProject,
  getTasksForProject,
  updateTaskById,
  deleteTaskById,
};
