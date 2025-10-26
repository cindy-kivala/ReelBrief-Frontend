/**
 * ProjectDetail.jsx
 * Owner: Monica
 * Description: Displays full project details for clients or freelancers.
 */

// TODO:
// - Fetch project details by ID from projectAPI
// - Display related freelancers via FreelancerMatch component
// - Include ProjectForm for edits (if authorized)
function ProjectDetail({ project, onClose, onUpdated}) {
  return (
  
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl p-6 rounded shadow-lg">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-semibold">{project.title}</h2>
          <div className="text-sm text-gray-500">{project.status}</div>
        </div>

        <p className="mt-3 text-gray-700">{project.description}</p>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-500">Budget</div>
            <div className="font-medium">${project.budget}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Deadline</div>
            <div>{project.deadline}</div>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium">Required skills</h4>
          <div className="flex gap-2 mt-2 flex-wrap">
            {project.required_skills?.map(s => <span key={s.id} className="text-xs bg-gray-100 px-2 py-1 rounded">{s.skill_name} • {s.required_proficiency}</span>)}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">Close</button>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetail;