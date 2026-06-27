import { motion } from 'framer-motion';
import { FiPlay } from 'react-icons/fi';
import { useData } from '../../context/DataContext';
import PlaceholderImage from '../../components/ui/PlaceholderImage';

export default function FacilitiesPage() {
  const { facilities } = useData();
  const publishedFacilities = facilities.filter((f) => f.published).sort((a, b) => a.order - b.order);

  return (
    <>
      <section className="pt-28 pb-16 gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Our Facilities
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/70 text-lg max-w-2xl mx-auto"
          >
            World-class training environment built for champions
          </motion.p>
        </div>
      </section>

      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {publishedFacilities.map((facility, index) => (
              <motion.div
                key={facility.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`grid lg:grid-cols-2 gap-8 items-center ${
                  index % 2 === 1 ? 'lg:direction-rtl' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="relative overflow-hidden rounded-2xl shadow-lg group">
                    {facility.image ? (
                      <img
                        src={facility.image}
                        alt={facility.name}
                        className="w-full h-[350px] object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <PlaceholderImage
                        text={facility.name}
                        className="w-full h-[350px]"
                        icon="🏋️"
                      />
                    )}
                    {facility.video && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/50 transition-colors">
                          <FiPlay size={24} className="text-white ml-1" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-12 bg-gradient-to-b from-saffron to-india-green rounded-full" />
                    <h3 className="text-2xl md:text-3xl font-bold text-royal-blue-dark">
                      {facility.name}
                    </h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {facility.description}
                  </p>

                  {facility.gallery.length > 0 && (
                    <div className="mt-6 grid grid-cols-3 gap-2">
                      {facility.gallery.slice(0, 3).map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt={`${facility.name} gallery ${i + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                          loading="lazy"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
