import { useState, useEffect, type FormEvent, useRef } from 'react'
import { Plus, Trash2, Loader2, X, Image as ImageIcon } from 'lucide-react'
import { getGalleryImages, addGalleryImage, deleteGalleryImage, getAbsoluteImageUrl, type GalleryImageDto } from '../../../api/galleryApi'
import { ImageLightbox } from '../../../components/imageLightbox/ImageLightbox'
import { useToast } from '../../../components/toast/ToastProvider'
import '../../../components/admin/admin.scss'

export function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImageDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const { toast, confirm } = useToast()
  
  // Modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  
  // Form state
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const absoluteImageUrls = images.map(img => getAbsoluteImageUrl(img.imageUrl))
  const openLightbox = (idx: number) => setLightboxIndex(idx)
  const closeLightbox = () => setLightboxIndex(null)
  const nextImage = () => setLightboxIndex(prev => prev !== null ? (prev + 1) % absoluteImageUrls.length : null)
  const prevImage = () => setLightboxIndex(prev => prev !== null ? (prev - 1 + absoluteImageUrls.length) % absoluteImageUrls.length : null)

  const fetchImages = async () => {
    try {
      setLoading(true)
      const data = await getGalleryImages()
      setImages(data)
    } catch (err) {
      setError('Failed to load gallery images')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchImages()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setSelectedFile(file)
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const resetUploadForm = () => {
    setSelectedFile(null)
    setIsFeatured(false)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl('')
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleCreateSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!selectedFile) {
      toast.warning('Please select an image file first.')
      return
    }

    setFormLoading(true)
    try {
      await addGalleryImage(selectedFile, isFeatured)
      setIsCreateOpen(false)
      resetUploadForm()
      fetchImages()
      toast.success('Image uploaded successfully!')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to upload image')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    const ok = await confirm({
      title: 'Delete Image',
      message: 'Are you sure you want to permanently delete this image?',
      confirmLabel: 'Delete',
      danger: true
    })
    if (!ok) return
    try {
      await deleteGalleryImage(id)
      fetchImages()
      toast.success('Image deleted')
    } catch (err: any) {
      toast.error('Failed to delete image')
    }
  }

  return (
    <div className="admin-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#0f2f44', margin: 0 }}>Gallery</h2>
        <button
          onClick={() => setIsCreateOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#1e659e', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}
        >
          <Plus size={18} /> Add Image
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Loader2 className="animate-spin" size={32} color="#1e659e" /></div>
      ) : error ? (
        <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>{error}</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {images.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#64748b' }}>
              No images found in the gallery.
            </div>
          ) : (
            images.map(img => (
              <div key={img.id} style={{ position: 'relative', background: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', paddingTop: '75%', background: '#f8fafc' }}>
                  <img 
                    src={getAbsoluteImageUrl(img.imageUrl)} 
                    alt="Gallery" 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                    onClick={() => openLightbox(images.indexOf(img))}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                  {img.isFeatured && (
                    <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(2, 132, 199, 0.9)', color: '#fff', padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600, backdropFilter: 'blur(4px)' }}>
                      FEATURED
                    </div>
                  )}
                  <button 
                    onClick={() => handleDelete(img.id)}
                    style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(255, 255, 255, 0.9)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#ef4444', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                    title="Delete Image"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal for Uploading Image */}
      {isCreateOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '500px', padding: '24px', position: 'relative' }}>
            <button onClick={() => { setIsCreateOpen(false); resetUploadForm(); }} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
              <X size={20} />
            </button>
            <h3 style={{ margin: '0 0 20px', fontSize: '20px', color: '#0f2f44' }}>Upload New Image</h3>
            
            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 500 }}>Select Image File</label>
                <div style={{ position: 'relative', border: '2px dashed #cbd5e1', borderRadius: '8px', padding: selectedFile ? '12px' : '32px', textAlign: 'center', background: '#f8fafc', transition: 'border-color 0.2s', minHeight: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    ref={fileInputRef}
                    required
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} 
                  />
                  {previewUrl ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', width: '100%' }}>
                      <img src={previewUrl} alt="Upload preview" style={{ maxWidth: '100%', maxHeight: '180px', objectFit: 'contain', borderRadius: '6px' }} />
                      <span style={{ fontSize: '12px', color: '#64748b', wordBreak: 'break-all' }}>{selectedFile?.name}</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', pointerEvents: 'none' }}>
                      <ImageIcon size={32} color="#94a3b8" />
                      <span style={{ fontSize: '14px', color: '#475569', fontWeight: 500 }}>
                        Click or drag image here
                      </span>
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                        JPG, PNG or WEBP (max. 5MB)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                <input 
                  type="checkbox" 
                  checked={isFeatured} 
                  onChange={(e) => setIsFeatured(e.target.checked)} 
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <div>
                  <span style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0f2f44' }}>Feature this image</span>
                  <span style={{ display: 'block', fontSize: '12px', color: '#64748b' }}>Featured images appear on the public homepage gallery.</span>
                </div>
              </label>

              <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => { setIsCreateOpen(false); resetUploadForm(); }} style={{ padding: '10px 16px', background: '#f1f5f9', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
                <button type="submit" disabled={formLoading || !selectedFile} style={{ padding: '10px 16px', background: '#1e659e', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500, opacity: (!selectedFile) ? 0.6 : 1 }}>
                  {formLoading ? 'Uploading...' : 'Upload Image'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox for Admins */}
      {absoluteImageUrls.length > 0 && (
        <ImageLightbox
          images={absoluteImageUrls}
          activeIndex={lightboxIndex}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </div>
  )
}
