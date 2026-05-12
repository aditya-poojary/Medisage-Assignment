const Project = require("../models/Project");
const Task = require("../models/Task");

const createProject = async (req, res) => {
  const project = await Project.create({
    name: req.body.name,
    description: req.body.description,
  });

  return res.status(201).json(project);
};

const getProjects = async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
  const skip = (page - 1) * limit;

  const [projects, total] = await Promise.all([
    Project.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    Project.countDocuments(),
  ]);

  return res.status(200).json({
    data: projects,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  });
};

const getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  return res.status(200).json(project);
};

const deleteProjectById = async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  await Task.deleteMany({ project_id: req.params.id });

  return res.status(200).json({ message: "Project deleted successfully" });
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  deleteProjectById,
};
