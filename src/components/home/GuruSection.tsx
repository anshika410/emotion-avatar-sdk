import { motion } from 'framer-motion';
import { FiHeart, FiEye } from 'react-icons/fi';
import { useData } from '../../context/DataContext';
import SectionTitle from '../ui/SectionTitle';
import PlaceholderImage from '../ui/PlaceholderImage';

export default function GuruSection() {
  const { homeContent } = useData();
  const { guru } = homeContent;

  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Our Guiding Light"
          subtitle="The visionary behind the academy's mission"
        />

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-2 lg:order-1"
          >
            <h3 className="text-3xl font-bold text-royal-blue-dark mb-2">{guru.name}</h3>
            <p className="text-saffron font-semibold mb-6">{guru.title}</p>

            <p className="text-gray-600 leading-relaxed mb-6">{guru.biography}</p>

            {guru.contribution && (
              <div className="mb-6">
                <h4 className="font-semibold text-royal-blue mb-2 flex items-center gap-2">
                  <FiHeart className="text-saffron" /> Contribution
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">{guru.contribution}</p>
              </div>
            )}

            {guru.vision && (
              <div className="mb-6">
                <h4 className="font-semibold text-royal-blue mb-2 flex items-center gap-2">
                  <FiEye className="text-saffron" /> Vision
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">{guru.vision}</p>
              </div>
            )}

            {guru.inspirationalMessage && (
              <blockquote className="border-l-4 border-india-green pl-4 italic text-gray-500 mb-6 bg-white/50 p-4 rounded-r-lg">
                &ldquo;{guru.inspirationalMessage}&rdquo;
              </blockquote>
            )}

            <div>
              <h4 className="font-semibold text-royal-blue mb-3">Achievements</h4>
              <div className="space-y-2">
                {guru.achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <span className="text-india-green mt-1">&#9670;</span>
                    {achievement}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2 relative"
          >
            {guru.photo ? (
              <img
                src={guru.photo}
                alt={guru.name}
                className="w-full h-[500px] object-cover rounded-2xl shadow-2xl"
              />
            ) : (
              <PlaceholderImage
                text={guru.name}
                className="w-full h-[500px] rounded-2xl shadow-2xl"
                icon="🙏"
              />
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
