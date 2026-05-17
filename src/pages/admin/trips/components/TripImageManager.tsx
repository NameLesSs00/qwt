import { useState, useEffect, useRef } from 'react'
import { X, Upload, Trash2, Star, Loader2, Image } from 'lucide-react'
import {
  getTripById, uploadTripImages, deleteTripImage, setPrimaryTripImage,
  getTripImageUrl, type DtoTripImageRead
} from '../../../../api/tripsApi'

interface Props {
  tripId: number
  onClose: () => void
}

export function TripImageManager({ tripId, onClose }: Props) {
  const [images, setImages] = useState<DtoTripImageRead[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [previews, setPreviews] = useState<{ url: string; file: File }[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchImages = async () => {
    setLoading(true)
    try {
      const res = await getTripById(tripId)
      setImages(res.data?.images || [])
    } catch {
      setError('Failed to load images.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchImages() }, [tripId])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newPreviews = files.map(file => ({ url: URL.createObjectURL(file), file }))
    setPreviews(prev => [...prev, ...newPreviews])
    e.target.value = ''
  }

  const removePreview = (idx: number) => {
    URL.revokeObjectURL(previews[idx].url)
    setPreviews(prev => prev.filter((_, i) => i !== idx))
  }

  const handleUpload = async () => {
    if (previews.length === 0) return
    setUploading(true)
    setError('')
    try {
      await uploadTripImages(tripId, previews.map(p => p.file))
      previews.forEach(p => URL.revokeObjectURL(p.url))
      setPreviews([])
      await fetchImages()
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to upload images.')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (imageId: number) => {
    try {
      setError('')
      await deleteTripImage(tripId, imageId)
      setImages(prev => prev.filter(i => i.id !== imageId))
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to delete image.')
    }
  }

  const handleSetPrimary = async (imageId: number) => {
    try {
      setError('')
      await setPrimaryTripImage(tripId, imageId)
      setImages(prev => prev.map(i => ({ ...i, isPrimary: i.id === imageId })))
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to set primary image.')
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001, padding: '16px' }}>
      <div style={{ background: '#fff', borderRadius: '14px', width: '100%', maxWidth: '680px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <h3 style={{ margin: 0, fontSize: '20px', color: '#0f2f44', fontWeight: 700 }}>Manage Images <span style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 400 }}>Trip #{tripId}</span></h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={22} /></button>
        </div>

        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Error */}
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', fontSize: '14px' }}>{error}</div>
          )}

          {/* Upload Area */}
          <div>
            <p style={{ margin: '0 0 12px', fontWeight: 600, color: '#0f2f44', fontSize: '15px' }}>Upload New Images</p>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{ border: '2px dashed #cbd5e1', borderRadius: '10px', padding: '28px', textAlign: 'center', cursor: 'pointer', background: '#f8fafc', transition: 'border-color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#1e659e')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#cbd5e1')}
            >
              <Upload size={28} color="#94a3b8" style={{ marginBottom: '8px' }} />
              <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Click to select images</p>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileSelect} style={{ display: 'none' }} />

            {previews.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '10px', marginBottom: '12px' }}>
                  {previews.map((p, idx) => (
                    <div key={idx} style={{ position: 'relative', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', border: '2px solid #e2e8f0' }}>
                      <img src={p.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button onClick={() => removePreview(idx)} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={12} /></button>
                    </div>
                  ))}
                </div>
                <button onClick={handleUpload} disabled={uploading} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#1e659e', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 500, opacity: uploading ? 0.7 : 1 }}>
                  {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                  Upload {previews.length} Image{previews.length > 1 ? 's' : ''}
                </button>
              </div>
            )}
          </div>

          {/* Existing Images */}
          <div>
            <p style={{ margin: '0 0 12px', fontWeight: 600, color: '#0f2f44', fontSize: '15px' }}>Current Images ({images.length})</p>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Loader2 className="animate-spin" size={32} color="#1e659e" /></div>
            ) : images.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px', color: '#94a3b8', background: '#f8fafc', borderRadius: '10px', border: '1px dashed #e2e8f0' }}>
                <Image size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                <p style={{ margin: 0, fontSize: '14px' }}>No images yet. Upload some above!</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px' }}>
                {images.map(img => (
                  <div key={img.id} style={{ position: 'relative', aspectRatio: '1', borderRadius: '10px', overflow: 'hidden', border: `2px solid ${img.isPrimary ? '#1e659e' : '#e2e8f0'}`, boxShadow: img.isPrimary ? '0 0 0 2px rgba(30,101,158,0.25)' : 'none' }}>
                    <img src={getTripImageUrl(img.imageUrl)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {img.isPrimary && (
                      <div style={{ position: 'absolute', top: '6px', left: '6px', background: '#1e659e', color: '#fff', borderRadius: '99px', padding: '2px 8px', fontSize: '11px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Star size={10} fill="#fff" /> Primary
                      </div>
                    )}
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)', padding: '8px 6px 6px', display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                      {!img.isPrimary && (
                        <button onClick={() => handleSetPrimary(img.id)} title="Set as Primary" style={{ background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '6px', padding: '4px 6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                          <Star size={14} color="#f59e0b" />
                        </button>
                      )}
                      <button onClick={() => handleDelete(img.id)} title="Delete" style={{ background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '6px', padding: '4px 6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <Trash2 size={14} color="#ef4444" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', flexShrink: 0 }}>
          <button onClick={onClose} style={{ padding: '10px 24px', background: '#1e659e', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>Done</button>
        </div>
      </div>
    </div>
  )
}
