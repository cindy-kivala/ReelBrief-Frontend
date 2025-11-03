// /**
//  * FreelancerVetting.jsx
//  * Owner: Monica
//  * Description:
//  * Admin vetting page to review, approve, or reject freelancer applications.
//  * 
//  * Connected to:
//  *  - GET /api/freelancers/pending
//  *  - PATCH /api/freelancers/:id/approve
//  *  - PATCH /api/freelancers/:id/reject
//  */

// import React, { useEffect, useState } from "react";
// import axiosClient from "../../api/axiosClient";

// export default function FreelancerVetting() {
//   const [freelancers, setFreelancers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [rejectionReason, setRejectionReason] = useState("");
//   const [selectedFreelancer, setSelectedFreelancer] = useState(null);

//   // Load pending freelancers
//   useEffect(() => {
//     fetchFreelancers();
//   }, []);

//   const fetchFreelancers = async () => {
//     try {
//       const res = await axiosClient.get("/freelancers/pending");
//       if (res.data.success) {
//         setFreelancers(res.data.freelancers);
//       } else {
//         setError("Failed to load freelancers.");
//       }
//     } catch (err) {
//       console.error("Error fetching freelancers:", err);
//       setError("Server error — try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Approve freelancer
//   const handleApprove = async (id) => {
//     try {
//       await axiosClient.patch(`/freelancers/${id}/approve`);
//       setFreelancers((prev) => prev.filter((f) => f.id !== id));
//     } catch (err) {
//       console.error("Approve error:", err);
//       alert("Failed to approve freelancer.");
//     }
//   };

//   //  Reject freelancer
//   const handleReject = async (id) => {
//     if (!rejectionReason.trim()) {
//       alert("Please enter a rejection reason.");
//       return;
//     }
//     try {
//       await axiosClient.patch(`/freelancers/${id}/reject`, {
//         reason: rejectionReason,
//       });
//       setFreelancers((prev) => prev.filter((f) => f.id !== id));
//       setSelectedFreelancer(null);
//       setRejectionReason("");
//     } catch (err) {
//       console.error("Reject error:", err);
//       alert("Failed to reject freelancer.");
//     }
//   };

//   if (loading) return <p className="p-6 text-gray-500">Loading freelancers...</p>;
//   if (error) return <p className="p-6 text-red-600">{error}</p>;

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen">
//       <h2 className="text-2xl font-bold mb-6 text-gray-800">
//         Freelancer Vetting
//       </h2>

//       {freelancers.length === 0 ? (
//         <p className="text-gray-600 text-center">
//           No freelancers pending approval 
//         </p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {freelancers.map((freelancer) => (
//             <div
//               key={freelancer.id}
//               className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-xl font-semibold text-gray-800">
//                   {freelancer.name}
//                 </h3>
//                 <span
//                   className={`text-sm px-3 py-1 rounded-full ${
//                     freelancer.application_status === "pending"
//                       ? "bg-yellow-100 text-yellow-800"
//                       : freelancer.application_status === "approved"
//                       ? "bg-green-100 text-green-800"
//                       : "bg-red-100 text-red-800"
//                   }`}  >
//                   {freelancer.application_status}
//                 </span>
//               </div>

//               <p className="text-gray-600 mb-2">{freelancer.email}</p>
//               <p className="text-gray-700 mb-2">{freelancer.bio}</p>

//               {freelancer.cv_url && (
//                 <a
//                   href={freelancer.cv_url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-600 underline mb-2 block">
//                   View CV
//                 </a>
//               )}

//               {freelancer.portfolio_url && (
//                 <a
//                   href={freelancer.portfolio_url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-purple-600 underline mb-2 block"
//                 >
//                   View Portfolio
//                 </a>
//               )}

//               <p className="text-sm text-gray-500">
//                 Experience: {freelancer.years_experience} years | Rate: $
//                 {freelancer.hourly_rate}/hr
//               </p>

//               <div className="mt-4 flex gap-3">
//                 <button
//                   onClick={() => handleApprove(freelancer.id)}
//                   className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
//                 >
//                   Approve
//                 </button>

//                 <button
//                   onClick={() => setSelectedFreelancer(freelancer)}
//                   className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
//                   Reject
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Rejection Modal */}
//       {selectedFreelancer && (
//         <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
//           <div className="bg-white p-6 rounded-2xl w-96 shadow-lg">
//             <h3 className="text-lg font-semibold mb-3 text-gray-800">
//               Reject {selectedFreelancer.name}?
//             </h3>
//             <textarea
//               className="w-full p-3 border rounded-lg mb-3"
//               rows={3}
//               placeholder="Enter reason..."
//               value={rejectionReason}
//               onChange={(e) => setRejectionReason(e.target.value)}/>
//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => setSelectedFreelancer(null)}
//                 className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
//                 Cancel
//               </button>
//               <button
//                 onClick={() => handleReject(selectedFreelancer.id)}
//                 className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
//                 Confirm Reject
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
