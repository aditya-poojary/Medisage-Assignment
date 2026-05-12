"use client";

import { useMemo, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ProjectPage() {
  const params = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sort, setSort] = useState("desc");
  const [taskSearch, setTaskSearch] = useState("");
  const [statusUpdates, setStatusUpdates] = useState({});
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [error, setError] = useState("");
  const projectId = params?.id;

  const getStatusClass = (value) => {
    if (value === "in-progress") {
      return "status-in-progress";
    }
    if (value === "done") {
      return "status-done";
    }
    return "status-todo";
  };

  const getPriorityClass = (value) => {
    if (value === "low") {
      return "priority-low";
    }
    if (value === "high") {
      return "priority-high";
    }
    return "priority-medium";
  };

  const fetchProject = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/projects/${projectId}`);
      setProject(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch project");
    }
  };

  const fetchTasks = async () => {
    setLoadingTasks(true);
    try {
      const query = { sort };
      if (filterStatus) {
        query.status = filterStatus;
      }
      const response = await axios.get(
        `${API_BASE_URL}/projects/${projectId}/tasks`,
        { params: query }
      );
      setTasks(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch tasks");
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    if (!projectId) {
      return;
    }
    setError("");
    fetchProject();
  }, [projectId]);

  useEffect(() => {
    if (!projectId) {
      return;
    }
    setError("");
    fetchTasks();
  }, [projectId, filterStatus, sort]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post(`${API_BASE_URL}/projects/${projectId}/tasks`, {
        title,
        description,
        status,
        priority,
        due_date: dueDate || undefined,
      });
      setTitle("");
      setDescription("");
      setStatus("todo");
      setPriority("medium");
      setDueDate("");
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task");
    }
  };

  const handleUpdateStatus = async (taskId, currentStatus) => {
    const nextStatus = statusUpdates[taskId] || currentStatus;
    setError("");
    try {
      await axios.put(`${API_BASE_URL}/tasks/${taskId}`, {
        status: nextStatus,
      });
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task status");
    }
  };

  const handleDeleteTask = async (taskId) => {
    setError("");
    try {
      await axios.delete(`${API_BASE_URL}/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete task");
    }
  };

  const visibleTasks = useMemo(() => {
    const query = taskSearch.trim().toLowerCase();
    if (!query) {
      return tasks;
    }
    return tasks.filter((task) => {
      return (
        task.title?.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query)
      );
    });
  }, [tasks, taskSearch]);

  return (
    <main className="ui-shell">
      <section className="panel">
        <div className="toolbar">
          <Link href="/" className="btn btn-secondary">
            Back to Projects
          </Link>
          <button type="button" onClick={fetchTasks} className="btn btn-secondary">
            Refresh Tasks
          </button>
        </div>
        {project && (
          <>
            <h1 className="title" style={{ fontSize: 24, marginTop: 10 }}>
              {project.name}
            </h1>
            <p className="subtitle">{project.description || "No description"}</p>
          </>
        )}
        <div className="stat-row">
          <span className="stat-pill">
            Filter: {filterStatus ? filterStatus : "all status"}
          </span>
          <span className="stat-pill">Sort: due date {sort}</span>
          <span className="stat-pill">Visible tasks: {visibleTasks.length}</span>
        </div>
      </section>

      {error && (
        <section className="panel">
          <p className="alert">{error}</p>
        </section>
      )}

      {!error && !project && (
        <section className="panel">
          <p className="muted">Loading project...</p>
        </section>
      )}

      <div className="landscape-grid">
        <section className="panel panel-sticky">
          <h2 className="section-title">Create Task</h2>
          <form onSubmit={handleCreateTask} className="form-grid">
            <div className="field">
              <label htmlFor="task-title">Task Title</label>
              <input
                id="task-title"
                type="text"
                placeholder="Enter task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="input-control"
              />
            </div>

            <div className="field">
              <label htmlFor="task-description">Description</label>
              <input
                id="task-description"
                type="text"
                placeholder="Enter description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-control"
              />
            </div>

            <div className="field">
              <label>Task Defaults</label>
              <div className="row">
                <div className="field" style={{ minWidth: 180 }}>
                  <label htmlFor="task-default-status">Status:</label>
                  <select
                    id="task-default-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="input-control"
                  >
                    <option value="todo">todo</option>
                    <option value="in-progress">in-progress</option>
                    <option value="done">done</option>
                  </select>
                </div>
                <div className="field" style={{ minWidth: 180 }}>
                  <label htmlFor="task-default-priority">Priority:</label>
                  <select
                    id="task-default-priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="input-control"
                  >
                    <option value="low">low</option>
                    <option value="medium">medium</option>
                    <option value="high">high</option>
                  </select>
                </div>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="input-control"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              Create Task
            </button>
          </form>

          <div className="divider" />
          <h2 className="section-title">Task View Options</h2>
          <div className="form-grid">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-control"
            >
              <option value="">all status</option>
              <option value="todo">todo</option>
              <option value="in-progress">in-progress</option>
              <option value="done">done</option>
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input-control"
            >
              <option value="desc">due date desc</option>
              <option value="asc">due date asc</option>
            </select>

            <input
              type="text"
              value={taskSearch}
              onChange={(e) => setTaskSearch(e.target.value)}
              placeholder="Search tasks in current result"
              className="input-control"
            />
          </div>
        </section>

        <section className="panel">
          <div className="toolbar">
            <h2 className="section-title" style={{ marginBottom: 0 }}>
              Tasks
            </h2>
            <span className="muted">
              {visibleTasks.length} of {tasks.length} shown
            </span>
          </div>

          {loadingTasks ? (
            <p className="muted">Loading tasks...</p>
          ) : visibleTasks.length === 0 ? (
            <p className="muted">No tasks found.</p>
          ) : (
            <div className="task-list">
              {visibleTasks.map((task) => (
                <div key={task._id} className="card">
                  <h4>{task.title}</h4>
                  <p className="meta">{task.description || "No description"}</p>
                  <div className="chip-row">
                    <span className={`chip ${getStatusClass(task.status)}`}>
                      status: {task.status}
                    </span>
                    <span className={`chip ${getPriorityClass(task.priority)}`}>
                      priority: {task.priority}
                    </span>
                    <span className="chip">
                      due:{" "}
                      {task.due_date ? new Date(task.due_date).toLocaleDateString() : "-"}
                    </span>
                  </div>

                  <div className="row">
                    <select
                      value={statusUpdates[task._id] || task.status}
                      onChange={(e) =>
                        setStatusUpdates((prev) => ({
                          ...prev,
                          [task._id]: e.target.value,
                        }))
                      }
                      className="input-control"
                      style={{ maxWidth: 180 }}
                    >
                      <option value="todo">todo</option>
                      <option value="in-progress">in-progress</option>
                      <option value="done">done</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(task._id, task.status)}
                      className="btn btn-primary"
                    >
                      Update Status
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteTask(task._id)}
                      className="btn btn-danger"
                    >
                      Delete Task
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
