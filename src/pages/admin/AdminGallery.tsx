import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiSave, FiX, FiEye, FiEyeOff, FiImage } from 'react-icons/fi';
import { useData } from '../../context/DataContext';
import type { GalleryItem } from '../../types';

const emptyItem: GalleryItem = {
  id: '', url: '', type: 'image', caption: '', category: 'General',
  order: 0, published: true, createdAt: new Date().toISOString().split('T')[0],
};

export default function AdminGallery() {
  const { gallery, setGallery } = useData();
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [isNew, setIsNew] = useState(false);

  const handleSave = () => {
    if (!editing) return;
    if (isNew) {
      setGallery([...gallery, { ...editing, id: Date.now().toString(), order: gallery.length + 1 }]);
    } else {
      setGallery(gallery.map((g) => (g.id === editing.id ? editing : g)));
    }
    setEditing(null); setIsNew(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this item?')) setGallery(gallery.filter((g) => g.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gallery</h1>
          <p className="text-gray-500">Manage photos and videos</p>
        </div>
        <button onClick={() => { setEditing({ ...emptyItem }); setIsNew(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-saffron text-white rounded-lg hover:bg-saffron-dark transition-colors">
          <FiPlus /> Add Media
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {gallery.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden group">
            <div className="aspect-square relative">
              {item.url ? (
                item.type === 'image' ? (
                  <img src={item.url} alt={item.caption} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-2xl">🎬</span>
                  </div>
                )
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-royal-blue/5 to-saffron/5 flex items-center justify-center">
                  <FiImage size={32} className="text-gray-300" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button onClick={() => { setEditing(item); setIsNew(false); }} className="p-2 bg-white rounded-full"><FiImage size={16} /></button>
                <button onClick={() => setGallery(gallery.map((g) => g.id === item.id ? { ...g, published: !g.published } : g))} className="p-2 bg-white rounded-full">{item.published ? <FiEyeOff size={16} /> : <FiEye size={16} />}</button>
                <button onClick={() => handleDelete(item.id)} className="p-2 bg-white rounded-full text-red-500"><FiTrash2 size={16} /></button>
              </div>
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-gray-700 truncate">{item.caption || 'Untitled'}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-400">{item.type} | {item.category}</span>
                <span className={`w-2 h-2 rounded-full ${item.published ? 'bg-green-400' : 'bg-gray-300'}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">{isNew ? 'Add Media' : 'Edit Media'}</h3>
                <button onClick={() => { setEditing(null); setIsNew(false); }}><FiX size={20} /></button>
              </div>
              <div className="space-y-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">URL *</label><input type="text" value={editing.url} onChange={(e) => setEditing({ ...editing, url: e.target.value })} className="w-full px-4 py-2 border rounded-lg" placeholder="Image/Video/YouTube URL" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select value={editing.type} onChange={(e) => setEditing({ ...editing, type: e.target.value as GalleryItem['type'] })} className="w-full px-4 py-2 border rounded-lg bg-white">
                    <option value="image">Image</option><option value="video">Video</option><option value="youtube">YouTube</option>
                  </select>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Caption</label><input type="text" value={editing.caption} onChange={(e) => setEditing({ ...editing, caption: e.target.value })} className="w-full px-4 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label><input type="text" value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="w-full px-4 py-2 border rounded-lg" placeholder="e.g. Training, Events, Competitions" /></div>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} className="rounded" /><span className="text-sm text-gray-700">Published</span></label>
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
