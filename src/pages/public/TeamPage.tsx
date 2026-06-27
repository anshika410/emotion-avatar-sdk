import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiAward, FiCalendar, FiSearch } from 'react-icons/fi';
import { useData } from '../../context/DataContext';
import PlaceholderImage from '../../components/ui/PlaceholderImage';
import type { Trainer, Student } from '../../types';

function MedalBadge({ medal }: { medal: string }) {
  const emoji = medal === 'Gold' ? '🥇' : medal === 'Silver' ? '🥈' : '🥉';
  return <span title={medal}>{emoji}</span>;
}

function getMedalCount(student: Student, medal: 'Gold' | 'Silver' | 'Bronze') {
  return student.tournaments.filter((t) => t.medal === medal).length;
}

export default function TeamPage() {
  const { trainers, students } = useData();
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'trainers' | 'students'>('trainers');

  const publishedTrainers = trainers.filter((t) => t.published);
  const publishedStudents = students.filter((s) => s.published);

  const filteredTrainers = publishedTrainers.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredStudents = publishedStudents.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.martialArt.toLowerCase().includes(searchQuery.toLowerCase())
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
            Students & Team
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/70 text-lg max-w-2xl mx-auto"
          >
            Meet our exceptional trainers and champion students
          </motion.p>
        </div>
      </section>

      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('trainers')}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'trainers'
                    ? 'bg-royal-blue text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                Trainers ({publishedTrainers.length})
              </button>
              <button
                onClick={() => setActiveTab('students')}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'students'
                    ? 'bg-royal-blue text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                Students ({publishedStudents.length})
              </button>
            </div>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-blue/20 w-64"
              />
            </div>
          </div>

          {activeTab === 'trainers' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrainers.map((trainer, index) => (
                <motion.div
                  key={trainer.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => setSelectedTrainer(trainer)}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1"
                >
                  {trainer.photo ? (
                    <img
                      src={trainer.photo}
                      alt={trainer.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <PlaceholderImage
                      text={trainer.name}
                      className="w-full h-64"
                      icon="🥋"
                    />
                  )}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-royal-blue-dark">{trainer.name}</h3>
                    <p className="text-saffron text-sm font-medium">{trainer.designation}</p>
                    <p className="text-gray-500 text-sm mt-1">{trainer.experience} experience</p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {trainer.expertise.slice(0, 3).map((exp) => (
                        <span
                          key={exp}
                          className="px-2 py-0.5 bg-royal-blue/10 text-royal-blue rounded-full text-xs"
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'students' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredStudents.map((student, index) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => setSelectedStudent(student)}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1"
                >
                  {student.photo ? (
                    <img
                      src={student.photo}
                      alt={student.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <PlaceholderImage
                      text={student.name}
                      className="w-full h-48"
                      icon="🥋"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-royal-blue-dark">{student.name}</h3>
                    <p className="text-sm text-gray-500">{student.martialArt}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="px-2 py-0.5 bg-saffron/10 text-saffron rounded-full text-xs font-medium">
                        {student.beltRank}
                      </span>
                      <div className="flex gap-1 text-sm">
                        {getMedalCount(student, 'Gold') > 0 && (
                          <span>🥇{getMedalCount(student, 'Gold')}</span>
                        )}
                        {getMedalCount(student, 'Silver') > 0 && (
                          <span>🥈{getMedalCount(student, 'Silver')}</span>
                        )}
                        {getMedalCount(student, 'Bronze') > 0 && (
                          <span>🥉{getMedalCount(student, 'Bronze')}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedTrainer && (
          <TrainerModal trainer={selectedTrainer} onClose={() => setSelectedTrainer(null)} />
        )}
        {selectedStudent && (
          <StudentModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

function TrainerModal({ trainer, onClose }: { trainer: Trainer; onClose: () => void }) {
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
          {trainer.photo ? (
            <img src={trainer.photo} alt={trainer.name} className="w-full h-64 object-cover" />
          ) : (
            <PlaceholderImage text={trainer.name} className="w-full h-64" icon="🥋" />
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>
        <div className="p-8">
          <h2 className="text-2xl font-bold text-royal-blue-dark">{trainer.name}</h2>
          <p className="text-saffron font-semibold">{trainer.designation}</p>
          <p className="text-gray-500 text-sm mt-1">{trainer.qualification}</p>
          <p className="text-gray-500 text-sm">{trainer.experience} experience</p>

          <p className="text-gray-600 mt-4 leading-relaxed">{trainer.biography}</p>

          <div className="mt-6">
            <h4 className="font-semibold text-royal-blue mb-2">Expertise</h4>
            <div className="flex flex-wrap gap-2">
              {trainer.expertise.map((exp) => (
                <span key={exp} className="px-3 py-1 bg-royal-blue/10 text-royal-blue rounded-full text-sm">
                  {exp}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-semibold text-royal-blue mb-2">Certifications</h4>
            <ul className="space-y-1">
              {trainer.certifications.map((cert, i) => (
                <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                  <FiAward className="text-saffron mt-0.5 shrink-0" /> {cert}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <h4 className="font-semibold text-royal-blue mb-2">Achievements</h4>
            <ul className="space-y-1">
              {trainer.achievements.map((ach, i) => (
                <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-saffron">&#9670;</span> {ach}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function StudentModal({ student, onClose }: { student: Student; onClose: () => void }) {
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
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="relative">
          {student.photo ? (
            <img src={student.photo} alt={student.name} className="w-full h-64 object-cover" />
          ) : (
            <PlaceholderImage text={student.name} className="w-full h-64" icon="🥋" />
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>
        <div className="p-8">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="text-2xl font-bold text-royal-blue-dark">{student.name}</h2>
              <p className="text-saffron font-semibold">{student.martialArt} - {student.beltRank}</p>
              <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                <FiCalendar /> Joined: {student.joiningDate}
              </p>
              <p className="text-gray-500 text-sm">Coach: {student.coach}</p>
            </div>
            <div className="flex gap-3 text-lg">
              <span title="Gold">🥇 {getMedalCount(student, 'Gold')}</span>
              <span title="Silver">🥈 {getMedalCount(student, 'Silver')}</span>
              <span title="Bronze">🥉 {getMedalCount(student, 'Bronze')}</span>
            </div>
          </div>

          <p className="text-gray-600 leading-relaxed">{student.biography}</p>

          {student.beltProgression.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold text-royal-blue mb-3">Belt Progression</h4>
              <div className="flex flex-wrap gap-3">
                {student.beltProgression.map((bp, i) => (
                  <div key={i} className="flex items-center gap-2 bg-cream rounded-lg px-3 py-2">
                    <div className="w-4 h-4 rounded-full bg-saffron" />
                    <div>
                      <p className="text-sm font-medium">{bp.belt}</p>
                      <p className="text-xs text-gray-500">{bp.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {student.tournaments.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold text-royal-blue mb-3">Tournament Records</h4>
              <div className="space-y-3">
                {student.tournaments.map((t) => (
                  <div key={t.id} className="bg-cream rounded-lg p-4 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-medium text-royal-blue-dark">{t.tournamentName}</p>
                      <p className="text-sm text-gray-500">
                        {t.tournamentType} | {t.category} | {t.location}
                      </p>
                      <p className="text-xs text-gray-400">{t.date}</p>
                    </div>
                    <MedalBadge medal={t.medal} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {student.achievements.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold text-royal-blue mb-2">Achievements</h4>
              <ul className="space-y-1">
                {student.achievements.map((ach, i) => (
                  <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                    <FiAward className="text-saffron mt-0.5 shrink-0" /> {ach}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
