import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { GiBoxingGlove, GiNunchaku, GiHighKick, GiPunch, GiBlackBelt, GiSwordman } from 'react-icons/gi';
import SectionTitle from '../ui/SectionTitle';
import { useData } from '../../context/DataContext';

const courseIcons: Record<string, React.ReactNode> = {
  MMA: <GiPunch size={40} />,
  Boxing: <GiBoxingGlove size={40} />,
  'Kick-Boxing': <GiHighKick size={40} />,
  'Brazilian Jiu-Jitsu': <GiBlackBelt size={40} />,
  Judo: <GiBlackBelt size={40} />,
  Wushu: <GiSwordman size={40} />,
  Karate: <GiHighKick size={40} />,
  'Traditional Weapons Training': <GiNunchaku size={40} />,
};

export default function CoursesPreview() {
  const { courses } = useData();
  const publishedCourses = courses.filter((c) => c.published).slice(0, 8);

  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Our Courses"
          subtitle="World-class training programs for every martial artist"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {publishedCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                to={`/courses#${course.id}`}
                className="block bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-2"
              >
                <div className="text-royal-blue mb-4 flex justify-center group-hover:text-saffron transition-colors">
                  {courseIcons[course.name] || <GiPunch size={40} />}
                </div>
                <h3 className="font-bold text-royal-blue-dark group-hover:text-saffron transition-colors">
                  {course.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{course.skillLevel}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 bg-saffron text-white rounded-lg hover:bg-saffron-dark transition-colors font-medium"
          >
            View All Courses <FiArrowRight />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
