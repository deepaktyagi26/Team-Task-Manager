import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Plus, Trash2, Calendar } from 'lucide-react';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);

  // Task Creation State
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedToId, setAssignedToId] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    fetchProject();
    if (user?.role === 'ADMIN') {
      fetchUsers();
    }
  }, [id, user]);

  const fetchProject = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:5000/api/projects/${id}`);
      setProject(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5000/api/auth/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://127.0.0.1:5000/api/projects/${id}/tasks`, {
        title,
        description,
        assignedToId: assignedToId || null,
        dueDate: dueDate || null
      });
      // Add assignedTo data manually for optimistic UI or just refetch
      fetchProject();
      setShowTaskModal(false);
      setTitle('');
      setDescription('');
      setAssignedToId('');
      setDueDate('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await axios.patch(`http://127.0.0.1:5000/api/tasks/${taskId}`, { status: newStatus });
      fetchProject();
    } catch (err) {
      console.error(err);
      alert('Failed to update task status. ' + (err.response?.data?.message || ''));
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await axios.delete(`http://127.0.0.1:5000/api/tasks/${taskId}`);
      fetchProject();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm('Are you sure you want to delete this ENTIRE project? This cannot be undone.')) return;
    try {
      await axios.delete(`http://localhost:5000/api/projects/${id}`);
      window.location.href = '/projects';
    } catch (err) {
      console.error(err);
      alert('Failed to delete project');
    }
  };

  if (loading) return <div>Loading project details...</div>;
  if (!project) return <div>Project not found.</div>;

  const getStatusColor = (status) => {
    if (status === 'TODO') return 'var(--status-todo)';
    if (status === 'IN_PROGRESS') return 'var(--status-progress)';
    if (status === 'DONE') return 'var(--status-done)';
    return 'gray';
  };

  const canEditTask = (task) => {
    return user.role === 'ADMIN' || task.assignedToId === user.id;
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div>
            <h1 style={{ marginBottom: '0.5rem' }}>{project.name}</h1>
            <p>{project.description}</p>
          </div>
          {user?.role === 'ADMIN' && (
            <button 
              onClick={handleDeleteProject}
              className="btn btn-danger" 
              style={{ padding: '0.5rem', borderRadius: '8px' }}
              title="Delete Entire Project"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
        {user?.role === 'ADMIN' && (
          <button className="btn btn-primary" onClick={() => setShowTaskModal(true)}>
            <Plus size={18} /> Add Task
          </button>
        )}
      </div>

      {/* Task Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
        
        {['TODO', 'IN_PROGRESS', 'DONE'].map(status => (
          <div key={status} className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ borderBottom: `2px solid ${getStatusColor(status)}`, paddingBottom: '0.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
              {status.replace('_', ' ')}
              <span className="badge" style={{ background: 'rgba(255,255,255,0.1)' }}>
                {project.tasks.filter(t => t.status === status).length}
              </span>
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {project.tasks.filter(t => t.status === status).map(task => (
                <div key={task.id} style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', borderLeft: `3px solid ${getStatusColor(status)}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{task.title}</h4>
                    {user.role === 'ADMIN' && (
                      <button onClick={() => handleDeleteTask(task.id)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>{task.description}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                        {task.assignedTo ? task.assignedTo.name.charAt(0).toUpperCase() : '?'}
                      </div>
                      <span>{task.assignedTo ? task.assignedTo.name : 'Unassigned'}</span>
                    </div>
                    {task.dueDate && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={14} />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {canEditTask(task) && (
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                      <select 
                        className="form-input" 
                        style={{ padding: '0.4rem', fontSize: '0.85rem', background: 'rgba(0,0,0,0.5)' }}
                        value={task.status}
                        onChange={(e) => handleUpdateStatus(task.id, e.target.value)}
                      >
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="DONE">Done</option>
                      </select>
                    </div>
                  )}
                </div>
              ))}
              {project.tasks.filter(t => t.status === status).length === 0 && (
                <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  No tasks
                </div>
              )}
            </div>
          </div>
        ))}

      </div>

      {showTaskModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Add Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input type="text" className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" rows="3" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Assign To</label>
                <select className="form-input" value={assignedToId} onChange={(e) => setAssignedToId(e.target.value)} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                  <option value="">-- Unassigned --</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input type="date" className="form-input" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowTaskModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
