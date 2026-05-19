import { useState, useRef } from 'react'
import { X, Loader2, Plus, Trash2, Image as ImageIcon, Upload, Save, AlertCircle } from 'lucide-react'
import {
  createBlog, updateBlog, uploadBlogCoverImage, uploadBlogSectionImage,
  deleteBlogCoverImage, deleteBlogSectionImage, getBlogImageUrl,
  type DtoBlogRead, type DtoBlogCreate, type DtoBlogUpdate, type DtoBlogSectionCreate
} from '../../../../api/blogsApi'

interface Props {
  existingBlog?: DtoBlogRead | null
  onClose: () => void
  onSaved: () => void
}

interface UISection {
  id?: number;
  title: string;
  content: string;
  imageUrl?: string | null;
  imageFile?: File | null;
  previewUrl?: string | null;
  deleteImage?: boolean;
}

export function BlogFormModal({ existingBlog, onClose, onSaved }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [loadingText, setLoadingText] = useState('')

  // Text details
  const [blogId] = useState<number | null>(existingBlog?.id || null)
  const [title, setTitle] = useState(existingBlog?.title || '')
  const [description, setDescription] = useState(existingBlog?.description || '')

  // Cover Image
  const [coverImageUrl] = useState<string | null>(existingBlog?.imageUrl || null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null)
  const [deleteCover, setDeleteCover] = useState(false)

  // Sections
  const [sections, setSections] = useState<UISection[]>(
    existingBlog?.sections?.map(s => ({
      id: s.id,
      title: s.title || '',
      content: s.content || '',
      imageUrl: s.imageUrl,
    })) || []
  )

  const coverInputRef = useRef<HTMLInputElement>(null)
  const sectionInputRefs = useRef<Record<number, HTMLInputElement | null>>({})

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    border: '1.5px solid #cbd5e1',
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box' as const,
    outline: 'none',
    transition: 'border-color 0.2s',
  }

  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    fontSize: '12px',
    fontWeight: 600,
    color: '#64748b',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  }

  // --- Handlers ---

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setCoverFile(file)
      setCoverPreviewUrl(URL.createObjectURL(file))
      setDeleteCover(false)
    }
  }

  const handleRemoveCover = () => {
    setCoverFile(null)
    setCoverPreviewUrl(null)
    if (coverInputRef.current) coverInputRef.current.value = ''
    if (coverImageUrl) {
      setDeleteCover(true)
    }
  }

  const handleAddSection = () => {
    setSections([...sections, { title: '', content: '' }])
  }

  const handleRemoveSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index))
  }

  const handleSectionChange = (index: number, field: keyof UISection, value: any) => {
    const newSections = [...sections]
    newSections[index] = { ...newSections[index], [field]: value }
    setSections(newSections)
  }

  const handleSectionImageSelect = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const newSections = [...sections]
      newSections[index] = {
        ...newSections[index],
        imageFile: file,
        previewUrl: URL.createObjectURL(file),
        deleteImage: false
      }
      setSections(newSections)
    }
  }

  const handleRemoveSectionImage = (index: number) => {
    const newSections = [...sections]
    newSections[index] = {
      ...newSections[index],
      imageFile: null,
      previewUrl: null,
      deleteImage: !!newSections[index].imageUrl // Mark to delete on server if it had an existing URL
    }
    setSections(newSections)
    if (sectionInputRefs.current[index]) {
      sectionInputRefs.current[index]!.value = ''
    }
  }

  // --- Unified Save Flow ---

  const handleSaveAll = async () => {
    setError('')
    
    // Validation
    if (!title.trim() || !description.trim()) {
      setError('Blog title and description are required.')
      return
    }
    for (let i = 0; i < sections.length; i++) {
        if (!sections[i].title.trim() && !sections[i].content.trim()) {
            setError(`Section ${i + 1} cannot be completely empty. Provide a title or content.`)
            return
        }
    }

    setLoading(true)
    let finalBlogId = blogId
    let generatedSections: any[] = []
    const errors: string[] = []

    try {
      // 1. Create or Update Text Content First
      setLoadingText('Saving text content...')
      if (finalBlogId) {
        const payload: DtoBlogUpdate = {
          id: finalBlogId,
          title,
          description,
          sections: sections.map(s => ({ id: s.id, title: s.title, content: s.content }))
        }
        const res = await updateBlog(finalBlogId, payload)
        generatedSections = res.data.sections || []
      } else {
        const payload: DtoBlogCreate = {
          id: 0,
          title,
          description,
          sections: sections.map(s => ({ title: s.title, content: s.content })) as DtoBlogSectionCreate[]
        }
        const res = await createBlog(payload)
        finalBlogId = res.data.id
        generatedSections = res.data.sections || []
      }

      // 2. Handle Cover Image
      if (finalBlogId) {
        setLoadingText('Uploading cover image...')
        try {
          if (deleteCover && coverImageUrl) {
            await deleteBlogCoverImage(finalBlogId)
          }
          if (coverFile) {
            await uploadBlogCoverImage(finalBlogId, coverFile)
          }
        } catch (e) {
          errors.push('Failed to update cover image.')
        }

        // 3. Handle Section Images
        for (let i = 0; i < sections.length; i++) {
          const s = sections[i]
          // If we just created the blog, the sections won't have IDs in our local state yet,
          // but we can map them by index assuming the API returns them in order.
          // Fallback to searching by title/content if API order isn't guaranteed.
          const serverSection = generatedSections[i] || generatedSections.find(gs => gs.title === s.title && gs.content === s.content)
          const sectionId = s.id || (serverSection ? serverSection.id : null)

          if (sectionId) {
            try {
              setLoadingText(`Uploading section ${i + 1} image...`)
              if (s.deleteImage && s.imageUrl) {
                await deleteBlogSectionImage(sectionId)
              }
              if (s.imageFile) {
                await uploadBlogSectionImage(finalBlogId, sectionId, s.imageFile)
              }
            } catch (e) {
              errors.push(`Failed to update image for section ${i + 1}.`)
            }
          } else if (s.imageFile || s.deleteImage) {
            errors.push(`Could not map section ${i + 1} to upload image.`)
          }
        }
      }

      if (errors.length > 0) {
        // Partial success
        setError(`Blog saved, but encountered image errors: ${errors.join(' ')} Please edit the blog to retry uploading those images.`)
        // Do not auto-close so user can see what failed.
      } else {
        // Complete success
        onSaved()
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.response?.data?.Message || 'Failed to save blog details.')
    } finally {
      setLoading(false)
      setLoadingText('')
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
      <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '900px', height: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.18)' }}>
        
        {/* Header */}
        <div style={{ padding: '22px 26px 18px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #1e659e, #2b8dd6)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ImageIcon size={18} color="#fff" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#0f2f44', fontWeight: 700 }}>
                {existingBlog ? 'Edit Blog Article' : 'Write New Article'}
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94a3b8' }}>
                All details and images are saved together instantly.
              </p>
            </div>
          </div>
          <button onClick={onClose} disabled={loading} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px', borderRadius: '6px' }}>
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '26px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>{error}</div>
            </div>
          )}

          {/* Core Info & Cover */}
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {/* Left side: Cover Image */}
            <div style={{ flexShrink: 0, width: '240px' }}>
              <label style={labelStyle}>Main Cover Image</label>
              <div 
                onClick={() => coverInputRef.current?.click()}
                style={{ 
                  width: '100%', height: '160px', border: '2px dashed #cbd5e1', borderRadius: '12px', 
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  background: '#f8fafc', cursor: 'pointer', overflow: 'hidden', position: 'relative', transition: 'border-color 0.2s'
                }}
              >
                {(coverPreviewUrl || (coverImageUrl && !deleteCover)) ? (
                  <img src={coverPreviewUrl || getBlogImageUrl(coverImageUrl)} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <>
                    <Upload size={24} color="#94a3b8" style={{ marginBottom: '8px' }} />
                    <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Upload Cover</span>
                  </>
                )}
              </div>
              <input type="file" ref={coverInputRef} onChange={handleCoverSelect} accept="image/*" style={{ display: 'none' }} />
              
              {(coverPreviewUrl || (coverImageUrl && !deleteCover)) && (
                <button onClick={handleRemoveCover} style={{ marginTop: '10px', width: '100%', background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', padding: '6px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}>
                  Remove Cover Image
                </button>
              )}
            </div>

            {/* Right side: Title & Desc */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '300px' }}>
              <div>
                <label style={labelStyle}>Article Title <span style={{ color: '#ef4444' }}>*</span></label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  style={inputStyle}
                  placeholder="E.g., 10 Hidden Gems in Cairo"
                />
              </div>
              <div>
                <label style={labelStyle}>Summary / Description <span style={{ color: '#ef4444' }}>*</span></label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  style={{ ...inputStyle, resize: 'vertical', minHeight: '94px' }}
                  placeholder="A brief overview of what this article covers..."
                  rows={4}
                />
              </div>
            </div>
          </div>

          <hr style={{ border: 0, borderTop: '1px solid #e2e8f0', margin: 0 }} />

          {/* Sections */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '16px', color: '#0f2f44' }}>Content Sections</h4>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>Break your article into readable sections with optional images.</p>
              </div>
              <button
                type="button"
                onClick={handleAddSection}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#eff6ff', color: '#1e659e', border: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              >
                <Plus size={16} /> Add Section
              </button>
            </div>

            {sections.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', background: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '12px', color: '#64748b', fontSize: '14px' }}>
                Start writing your article by adding a section above.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {sections.map((section, index) => (
                  <div key={index} style={{ padding: '20px', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#fafafa', position: 'relative' }}>
                    
                    <button
                      type="button"
                      onClick={() => handleRemoveSection(index)}
                      style={{ position: 'absolute', top: '16px', right: '16px', background: '#fef2f2', border: 'none', color: '#ef4444', padding: '8px', borderRadius: '6px', cursor: 'pointer', zIndex: 10 }}
                      title="Remove Section"
                    >
                      <Trash2 size={16} />
                    </button>
                    
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                      {/* Section Image inline dropzone */}
                      <div style={{ width: '180px', flexShrink: 0 }}>
                        <label style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Section Image</label>
                        <div 
                          onClick={() => sectionInputRefs.current[index]?.click()}
                          style={{ 
                            width: '100%', height: '120px', border: '1.5px dashed #cbd5e1', borderRadius: '8px', 
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            background: '#fff', cursor: 'pointer', overflow: 'hidden', position: 'relative'
                          }}
                        >
                          {(section.previewUrl || (section.imageUrl && !section.deleteImage)) ? (
                            <img src={section.previewUrl || getBlogImageUrl(section.imageUrl)} alt={`Section ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <>
                              <ImageIcon size={20} color="#cbd5e1" style={{ marginBottom: '6px' }} />
                              <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500 }}>Optional</span>
                            </>
                          )}
                        </div>
                        <input type="file" ref={el => { sectionInputRefs.current[index] = el; }} onChange={e => handleSectionImageSelect(index, e)} accept="image/*" style={{ display: 'none' }} />
                        
                        {(section.previewUrl || (section.imageUrl && !section.deleteImage)) && (
                          <button onClick={() => handleRemoveSectionImage(index)} style={{ marginTop: '8px', width: '100%', background: 'transparent', color: '#ef4444', border: 'none', padding: '4px', fontSize: '12px', cursor: 'pointer', fontWeight: 600, textAlign: 'center' }}>
                            Remove
                          </button>
                        )}
                      </div>

                      {/* Section Text */}
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '260px' }}>
                        <div>
                          <label style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Section {index + 1} Subtitle (Optional)</label>
                          <input
                            type="text"
                            value={section.title}
                            onChange={e => handleSectionChange(index, 'title', e.target.value)}
                            style={{ ...inputStyle, background: '#fff' }}
                            placeholder="E.g., The Great Pyramids"
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Paragraph Content</label>
                          <textarea
                            value={section.content}
                            onChange={e => handleSectionChange(index, 'content', e.target.value)}
                            style={{ ...inputStyle, background: '#fff', minHeight: '120px', resize: 'vertical' }}
                            placeholder="Write your article paragraph here..."
                            rows={5}
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '18px 26px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, background: '#fafafa', borderRadius: '0 0 16px 16px' }}>
          <button onClick={onClose} disabled={loading} style={{ padding: '10px 20px', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 600, color: '#475569', fontSize: '14px' }}>
            Cancel
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {loading && <span style={{ fontSize: '13px', color: '#64748b', fontStyle: 'italic' }}>{loadingText}</span>}
            <button 
              onClick={handleSaveAll} 
              disabled={loading} 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 28px', background: loading ? '#7bafd0' : '#1e659e', color: '#fff', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: '14px', transition: 'background 0.2s' }}
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {loading ? 'Processing...' : 'Save Blog'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
