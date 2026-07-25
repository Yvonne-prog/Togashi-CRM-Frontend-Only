import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { Shell } from '@/components/layout/Shell';

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
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      
      <Route path="*">
        <AuthProvider>
          <Shell>
            <Switch>
              <Route path="/" component={Dashboard} />
              
              <Route path="/contacts" component={Contacts} />
              <Route path="/contacts/:id" component={ContactDetail} />
              
              <Route path="/companies" component={Companies} />
              <Route path="/companies/:id" component={CompanyDetail} />
              
              <Route path="/leads" component={Leads} />
              <Route path="/leads/:id" component={LeadDetail} />
              
              <Route path="/deals" component={Deals} />
              <Route path="/deals/:id" component={DealDetail} />
              
              <Route path="/quotations" component={Quotations} />
              
              <Route path="/projects" component={Projects} />
              <Route path="/projects/:id" component={ProjectDetail} />
              
              <Route path="/tasks" component={Tasks} />
              <Route path="/tasks/:id" component={TaskDetail} />
              
              <Route path="/calendar" component={CalendarPage} />
              
              <Route path="/documents" component={Documents} />
              
              <Route path="/communications" component={Communications} />
              
              <Route path="/reports" component={Reports} />
              
              <Route path="/notifications" component={Notifications} />
              
              <Route path="/settings" component={Settings} />
              
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
