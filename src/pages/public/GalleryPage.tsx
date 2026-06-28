import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiImage } from 'react-icons/fi';
import { useData } from '../../context/DataContext';
import PlaceholderImage from '../../components/ui/PlaceholderImage';
import type { GalleryItem } from '../../types';

function getYouTubeEmbedUrl(url: string): string {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
}

export default function GalleryPage() {
  const { gallery } = useData();
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [filter, setFilter] = useState('all');

  const published = gallery.filter((g) => g.published);
  const categories = ['all', ...new Set(published.map((g) => g.category))];
  const filtered =
    filter === 'all' ? published : published.filter((g) => g.category === filter);

  return (
    <>
      <section className="pt-28 pb-16 gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Gallery
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/70 text-lg max-w-2xl mx-auto"
          >
            Moments of excellence captured from our academy
          </motion.p>
        </div>
      </section>

      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2 rounded-lg font-medium capitalize transition-colors ${
                  filter === cat
                    ? 'bg-royal-blue text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() => setSelectedItem(item)}
                className="relative group overflow-hidden rounded-xl aspect-square cursor-pointer"
              >
                {item.url ? (
                  item.type === 'image' ? (
                    <img
                      src={item.url}
                      alt={item.caption}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center">
                      <span className="text-3xl mb-1">🎬</span>
                      <span className="text-sm text-gray-500">{item.caption}</span>
                    </div>
                  )
                ) : (
                  <PlaceholderImage
                    text={item.caption}
                    className="w-full h-full"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-4">
                    <p className="text-white text-sm font-medium">{item.caption}</p>
                    <p className="text-white/60 text-xs">{item.category}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <FiImage size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No gallery items found</p>
              <p className="text-gray-400 text-sm mt-1">
                Gallery images can be added from the admin dashboard
              </p>
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full"
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute -top-12 right-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <FiX size={20} />
              </button>
              {selectedItem.url ? (
                selectedItem.type === 'image' ? (
                  <img
                    src={selectedItem.url}
                    alt={selectedItem.caption}
                    className="w-full max-h-[80vh] object-contain rounded-xl"
                  />
                ) : selectedItem.type === 'youtube' ||
                  selectedItem.url.includes('youtube.com') ||
                  selectedItem.url.includes('youtu.be') ? (
                  <iframe
                    src={getYouTubeEmbedUrl(selectedItem.url)}
                    title={selectedItem.caption}
                    className="w-full aspect-video rounded-xl"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video controls className="w-full max-h-[80vh] rounded-xl">
                    <source src={selectedItem.url} type="video/mp4" />
                  </video>
                )
              ) : (
                <PlaceholderImage
                  text={selectedItem.caption}
                  className="w-full h-96 rounded-xl"
                />
              )}
              <p className="text-white text-center mt-4 font-medium">
                {selectedItem.caption}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
