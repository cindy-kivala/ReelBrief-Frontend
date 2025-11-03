// // PortfolioDashboard.jsx
// import React, { useState, useEffect } from 'react';

// const PortfolioDashboard = () => {
//   const [portfolioStats, setPortfolioStats] = useState({
//     totalItems: 0,
//     visibleItems: 0,
//     featuredItems: 0
//   });

//   const [recentItems, setRecentItems] = useState([]);

//   useEffect(() => {
//     fetchPortfolioData();
//   }, []);

//   const fetchPortfolioData = async () => {
//     try {
//       const token = localStorage.getItem('access_token');
      
//       // Fetch portfolio items
//       const portfolioResponse = await fetch('/api/deliverable/portfolio/items?per_page=50', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const portfolioData = await portfolioResponse.json();
      
//       if (portfolioData.success) {
//         const items = portfolioData.portfolio_items;
//         setRecentItems(items.slice(0, 5)); // Show 5 most recent
        
//         // Calculate stats
//         setPortfolioStats({
//           totalItems: items.length,
//           visibleItems: items.filter(item => item.is_visible).length,
//           featuredItems: items.filter(item => item.is_featured).length
//         });
//       }
//     } catch (error) {
//       console.error('Error fetching portfolio data:', error);
//     }
//   };

//   return (
//     <div className="portfolio-dashboard">
//       <h1>Portfolio Management</h1>
      
//       {/* Stats Cards */}
//       <div className="stats-grid">
//         <div className="stat-card">
//           <h3>Total Projects</h3>
//           <p className="stat-number">{portfolioStats.totalItems}</p>
//         </div>
//         <div className="stat-card">
//           <h3>Visible</h3>
//           <p className="stat-number">{portfolioStats.visibleItems}</p>
//         </div>
//         <div className="stat-card">
//           <h3>Featured</h3>
//           <p className="stat-number">{portfolioStats.featuredItems}</p>
//         </div>
//       </div>

//       {/* Recent Portfolio Items */}
//       <div className="recent-portfolio">
//         <h2>Recent Portfolio Items</h2>
//         {recentItems.map(item => (
//           <div key={item.id} className="portfolio-item-preview">
//             <div className="preview-header">
//               <h4>{item.title}</h4>
//               <span className={`status ${item.is_visible ? 'visible' : 'hidden'}`}>
//                 {item.is_visible ? 'Visible' : 'Hidden'}
//               </span>
//             </div>
//             <p className="description">{item.description}</p>
//             <div className="skills">
//               {item.skills_used?.slice(0, 3).map(skill => (
//                 <span key={skill} className="skill">{skill}</span>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default PortfolioDashboard;