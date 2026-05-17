import { useState, useEffect, type FormEvent } from 'react'
import { Plus, Edit2, Trash2, Loader2, X, AlertCircle } from 'lucide-react'
import {
  getQuestions, getQuestionById, createQuestion, updateQuestion, deleteQuestion,
  type DtoQuestionRead
} from '../../../api/questionsApi'
import '../../../components/admin/admin.scss'

const LANGS = ['en', 'fr', 'ru', 'ro'] as const
type Lang = typeof LANGS[number]

const langLabels: Record<Lang, string> = {
  en: 'English', fr: 'French', ru: 'Russian', ro: 'Romanian'
}

function emptyTranslations() {
  return { en: '', fr: '', ru: '', ro: '' }
}

export function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<DtoQuestionRead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)

  const [textData, setTextData] = useState(emptyTranslations())
  const [answerData, setAnswerData] = useState(emptyTranslations())

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      setActionError('')
      const res = await getQuestions(1, 100)
      setQuestions((res.data || []).sort((a, b) => a.id - b.id))
    } catch {
      setError('Failed to load questions.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchQuestions() }, [])

  const openCreateModal = () => {
    setEditingId(null)
    setTextData(emptyTranslations())
    setAnswerData(emptyTranslations())
    setIsModalOpen(true)
  }

  const openEditModal = async (q: DtoQuestionRead) => {
    setEditingId(q.id)
    setIsModalOpen(true)
    setFormLoading(true)
    try {
      const [enR, frR, ruR, roR] = await Promise.all(
        LANGS.map(lang => getQuestionById(q.id, lang))
      )
      const results = [enR, frR, ruR, roR]
      const makeMap = (field: 'text' | 'answer') =>
        Object.fromEntries(LANGS.map((lang, i) => [lang, results[i].data?.[field] || ''])) as Record<Lang, string>
      setTextData(makeMap('text'))
      setAnswerData(makeMap('answer'))
    } catch {
      setActionError('Failed to load translations for editing.')
      setIsModalOpen(false)
    } finally {
      setFormLoading(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFormLoading(true)
    try {
      if (editingId) {
        await updateQuestion({ id: editingId, text: textData, answer: answerData })
      } else {
        await createQuestion({ text: textData, answer: answerData })
      }
      setIsModalOpen(false)
      fetchQuestions()
    } catch (err: any) {
      setActionError(err?.response?.data?.message || 'Failed to save question.')
    } finally {
      setFormLoading(false)
    }
  }

  const executeDelete = async () => {
    if (!deleteConfirmId) return
    setFormLoading(true)
    try {
      setActionError('')
      await deleteQuestion(deleteConfirmId)
      fetchQuestions()
    } catch (err: any) {
      const msg = err?.response?.data?.Message || err?.response?.data?.message || 'Failed to delete question.'
      setActionError(msg)
    } finally {
      setDeleteConfirmId(null)
      setFormLoading(false)
    }
  }

  return (
    <div className="admin-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#0f2f44', margin: 0 }}>Questions (FAQ)</h2>
        <button
          onClick={openCreateModal}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#1e659e', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}
        >
          <Plus size={18} /> Add Question
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <Loader2 className="animate-spin" size={32} color="#1e659e" />
        </div>
      ) : error ? (
        <div style={{ color: '#b91c1c', textAlign: 'center', padding: '20px' }}>{error}</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {actionError && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fef2f2', border: '1px solid #fee2e2', color: '#b91c1c', padding: '12px 16px', borderRadius: '8px', fontSize: '14px' }}>
              <span><AlertCircle size={14} style={{ marginRight: '8px', verticalAlign: 'middle' }} />{actionError}</span>
              <button onClick={() => setActionError('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><X size={16} /></button>
            </div>
          )}

          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <tr>
                  <th style={{ padding: '16px', fontWeight: 600, color: '#475569', fontSize: '13px', width: '48px' }}>ID</th>
                  <th style={{ padding: '16px', fontWeight: 600, color: '#475569', fontSize: '13px' }}>Question</th>
                  <th style={{ padding: '16px', fontWeight: 600, color: '#475569', fontSize: '13px' }}>Answer</th>
                  <th style={{ padding: '16px', fontWeight: 600, color: '#475569', fontSize: '13px', textAlign: 'right', width: '100px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {questions.map(q => (
                  <tr key={q.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '16px', color: '#64748b', fontSize: '13px' }}>#{q.id}</td>
                    <td style={{ padding: '16px', color: '#0f2f44', fontSize: '14px', fontWeight: 500, maxWidth: '320px' }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.text}</div>
                    </td>
                    <td style={{ padding: '16px', color: '#64748b', fontSize: '14px', maxWidth: '400px' }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.answer}</div>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <button onClick={() => openEditModal(q)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', marginRight: '16px' }} title="Edit"><Edit2 size={16} /></button>
                      <button onClick={() => setDeleteConfirmId(q.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }} title="Delete"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
                {questions.length === 0 && (
                  <tr><td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No questions found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', padding: '24px', position: 'relative' }}>
            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
            <h3 style={{ margin: '0 0 24px', fontSize: '20px', color: '#0f2f44' }}>{editingId ? 'Edit Question' : 'Add Question'}</h3>

            {formLoading && !Object.values(textData).some(v => v) ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Loader2 className="animate-spin" size={32} color="#1e659e" /></div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Question text for each language */}
                <div>
                  <p style={{ margin: '0 0 12px', fontWeight: 600, color: '#0f2f44', fontSize: '15px' }}>Question Text</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {LANGS.map(lang => (
                      <div key={lang}>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: 500, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{langLabels[lang]} <span style={{ color: '#ef4444' }}>*</span></label>
                        <input
                          type="text"
                          required
                          value={textData[lang]}
                          onChange={e => setTextData(prev => ({ ...prev, [lang]: e.target.value }))}
                          placeholder={`Question in ${langLabels[lang]}`}
                          style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Answer for each language */}
                <div>
                  <p style={{ margin: '0 0 12px', fontWeight: 600, color: '#0f2f44', fontSize: '15px' }}>Answer</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {LANGS.map(lang => (
                      <div key={lang}>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: 500, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{langLabels[lang]} <span style={{ color: '#ef4444' }}>*</span></label>
                        <textarea
                          required
                          rows={3}
                          value={answerData[lang]}
                          onChange={e => setAnswerData(prev => ({ ...prev, [lang]: e.target.value }))}
                          placeholder={`Answer in ${langLabels[lang]}`}
                          style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 20px', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
                  <button type="submit" disabled={formLoading} style={{ padding: '10px 20px', background: '#1e659e', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500, opacity: formLoading ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {formLoading && <Loader2 size={16} className="animate-spin" />}
                    {editingId ? 'Save Changes' : 'Create Question'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '400px', padding: '28px', textAlign: 'center' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Trash2 size={24} />
            </div>
            <h3 style={{ margin: '0 0 8px', fontSize: '18px', color: '#0f2f44', fontWeight: 600 }}>Delete Question</h3>
            <p style={{ margin: '0 0 24px', color: '#64748b', fontSize: '14px', lineHeight: 1.5 }}>Are you sure you want to delete this question? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setDeleteConfirmId(null)} disabled={formLoading} style={{ flex: 1, padding: '10px', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
              <button onClick={executeDelete} disabled={formLoading} style={{ flex: 1, padding: '10px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {formLoading ? <Loader2 size={18} className="animate-spin" /> : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
