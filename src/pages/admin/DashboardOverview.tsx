import { motion } from 'framer-motion';
import { FiUsers, FiUserCheck, FiBookOpen, FiEdit3, FiInbox, FiImage, FiVideo, FiAward } from 'react-icons/fi';
import { useData } from '../../context/DataContext';

export default function DashboardOverview() {
  const { students, trainers, courses, blogs, admissions, gallery } = useData();

  const stats = [
    { label: 'Total Students', value: students.length, icon: <FiUsers size={24} />, color: 'bg-royal-blue' },
    { label: 'Total Trainers', value: trainers.length, icon: <FiUserCheck size={24} />, color: 'bg-saffron' },
    { label: 'Total Courses', value: courses.length, icon: <FiBookOpen size={24} />, color: 'bg-india-green' },
    { label: 'Total Blogs', value: blogs.length, icon: <FiEdit3 size={24} />, color: 'bg-purple-500' },
    { label: 'Pending Admissions', value: admissions.filter((a) => a.status === 'pending').length, icon: <FiInbox size={24} />, color: 'bg-red-500' },
    { label: 'Photos', value: gallery.filter((g) => g.type === 'image').length, icon: <FiImage size={24} />, color: 'bg-blue-500' },
    { label: 'Videos', value: gallery.filter((g) => g.type === 'video' || g.type === 'youtube').length, icon: <FiVideo size={24} />, color: 'bg-pink-500' },
    { label: 'Total Medals', value: students.reduce((sum, s) => sum + s.tournaments.length, 0), icon: <FiAward size={24} />, color: 'bg-gold' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome to PPMA Admin Dashboard</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center text-white mb-3`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Recent Admissions</h3>
          <div className="space-y-3">
            {admissions.slice(0, 5).map((admission) => (
              <div key={admission.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{admission.name}</p>
                  <p className="text-sm text-gray-500">{admission.course}</p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    admission.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : admission.status === 'approved'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {admission.status}
                </span>
              </div>
            ))}
            {admissions.length === 0 && (
              <p className="text-gray-400 text-sm">No admission requests yet</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Top Students</h3>
          <div className="space-y-3">
            {[...students]
              .sort((a, b) => b.tournaments.length - a.tournaments.length)
              .slice(0, 5)
              .map((student) => (
                <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{student.name}</p>
                    <p className="text-sm text-gray-500">{student.martialArt} - {student.beltRank}</p>
                  </div>
                  <div className="flex gap-1 text-sm">
                    <span>🥇{student.tournaments.filter((t) => t.medal === 'Gold').length}</span>
                    <span>🥈{student.tournaments.filter((t) => t.medal === 'Silver').length}</span>
                    <span>🥉{student.tournaments.filter((t) => t.medal === 'Bronze').length}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
