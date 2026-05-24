import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react'
import { X, Image as ImageIcon } from 'lucide-react'
import { getDestinationImageUrl, type DestinationDto } from '../../../../api/destinationsApi'

interface Props {
  existingDestination?: DestinationDto | null
  initialValues: {
    en: string
    fr: string
    ru: string
    ro: string
    isFeatured: boolean
    imageUrl: string | null
  }
  loading: boolean
  onClose: () => void
  onSave: (formData: FormData) => Promise<void>
}

export function DestinationFormModal({ existingDestination, initialValues, loading, onClose, onSave }: Props) {
  const [formState, setFormState] = useState(initialValues)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialValues.imageUrl ? getDestinationImageUrl(initialValues.imageUrl) : null)

  useEffect(() => {
    setFormState(initialValues)
    setImageFile(null)
    setPreviewUrl(initialValues.imageUrl ? getDestinationImageUrl(initialValues.imageUrl) : null)
  }, [initialValues])

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    setImageFile(file)
    if (file) {
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const formData = new FormData()
    formData.append('Name.En', formState.en)
    formData.append('Name.Fr', formState.fr)
    formData.append('Name.Ru', formState.ru)
    formData.append('Name.Ro', formState.ro)
    formData.append('IsFeatured', formState.isFeatured ? 'true' : 'false')
    if (imageFile) {
      formData.append('imageFile', imageFile)
    }
    if (existingDestination) {
      formData.append('Id', existingDestination.id.toString())
    }

    await onSave(formData)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '540px', background: '#fff', borderRadius: '16px', boxShadow: '0 24px 68px rgba(15, 23, 42, 0.18)', overflow: 'hidden', position: 'relative' }}>
        <button
          type="button"
          onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 16, border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div style={{ padding: '28px 28px 20px' }}>
          <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#0f2f44' }}>
            {existingDestination ? 'Edit Destination' : 'Add Destination'}
          </h3>
          <p style={{ margin: '10px 0 24px', color: '#64748b', fontSize: '14px' }}>
            Provide translated names for all languages and optionally upload a featured image.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
            <div style={{ display: 'grid', gap: '10px' }}>
              <label style={{ fontWeight: 600, color: '#334155', fontSize: '13px' }}>Name (English)</label>
              <input
                value={formState.en}
                onChange={(e) => setFormState({ ...formState, en: e.target.value })}
                required
                placeholder="Example: Luxor"
                style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '12px 14px', fontSize: '14px' }}
              />
            </div>

            <div style={{ display: 'grid', gap: '10px' }}>
              <label style={{ fontWeight: 600, color: '#334155', fontSize: '13px' }}>Name (French)</label>
              <input
                value={formState.fr}
                onChange={(e) => setFormState({ ...formState, fr: e.target.value })}
                required
                placeholder="Example: Louxor"
                style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '12px 14px', fontSize: '14px' }}
              />
            </div>

            <div style={{ display: 'grid', gap: '10px' }}>
              <label style={{ fontWeight: 600, color: '#334155', fontSize: '13px' }}>Name (Russian)</label>
              <input
                value={formState.ru}
                onChange={(e) => setFormState({ ...formState, ru: e.target.value })}
                required
                placeholder="Example: Люксор"
                style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '12px 14px', fontSize: '14px' }}
              />
            </div>

            <div style={{ display: 'grid', gap: '10px' }}>
              <label style={{ fontWeight: 600, color: '#334155', fontSize: '13px' }}>Name (Romanian)</label>
              <input
                value={formState.ro}
                onChange={(e) => setFormState({ ...formState, ro: e.target.value })}
                required
                placeholder="Example: Luxor"
                style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '12px 14px', fontSize: '14px' }}
              />
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: '#334155', fontWeight: 600, fontSize: '13px' }}>
              <input
                type="checkbox"
                checked={formState.isFeatured}
                onChange={(e) => setFormState({ ...formState, isFeatured: e.target.checked })}
                style={{ width: '16px', height: '16px', accentColor: '#1e659e' }}
              />
              Mark as featured destination
            </label>

            <div style={{ display: 'grid', gap: '10px' }}>
              <label style={{ fontWeight: 600, color: '#334155', fontSize: '13px' }}>Image</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#eef2ff', color: '#1e3a8a', padding: '10px 14px', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
                  <ImageIcon size={18} /> Choose file
                  <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                </label>
                {previewUrl && (
                  <img src={previewUrl} alt="Destination preview" style={{ width: '96px', height: '96px', objectFit: 'cover', borderRadius: '14px', border: '1px solid #e2e8f0' }} />
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
              <button type="button" onClick={onClose} style={{ border: '1px solid #cbd5e1', background: '#fff', color: '#334155', padding: '12px 18px', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              <button type="submit" disabled={loading} style={{ background: '#1e659e', color: '#fff', padding: '12px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 600, opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Saving...' : existingDestination ? 'Update Destination' : 'Create Destination'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
