import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react';
import { SEED_DATA, Profile, Skill, Experience, Project, Education, Testimonial, Message, SEO, Theme, Section } from '../data/seed';
import { api, getSession } from '../lib/api';

type AppData = typeof SEED_DATA;
const LEGACY_KEY = 'portfolio_data';

function readLegacy(): Partial<AppData> | null {
  try { const s = localStorage.getItem(LEGACY_KEY); return s ? JSON.parse(s) : null; } catch { return null; }
}

async function loadFromServer(): Promise<AppData> {
  const session = getSession();
  const res = await api('/api/portfolio');
  if (!res.ok) throw new Error('Load failed');
  const remote = await res.json();

  let base: AppData;
  if (remote) {
    base = { ...SEED_DATA, ...remote, messages: [] };
  } else {
    // Database is empty: when you log in from your old browser, move its saved edits to the server once
    const legacy = session ? readLegacy() : null;
    base = { ...SEED_DATA, ...(legacy ?? {}), messages: [] };
    if (session && legacy) {
      const { messages: _m, ...rest } = base;
      await api('/api/portfolio', { method: 'PUT', body: JSON.stringify(rest) });
    }
  }

  if (session) {
    const m = await api('/api/messages');
    if (m.ok) base.messages = await m.json();
  }
  return base;
}

interface DataContextType {
  data: AppData;
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
  addMessage: (msg: Omit<Message, 'id' | 'date' | 'read' | 'starred'>) => Promise<boolean>;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  deleteMessage: (id: string) => void;
  updateSEO: (seo: Partial<SEO>) => void;
  updateTheme: (theme: Partial<Theme>) => void;
  updateSections: (sections: Section[]) => void;
  recordResumeDownload: () => void;
  resetToSeed: () => void;
}

const DataContext = createContext<DataContextType | null>(null);
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(SEED_DATA);
  const [ready, setReady] = useState(false);
  const latest = useRef<AppData>(SEED_DATA);
  const timer = useRef<number | undefined>(undefined);

  // Load from the server on start, and again whenever you log in or out
  useEffect(() => {
    let alive = true;
    const run = async () => {
      try {
        const d = await loadFromServer();
        if (!alive) return;
        latest.current = d;
        setData(d);
      } catch (e) {
        console.error(e);
      } finally {
        if (alive) setReady(true);
      }
    };
    run();
    window.addEventListener('auth-change', run);
    return () => { alive = false; window.removeEventListener('auth-change', run); };
  }, []);

  const scheduleSave = useCallback(() => {
    if (!getSession()) return;            // only the logged-in admin can save
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(async () => {
      const { messages: _m, ...rest } = latest.current;
      try {
        const res = await api('/api/portfolio', { method: 'PUT', body: JSON.stringify(rest) });
        if (!res.ok) throw new Error(String(res.status));
      } catch {
        alert('Could not save to the server. Check your connection and try again.');
      }
    }, 600);
  }, []);

  const persist = useCallback((updater: (prev: AppData) => AppData) => {
    setData(prev => {
      const next = updater(prev);
      latest.current = next;
      scheduleSave();
      return next;
    });
  }, [scheduleSave]);

  const updateProfile = useCallback((p: Partial<Profile>) => persist(prev => ({ ...prev, profile: { ...prev.profile, ...p } })), [persist]);
  const updateSkills = useCallback((skills: Skill[]) => persist(prev => ({ ...prev, skills })), [persist]);
  const addSkill = useCallback((s: Omit<Skill, 'id'>) => persist(prev => ({ ...prev, skills: [...prev.skills, { ...s, id: uid() }] })), [persist]);
  const deleteSkill = useCallback((id: string) => persist(prev => ({ ...prev, skills: prev.skills.filter(s => s.id !== id) })), [persist]);

  const updateExperience = useCallback((experience: Experience[]) => persist(prev => ({ ...prev, experience })), [persist]);
  const addExperience = useCallback((e: Omit<Experience, 'id'>) => persist(prev => ({ ...prev, experience: [{ ...e, id: uid() }, ...prev.experience] })), [persist]);
  const deleteExperience = useCallback((id: string) => persist(prev => ({ ...prev, experience: prev.experience.filter(e => e.id !== id) })), [persist]);

  const updateProjects = useCallback((projects: Project[]) => persist(prev => ({ ...prev, projects })), [persist]);
  const addProject = useCallback((p: Omit<Project, 'id'>) => persist(prev => ({ ...prev, projects: [{ ...p, id: uid() }, ...prev.projects] })), [persist]);
  const deleteProject = useCallback((id: string) => persist(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) })), [persist]);

  const updateEducation = useCallback((education: Education[]) => persist(prev => ({ ...prev, education })), [persist]);
  const addEducation = useCallback((e: Omit<Education, 'id'>) => persist(prev => ({ ...prev, education: [...prev.education, { ...e, id: uid() }] })), [persist]);
  const deleteEducation = useCallback((id: string) => persist(prev => ({ ...prev, education: prev.education.filter(e => e.id !== id) })), [persist]);

  const updateTestimonials = useCallback((testimonials: Testimonial[]) => persist(prev => ({ ...prev, testimonials })), [persist]);
  const addTestimonial = useCallback((t: Omit<Testimonial, 'id'>) => persist(prev => ({ ...prev, testimonials: [...prev.testimonials, { ...t, id: uid() }] })), [persist]);
  const deleteTestimonial = useCallback((id: string) => persist(prev => ({ ...prev, testimonials: prev.testimonials.filter(t => t.id !== id) })), [persist]);

  const updateSEO = useCallback((seo: Partial<SEO>) => persist(prev => ({ ...prev, seo: { ...prev.seo, ...seo } })), [persist]);
  const updateTheme = useCallback((theme: Partial<Theme>) => persist(prev => ({ ...prev, theme: { ...prev.theme, ...theme } })), [persist]);
  const updateSections = useCallback((sections: Section[]) => persist(prev => ({ ...prev, sections })), [persist]);

  // Messages live in their own table, not in the portfolio JSON
  const addMessage = useCallback(async (msg: Omit<Message, 'id' | 'date' | 'read' | 'starred'>) => {
    try {
      const res = await api('/api/messages', { method: 'POST', body: JSON.stringify(msg) });
      return res.ok;
    } catch { return false; }
  }, []);

  const updateMessage = useCallback((id: string, updates: Partial<Message>) => {
    setData(prev => ({ ...prev, messages: prev.messages.map(m => (m.id === id ? { ...m, ...updates } : m)) }));
    api('/api/messages', { method: 'PATCH', body: JSON.stringify({ id, read: updates.read, starred: updates.starred }) }).catch(() => {});
  }, []);

  const deleteMessage = useCallback((id: string) => {
    setData(prev => ({ ...prev, messages: prev.messages.filter(m => m.id !== id) }));
    api(`/api/messages?id=${encodeURIComponent(id)}`, { method: 'DELETE' }).catch(() => {});
  }, []);

  const recordResumeDownload = useCallback(() => {
    api('/api/download', { method: 'POST' }).catch(() => {});
  }, []);

  const resetToSeed = useCallback(() => {
    persist(prev => ({ ...SEED_DATA, messages: prev.messages }));
  }, [persist]);

  if (!ready) {
    return <div style={{ minHeight: '100vh', background: 'var(--background, #0b1220)' }} />;
  }

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