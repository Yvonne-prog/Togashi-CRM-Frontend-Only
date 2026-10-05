import { useState } from 'react';
import { MOCK_USERS, getUserAccessDescription, getAccessSummary } from '@/lib/mockUsers';
import type { MockUser } from '@/lib/mockUsers';
import type { Permission } from '@/lib/permissions';
import {
  Add, SearchNormal1, Eye, Edit, SecurityUser,
  ArrowLeft, TickCircle, CloseCircle,
  More, Trash,
} from 'iconsax-react';
import { ManageAccess } from '@/components/layout/ManageAccess';
import { useToast } from '@/hooks/use-toast';

const STATUS_STYLES: Record<string, string> = {
  Active: 'bg-emerald-50 text-emerald-700',
  Disabled: 'bg-red-50 text-red-600',
  Invited: 'bg-blue-50 text-blue-700',
};

type View = 'list' | 'detail' | 'add' | 'manageAccess';

export default function UsersPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [view, setView] = useState<View>('list');
  const [detailUser, setDetailUser] = useState<MockUser | null>(null);
  const [manageUser, setManageUser] = useState<MockUser | null>(null);
  const [localUsers, setLocalUsers] = useState<MockUser[]>(() => [...MOCK_USERS]);

  const [addForm, setAddForm] = useState({
    fullName: '',
    email: '',
    jobTitle: '',
    department: '',
    status: 'Invited' as 'Active' | 'Disabled' | 'Invited',
    permissions: [] as Permission[],
  });

  const filtered = localUsers.filter((u) => {
    const q = search.toLowerCase();
    const m = !q || u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.jobTitle && u.jobTitle.toLowerCase().includes(q));
    return m && (statusFilter === 'All' || u.status === statusFilter);
  });

  const handleAddUser = () => {
    if (!addForm.fullName.trim() || !addForm.email.trim()) {
      toast({ title: 'Required fields', description: 'Name and email are required.', variant: 'destructive' });
      return;
    }
    const initials = addForm.fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
    const newUser: MockUser = {
      id: `user-${Date.now()}`,
      fullName: addForm.fullName.trim(),
      email: addForm.email.trim(),
      jobTitle: addForm.jobTitle.trim() || 'No job title',
      department: addForm.department.trim() || undefined,
      accountType: 'USER',
      status: addForm.status,
      initials,
      lastLogin: 'Never',
      permissions: addForm.permissions,
    };
    setLocalUsers((prev) => [...prev, newUser]);
    toast({ title: 'User added', description: `${newUser.fullName} has been added.` });
    setView('list');
    setAddForm({ fullName: '', email: '', jobTitle: '', department: '', status: 'Invited', permissions: [] });
  };

  const handleSaveAccess = (permissions: Permission[]) => {
    if (!manageUser) return;
    setLocalUsers((prev) =>
      prev.map((u) => (u.id === manageUser.id ? { ...u, permissions } : u)),
    );
    toast({ title: 'Access updated', description: `${manageUser.fullName}'s permissions have been updated.` });
    setManageUser(null);
    setView('list');
  };

  const toggleUserStatus = (user: MockUser) => {
    if (user.accountType === 'ADMIN') {
      toast({ title: 'Cannot disable', description: 'The Administrator account cannot be disabled.', variant: 'destructive' });
      return;
    }
    const newStatus = user.status === 'Active' ? 'Disabled' : 'Active';
    setLocalUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u)),
    );
    toast({ title: `User ${newStatus.toLowerCase()}`, description: `${user.fullName} is now ${newStatus.toLowerCase()}.` });
  };

  if (view === 'manageAccess' && manageUser) {
    return (
      <ManageAccess
        targetUser={manageUser}
        onClose={() => { setManageUser(null); setView('list'); }}
        onSave={handleSaveAccess}
      />
    );
  }

  if (view === 'add') {
    return (
      <div className="space-y-4 sm:space-y-5 max-w-[1000px] mx-auto pb-12 bg-[#F7F7F5] -m-4 sm:-m-5 md:-m-6 p-4 sm:p-5 md:p-6 min-h-[calc(100vh-64px)]">
        <div className="flex items-center gap-3">
          <button onClick={() => setView('list')} className="p-1.5 -ml-1 rounded-lg hover:bg-white text-slate-500 transition-colors">
            <ArrowLeft size={18} variant="Linear" color="currentColor" />
          </button>
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Add User</h2>
            <p className="text-slate-500 text-sm mt-0.5">Create a new user account with individual access.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.04)] p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>
              <input
                type="text"
                value={addForm.fullName}
                onChange={(e) => setAddForm((f) => ({ ...f, fullName: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                placeholder="Enter full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address *</label>
              <input
                type="email"
                value={addForm.email}
                onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                placeholder="Enter email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Job Title</label>
              <input
                type="text"
                value={addForm.jobTitle}
                onChange={(e) => setAddForm((f) => ({ ...f, jobTitle: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                placeholder="e.g. Finance Officer"
              />
              <p className="text-[11px] text-slate-400 mt-1">Descriptive only — does not control system access.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Department (optional)</label>
              <input
                type="text"
                value={addForm.department}
                onChange={(e) => setAddForm((f) => ({ ...f, department: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                placeholder="e.g. Finance"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Account Status</label>
              <select
                value={addForm.status}
                onChange={(e) => setAddForm((f) => ({ ...f, status: e.target.value as 'Active' | 'Disabled' | 'Invited' }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="Invited">Invited</option>
                <option value="Active">Active</option>
                <option value="Disabled">Disabled</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
            <button
              onClick={() => setView('list')}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddUser}
              className="px-5 py-2 rounded-lg text-sm font-semibold bg-[#16A34A] hover:bg-[#15803D] text-white transition-colors"
            >
              Add User
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'detail' && detailUser) {
    const accessDesc = getUserAccessDescription(detailUser);
    return (
      <div className="space-y-4 sm:space-y-5 max-w-[1000px] mx-auto pb-12 bg-[#F7F7F5] -m-4 sm:-m-5 md:-m-6 p-4 sm:p-5 md:p-6 min-h-[calc(100vh-64px)]">
        <div className="flex items-center gap-3">
          <button onClick={() => { setDetailUser(null); setView('list'); }} className="p-1.5 -ml-1 rounded-lg hover:bg-white text-slate-500 transition-colors">
            <ArrowLeft size={18} variant="Linear" color="currentColor" />
          </button>
          <div>
            <h2 className="text-xl font-semibold text-slate-950">{detailUser.fullName}</h2>
            <p className="text-slate-500 text-sm mt-0.5">User Details</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.04)] p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-full bg-[#1E293B] text-white flex items-center justify-center text-xl font-bold shrink-0">
              {detailUser.initials}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{detailUser.fullName}</h3>
              <p className="text-sm text-slate-500">{detailUser.email}</p>
              {detailUser.accountType === 'ADMIN' && (
                <span className="inline-block mt-1 text-[11px] font-semibold text-[#16A34A] bg-emerald-50 px-2 py-0.5 rounded">Administrator</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Job Title</p>
              <p className="text-sm font-semibold text-slate-900">{detailUser.jobTitle}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Department</p>
              <p className="text-sm text-slate-700">{detailUser.department || '—'}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Status</p>
              <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${STATUS_STYLES[detailUser.status]}`}>{detailUser.status}</span>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Access</p>
              <p className="text-sm font-semibold text-slate-900">{getAccessSummary(detailUser)}</p>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 mb-6">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Access Summary</p>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">{accessDesc}</p>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Actions</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setManageUser(detailUser); setView('manageAccess'); }}
                className="px-4 py-2 rounded-lg border border-emerald-200 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 transition-colors"
              >
                Manage Access
              </button>
              <button className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                Edit User
              </button>
              {detailUser.accountType !== 'ADMIN' && (
                <button
                  onClick={() => toggleUserStatus(detailUser)}
                  className={`px-4 py-2 rounded-lg border text-xs font-medium transition-colors ${
                    detailUser.status === 'Active'
                      ? 'border-red-200 text-red-600 hover:bg-red-50'
                      : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                  }`}
                >
                  {detailUser.status === 'Active' ? 'Disable User' : 'Enable User'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5 max-w-[1600px] mx-auto pb-12 bg-[#F7F7F5] -m-4 sm:-m-5 md:-m-6 p-4 sm:p-5 md:p-6 min-h-[calc(100vh-64px)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">User Access</h2>
          <p className="text-slate-500 mt-1 text-sm">Manage users and control what each person can access.</p>
        </div>
        <button
          onClick={() => setView('add')}
          className="bg-[#16A34A] hover:bg-[#15803D] text-white h-10 px-5 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 shrink-0"
        >
          <Add size={18} variant="Linear" color="currentColor" /><span>Add User</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.04)] px-4 py-3 flex flex-col sm:flex-row gap-2.5 justify-between items-start sm:items-center">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-48 sm:w-56">
            <SearchNormal1 className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} variant="Linear" color="currentColor" />
            <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer outline-none">
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Disabled">Disabled</option>
            <option value="Invited">Invited</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.04)] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mb-4 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
              <SecurityUser size={24} variant="Bulk" color="#CBD5E1" />
            </div>
            <h3 className="text-base font-medium text-slate-900">No users found</h3>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">User</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Email</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Job Title</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Access Summary</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Last Login</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider w-10">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/60 transition-colors group">
                      <td className="px-5 py-3 cursor-pointer" onClick={() => { setDetailUser(user); setView('detail'); }}>
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-[#1E293B] text-white flex items-center justify-center text-[11px] font-semibold shrink-0">{user.initials}</div>
                          <div>
                            <span className="text-[13px] font-medium text-slate-900 group-hover:text-[#16A34A] transition-colors">{user.fullName}</span>
                            {user.accountType === 'ADMIN' && (
                              <span className="ml-1.5 text-[10px] font-semibold text-[#16A34A] bg-emerald-50 px-1.5 py-0.5 rounded">Admin</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-[12px] text-slate-500">{user.email}</td>
                      <td className="px-5 py-3">
                        <span className="text-[12px] font-medium text-slate-700">{user.jobTitle}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-[12px] font-medium ${
                          getAccessSummary(user) === 'Full Access' ? 'text-[#16A34A]' :
                          getAccessSummary(user) === 'View Only' ? 'text-amber-600' :
                          getAccessSummary(user) === 'No Access' ? 'text-red-500' :
                          'text-slate-600'
                        }`}>
                          {getAccessSummary(user)}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${STATUS_STYLES[user.status]}`}>{user.status}</span>
                      </td>
                      <td className="px-5 py-3 hidden lg:table-cell text-[12px] text-slate-400">{user.lastLogin}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                          <button
                            onClick={(e) => { e.stopPropagation(); setDetailUser(user); setView('detail'); }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#16A34A] hover:bg-emerald-50 transition-colors"
                            title="View User"
                          >
                            <Eye size={15} variant="Linear" color="currentColor" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setManageUser(user); setView('manageAccess'); }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#16A34A] hover:bg-emerald-50 transition-colors"
                            title="Manage Access"
                          >
                            <SecurityUser size={15} variant="Linear" color="currentColor" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y divide-slate-50">
              {filtered.map((user) => (
                <div
                  key={user.id}
                  className="p-4 hover:bg-slate-50/60 transition-colors cursor-pointer"
                  onClick={() => { setDetailUser(user); setView('detail'); }}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#1E293B] text-white flex items-center justify-center text-xs font-semibold shrink-0">{user.initials}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-900">{user.fullName}</span>
                        {user.accountType === 'ADMIN' && (
                          <span className="text-[10px] font-semibold text-[#16A34A] bg-emerald-50 px-1.5 py-0.5 rounded">Admin</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">{user.jobTitle}</p>
                    </div>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${STATUS_STYLES[user.status]}`}>{user.status}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-slate-400">{user.email}</span>
                    <span className={`text-xs font-medium ${
                      getAccessSummary(user) === 'Full Access' ? 'text-[#16A34A]' :
                      getAccessSummary(user) === 'View Only' ? 'text-amber-600' :
                      'text-slate-500'
                    }`}>
                      {getAccessSummary(user)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="mt-4 bg-slate-50 rounded-xl p-4 border border-slate-100">
        <p className="text-xs text-slate-500">
          <strong className="text-slate-700">Developer note:</strong> This access system is suitable for frontend interface development and testing. 
          A future backend should store user permissions, return them during login, enforce every API request, filter records server-side, 
          record permission changes, and prevent client-side permission bypass.
        </p>
      </div>
    </div>
  );
}
