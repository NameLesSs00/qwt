import { useState, useEffect } from 'react'
import { X, Plus, Trash2, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  createTrip, updateTrip, getTripById,
  DurationType, type DtoTripCreate, type TranslationInputDto
} from '../../../../api/tripsApi'
import type { TripTypeDto } from '../../../../api/tripTypesApi'

interface Props {
  tripId?: number
  tripTypes: TripTypeDto[]
  onClose: () => void
  onSaved: () => void
}

const LANGS = ['en', 'fr', 'ru', 'ro'] as const
type Lang = typeof LANGS[number]
const LANG_LABELS: Record<Lang, string> = { en: 'English', fr: 'French', ru: 'Russian', ro: 'Romanian' }

const DAYS = [
  { id: 0, label: 'Sunday' }, { id: 1, label: 'Monday' }, { id: 2, label: 'Tuesday' },
  { id: 3, label: 'Wednesday' }, { id: 4, label: 'Thursday' }, { id: 5, label: 'Friday' }, { id: 6, label: 'Saturday' }
]

function emptyTranslation(): TranslationInputDto { return { en: '', fr: '', ru: '', ro: '' } }

export function TripFormModal({ tripId, tripTypes, onClose, onSaved }: Props) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(!!tripId)
  const [error, setError] = useState('')

  // Step 1 — Core
  const [name, setName] = useState(emptyTranslation())
  const [destination, setDestination] = useState(emptyTranslation())
  const [tripTypeId, setTripTypeId] = useState<number>(tripTypes[0]?.id || 1)
  const [durationValue, setDurationValue] = useState(1)
  const [durationType, setDurationType] = useState<DurationType>(DurationType.Hours)
  const [timeFrom, setTimeFrom] = useState('')
  const [adultPrice, setAdultPrice] = useState(0)
  const [childPrice, setChildPrice] = useState(0)

  // Step 2 — Description & Lists
  const [description, setDescription] = useState(emptyTranslation())
  const [highlights, setHighlights] = useState<TranslationInputDto[]>([])
  const [includes, setIncludes] = useState<TranslationInputDto[]>([])
  const [excludes, setExcludes] = useState<TranslationInputDto[]>([])
  const [whatToBring, setWhatToBring] = useState<TranslationInputDto[]>([])

  // Step 3 — Availability
  const [availabilityDayIds, setAvailabilityDayIds] = useState<number[]>([])

  useEffect(() => {
    if (!tripId) return
    setFetchLoading(true)
    
    Promise.all(LANGS.map(lang => getTripById(tripId, lang)))
      .then(responses => {
        const results = responses.map(r => r.data)
        const t = results[0] // Base data

        const makeTrans = (field: 'name' | 'destination' | 'description'): TranslationInputDto => ({
          en: results[0][field] || '',
          fr: results[1][field] || '',
          ru: results[2][field] || '',
          ro: results[3][field] || '',
        })

        setName(makeTrans('name'))
        setDestination(makeTrans('destination'))
        setDescription(makeTrans('description'))

        const makeTransArray = (field: 'highlights' | 'includes' | 'excludes' | 'whatToBring'): TranslationInputDto[] => {
          const maxLen = Math.max(...results.map(r => (r[field] || []).length))
          const arr: TranslationInputDto[] = []
          for (let i = 0; i < maxLen; i++) {
            arr.push({
              en: results[0][field]?.[i] || '',
              fr: results[1][field]?.[i] || '',
              ru: results[2][field]?.[i] || '',
              ro: results[3][field]?.[i] || ''
            })
          }
          return arr
        }

        setHighlights(makeTransArray('highlights'))
        setIncludes(makeTransArray('includes'))
        setExcludes(makeTransArray('excludes'))
        setWhatToBring(makeTransArray('whatToBring'))

        setTripTypeId(tripTypes.find(tt => tt.name === t.tripTypeName)?.id || tripTypes[0]?.id || 1)
        setDurationValue(t.durationValue)
        setDurationType(t.durationTypeName?.toLowerCase() === 'days' ? DurationType.Days : DurationType.Hours)
        setTimeFrom(t.timeFrom?.slice(0, 5) || '')
        setAdultPrice(t.adultPrice)
        setChildPrice(t.childPrice)

        const dayIds = (t.availableDays || []).map(dayStr => DAYS.find(d => d.label === dayStr)?.id).filter(id => id !== undefined) as number[]
        setAvailabilityDayIds(dayIds)
      })
      .catch(() => setError('Failed to load trip data.'))
      .finally(() => setFetchLoading(false))
  }, [tripId, tripTypes])

  const addListItem = (setter: React.Dispatch<React.SetStateAction<TranslationInputDto[]>>) =>
    setter(prev => [...prev, emptyTranslation()])

  const updateListItem = (setter: React.Dispatch<React.SetStateAction<TranslationInputDto[]>>, idx: number, lang: Lang, val: string) =>
    setter(prev => prev.map((item, i) => i === idx ? { ...item, [lang]: val } : item))

  const removeListItem = (setter: React.Dispatch<React.SetStateAction<TranslationInputDto[]>>, idx: number) =>
    setter(prev => prev.filter((_, i) => i !== idx))

  const toggleDay = (id: number) =>
    setAvailabilityDayIds(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id])

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const payload: DtoTripCreate = {
        name, destination, description,
        timeFrom: timeFrom || undefined,
        durationValue, durationType,
        adultPrice, childPrice, tripTypeId,
        highlights: highlights.length ? highlights : undefined,
        includes: includes.length ? includes : undefined,
        excludes: excludes.length ? excludes : undefined,
        whatToBring: whatToBring.length ? whatToBring : undefined,
        availabilityDayIds: availabilityDayIds.length ? availabilityDayIds : undefined
      }
      if (tripId) {
        await updateTrip({ ...payload, id: tripId })
      } else {
        await createTrip(payload)
      }
      onSaved()
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save trip.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = { width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' as const }
  const labelStyle = { display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: 500, color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }

  const renderTranslationFields = (label: string, value: TranslationInputDto, onChange: (lang: Lang, val: string) => void) => (
    <div style={{ marginBottom: '20px' }}>
      <p style={{ margin: '0 0 10px', fontWeight: 600, color: '#0f2f44', fontSize: '14px' }}>{label}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {LANGS.map(lang => (
          <div key={lang}>
            <label style={labelStyle}>{LANG_LABELS[lang]} <span style={{ color: '#ef4444' }}>*</span></label>
            <input style={inputStyle} value={value[lang]} onChange={e => onChange(lang, e.target.value)} placeholder={`In ${LANG_LABELS[lang]}`} required />
          </div>
        ))}
      </div>
    </div>
  )

  const renderDynamicList = (label: string, items: TranslationInputDto[], setter: React.Dispatch<React.SetStateAction<TranslationInputDto[]>>) => (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <p style={{ margin: 0, fontWeight: 600, color: '#0f2f44', fontSize: '14px' }}>{label}</p>
        <button type="button" onClick={() => addListItem(setter)} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#eff6ff', color: '#1d4ed8', border: 'none', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>
          <Plus size={14} /> Add
        </button>
      </div>
      {items.map((item, idx) => (
        <div key={idx} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', marginBottom: '8px', background: '#f8fafc', position: 'relative' }}>
          <button type="button" onClick={() => removeListItem(setter, idx)} style={{ position: 'absolute', top: '8px', right: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={14} /></button>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {LANGS.map(lang => (
              <div key={lang}>
                <label style={labelStyle}>{LANG_LABELS[lang]}</label>
                <input style={inputStyle} value={item[lang]} onChange={e => updateListItem(setter, idx, lang, e.target.value)} placeholder={LANG_LABELS[lang]} />
              </div>
            ))}
          </div>
        </div>
      ))}
      {items.length === 0 && <p style={{ color: '#94a3b8', fontSize: '13px', fontStyle: 'italic' }}>No items added yet.</p>}
    </div>
  )

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
      <div style={{ background: '#fff', borderRadius: '14px', width: '100%', maxWidth: '760px', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}>
        {/* Modal Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '20px', color: '#0f2f44', fontWeight: 700 }}>{tripId ? 'Edit Trip' : 'Create Trip'}</h3>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>Step {step} of 3 — {step === 1 ? 'Core Details' : step === 2 ? 'Description & Lists' : 'Availability Days'}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={22} /></button>
        </div>

        {/* Step Indicator */}
        <div style={{ padding: '12px 24px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '8px', flexShrink: 0 }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ flex: 1, height: '4px', borderRadius: '99px', background: s <= step ? '#1e659e' : '#e2e8f0', transition: 'background 0.3s' }} />
          ))}
        </div>

        {/* Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {fetchLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><Loader2 className="animate-spin" size={36} color="#1e659e" /></div>
          ) : (
            <>
              {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#b91c1c', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>{error}</div>
              )}

              {/* STEP 1 */}
              {step === 1 && (
                <div>
                  {renderTranslationFields("Trip Name", name, (lang, val) => setName(prev => ({ ...prev, [lang]: val })))}
                  {renderTranslationFields("Destination", destination, (lang, val) => setDestination(prev => ({ ...prev, [lang]: val })))}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                    <div>
                      <label style={labelStyle}>Trip Type <span style={{ color: '#ef4444' }}>*</span></label>
                      <select value={tripTypeId} onChange={e => setTripTypeId(Number(e.target.value))} style={{ ...inputStyle }}>
                        {tripTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Start Time</label>
                      <input type="time" value={timeFrom} onChange={e => setTimeFrom(e.target.value)} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Duration Value <span style={{ color: '#ef4444' }}>*</span></label>
                      <input type="number" min={1} value={durationValue} onChange={e => setDurationValue(Number(e.target.value))} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Duration Type</label>
                      <select value={durationType} onChange={e => setDurationType(Number(e.target.value) as DurationType)} style={inputStyle}>
                        <option value={DurationType.Hours}>Hours</option>
                        <option value={DurationType.Days}>Days</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Adult Price (€) <span style={{ color: '#ef4444' }}>*</span></label>
                      <input type="number" min={0} step={0.01} value={adultPrice} onChange={e => setAdultPrice(Number(e.target.value))} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Child Price (€) <span style={{ color: '#ef4444' }}>*</span></label>
                      <input type="number" min={0} step={0.01} value={childPrice} onChange={e => setChildPrice(Number(e.target.value))} style={inputStyle} />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div>
                  <div style={{ marginBottom: '20px' }}>
                    <p style={{ margin: '0 0 10px', fontWeight: 600, color: '#0f2f44', fontSize: '14px' }}>Description</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      {LANGS.map(lang => (
                        <div key={lang}>
                          <label style={labelStyle}>{LANG_LABELS[lang]} <span style={{ color: '#ef4444' }}>*</span></label>
                          <textarea rows={4} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} value={description[lang]} onChange={e => setDescription(prev => ({ ...prev, [lang]: e.target.value }))} placeholder={`Description in ${LANG_LABELS[lang]}`} required />
                        </div>
                      ))}
                    </div>
                  </div>
                  {renderDynamicList("Highlights", highlights, setHighlights)}
                  {renderDynamicList("Includes", includes, setIncludes)}
                  {renderDynamicList("Excludes", excludes, setExcludes)}
                  {renderDynamicList("What to Bring", whatToBring, setWhatToBring)}
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div>
                  <p style={{ margin: '0 0 16px', fontWeight: 600, color: '#0f2f44', fontSize: '15px' }}>Select Available Days</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
                    {DAYS.map(day => {
                      const active = availabilityDayIds.includes(day.id)
                      return (
                        <button
                          key={day.id}
                          type="button"
                          onClick={() => toggleDay(day.id)}
                          style={{ padding: '14px', border: `2px solid ${active ? '#1e659e' : '#e2e8f0'}`, borderRadius: '10px', background: active ? '#eff6ff' : '#fff', color: active ? '#1e659e' : '#475569', fontWeight: active ? 700 : 400, fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                          {day.label}
                        </button>
                      )
                    })}
                  </div>
                  <p style={{ marginTop: '16px', color: '#64748b', fontSize: '13px' }}>{availabilityDayIds.length === 0 ? 'No days selected.' : `Selected: ${availabilityDayIds.length} day(s)`}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', flexShrink: 0 }}>
          <button onClick={() => step > 1 ? setStep(step - 1) : onClose()} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500, color: '#475569' }}>
            <ChevronLeft size={16} /> {step === 1 ? 'Cancel' : 'Back'}
          </button>
          {step < 3 ? (
            <button onClick={() => setStep(step + 1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', background: '#1e659e', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', background: '#1e659e', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, opacity: loading ? 0.7 : 1 }}>
              {loading && <Loader2 size={16} className="animate-spin" />}
              {tripId ? 'Save Changes' : 'Create Trip'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
