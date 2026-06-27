import { motion } from 'framer-motion';
import { FiAward, FiStar } from 'react-icons/fi';
import { useData } from '../../context/DataContext';
import SectionTitle from '../ui/SectionTitle';
import PlaceholderImage from '../ui/PlaceholderImage';

export default function SenseiSection() {
  const { homeContent } = useData();
  const { sensei } = homeContent;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Meet Our Sensei"
          subtitle="The guiding force behind every champion"
        />

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {sensei.photo ? (
              <img
                src={sensei.photo}
                alt={sensei.name}
                className="w-full h-[500px] object-cover rounded-2xl shadow-2xl"
              />
            ) : (
              <PlaceholderImage
                text={sensei.name}
                className="w-full h-[500px] rounded-2xl shadow-2xl"
                icon="🥋"
              />
            )}
            <div className="absolute -bottom-6 -right-6 bg-saffron text-white px-6 py-3 rounded-xl shadow-lg">
              <span className="text-2xl font-bold">{sensei.yearsOfExperience}+</span>
              <span className="text-sm block">Years Experience</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-3xl font-bold text-royal-blue-dark mb-2">{sensei.name}</h3>
            <p className="text-saffron font-semibold mb-6">{sensei.title}</p>

            <p className="text-gray-600 leading-relaxed mb-6">{sensei.biography}</p>

            {sensei.philosophy && (
              <blockquote className="border-l-4 border-saffron pl-4 italic text-gray-500 mb-6">
                &ldquo;{sensei.philosophy}&rdquo;
              </blockquote>
            )}

            {sensei.journey && (
              <div className="mb-6">
                <h4 className="font-semibold text-royal-blue mb-2 flex items-center gap-2">
                  <FiStar className="text-saffron" /> Martial Arts Journey
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">{sensei.journey}</p>
              </div>
            )}

            <div>
              <h4 className="font-semibold text-royal-blue mb-3 flex items-center gap-2">
                <FiAward className="text-saffron" /> Key Achievements
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sensei.achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <span className="text-saffron mt-1">&#9670;</span>
                    {achievement}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
