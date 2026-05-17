import { useState, useEffect, type FormEvent } from 'react'
import { Plus, Edit2, Trash2, Loader2, X, Key } from 'lucide-react'
import { useSelector } from 'react-redux'
import type { RootState } from '../../../store/store'
import { getAdmins, createAdmin, updateAdmin, deleteAdmin, type AdminDto } from '../../../api/adminsApi'
import { changePassword } from '../../../api/adminAuthApi'
import '../../../components/admin/admin.scss'

export function AdminAdminsPage() {
  const [admins, setAdmins] = useState<AdminDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const page = 1
  
  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editAdminId, setEditAdminId] = useState<number | null>(null)
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)

  // Current logged in admin
  const adminUser = useSelector((state: RootState) => state.adminAuth.adminUser)

  // Form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '01235448852',
    nationality: 'Egyptian',
    password: '',
    notes: '',
  })
  
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [formLoading, setFormLoading] = useState(false)

  const fetchAdmins = async () => {
    try {
      setLoading(true)
      const response = await getAdmins(page, 50)
      setAdmins(response.data || [])
    } catch (err) {
      setError('Failed to load admins')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (adminUser?.role?.toLowerCase() === 'superadmin') {
      fetchAdmins()
    } else {
      setLoading(false)
    }
  }, [page, adminUser])

  const handleCreateSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFormLoading(true)
    try {
      await createAdmin(formData)
      setIsCreateOpen(false)
      resetForm()
      fetchAdmins()
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to create admin')
    } finally {
      setFormLoading(false)
    }
  }

  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!editAdminId) return
    setFormLoading(true)
    try {
      await updateAdmin({
        id: editAdminId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      })
      setEditAdminId(null)
      resetForm()
      fetchAdmins()
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to update admin')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this admin?')) return
    try {
      await deleteAdmin(id)
      fetchAdmins()
    } catch (err: any) {
      alert('Failed to delete admin')
    }
  }

  const openEditModal = (admin: AdminDto) => {
    setFormData({
      ...formData,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      phone: admin.phone || '01235448852',
    })
    setEditAdminId(admin.id)
  }

  // Strong password regex: at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const isStrongPassword = (pass: string) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(pass)
  }

  const handleChangePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!adminUser || !adminUser.id || adminUser.id === 'admin') {
      alert('Could not determine your admin ID. Please re-login.')
      return
    }

    if (!isStrongPassword(passwordData.newPassword)) {
      alert('New password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.')
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match.')
      return
    }

    setFormLoading(true)
    try {
      await changePassword(Number(adminUser.id), passwordData.oldPassword, passwordData.newPassword)
      alert('Password changed successfully!')
      setIsChangePasswordOpen(false)
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.response?.data || 'Failed to change password.')
    } finally {
      setFormLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ firstName: '', lastName: '', email: '', phone: '01235448852', nationality: 'Egyptian', password: '', notes: '' })
  }

  if (adminUser?.role?.toLowerCase() !== 'superadmin') {
    return (
      <div className="admin-page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', padding: '40px' }}>
        <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '12px', padding: '32px', maxWidth: '480px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div style={{ background: '#fee2e2', color: '#ef4444', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '24px', fontWeight: 'bold' }}>⚠️</div>
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#991b1b', margin: '0 0 8px' }}>Access Denied</h2>
          <p style={{ fontSize: '14px', color: '#7f1d1d', lineHeight: 1.5, margin: 0 }}>
            Only Super Administrators are authorized to view or manage administrator accounts. Please contact your system administrator.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#0f2f44', margin: 0 }}>Administrators</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => { setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' }); setIsChangePasswordOpen(true); }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', color: '#0f2f44', border: '1px solid #cbd5e1', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}
          >
            <Key size={18} /> Change My Password
          </button>
          <button
            onClick={() => { resetForm(); setIsCreateOpen(true); }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#1e659e', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}
          >
            <Plus size={18} /> Add Admin
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Loader2 className="animate-spin" size={32} color="#1e659e" /></div>
      ) : error ? (
        <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>{error}</div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Name</th>
                <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Email</th>
                <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Role</th>
                <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>No administrators found.</td></tr>
              ) : (
                admins.map(admin => (
                  <tr key={admin.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#0f2f44', fontWeight: 500 }}>{admin.firstName} {admin.lastName}</td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#64748b' }}>{admin.email}</td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>
                      <span style={{ background: '#e0f2fe', color: '#0284c7', padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 500 }}>{admin.role || 'Admin'}</span>
                    </td>
                    <td style={{ padding: '16px', display: 'flex', gap: '8px' }}>
                      <button onClick={() => openEditModal(admin)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }} title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(admin.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px' }} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals for Create/Edit */}
      {(isCreateOpen || editAdminId) && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '500px', padding: '24px', position: 'relative' }}>
            <button onClick={() => { setIsCreateOpen(false); setEditAdminId(null); resetForm(); }} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
              <X size={20} />
            </button>
            <h3 style={{ margin: '0 0 20px', fontSize: '20px', color: '#0f2f44' }}>{isCreateOpen ? 'Create Administrator' : 'Edit Administrator'}</h3>
            
            <form onSubmit={isCreateOpen ? handleCreateSubmit : handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 500 }}>First Name</label>
                  <input required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 500 }}>Last Name</label>
                  <input required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
                </div>
              </div>

              {isCreateOpen ? (
                <>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 500 }}>Email Address</label>
                    <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 500 }}>Password</label>
                    <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
                  </div>
                </>
              ) : (
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 500, color: '#64748b' }}>Email Address</label>
                  <input type="email" disabled value={formData.email} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#f8fafc', color: '#64748b', cursor: 'not-allowed' }} />
                </div>
              )}

              <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => { setIsCreateOpen(false); setEditAdminId(null); resetForm(); }} style={{ padding: '10px 16px', background: '#f1f5f9', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
                <button type="submit" disabled={formLoading} style={{ padding: '10px 16px', background: '#1e659e', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>
                  {formLoading ? 'Saving...' : 'Save Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Change My Password */}
      {isChangePasswordOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '400px', padding: '24px', position: 'relative' }}>
            <button onClick={() => setIsChangePasswordOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
              <X size={20} />
            </button>
            <h3 style={{ margin: '0 0 20px', fontSize: '20px', color: '#0f2f44' }}>Change My Password</h3>
            
            <form onSubmit={handleChangePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 500 }}>Old Password</label>
                <input type="password" required value={passwordData.oldPassword} onChange={e => setPasswordData({...passwordData, oldPassword: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px' }} placeholder="••••••••" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 500 }}>New Password</label>
                <input type="password" required value={passwordData.newPassword} onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px' }} placeholder="••••••••" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 500 }}>Confirm New Password</label>
                <input type="password" required value={passwordData.confirmPassword} onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px' }} placeholder="••••••••" />
              </div>

              <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setIsChangePasswordOpen(false)} style={{ padding: '10px 16px', background: '#f1f5f9', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
                <button type="submit" disabled={formLoading} style={{ padding: '10px 16px', background: '#1e659e', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>
                  {formLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
