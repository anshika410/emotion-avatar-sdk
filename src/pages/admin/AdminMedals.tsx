import { motion } from 'framer-motion';
import { useData } from '../../context/DataContext';

export default function AdminMedals() {
  const { students } = useData();

  const allTournaments = students.flatMap((s) =>
    s.tournaments.map((t) => ({ ...t, studentName: s.name }))
  );

  const goldCount = allTournaments.filter((t) => t.medal === 'Gold').length;
  const silverCount = allTournaments.filter((t) => t.medal === 'Silver').length;
  const bronzeCount = allTournaments.filter((t) => t.medal === 'Bronze').length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Medal Records</h1>
        <p className="text-gray-500">View all tournament medals across students</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-5 shadow-sm text-center">
          <span className="text-3xl">🥇</span>
          <p className="text-2xl font-bold text-gray-800 mt-2">{goldCount}</p>
          <p className="text-sm text-gray-500">Gold Medals</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl p-5 shadow-sm text-center">
          <span className="text-3xl">🥈</span>
          <p className="text-2xl font-bold text-gray-800 mt-2">{silverCount}</p>
          <p className="text-sm text-gray-500">Silver Medals</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl p-5 shadow-sm text-center">
          <span className="text-3xl">🥉</span>
          <p className="text-2xl font-bold text-gray-800 mt-2">{bronzeCount}</p>
          <p className="text-sm text-gray-500">Bronze Medals</p>
        </motion.div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Student</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Tournament</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 hidden md:table-cell">Type</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 hidden md:table-cell">Category</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Medal</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 hidden md:table-cell">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {allTournaments.map((t, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{t.studentName}</td>
                <td className="px-4 py-3 text-gray-600 text-sm">{t.tournamentName}</td>
                <td className="px-4 py-3 text-gray-500 text-sm hidden md:table-cell">{t.tournamentType}</td>
                <td className="px-4 py-3 text-gray-500 text-sm hidden md:table-cell">{t.category}</td>
                <td className="px-4 py-3">
                  <span>{t.medal === 'Gold' ? '🥇' : t.medal === 'Silver' ? '🥈' : '🥉'} {t.medal}</span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-sm hidden md:table-cell">{t.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {allTournaments.length === 0 && (
          <div className="text-center py-8 text-gray-400">No tournament records yet</div>
        )}
      </div>
    </div>
  );
}
