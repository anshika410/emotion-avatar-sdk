import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiEye, FiEyeOff, FiSearch } from 'react-icons/fi';
import { useData } from '../../context/DataContext';
import type { Blog } from '../../types';

const emptyBlog: Blog = {
  id: '', title: '', coverImage: '', gallery: [], videos: [],
  date: new Date().toISOString().split('T')[0], description: '',
  content: '', tags: [], author: 'Academy Admin', published: true,
  isEvent: false, createdAt: new Date().toISOString().split('T')[0],
};

export default function AdminBlogs() {
  const { blogs, setBlogs } = useData();
  const [editing, setEditing] = useState<Blog | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = blogs.filter((b) => b.title.toLowerCase().includes(search.toLowerCase()));

  const handleSave = () => {
    if (!editing) return;
    if (isNew) {
      setBlogs([...blogs, { ...editing, id: Date.now().toString() }]);
    } else {
      setBlogs(blogs.map((b) => (b.id === editing.id ? editing : b)));
    }
    setEditing(null); setIsNew(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this blog?')) setBlogs(blogs.filter((b) => b.id !== id));
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Blogs & Events</h1>
          <p className="text-gray-500">Manage blog posts and event announcements</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 pr-4 py-2 border rounded-lg w-48" />
          </div>
          <button onClick={() => { setEditing({ ...emptyBlog }); setIsNew(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-saffron text-white rounded-lg hover:bg-saffron-dark transition-colors">
            <FiPlus /> New Post
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((blog) => (
          <div key={blog.id} className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-start justify-between mb-2">
              <div className="flex gap-2">
                {blog.isEvent && <span className="px-2 py-0.5 bg-india-green/10 text-india-green rounded-full text-xs">Event</span>}
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${blog.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{blog.published ? 'Published' : 'Draft'}</span>
              </div>
              <span className="text-xs text-gray-400">{blog.date}</span>
            </div>
            <h3 className="font-bold text-gray-800 line-clamp-2 mb-2">{blog.title}</h3>
            <p className="text-gray-500 text-sm line-clamp-2 mb-3">{blog.description}</p>
            <div className="flex flex-wrap gap-1 mb-3">
              {blog.tags.slice(0, 3).map((tag) => (<span key={tag} className="px-2 py-0.5 bg-royal-blue/5 text-royal-blue rounded-full text-xs">{tag}</span>))}
            </div>
            <div className="flex items-center justify-end gap-1">
              <button onClick={() => { setEditing(blog); setIsNew(false); }} className="p-1.5 text-royal-blue hover:bg-royal-blue/10 rounded-lg"><FiEdit2 size={16} /></button>
              <button onClick={() => setBlogs(blogs.map((b) => b.id === blog.id ? { ...b, published: !b.published } : b))} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg">{blog.published ? <FiEyeOff size={16} /> : <FiEye size={16} />}</button>
              <button onClick={() => handleDelete(blog.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><FiTrash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">{isNew ? 'Create Post' : 'Edit Post'}</h3>
                <button onClick={() => { setEditing(null); setIsNew(false); }}><FiX size={20} /></button>
              </div>
              <div className="space-y-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Title *</label><input type="text" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full px-4 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label><input type="text" value={editing.coverImage} onChange={(e) => setEditing({ ...editing, coverImage: e.target.value })} className="w-full px-4 py-2 border rounded-lg" placeholder="https://..." /></div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Date</label><input type="date" value={editing.date} onChange={(e) => setEditing({ ...editing, date: e.target.value })} className="w-full px-4 py-2 border rounded-lg" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Author</label><input type="text" value={editing.author} onChange={(e) => setEditing({ ...editing, author: e.target.value })} className="w-full px-4 py-2 border rounded-lg" /></div>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label><textarea rows={2} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="w-full px-4 py-2 border rounded-lg resize-none" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Content</label><textarea rows={6} value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} className="w-full px-4 py-2 border rounded-lg resize-none" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label><input type="text" value={editing.tags.join(', ')} onChange={(e) => setEditing({ ...editing, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })} className="w-full px-4 py-2 border rounded-lg" /></div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={editing.isEvent} onChange={(e) => setEditing({ ...editing, isEvent: e.target.checked })} className="rounded" /><span className="text-sm text-gray-700">Event Announcement</span></label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} className="rounded" /><span className="text-sm text-gray-700">Published</span></label>
                </div>
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
