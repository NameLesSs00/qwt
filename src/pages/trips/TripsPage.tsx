import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, ChevronDown, Check, MapPin, 
  Tag, Clock, User, Star, Minus, Plus 
} from 'lucide-react';

import imgHero from '../../assets/trips/Frame 140.png';
import imgTrip from '../../assets/trips/Frame 23.png';
import iconRibbon from '../../assets/trips/Frame 24.svg';
import iconFilter from '../../assets/trips/mage_filter.png';

import './tripsPage.scss';

const ALL_TRIPS = [
  { id: 1, image: imgTrip, type: 'Safari Trips', title: 'Desert Safari Quad Adventure', time: '4 Hours', durationDays: 1, location: 'Hurghada', tourType: 'Private', rating: 4.8, reviews: 345, price: 26.8, date: '2024-03-20' },
  { id: 2, image: imgTrip, type: 'Sea Trips', title: 'Orange Bay Island Safari', time: '8 Hours', durationDays: 1, location: 'Hurghada', tourType: 'Group', rating: 4.5, reviews: 120, price: 45.0, date: '2024-03-22' },
  { id: 3, image: imgTrip, type: 'Snorkeling Trips', title: 'Giftun Island Snorkeling', time: '2 Days', durationDays: 2, location: 'Sharm El-Sheikh', tourType: 'Private', rating: 4.9, reviews: 500, price: 80.5, date: '2024-03-18' },
  { id: 4, image: imgTrip, type: 'Historical Trips', title: 'Luxor and Karnak Tour', time: '3 Days', durationDays: 3, location: 'Luxor', tourType: 'Group', rating: 4.7, reviews: 890, price: 150.0, date: '2024-03-25' },
  { id: 5, image: imgTrip, type: 'Safari Trips', title: 'Jeep Safari and Bedouin Village', time: '6 Hours', durationDays: 1, location: 'Sharm El-Sheikh', tourType: 'Private', rating: 4.6, reviews: 210, price: 30.0, date: '2024-03-26' },
  { id: 6, image: imgTrip, type: 'Snorkeling Trips', title: 'Dolphin House Snorkeling', time: '1 Day', durationDays: 1, location: 'Marsa Alam', tourType: 'Group', rating: 4.4, reviews: 180, price: 40.0, date: '2024-03-24' },
];

export function TripsPage() {
  const [destination, setDestination] = useState<string>('All Destinations');
  const [destDropdownOpen, setDestDropdownOpen] = useState(false);

  const [priceRange, setPriceRange] = useState<number>(100);

  const [selectedTypes, setSelectedTypes] = useState<string[]>(['Safari Trips']);

  const [duration, setDuration] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  const [sortBy, setSortBy] = useState<'Latest' | 'Oldest'>('Latest');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const increaseDuration = () => setDuration(prev => prev + 1);
  const decreaseDuration = () => setDuration(prev => Math.max(1, prev - 1));

  const handleTypeChange = (type: string, isChecked: boolean) => {
    if (type === 'All Trips') {
      setSelectedTypes(isChecked ? ['All Trips'] : []);
    } else {
      setSelectedTypes(prev => {
        let newTypes = isChecked ? [...prev, type] : prev.filter(t => t !== type);
        newTypes = newTypes.filter(t => t !== 'All Trips');
        return newTypes;
      });
    }
  };

  const filteredTrips = useMemo(() => {
    return ALL_TRIPS.filter(trip => {
      if (destination !== 'All Destinations' && trip.location !== destination) return false;
      if (trip.price > priceRange) return false;
      if (!selectedTypes.includes('All Trips') && selectedTypes.length > 0) {
        if (!selectedTypes.includes(trip.type)) return false;
      }
      if (trip.durationDays > duration) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        if (!trip.title.toLowerCase().includes(q) && !trip.location.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      return sortBy === 'Latest' ? timeB - timeA : timeA - timeB;
    });
  }, [destination, priceRange, selectedTypes, duration, searchQuery, sortBy]);

  const uniqueDestinations = ['All Destinations', ...Array.from(new Set(ALL_TRIPS.map(t => t.location)))];

  const clearFilters = () => {
    setDestination('All Destinations');
    setPriceRange(100);
    setSelectedTypes(['All Trips']);
    setDuration(1);
    setSearchQuery('');
  };

  return (
    <div className="trips-page">
      
      {/* ── Hero Banner ── */}
      <section className="trips-hero">
        <img className="trips-heroBg" src={imgHero} alt="Trips Banner" />
        <div className="trips-heroOverlay"></div>
        <div className="trips-heroInner">
          <h1 className="trips-heroTitle">Everything You Need to Know Before a Desert Safari</h1>
        </div>
      </section>

      {/* ── Main Layout ── */}
      <section className="trips-contentSection">
        <div className="trips-contentWrap">
          
          {/* Breadcrumb */}
          <div className="trips-breadcrumb">
            <Link to="/" className="trips-breadcrumbLink">Home</Link>
            <span className="trips-breadcrumbSep">&gt;</span>
            <span className="trips-breadcrumbActive">Explore</span>
          </div>

          <div className="trips-splitLayout">
            
            {/* ── Left Sidebar (Filter) ── */}
            {isMobileFilterOpen && (
              <div className="trips-sidebarOverlay" onClick={() => setIsMobileFilterOpen(false)}></div>
            )}
            <aside className={`trips-sidebar ${isMobileFilterOpen ? 'trips-sidebar--open' : ''}`}>
              <div className="trips-sbHeader">
                <h3 className="trips-sbTitle">Filter</h3>
                <button className="trips-sbClear" onClick={clearFilters}>Clear all filter</button>
              </div>

              {/* Destination */}
              <div className="trips-sbGroup">
                <div className="trips-sbGroupTitle">
                  <MapPin size={16} color="#1e659e" /> Destination
                </div>
                <div className="trips-sbDropdown" style={{ position: 'relative' }} onClick={() => setDestDropdownOpen(!destDropdownOpen)}>
                  <span>{destination}</span>
                  <ChevronDown size={14} color="#64748b" />
                  {destDropdownOpen && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', marginTop: '4px', zIndex: 10, overflow: 'hidden' }}>
                      {uniqueDestinations.map(dest => (
                        <div 
                          key={dest} 
                          style={{ padding: '8px 12px', cursor: 'pointer', fontSize: '13px', borderBottom: '1px solid #f1f5f9' }}
                          onClick={() => setDestination(dest)}
                        >
                          {dest}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="trips-sbGroup">
                <div className="trips-sbGroupTitle">
                  <Tag size={16} color="#1e659e" /> Price
                </div>
                <div className="trips-sbSliderWrapper">
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                      cursor: 'pointer',
                      zIndex: 10,
                      top: 0,
                      left: 0
                    }}
                  />
                  <div className="trips-sbSliderThumb" style={{ left: `${(priceRange / 200) * 100}%` }}>
                    <div className="trips-sbSliderValue">${priceRange}</div>
                  </div>
                  <div className="trips-sbSliderTrack">
                    <div className="trips-sbSliderFill" style={{ width: `${(priceRange / 200) * 100}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Trips Types */}
              <div className="trips-sbGroup">
                <h4 className="trips-sbGroupHeading">Trips Types</h4>
                <ul className="trips-sbCheckList">
                  {['Sea Trips', 'Safari Trips', 'Snorkeling Trips', 'Historical Trips', 'All Trips'].map(type => (
                    <li className="trips-sbCheckItem" key={type}>
                      <label className="trips-sbCheckboxWrap">
                        <input 
                          type="checkbox" 
                          checked={selectedTypes.includes(type)}
                          onChange={(e) => handleTypeChange(type, e.target.checked)}
                        />
                        <span className="trips-sbCustomCheck">
                          {selectedTypes.includes(type) && <Check size={12} color="#fff" />}
                        </span>
                        {type}
                      </label>
                      <span className="trips-sbCount">
                        {type === 'All Trips' ? ALL_TRIPS.length : ALL_TRIPS.filter(t => t.type === type).length}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Duration */}
              <div className="trips-sbGroup">
                <h4 className="trips-sbGroupHeading">Duration</h4>
                <div className="trips-sbDurationRow">
                  <div className="trips-sbStepperGroup">
                    <button type="button" onClick={decreaseDuration}><Minus size={14} /></button>
                    <div className="trips-sbStepperDivider"></div>
                    <button type="button" onClick={increaseDuration}><Plus size={14} /></button>
                  </div>
                  <input type="text" className="trips-sbDurationInput" readOnly value={duration} />
                  <span className="trips-sbDurationUnit">Day</span>
                </div>
              </div>

              {/* Mobile Apply Button */}
              <div className="trips-sbMobileApply">
                <button type="button" onClick={() => setIsMobileFilterOpen(false)}>Apply</button>
              </div>
            </aside>

            {/* ── Main Content (Grid) ── */}
            <main className="trips-mainContent">
              
              {/* Toolbar */}
              <div className="trips-toolbar">
                <span className="trips-resultCount">{filteredTrips.length} Trips Found</span>
                
                <div className="trips-searchBox">
                  <Search size={16} color="#94a3b8" />
                  <input 
                    type="text" 
                    placeholder="Search" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="trips-sortControlWrap">
                  <div className="trips-sortControl">
                    <span className="trips-sortLabel">Sort by</span>
                    <div className="trips-sortDropdown" style={{ position: 'relative' }} onClick={() => setSortDropdownOpen(!sortDropdownOpen)}>
                      <span>{sortBy}</span>
                      <ChevronDown size={14} color="#64748b" />
                      {sortDropdownOpen && (
                        <div style={{ position: 'absolute', top: '100%', right: 0, background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', marginTop: '4px', zIndex: 10, width: '100px', overflow: 'hidden' }}>
                          <div style={{ padding: '8px 12px', cursor: 'pointer', fontSize: '13px', borderBottom: '1px solid #f1f5f9' }} onClick={() => setSortBy('Latest')}>Latest</div>
                          <div style={{ padding: '8px 12px', cursor: 'pointer', fontSize: '13px' }} onClick={() => setSortBy('Oldest')}>Oldest</div>
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
                {filteredTrips.map(trip => (
                  <div className="trips-card" key={trip.id}>
                    <Link to={`/trips/${trip.id}`} className="trips-cardImageWrap" style={{ textDecoration: 'none', display: 'block' }}>
                      <img src={trip.image} alt={trip.title} className="trips-cardImage" />
                      <div className="trips-cardRibbon">
                        <span>T.R</span>
                      </div>
                    </Link>
                    
                    <div className="trips-cardBody">
                      <span className="trips-cardSubtitle">{trip.type}</span>
                      <Link to={`/trips/${trip.id}`} style={{ textDecoration: 'none' }}>
                        <h3 className="trips-cardTitle">{trip.title}</h3>
                      </Link>
                      
                      <div className="trips-cardMetaRow">
                        <span className="trips-cardMeta">
                          <Clock size={16} /> {trip.time}
                        </span>
                        <span className="trips-cardMetaSeparator">|</span>
                        <span className="trips-cardMeta">
                          <MapPin size={16} /> {trip.location}
                        </span>
                        <span className="trips-cardMetaSeparator">|</span>
                        <span className="trips-cardMeta">
                          <User size={16} /> {trip.tourType}
                        </span>
                      </div>

                      <div className="trips-cardFooterRow">
                        <div className="trips-cardRating">
                          <Star size={18} fill="#f59e0b" color="#f59e0b" />
                          <span>{trip.rating} <span className="trips-cardReviews">({trip.reviews} Review)</span></span>
                        </div>
                        <div className="trips-cardPrice">
                          <span className="trips-cardPriceSymbol">$</span> <span className="trips-cardPriceValue">{trip.price} USA</span>
                        </div>
                      </div>

                      <div className="trips-cardActionBtns">
                        <Link to={`/trips/${trip.id}`} className="trips-bookBtn" style={{ textDecoration: 'none', textAlign: 'center' }}>Book Now</Link>
                        <button className="trips-addCartBtn">Add To cart</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </main>

          </div>
        </div>
      </section>

    </div>
  );
}
