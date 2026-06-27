import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiUser, FiTag, FiX, FiSearch } from 'react-icons/fi';
import { useData } from '../../context/DataContext';
import PlaceholderImage from '../../components/ui/PlaceholderImage';
import type { Blog } from '../../types';

export default function BlogPage() {
  const { blogs } = useData();
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [filter, setFilter] = useState<'all' | 'blogs' | 'events'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const publishedBlogs = blogs.filter((b) => b.published);
  const filtered = publishedBlogs
    .filter((b) => {
      if (filter === 'blogs') return !b.isEvent;
      if (filter === 'events') return b.isEvent;
      return true;
    })
    .filter(
      (b) =>
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  return (
    <>
      <section className="pt-28 pb-16 gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Blogs & Events
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/70 text-lg max-w-2xl mx-auto"
          >
            Stay updated with academy news, events, and martial arts insights
          </motion.p>
        </div>
      </section>

      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div className="flex gap-2">
              {(['all', 'blogs', 'events'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-5 py-2 rounded-lg font-medium capitalize transition-colors ${
                    filter === f
                      ? 'bg-royal-blue text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-blue/20 w-64"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setSelectedBlog(blog)}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1"
              >
                {blog.coverImage ? (
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <PlaceholderImage
                    text={blog.title}
                    className="w-full h-48"
                    icon={blog.isEvent ? '📅' : '📝'}
                  />
                )}
                <div className="p-5">
                  {blog.isEvent && (
                    <span className="px-2 py-0.5 bg-india-green/10 text-india-green rounded-full text-xs font-medium mb-2 inline-block">
                      Event
                    </span>
                  )}
                  <h3 className="font-bold text-royal-blue-dark mb-2 line-clamp-2 group-hover:text-saffron transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-3">{blog.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <FiCalendar /> {blog.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiUser /> {blog.author}
                    </span>
                  </div>
                  {blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {blog.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-royal-blue/5 text-royal-blue rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg">No posts found</p>
              <p className="text-sm mt-1">Try adjusting your search or filter</p>
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedBlog && (
          <BlogModal blog={selectedBlog} onClose={() => setSelectedBlog(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

function BlogModal({ blog, onClose }: { blog: Blog; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="relative">
          {blog.coverImage ? (
            <img src={blog.coverImage} alt={blog.title} className="w-full h-72 object-cover" />
          ) : (
            <PlaceholderImage
              text={blog.title}
              className="w-full h-72"
              icon={blog.isEvent ? '📅' : '📝'}
            />
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>
        <div className="p-8">
          {blog.isEvent && (
            <span className="px-3 py-1 bg-india-green/10 text-india-green rounded-full text-sm font-medium mb-3 inline-block">
              Event
            </span>
          )}
          <h2 className="text-2xl font-bold text-royal-blue-dark mb-3">{blog.title}</h2>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-1"><FiCalendar /> {blog.date}</span>
            <span className="flex items-center gap-1"><FiUser /> {blog.author}</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {blog.tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-royal-blue/5 text-royal-blue rounded-full text-sm">
                <FiTag size={12} /> {tag}
              </span>
            ))}
          </div>
          <div className="prose max-w-none text-gray-600 leading-relaxed">
            <p>{blog.description}</p>
            <p className="mt-4">{blog.content}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
