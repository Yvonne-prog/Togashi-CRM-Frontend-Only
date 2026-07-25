import { contacts, companies, leads, deals, projects, taskList, calendarEvents } from '@/data/dashboardMockData';
import { getNotifications } from '@/data/notificationData';

export interface SearchResult {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  url: string;
  typeLabel: string;
}

export function searchAll(query: string): { type: string; typeLabel: string; results: SearchResult[] }[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const sections: { type: string; typeLabel: string; results: SearchResult[] }[] = [];

  const contactResults = contacts.filter(
    (c) =>
      c.firstName.toLowerCase().includes(q) ||
      c.lastName.toLowerCase().includes(q) ||
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.company.toLowerCase().includes(q),
  );
  if (contactResults.length > 0) {
    sections.push({
      type: 'contact',
      typeLabel: 'Contacts',
      results: contactResults.slice(0, 3).map((c) => ({
        id: c.id,
        type: 'contact',
        title: `${c.firstName} ${c.lastName}`,
        subtitle: `${c.jobTitle} · ${c.company}`,
        url: `/contacts/${c.id}`,
        typeLabel: 'Contacts',
      })),
    });
  }

  const companyResults = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.industry.toLowerCase().includes(q) ||
      c.location.toLowerCase().includes(q),
  );
  if (companyResults.length > 0) {
    sections.push({
      type: 'company',
      typeLabel: 'Companies',
      results: companyResults.slice(0, 3).map((c) => ({
        id: c.id,
        type: 'company',
        title: c.name,
        subtitle: `${c.industry} · ${c.location}`,
        url: `/companies/${c.id}`,
        typeLabel: 'Companies',
      })),
    });
  }

  const leadResults = leads.filter(
    (l) =>
      l.firstName.toLowerCase().includes(q) ||
      l.lastName.toLowerCase().includes(q) ||
      `${l.firstName} ${l.lastName}`.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q) ||
      l.company.toLowerCase().includes(q) ||
      l.source.toLowerCase().includes(q),
  );
  if (leadResults.length > 0) {
    sections.push({
      type: 'lead',
      typeLabel: 'Leads',
      results: leadResults.slice(0, 3).map((l) => ({
        id: l.id,
        type: 'lead',
        title: `${l.firstName} ${l.lastName}`,
        subtitle: `${l.company} · Score ${l.score}`,
        url: `/leads/${l.id}`,
        typeLabel: 'Leads',
      })),
    });
  }

  const dealResults = deals.filter(
    (d) =>
      d.title.toLowerCase().includes(q) ||
      d.companyName.toLowerCase().includes(q) ||
      d.stage.toLowerCase().includes(q),
  );
  if (dealResults.length > 0) {
    sections.push({
      type: 'deal',
      typeLabel: 'Deals',
      results: dealResults.slice(0, 3).map((d) => ({
        id: d.id,
        type: 'deal',
        title: d.title,
        subtitle: `UGX ${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(d.value)} · ${d.stage}`,
        url: `/deals/${d.id}`,
        typeLabel: 'Deals',
      })),
    });
  }

  const projectResults = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.companyName.toLowerCase().includes(q) ||
      p.projectManager.toLowerCase().includes(q),
  );
  if (projectResults.length > 0) {
    sections.push({
      type: 'project',
      typeLabel: 'Projects',
      results: projectResults.slice(0, 3).map((p) => ({
        id: p.id,
        type: 'project',
        title: p.name,
        subtitle: `${p.companyName} · ${p.progress}%`,
        url: `/projects/${p.id}`,
        typeLabel: 'Projects',
      })),
    });
  }

  const taskResults = taskList.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.project.toLowerCase().includes(q) ||
      t.assignee.toLowerCase().includes(q),
  );
  if (taskResults.length > 0) {
    sections.push({
      type: 'task',
      typeLabel: 'Tasks',
      results: taskResults.slice(0, 3).map((t) => ({
        id: t.id,
        type: 'task',
        title: t.title,
        subtitle: `${t.project} · ${t.priority}`,
        url: `/tasks/${t.id}`,
        typeLabel: 'Tasks',
      })),
    });
  }

  const eventResults = calendarEvents.filter(
    (e) =>
      e.title.toLowerCase().includes(q) ||
      (e.relatedEntity && e.relatedEntity.toLowerCase().includes(q)),
  );
  if (eventResults.length > 0) {
    sections.push({
      type: 'event',
      typeLabel: 'Calendar',
      results: eventResults.slice(0, 3).map((e) => ({
        id: e.id,
        type: 'event',
        title: e.title,
        subtitle: `${e.date} · ${e.time}`,
        url: '/calendar',
        typeLabel: 'Calendar',
      })),
    });
  }

  const notifResults = getNotifications().filter(
    (n) =>
      n.title.toLowerCase().includes(q) ||
      n.description.toLowerCase().includes(q),
  );
  if (notifResults.length > 0) {
    sections.push({
      type: 'notification',
      typeLabel: 'Notifications',
      results: notifResults.slice(0, 3).map((n) => ({
        id: n.id,
        type: 'notification',
        title: n.title,
        subtitle: n.description,
        url: '/notifications',
        typeLabel: 'Notifications',
      })),
    });
  }

  return sections;
}

export const TYPE_ICONS: Record<string, string> = {
  contact: 'Profile2User',
  company: 'Buildings',
  lead: 'ProfileAdd',
  deal: 'WalletMoney',
  project: 'Briefcase',
  task: 'TaskSquare',
  event: 'Calendar',
  notification: 'Notification',
};
