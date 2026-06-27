import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiEye, FiEyeOff, FiSearch } from 'react-icons/fi';
import { useData } from '../../context/DataContext';
import type { Student, TournamentRecord } from '../../types';

const emptyStudent: Student = {
  id: '', name: '', photo: '', beltRank: '', martialArt: '',
  joiningDate: '', coach: '', biography: '', beltProgression: [],
  tournaments: [], gallery: [], videos: [], achievements: [], published: true,
};

const emptyTournament: TournamentRecord = {
  id: '', tournamentName: '', tournamentType: '', martialArt: '',
  category: '', medal: 'Gold', date: '', location: '', certificateImage: '',
};

export default function AdminStudents() {
  const { students, setStudents } = useData();
  const [editing, setEditing] = useState<Student | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.martialArt.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (!editing) return;
    if (isNew) {
      setStudents([...students, { ...editing, id: Date.now().toString() }]);
    } else {
      setStudents(students.map((s) => (s.id === editing.id ? editing : s)));
    }
    setEditing(null); setIsNew(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this student?')) setStudents(students.filter((s) => s.id !== id));
  };

  const addTournament = () => {
    if (!editing) return;
    setEditing({
      ...editing,
      tournaments: [...editing.tournaments, { ...emptyTournament, id: Date.now().toString() }],
    });
  };

  const updateTournament = (index: number, field: keyof TournamentRecord, value: string) => {
    if (!editing) return;
    const updated = [...editing.tournaments];
    updated[index] = { ...updated[index], [field]: value };
    setEditing({ ...editing, tournaments: updated });
  };

  const removeTournament = (index: number) => {
    if (!editing) return;
    setEditing({ ...editing, tournaments: editing.tournaments.filter((_, i) => i !== index) });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Students</h1>
          <p className="text-gray-500">Manage student profiles and records</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 pr-4 py-2 border rounded-lg w-48" />
          </div>
          <button onClick={() => { setEditing({ ...emptyStudent }); setIsNew(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-saffron text-white rounded-lg hover:bg-saffron-dark transition-colors">
            <FiPlus /> Add Student
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Student</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 hidden md:table-cell">Martial Art</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 hidden md:table-cell">Belt</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Medals</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{student.name}</td>
                <td className="px-4 py-3 text-gray-500 text-sm hidden md:table-cell">{student.martialArt}</td>
                <td className="px-4 py-3 text-sm hidden md:table-cell">
                  <span className="px-2 py-0.5 bg-saffron/10 text-saffron rounded-full text-xs font-medium">{student.beltRank}</span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className="flex gap-1">
                    🥇{student.tournaments.filter((t) => t.medal === 'Gold').length}
                    🥈{student.tournaments.filter((t) => t.medal === 'Silver').length}
                    🥉{student.tournaments.filter((t) => t.medal === 'Bronze').length}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${student.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {student.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => { setEditing(student); setIsNew(false); }} className="p-1.5 text-royal-blue hover:bg-royal-blue/10 rounded-lg"><FiEdit2 size={16} /></button>
                    <button onClick={() => setStudents(students.map((s) => s.id === student.id ? { ...s, published: !s.published } : s))} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg">{student.published ? <FiEyeOff size={16} /> : <FiEye size={16} />}</button>
                    <button onClick={() => handleDelete(student.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><FiTrash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">{isNew ? 'Add Student' : 'Edit Student'}</h3>
                <button onClick={() => { setEditing(null); setIsNew(false); }}><FiX size={20} /></button>
              </div>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Name *</label><input type="text" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="w-full px-4 py-2 border rounded-lg" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Photo URL</label><input type="text" value={editing.photo} onChange={(e) => setEditing({ ...editing, photo: e.target.value })} className="w-full px-4 py-2 border rounded-lg" /></div>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Martial Art</label><input type="text" value={editing.martialArt} onChange={(e) => setEditing({ ...editing, martialArt: e.target.value })} className="w-full px-4 py-2 border rounded-lg" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Belt Rank</label><input type="text" value={editing.beltRank} onChange={(e) => setEditing({ ...editing, beltRank: e.target.value })} className="w-full px-4 py-2 border rounded-lg" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Joining Date</label><input type="date" value={editing.joiningDate} onChange={(e) => setEditing({ ...editing, joiningDate: e.target.value })} className="w-full px-4 py-2 border rounded-lg" /></div>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Coach</label><input type="text" value={editing.coach} onChange={(e) => setEditing({ ...editing, coach: e.target.value })} className="w-full px-4 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Biography</label><textarea rows={3} value={editing.biography} onChange={(e) => setEditing({ ...editing, biography: e.target.value })} className="w-full px-4 py-2 border rounded-lg resize-none" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Achievements (one per line)</label><textarea rows={3} value={editing.achievements.join('\n')} onChange={(e) => setEditing({ ...editing, achievements: e.target.value.split('\n').filter(Boolean) })} className="w-full px-4 py-2 border rounded-lg resize-none" /></div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-gray-800">Tournament Records</h4>
                    <button onClick={addTournament} className="flex items-center gap-1 px-3 py-1.5 text-sm text-royal-blue border border-royal-blue/20 rounded-lg hover:bg-royal-blue/5"><FiPlus size={14} /> Add Tournament</button>
                  </div>
                  {editing.tournaments.map((t, i) => (
                    <div key={t.id} className="bg-gray-50 rounded-lg p-4 mb-3 relative">
                      <button onClick={() => removeTournament(i)} className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600"><FiX size={16} /></button>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <input type="text" value={t.tournamentName} onChange={(e) => updateTournament(i, 'tournamentName', e.target.value)} className="w-full px-3 py-1.5 border rounded text-sm" placeholder="Tournament Name" />
                        <select value={t.tournamentType} onChange={(e) => updateTournament(i, 'tournamentType', e.target.value)} className="w-full px-3 py-1.5 border rounded text-sm bg-white">
                          <option value="">Type</option><option>State</option><option>National</option><option>International</option>
                        </select>
                        <input type="text" value={t.martialArt} onChange={(e) => updateTournament(i, 'martialArt', e.target.value)} className="w-full px-3 py-1.5 border rounded text-sm" placeholder="Martial Art" />
                        <input type="text" value={t.category} onChange={(e) => updateTournament(i, 'category', e.target.value)} className="w-full px-3 py-1.5 border rounded text-sm" placeholder="Category" />
                        <select value={t.medal} onChange={(e) => updateTournament(i, 'medal', e.target.value)} className="w-full px-3 py-1.5 border rounded text-sm bg-white">
                          <option>Gold</option><option>Silver</option><option>Bronze</option>
                        </select>
                        <input type="date" value={t.date} onChange={(e) => updateTournament(i, 'date', e.target.value)} className="w-full px-3 py-1.5 border rounded text-sm" />
                        <input type="text" value={t.location} onChange={(e) => updateTournament(i, 'location', e.target.value)} className="w-full px-3 py-1.5 border rounded text-sm" placeholder="Location" />
                        <input type="text" value={t.certificateImage} onChange={(e) => updateTournament(i, 'certificateImage', e.target.value)} className="w-full px-3 py-1.5 border rounded text-sm" placeholder="Certificate Image URL" />
                      </div>
                    </div>
                  ))}
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} className="rounded" />
                  <span className="text-sm text-gray-700">Published</span>
                </label>
              </div>
              <div className="flex gap-3 mt-6 pt-4 border-t">
                <button onClick={handleSave} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-royal-blue text-white rounded-lg hover:bg-royal-blue-dark"><FiSave /> Save</button>
                <button onClick={() => { setEditing(null); setIsNew(false); }} className="px-4 py-2.5 border rounded-lg hover:bg-gray-50">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
