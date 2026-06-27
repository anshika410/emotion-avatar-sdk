import { useData } from '../../context/DataContext';

export default function AdminAdmissions() {
  const { admissions, setAdmissions } = useData();

  const updateStatus = (id: string, status: 'pending' | 'approved' | 'rejected') => {
    setAdmissions(admissions.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this admission request?')) {
      setAdmissions(admissions.filter((a) => a.id !== id));
    }
  };

  const pending = admissions.filter((a) => a.status === 'pending');
  const processed = admissions.filter((a) => a.status !== 'pending');

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Admissions</h1>
        <p className="text-gray-500">Manage admission requests ({pending.length} pending)</p>
      </div>

      {pending.length > 0 && (
        <div className="mb-8">
          <h3 className="font-bold text-gray-700 mb-4">Pending Requests</h3>
          <div className="space-y-3">
            {pending.map((admission) => (
              <div key={admission.id} className="bg-white rounded-xl shadow-sm p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-gray-800">{admission.name}</h4>
                    <p className="text-sm text-gray-500">{admission.email} | {admission.phone}</p>
                    <p className="text-sm text-gray-500">Age: {admission.age} | Course: {admission.course}</p>
                    {admission.message && <p className="text-sm text-gray-600 mt-2 italic">&ldquo;{admission.message}&rdquo;</p>}
                    <p className="text-xs text-gray-400 mt-1">{admission.createdAt}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => updateStatus(admission.id, 'approved')} className="px-4 py-2 bg-india-green text-white rounded-lg text-sm hover:bg-india-green-dark transition-colors">Approve</button>
                    <button onClick={() => updateStatus(admission.id, 'rejected')} className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors">Reject</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="font-bold text-gray-700 mb-4">Processed Requests</h3>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 hidden md:table-cell">Course</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 hidden md:table-cell">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {processed.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{a.name}</p>
                    <p className="text-xs text-gray-400">{a.email}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">{a.course}</td>
                  <td className="px-4 py-3 text-sm text-gray-400 hidden md:table-cell">{a.createdAt}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${a.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{a.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDelete(a.id)} className="text-red-400 hover:text-red-600 text-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {processed.length === 0 && <div className="text-center py-8 text-gray-400 text-sm">No processed requests</div>}
        </div>
      </div>
    </div>
  );
}
