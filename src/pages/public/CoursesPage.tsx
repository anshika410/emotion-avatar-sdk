import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiUsers, FiBarChart, FiCalendar, FiCheck } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import PlaceholderImage from '../../components/ui/PlaceholderImage';

export default function CoursesPage() {
  const { courses } = useData();
  const publishedCourses = courses.filter((c) => c.published).sort((a, b) => a.order - b.order);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  return (
    <>
      <section className="pt-28 pb-16 gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Our Courses
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/70 text-lg max-w-2xl mx-auto"
          >
            Master the art of combat with our world-class training programs
          </motion.p>
        </div>
      </section>

      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {publishedCourses.map((course, index) => (
              <motion.div
                key={course.id}
                id={course.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="grid md:grid-cols-3 gap-0">
                  <div className="md:col-span-1">
                    {course.coverImage ? (
                      <img
                        src={course.coverImage}
                        alt={course.name}
                        className="w-full h-full min-h-[250px] object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <PlaceholderImage
                        text={course.name}
                        className="w-full h-full min-h-[250px]"
                      />
                    )}
                  </div>
                  <div className="md:col-span-2 p-6 md:p-8">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-royal-blue-dark">{course.name}</h3>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <FiBarChart className="text-saffron" /> {course.skillLevel}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiClock className="text-saffron" /> {course.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiUsers className="text-saffron" /> Age: {course.ageGroup}
                          </span>
                        </div>
                      </div>
                      <Link
                        to="/contact"
                        className="px-5 py-2 bg-saffron text-white rounded-lg hover:bg-saffron-dark transition-colors font-medium text-sm"
                      >
                        Join Now
                      </Link>
                    </div>

                    <p className="text-gray-600 mb-4">{course.description}</p>

                    <button
                      onClick={() =>
                        setExpandedCourse(expandedCourse === course.id ? null : course.id)
                      }
                      className="text-royal-blue font-medium text-sm hover:text-saffron transition-colors"
                    >
                      {expandedCourse === course.id ? 'Show Less' : 'View Details'}
                    </button>

                    <AnimatePresence>
                      {expandedCourse === course.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4 mt-4 border-t grid md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-semibold text-royal-blue mb-2">Benefits</h4>
                              <ul className="space-y-1">
                                {course.benefits.map((benefit, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                    <FiCheck className="text-india-green mt-0.5 shrink-0" />
                                    {benefit}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold text-royal-blue mb-2 flex items-center gap-2">
                                <FiCalendar /> Weekly Schedule
                              </h4>
                              <div className="space-y-2">
                                {course.weeklySchedule.map((schedule, i) => (
                                  <div
                                    key={i}
                                    className="flex items-center gap-3 text-sm bg-cream rounded-lg p-2"
                                  >
                                    <span className="font-medium text-royal-blue-dark w-24">
                                      {schedule.day}
                                    </span>
                                    <span className="text-gray-500">{schedule.time}</span>
                                    <span className="text-saffron font-medium ml-auto">
                                      {schedule.session}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
