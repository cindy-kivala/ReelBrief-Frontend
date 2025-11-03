// /**
//  * authAPI.js
//  * Owner: Monica
//  * Description: Handles user authentication (login/register/logout).
//  */

// import React, { useState, useEffect } from 'react';

// const AssignFreelancerModal = ({ projectId, isOpen, onClose, onAssign }) => {
//   const [availableFreelancers, setAvailableFreelancers] = useState([]);
//   const [selectedFreelancer, setSelectedFreelancer] = useState('');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (isOpen) {
//       fetchAvailableFreelancers();
//     }
//   }, [isOpen]);

//   const fetchAvailableFreelancers = async () => {
//     try {
//       const token = localStorage.getItem('access_token');
//       const response = await fetch('/api/projects/available-freelancers', {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
//       const data = await response.json();
//       if (data.success) {
//         setAvailableFreelancers(data.freelancers);
//       }
//     } catch (error) {
//       console.error('Error fetching freelancers:', error);
//     }
//   };

//   const handleAssign = async () => {
//     if (!selectedFreelancer) return;

//     setLoading(true);
//     try {
//       const token = localStorage.getItem('access_token');
//       const response = await fetch(`/api/projects/${projectId}/assign-freelancer`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           freelancer_id: parseInt(selectedFreelancer) // Use user ID
//         })
//       });

//       const result = await response.json();
      
//       if (response.ok) {
//         onAssign(result.project);
//         onClose();
//       } else {
//         alert(result.error || 'Failed to assign freelancer');
//       }
//     } catch (error) {
//       console.error('Error assigning freelancer:', error);
//       alert('Error assigning freelancer');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <h2>Assign Freelancer</h2>
        
//         <div className="form-group">
//           <label>Select Freelancer:</label>
//           <select 
//             value={selectedFreelancer} 
//             onChange={(e) => setSelectedFreelancer(e.target.value)}
//             disabled={loading}
//           >
//             <option value="">Choose a freelancer...</option>
//             {availableFreelancers.map(freelancer => (
//               <option key={freelancer.user_id} value={freelancer.user_id}>
//                 {freelancer.name} - {freelancer.skills.join(', ')} - ${freelancer.hourly_rate}/hr
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="modal-actions">
//           <button onClick={onClose} disabled={loading}>Cancel</button>
//           <button 
//             onClick={handleAssign} 
//             disabled={!selectedFreelancer || loading}
//             className="primary"
//           >
//             {loading ? 'Assigning...' : 'Assign Freelancer'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AssignFreelancerModal;