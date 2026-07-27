import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { AuthProvider, useAuth } from '@/components/auth/AuthProvider';
import { Shell } from '@/components/layout/Shell';
import type { Permission } from '@/lib/permissions';

import Login from '@/pages/login';
import Dashboard from '@/pages/dashboard';
import Contacts from '@/pages/contacts';
import ContactDetail from '@/pages/contacts/[id]';
import Companies from '@/pages/companies';
import CompanyDetail from '@/pages/companies/[id]';
import Leads from '@/pages/leads';
import LeadDetail from '@/pages/leads/[id]';
import Deals from '@/pages/deals';
import DealDetail from '@/pages/deals/[id]';
import Quotations from '@/pages/quotations';
import Invoices from '@/pages/invoices';
import Receipts from '@/pages/receipts';
import Projects from '@/pages/projects';
import ProjectDetail from '@/pages/projects/[id]';
import Tasks from '@/pages/tasks';
import TaskDetail from '@/pages/tasks/[id]';
import CalendarPage from '@/pages/calendar';
import Documents from '@/pages/documents';
import Communications from '@/pages/communications';
import Reports from '@/pages/reports';
import Notifications from '@/pages/notifications';
import Settings from '@/pages/settings';
import UsersPage from '@/pages/users';
import NotFound from '@/pages/not-found';
import AccessDenied from '@/pages/access-denied';

const queryClient = new QueryClient();

function ProtectedRoute({ permission, children }: { permission: Permission; children: ReactNode }) {
  const { hasPermission } = useAuth();
  if (!hasPermission(permission)) {
    return <AccessDenied />;
  }
  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      
      <Route path="*">
        <AuthProvider>
          <Shell>
            <Switch>
              <Route path="/" component={Dashboard} />
              
              <Route path="/contacts">
                <ProtectedRoute permission="contacts.view">
                  <Contacts />
                </ProtectedRoute>
              </Route>
              <Route path="/contacts/:id">
                <ProtectedRoute permission="contacts.view">
                  <ContactDetail />
                </ProtectedRoute>
              </Route>
              
              <Route path="/companies">
                <ProtectedRoute permission="companies.view">
                  <Companies />
                </ProtectedRoute>
              </Route>
              <Route path="/companies/:id">
                <ProtectedRoute permission="companies.view">
                  <CompanyDetail />
                </ProtectedRoute>
              </Route>
              
              <Route path="/leads">
                <ProtectedRoute permission="leads.view">
                  <Leads />
                </ProtectedRoute>
              </Route>
              <Route path="/leads/:id">
                <ProtectedRoute permission="leads.view">
                  <LeadDetail />
                </ProtectedRoute>
              </Route>
              
              <Route path="/deals">
                <ProtectedRoute permission="deals.view">
                  <Deals />
                </ProtectedRoute>
              </Route>
              <Route path="/deals/:id">
                <ProtectedRoute permission="deals.view">
                  <DealDetail />
                </ProtectedRoute>
              </Route>
              
              <Route path="/quotations">
                <ProtectedRoute permission="quotations.view">
                  <Quotations />
                </ProtectedRoute>
              </Route>
              
              <Route path="/invoices">
                <ProtectedRoute permission="invoices.view">
                  <Invoices />
                </ProtectedRoute>
              </Route>
              
              <Route path="/receipts">
                <ProtectedRoute permission="receipts.view">
                  <Receipts />
                </ProtectedRoute>
              </Route>
              
              <Route path="/projects">
                <ProtectedRoute permission="projects.view">
                  <Projects />
                </ProtectedRoute>
              </Route>
              <Route path="/projects/:id">
                <ProtectedRoute permission="projects.view">
                  <ProjectDetail />
                </ProtectedRoute>
              </Route>
              
              <Route path="/tasks">
                <ProtectedRoute permission="tasks.view">
                  <Tasks />
                </ProtectedRoute>
              </Route>
              <Route path="/tasks/:id">
                <ProtectedRoute permission="tasks.view">
                  <TaskDetail />
                </ProtectedRoute>
              </Route>
              
              <Route path="/calendar">
                <ProtectedRoute permission="calendar.view">
                  <CalendarPage />
                </ProtectedRoute>
              </Route>
              
              <Route path="/documents">
                <ProtectedRoute permission="documents.view">
                  <Documents />
                </ProtectedRoute>
              </Route>
              
              <Route path="/communications">
                <ProtectedRoute permission="communications.view">
                  <Communications />
                </ProtectedRoute>
              </Route>
              
              <Route path="/reports">
                <ProtectedRoute permission="reports.view">
                  <Reports />
                </ProtectedRoute>
              </Route>
              
              <Route path="/notifications" component={Notifications} />

              <Route path="/settings">
                <ProtectedRoute permission="settings.view">
                  <Settings />
                </ProtectedRoute>
              </Route>

              <Route path="/users">
                <ProtectedRoute permission="users.view">
                  <UsersPage />
                </ProtectedRoute>
              </Route>
              
              <Route component={NotFound} />
            </Switch>
          </Shell>
        </AuthProvider>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
