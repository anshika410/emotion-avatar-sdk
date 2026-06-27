import { useData } from '../../context/DataContext';

export default function AdminMessages() {
  const { messages, setMessages } = useData();

  const toggleRead = (id: string) => {
    setMessages(messages.map((m) => (m.id === id ? { ...m, read: !m.read } : m)));
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this message?')) setMessages(messages.filter((m) => m.id !== id));
  };

  const unread = messages.filter((m) => !m.read);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
        <p className="text-gray-500">Contact form submissions ({unread.length} unread)</p>
      </div>

      <div className="space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`bg-white rounded-xl shadow-sm p-5 ${!msg.read ? 'border-l-4 border-royal-blue' : ''}`}
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-bold text-gray-800">{msg.name}</h4>
                  {!msg.read && <span className="px-2 py-0.5 bg-royal-blue/10 text-royal-blue rounded-full text-xs">New</span>}
                </div>
                <p className="text-sm text-gray-500">{msg.email}</p>
                <p className="text-sm font-medium text-gray-700 mt-2">{msg.subject}</p>
                <p className="text-sm text-gray-600 mt-1">{msg.message}</p>
                <p className="text-xs text-gray-400 mt-2">{msg.createdAt}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => toggleRead(msg.id)}
                  className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50"
                >
                  {msg.read ? 'Mark Unread' : 'Mark Read'}
                </button>
                <button
                  onClick={() => handleDelete(msg.id)}
                  className="px-3 py-1.5 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">
            No messages yet
          </div>
        )}
      </div>
    </div>
  );
}
