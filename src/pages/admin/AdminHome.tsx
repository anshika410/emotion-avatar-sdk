import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useData } from '../../context/DataContext';

export default function AdminHome() {
  const { homeContent, setHomeContent } = useData();
  const [content, setContent] = useState(homeContent);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setHomeContent(content);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateSensei = (field: string, value: string | number | string[]) => {
    setContent({ ...content, sensei: { ...content.sensei, [field]: value } });
  };

  const updateGuru = (field: string, value: string | string[]) => {
    setContent({ ...content, guru: { ...content.guru, [field]: value } });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Home Management</h1>
          <p className="text-gray-500">Edit homepage content</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 bg-royal-blue text-white rounded-lg hover:bg-royal-blue-dark transition-colors"
        >
          <FiSave /> {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Hero Section</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hero Slogan</label>
              <input
                type="text"
                value={content.heroSlogan}
                onChange={(e) => setContent({ ...content, heroSlogan: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-blue/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Background Image URL</label>
              <input
                type="text"
                value={content.heroBackgroundImage}
                onChange={(e) => setContent({ ...content, heroBackgroundImage: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-blue/20"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hero Video URL</label>
              <input
                type="text"
                value={content.heroVideo}
                onChange={(e) => setContent({ ...content, heroVideo: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-blue/20"
                placeholder="YouTube or MP4 URL"
              />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Sensei Introduction</h3>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" value={content.sensei.name} onChange={(e) => updateSensei('name', e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-blue/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" value={content.sensei.title} onChange={(e) => updateSensei('title', e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-blue/20" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Photo URL</label>
              <input type="text" value={content.sensei.photo} onChange={(e) => updateSensei('photo', e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-blue/20" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Biography</label>
              <textarea rows={4} value={content.sensei.biography} onChange={(e) => updateSensei('biography', e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-blue/20 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teaching Philosophy</label>
              <textarea rows={3} value={content.sensei.philosophy || ''} onChange={(e) => updateSensei('philosophy', e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-blue/20 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Martial Arts Journey</label>
              <textarea rows={3} value={content.sensei.journey || ''} onChange={(e) => updateSensei('journey', e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-blue/20 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
              <input type="number" value={content.sensei.yearsOfExperience || 0} onChange={(e) => updateSensei('yearsOfExperience', parseInt(e.target.value) || 0)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-blue/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Achievements (one per line)</label>
              <textarea rows={4} value={content.sensei.achievements.join('\n')} onChange={(e) => updateSensei('achievements', e.target.value.split('\n').filter(Boolean))} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-blue/20 resize-none" />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Guru Introduction</h3>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" value={content.guru.name} onChange={(e) => updateGuru('name', e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-2 focus:ring-royal-blue/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" value={content.guru.title} onChange={(e) => updateGuru('title', e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-blue/20" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Photo URL</label>
              <input type="text" value={content.guru.photo} onChange={(e) => updateGuru('photo', e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-blue/20" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Biography</label>
              <textarea rows={4} value={content.guru.biography} onChange={(e) => updateGuru('biography', e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-blue/20 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contribution</label>
              <textarea rows={3} value={content.guru.contribution || ''} onChange={(e) => updateGuru('contribution', e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-blue/20 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vision</label>
              <textarea rows={3} value={content.guru.vision || ''} onChange={(e) => updateGuru('vision', e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-blue/20 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Inspirational Message</label>
              <textarea rows={3} value={content.guru.inspirationalMessage || ''} onChange={(e) => updateGuru('inspirationalMessage', e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-blue/20 resize-none" />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Quick Highlights</h3>
          <div className="space-y-4">
            {content.highlights.map((stat, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => {
                      const updated = [...content.highlights];
                      updated[index] = { ...updated[index], label: e.target.value };
                      setContent({ ...content, highlights: updated });
                    }}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-blue/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                  <input
                    type="number"
                    value={stat.value}
                    onChange={(e) => {
                      const updated = [...content.highlights];
                      updated[index] = { ...updated[index], value: parseInt(e.target.value) || 0 };
                      setContent({ ...content, highlights: updated });
                    }}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-blue/20"
                  />
                </div>
                <button
                  onClick={() => {
                    const updated = content.highlights.filter((_, i) => i !== index);
                    setContent({ ...content, highlights: updated });
                  }}
                  className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                setContent({
                  ...content,
                  highlights: [...content.highlights, { label: '', value: 0, icon: 'award' }],
                });
              }}
              className="flex items-center gap-2 px-4 py-2 text-royal-blue border border-royal-blue/20 rounded-lg hover:bg-royal-blue/5 transition-colors text-sm"
            >
              <FiPlus /> Add Highlight
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
