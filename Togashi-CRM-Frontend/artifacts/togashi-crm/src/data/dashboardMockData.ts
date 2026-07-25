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
