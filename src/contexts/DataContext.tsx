import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { SEED_DATA, Profile, Skill, Experience, Project, Education, Testimonial, Message, SEO, Theme, Section } from '../data/seed';

const STORAGE_KEY = 'portfolio_data';

function loadData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...SEED_DATA, ...parsed };
    }
  } catch {}
  return SEED_DATA;
}

function saveData(data: typeof SEED_DATA) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

interface DataContextType {
  data: typeof SEED_DATA;
  updateProfile: (profile: Partial<Profile>) => void;
  updateSkills: (skills: Skill[]) => void;
  addSkill: (skill: Omit<Skill, 'id'>) => void;
  deleteSkill: (id: string) => void;
  updateExperience: (exp: Experience[]) => void;
  addExperience: (exp: Omit<Experience, 'id'>) => void;
  deleteExperience: (id: string) => void;
  updateProjects: (projects: Project[]) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  deleteProject: (id: string) => void;
  updateEducation: (edu: Education[]) => void;
  addEducation: (edu: Omit<Education, 'id'>) => void;
  deleteEducation: (id: string) => void;
  updateTestimonials: (testimonials: Testimonial[]) => void;
  addTestimonial: (t: Omit<Testimonial, 'id'>) => void;
  deleteTestimonial: (id: string) => void;
  addMessage: (msg: Omit<Message, 'id' | 'date' | 'read' | 'starred'>) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  deleteMessage: (id: string) => void;
  updateSEO: (seo: Partial<SEO>) => void;
  updateTheme: (theme: Partial<Theme>) => void;
  updateSections: (sections: Section[]) => void;
  recordResumeDownload: () => void;
  resetToSeed: () => void;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<typeof SEED_DATA>(loadData);

  const persist = useCallback((updater: (prev: typeof SEED_DATA) => typeof SEED_DATA) => {
    setData(prev => {
      const next = updater(prev);
      saveData(next);
      return next;
    });
  }, []);

  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

  const updateProfile = useCallback((profile: Partial<Profile>) => {
    persist(prev => ({ ...prev, profile: { ...prev.profile, ...profile } }));
  }, [persist]);

  const updateSkills = useCallback((skills: Skill[]) => {
    persist(prev => ({ ...prev, skills }));
  }, [persist]);

  const addSkill = useCallback((skill: Omit<Skill, 'id'>) => {
    persist(prev => ({ ...prev, skills: [...prev.skills, { ...skill, id: uid() }] }));
  }, [persist]);

  const deleteSkill = useCallback((id: string) => {
    persist(prev => ({ ...prev, skills: prev.skills.filter(s => s.id !== id) }));
  }, [persist]);

  const updateExperience = useCallback((experience: Experience[]) => {
    persist(prev => ({ ...prev, experience }));
  }, [persist]);

  const addExperience = useCallback((exp: Omit<Experience, 'id'>) => {
    persist(prev => ({ ...prev, experience: [{ ...exp, id: uid() }, ...prev.experience] }));
  }, [persist]);

  const deleteExperience = useCallback((id: string) => {
    persist(prev => ({ ...prev, experience: prev.experience.filter(e => e.id !== id) }));
  }, [persist]);

  const updateProjects = useCallback((projects: Project[]) => {
    persist(prev => ({ ...prev, projects }));
  }, [persist]);

  const addProject = useCallback((project: Omit<Project, 'id'>) => {
    persist(prev => ({ ...prev, projects: [{ ...project, id: uid() }, ...prev.projects] }));
  }, [persist]);

  const deleteProject = useCallback((id: string) => {
    persist(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }));
  }, [persist]);

  const updateEducation = useCallback((education: Education[]) => {
    persist(prev => ({ ...prev, education }));
  }, [persist]);

  const addEducation = useCallback((edu: Omit<Education, 'id'>) => {
    persist(prev => ({ ...prev, education: [...prev.education, { ...edu, id: uid() }] }));
  }, [persist]);

  const deleteEducation = useCallback((id: string) => {
    persist(prev => ({ ...prev, education: prev.education.filter(e => e.id !== id) }));
  }, [persist]);

  const updateTestimonials = useCallback((testimonials: Testimonial[]) => {
    persist(prev => ({ ...prev, testimonials }));
  }, [persist]);

  const addTestimonial = useCallback((t: Omit<Testimonial, 'id'>) => {
    persist(prev => ({ ...prev, testimonials: [...prev.testimonials, { ...t, id: uid() }] }));
  }, [persist]);

  const deleteTestimonial = useCallback((id: string) => {
    persist(prev => ({ ...prev, testimonials: prev.testimonials.filter(t => t.id !== id) }));
  }, [persist]);

  const addMessage = useCallback((msg: Omit<Message, 'id' | 'date' | 'read' | 'starred'>) => {
    const newMsg: Message = { ...msg, id: uid(), date: new Date().toISOString(), read: false, starred: false };
    persist(prev => ({ ...prev, messages: [newMsg, ...prev.messages] }));
  }, [persist]);

  const updateMessage = useCallback((id: string, updates: Partial<Message>) => {
    persist(prev => ({
      ...prev,
      messages: prev.messages.map(m => m.id === id ? { ...m, ...updates } : m),
    }));
  }, [persist]);

  const deleteMessage = useCallback((id: string) => {
    persist(prev => ({ ...prev, messages: prev.messages.filter(m => m.id !== id) }));
  }, [persist]);

  const updateSEO = useCallback((seo: Partial<SEO>) => {
    persist(prev => ({ ...prev, seo: { ...prev.seo, ...seo } }));
  }, [persist]);

  const updateTheme = useCallback((theme: Partial<Theme>) => {
    persist(prev => ({ ...prev, theme: { ...prev.theme, ...theme } }));
  }, [persist]);

  const updateSections = useCallback((sections: Section[]) => {
    persist(prev => ({ ...prev, sections }));
  }, [persist]);

  const recordResumeDownload = useCallback(() => {
    persist(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        resumeDownloads: prev.profile.resumeDownloads + 1,
        resumeDownloadLog: [new Date().toISOString(), ...prev.profile.resumeDownloadLog],
      },
    }));
  }, [persist]);

  const resetToSeed = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setData(SEED_DATA);
  }, []);

  return (
    <DataContext.Provider value={{
      data, updateProfile, updateSkills, addSkill, deleteSkill,
      updateExperience, addExperience, deleteExperience,
      updateProjects, addProject, deleteProject,
      updateEducation, addEducation, deleteEducation,
      updateTestimonials, addTestimonial, deleteTestimonial,
      addMessage, updateMessage, deleteMessage,
      updateSEO, updateTheme, updateSections, recordResumeDownload, resetToSeed,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
