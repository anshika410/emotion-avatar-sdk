import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type {
  Course,
  Facility,
  Trainer,
  Student,
  Blog,
  HomeContent,
  GalleryItem,
  SiteSettings,
  AdmissionRequest,
  ContactMessage,
} from '../types';
import {
  sampleCourses,
  sampleFacilities,
  sampleTrainers,
  sampleStudents,
  sampleBlogs,
  sampleGallery,
  homeContent as defaultHomeContent,
  siteSettings as defaultSiteSettings,
  sampleAdmissions,
  sampleMessages,
} from '../data/sampleData';

interface DataContextType {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  facilities: Facility[];
  setFacilities: React.Dispatch<React.SetStateAction<Facility[]>>;
  trainers: Trainer[];
  setTrainers: React.Dispatch<React.SetStateAction<Trainer[]>>;
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  blogs: Blog[];
  setBlogs: React.Dispatch<React.SetStateAction<Blog[]>>;
  gallery: GalleryItem[];
  setGallery: React.Dispatch<React.SetStateAction<GalleryItem[]>>;
  homeContent: HomeContent;
  setHomeContent: React.Dispatch<React.SetStateAction<HomeContent>>;
  siteSettings: SiteSettings;
  setSiteSettings: React.Dispatch<React.SetStateAction<SiteSettings>>;
  admissions: AdmissionRequest[];
  setAdmissions: React.Dispatch<React.SetStateAction<AdmissionRequest[]>>;
  messages: ContactMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ContactMessage[]>>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored) as T;
  } catch {
    // ignore parse errors
  }
  return fallback;
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<Course[]>(() =>
    loadFromStorage('ppma_courses', sampleCourses)
  );
  const [facilities, setFacilities] = useState<Facility[]>(() =>
    loadFromStorage('ppma_facilities', sampleFacilities)
  );
  const [trainers, setTrainers] = useState<Trainer[]>(() =>
    loadFromStorage('ppma_trainers', sampleTrainers)
  );
  const [students, setStudents] = useState<Student[]>(() =>
    loadFromStorage('ppma_students', sampleStudents)
  );
  const [blogs, setBlogs] = useState<Blog[]>(() =>
    loadFromStorage('ppma_blogs', sampleBlogs)
  );
  const [gallery, setGallery] = useState<GalleryItem[]>(() =>
    loadFromStorage('ppma_gallery', sampleGallery)
  );
  const [homeContentState, setHomeContent] = useState<HomeContent>(() =>
    loadFromStorage('ppma_homeContent', defaultHomeContent)
  );
  const [siteSettingsState, setSiteSettings] = useState<SiteSettings>(() =>
    loadFromStorage('ppma_siteSettings', defaultSiteSettings)
  );
  const [admissions, setAdmissions] = useState<AdmissionRequest[]>(() =>
    loadFromStorage('ppma_admissions', sampleAdmissions)
  );
  const [messagesState, setMessages] = useState<ContactMessage[]>(() =>
    loadFromStorage('ppma_messages', sampleMessages)
  );

  useEffect(() => {
    localStorage.setItem('ppma_courses', JSON.stringify(courses));
  }, [courses]);
  useEffect(() => {
    localStorage.setItem('ppma_facilities', JSON.stringify(facilities));
  }, [facilities]);
  useEffect(() => {
    localStorage.setItem('ppma_trainers', JSON.stringify(trainers));
  }, [trainers]);
  useEffect(() => {
    localStorage.setItem('ppma_students', JSON.stringify(students));
  }, [students]);
  useEffect(() => {
    localStorage.setItem('ppma_blogs', JSON.stringify(blogs));
  }, [blogs]);
  useEffect(() => {
    localStorage.setItem('ppma_gallery', JSON.stringify(gallery));
  }, [gallery]);
  useEffect(() => {
    localStorage.setItem('ppma_homeContent', JSON.stringify(homeContentState));
  }, [homeContentState]);
  useEffect(() => {
    localStorage.setItem('ppma_siteSettings', JSON.stringify(siteSettingsState));
  }, [siteSettingsState]);
  useEffect(() => {
    localStorage.setItem('ppma_admissions', JSON.stringify(admissions));
  }, [admissions]);
  useEffect(() => {
    localStorage.setItem('ppma_messages', JSON.stringify(messagesState));
  }, [messagesState]);

  return (
    <DataContext.Provider
      value={{
        courses,
        setCourses,
        facilities,
        setFacilities,
        trainers,
        setTrainers,
        students,
        setStudents,
        blogs,
        setBlogs,
        gallery,
        setGallery,
        homeContent: homeContentState,
        setHomeContent,
        siteSettings: siteSettingsState,
        setSiteSettings,
        admissions,
        setAdmissions,
        messages: messagesState,
        setMessages,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData(): DataContextType {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
