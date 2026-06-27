import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { useData } from '../../context/DataContext';

export default function Footer() {
  const { siteSettings } = useData();
  const { contactInfo, socialLinks } = siteSettings;

  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-saffron rounded-full flex items-center justify-center font-bold text-sm text-white">
                PP
              </div>
              <h3 className="font-bold text-lg">{siteSettings.academyName}</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {siteSettings.tagline}
            </p>
            <div className="flex gap-3 mt-6">
              {socialLinks.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-saffron transition-colors"
                  aria-label="Facebook"
                >
                  <FiFacebook size={18} />
                </a>
              )}
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-saffron transition-colors"
                  aria-label="Instagram"
                >
                  <FiInstagram size={18} />
                </a>
              )}
              {socialLinks.youtube && (
                <a
                  href={socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-saffron transition-colors"
                  aria-label="YouTube"
                >
                  <FiYoutube size={18} />
                </a>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-saffron">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { path: '/', label: 'Home' },
                { path: '/courses', label: 'Courses' },
                { path: '/facilities', label: 'Facilities' },
                { path: '/team', label: 'Students & Team' },
                { path: '/blog', label: 'Blogs & Events' },
                { path: '/contact', label: 'Join Us' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-saffron">Our Courses</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>MMA</li>
              <li>Boxing</li>
              <li>Kick-Boxing</li>
              <li>Brazilian Jiu-Jitsu</li>
              <li>Judo</li>
              <li>Wushu</li>
              <li>Karate</li>
              <li>Weapons Training</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-saffron">Contact Us</h4>
            <div className="space-y-4 text-sm text-gray-400">
              <div className="flex items-start gap-3">
                <FiPhone className="mt-0.5 text-saffron shrink-0" />
                <span>{contactInfo.phone}</span>
              </div>
              <div className="flex items-start gap-3">
                <FiMail className="mt-0.5 text-saffron shrink-0" />
                <span>{contactInfo.email}</span>
              </div>
              <div className="flex items-start gap-3">
                <FiMapPin className="mt-0.5 text-saffron shrink-0" />
                <span>{contactInfo.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} {siteSettings.academyName}. All rights reserved.
            </p>
            <p className="text-sm text-gray-500">
              Discipline &bull; Strength &bull; Honor
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
