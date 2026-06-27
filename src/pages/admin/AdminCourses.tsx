import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiEye, FiEyeOff, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { useData } from '../../context/DataContext';
import type { Course } from '../../types';

const emptyCourse: Course = {
  id: '',
  name: '',
  description: '',
  coverImage: '',
  skillLevel: 'All Levels',
  duration: '',
  ageGroup: '',
  benefits: [],
  weeklySchedule: [],
  gallery: [],
  video: '',
  order: 0,
  published: true,
  createdAt: new Date().toISOString().split('T')[0],
  updatedAt: new Date().toISOString().split('T')[0],
};

export default function AdminCourses() {
  const { courses, setCourses } = useData();
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isNew, setIsNew] = useState(false);

  const sortedCourses = [...courses].sort((a, b) => a.order - b.order);

  const handleSave = () => {
    if (!editingCourse) return;
    if (isNew) {
      const newCourse = { ...editingCourse, id: Date.now().toString(), order: courses.length + 1 };
      setCourses([...courses, newCourse]);
    } else {
      setCourses(courses.map((c) => (c.id === editingCourse.id ? editingCourse : c)));
    }
    setEditingCourse(null);
    setIsNew(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this course?')) {
      setCourses(courses.filter((c) => c.id !== id));
    }
  };

  const togglePublish = (id: string) => {
    setCourses(courses.map((c) => (c.id === id ? { ...c, published: !c.published } : c)));
  };

  const moveOrder = (id: string, direction: 'up' | 'down') => {
    const sorted = [...courses].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((c) => c.id === id);
    if (direction === 'up' && idx > 0) {
      const temp = sorted[idx].order;
      sorted[idx].order = sorted[idx - 1].order;
      sorted[idx - 1].order = temp;
    } else if (direction === 'down' && idx < sorted.length - 1) {
      const temp = sorted[idx].order;
      sorted[idx].order = sorted[idx + 1].order;
      sorted[idx + 1].order = temp;
    }
    setCourses([...sorted]);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Courses</h1>
          <p className="text-gray-500">Manage academy courses</p>
        </div>
        <button
          onClick={() => { setEditingCourse({ ...emptyCourse }); setIsNew(true); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-saffron text-white rounded-lg hover:bg-saffron-dark transition-colors"
        >
          <FiPlus /> Add Course
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Order</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Course</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 hidden md:table-cell">Level</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 hidden md:table-cell">Duration</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {sortedCourses.map((course) => (
              <tr key={course.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => moveOrder(course.id, 'up')} className="text-gray-400 hover:text-gray-600"><FiArrowUp size={14} /></button>
                    <button onClick={() => moveOrder(course.id, 'down')} className="text-gray-400 hover:text-gray-600"><FiArrowDown size={14} /></button>
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-gray-800">{course.name}</td>
                <td className="px-4 py-3 text-gray-500 text-sm hidden md:table-cell">{course.skillLevel}</td>
                <td className="px-4 py-3 text-gray-500 text-sm hidden md:table-cell">{course.duration}</td>
                <td className="px-4 py-3">
                  <button onClick={() => togglePublish(course.id)} className={`px-2 py-0.5 rounded-full text-xs font-medium ${course.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {course.published ? 'Published' : 'Draft'}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => { setEditingCourse(course); setIsNew(false); }} className="p-1.5 text-royal-blue hover:bg-royal-blue/10 rounded-lg"><FiEdit2 size={16} /></button>
                    <button onClick={() => togglePublish(course.id)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg">{course.published ? <FiEyeOff size={16} /> : <FiEye size={16} />}</button>
                    <button onClick={() => handleDelete(course.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><FiTrash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {editingCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">{isNew ? 'Add Course' : 'Edit Course'}</h3>
                <button onClick={() => { setEditingCourse(null); setIsNew(false); }}><FiX size={20} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Name *</label>
                  <input type="text" value={editingCourse.name} onChange={(e) => setEditingCourse({ ...editingCourse, name: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-blue/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea rows={3} value={editingCourse.description} onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-blue/20 resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
                  <input type="text" value={editingCourse.coverImage} onChange={(e) => setEditingCourse({ ...editingCourse, coverImage: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-blue/20" placeholder="https://..." />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Skill Level</label>
                    <select value={editingCourse.skillLevel} onChange={(e) => setEditingCourse({ ...editingCourse, skillLevel: e.target.value })} className="w-full px-4 py-2 border rounded-lg bg-white">
                      <option>All Levels</option>
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                      <option>Beginner to Advanced</option>
                      <option>Beginner to Intermediate</option>
                      <option>Intermediate to Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                    <input type="text" value={editingCourse.duration} onChange={(e) => setEditingCourse({ ...editingCourse, duration: e.target.value })} className="w-full px-4 py-2 border rounded-lg" placeholder="e.g. 6 Months" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
                    <input type="text" value={editingCourse.ageGroup} onChange={(e) => setEditingCourse({ ...editingCourse, ageGroup: e.target.value })} className="w-full px-4 py-2 border rounded-lg" placeholder="e.g. 16+" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Benefits (one per line)</label>
                  <textarea rows={3} value={editingCourse.benefits.join('\n')} onChange={(e) => setEditingCourse({ ...editingCourse, benefits: e.target.value.split('\n').filter(Boolean) })} className="w-full px-4 py-2 border rounded-lg resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
                  <input type="text" value={editingCourse.video} onChange={(e) => setEditingCourse({ ...editingCourse, video: e.target.value })} className="w-full px-4 py-2 border rounded-lg" placeholder="YouTube or MP4 URL" />
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={editingCourse.published} onChange={(e) => setEditingCourse({ ...editingCourse, published: e.target.checked })} className="rounded" />
                    <span className="text-sm text-gray-700">Published</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 mt-6 pt-4 border-t">
                <button onClick={handleSave} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-royal-blue text-white rounded-lg hover:bg-royal-blue-dark transition-colors"><FiSave /> Save</button>
                <button onClick={() => { setEditingCourse(null); setIsNew(false); }} className="px-4 py-2.5 border rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
