import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiEye, FiEyeOff } from 'react-icons/fi';
import { useData } from '../../context/DataContext';
import type { Trainer } from '../../types';

const emptyTrainer: Trainer = {
  id: '', name: '', designation: '', photo: '', qualification: '',
  expertise: [], certifications: [], experience: '', achievements: [],
  biography: '', socialLinks: {}, published: true,
};

export default function AdminTrainers() {
  const { trainers, setTrainers } = useData();
  const [editing, setEditing] = useState<Trainer | null>(null);
  const [isNew, setIsNew] = useState(false);

  const handleSave = () => {
    if (!editing) return;
    if (isNew) {
      setTrainers([...trainers, { ...editing, id: Date.now().toString() }]);
    } else {
      setTrainers(trainers.map((t) => (t.id === editing.id ? editing : t)));
    }
    setEditing(null); setIsNew(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this trainer?')) setTrainers(trainers.filter((t) => t.id !== id));
  };

  const togglePublish = (id: string) => {
    setTrainers(trainers.map((t) => (t.id === id ? { ...t, published: !t.published } : t)));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Trainers</h1>
          <p className="text-gray-500">Manage academy trainers</p>
        </div>
        <button onClick={() => { setEditing({ ...emptyTrainer }); setIsNew(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-saffron text-white rounded-lg hover:bg-saffron-dark transition-colors">
          <FiPlus /> Add Trainer
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trainers.map((trainer) => (
          <div key={trainer.id} className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-bold text-gray-800">{trainer.name}</h3>
            <p className="text-saffron text-sm font-medium">{trainer.designation}</p>
            <p className="text-gray-500 text-sm mt-1">{trainer.experience} experience</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {trainer.expertise.slice(0, 3).map((e) => (
                <span key={e} className="px-2 py-0.5 bg-royal-blue/10 text-royal-blue rounded-full text-xs">{e}</span>
              ))}
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${trainer.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {trainer.published ? 'Published' : 'Draft'}
              </span>
              <div className="flex gap-1">
                <button onClick={() => { setEditing(trainer); setIsNew(false); }} className="p-1.5 text-royal-blue hover:bg-royal-blue/10 rounded-lg"><FiEdit2 size={16} /></button>
                <button onClick={() => togglePublish(trainer.id)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg">{trainer.published ? <FiEyeOff size={16} /> : <FiEye size={16} />}</button>
                <button onClick={() => handleDelete(trainer.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><FiTrash2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">{isNew ? 'Add Trainer' : 'Edit Trainer'}</h3>
                <button onClick={() => { setEditing(null); setIsNew(false); }}><FiX size={20} /></button>
              </div>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input type="text" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                    <input type="text" value={editing.designation} onChange={(e) => setEditing({ ...editing, designation: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Photo URL</label>
                  <input type="text" value={editing.photo} onChange={(e) => setEditing({ ...editing, photo: e.target.value })} className="w-full px-4 py-2 border rounded-lg" placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                  <input type="text" value={editing.qualification} onChange={(e) => setEditing({ ...editing, qualification: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                  <input type="text" value={editing.experience} onChange={(e) => setEditing({ ...editing, experience: e.target.value })} className="w-full px-4 py-2 border rounded-lg" placeholder="e.g. 12 Years" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Biography</label>
                  <textarea rows={3} value={editing.biography} onChange={(e) => setEditing({ ...editing, biography: e.target.value })} className="w-full px-4 py-2 border rounded-lg resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expertise (one per line)</label>
                  <textarea rows={3} value={editing.expertise.join('\n')} onChange={(e) => setEditing({ ...editing, expertise: e.target.value.split('\n').filter(Boolean) })} className="w-full px-4 py-2 border rounded-lg resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Certifications (one per line)</label>
                  <textarea rows={3} value={editing.certifications.join('\n')} onChange={(e) => setEditing({ ...editing, certifications: e.target.value.split('\n').filter(Boolean) })} className="w-full px-4 py-2 border rounded-lg resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Achievements (one per line)</label>
                  <textarea rows={3} value={editing.achievements.join('\n')} onChange={(e) => setEditing({ ...editing, achievements: e.target.value.split('\n').filter(Boolean) })} className="w-full px-4 py-2 border rounded-lg resize-none" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                    <input type="text" value={editing.socialLinks.instagram || ''} onChange={(e) => setEditing({ ...editing, socialLinks: { ...editing.socialLinks, instagram: e.target.value } })} className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                    <input type="text" value={editing.socialLinks.facebook || ''} onChange={(e) => setEditing({ ...editing, socialLinks: { ...editing.socialLinks, facebook: e.target.value } })} className="w-full px-4 py-2 border rounded-lg" />
                  </div>
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
