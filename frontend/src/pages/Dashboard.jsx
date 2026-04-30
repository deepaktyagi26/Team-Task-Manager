import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle, Clock, AlertTriangle, ListTodo } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState({ tasks: [], counts: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5000/api/my-dashboard');
      setData(res.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading dashboard...</div>;

  const { counts, tasks } = data;

  const getStatusBadge = (status) => {
    switch(status) {
      case 'TODO': return <span className="badge badge-todo">To Do</span>;
      case 'IN_PROGRESS': return <span className="badge badge-progress">In Progress</span>;
      case 'DONE': return <span className="badge badge-done">Done</span>;
      default: return null;
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>
        Welcome back, {user?.name || 'User'} 
        <span style={{ fontSize: '1rem', fontWeight: 'normal', color: 'var(--text-secondary)', marginLeft: '1rem' }}>
          ({user?.email})
        </span>
      </h1>

      {/* Stats Cards */}
      <div className="grid-cards" style={{ marginBottom: '3rem' }}>
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(100, 116, 139, 0.2)', borderRadius: '12px' }}>
            <ListTodo size={32} color="#cbd5e1" />
          </div>
          <div>
            <p style={{ margin: 0 }}>To Do</p>
            <h2 style={{ margin: 0 }}>{counts.todo || 0}</h2>
          </div>
        </div>

        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.2)', borderRadius: '12px' }}>
            <Clock size={32} color="#93c5fd" />
          </div>
          <div>
            <p style={{ margin: 0 }}>In Progress</p>
            <h2 style={{ margin: 0 }}>{counts.inProgress || 0}</h2>
          </div>
        </div>

        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '12px' }}>
            <CheckCircle size={32} color="#6ee7b7" />
          </div>
          <div>
            <p style={{ margin: 0 }}>Completed</p>
            <h2 style={{ margin: 0 }}>{counts.done || 0}</h2>
          </div>
        </div>

        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderColor: counts.overdue > 0 ? 'rgba(239, 68, 68, 0.4)' : 'var(--glass-border)' }}>
          <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.2)', borderRadius: '12px' }}>
            <AlertTriangle size={32} color="#fca5a5" />
          </div>
          <div>
            <p style={{ margin: 0 }}>Overdue</p>
            <h2 style={{ margin: 0, color: counts.overdue > 0 ? '#fca5a5' : 'white' }}>{counts.overdue || 0}</h2>
          </div>
        </div>
      </div>

      <div className="glass-panel">
        <h2 style={{ marginBottom: '1.5rem' }}>My Assigned Tasks</h2>
        
        {tasks.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem' }}>You have no tasks assigned to you right now.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {tasks.map(task => {
              const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE';
              return (
                <div key={task.id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '1.5rem', 
                  background: 'rgba(0,0,0,0.2)', 
                  borderRadius: '12px',
                  borderLeft: isOverdue ? '4px solid var(--status-overdue)' : '4px solid transparent'
                }}>
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem 0' }}>{task.title}</h3>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>Project: {task.project.name}</p>
                    {task.dueDate && (
                      <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: isOverdue ? 'var(--status-overdue)' : 'var(--text-secondary)' }}>
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div>
                    {getStatusBadge(task.status)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
