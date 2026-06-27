import { useState } from 'react';
import { FiSave } from 'react-icons/fi';
import { useData } from '../../context/DataContext';

export default function AdminSettings() {
  const { siteSettings, setSiteSettings } = useData();
  const [settings, setSettings] = useState(siteSettings);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSiteSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-500">Manage site settings and contact information</p>
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 bg-royal-blue text-white rounded-lg hover:bg-royal-blue-dark transition-colors">
          <FiSave /> {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Academy Information</h3>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Academy Name</label><input type="text" value={settings.academyName} onChange={(e) => setSettings({ ...settings, academyName: e.target.value })} className="w-full px-4 py-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label><input type="text" value={settings.logo} onChange={(e) => setSettings({ ...settings, logo: e.target.value })} className="w-full px-4 py-2 border rounded-lg" placeholder="https://..." /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label><input type="text" value={settings.tagline} onChange={(e) => setSettings({ ...settings, tagline: e.target.value })} className="w-full px-4 py-2 border rounded-lg" /></div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Contact Information</h3>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input type="text" value={settings.contactInfo.phone} onChange={(e) => setSettings({ ...settings, contactInfo: { ...settings.contactInfo, phone: e.target.value } })} className="w-full px-4 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label><input type="text" value={settings.contactInfo.whatsapp} onChange={(e) => setSettings({ ...settings, contactInfo: { ...settings.contactInfo, whatsapp: e.target.value } })} className="w-full px-4 py-2 border rounded-lg" /></div>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="text" value={settings.contactInfo.email} onChange={(e) => setSettings({ ...settings, contactInfo: { ...settings.contactInfo, email: e.target.value } })} className="w-full px-4 py-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Opening Hours</label><input type="text" value={settings.contactInfo.openingHours} onChange={(e) => setSettings({ ...settings, contactInfo: { ...settings.contactInfo, openingHours: e.target.value } })} className="w-full px-4 py-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Address</label><textarea rows={2} value={settings.contactInfo.address} onChange={(e) => setSettings({ ...settings, contactInfo: { ...settings.contactInfo, address: e.target.value } })} className="w-full px-4 py-2 border rounded-lg resize-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Embed URL</label><input type="text" value={settings.contactInfo.mapEmbedUrl} onChange={(e) => setSettings({ ...settings, contactInfo: { ...settings.contactInfo, mapEmbedUrl: e.target.value } })} className="w-full px-4 py-2 border rounded-lg" /></div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Social Media Links</h3>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label><input type="text" value={settings.socialLinks.facebook || ''} onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, facebook: e.target.value } })} className="w-full px-4 py-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label><input type="text" value={settings.socialLinks.instagram || ''} onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, instagram: e.target.value } })} className="w-full px-4 py-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">YouTube</label><input type="text" value={settings.socialLinks.youtube || ''} onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, youtube: e.target.value } })} className="w-full px-4 py-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label><input type="text" value={settings.socialLinks.twitter || ''} onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, twitter: e.target.value } })} className="w-full px-4 py-2 border rounded-lg" /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
