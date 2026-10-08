import { useEffect, ComponentType, ReactElement } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AdminLayout from '../components/admin/AdminLayout';
import Overview from '../components/admin/Overview';
import ProfileEditor from '../components/admin/ProfileEditor';
import ProjectsEditor from '../components/admin/ProjectsEditor';
import SkillsEditor from '../components/admin/SkillsEditor';
import ExperienceEditor from '../components/admin/ExperienceEditor';
import EducationEditor from '../components/admin/EducationEditor';
import TestimonialsEditor from '../components/admin/TestimonialsEditor';
import MessagesInbox from '../components/admin/MessagesInbox';
import ThemeEditor from '../components/admin/ThemeEditor';
import SettingsEditor from '../components/admin/SettingsEditor';

function RequireAuth({ children }: { children: ReactElement }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return children;
}

const TITLES: Record<string, string> = {
  '': 'Overview',
  'profile': 'Profile & Hero',
  'projects': 'Projects',
  'skills': 'Skills',
  'experience': 'Experience',
  'education': 'Education',
  'testimonials': 'Testimonials',
  'messages': 'Messages Inbox',
  'theme': 'Theme & Appearance',
  'settings': 'SEO & Settings',
};

function AdminPage({ component: Component, path }: { component: ComponentType; path: string }) {
  return (
    <RequireAuth>
      <AdminLayout title={TITLES[path] || 'Admin'}>
        <Component />
      </AdminLayout>
    </RequireAuth>
  );
}

export default function Admin() {
  // Auto-logout on inactivity (30 min)
  const { logout, isAuthenticated } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) return;
    let timer: ReturnType<typeof setTimeout>;
    const reset = () => { clearTimeout(timer); timer = setTimeout(() => { logout(); nav('/admin/login'); }, 30 * 60 * 1000); };
    window.addEventListener('mousemove', reset);
    window.addEventListener('keydown', reset);
    reset();
    return () => { clearTimeout(timer); window.removeEventListener('mousemove', reset); window.removeEventListener('keydown', reset); };
  }, [isAuthenticated, logout, nav]);

  return (
    <Routes>
      <Route index element={<AdminPage component={Overview} path="" />} />
      <Route path="profile" element={<AdminPage component={ProfileEditor} path="profile" />} />
      <Route path="projects" element={<AdminPage component={ProjectsEditor} path="projects" />} />
      <Route path="skills" element={<AdminPage component={SkillsEditor} path="skills" />} />
      <Route path="experience" element={<AdminPage component={ExperienceEditor} path="experience" />} />
      <Route path="education" element={<AdminPage component={EducationEditor} path="education" />} />
      <Route path="testimonials" element={<AdminPage component={TestimonialsEditor} path="testimonials" />} />
      <Route path="messages" element={<AdminPage component={MessagesInbox} path="messages" />} />
      <Route path="theme" element={<AdminPage component={ThemeEditor} path="theme" />} />
      <Route path="settings" element={<AdminPage component={SettingsEditor} path="settings" />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
