import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiEye, FiEyeOff, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { useData } from '../../context/DataContext';
import type { Facility } from '../../types';

const emptyFacility: Facility = {
  id: '', name: '', description: '', image: '', gallery: [], video: '', order: 0, published: true,
};

export default function AdminFacilities() {
  const { facilities, setFacilities } = useData();
  const [editing, setEditing] = useState<Facility | null>(null);
  const [isNew, setIsNew] = useState(false);

  const sorted = [...facilities].sort((a, b) => a.order - b.order);

  const handleSave = () => {
    if (!editing) return;
    if (isNew) {
      setFacilities([...facilities, { ...editing, id: Date.now().toString(), order: facilities.length + 1 }]);
    } else {
      setFacilities(facilities.map((f) => (f.id === editing.id ? editing : f)));
    }
    setEditing(null);
    setIsNew(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this facility?')) setFacilities(facilities.filter((f) => f.id !== id));
  };

  const togglePublish = (id: string) => {
    setFacilities(facilities.map((f) => (f.id === id ? { ...f, published: !f.published } : f)));
  };

  const moveOrder = (id: string, dir: 'up' | 'down') => {
    const s = [...facilities].sort((a, b) => a.order - b.order);
    const idx = s.findIndex((f) => f.id === id);
    if (dir === 'up' && idx > 0) { const t = s[idx].order; s[idx].order = s[idx - 1].order; s[idx - 1].order = t; }
    else if (dir === 'down' && idx < s.length - 1) { const t = s[idx].order; s[idx].order = s[idx + 1].order; s[idx + 1].order = t; }
    setFacilities([...s]);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Facilities</h1>
          <p className="text-gray-500">Manage academy facilities</p>
        </div>
        <button onClick={() => { setEditing({ ...emptyFacility }); setIsNew(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-saffron text-white rounded-lg hover:bg-saffron-dark transition-colors">
          <FiPlus /> Add Facility
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map((facility) => (
          <div key={facility.id} className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-bold text-gray-800">{facility.name}</h3>
              <div className="flex gap-1">
                <button onClick={() => moveOrder(facility.id, 'up')} className="text-gray-400 hover:text-gray-600"><FiArrowUp size={14} /></button>
                <button onClick={() => moveOrder(facility.id, 'down')} className="text-gray-400 hover:text-gray-600"><FiArrowDown size={14} /></button>
              </div>
            </div>
            <p className="text-gray-500 text-sm line-clamp-2 mb-3">{facility.description}</p>
            <div className="flex items-center justify-between">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${facility.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {facility.published ? 'Published' : 'Draft'}
              </span>
              <div className="flex gap-1">
                <button onClick={() => { setEditing(facility); setIsNew(false); }} className="p-1.5 text-royal-blue hover:bg-royal-blue/10 rounded-lg"><FiEdit2 size={16} /></button>
                <button onClick={() => togglePublish(facility.id)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg">{facility.published ? <FiEyeOff size={16} /> : <FiEye size={16} />}</button>
                <button onClick={() => handleDelete(facility.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><FiTrash2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">{isNew ? 'Add Facility' : 'Edit Facility'}</h3>
                <button onClick={() => { setEditing(null); setIsNew(false); }}><FiX size={20} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input type="text" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-blue/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea rows={4} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="w-full px-4 py-2 border rounded-lg resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input type="text" value={editing.image} onChange={(e) => setEditing({ ...editing, image: e.target.value })} className="w-full px-4 py-2 border rounded-lg" placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
                  <input type="text" value={editing.video} onChange={(e) => setEditing({ ...editing, video: e.target.value })} className="w-full px-4 py-2 border rounded-lg" placeholder="YouTube or MP4 URL" />
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
