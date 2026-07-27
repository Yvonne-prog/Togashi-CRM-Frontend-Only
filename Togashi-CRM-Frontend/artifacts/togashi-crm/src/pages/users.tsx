import { useState } from 'react';
import { MOCK_USERS } from '@/lib/mockUsers';
import type { MockUser } from '@/lib/mockUsers';
import { ROLES } from '@/lib/roles';
import type { RoleId } from '@/lib/roles';
import {
  Add, SearchNormal1, More, SecurityUser, ShieldTick,
  CloseSquare, ArrowLeft, Eye, Edit, Trash, TickCircle,
  CloseCircle, ArrowDown2,
} from 'iconsax-react';

const STATUS_STYLES: Record<string, string> = {
  Active: 'bg-emerald-50 text-emerald-700',
  Disabled: 'bg-red-50 text-red-600',
  Invited: 'bg-blue-50 text-blue-700',
};

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [detailUser, setDetailUser] = useState<MockUser | null>(null);
  const [formUser, setFormUser] = useState<Partial<MockUser> | null>(null);
  const [selectedRole, setSelectedRole] = useState<RoleId | null>(null);

  const filtered = MOCK_USERS.filter((u) => {
    const q = search.toLowerCase();
    const m = !q || u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    return m
      && (roleFilter === 'All' || u.role === roleFilter)
      && (statusFilter === 'All' || u.status === statusFilter);
  });

  if (selectedRole) {
    const role = ROLES[selectedRole];
    return (
      <div className="space-y-4 sm:space-y-5 max-w-[1200px] mx-auto pb-12 bg-[#F7F7F5] -m-4 sm:-m-5 md:-m-6 p-4 sm:p-5 md:p-6 min-h-[calc(100vh-64px)]">
        <div className="flex items-center gap-3">
          <button onClick={() => setSelectedRole(null)} className="p-1.5 -ml-1 rounded-lg hover:bg-white text-slate-500 transition-colors">
            <ArrowLeft size={18} variant="Linear" color="currentColor" />
          </button>
          <div>
            <h2 className="text-xl font-semibold text-slate-950">{role.label}</h2>
            <p className="text-slate-500 text-sm mt-0.5">{role.description}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.04)] p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Permissions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
            {role.permissions.map((p) => (
              <div key={p} className="flex items-center gap-2 text-sm">
                <TickCircle size={14} variant="Linear" color="#16A34A" />
                <span className="text-slate-600">{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (detailUser) {
    return (
      <div className="space-y-4 sm:space-y-5 max-w-[1000px] mx-auto pb-12 bg-[#F7F7F5] -m-4 sm:-m-5 md:-m-6 p-4 sm:p-5 md:p-6 min-h-[calc(100vh-64px)]">
        <div className="flex items-center gap-3">
          <button onClick={() => setDetailUser(null)} className="p-1.5 -ml-1 rounded-lg hover:bg-white text-slate-500 transition-colors">
            <ArrowLeft size={18} variant="Linear" color="currentColor" />
          </button>
          <div>
            <h2 className="text-xl font-semibold text-slate-950">{detailUser.fullName}</h2>
            <p className="text-slate-500 text-sm mt-0.5">User Details</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.04)] p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-full bg-[#1E293B] text-white flex items-center justify-center text-xl font-bold shrink-0">
              {detailUser.initials}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{detailUser.fullName}</h3>
              <p className="text-sm text-slate-500">{detailUser.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Role</p>
              <p className="text-sm font-semibold text-slate-900">{ROLES[detailUser.role].label}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Status</p>
              <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${STATUS_STYLES[detailUser.status]}`}>{detailUser.status}</span>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Last Login</p>
              <p className="text-sm text-slate-700">{detailUser.lastLogin}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border-t border-slate-100 pt-4">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Actions</p>
              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">Edit User</button>
                <button className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">Change Role</button>
                <button className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">Reset Password</button>
                {detailUser.status === 'Active' ? (
                  <button className="px-4 py-2 rounded-lg border border-red-200 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors">Disable User</button>
                ) : (
                  <button className="px-4 py-2 rounded-lg border border-emerald-200 text-xs font-medium text-emerald-600 hover:bg-emerald-50 transition-colors">Enable User</button>
                )}
              </div>
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
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Users & Roles</h2>
          <p className="text-slate-500 mt-1 text-sm">Manage user accounts, roles and system access.</p>
        </div>
        <button className="bg-[#16A34A] hover:bg-[#15803D] text-white h-10 px-5 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 shrink-0">
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
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer outline-none">
            <option value="All">All Roles</option>
            {Object.entries(ROLES).map(([id, role]) => (
              <option key={id} value={id}>{role.label}</option>
            ))}
          </select>
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
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">User</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Email</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Role</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Last Login</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/60 transition-colors group cursor-pointer" onClick={() => setDetailUser(user)}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-[#1E293B] text-white flex items-center justify-center text-[11px] font-semibold shrink-0">{user.initials}</div>
                        <span className="text-[13px] font-medium text-slate-900 group-hover:text-[#16A34A] transition-colors">{user.fullName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell text-[12px] text-slate-500">{user.email}</td>
                    <td className="px-5 py-3">
                      <span className="text-[12px] font-medium text-slate-700">{ROLES[user.role].label}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${STATUS_STYLES[user.status]}`}>{user.status}</span>
                    </td>
                    <td className="px-5 py-3 hidden lg:table-cell text-[12px] text-slate-400">{user.lastLogin}</td>
                    <td className="px-5 py-3">
                      <button onClick={(e) => { e.stopPropagation(); }} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-all">
                        <More size={15} variant="Linear" color="currentColor" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Roles Section */}
      <div className="pt-2">
        <h3 className="text-lg font-semibold text-slate-950 mb-3">Roles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(ROLES).map(([id, role]) => (
            <div key={id}
              onClick={() => setSelectedRole(id as RoleId)}
              className="bg-white rounded-xl p-4 shadow-[0_2px_8px_rgba(15,23,42,0.03)] cursor-pointer hover:shadow-[0_4px_16px_rgba(15,23,42,0.08)] transition-shadow"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-lg bg-[#1E293B] flex items-center justify-center shrink-0">
                  <ShieldTick size={20} variant="Linear" color="#16A34A" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{role.label}</p>
                  <p className="text-[11px] text-slate-400">
                    {MOCK_USERS.filter((u) => u.role === id).length} user{MOCK_USERS.filter((u) => u.role === id).length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2">{role.description}</p>
              <p className="text-[11px] text-[#16A34A] font-medium mt-2">{role.permissions.length} permissions</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
