import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Search, ChevronDown, Check, MapPin, Tag, Clock 
} from 'lucide-react';

import { getTrips, getTripImageUrl, type DtoTripRead } from '../../api/tripsApi';
import { getTripTypes, type TripTypeDto } from '../../api/tripTypesApi';

import imgHero from '../../assets/trips/Frame 140.png';
import imgTrip from '../../assets/trips/Frame 23.png';
import iconFilter from '../../assets/trips/mage_filter.png';

import './tripsPage.scss';

export function TripsPage() {
  const { t, i18n } = useTranslation();

  // Helper: turn a trip name into a URL-safe slug
  const toSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const [trips, setTrips] = useState<DtoTripRead[]>([]);
  const [tripTypes, setTripTypes] = useState<TripTypeDto[]>([]);
  const [allDestinations, setAllDestinations] = useState<string[]>(['ALL_DESTINATIONS']);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [destination, setDestination] = useState<string>('ALL_DESTINATIONS');
  const [destDropdownOpen, setDestDropdownOpen] = useState(false);
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sorting State
  const [sortBy, setSortBy] = useState<'Latest' | 'Oldest'>('Latest');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  // Fetch unique destinations and types once on load / language change
  useEffect(() => {
    async function initData() {
      try {
        const [tripsRes, typesRes] = await Promise.all([
          getTrips({ PageSize: 1000 }), // Load system-wide active list to compile unique locations
          getTripTypes(1, 100)
        ]);
        if (tripsRes.success && tripsRes.data) {
          const dests = tripsRes.data
            .map(t => t.destination)
            .filter((d): d is string => !!d);
          setAllDestinations(['ALL_DESTINATIONS', ...Array.from(new Set(dests))]);
        }
        if (typesRes.success && typesRes.data) {
          setTripTypes(typesRes.data);
        }
      } catch (err) {
        console.error('Failed to load initial metadata', err);
      }
    }
    initData();
  }, [i18n.language]);

  // Fetch filtered trips from backend dynamically
  useEffect(() => {
    async function fetchFilteredData() {
      setLoading(true);
      try {
        const res = await getTrips({
          PageSize: 100,
          Destination: destination !== 'ALL_DESTINATIONS' ? destination : undefined,
          MinPrice: minPrice !== '' ? Number(minPrice) : undefined,
          MaxPrice: maxPrice !== '' ? Number(maxPrice) : undefined,
          TypeId: selectedTypeId || undefined,
          SearchItem: searchQuery || undefined,
        });
        if (res.success) {
          setTrips(res.data || []);
        }
      } catch (err) {
        console.error('Failed to load filtered trips', err);
      } finally {
        setLoading(false);
      }
    }

    const delayDebounce = setTimeout(() => {
      fetchFilteredData();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [destination, minPrice, maxPrice, selectedTypeId, searchQuery, i18n.language]);

  // Client side sorting using createdAt
  const sortedTrips = useMemo(() => {
    return [...trips].sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return sortBy === 'Latest' ? timeB - timeA : timeA - timeB;
    });
  }, [trips, sortBy]);

  const clearFilters = () => {
    setDestination('ALL_DESTINATIONS');
    setMinPrice('');
    setMaxPrice('');
    setSelectedTypeId(null);
    setSearchQuery('');
  };

  const handleTypeChange = (typeId: number | null) => {
    setSelectedTypeId(typeId);
  };

  return (
    <div className="trips-page">
      
      {/* ── Hero Banner ── */}
      <section className="trips-hero">
        <img className="trips-heroBg" src={imgHero} alt="Trips Banner" />
        <div className="trips-heroOverlay"></div>
        <div className="trips-heroInner">
          <h1 className="trips-heroTitle">{t('tripsPage.heroTitle')}</h1>
        </div>
      </section>

      {/* ── Main Layout ── */}
      <section className="trips-contentSection">
        <div className="trips-contentWrap">
          
          {/* Breadcrumb */}
          <div className="trips-breadcrumb">
            <Link to="/" className="trips-breadcrumbLink">{t('tripsPage.breadcrumbHome')}</Link>
            <span className="trips-breadcrumbSep">&gt;</span>
            <span className="trips-breadcrumbActive">{t('tripsPage.breadcrumbActive')}</span>
          </div>

          <div className="trips-splitLayout">
            
            {/* ── Left Sidebar (Filter) ── */}
            {isMobileFilterOpen && (
              <div className="trips-sidebarOverlay" onClick={() => setIsMobileFilterOpen(false)}></div>
            )}
            <aside className={`trips-sidebar ${isMobileFilterOpen ? 'trips-sidebar--open' : ''}`}>
              <div className="trips-sbHeader">
                <h3 className="trips-sbTitle">{t('tripsPage.filterTitle')}</h3>
                <button className="trips-sbClear" onClick={clearFilters}>{t('tripsPage.clearAllBtn')}</button>
              </div>

              {/* Destination */}
              <div className="trips-sbGroup">
                <div className="trips-sbGroupTitle">
                  <MapPin size={16} color="#1e659e" /> {t('tripsPage.destinationHeader')}
                </div>
                <div className="trips-sbDropdown" style={{ position: 'relative' }} onClick={() => setDestDropdownOpen(!destDropdownOpen)}>
                  <span>{destination === 'ALL_DESTINATIONS' ? t('tripsPage.allDestinations') : destination}</span>
                  <ChevronDown size={14} color="#64748b" />
                  {destDropdownOpen && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', marginTop: '4px', zIndex: 10, overflow: 'hidden' }}>
                      {allDestinations.map(dest => (
                        <div 
                          key={dest} 
                          style={{ padding: '8px 12px', cursor: 'pointer', fontSize: '13px', borderBottom: '1px solid #f1f5f9' }}
                          onClick={() => setDestination(dest)}
                        >
                          {dest === 'ALL_DESTINATIONS' ? t('tripsPage.allDestinations') : dest}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Price Range */}
              <div className="trips-sbGroup">
                <div className="trips-sbGroupTitle" style={{ marginBottom: '12px' }}>
                  <Tag size={16} color="#1e659e" /> {t('tripsPage.priceRangeHeader')}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input 
                    type="number" 
                    placeholder={t('tripsPage.minPrice')} 
                    value={minPrice} 
                    onChange={(e) => setMinPrice(e.target.value !== '' ? Number(e.target.value) : '')} 
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', color: '#0f2f44', outline: 'none' }} 
                  />
                  <span style={{ color: '#94a3b8' }}>-</span>
                  <input 
                    type="number" 
                    placeholder={t('tripsPage.maxPrice')} 
                    value={maxPrice} 
                    onChange={(e) => setMaxPrice(e.target.value !== '' ? Number(e.target.value) : '')} 
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', color: '#0f2f44', outline: 'none' }} 
                  />
                </div>
              </div>

              {/* Trips Types */}
              <div className="trips-sbGroup">
                <h4 className="trips-sbGroupHeading">{t('tripsPage.tripTypeHeader')}</h4>
                <ul className="trips-sbCheckList">
                  <li className="trips-sbCheckItem">
                    <label className="trips-sbCheckboxWrap">
                      <input 
                        type="checkbox" 
                        checked={selectedTypeId === null}
                        onChange={() => handleTypeChange(null)}
                      />
                      <span className="trips-sbCustomCheck">
                        {selectedTypeId === null && <Check size={12} color="#fff" />}
                      </span>
                      {t('tripsPage.allTypes')}
                    </label>
                  </li>
                  {tripTypes.map(type => (
                    <li className="trips-sbCheckItem" key={type.id}>
                      <label className="trips-sbCheckboxWrap">
                        <input 
                          type="checkbox" 
                          checked={selectedTypeId === type.id}
                          onChange={() => handleTypeChange(type.id)}
                        />
                        <span className="trips-sbCustomCheck">
                          {selectedTypeId === type.id && <Check size={12} color="#fff" />}
                        </span>
                        {type.name}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mobile Apply Button */}
              <div className="trips-sbMobileApply">
                <button type="button" onClick={() => setIsMobileFilterOpen(false)}>{t('tripsPage.applyBtn')}</button>
              </div>
            </aside>

            {/* ── Main Content (Grid) ── */}
            <main className="trips-mainContent">
              
              {/* Toolbar */}
              <div className="trips-toolbar">
                <span className="trips-resultCount">
                  {sortedTrips.length} {sortedTrips.length === 1 ? t('tripsPage.tripFound') : t('tripsPage.tripsFound')}
                </span>
                
                <div className="trips-searchBox">
                  <Search size={16} color="#94a3b8" />
                  <input 
                    type="text" 
                    placeholder={t('tripsPage.searchPlaceholder')} 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="trips-sortControlWrap">
                  <div className="trips-sortControl">
                    <span className="trips-sortLabel">{t('tripsPage.sortBy')}</span>
                    <div className="trips-sortDropdown" style={{ position: 'relative' }} onClick={() => setSortDropdownOpen(!sortDropdownOpen)}>
                      <span>{sortBy === 'Latest' ? t('tripsPage.latest') : t('tripsPage.oldest')}</span>
                      <ChevronDown size={14} color="#64748b" />
                      {sortDropdownOpen && (
                        <div style={{ position: 'absolute', top: '100%', right: 0, background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', marginTop: '4px', zIndex: 10, width: '100px', overflow: 'hidden' }}>
                          <div style={{ padding: '8px 12px', cursor: 'pointer', fontSize: '13px', borderBottom: '1px solid #f1f5f9' }} onClick={() => setSortBy('Latest')}>{t('tripsPage.latest')}</div>
                          <div style={{ padding: '8px 12px', cursor: 'pointer', fontSize: '13px' }} onClick={() => setSortBy('Oldest')}>{t('tripsPage.oldest')}</div>
                        </div>
                      )}
                    </div>
                  </div>
                  <button className="trips-mobileFilterBtn" onClick={() => setIsMobileFilterOpen(true)}>
                    <img src={iconFilter} alt="Filter" />
                  </button>
                </div>
              </div>

              {/* Grid */}
              <div className="trips-grid">
                {loading ? (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '80px 0', color: '#1e659e', fontWeight: 600 }}>
                    {t('tripsPage.loadingText')}
                  </div>
                ) : sortedTrips.length === 0 ? (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '80px 0', color: '#64748b' }}>
                    {t('tripsPage.noTripsFound')}
                  </div>
                ) : (
                  sortedTrips.map(trip => {
                    const primaryImg = trip.images?.find(i => i.isPrimary) || trip.images?.[0];
                    const tripImgUrl = getTripImageUrl(primaryImg?.imageUrl || null) || imgTrip;
                    
                    return (
                      <div className="trips-card" key={trip.id}>
                        <Link to={`/trips/${trip.id}/${toSlug(trip.name || 'trip')}`} className="trips-cardImageWrap" style={{ textDecoration: 'none', display: 'block' }}>
                          <img src={tripImgUrl} alt={trip.name || 'Trip'} className="trips-cardImage" />
                        </Link>
                        
                        <div className="trips-cardBody">
                          <span className="trips-cardSubtitle">{trip.tripTypeName || 'Adventure'}</span>
                          <Link to={`/trips/${trip.id}/${toSlug(trip.name || 'trip')}`} style={{ textDecoration: 'none' }}>
                            <h3 className="trips-cardTitle">{trip.name}</h3>
                          </Link>
                          
                          <div className="trips-cardMetaRow">
                            <span className="trips-cardMeta">
                              <Clock size={16} /> {trip.durationValue} {trip.durationTypeName ? t('homePage.popularTours.' + trip.durationTypeName.toLowerCase(), { defaultValue: trip.durationTypeName }) : ''}
                            </span>
                            <span className="trips-cardMetaSeparator">|</span>
                            <span className="trips-cardMeta">
                              <MapPin size={16} /> {trip.destination || 'Egypt'}
                            </span>
                          </div>

                          <div className="trips-cardFooterRow" style={{ marginTop: 'auto' }}>
                            <div className="trips-cardPrice" style={{ marginLeft: 'auto' }}>
                              <span className="trips-cardPriceSymbol">€</span> <span className="trips-cardPriceValue">{trip.adultPrice}</span>
                            </div>
                          </div>

                          <div className="trips-cardActionBtns">
                            <Link to={`/trips/${trip.id}/${toSlug(trip.name || 'trip')}`} className="trips-bookBtn" style={{ textDecoration: 'none', textAlign: 'center' }}>
                              {t('tripsPage.bookNowBtn')}
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

            </main>

          </div>
        </div>
      </section>

    </div>
  );
}
