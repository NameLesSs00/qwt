import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronDown, Search } from 'lucide-react';
import { motion } from "motion/react";

// Using the actual images requested from plogs folder
import img1 from '../../assets/plogs/Subtract.png';
import img2 from '../../assets/plogs/Subtract-1.png';
import img3 from '../../assets/plogs/Subtract-2.png';
import img4 from '../../assets/plogs/Subtract-3.png';
import img5 from '../../assets/plogs/Subtract-4.png';
import img6 from '../../assets/plogs/Subtract-5.png';

import './blogsPage.scss';

export function BlogsPage() {
  const navigate = useNavigate();
  const tags = ['All', 'Sea', 'Safari', 'History'];
  const destinationsList = ['All Destinations', 'Aswan', 'Luxor', 'Hurghada'];
  
  // Simulated blog cards data with the requested images
  const allBlogs = [
    { id: 1, image: img1, title: 'Travel Tips &\nStories', tag: 'History', destination: 'Aswan' },
    { id: 2, image: img2, title: 'Luxor Safari Adventures', tag: 'Safari', destination: 'Luxor' },
    { id: 3, image: img3, title: 'Diving in the Red Sea', tag: 'Sea', destination: 'Hurghada' },
    { id: 4, image: img4, title: 'Secrets of the Pharaohs', tag: 'History', destination: 'Luxor' },
    { id: 5, image: img5, title: 'Aswan Nile Cruise', tag: 'Sea', destination: 'Aswan' },
    { id: 6, image: img6, title: 'Hurghada Desert Safari', tag: 'Safari', destination: 'Hurghada' },
  ];

  const [activeTag, setActiveTag] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDestination, setActiveDestination] = useState('All Destinations');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [visibleCount, setVisibleCount] = useState(6);
  
  const filteredBlogs = allBlogs.filter(blog => {
    const matchesTag = activeTag === 'All' || blog.tag === activeTag;
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDest = activeDestination === 'All Destinations' || blog.destination === activeDestination;
    return matchesTag && matchesSearch && matchesDest;
  });

  const blogs = filteredBlogs.slice(0, visibleCount);

  // If there were more than 6, this logic allows revealing more
  const handleSeeMore = () => {
    setVisibleCount(prev => Math.min(prev + 3, filteredBlogs.length));
  };

  const handleBlogClick = () => {
    navigate('/blogs/details');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="blogs-page"
    >
      <div className="blogs-wrap">
        
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="blogs-breadcrumb"
        >
          <Link to="/" className="blogs-breadcrumbLink">Home</Link>
          <span className="blogs-breadcrumbSep">&gt;</span>
          <span className="blogs-breadcrumbActive">Blogs</span>
        </motion.div>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="blogs-toolbar"
        >
          <div className="blogs-tagsRow">
            <span className="blogs-tagsLabel">Popular tags:</span>
            {tags.map((tag) => (
              <motion.button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`blogs-tagBtn ${activeTag === tag ? 'blogs-tagBtn--active' : ''}`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
              >
                {tag}
              </motion.button>
            ))}
          </div>

          <div className="blogs-filters">
            <div className="blogs-dropdownContainer">
              <div className="blogs-dropdown" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <span>{activeDestination === 'All Destinations' ? 'Destinations' : activeDestination}</span>
                <ChevronDown size={14} color="#64748b" />
              </div>
              {isDropdownOpen && (
                <div className="blogs-dropdownMenu">
                  {destinationsList.map(dest => (
                    <div
                      key={dest}
                      className="blogs-dropdownItem"
                      onClick={() => {
                        setActiveDestination(dest);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {dest}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="blogs-searchBox">
              <Search size={16} color="#94a3b8" />
              <input 
                type="text" 
                placeholder="Search" 
                className="blogs-searchInput" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="blogs-grid">
          {blogs.map((blog) => (
             // Added onClick navigation to details page
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: blog.id * 0.04 }}
              whileHover={{ y: -6 }}
              className="blogs-card"
              key={blog.id}
              onClick={handleBlogClick}
            >
              <motion.img
                initial={{ scale: 1.02 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                src={blog.image}
                alt="Blog cover"
                className="blogs-cardBg"
              />
              <div className="blogs-cardOverlay"></div>
              <div className="blogs-cardContent">
                <h3 className="blogs-cardTitle">{blog.title}</h3>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="blogs-cardBtn"
                  type="button"
                >
                  Read More <ArrowRight size={14} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Actions */}
        {visibleCount < filteredBlogs.length && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="blogs-actionRow"
          >
            <motion.button
              className="blogs-seeMoreBtn"
              onClick={handleSeeMore}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="button"
            >
              See More
            </motion.button>
          </motion.div>
        )}
        
        {filteredBlogs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            style={{ textAlign: 'center', color: '#64748b', padding: '40px 0' }}
          >
            No blogs found matching the filters.
          </motion.div>
        )}

      </div>
    </motion.div>
  );
}
