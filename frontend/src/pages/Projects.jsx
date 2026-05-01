import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FolderPlus, ChevronRight, Trash2 } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  
  // Create Project State
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/api/projects');
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/projects', { name, description });
      setProjects([res.data, ...projects]);
      setShowModal(false);
      setName('');
      setDescription('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project? All associated tasks will be removed.')) return;
    try {
      await api.delete(`/api/projects/${projectId}`);
      setProjects(projects.filter(p => p.id !== projectId));
    } catch (err) {
      console.error(err);
      alert('Failed to delete project');
    }
  };

  if (loading) return <div>Loading projects...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Projects</h1>
        {user?.role === 'ADMIN' && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <FolderPlus size={18} /> New Project
          </button>
        )}
      </div>

      <div className="grid-cards">
        {projects.length === 0 ? (
          <p>No projects found. Create one to get started!</p>
        ) : (
          projects.map(project => (
            <div key={project.id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h3 style={{ margin: 0 }}>{project.name}</h3>
                {user?.role === 'ADMIN' && (
                  <button 
                    onClick={() => handleDeleteProject(project.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
                    title="Delete Project"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              <p style={{ flex: 1, marginBottom: '1.5rem', fontSize: '0.95rem' }}>{project.description || 'No description provided.'}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {project._count?.tasks || 0} Tasks
                </span>
                <Link to={`/projects/${project.id}`} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                  View Board <ChevronRight size={16} style={{ marginLeft: '4px' }} />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '500px' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Create New Project</h2>
            {error && <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}
            
            <form onSubmit={handleCreateProject}>
              <div className="form-group">
                <label className="form-label">Project Name</label>
                <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" rows="4" value={description} onChange={(e) => setDescription(e.target.value)} style={{ resize: 'vertical' }}></textarea>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
