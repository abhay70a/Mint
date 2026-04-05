'use client'
import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { Shield, MoreVertical, Ban, CheckCircle, Search } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

export default function AdminUsersPage() {
  const { addToast } = useToast()
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        const res = await fetch('/api/admin/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await res.json()
        setUsers(data.data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const handleToggleSuspend = async (user: any) => {
     try {
       const token = localStorage.getItem('accessToken')
       const res = await fetch(`/api/admin/users/${user.id}`, {
         method: 'PATCH',
         headers: { 
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${token}`
         },
         body: JSON.stringify({ isSuspended: !user.isSuspended })
       })
       if (!res.ok) throw new Error('Update failed')
       
       setUsers(users.map(u => u.id === user.id ? { ...u, isSuspended: !u.isSuspended } : u))
       addToast(`User ${!user.isSuspended ? 'suspended' : 'activated'}`, 'success')
     } catch (err) {
       addToast('Failed to update user', 'error')
     }
  }

  const filtered = users.filter(u => u.fullName.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="admin-users-page">
      <header className="page-header">
        <div>
          <h1>User Management</h1>
          <p>Control platform access and adjust participant roles.</p>
        </div>
      </header>

      <div className="controls">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search users by name or email..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card noPadding>
        <div className="table-wrapper">
          <table className="user-table">
            <thead>
              <tr>
                <th>User Details</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [1,2,3,4,5].map(i => (
                  <tr key={i}>
                    <td><Skeleton height={20} width={150} /></td>
                    <td><Skeleton height={20} width={80} /></td>
                    <td><Skeleton height={20} width={60} /></td>
                    <td><Skeleton height={20} width={100} /></td>
                    <td><Skeleton height={20} width={40} /></td>
                  </tr>
                ))
              ) : filtered.map(user => (
                <tr key={user.id} className={user.isSuspended ? 'suspended' : ''}>
                  <td>
                    <div className="user-cell">
                      <span className="name">{user.fullName}</span>
                      <span className="email">{user.email}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`role-badge ${user.role.toLowerCase()}`}>
                      <Shield size={10} />
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`status-pill ${user.isSuspended ? 'inactive' : 'active'}`}>
                       {user.isSuspended ? 'Suspended' : 'Active'}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="actions">
                      <button 
                        className="action-btn" 
                        title={user.isSuspended ? 'Activate User' : 'Suspend User'}
                        onClick={() => handleToggleSuspend(user)}
                      >
                        {user.isSuspended ? <CheckCircle size={18} /> : <Ban size={18} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <style jsx>{`
        .admin-users-page { display: flex; flex-direction: column; gap: var(--space-8); }
        .page-header h1 { font-size: 32px; margin-bottom: var(--space-1); }
        .page-header p { color: var(--text-secondary); }

        .controls { display: flex; gap: var(--space-4); }
        .search-box {
          flex: 1;
          display: flex;
          align-items: center;
          background: var(--bg-secondary);
          border: 1px solid var(--bg-tertiary);
          border-radius: var(--radius-md);
          padding: 0 var(--space-4);
        }
        .search-box input {
          background: none; border: none; padding: var(--space-3) var(--space-3);
          color: var(--text-primary); outline: none; flex: 1; font-size: 14px;
        }
        .search-icon { color: var(--text-muted); }

        .table-wrapper { overflow-x: auto; }
        .user-table { width: 100%; border-collapse: collapse; text-align: left; }
        .user-table th {
          padding: var(--space-4) var(--space-6);
          font-size: 12px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid var(--bg-tertiary);
        }
        .user-table td { padding: var(--space-4) var(--space-6); border-bottom: 1px solid var(--bg-tertiary); font-size: 14px; }
        
        .user-cell { display: flex; flex-direction: column; gap: 2px; }
        .user-cell .name { font-weight: 600; color: var(--text-primary); }
        .user-cell .email { font-size: 12px; color: var(--text-secondary); }

        .role-badge { display: inline-flex; align-items: center; gap: 4px; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; text-transform: uppercase; }
        .role-badge.admin { background: var(--mint-muted); color: var(--mint-primary); }
        .role-badge.client { background: var(--bg-tertiary); color: var(--text-secondary); }

        .status-pill { font-size: 12px; font-weight: 500; }
        .status-pill.active { color: var(--success); }
        .status-pill.inactive { color: var(--error); }
        
        .suspended { opacity: 0.6; }
        .action-btn { color: var(--text-muted); transition: color var(--trans-fast); padding: 4px; }
        .action-btn:hover { color: var(--text-primary); }
      `}</style>
    </div>
  )
}
