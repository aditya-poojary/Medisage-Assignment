"use client";

import { useMemo, useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");

  const fetchProjects = async (currentPage = page) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${API_BASE_URL}/projects`, {
        params: { page: currentPage, limit: 10 },
      });
      setProjects(response.data.data || []);
      setTotalPages(response.data.pagination?.totalPages || 1);
      setPage(currentPage);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(1);
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post(`${API_BASE_URL}/projects`, { name, description });
      setName("");
      setDescription("");
      fetchProjects(1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    }
  };

  const handleDeleteProject = async (projectId) => {
    setError("");
    try {
      await axios.delete(`${API_BASE_URL}/projects/${projectId}`);
      fetchProjects(page);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete project");
    }
  };

  const visibleProjects = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) {
      return projects;
    }
    return projects.filter((project) => {
      return (
        project.name?.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query)
      );
    });
  }, [projects, searchText]);

  return (
    <main className="ui-shell">
      <section className="panel">
        <div className="toolbar">
          <div>
            <h1 className="title">Project Dashboard</h1>
            <p className="subtitle">
              Create, browse, and open projects from a wider landscape layout.
            </p>
          </div>
          <button
            type="button"
            onClick={() => fetchProjects(page)}
            className="btn btn-secondary"
            disabled={loading}
          >
            Refresh
          </button>
        </div>
        <div className="stat-row">
          <span className="stat-pill">Current page: {page}</span>
          <span className="stat-pill">Total pages: {totalPages}</span>
          <span className="stat-pill">Visible cards: {visibleProjects.length}</span>
        </div>
      </section>

      <div className="landscape-grid">
        <section className="panel panel-sticky">
          <h2 className="section-title">Create Project</h2>
          <form onSubmit={handleCreateProject} className="form-grid">
            <div className="field">
              <label htmlFor="project-name">Project Name</label>
              <input
                id="project-name"
                type="text"
                placeholder="Enter project name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="input-control"
              />
            </div>

            <div className="field">
              <label htmlFor="project-description">Description</label>
              <textarea
                id="project-description"
                placeholder="Enter description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-control"
                rows={4}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Create Project
            </button>
          </form>
          <div className="divider" />
          <div className="row">
            <button
              type="button"
              onClick={() => fetchProjects(page - 1)}
              disabled={page <= 1 || loading}
              className="btn btn-secondary"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={() => fetchProjects(page + 1)}
              disabled={page >= totalPages || loading}
              className="btn btn-secondary"
            >
              Next
            </button>
          </div>
        </section>

        <section className="panel">
          <div className="toolbar">
            <h2 className="section-title" style={{ marginBottom: 0 }}>
              Projects
            </h2>
            <div className="toolbar-group">
              <input
                type="text"
                placeholder="Search in current page"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="input-control"
                style={{ width: 260 }}
              />
            </div>
          </div>

          {error && <p className="alert">{error}</p>}

          {loading ? (
            <p className="muted">Loading projects...</p>
          ) : visibleProjects.length === 0 ? (
            <p className="muted">No projects found on this page.</p>
          ) : (
            <div className="project-list">
              {visibleProjects.map((project) => (
                <div key={project._id} className="card">
                  <h3>{project.name}</h3>
                  <p className="meta">{project.description || "No description"}</p>
                  <div className="row between">
                    <div className="chip-row" style={{ marginBottom: 0 }}>
                      <span className="chip">
                        created:{" "}
                        {project.createdAt
                          ? new Date(project.createdAt).toLocaleDateString()
                          : "-"}
                      </span>
                    </div>
                    <div className="row">
                      <Link href={`/project/${project._id}`} className="btn btn-secondary">
                        Open
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDeleteProject(project._id)}
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="row between" style={{ marginTop: 12 }}>
            <span className="muted">
              Page {page} of {totalPages}
            </span>
            <div className="row">
              <button
                type="button"
                onClick={() => fetchProjects(page - 1)}
                disabled={page <= 1 || loading}
                className="btn btn-secondary"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => fetchProjects(page + 1)}
                disabled={page >= totalPages || loading}
                className="btn btn-secondary"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
