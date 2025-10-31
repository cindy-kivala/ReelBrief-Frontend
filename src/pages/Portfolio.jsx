// Portfolio.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Portfolio = () => {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolioItems();
  }, []);

  const fetchPortfolioItems = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('/api/deliverables/portfolio/items', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPortfolioItems(response.data.portfolio_items);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (itemId, currentVisibility) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.patch(
        `/api/deliverables/portfolio/items/${itemId}/toggle-visibility`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state
      setPortfolioItems(prev => prev.map(item => 
        item.id === itemId ? response.data.portfolio_item : item
      ));
    } catch (error) {
      console.error('Error toggling visibility:', error);
    }
  };

  if (loading) return <div>Loading portfolio...</div>;

  return (
    <div className="portfolio-container">
      <h1>My Portfolio</h1>
      <div className="portfolio-grid">
        {portfolioItems.map(item => (
          <div key={item.id} className="portfolio-card">
            {item.cover_image_url && (
              <img src={item.cover_image_url} alt={item.title} />
            )}
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <div className="skills">
              {item.skills_used?.map(skill => (
                <span key={skill} className="skill-tag">{skill}</span>
              ))}
            </div>
            <div className="portfolio-actions">
              <button 
                onClick={() => toggleVisibility(item.id, item.is_visible)}
                className={`visibility-btn ${item.is_visible ? 'visible' : 'hidden'}`}
              >
                {item.is_visible ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Portfolio;