import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiImage } from 'react-icons/fi';
import SectionTitle from '../ui/SectionTitle';
import { useData } from '../../context/DataContext';

export default function GalleryPreview() {
  const { gallery } = useData();
  const recentItems = gallery.filter((g) => g.published).slice(0, 6);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Gallery"
          subtitle="Moments of excellence captured from our academy"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {recentItems.length > 0 ? (
            recentItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group overflow-hidden rounded-xl aspect-square"
              >
                {item.url ? (
                  <img
                    src={item.url}
                    alt={item.caption}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-royal-blue/10 to-saffron/10 flex flex-col items-center justify-center">
                    <FiImage size={32} className="text-gray-400 mb-2" />
                    <span className="text-sm text-gray-400">{item.caption}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <p className="text-white text-sm p-4 font-medium">{item.caption}</p>
                </div>
              </motion.div>
            ))
          ) : (
            Array.from({ length: 6 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative overflow-hidden rounded-xl aspect-square bg-gradient-to-br from-royal-blue/5 to-saffron/5 flex items-center justify-center"
              >
                <div className="text-center">
                  <FiImage size={32} className="text-gray-300 mx-auto mb-2" />
                  <span className="text-sm text-gray-400">Gallery Image</span>
                </div>
              </motion.div>
            ))
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 px-6 py-3 bg-royal-blue text-white rounded-lg hover:bg-royal-blue-dark transition-colors font-medium"
          >
            View Full Gallery <FiArrowRight />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
