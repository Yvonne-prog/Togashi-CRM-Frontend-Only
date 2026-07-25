export interface RevenueDataPoint {
  month: string;
  value: number;
}

export interface RevenueSummary {
  currentMonth: number;
  growth: number;
  annual: number;
}

export interface KpiMetrics {
  pipelineValue: number;
  pipelineChange: number;
  activeDeals: number;
  closingThisMonth: number;
  totalRevenue: number;
  revenueChange: number;
  activeProjects: number;
  openTasks: number;
}

export interface PipelineStage {
  stage: string;
  value: number;
  weightedValue: number;
}

export interface ScheduleEvent {
  id: string;
  time: string;
  title: string;
  relatedContactName: string;
  type: 'Meeting' | 'Call';
  location: string;
}

export interface HealthSegment {
  name: string;
  value: number;
  percentage: number;
}

export interface HealthClient {
  name: string;
  status: 'Healthy' | 'Needs Attention' | 'At Risk';
  lastActivity: string;
}

export interface UpcomingTask {
  id: string;
  title: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
}

export interface ActivityItem {
  id: string;
  type: 'lead' | 'proposal' | 'payment' | 'milestone' | 'contact';
  description: string;
  extra?: string;
  timeAgo: string;
}

export interface TopDeal {
  id: string;
  name: string;
  value: number;
  stage: string;
  probability: number;
}

export interface TeamMember {
  userId: string;
  name: string;
  initials: string;
  dealsWon: number;
  revenue: number;
  tasksCompleted: number;
}

export const kpiMetrics: KpiMetrics = {
  pipelineValue: 84500000,
  pipelineChange: 12.4,
  activeDeals: 18,
  closingThisMonth: 6,
  totalRevenue: 126800000,
  revenueChange: 8.7,
  activeProjects: 9,
  openTasks: 14,
};

export const pipelineStages: PipelineStage[] = [
  { stage: 'New Leads', value: 28000000, weightedValue: 2800000 },
  { stage: 'Qualified', value: 19500000, weightedValue: 4875000 },
  { stage: 'Proposal Sent', value: 17000000, weightedValue: 8500000 },
  { stage: 'Negotiation', value: 12000000, weightedValue: 8400000 },
  { stage: 'Negotiation', value: 8000000, weightedValue: 7200000 },
];

export const scheduleEvents: ScheduleEvent[] = [
  {
    id: 'evt-1',
    time: '09:00',
    title: 'Client Discovery Call',
    relatedContactName: 'Katrina Fashion Finds',
    type: 'Meeting',
    location: 'Online Meeting',
  },
  {
    id: 'evt-2',
    time: '11:30',
    title: 'Website Proposal Review',
    relatedContactName: 'Sparkles Salon Uganda',
    type: 'Meeting',
    location: 'Meeting Room A',
  },
  {
    id: 'evt-3',
    time: '14:00',
    title: 'Ellipse Product Discussion',
    relatedContactName: 'Investor Meeting',
    type: 'Meeting',
    location: 'Boardroom',
  },
  {
    id: 'evt-4',
    time: '16:30',
    title: 'Project Progress Review',
    relatedContactName: 'Amira Interiors',
    type: 'Call',
    location: 'Google Meet',
  },
];

export const healthSegments: HealthSegment[] = [
  { name: 'Healthy', value: 18, percentage: 64 },
  { name: 'Needs Attention', value: 7, percentage: 25 },
  { name: 'At Risk', value: 3, percentage: 11 },
];

export const healthClients: HealthClient[] = [
  { name: 'Amira Interiors', status: 'Healthy', lastActivity: 'Today' },
  { name: 'Katrina Fashion Finds', status: 'Needs Attention', lastActivity: '2 days ago' },
  { name: 'Verax', status: 'At Risk', lastActivity: '8 days ago' },
];

export const upcomingTasks: UpcomingTask[] = [
  { id: 'task-1', title: 'Finalise Katrina Fashion proposal', dueDate: 'Today', priority: 'High', completed: false },
  { id: 'task-2', title: 'Review Ellipse pricing document', dueDate: 'Tomorrow', priority: 'Medium', completed: false },
  { id: 'task-3', title: 'Follow up with Sparkles Salon', dueDate: 'Jul 24', priority: 'Medium', completed: false },
  { id: 'task-4', title: 'Prepare Amira Interiors progress report', dueDate: 'Jul 25', priority: 'Low', completed: false },
];

export const recentActivities: ActivityItem[] = [
  { id: 'act-1', type: 'lead', description: 'New lead added: Sparkles Salon Uganda', timeAgo: '10 minutes ago' },
  { id: 'act-2', type: 'proposal', description: 'Proposal sent to Katrina Fashion Finds', timeAgo: '1 hour ago' },
  { id: 'act-3', type: 'payment', description: 'Payment recorded from Amira Interiors', extra: 'UGX 4,500,000', timeAgo: '3 hours ago' },
  { id: 'act-4', type: 'milestone', description: 'Project milestone completed: Verax Mobile App', timeAgo: 'Yesterday' },
  { id: 'act-5', type: 'contact', description: 'New contact added to Ellipse Investor Account', timeAgo: 'Yesterday' },
];

export const topDeals: TopDeal[] = [
  { id: 'deal-1', name: 'Katrina Fashion Website and E-commerce', value: 18000000, stage: 'Proposal Sent', probability: 65 },
  { id: 'deal-2', name: 'Ellipse Enterprise Partnership', value: 30000000, stage: 'Negotiation', probability: 75 },
  { id: 'deal-3', name: 'Sparkles Salon Website', value: 8500000, stage: 'Qualified', probability: 45 },
  { id: 'deal-4', name: 'Amira Interiors Phase Two', value: 12000000, stage: 'Negotiation', probability: 90 },
];

export const teamMembers: TeamMember[] = [
  { userId: 'usr-1', name: 'Alex Mugisha', initials: 'AM', dealsWon: 8, revenue: 42000000, tasksCompleted: 24 },
  { userId: 'usr-2', name: 'Sarah Birungi', initials: 'SB', dealsWon: 5, revenue: 28500000, tasksCompleted: 18 },
  { userId: 'usr-3', name: 'David Okello', initials: 'DO', dealsWon: 3, revenue: 18000000, tasksCompleted: 15 },
  { userId: 'usr-4', name: 'Grace Nakato', initials: 'GN', dealsWon: 2, revenue: 12500000, tasksCompleted: 22 },
];

export const revenueData: RevenueDataPoint[] = [
  { month: 'Jan', value: 18000000 },
  { month: 'Feb', value: 21000000 },
  { month: 'Mar', value: 24000000 },
  { month: 'Apr', value: 22000000 },
  { month: 'May', value: 31000000 },
  { month: 'Jun', value: 28000000 },
  { month: 'Jul', value: 35000000 },
  { month: 'Aug', value: 37000000 },
  { month: 'Sep', value: 41000000 },
  { month: 'Oct', value: 39000000 },
  { month: 'Nov', value: 46000000 },
  { month: 'Dec', value: 52000000 },
];

export const revenueSummary: RevenueSummary = {
  currentMonth: 52000000,
  growth: 13.0,
  annual: 394000000,
};

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  status: 'Active' | 'Prospect' | 'Inactive';
  lastActivity: string;
  initials: string;
}

export interface ContactSummary {
  total: number;
  active: number;
  prospects: number;
  inactive: number;
}

export const contactSummary: ContactSummary = {
  total: 24,
  active: 17,
  prospects: 5,
  inactive: 2,
};

export const contacts: Contact[] = [
  { id: 'c-1', firstName: 'Sarah', lastName: 'Achieng', email: 'sarah.achieng@email.com', phone: '+256 772 100 200', company: 'Amira Interiors', jobTitle: 'CEO', status: 'Active', lastActivity: 'Today', initials: 'SA' },
  { id: 'c-2', firstName: 'John', lastName: 'Mukasa', email: 'john.mukasa@email.com', phone: '+256 701 200 300', company: 'Sparkles Salon Uganda', jobTitle: 'Owner', status: 'Prospect', lastActivity: 'Yesterday', initials: 'JM' },
  { id: 'c-3', firstName: 'Maria', lastName: 'Nalubega', email: 'maria.nalubega@email.com', phone: '+256 782 300 400', company: 'Ellipse', jobTitle: 'VP Operations', status: 'Active', lastActivity: '2 days ago', initials: 'MN' },
  { id: 'c-4', firstName: 'Peter', lastName: 'Okot', email: 'peter.okot@email.com', phone: '+256 753 400 500', company: 'Verax', jobTitle: 'CTO', status: 'Active', lastActivity: 'Today', initials: 'PO' },
  { id: 'c-5', firstName: 'Grace', lastName: 'Namugenyi', email: 'grace.nam@email.com', phone: '+256 774 500 600', company: 'Katrina Fashion Finds', jobTitle: 'Creative Director', status: 'Active', lastActivity: 'Yesterday', initials: 'GN' },
  { id: 'c-6', firstName: 'David', lastName: 'Ssempijja', email: 'david.ssemp@email.com', phone: '+256 702 600 700', company: 'Uganda Breweries', jobTitle: 'Procurement Manager', status: 'Prospect', lastActivity: '3 days ago', initials: 'DS' },
  { id: 'c-7', firstName: 'Jane', lastName: 'Kisakye', email: 'jane.kisakye@email.com', phone: '+256 785 700 800', company: 'MTN Uganda', jobTitle: 'Marketing Director', status: 'Active', lastActivity: 'Today', initials: 'JK' },
  { id: 'c-8', firstName: 'Robert', lastName: 'Tumusiime', email: 'robert.t@email.com', phone: '+256 714 800 900', company: 'Stanbic Bank', jobTitle: 'Relationship Manager', status: 'Active', lastActivity: '4 days ago', initials: 'RT' },
  { id: 'c-9', firstName: 'Agnes', lastName: 'Nabatanzi', email: 'agnes.n@email.com', phone: '+256 776 900 100', company: 'Jumia Uganda', jobTitle: 'Country Manager', status: 'Prospect', lastActivity: '1 week ago', initials: 'AN' },
  { id: 'c-10', firstName: 'Michael', lastName: 'Wasswa', email: 'michael.w@email.com', phone: '+256 703 110 220', company: 'SafeBoda', jobTitle: 'Operations Lead', status: 'Active', lastActivity: 'Today', initials: 'MW' },
  { id: 'c-11', firstName: 'Patricia', lastName: 'Nakamya', email: 'patricia.n@email.com', phone: '+256 787 220 330', company: 'Airtel Uganda', jobTitle: 'Head of Sales', status: 'Inactive', lastActivity: '2 weeks ago', initials: 'PN' },
  { id: 'c-12', firstName: 'Joseph', lastName: 'Kato', email: 'joseph.kato@email.com', phone: '+256 752 330 440', company: 'CiplaQCIL', jobTitle: 'Pharmaceutical Rep', status: 'Active', lastActivity: 'Yesterday', initials: 'JK' },
  { id: 'c-13', firstName: 'Diana', lastName: 'Mirembe', email: 'diana.m@email.com', phone: '+256 701 440 550', company: 'Kampala Serena', jobTitle: 'Events Manager', status: 'Prospect', lastActivity: '3 days ago', initials: 'DM' },
  { id: 'c-14', firstName: 'Samuel', lastName: 'Okello', email: 'samuel.o@email.com', phone: '+256 783 550 660', company: 'Centenary Bank', jobTitle: 'Branch Manager', status: 'Active', lastActivity: 'Today', initials: 'SO' },
  { id: 'c-15', firstName: 'Betty', lastName: 'Akello', email: 'betty.a@email.com', phone: '+256 773 660 770', company: 'Numa Feeds', jobTitle: 'Managing Director', status: 'Active', lastActivity: '1 day ago', initials: 'BA' },
  { id: 'c-16', firstName: 'Fred', lastName: 'Lwanga', email: 'fred.lwanga@email.com', phone: '+256 755 770 880', company: 'Tusker Mattresses', jobTitle: 'Fleet Manager', status: 'Active', lastActivity: '5 days ago', initials: 'FL' },
  { id: 'c-17', firstName: 'Catherine', lastName: 'Nantongo', email: 'catherine.n@email.com', phone: '+256 704 880 990', company: 'Rene Industries', jobTitle: 'Quality Director', status: 'Active', lastActivity: 'Yesterday', initials: 'CN' },
  { id: 'c-18', firstName: 'Henry', lastName: 'Ssewanyana', email: 'henry.s@email.com', phone: '+256 786 990 100', company: 'Uganda Telecom', jobTitle: 'IT Manager', status: 'Inactive', lastActivity: '3 weeks ago', initials: 'HS' },
  { id: 'c-19', firstName: 'Monica', lastName: 'Birungi', email: 'monica.b@email.com', phone: '+256 771 100 200', company: 'Crown Beverages', jobTitle: 'Brand Manager', status: 'Active', lastActivity: 'Today', initials: 'MB' },
  { id: 'c-20', firstName: 'Tom', lastName: 'Otim', email: 'tom.otim@email.com', phone: '+256 791 200 300', company: 'Roofings Group', jobTitle: 'Procurement', status: 'Active', lastActivity: '6 days ago', initials: 'TO' },
  { id: 'c-21', firstName: 'Linda', lastName: 'Kizza', email: 'linda.kizza@email.com', phone: '+256 708 300 400', company: 'Quality Supermarket', jobTitle: 'Owner', status: 'Active', lastActivity: '1 day ago', initials: 'LK' },
  { id: 'c-22', firstName: 'Paul', lastName: 'Mugerwa', email: 'paul.mugerwa@email.com', phone: '+256 760 400 500', company: 'Prudential Uganda', jobTitle: 'Underwriter', status: 'Active', lastActivity: '2 days ago', initials: 'PM' },
  { id: 'c-23', firstName: 'Ruth', lastName: 'Nakimbugwe', email: 'ruth.n@email.com', phone: '+256 779 500 600', company: 'Movit Products', jobTitle: 'Marketing Lead', status: 'Active', lastActivity: '4 days ago', initials: 'RN' },
  { id: 'c-24', firstName: 'James', lastName: 'Muyingo', email: 'james.m@email.com', phone: '+256 715 600 700', company: 'Kiira Motors', jobTitle: 'Engineer', status: 'Prospect', lastActivity: '1 week ago', initials: 'JM' },
];

export interface Company {
  id: string;
  name: string;
  industry: string;
  location: string;
  openDeals: number;
  revenue: number;
  status: 'Active' | 'Prospect' | 'Inactive';
  lastActivity: string;
  initials: string;
  contactCount: number;
}

export interface CompanySummary {
  total: number;
  active: number;
  prospects: number;
  inactive: number;
}

export const companySummary: CompanySummary = {
  total: 17,
  active: 13,
  prospects: 3,
  inactive: 1,
};

export const companies: Company[] = [
  { id: 'co-1', name: 'Katrina Fashion Finds', industry: 'Retail & Fashion', location: 'Kampala', openDeals: 3, revenue: 18000000, status: 'Active', lastActivity: 'Yesterday', initials: 'KF', contactCount: 4 },
  { id: 'co-2', name: 'Amira Interiors', industry: 'Interior Design', location: 'Nairobi', openDeals: 2, revenue: 45000000, status: 'Active', lastActivity: 'Today', initials: 'AI', contactCount: 6 },
  { id: 'co-3', name: 'Sparkles Salon Uganda', industry: 'Beauty & Wellness', location: 'Kampala', openDeals: 1, revenue: 8500000, status: 'Prospect', lastActivity: 'Yesterday', initials: 'SS', contactCount: 2 },
  { id: 'co-4', name: 'Verax', industry: 'Technology', location: 'Kampala', openDeals: 2, revenue: 12000000, status: 'Active', lastActivity: '8 days ago', initials: 'VX', contactCount: 3 },
  { id: 'co-5', name: 'Standard Chartered Uganda', industry: 'Banking & Finance', location: 'Kampala', openDeals: 1, revenue: 32000000, status: 'Active', lastActivity: 'Today', initials: 'SC', contactCount: 8 },
  { id: 'co-7', name: 'Gadget Arena', industry: 'Electronics', location: 'Kampala', openDeals: 0, revenue: 0, status: 'Inactive', lastActivity: '1 week ago', initials: 'GA', contactCount: 1 },
  { id: 'co-8', name: 'MTN Uganda', industry: 'Telecommunications', location: 'Kampala', openDeals: 2, revenue: 55000000, status: 'Active', lastActivity: 'Today', initials: 'MT', contactCount: 15 },
  { id: 'co-9', name: 'SafeBoda', industry: 'Transportation', location: 'Kampala', openDeals: 1, revenue: 42000000, status: 'Active', lastActivity: 'Yesterday', initials: 'SB', contactCount: 5 },
  { id: 'co-10', name: 'Centenary Bank', industry: 'Banking & Finance', location: 'Kampala', openDeals: 1, revenue: 18500000, status: 'Active', lastActivity: 'Today', initials: 'CB', contactCount: 7 },
  { id: 'co-11', name: 'Ellipse', industry: 'Financial Services', location: 'Nairobi', openDeals: 3, revenue: 30000000, status: 'Active', lastActivity: '2 days ago', initials: 'EP', contactCount: 4 },
  { id: 'co-12', name: 'Crown Beverages', industry: 'Food & Beverage', location: 'Kampala', openDeals: 0, revenue: 22000000, status: 'Active', lastActivity: '5 days ago', initials: 'CV', contactCount: 3 },
  { id: 'co-13', name: 'Roofings Group', industry: 'Manufacturing', location: 'Kampala', openDeals: 1, revenue: 15000000, status: 'Active', lastActivity: '3 days ago', initials: 'RG', contactCount: 2 },
  { id: 'co-14', name: 'Jumia Uganda', industry: 'E-commerce', location: 'Kampala', openDeals: 1, revenue: 10500000, status: 'Prospect', lastActivity: '1 week ago', initials: 'JU', contactCount: 2 },
  { id: 'co-15', name: 'Numa Feeds', industry: 'Agriculture', location: 'Jinja', openDeals: 0, revenue: 9800000, status: 'Active', lastActivity: '4 days ago', initials: 'NF', contactCount: 1 },
  { id: 'co-16', name: 'Kiira Motors', industry: 'Automotive', location: 'Jinja', openDeals: 1, revenue: 7200000, status: 'Prospect', lastActivity: '2 weeks ago', initials: 'KM', contactCount: 1 },
  { id: 'co-17', name: 'Prudential Uganda', industry: 'Insurance', location: 'Kampala', openDeals: 1, revenue: 13500000, status: 'Active', lastActivity: 'Yesterday', initials: 'PU', contactCount: 3 },
  { id: 'co-18', name: 'Stanbic Bank', industry: 'Banking & Finance', location: 'Kampala', openDeals: 2, revenue: 28000000, status: 'Active', lastActivity: '6 days ago', initials: 'ST', contactCount: 5 },
];

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  source: string;
  score: number;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  temperature: 'Hot' | 'Warm' | 'Cold';
  assignedTo: string;
  lastContact: string;
  initials: string;
}

export interface LeadStats {
  total: number;
  totalChange: number;
  qualified: number;
  qualificationRate: number;
  hot: number;
  hotSubtext: string;
  newThisWeek: number;
  newChange: number;
}

export const leadStats: LeadStats = {
  total: 124,
  totalChange: 12,
  qualified: 46,
  qualificationRate: 37,
  hot: 18,
  hotSubtext: 'Awaiting immediate follow-up',
  newThisWeek: 11,
  newChange: 4,
};

export const leads: Lead[] = [
  { id: 'ld-1', firstName: 'Amina', lastName: 'Wanjiku', email: 'amina.w@email.com', company: 'Katrina Fashion Finds', source: 'Website', score: 87, status: 'Qualified', temperature: 'Hot', assignedTo: 'Alex Mugisha', lastContact: 'Today', initials: 'AW' },
  { id: 'ld-2', firstName: 'Brian', lastName: 'Ochieng', email: 'brian.o@email.com', company: 'Sparkles Salon Uganda', source: 'Referral', score: 72, status: 'Qualified', temperature: 'Warm', assignedTo: 'Sarah Birungi', lastContact: 'Yesterday', initials: 'BO' },
  { id: 'ld-3', firstName: 'Claire', lastName: 'Nakimuli', email: 'claire.n@email.com', company: 'Amira Interiors', source: 'LinkedIn', score: 94, status: 'Qualified', temperature: 'Hot', assignedTo: 'Alex Mugisha', lastContact: 'Today', initials: 'CN' },
  { id: 'ld-4', firstName: 'Daniel', lastName: 'Ssengendo', email: 'daniel.s@email.com', company: 'SafeBoda', source: 'Cold Call', score: 35, status: 'New', temperature: 'Cold', assignedTo: 'David Okello', lastContact: '3 days ago', initials: 'DS' },
  { id: 'ld-5', firstName: 'Esther', lastName: 'Auma', email: 'esther.a@email.com', company: 'Standard Chartered Uganda', source: 'Trade Show', score: 68, status: 'Contacted', temperature: 'Warm', assignedTo: 'Grace Nakato', lastContact: '1 day ago', initials: 'EA' },
  { id: 'ld-6', firstName: 'Francis', lastName: 'Kabugo', email: 'francis.k@email.com', company: 'MTN Uganda', source: 'Website', score: 91, status: 'Qualified', temperature: 'Hot', assignedTo: 'David Okello', lastContact: 'Today', initials: 'FK' },
  { id: 'ld-7', firstName: 'Grace', lastName: 'Aketch', email: 'grace.a@email.com', company: 'Jumia Uganda', source: 'Referral', score: 55, status: 'Contacted', temperature: 'Warm', assignedTo: 'Sarah Birungi', lastContact: '2 days ago', initials: 'GA' },
  { id: 'ld-8', firstName: 'Henry', lastName: 'Wamala', email: 'henry.w@email.com', company: 'Centenary Bank', source: 'Event', score: 42, status: 'New', temperature: 'Cold', assignedTo: 'Grace Nakato', lastContact: '4 days ago', initials: 'HW' },
  { id: 'ld-9', firstName: 'Irene', lastName: 'Namutebi', email: 'irene.n@email.com', company: 'Ellipse', source: 'LinkedIn', score: 78, status: 'Qualified', temperature: 'Hot', assignedTo: 'David Okello', lastContact: 'Yesterday', initials: 'IN' },
  { id: 'ld-10', firstName: 'Jacob', lastName: 'Mwesigwa', email: 'jacob.m@email.com', company: 'Numa Feeds', source: 'Website', score: 23, status: 'Lost', temperature: 'Cold', assignedTo: 'Sarah Birungi', lastContact: '2 weeks ago', initials: 'JM' },
  { id: 'ld-11', firstName: 'Kellen', lastName: 'Nalwanga', email: 'kellen.n@email.com', company: 'Crown Beverages', source: 'Cold Call', score: 61, status: 'Contacted', temperature: 'Warm', assignedTo: 'Alex Mugisha', lastContact: '1 day ago', initials: 'KN' },
  { id: 'ld-12', firstName: 'Lawrence', lastName: 'Kizito', email: 'lawrence.k@email.com', company: 'Roofings Group', source: 'Trade Show', score: 88, status: 'Qualified', temperature: 'Hot', assignedTo: 'Grace Nakato', lastContact: 'Today', initials: 'LK' },
  { id: 'ld-13', firstName: 'Martha', lastName: 'Ajok', email: 'martha.a@email.com', company: 'Uganda Telecom', source: 'Referral', score: 48, status: 'Contacted', temperature: 'Warm', assignedTo: 'David Okello', lastContact: '3 days ago', initials: 'MA' },
  { id: 'ld-14', firstName: 'Nicholas', lastName: 'Bwambale', email: 'nicholas.b@email.com', company: 'Kiira Motors', source: 'Website', score: 82, status: 'Qualified', temperature: 'Hot', assignedTo: 'Alex Mugisha', lastContact: 'Yesterday', initials: 'NB' },
  { id: 'ld-15', firstName: 'Olivia', lastName: 'Kirabo', email: 'olivia.k@email.com', company: 'Prudential Uganda', source: 'LinkedIn', score: 39, status: 'New', temperature: 'Cold', assignedTo: 'Sarah Birungi', lastContact: '5 days ago', initials: 'OK' },
  { id: 'ld-16', firstName: 'Patrick', lastName: 'Zziwa', email: 'patrick.z@email.com', company: 'Mukwano Industries', source: 'Event', score: 73, status: 'Qualified', temperature: 'Hot', assignedTo: 'Grace Nakato', lastContact: 'Today', initials: 'PZ' },
  { id: 'ld-17', firstName: 'Rebecca', lastName: 'Nakayiza', email: 'rebecca.n@email.com', company: 'Stanbic Bank', source: 'Cold Call', score: 52, status: 'Contacted', temperature: 'Warm', assignedTo: 'David Okello', lastContact: '2 days ago', initials: 'RN' },
  { id: 'ld-18', firstName: 'Stephen', lastName: 'Oryem', email: 'stephen.o@email.com', company: 'City Tyres', source: 'Website', score: 18, status: 'Lost', temperature: 'Cold', assignedTo: 'Alex Mugisha', lastContact: '3 weeks ago', initials: 'SO' },
  { id: 'ld-19', firstName: 'Tracy', lastName: 'Nabukenya', email: 'tracy.n@email.com', company: 'Movit Products', source: 'Referral', score: 66, status: 'Qualified', temperature: 'Warm', assignedTo: 'Sarah Birungi', lastContact: 'Yesterday', initials: 'TN' },
  { id: 'ld-20', firstName: 'Vincent', lastName: 'Oloya', email: 'vincent.o@email.com', company: 'Rene Industries', source: 'LinkedIn', score: 44, status: 'New', temperature: 'Cold', assignedTo: 'Grace Nakato', lastContact: '6 days ago', initials: 'VO' },
  { id: 'ld-21', firstName: 'Winnie', lastName: 'Kato', email: 'winnie.k@email.com', company: 'Hima Cement', source: 'Trade Show', score: 76, status: 'Qualified', temperature: 'Hot', assignedTo: 'Alex Mugisha', lastContact: '1 day ago', initials: 'WK' },
  { id: 'ld-22', firstName: 'Xavier', lastName: 'Mugisha', email: 'xavier.m@email.com', company: 'Quality Supermarket', source: 'Website', score: 31, status: 'New', temperature: 'Cold', assignedTo: 'David Okello', lastContact: '4 days ago', initials: 'XM' },
  { id: 'ld-23', firstName: 'Yvonne', lastName: 'Ayeet', email: 'yvonne.a@email.com', company: 'Airtel Uganda', source: 'Event', score: 58, status: 'Contacted', temperature: 'Warm', assignedTo: 'Sarah Birungi', lastContact: '2 days ago', initials: 'YA' },
  { id: 'ld-24', firstName: 'Zachary', lastName: 'Tumwebaze', email: 'zachary.t@email.com', company: 'Tusker Mattresses', source: 'Referral', score: 85, status: 'Qualified', temperature: 'Hot', assignedTo: 'Grace Nakato', lastContact: 'Today', initials: 'ZT' },
];

export interface Deal {
  id: string;
  title: string;
  companyName: string;
  initials: string;
  value: number;
  probability: number;
  stage: string;
  priority: 'High' | 'Medium' | 'Low';
  assignedTo: string;
  expectedCloseDate: string;
  lastActivity: string;
  nextFollowUp: string;
}

export interface DealStats {
  pipelineValue: number;
  activeDeals: number;
  expectedRevenue: number;
  successRate: number;
}

export const dealStats: DealStats = {
  pipelineValue: 84500000,
  activeDeals: 18,
  expectedRevenue: 31775000,
  successRate: 68,
};

export const deals: Deal[] = [
  { id: 'dl-1', title: 'Katrina Fashion Website', companyName: 'Katrina Fashion Finds', initials: 'KF', value: 18000000, probability: 65, stage: 'Proposal Sent', priority: 'High', assignedTo: 'Alex Mugisha', expectedCloseDate: 'Aug 15', lastActivity: '1 hour ago', nextFollowUp: 'Tomorrow' },
  { id: 'dl-2', title: 'Ellipse Enterprise Partnership', companyName: 'Ellipse', initials: 'EP', value: 30000000, probability: 75, stage: 'Negotiation', priority: 'High', assignedTo: 'David Okello', expectedCloseDate: 'Sep 1', lastActivity: 'Today', nextFollowUp: 'Jul 28' },
  { id: 'dl-3', title: 'Sparkles Salon Website', companyName: 'Sparkles Salon Uganda', initials: 'SS', value: 8500000, probability: 45, stage: 'Qualified', priority: 'Medium', assignedTo: 'Sarah Birungi', expectedCloseDate: 'Oct 10', lastActivity: 'Yesterday', nextFollowUp: 'Jul 30' },
  { id: 'dl-4', title: 'Amira Interiors Phase Two', companyName: 'Amira Interiors', initials: 'AI', value: 12000000, probability: 90, stage: 'Negotiation', priority: 'High', assignedTo: 'Alex Mugisha', expectedCloseDate: 'Aug 5', lastActivity: 'Today', nextFollowUp: 'Tomorrow' },
  { id: 'dl-5', title: 'MTN Cloud Migration', companyName: 'MTN Uganda', initials: 'MT', value: 45000000, probability: 25, stage: 'New', priority: 'Medium', assignedTo: 'David Okello', expectedCloseDate: 'Nov 20', lastActivity: '3 days ago', nextFollowUp: 'Aug 1' },
  { id: 'dl-6', title: 'SafeBoda Fleet Expansion', companyName: 'SafeBoda', initials: 'SB', value: 22000000, probability: 55, stage: 'Qualified', priority: 'Medium', assignedTo: 'Sarah Birungi', expectedCloseDate: 'Sep 15', lastActivity: '2 days ago', nextFollowUp: 'Jul 29' },
  { id: 'dl-7', title: 'StanChart Digital Platform', companyName: 'Standard Chartered Uganda', initials: 'SC', value: 35000000, probability: 70, stage: 'Proposal Sent', priority: 'High', assignedTo: 'Grace Nakato', expectedCloseDate: 'Aug 30', lastActivity: 'Today', nextFollowUp: 'Jul 27' },
  { id: 'dl-8', title: 'Togashi CRM Upgrade', companyName: 'Togashi Technologies', initials: 'TT', value: 15000000, probability: 95, stage: 'Negotiation', priority: 'High', assignedTo: 'Grace Nakato', expectedCloseDate: 'Jul 25', lastActivity: 'Yesterday', nextFollowUp: 'Today' },
  { id: 'dl-9', title: 'Centenary Bank Kiosk', companyName: 'Centenary Bank', initials: 'CB', value: 18500000, probability: 40, stage: 'Qualified', priority: 'Low', assignedTo: 'Sarah Birungi', expectedCloseDate: 'Dec 1', lastActivity: '4 days ago', nextFollowUp: 'Aug 5' },
  { id: 'dl-10', title: 'Crown Beverages Rebrand', companyName: 'Crown Beverages', initials: 'CV', value: 28000000, probability: 60, stage: 'Proposal Sent', priority: 'Medium', assignedTo: 'David Okello', expectedCloseDate: 'Sep 20', lastActivity: '1 day ago', nextFollowUp: 'Aug 2' },
  { id: 'dl-11', title: 'Prudential Insurance Portal', companyName: 'Prudential Uganda', initials: 'PU', value: 16000000, probability: 80, stage: 'Negotiation', priority: 'High', assignedTo: 'Sarah Birungi', expectedCloseDate: 'Aug 15', lastActivity: 'Today', nextFollowUp: 'Tomorrow' },
  { id: 'dl-12', title: 'Numa Feeds ERP Setup', companyName: 'Numa Feeds', initials: 'NF', value: 9800000, probability: 50, stage: 'Qualified', priority: 'Low', assignedTo: 'David Okello', expectedCloseDate: 'Oct 25', lastActivity: '5 days ago', nextFollowUp: 'Aug 8' },
  { id: 'dl-13', title: 'Roofings Inventory System', companyName: 'Roofings Group', initials: 'RG', value: 14200000, probability: 35, stage: 'New', priority: 'Medium', assignedTo: 'Grace Nakato', expectedCloseDate: 'Dec 15', lastActivity: '1 week ago', nextFollowUp: 'Aug 10' },
  { id: 'dl-14', title: 'Jumia Payment Gateway', companyName: 'Jumia Uganda', initials: 'JU', value: 20000000, probability: 55, stage: 'Proposal Sent', priority: 'High', assignedTo: 'Alex Mugisha', expectedCloseDate: 'Aug 30', lastActivity: '2 days ago', nextFollowUp: 'Jul 31' },
  { id: 'dl-15', title: 'Stanbic Mobile App v2', companyName: 'Stanbic Bank', initials: 'ST', value: 32000000, probability: 85, stage: 'Negotiation', priority: 'High', assignedTo: 'Grace Nakato', expectedCloseDate: 'Aug 10', lastActivity: 'Today', nextFollowUp: 'Jul 26' },
  { id: 'dl-16', title: 'Verax Mobile Extension', companyName: 'Verax', initials: 'VX', value: 8500000, probability: 20, stage: 'New', priority: 'Low', assignedTo: 'Grace Nakato', expectedCloseDate: 'Jan 2026', lastActivity: '8 days ago', nextFollowUp: 'Aug 12' },
  { id: 'dl-17', title: 'Kiira Motors Fleet App', companyName: 'Kiira Motors', initials: 'KM', value: 18500000, probability: 30, stage: 'New', priority: 'Medium', assignedTo: 'Grace Nakato', expectedCloseDate: 'Nov 5', lastActivity: '2 weeks ago', nextFollowUp: 'Aug 15' },
  { id: 'dl-18', title: 'Airtel Billing Module', companyName: 'Airtel Uganda', initials: 'AU', value: 41000000, probability: 15, stage: 'New', priority: 'Medium', assignedTo: 'Alex Mugisha', expectedCloseDate: 'Feb 2026', lastActivity: '3 weeks ago', nextFollowUp: 'Aug 18' },
  { id: 'dl-19', title: 'Hima Cement Supply Chain', companyName: 'Hima Cement', initials: 'HC', value: 52000000, probability: 0, stage: 'Lost', priority: 'High', assignedTo: 'David Okello', expectedCloseDate: 'Jun 15', lastActivity: '1 month ago', nextFollowUp: '—' },
  { id: 'dl-20', title: 'Uganda Telecom Support', companyName: 'Uganda Telecom', initials: 'UT', value: 13500000, probability: 100, stage: 'Won', priority: 'Medium', assignedTo: 'Sarah Birungi', expectedCloseDate: 'Jul 10', lastActivity: '2 weeks ago', nextFollowUp: '—' },
  { id: 'dl-21', title: 'Movit Marketing Campaign', companyName: 'Movit Products', initials: 'MP', value: 11500000, probability: 100, stage: 'Won', priority: 'Medium', assignedTo: 'Alex Mugisha', expectedCloseDate: 'Jul 5', lastActivity: '3 weeks ago', nextFollowUp: '—' },
  { id: 'dl-22', title: 'Quality Super POS', companyName: 'Quality Supermarket', initials: 'QS', value: 7200000, probability: 0, stage: 'Lost', priority: 'Low', assignedTo: 'Sarah Birungi', expectedCloseDate: 'May 20',     lastActivity: '2 months ago', nextFollowUp: '—' },
];

export interface Task {
  id: string;
  title: string;
  project: string;
  assignee: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Not Started' | 'In Progress' | 'Review' | 'Completed' | 'Blocked' | 'Overdue';
  dueDate: string;
  dueDateRaw: string;
  lastUpdated: string;
  completed: boolean;
}

export interface TaskStats {
  myTasks: number;
  dueToday: number;
  overdue: number;
  completed: number;
}

export const taskStats: TaskStats = {
  myTasks: 8,
  dueToday: 3,
  overdue: 4,
  completed: 28,
};

export const taskList: Task[] = [
  { id: 'tk-1', title: 'Finalise homepage wireframes', project: 'Katrina Fashion Website', assignee: 'Alex Mugisha', priority: 'High', status: 'In Progress', dueDate: 'Today', dueDateRaw: '2026-07-22', lastUpdated: '10 min ago', completed: false },
  { id: 'tk-2', title: 'Design product catalogue layout', project: 'Katrina Fashion Website', assignee: 'Sarah Birungi', priority: 'Medium', status: 'In Progress', dueDate: 'Jul 24', dueDateRaw: '2026-07-24', lastUpdated: '1 hour ago', completed: false },
  { id: 'tk-3', title: 'Set up payment gateway integration', project: 'Katrina Fashion Website', assignee: 'Alex Mugisha', priority: 'High', status: 'Not Started', dueDate: 'Jul 26', dueDateRaw: '2026-07-26', lastUpdated: 'Yesterday', completed: false },
  { id: 'tk-4', title: 'API endpoint documentation', project: 'Ellipse Enterprise Platform', assignee: 'David Okello', priority: 'Medium', status: 'In Progress', dueDate: 'Today', dueDateRaw: '2026-07-22', lastUpdated: '30 min ago', completed: false },
  { id: 'tk-5', title: 'User authentication module', project: 'Ellipse Enterprise Platform', assignee: 'Grace Nakato', priority: 'High', status: 'Review', dueDate: 'Jul 23', dueDateRaw: '2026-07-23', lastUpdated: '2 hours ago', completed: false },
  { id: 'tk-6', title: 'Performance testing report', project: 'Ellipse Enterprise Platform', assignee: 'David Okello', priority: 'High', status: 'Overdue', dueDate: 'Jul 15', dueDateRaw: '2026-07-15', lastUpdated: '5 days ago', completed: false },
  { id: 'tk-7', title: 'Database schema migration', project: 'Ellipse Enterprise Platform', assignee: 'Grace Nakato', priority: 'Medium', status: 'Completed', dueDate: 'Jul 18', dueDateRaw: '2026-07-18', lastUpdated: '4 days ago', completed: true },
  { id: 'tk-8', title: 'Client logo and branding assets', project: 'Amira Interiors Phase II', assignee: 'Sarah Birungi', priority: 'Low', status: 'Not Started', dueDate: 'Jul 28', dueDateRaw: '2026-07-28', lastUpdated: 'Yesterday', completed: false },
  { id: 'tk-9', title: '3D rendering engine integration', project: 'Amira Interiors Phase II', assignee: 'David Okello', priority: 'High', status: 'In Progress', dueDate: 'Jul 25', dueDateRaw: '2026-07-25', lastUpdated: '1 hour ago', completed: false },
  { id: 'tk-10', title: 'Interior design template library', project: 'Amira Interiors Phase II', assignee: 'Alex Mugisha', priority: 'Medium', status: 'Not Started', dueDate: 'Jul 30', dueDateRaw: '2026-07-30', lastUpdated: '3 days ago', completed: false },
  { id: 'tk-11', title: 'Review mobile responsiveness', project: 'Amira Interiors Phase II', assignee: 'Grace Nakato', priority: 'High', status: 'Review', dueDate: 'Aug 1', dueDateRaw: '2026-08-01', lastUpdated: 'Today', completed: false },
  { id: 'tk-12', title: 'Homepage hero section design', project: 'Sparkles Salon Website', assignee: 'Sarah Birungi', priority: 'Medium', status: 'In Progress', dueDate: 'Jul 22', dueDateRaw: '2026-07-22', lastUpdated: '3 hours ago', completed: false },
  { id: 'tk-13', title: 'Booking system integration', project: 'Sparkles Salon Website', assignee: 'Grace Nakato', priority: 'High', status: 'Blocked', dueDate: 'Jul 20', dueDateRaw: '2026-07-20', lastUpdated: '2 days ago', completed: false },
  { id: 'tk-14', title: 'Staff scheduling module', project: 'Sparkles Salon Website', assignee: 'Alex Mugisha', priority: 'Low', status: 'Not Started', dueDate: 'Aug 5', dueDateRaw: '2026-08-05', lastUpdated: '5 days ago', completed: false },
  { id: 'tk-15', title: 'iOS app store submission prep', project: 'Verax Mobile Application', assignee: 'Grace Nakato', priority: 'High', status: 'In Progress', dueDate: 'Jul 22', dueDateRaw: '2026-07-22', lastUpdated: 'Today', completed: false },
  { id: 'tk-16', title: 'Push notification service setup', project: 'Verax Mobile Application', assignee: 'David Okello', priority: 'Medium', status: 'In Progress', dueDate: 'Jul 24', dueDateRaw: '2026-07-24', lastUpdated: 'Yesterday', completed: false },
  { id: 'tk-17', title: 'Android compatibility testing', project: 'Verax Mobile Application', assignee: 'Alex Mugisha', priority: 'Medium', status: 'Not Started', dueDate: 'Jul 27', dueDateRaw: '2026-07-27', lastUpdated: '3 days ago', completed: false },
  { id: 'tk-18', title: 'QA regression test suite', project: 'Verax Mobile Application', assignee: 'Sarah Birungi', priority: 'Low', status: 'Completed', dueDate: 'Jul 10', dueDateRaw: '2026-07-10', lastUpdated: '1 week ago', completed: true },
  { id: 'tk-19', title: 'Content migration from legacy CMS', project: 'Ellipse Enterprise Platform', assignee: 'Sarah Birungi', priority: 'Medium', status: 'Overdue', dueDate: 'Jul 18', dueDateRaw: '2026-07-18', lastUpdated: '4 days ago', completed: false },
  { id: 'tk-20', title: 'Stakeholder demo preparation', project: 'Ellipse Enterprise Platform', assignee: 'Alex Mugisha', priority: 'High', status: 'In Progress', dueDate: 'Tomorrow', dueDateRaw: '2026-07-23', lastUpdated: '1 hour ago', completed: false },
  { id: 'tk-21', title: 'Accessibility audit', project: 'Katrina Fashion Website', assignee: 'Grace Nakato', priority: 'Low', status: 'Completed', dueDate: 'Jul 12', dueDateRaw: '2026-07-12', lastUpdated: '1 week ago', completed: true },
  { id: 'tk-22', title: 'Server provisioning request', project: 'Sparkles Salon Website', assignee: 'David Okello', priority: 'High', status: 'Overdue', dueDate: 'Jul 16', dueDateRaw: '2026-07-16', lastUpdated: '6 days ago', completed: false },
  { id: 'tk-23', title: 'Invoice tracking module', project: 'Ellipse Enterprise Platform', assignee: 'Alex Mugisha', priority: 'Low', status: 'Completed', dueDate: 'Jul 8', dueDateRaw: '2026-07-08', lastUpdated: '2 weeks ago', completed: true },
  { id: 'tk-24', title: 'Analytics dashboard setup', project: 'Verax Mobile Application', assignee: 'David Okello', priority: 'Medium', status: 'Completed', dueDate: 'Jul 5', dueDateRaw: '2026-07-05', lastUpdated: '2 weeks ago', completed: true },
];

export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'xlsx' | 'pptx' | 'png' | 'zip' | 'jpg';
  category: string;
  relatedType: 'company' | 'deal' | 'project' | 'contact';
  relatedName: string;
  size: number;
  uploadedBy: string;
  lastModified: string;
  tags: string[];
}

export interface DocumentStats {
  totalDocuments: number;
  storageUsed: string;
  recentlyUpdated: number;
  sharedThisWeek: number;
}

export const documentStats: DocumentStats = {
  totalDocuments: 28,
  storageUsed: '1.4 GB',
  recentlyUpdated: 6,
  sharedThisWeek: 9,
  recentlyUploaded: 4,
};

export const documentCategories = ['Proposals', 'Contracts', 'Projects', 'Invoices', 'Reports', 'Images', 'Meeting Notes'];

export const documents: Document[] = [
  { id: 'doc-1', name: 'Katrina Fashion Website Proposal.pdf', type: 'pdf', category: 'Proposals', relatedType: 'deal', relatedName: 'Katrina Fashion Website', size: 2400000, uploadedBy: 'Alex Mugisha', lastModified: '2 hours ago', tags: ['proposal', 'katrina', 'website'] },
  { id: 'doc-2', name: 'Ellipse Enterprise Contract.docx', type: 'docx', category: 'Contracts', relatedType: 'deal', relatedName: 'Ellipse Enterprise Partnership', size: 1800000, uploadedBy: 'David Okello', lastModified: 'Yesterday', tags: ['contract', 'ellipse', 'enterprise'] },
  { id: 'doc-3', name: 'Amira Interiors Invoice April.xlsx', type: 'xlsx', category: 'Invoices', relatedType: 'company', relatedName: 'Amira Interiors', size: 560000, uploadedBy: 'Alex Mugisha', lastModified: '3 days ago', tags: ['invoice', 'amira', 'billing'] },
  { id: 'doc-4', name: 'Sparkles Salon Sitemap.png', type: 'png', category: 'Projects', relatedType: 'project', relatedName: 'Sparkles Salon Website', size: 4200000, uploadedBy: 'Sarah Birungi', lastModified: '4 days ago', tags: ['sitemap', 'sparkles', 'design'] },
  { id: 'doc-5', name: 'Verax Mobile App Specs.pdf', type: 'pdf', category: 'Projects', relatedType: 'project', relatedName: 'Verax Mobile Application', size: 3800000, uploadedBy: 'Grace Nakato', lastModified: '1 week ago', tags: ['specs', 'verax', 'mobile'] },
  { id: 'doc-6', name: 'StanChart Platform Demo.pptx', type: 'pptx', category: 'Proposals', relatedType: 'deal', relatedName: 'StanChart Digital Platform', size: 8500000, uploadedBy: 'Grace Nakato', lastModified: '2 days ago', tags: ['demo', 'stanchart', 'presentation'] },
  { id: 'doc-7', name: 'Q2 Sales Report.xlsx', type: 'xlsx', category: 'Reports', relatedType: 'company', relatedName: 'Togashi Technologies', size: 1200000, uploadedBy: 'David Okello', lastModified: '5 days ago', tags: ['report', 'sales', 'q2'] },
  { id: 'doc-8', name: 'Centenary Bank Kiosk Photos.zip', type: 'zip', category: 'Images', relatedType: 'deal', relatedName: 'Centenary Bank Kiosk', size: 12000000, uploadedBy: 'Sarah Birungi', lastModified: '1 week ago', tags: ['photos', 'centenary', 'kiosk'] },
  { id: 'doc-9', name: 'Team Standup Notes Jul 21.docx', type: 'docx', category: 'Meeting Notes', relatedType: 'company', relatedName: 'Togashi Technologies', size: 320000, uploadedBy: 'Alex Mugisha', lastModified: '1 day ago', tags: ['notes', 'standup', 'internal'] },
  { id: 'doc-10', name: 'SafeBoda Fleet Analysis.pdf', type: 'pdf', category: 'Reports', relatedType: 'deal', relatedName: 'SafeBoda Fleet Expansion', size: 2100000, uploadedBy: 'Sarah Birungi', lastModified: 'Today', tags: ['analysis', 'safeboda', 'fleet'] },
  { id: 'doc-11', name: 'Crown Beverages Rebrand Brief.pdf', type: 'pdf', category: 'Proposals', relatedType: 'deal', relatedName: 'Crown Beverages Rebrand', size: 4500000, uploadedBy: 'David Okello', lastModified: '6 days ago', tags: ['brief', 'crown', 'rebrand'] },
  { id: 'doc-12', name: 'Numa Feeds Contract v2.docx', type: 'docx', category: 'Contracts', relatedType: 'company', relatedName: 'Numa Feeds', size: 980000, uploadedBy: 'David Okello', lastModified: '1 week ago', tags: ['contract', 'numa', 'legal'] },
  { id: 'doc-13', name: 'Togashi CRM Wireframes.png', type: 'png', category: 'Projects', relatedType: 'project', relatedName: 'Togashi CRM Upgrade', size: 6200000, uploadedBy: 'Grace Nakato', lastModified: '3 days ago', tags: ['wireframes', 'togashi', 'design'] },
  { id: 'doc-14', name: 'Prudential Insurance Portal Spec.pdf', type: 'pdf', category: 'Proposals', relatedType: 'deal', relatedName: 'Prudential Insurance Portal', size: 1600000, uploadedBy: 'Sarah Birungi', lastModified: '4 days ago', tags: ['spec', 'prudential', 'insurance'] },
  { id: 'doc-15', name: 'MTN Cloud Migration Plan.xlsx', type: 'xlsx', category: 'Projects', relatedType: 'project', relatedName: 'MTN Cloud Migration', size: 2900000, uploadedBy: 'David Okello', lastModified: 'Today', tags: ['plan', 'mtn', 'cloud'] },
  { id: 'doc-16', name: 'Monthly Review Meeting Notes.docx', type: 'docx', category: 'Meeting Notes', relatedType: 'company', relatedName: 'Togashi Technologies', size: 450000, uploadedBy: 'Alex Mugisha', lastModified: '2 days ago', tags: ['notes', 'review', 'internal'] },
];

export const recentDocuments = ['doc-1', 'doc-10', 'doc-6', 'doc-15', 'doc-9'];

export interface CalendarEvent {
  id: string;
  title: string;
  type: 'Meeting' | 'Project' | 'Deal' | 'Task' | 'Deadline';
  date: string;
  time: string;
  relatedEntity?: string;
  owner?: string;
  location?: string;
  color: string;
}

export interface CalendarStats {
  todayMeetings: number;
  tasksDueToday: number;
  upcomingDeadlines: number;
  eventsThisWeek: number;
}

export const calendarStats: CalendarStats = {
  todayMeetings: 4,
  tasksDueToday: 3,
  upcomingDeadlines: 5,
  eventsThisWeek: 18,
};

export const calendarEvents: CalendarEvent[] = [
  { id: 'ev-1', title: 'Client Discovery Call', type: 'Meeting', date: '2026-07-22', time: '09:00', relatedEntity: 'Katrina Fashion Finds', owner: 'Alex Mugisha', location: 'Online', color: '#16A34A' },
  { id: 'ev-2', title: 'Website Proposal Review', type: 'Meeting', date: '2026-07-22', time: '11:30', relatedEntity: 'Sparkles Salon Uganda', owner: 'Sarah Birungi', location: 'Meeting Room A', color: '#16A34A' },
  { id: 'ev-3', title: 'Ellipse Investor Meeting', type: 'Meeting', date: '2026-07-22', time: '14:00', relatedEntity: 'Ellipse', owner: 'David Okello', location: 'Boardroom', color: '#16A34A' },
  { id: 'ev-4', title: 'Project Progress Review', type: 'Meeting', date: '2026-07-22', time: '16:30', relatedEntity: 'Amira Interiors', owner: 'Alex Mugisha', location: 'Google Meet', color: '#16A34A' },
  { id: 'ev-5', title: 'Katrina Fashion Website Demo', type: 'Project', date: '2026-07-23', time: '10:00', relatedEntity: 'Katrina Fashion Finds', owner: 'Alex Mugisha', location: 'Online', color: '#3B82F6' },
  { id: 'ev-6', title: 'Ellipse Platform Sprint Review', type: 'Project', date: '2026-07-23', time: '14:00', relatedEntity: 'Ellipse Enterprise Platform', owner: 'David Okello', location: 'Online', color: '#3B82F6' },
  { id: 'ev-7', title: 'StanChart Deal Close', type: 'Deal', date: '2026-07-24', time: '11:00', relatedEntity: 'Standard Chartered Uganda', owner: 'Grace Nakato', color: '#8B5CF6' },
  { id: 'ev-8', title: 'Amira Interiors Site Visit', type: 'Project', date: '2026-07-24', time: '09:00', relatedEntity: 'Amira Interiors Phase II', owner: 'Alex Mugisha', location: 'Nairobi', color: '#3B82F6' },
  { id: 'ev-9', title: 'Togashi CRM Upgrade Deadline', type: 'Deadline', date: '2026-07-25', time: '17:00', relatedEntity: 'Togashi Technologies', owner: 'Grace Nakato', color: '#DC2626' },
  { id: 'ev-10', title: 'Finalise homepage wireframes', type: 'Task', date: '2026-07-22', time: '08:00', relatedEntity: 'Katrina Fashion Website', owner: 'Alex Mugisha', color: '#F59E0B' },
  { id: 'ev-11', title: 'API endpoint documentation', type: 'Task', date: '2026-07-22', time: '08:00', relatedEntity: 'Ellipse Enterprise Platform', owner: 'David Okello', color: '#F59E0B' },
  { id: 'ev-12', title: 'User authentication module review', type: 'Task', date: '2026-07-23', time: '08:00', relatedEntity: 'Ellipse Enterprise Platform', owner: 'Grace Nakato', color: '#F59E0B' },
  { id: 'ev-13', title: 'Sparkles Salon Sprint Planning', type: 'Project', date: '2026-07-25', time: '10:00', relatedEntity: 'Sparkles Salon Website', owner: 'Sarah Birungi', location: 'Online', color: '#3B82F6' },
  { id: 'ev-14', title: 'Ellipse Partnership Negotiation', type: 'Deal', date: '2026-07-26', time: '15:00', relatedEntity: 'Ellipse', owner: 'David Okello', color: '#8B5CF6' },
  { id: 'ev-15', title: 'Verax Mobile App Milestone', type: 'Project', date: '2026-07-26', time: '09:00', relatedEntity: 'Verax Mobile Application', owner: 'Grace Nakato', color: '#3B82F6' },
  { id: 'ev-16', title: 'Team Standup', type: 'Meeting', date: '2026-07-23', time: '09:00', relatedEntity: 'Internal', owner: 'All', location: 'Online', color: '#16A34A' },
  { id: 'ev-17', title: 'Performance testing deadline', type: 'Deadline', date: '2026-07-23', time: '17:00', relatedEntity: 'Ellipse Enterprise Platform', owner: 'David Okello', color: '#DC2626' },
  { id: 'ev-18', title: 'SafeBoda Fleet Go-Live', type: 'Deadline', date: '2026-07-28', time: '12:00', relatedEntity: 'SafeBoda Fleet Expansion', owner: 'Sarah Birungi', color: '#DC2626' },
  { id: 'ev-19', title: 'Centenary Kiosk Status Update', type: 'Meeting', date: '2026-07-24', time: '15:00', relatedEntity: 'Centenary Bank', owner: 'Sarah Birungi', location: 'Online', color: '#16A34A' },
  { id: 'ev-20', title: 'Booking system review', type: 'Task', date: '2026-07-24', time: '08:00', relatedEntity: 'Sparkles Salon Website', owner: 'Grace Nakato', color: '#F59E0B' },
  { id: 'ev-21', title: 'Stanbic Mobile App Proposal', type: 'Deal', date: '2026-07-25', time: '14:00', relatedEntity: 'Stanbic Bank', owner: 'Grace Nakato', color: '#8B5CF6' },
  { id: 'ev-22', title: 'Analytics Dashboard Presentation', type: 'Meeting', date: '2026-07-25', time: '11:00', relatedEntity: 'Verax', owner: 'David Okello', location: 'Boardroom', color: '#16A34A' },
  { id: 'ev-23', title: 'iOS app store submission', type: 'Deadline', date: '2026-07-27', time: '17:00', relatedEntity: 'Verax Mobile Application', owner: 'Grace Nakato', color: '#DC2626' },
  { id: 'ev-24', title: 'Crown Beverages Deal Review', type: 'Deal', date: '2026-07-27', time: '10:00', relatedEntity: 'Crown Beverages', owner: 'David Okello', color: '#8B5CF6' },
];

export interface Milestone {
  label: string;
  completed: boolean;
  current: boolean;
}

export interface Project {
  id: string;
  name: string;
  companyName: string;
  projectManager: string;
  teamMembers: string[];
  progress: number;
  status: 'On Track' | 'At Risk' | 'Delayed' | 'Completed';
  budget: number;
  startDate: string;
  dueDate: string;
  milestones: Milestone[];
}

export interface ProjectStats {
  activeProjects: number;
  completedThisMonth: number;
  overdueProjects: number;
  avgCompletionRate: number;
}

export const projectStats: ProjectStats = {
  activeProjects: 9,
  completedThisMonth: 3,
  overdueProjects: 2,
  avgCompletionRate: 74,
};

export const projects: Project[] = [
  {
    id: 'pr-1', name: 'Ellipse Enterprise Platform', companyName: 'Ellipse', projectManager: 'David Okello',
    teamMembers: ['David Okello', 'Grace Nakato', 'Alex Mugisha'],
    progress: 65, status: 'On Track', budget: 30000000, startDate: 'Mar 1', dueDate: 'Sep 15',
    milestones: [
      { label: 'Discovery', completed: true, current: false },
      { label: 'Planning', completed: true, current: false },
      { label: 'Development', completed: false, current: true },
      { label: 'Testing', completed: false, current: false },
      { label: 'Deployment', completed: false, current: false },
    ],
  },
  {
    id: 'pr-2', name: 'Katrina Fashion Website', companyName: 'Katrina Fashion Finds', projectManager: 'Alex Mugisha',
    teamMembers: ['Alex Mugisha', 'Sarah Birungi'],
    progress: 82, status: 'On Track', budget: 18000000, startDate: 'Feb 10', dueDate: 'Aug 15',
    milestones: [
      { label: 'Discovery', completed: true, current: false },
      { label: 'Planning', completed: true, current: false },
      { label: 'Development', completed: true, current: false },
      { label: 'Testing', completed: false, current: true },
      { label: 'Deployment', completed: false, current: false },
    ],
  },
  {
    id: 'pr-3', name: 'Amira Interiors Phase II', companyName: 'Amira Interiors', projectManager: 'Alex Mugisha',
    teamMembers: ['Alex Mugisha', 'David Okello', 'Grace Nakato', 'Sarah Birungi'],
    progress: 45, status: 'At Risk', budget: 12000000, startDate: 'Apr 5', dueDate: 'Oct 30',
    milestones: [
      { label: 'Discovery', completed: true, current: false },
      { label: 'Planning', completed: false, current: true },
      { label: 'Development', completed: false, current: false },
      { label: 'Testing', completed: false, current: false },
      { label: 'Deployment', completed: false, current: false },
    ],
  },
  {
    id: 'pr-4', name: 'Sparkles Salon Website', companyName: 'Sparkles Salon Uganda', projectManager: 'Sarah Birungi',
    teamMembers: ['Sarah Birungi', 'Grace Nakato'],
    progress: 28, status: 'Delayed', budget: 8500000, startDate: 'Jun 1', dueDate: 'Sep 1',
    milestones: [
      { label: 'Discovery', completed: true, current: false },
      { label: 'Planning', completed: false, current: true },
      { label: 'Development', completed: false, current: false },
      { label: 'Testing', completed: false, current: false },
      { label: 'Deployment', completed: false, current: false },
    ],
  },
  {
    id: 'pr-5', name: 'Verax Mobile Application', companyName: 'Verax', projectManager: 'Grace Nakato',
    teamMembers: ['Grace Nakato', 'David Okello'],
    progress: 55, status: 'On Track', budget: 8500000, startDate: 'May 15', dueDate: 'Nov 15',
    milestones: [
      { label: 'Discovery', completed: true, current: false },
      { label: 'Planning', completed: true, current: false },
      { label: 'Development', completed: false, current: true },
      { label: 'Testing', completed: false, current: false },
      { label: 'Deployment', completed: false, current: false },
    ],
  },
  {
    id: 'pr-6', name: 'StanChart Digital Platform', companyName: 'Standard Chartered Uganda', projectManager: 'Grace Nakato',
    teamMembers: ['Grace Nakato', 'Alex Mugisha', 'Sarah Birungi'],
    progress: 90, status: 'On Track', budget: 35000000, startDate: 'Jan 20', dueDate: 'Aug 1',
    milestones: [
      { label: 'Discovery', completed: true, current: false },
      { label: 'Planning', completed: true, current: false },
      { label: 'Development', completed: true, current: false },
      { label: 'Testing', completed: true, current: false },
      { label: 'Deployment', completed: false, current: true },
    ],
  },
  {
    id: 'pr-7', name: 'SafeBoda Fleet Expansion', companyName: 'SafeBoda', projectManager: 'Sarah Birungi',
    teamMembers: ['Sarah Birungi', 'David Okello'],
    progress: 100, status: 'Completed', budget: 22000000, startDate: 'Nov 1', dueDate: 'Jul 15',
    milestones: [
      { label: 'Discovery', completed: true, current: false },
      { label: 'Planning', completed: true, current: false },
      { label: 'Development', completed: true, current: false },
      { label: 'Testing', completed: true, current: false },
      { label: 'Deployment', completed: true, current: false },
    ],
  },
  {
    id: 'pr-8', name: 'Centenary Kiosk Platform', companyName: 'Centenary Bank', projectManager: 'Sarah Birungi',
    teamMembers: ['Sarah Birungi', 'Grace Nakato', 'Alex Mugisha'],
    progress: 38, status: 'At Risk', budget: 18500000, startDate: 'Mar 20', dueDate: 'Dec 1',
    milestones: [
      { label: 'Discovery', completed: true, current: false },
      { label: 'Planning', completed: true, current: false },
      { label: 'Development', completed: false, current: true },
      { label: 'Testing', completed: false, current: false },
      { label: 'Deployment', completed: false, current: false },
    ],
  },
  {
    id: 'pr-9', name: 'Togashi CRM Upgrade', companyName: 'Togashi Technologies', projectManager: 'Grace Nakato',
    teamMembers: ['Grace Nakato', 'Alex Mugisha', 'David Okello', 'Sarah Birungi'],
    progress: 72, status: 'On Track', budget: 15000000, startDate: 'Apr 10', dueDate: 'Aug 10',
    milestones: [
      { label: 'Discovery', completed: true, current: false },
      { label: 'Planning', completed: true, current: false },
      { label: 'Development', completed: true, current: false },
      { label: 'Testing', completed: false, current: true },
      { label: 'Deployment', completed: false, current: false },
    ],
  },
];

// ============================================================================
// QUOTATIONS
// ============================================================================

export type QuotationStatus = 'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Expired';

export interface QuotationLineItem {
  id: string;
  item: string;
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Quotation {
  id: string;
  number: string;
  title: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  companyName: string;
  description: string;
  amount: number;
  currency: 'UGX' | 'USD';
  status: QuotationStatus;
  issueDate: string;
  validUntil: string;
  lastUpdated: string;
  lineItems: QuotationLineItem[];
  discount: number;
  discountType: 'fixed' | 'percentage';
  tax: number;
  taxEnabled: boolean;
  subtotal: number;
  clientNote: string;
  paymentTerms: string;
  deliveryTimeline: string;
  quotationTerms: string;
  additionalConditions: string;
  relatedDealId?: string;
  relatedDealTitle?: string;
  relatedProjectId?: string;
  relatedProjectName?: string;
  initials: string;
}

export interface QuotationStats {
  total: number;
  pendingApproval: number;
  accepted: number;
  expired: number;
}

export const quotationStats: QuotationStats = {
  total: 9,
  pendingApproval: 3,
  accepted: 2,
  expired: 1,
};

export const quotations: Quotation[] = [
  {
    id: 'qtn-1',
    number: 'TGL-QTN-2026-001',
    title: 'Katrina Fashion Website Development',
    contactName: 'Grace Namugenyi',
    contactEmail: 'grace.nam@email.com',
    contactPhone: '+256 774 500 600',
    companyName: 'Katrina Fashion Finds',
    description: 'Full e-commerce website with product catalogue, payment integration, and order management.',
    amount: 18000000,
    currency: 'UGX',
    status: 'Accepted',
    issueDate: 'Mar 10, 2026',
    validUntil: 'Apr 10, 2026',
    lastUpdated: 'Mar 18, 2026',
    lineItems: [
      { id: 'li-1', item: 'UI/UX Design', description: 'Wireframes, prototypes, and visual design for all pages', quantity: 1, unitPrice: 5000000, lineTotal: 5000000 },
      { id: 'li-2', item: 'Frontend Development', description: 'React-based responsive frontend with Tailwind CSS', quantity: 1, unitPrice: 7000000, lineTotal: 7000000 },
      { id: 'li-3', item: 'Backend & CMS Integration', description: 'API development and content management setup', quantity: 1, unitPrice: 4000000, lineTotal: 4000000 },
    ],
    discount: 0,
    discountType: 'fixed',
    tax: 2000000,
    taxEnabled: true,
    subtotal: 16000000,
    clientNote: 'We look forward to working with Katrina Fashion Finds on this exciting e-commerce project.',
    paymentTerms: '50% deposit before work begins and the remaining balance upon completion or agreed project milestone.',
    deliveryTimeline: '12 weeks from project kick-off',
    quotationTerms: 'This quotation is valid for 30 days from the issue date. Prices are subject to change after the validity period. Any additional features requested beyond the scope will be quoted separately.',
    additionalConditions: 'Client to provide all brand assets, product images, and content within 2 weeks of project commencement.',
    relatedDealId: 'dl-1',
    relatedDealTitle: 'Katrina Fashion Website',
    initials: 'KF',
  },
  {
    id: 'qtn-2',
    number: 'TGL-QTN-2026-002',
    title: 'Sparkles Salon Website Upgrade',
    contactName: 'John Mukasa',
    contactEmail: 'john.mukasa@email.com',
    contactPhone: '+256 701 200 300',
    companyName: 'Sparkles Salon Uganda',
    description: 'Website redesign with online booking system, service catalogue, and customer portal.',
    amount: 8500000,
    currency: 'UGX',
    status: 'Sent',
    issueDate: 'Jun 15, 2026',
    validUntil: 'Jul 15, 2026',
    lastUpdated: 'Jun 15, 2026',
    lineItems: [
      { id: 'li-4', item: 'Website Redesign', description: 'Complete visual overhaul of existing website', quantity: 1, unitPrice: 4000000, lineTotal: 4000000 },
      { id: 'li-5', item: 'Online Booking System', description: 'Appointment scheduling and management portal', quantity: 1, unitPrice: 3000000, lineTotal: 3000000 },
      { id: 'li-6', item: 'Customer Portal', description: 'Client login, booking history, and loyalty tracking', quantity: 1, unitPrice: 1500000, lineTotal: 1500000 },
    ],
    discount: 0,
    discountType: 'fixed',
    tax: 0,
    taxEnabled: false,
    subtotal: 8500000,
    clientNote: 'This quotation covers a full upgrade of the Sparkles Salon digital presence.',
    paymentTerms: '50% deposit before work begins and the remaining balance upon completion or agreed project milestone.',
    deliveryTimeline: '8 weeks from project kick-off',
    quotationTerms: 'This quotation is valid for 30 days from the issue date.',
    additionalConditions: '',
    relatedDealId: 'dl-3',
    relatedDealTitle: 'Sparkles Salon Website',
    initials: 'SS',
  },
  {
    id: 'qtn-3',
    number: 'TGL-QTN-2026-003',
    title: 'Standard Chartered Digital Business Cards',
    contactName: 'Esther Auma',
    contactEmail: 'esther.a@email.com',
    contactPhone: '+256 785 500 900',
    companyName: 'Standard Chartered Uganda',
    description: 'Digital business card platform with NFC integration, analytics, and team management.',
    amount: 32000000,
    currency: 'UGX',
    status: 'Draft',
    issueDate: 'Jul 20, 2026',
    validUntil: 'Aug 20, 2026',
    lastUpdated: 'Jul 22, 2026',
    lineItems: [
      { id: 'li-7', item: 'Platform Development', description: 'Web and mobile-responsive digital card platform', quantity: 1, unitPrice: 15000000, lineTotal: 15000000 },
      { id: 'li-8', item: 'NFC Integration', description: 'NFC tag provisioning and card writing system', quantity: 1, unitPrice: 8000000, lineTotal: 8000000 },
      { id: 'li-9', item: 'Analytics Dashboard', description: 'Real-time card view and scan analytics', quantity: 1, unitPrice: 6000000, lineTotal: 6000000 },
      { id: 'li-10', item: 'Team Management', description: 'Multi-user access with role-based permissions', quantity: 1, unitPrice: 3000000, lineTotal: 3000000 },
    ],
    discount: 0,
    discountType: 'fixed',
    tax: 0,
    taxEnabled: false,
    subtotal: 32000000,
    clientNote: '',
    paymentTerms: '50% deposit before work begins and the remaining balance upon completion or agreed project milestone.',
    deliveryTimeline: '16 weeks from project kick-off',
    quotationTerms: 'This quotation is valid for 30 days from the issue date.',
    additionalConditions: 'NFC cards hardware cost not included. Client to procure NFC cards separately.',
    initials: 'SC',
  },
  {
    id: 'qtn-4',
    number: 'TGL-QTN-2026-004',
    title: 'Amira Interiors Visualisation Platform',
    contactName: 'Sarah Achieng',
    contactEmail: 'sarah.achieng@email.com',
    contactPhone: '+256 772 100 200',
    companyName: 'Amira Interiors',
    description: '3D interior visualisation platform for client presentations with virtual walkthroughs.',
    amount: 45000000,
    currency: 'UGX',
    status: 'Sent',
    issueDate: 'May 1, 2026',
    validUntil: 'May 31, 2026',
    lastUpdated: 'May 5, 2026',
    lineItems: [
      { id: 'li-11', item: '3D Rendering Engine', description: 'Real-time 3D rendering with WebGL integration', quantity: 1, unitPrice: 20000000, lineTotal: 20000000 },
      { id: 'li-12', item: 'Virtual Walkthrough', description: 'Interactive 360-degree virtual tour system', quantity: 1, unitPrice: 12000000, lineTotal: 12000000 },
      { id: 'li-13', item: 'Asset Library', description: 'Furniture and material catalogue with drag-and-drop', quantity: 1, unitPrice: 8000000, lineTotal: 8000000 },
      { id: 'li-14', item: 'Client Portal', description: 'Project sharing and feedback collection system', quantity: 1, unitPrice: 5000000, lineTotal: 5000000 },
    ],
    discount: 0,
    discountType: 'fixed',
    tax: 0,
    taxEnabled: false,
    subtotal: 45000000,
    clientNote: 'This platform will revolutionise how Amira Interiors presents designs to clients.',
    paymentTerms: '50% deposit before work begins and the remaining balance upon completion or agreed project milestone.',
    deliveryTimeline: '20 weeks from project kick-off',
    quotationTerms: 'This quotation is valid for 30 days from the issue date.',
    additionalConditions: '',
    relatedDealId: 'dl-4',
    relatedDealTitle: 'Amira Interiors Phase Two',
    initials: 'AI',
  },
  {
    id: 'qtn-5',
    number: 'TGL-QTN-2026-005',
    title: 'Verax Mobile Application',
    contactName: 'Peter Okot',
    contactEmail: 'peter.okot@email.com',
    contactPhone: '+256 753 400 500',
    companyName: 'Verax',
    description: 'Cross-platform mobile application for service delivery tracking and customer engagement.',
    amount: 25000000,
    currency: 'UGX',
    status: 'Sent',
    issueDate: 'Jul 5, 2026',
    validUntil: 'Aug 5, 2026',
    lastUpdated: 'Jul 12, 2026',
    lineItems: [
      { id: 'li-15', item: 'Mobile App Development', description: 'React Native cross-platform application (iOS & Android)', quantity: 1, unitPrice: 15000000, lineTotal: 15000000 },
      { id: 'li-16', item: 'Backend API', description: 'REST API with real-time notifications and data sync', quantity: 1, unitPrice: 7000000, lineTotal: 7000000 },
      { id: 'li-17', item: 'Admin Dashboard', description: 'Web-based admin panel for content and user management', quantity: 1, unitPrice: 3000000, lineTotal: 3000000 },
    ],
    discount: 0,
    discountType: 'fixed',
    tax: 0,
    taxEnabled: false,
    subtotal: 25000000,
    clientNote: '',
    paymentTerms: '50% deposit before work begins and the remaining balance upon completion or agreed project milestone.',
    deliveryTimeline: '14 weeks from project kick-off',
    quotationTerms: 'This quotation is valid for 30 days from the issue date.',
    additionalConditions: '',
    initials: 'VX',
  },
  {
    id: 'qtn-6',
    number: 'TGL-QTN-2026-006',
    title: 'Ellipse Enterprise Platform',
    contactName: 'Maria Nalubega',
    contactEmail: 'maria.nalubega@email.com',
    contactPhone: '+256 782 300 400',
    companyName: 'Ellipse',
    description: 'Enterprise resource planning platform with financial modules, HR, and inventory management.',
    amount: 55000000,
    currency: 'UGX',
    status: 'Accepted',
    issueDate: 'Feb 1, 2026',
    validUntil: 'Mar 1, 2026',
    lastUpdated: 'Feb 20, 2026',
    lineItems: [
      { id: 'li-18', item: 'Core ERP Platform', description: 'Modular enterprise platform with role-based access', quantity: 1, unitPrice: 25000000, lineTotal: 25000000 },
      { id: 'li-19', item: 'Financial Module', description: 'Accounting, invoicing, and financial reporting', quantity: 1, unitPrice: 12000000, lineTotal: 12000000 },
      { id: 'li-20', item: 'HR Module', description: 'Employee management, payroll, and leave tracking', quantity: 1, unitPrice: 10000000, lineTotal: 10000000 },
      { id: 'li-21', item: 'Inventory Module', description: 'Stock management and procurement workflows', quantity: 1, unitPrice: 8000000, lineTotal: 8000000 },
    ],
    discount: 0,
    discountType: 'fixed',
    tax: 0,
    taxEnabled: false,
    subtotal: 55000000,
    clientNote: 'Ellipse Enterprise Platform will replace their legacy systems across all departments.',
    paymentTerms: '50% deposit before work begins and the remaining balance upon completion or agreed project milestone.',
    deliveryTimeline: '24 weeks from project kick-off',
    quotationTerms: 'This quotation is valid for 30 days from the issue date.',
    additionalConditions: '',
    relatedDealId: 'dl-2',
    relatedDealTitle: 'Ellipse Enterprise Partnership',
    relatedProjectId: 'pr-1',
    relatedProjectName: 'Ellipse Enterprise Platform',
    initials: 'EP',
  },
  {
    id: 'qtn-7',
    number: 'TGL-QTN-2026-007',
    title: 'SafeBoda Fleet Management System',
    contactName: 'Michael Wasswa',
    contactEmail: 'michael.w@email.com',
    contactPhone: '+256 703 110 220',
    companyName: 'SafeBoda',
    description: 'Fleet management dashboard with real-time GPS tracking, driver analytics, and maintenance scheduling.',
    amount: 22000000,
    currency: 'UGX',
    status: 'Rejected',
    issueDate: 'Apr 15, 2026',
    validUntil: 'May 15, 2026',
    lastUpdated: 'May 2, 2026',
    lineItems: [
      { id: 'li-22', item: 'GPS Tracking System', description: 'Real-time location tracking and route optimisation', quantity: 1, unitPrice: 10000000, lineTotal: 10000000 },
      { id: 'li-23', item: 'Driver Analytics', description: 'Performance metrics and driver scoring system', quantity: 1, unitPrice: 7000000, lineTotal: 7000000 },
      { id: 'li-24', item: 'Maintenance Module', description: 'Vehicle maintenance scheduling and alerts', quantity: 1, unitPrice: 5000000, lineTotal: 5000000 },
    ],
    discount: 0,
    discountType: 'fixed',
    tax: 0,
    taxEnabled: false,
    subtotal: 22000000,
    clientNote: '',
    paymentTerms: '50% deposit before work begins and the remaining balance upon completion or agreed project milestone.',
    deliveryTimeline: '16 weeks from project kick-off',
    quotationTerms: 'This quotation is valid for 30 days from the issue date.',
    additionalConditions: '',
    initials: 'SB',
  },
  {
    id: 'qtn-8',
    number: 'TGL-QTN-2026-008',
    title: 'MTN Uganda Self-Service Portal',
    contactName: 'Jane Kisakye',
    contactEmail: 'jane.kisakye@email.com',
    contactPhone: '+256 785 700 800',
    companyName: 'MTN Uganda',
    description: 'Customer self-service portal with account management, bill payment, and service requests.',
    amount: 55000000,
    currency: 'UGX',
    status: 'Draft',
    issueDate: 'Jul 18, 2026',
    validUntil: 'Aug 18, 2026',
    lastUpdated: 'Jul 24, 2026',
    lineItems: [
      { id: 'li-25', item: 'Portal Frontend', description: 'Responsive web portal with mobile-first design', quantity: 1, unitPrice: 18000000, lineTotal: 18000000 },
      { id: 'li-26', item: 'Backend Integration', description: 'Integration with MTN core billing and CRM systems', quantity: 1, unitPrice: 22000000, lineTotal: 22000000 },
      { id: 'li-27', item: 'Payment Gateway', description: 'Mobile money and bank payment integration', quantity: 1, unitPrice: 10000000, lineTotal: 10000000 },
      { id: 'li-28', item: 'Support Ticketing', description: 'Customer service request and tracking system', quantity: 1, unitPrice: 5000000, lineTotal: 5000000 },
    ],
    discount: 0,
    discountType: 'fixed',
    tax: 0,
    taxEnabled: false,
    subtotal: 55000000,
    clientNote: '',
    paymentTerms: '50% deposit before work begins and the remaining balance upon completion or agreed project milestone.',
    deliveryTimeline: '18 weeks from project kick-off',
    quotationTerms: 'This quotation is valid for 30 days from the issue date.',
    additionalConditions: 'MTN to provide API access and test environment credentials within 1 week of project commencement.',
    initials: 'MT',
  },
  {
    id: 'qtn-9',
    number: 'TGL-QTN-2026-009',
    title: 'Crown Beverages Distributor Portal',
    contactName: 'Monica Birungi',
    contactEmail: 'monica.b@email.com',
    contactPhone: '+256 771 100 200',
    companyName: 'Crown Beverages',
    description: 'Distributor management portal with order processing, inventory tracking, and sales reporting.',
    amount: 22000000,
    currency: 'UGX',
    status: 'Expired',
    issueDate: 'Jan 10, 2026',
    validUntil: 'Feb 10, 2026',
    lastUpdated: 'Feb 12, 2026',
    lineItems: [
      { id: 'li-29', item: 'Distributor Portal', description: 'Web-based distributor order and management system', quantity: 1, unitPrice: 12000000, lineTotal: 12000000 },
      { id: 'li-30', item: 'Inventory Tracking', description: 'Real-time stock level monitoring and alerts', quantity: 1, unitPrice: 6000000, lineTotal: 6000000 },
      { id: 'li-31', item: 'Sales Reporting', description: 'Automated sales reports and analytics dashboard', quantity: 1, unitPrice: 4000000, lineTotal: 4000000 },
    ],
    discount: 0,
    discountType: 'fixed',
    tax: 0,
    taxEnabled: false,
    subtotal: 22000000,
    clientNote: '',
    paymentTerms: '50% deposit before work begins and the remaining balance upon completion or agreed project milestone.',
    deliveryTimeline: '10 weeks from project kick-off',
    quotationTerms: 'This quotation is valid for 30 days from the issue date.',
    additionalConditions: '',
    initials: 'CV',
  },
];

// ============================================================================
// INVOICES
// ============================================================================

export type InvoiceStatus = 'Draft' | 'Sent' | 'Partially Paid' | 'Paid' | 'Overdue' | 'Cancelled';
export type PaymentMethod = 'Bank Transfer' | 'Mobile Money' | 'Cash' | 'Cheque' | 'Other';
export type InvoiceType = 'Deposit' | 'Milestone' | 'Final' | 'Maintenance' | 'Other';

export interface InvoiceLineItem {
  id: string;
  item: string;
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface InvoicePayment {
  id: string;
  date: string;
  amount: number;
  method: PaymentMethod;
  reference: string;
  notes: string;
}

export interface Invoice {
  id: string;
  number: string;
  title: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  companyName: string;
  billingAddress: string;
  description: string;
  total: number;
  amountPaid: number;
  balance: number;
  currency: 'UGX' | 'USD';
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  lastUpdated: string;
  lineItems: InvoiceLineItem[];
  discount: number;
  discountType: 'fixed' | 'percentage';
  tax: number;
  taxEnabled: boolean;
  subtotal: number;
  paymentTerms: string;
  clientNote: string;
  internalNote: string;
  paymentInstructions: string;
  additionalConditions: string;
  relatedQuotationId?: string;
  relatedQuotationNumber?: string;
  relatedDealId?: string;
  relatedDealTitle?: string;
  relatedProjectId?: string;
  relatedProjectName?: string;
  purchaseOrderNumber?: string;
  invoiceType?: InvoiceType;
  payments: InvoicePayment[];
  initials: string;
}

export interface InvoiceStats {
  totalInvoiced: number;
  amountPaid: number;
  amountDue: number;
  overdueAmount: number;
}

export const invoiceStats: InvoiceStats = {
  totalInvoiced: 112300000,
  amountPaid: 51600000,
  amountDue: 53700000,
  overdueAmount: 18500000,
};

export const invoices: Invoice[] = [
  {
    id: 'inv-1',
    number: 'TGL-INV-2026-001',
    title: 'Katrina Fashion Website — Deposit',
    contactName: 'Grace Namugenyi',
    contactEmail: 'grace.nam@email.com',
    contactPhone: '+256 774 500 600',
    companyName: 'Katrina Fashion Finds',
    billingAddress: 'Plot 45, Ntinda Complex, Kampala, Uganda',
    description: '50% deposit for the e-commerce website development project as per quotation TGL-QTN-2026-001.',
    total: 9000000,
    amountPaid: 9000000,
    balance: 0,
    currency: 'UGX',
    status: 'Paid',
    issueDate: 'Mar 20, 2026',
    dueDate: 'Apr 4, 2026',
    lastUpdated: 'Mar 28, 2026',
    lineItems: [
      { id: 'ivli-1', item: 'UI/UX Design (Deposit)', description: '50% deposit for wireframes, prototypes and visual design', quantity: 1, unitPrice: 2500000, lineTotal: 2500000 },
      { id: 'ivli-2', item: 'Frontend Development (Deposit)', description: '50% deposit for React-based responsive frontend', quantity: 1, unitPrice: 3500000, lineTotal: 3500000 },
      { id: 'ivli-3', item: 'Backend & CMS (Deposit)', description: '50% deposit for API development and CMS setup', quantity: 1, unitPrice: 2000000, lineTotal: 2000000 },
    ],
    discount: 0,
    discountType: 'fixed',
    tax: 1000000,
    taxEnabled: true,
    subtotal: 8000000,
    paymentTerms: 'Payment is due by the stated due date. Please include the invoice number as the payment reference.',
    clientNote: 'Thank you for your prompt payment. We look forward to delivering this exciting project.',
    internalNote: 'Deposit invoice. Remaining 50% to be invoiced upon completion.',
    paymentInstructions: 'Bank: Stanbic Bank Uganda | Account: 9030012345678 | Account Name: Togashi Technologies Ltd',
    additionalConditions: '',
    relatedQuotationId: 'qtn-1',
    relatedQuotationNumber: 'TGL-QTN-2026-001',
    relatedDealId: 'dl-1',
    relatedDealTitle: 'Katrina Fashion Website',
    invoiceType: 'Deposit',
    payments: [
      { id: 'pay-1', date: 'Mar 28, 2026', amount: 9000000, method: 'Bank Transfer', reference: 'STB-TRF-20260328-001', notes: 'Full deposit payment received.' },
    ],
    initials: 'KF',
  },
  {
    id: 'inv-2',
    number: 'TGL-INV-2026-002',
    title: 'Ellipse Enterprise Platform — Milestone 1',
    contactName: 'Maria Nalubega',
    contactEmail: 'maria.nalubega@email.com',
    contactPhone: '+256 782 300 400',
    companyName: 'Ellipse',
    billingAddress: 'Plot 12, Acacia Avenue, Kololo, Kampala, Uganda',
    description: 'First milestone payment for the ERP platform — Core Platform and Financial Module as per quotation TGL-QTN-2026-006.',
    total: 37000000,
    amountPaid: 25000000,
    balance: 12000000,
    currency: 'UGX',
    status: 'Partially Paid',
    issueDate: 'Mar 5, 2026',
    dueDate: 'Apr 5, 2026',
    lastUpdated: 'Mar 15, 2026',
    lineItems: [
      { id: 'ivli-4', item: 'Core ERP Platform (Milestone 1)', description: 'First milestone for modular enterprise platform', quantity: 1, unitPrice: 25000000, lineTotal: 25000000 },
      { id: 'ivli-5', item: 'Financial Module (Milestone 1)', description: 'First milestone for accounting and invoicing module', quantity: 1, unitPrice: 12000000, lineTotal: 12000000 },
    ],
    discount: 0,
    discountType: 'fixed',
    tax: 0,
    taxEnabled: false,
    subtotal: 37000000,
    paymentTerms: 'Payment is due by the stated due date. Please include the invoice number as the payment reference.',
    clientNote: 'Milestone 1 includes the core platform architecture and financial module foundation.',
    internalNote: 'Ellipse has paid 25M of 37M. Remaining 12M due.',
    paymentInstructions: 'Bank: Stanbic Bank Uganda | Account: 9030012345678 | Account Name: Togashi Technologies Ltd',
    additionalConditions: '',
    relatedQuotationId: 'qtn-6',
    relatedQuotationNumber: 'TGL-QTN-2026-006',
    relatedDealId: 'dl-2',
    relatedDealTitle: 'Ellipse Enterprise Partnership',
    relatedProjectId: 'pr-1',
    relatedProjectName: 'Ellipse Enterprise Platform',
    invoiceType: 'Milestone',
    payments: [
      { id: 'pay-2', date: 'Mar 15, 2026', amount: 25000000, method: 'Bank Transfer', reference: 'ELP-TRF-20260315-001', notes: 'Partial milestone payment received.' },
    ],
    initials: 'EP',
  },
  {
    id: 'inv-3',
    number: 'TGL-INV-2026-003',
    title: 'Sparkles Salon Website Upgrade — Deposit',
    contactName: 'John Mukasa',
    contactEmail: 'john.mukasa@email.com',
    contactPhone: '+256 701 200 300',
    companyName: 'Sparkles Salon Uganda',
    billingAddress: 'Plot 78, Buganda Road, Kampala, Uganda',
    description: '50% deposit for the website upgrade project as per quotation TGL-QTN-2026-002.',
    total: 4250000,
    amountPaid: 0,
    balance: 4250000,
    currency: 'UGX',
    status: 'Sent',
    issueDate: 'Jun 20, 2026',
    dueDate: 'Jul 20, 2026',
    lastUpdated: 'Jun 20, 2026',
    lineItems: [
      { id: 'ivli-6', item: 'Website Redesign (Deposit)', description: '50% deposit for complete visual overhaul', quantity: 1, unitPrice: 2000000, lineTotal: 2000000 },
      { id: 'ivli-7', item: 'Online Booking System (Deposit)', description: '50% deposit for appointment scheduling system', quantity: 1, unitPrice: 1500000, lineTotal: 1500000 },
      { id: 'ivli-8', item: 'Customer Portal (Deposit)', description: '50% deposit for client login and loyalty tracking', quantity: 1, unitPrice: 750000, lineTotal: 750000 },
    ],
    discount: 0,
    discountType: 'fixed',
    tax: 0,
    taxEnabled: false,
    subtotal: 4250000,
    paymentTerms: 'Payment is due by the stated due date. Please include the invoice number as the payment reference.',
    clientNote: 'Please process this deposit at your earliest convenience to secure the project start date.',
    internalNote: '',
    paymentInstructions: 'Bank: Stanbic Bank Uganda | Account: 9030012345678 | Account Name: Togashi Technologies Ltd',
    additionalConditions: '',
    relatedQuotationId: 'qtn-2',
    relatedQuotationNumber: 'TGL-QTN-2026-002',
    relatedDealId: 'dl-3',
    relatedDealTitle: 'Sparkles Salon Website',
    invoiceType: 'Deposit',
    payments: [],
    initials: 'SS',
  },
  {
    id: 'inv-4',
    number: 'TGL-INV-2026-004',
    title: 'Amira Interiors Visualisation — Milestone 2',
    contactName: 'Sarah Achieng',
    contactEmail: 'sarah.achieng@email.com',
    contactPhone: '+256 772 100 200',
    companyName: 'Amira Interiors',
    billingAddress: 'Plot 89, Industrial Area, Nairobi, Kenya',
    description: 'Second milestone payment for the 3D visualisation platform — Virtual Walkthrough and Asset Library as per quotation TGL-QTN-2026-004.',
    total: 20000000,
    amountPaid: 12000000,
    balance: 8000000,
    currency: 'UGX',
    status: 'Partially Paid',
    issueDate: 'Jun 1, 2026',
    dueDate: 'Jul 1, 2026',
    lastUpdated: 'Jun 10, 2026',
    lineItems: [
      { id: 'ivli-9', item: 'Virtual Walkthrough (Milestone 2)', description: 'Second milestone for interactive 360-degree virtual tours', quantity: 1, unitPrice: 12000000, lineTotal: 12000000 },
      { id: 'ivli-10', item: 'Asset Library (Milestone 2)', description: 'Second milestone for furniture and material catalogue', quantity: 1, unitPrice: 8000000, lineTotal: 8000000 },
    ],
    discount: 0,
    discountType: 'fixed',
    tax: 0,
    taxEnabled: false,
    subtotal: 20000000,
    paymentTerms: 'Payment is due by the stated due date. Please include the invoice number as the payment reference.',
    clientNote: 'Milestone 2 covers the virtual walkthrough and asset library modules.',
    internalNote: 'Amira has paid 12M. 8M remaining. Follow up before due date.',
    paymentInstructions: 'Bank: Stanbic Bank Uganda | Account: 9030012345678 | Account Name: Togashi Technologies Ltd',
    additionalConditions: '',
    relatedQuotationId: 'qtn-4',
    relatedQuotationNumber: 'TGL-QTN-2026-004',
    relatedDealId: 'dl-4',
    relatedDealTitle: 'Amira Interiors Phase Two',
    invoiceType: 'Milestone',
    payments: [
      { id: 'pay-3', date: 'Jun 10, 2026', amount: 12000000, method: 'Mobile Money', reference: 'MM-AI-20260610-001', notes: 'Partial milestone payment via mobile money.' },
    ],
    initials: 'AI',
  },
  {
    id: 'inv-5',
    number: 'TGL-INV-2026-005',
    title: 'Standard Chartered Digital Cards — Full Project',
    contactName: 'Esther Auma',
    contactEmail: 'esther.a@email.com',
    contactPhone: '+256 785 500 900',
    companyName: 'Standard Chartered Uganda',
    billingAddress: 'Plot 5, Speke Road, Kampala, Uganda',
    description: 'Full project invoice for the digital business card platform as per quotation TGL-QTN-2026-003.',
    total: 32000000,
    amountPaid: 0,
    balance: 32000000,
    currency: 'UGX',
    status: 'Draft',
    issueDate: 'Jul 24, 2026',
    dueDate: 'Aug 24, 2026',
    lastUpdated: 'Jul 24, 2026',
    lineItems: [
      { id: 'ivli-11', item: 'Platform Development', description: 'Web and mobile-responsive digital card platform', quantity: 1, unitPrice: 15000000, lineTotal: 15000000 },
      { id: 'ivli-12', item: 'NFC Integration', description: 'NFC tag provisioning and card writing system', quantity: 1, unitPrice: 8000000, lineTotal: 8000000 },
      { id: 'ivli-13', item: 'Analytics Dashboard', description: 'Real-time card view and scan analytics', quantity: 1, unitPrice: 6000000, lineTotal: 6000000 },
      { id: 'ivli-14', item: 'Team Management', description: 'Multi-user access with role-based permissions', quantity: 1, unitPrice: 3000000, lineTotal: 3000000 },
    ],
    discount: 0,
    discountType: 'fixed',
    tax: 0,
    taxEnabled: false,
    subtotal: 32000000,
    paymentTerms: 'Payment is due by the stated due date. Please include the invoice number as the payment reference.',
    clientNote: '',
    internalNote: 'Invoice prepared but not yet sent. Awaiting final approval on quotation.',
    paymentInstructions: 'Bank: Stanbic Bank Uganda | Account: 9030012345678 | Account Name: Togashi Technologies Ltd',
    additionalConditions: '',
    relatedQuotationId: 'qtn-3',
    relatedQuotationNumber: 'TGL-QTN-2026-003',
    invoiceType: 'Other',
    payments: [],
    initials: 'SC',
  },
  {
    id: 'inv-6',
    number: 'TGL-INV-2026-006',
    title: 'Verax Mobile Application — Full Project',
    contactName: 'Peter Okot',
    contactEmail: 'peter.okot@email.com',
    contactPhone: '+256 753 400 500',
    companyName: 'Verax',
    billingAddress: 'Plot 34, Clement Hill Road, Kampala, Uganda',
    description: 'Full project invoice for the cross-platform mobile application as per quotation TGL-QTN-2026-005.',
    total: 25000000,
    amountPaid: 0,
    balance: 25000000,
    currency: 'UGX',
    status: 'Sent',
    issueDate: 'Jul 10, 2026',
    dueDate: 'Aug 10, 2026',
    lastUpdated: 'Jul 12, 2026',
    lineItems: [
      { id: 'ivli-15', item: 'Mobile App Development', description: 'React Native cross-platform application (iOS & Android)', quantity: 1, unitPrice: 15000000, lineTotal: 15000000 },
      { id: 'ivli-16', item: 'Backend API', description: 'REST API with real-time notifications and data sync', quantity: 1, unitPrice: 7000000, lineTotal: 7000000 },
      { id: 'ivli-17', item: 'Admin Dashboard', description: 'Web-based admin panel for content and user management', quantity: 1, unitPrice: 3000000, lineTotal: 3000000 },
    ],
    discount: 0,
    discountType: 'fixed',
    tax: 0,
    taxEnabled: false,
    subtotal: 25000000,
    paymentTerms: 'Payment is due by the stated due date. Please include the invoice number as the payment reference.',
    clientNote: 'We appreciate your business and look forward to delivering this application.',
    internalNote: '',
    paymentInstructions: 'Bank: Stanbic Bank Uganda | Account: 9030012345678 | Account Name: Togashi Technologies Ltd',
    additionalConditions: '',
    relatedQuotationId: 'qtn-5',
    relatedQuotationNumber: 'TGL-QTN-2026-005',
    invoiceType: 'Other',
    payments: [],
    initials: 'VX',
  },
  {
    id: 'inv-7',
    number: 'TGL-INV-2026-007',
    title: 'StanChart Digital Platform — Final Invoice',
    contactName: 'Robert Tumusiime',
    contactEmail: 'robert.t@email.com',
    contactPhone: '+256 714 800 900',
    companyName: 'Standard Chartered Uganda',
    billingAddress: 'Plot 5, Speke Road, Kampala, Uganda',
    description: 'Final invoice for the digital platform project. Full project completion payment.',
    total: 35000000,
    amountPaid: 35000000,
    balance: 0,
    currency: 'UGX',
    status: 'Paid',
    issueDate: 'Jul 5, 2026',
    dueDate: 'Aug 1, 2026',
    lastUpdated: 'Jul 18, 2026',
    lineItems: [
      { id: 'ivli-18', item: 'Digital Platform Development', description: 'Full platform implementation and deployment', quantity: 1, unitPrice: 28000000, lineTotal: 28000000 },
      { id: 'ivli-19', item: 'System Integration', description: 'Integration with existing banking systems', quantity: 1, unitPrice: 5000000, lineTotal: 5000000 },
      { id: 'ivli-20', item: 'Training & Handover', description: 'Staff training and documentation', quantity: 1, unitPrice: 2000000, lineTotal: 2000000 },
    ],
    discount: 0,
    discountType: 'fixed',
    tax: 0,
    taxEnabled: false,
    subtotal: 35000000,
    paymentTerms: 'Payment is due by the stated due date. Please include the invoice number as the payment reference.',
    clientNote: 'Thank you for partnering with Togashi Technologies. We trust the platform meets your expectations.',
    internalNote: 'Project complete. Invoice paid in full.',
    paymentInstructions: 'Bank: Stanbic Bank Uganda | Account: 9030012345678 | Account Name: Togashi Technologies Ltd',
    additionalConditions: '',
    relatedProjectId: 'pr-6',
    relatedProjectName: 'StanChart Digital Platform',
    invoiceType: 'Final',
    payments: [
      { id: 'pay-4', date: 'Jul 18, 2026', amount: 35000000, method: 'Bank Transfer', reference: 'SCB-TRF-20260718-001', notes: 'Full payment received.' },
    ],
    initials: 'SC',
  },
  {
    id: 'inv-8',
    number: 'TGL-INV-2026-008',
    title: 'MTN Uganda Self-Service Portal — Deposit',
    contactName: 'Jane Kisakye',
    contactEmail: 'jane.kisakye@email.com',
    contactPhone: '+256 785 700 800',
    companyName: 'MTN Uganda',
    billingAddress: 'Plot 69/71, Jinja Road, Kampala, Uganda',
    description: 'Deposit invoice for the customer self-service portal project as per quotation TGL-QTN-2026-008.',
    total: 27500000,
    amountPaid: 0,
    balance: 27500000,
    currency: 'UGX',
    status: 'Draft',
    issueDate: 'Jul 25, 2026',
    dueDate: 'Aug 25, 2026',
    lastUpdated: 'Jul 25, 2026',
    lineItems: [
      { id: 'ivli-21', item: 'Portal Frontend (Deposit)', description: '50% deposit for responsive web portal', quantity: 1, unitPrice: 9000000, lineTotal: 9000000 },
      { id: 'ivli-22', item: 'Backend Integration (Deposit)', description: '50% deposit for core billing system integration', quantity: 1, unitPrice: 11000000, lineTotal: 11000000 },
      { id: 'ivli-23', item: 'Payment Gateway (Deposit)', description: '50% deposit for mobile money integration', quantity: 1, unitPrice: 5000000, lineTotal: 5000000 },
      { id: 'ivli-24', item: 'Support Ticketing (Deposit)', description: '50% deposit for customer service system', quantity: 1, unitPrice: 2500000, lineTotal: 2500000 },
    ],
    discount: 0,
    discountType: 'fixed',
    tax: 0,
    taxEnabled: false,
    subtotal: 27500000,
    paymentTerms: 'Payment is due by the stated due date. Please include the invoice number as the payment reference.',
    clientNote: '',
    internalNote: 'Invoice still in draft. Pending management review before sending.',
    paymentInstructions: 'Bank: Stanbic Bank Uganda | Account: 9030012345678 | Account Name: Togashi Technologies Ltd',
    additionalConditions: '',
    relatedQuotationId: 'qtn-8',
    relatedQuotationNumber: 'TGL-QTN-2026-008',
    invoiceType: 'Deposit',
    payments: [],
    initials: 'MT',
  },
  {
    id: 'inv-9',
    number: 'TGL-INV-2026-009',
    title: 'Crown Beverages Distributor Portal — Full Project',
    contactName: 'Monica Birungi',
    contactEmail: 'monica.b@email.com',
    contactPhone: '+256 771 100 200',
    companyName: 'Crown Beverages',
    billingAddress: 'Plot 112/114, 6th Street, Industrial Area, Kampala, Uganda',
    description: 'Full project invoice for the distributor management portal as per quotation TGL-QTN-2026-009.',
    total: 22000000,
    amountPaid: 3500000,
    balance: 18500000,
    currency: 'UGX',
    status: 'Overdue',
    issueDate: 'Jan 15, 2026',
    dueDate: 'Feb 15, 2026',
    lastUpdated: 'Feb 12, 2026',
    lineItems: [
      { id: 'ivli-25', item: 'Distributor Portal', description: 'Web-based distributor order and management system', quantity: 1, unitPrice: 12000000, lineTotal: 12000000 },
      { id: 'ivli-26', item: 'Inventory Tracking', description: 'Real-time stock level monitoring and alerts', quantity: 1, unitPrice: 6000000, lineTotal: 6000000 },
      { id: 'ivli-27', item: 'Sales Reporting', description: 'Automated sales reports and analytics dashboard', quantity: 1, unitPrice: 4000000, lineTotal: 4000000 },
    ],
    discount: 0,
    discountType: 'fixed',
    tax: 0,
    taxEnabled: false,
    subtotal: 22000000,
    paymentTerms: 'Payment is due by the stated due date. Please include the invoice number as the payment reference.',
    clientNote: 'This invoice is now overdue. Please arrange payment at your earliest convenience.',
    internalNote: 'Overdue by several months. Multiple reminders sent. Escalate if no response.',
    paymentInstructions: 'Bank: Stanbic Bank Uganda | Account: 9030012345678 | Account Name: Togashi Technologies Ltd',
    additionalConditions: 'Late payment may incur additional charges as per our terms.',
    relatedQuotationId: 'qtn-9',
    relatedQuotationNumber: 'TGL-QTN-2026-009',
    invoiceType: 'Final',
    payments: [
      { id: 'pay-5', date: 'Feb 5, 2026', amount: 3500000, method: 'Mobile Money', reference: 'MM-CB-20260205-001', notes: 'Partial payment received. Balance remains outstanding.' },
    ],
    initials: 'CV',
  },
  {
    id: 'inv-10',
    number: 'TGL-INV-2026-010',
    title: 'SafeBoda Fleet System — Deposit',
    contactName: 'Michael Wasswa',
    contactEmail: 'michael.w@email.com',
    contactPhone: '+256 703 110 220',
    companyName: 'SafeBoda',
    billingAddress: 'Plot 21, Kanjokya Street, Kampala, Uganda',
    description: 'Deposit invoice for the fleet management dashboard project.',
    total: 11000000,
    amountPaid: 11000000,
    balance: 0,
    currency: 'UGX',
    status: 'Cancelled',
    issueDate: 'Apr 16, 2026',
    dueDate: 'May 16, 2026',
    lastUpdated: 'May 3, 2026',
    lineItems: [
      { id: 'ivli-28', item: 'GPS Tracking System (Deposit)', description: '50% deposit for real-time location tracking', quantity: 1, unitPrice: 5000000, lineTotal: 5000000 },
      { id: 'ivli-29', item: 'Driver Analytics (Deposit)', description: '50% deposit for performance metrics system', quantity: 1, unitPrice: 3500000, lineTotal: 3500000 },
      { id: 'ivli-30', item: 'Maintenance Module (Deposit)', description: '50% deposit for vehicle maintenance tracking', quantity: 1, unitPrice: 2500000, lineTotal: 2500000 },
    ],
    discount: 0,
    discountType: 'fixed',
    tax: 0,
    taxEnabled: false,
    subtotal: 11000000,
    paymentTerms: 'Payment is due by the stated due date. Please include the invoice number as the payment reference.',
    clientNote: '',
    internalNote: 'Invoice cancelled after quotation was rejected by the client.',
    paymentInstructions: 'Bank: Stanbic Bank Uganda | Account: 9030012345678 | Account Name: Togashi Technologies Ltd',
    additionalConditions: '',
    relatedQuotationId: 'qtn-7',
    relatedQuotationNumber: 'TGL-QTN-2026-007',
    invoiceType: 'Deposit',
    payments: [],
    initials: 'SB',
  },
];

// ============================================================================
// RECEIPTS
// ============================================================================

export type ReceiptStatus = 'Issued' | 'Voided';
export type ReceiptPaymentMethod = 'Bank Transfer' | 'Mobile Money' | 'Cash' | 'Cheque' | 'Other';

export interface ReceiptVoidRecord {
  voidedAt: string;
  reason: string;
}

export interface Receipt {
  id: string;
  number: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  companyName: string;
  billingAddress: string;
  amount: number;
  currency: 'UGX' | 'USD';
  status: ReceiptStatus;
  issueDate: string;
  paymentDate: string;
  lastUpdated: string;
  paymentMethod: ReceiptPaymentMethod;
  paymentMethodDescription?: string;
  paymentReference: string;
  relatedInvoiceId?: string;
  relatedInvoiceNumber?: string;
  clientNote: string;
  internalNote: string;
  initials: string;
  voidRecord?: ReceiptVoidRecord;
}

export interface ReceiptStats {
  total: number;
  amountReceived: number;
  thisMonth: number;
  unlinked: number;
}

export const receiptStats: ReceiptStats = {
  total: 10,
  amountReceived: 97800000,
  thisMonth: 3,
  unlinked: 2,
};

export const receipts: Receipt[] = [
  {
    id: 'rct-1',
    number: 'TGL-RCT-2026-001',
    contactName: 'Grace Namugenyi',
    contactEmail: 'grace.nam@email.com',
    contactPhone: '+256 774 500 600',
    companyName: 'Katrina Fashion Finds',
    billingAddress: 'Plot 45, Ntinda Complex, Kampala, Uganda',
    amount: 9000000,
    currency: 'UGX',
    status: 'Issued',
    issueDate: 'Mar 28, 2026',
    paymentDate: 'Mar 28, 2026',
    lastUpdated: 'Mar 28, 2026',
    paymentMethod: 'Bank Transfer',
    paymentReference: 'STB-TRF-20260328-001',
    relatedInvoiceId: 'inv-1',
    relatedInvoiceNumber: 'TGL-INV-2026-001',
    clientNote: 'Thank you for your prompt payment.',
    internalNote: 'First deposit payment for Katrina Fashion Website.',
    initials: 'KF',
  },
  {
    id: 'rct-2',
    number: 'TGL-RCT-2026-002',
    contactName: 'Maria Nalubega',
    contactEmail: 'maria.nalubega@email.com',
    contactPhone: '+256 782 300 400',
    companyName: 'Ellipse',
    billingAddress: 'Plot 12, Acacia Avenue, Kololo, Kampala, Uganda',
    amount: 25000000,
    currency: 'UGX',
    status: 'Issued',
    issueDate: 'Mar 15, 2026',
    paymentDate: 'Mar 15, 2026',
    lastUpdated: 'Mar 15, 2026',
    paymentMethod: 'Bank Transfer',
    paymentReference: 'ELP-TRF-20260315-001',
    relatedInvoiceId: 'inv-2',
    relatedInvoiceNumber: 'TGL-INV-2026-002',
    clientNote: 'Partial milestone payment received.',
    internalNote: 'First milestone payment for Ellipse Enterprise Platform.',
    initials: 'EP',
  },
  {
    id: 'rct-3',
    number: 'TGL-RCT-2026-003',
    contactName: 'Sarah Achieng',
    contactEmail: 'sarah.achieng@email.com',
    contactPhone: '+256 772 100 200',
    companyName: 'Amira Interiors',
    billingAddress: 'Plot 89, Industrial Area, Nairobi, Kenya',
    amount: 12000000,
    currency: 'UGX',
    status: 'Issued',
    issueDate: 'Jun 10, 2026',
    paymentDate: 'Jun 10, 2026',
    lastUpdated: 'Jun 10, 2026',
    paymentMethod: 'Mobile Money',
    paymentReference: 'MM-AI-20260610-001',
    relatedInvoiceId: 'inv-4',
    relatedInvoiceNumber: 'TGL-INV-2026-004',
    clientNote: '',
    internalNote: 'Partial milestone payment via mobile money.',
    initials: 'AI',
  },
  {
    id: 'rct-4',
    number: 'TGL-RCT-2026-004',
    contactName: 'Robert Tumusiime',
    contactEmail: 'robert.t@email.com',
    contactPhone: '+256 714 800 900',
    companyName: 'Standard Chartered Uganda',
    billingAddress: 'Plot 5, Speke Road, Kampala, Uganda',
    amount: 35000000,
    currency: 'UGX',
    status: 'Issued',
    issueDate: 'Jul 18, 2026',
    paymentDate: 'Jul 18, 2026',
    lastUpdated: 'Jul 18, 2026',
    paymentMethod: 'Bank Transfer',
    paymentReference: 'SCB-TRF-20260718-001',
    relatedInvoiceId: 'inv-7',
    relatedInvoiceNumber: 'TGL-INV-2026-007',
    clientNote: 'Full project payment received. Project complete.',
    internalNote: 'Final payment for StanChart Digital Platform.',
    initials: 'SC',
  },
  {
    id: 'rct-5',
    number: 'TGL-RCT-2026-005',
    contactName: 'Monica Birungi',
    contactEmail: 'monica.b@email.com',
    contactPhone: '+256 771 100 200',
    companyName: 'Crown Beverages',
    billingAddress: 'Plot 112/114, 6th Street, Industrial Area, Kampala, Uganda',
    amount: 3500000,
    currency: 'UGX',
    status: 'Issued',
    issueDate: 'Feb 5, 2026',
    paymentDate: 'Feb 5, 2026',
    lastUpdated: 'Feb 5, 2026',
    paymentMethod: 'Mobile Money',
    paymentReference: 'MM-CB-20260205-001',
    relatedInvoiceId: 'inv-9',
    relatedInvoiceNumber: 'TGL-INV-2026-009',
    clientNote: 'Partial payment received. Balance remains outstanding.',
    internalNote: 'Partial payment for overdue Crown Beverages invoice.',
    initials: 'CV',
  },
  {
    id: 'rct-6',
    number: 'TGL-RCT-2026-006',
    contactName: 'Jane Kisakye',
    contactEmail: 'jane.kisakye@email.com',
    contactPhone: '+256 785 700 800',
    companyName: 'MTN Uganda',
    billingAddress: 'Plot 69/71, Jinja Road, Kampala, Uganda',
    amount: 15000000,
    currency: 'UGX',
    status: 'Issued',
    issueDate: 'Jul 22, 2026',
    paymentDate: 'Jul 22, 2026',
    lastUpdated: 'Jul 22, 2026',
    paymentMethod: 'Cheque',
    paymentReference: 'MTN-CHQ-20260722-001',
    relatedInvoiceId: '',
    relatedInvoiceNumber: '',
    clientNote: '',
    internalNote: 'Advance payment received. Invoice yet to be generated.',
    initials: 'MT',
  },
  {
    id: 'rct-7',
    number: 'TGL-RCT-2026-007',
    contactName: 'John Mukasa',
    contactEmail: 'john.mukasa@email.com',
    contactPhone: '+256 701 200 300',
    companyName: 'Sparkles Salon Uganda',
    billingAddress: 'Plot 78, Buganda Road, Kampala, Uganda',
    amount: 4250000,
    currency: 'UGX',
    status: 'Issued',
    issueDate: 'Jul 20, 2026',
    paymentDate: 'Jul 20, 2026',
    lastUpdated: 'Jul 20, 2026',
    paymentMethod: 'Cash',
    paymentReference: '',
    relatedInvoiceId: 'inv-3',
    relatedInvoiceNumber: 'TGL-INV-2026-003',
    clientNote: 'Cash payment collected in person.',
    internalNote: 'Full deposit collected in cash at client meeting.',
    initials: 'SS',
  },
  {
    id: 'rct-8',
    number: 'TGL-RCT-2026-008',
    contactName: 'Peter Okot',
    contactEmail: 'peter.okot@email.com',
    contactPhone: '+256 753 400 500',
    companyName: 'Verax',
    billingAddress: 'Plot 34, Clement Hill Road, Kampala, Uganda',
    amount: 5000000,
    currency: 'UGX',
    status: 'Voided',
    issueDate: 'Jun 30, 2026',
    paymentDate: 'Jun 30, 2026',
    lastUpdated: 'Jul 1, 2026',
    paymentMethod: 'Bank Transfer',
    paymentReference: 'VX-TRF-20260630-ERR',
    relatedInvoiceId: 'inv-6',
    relatedInvoiceNumber: 'TGL-INV-2026-006',
    clientNote: '',
    internalNote: 'Incorrect amount recorded. Voided and re-issued.',
    initials: 'VX',
    voidRecord: { voidedAt: 'Jul 1, 2026', reason: 'Incorrect payment amount. Correct amount should have been recorded separately.' },
  },
  {
    id: 'rct-9',
    number: 'TGL-RCT-2026-009',
    contactName: 'David Ssempijja',
    contactEmail: 'david.ssemp@email.com',
    contactPhone: '+256 702 600 700',
    companyName: 'Uganda Breweries',
    billingAddress: 'Plot 56, Port Bell Road, Luzira, Kampala, Uganda',
    amount: 12000000,
    currency: 'UGX',
    status: 'Issued',
    issueDate: 'Jul 24, 2026',
    paymentDate: 'Jul 23, 2026',
    lastUpdated: 'Jul 24, 2026',
    paymentMethod: 'Bank Transfer',
    paymentReference: 'UBL-TRF-20260723-001',
    relatedInvoiceId: '',
    relatedInvoiceNumber: '',
    clientNote: 'Advance payment for upcoming procurement portal project.',
    internalNote: 'New client. Payment received before formal contract. Invoice to be created.',
    initials: 'UB',
  },
  {
    id: 'rct-10',
    number: 'TGL-RCT-2026-010',
    contactName: 'Michael Wasswa',
    contactEmail: 'michael.w@email.com',
    contactPhone: '+256 703 110 220',
    companyName: 'SafeBoda',
    billingAddress: 'Plot 21, Kanjokya Street, Kampala, Uganda',
    amount: 3000000,
    currency: 'UGX',
    status: 'Voided',
    issueDate: 'May 10, 2026',
    paymentDate: 'May 10, 2026',
    lastUpdated: 'May 12, 2026',
    paymentMethod: 'Other',
    paymentMethodDescription: 'Payment Link',
    paymentReference: 'SB-PL-20260510-001',
    relatedInvoiceId: 'inv-10',
    relatedInvoiceNumber: 'TGL-INV-2026-010',
    clientNote: '',
    internalNote: 'Receipt voided after invoice was cancelled due to quotation rejection.',
    initials: 'SB',
    voidRecord: { voidedAt: 'May 12, 2026', reason: 'Linked invoice TGL-INV-2026-010 was cancelled after client rejected the quotation.' },
  },
];
