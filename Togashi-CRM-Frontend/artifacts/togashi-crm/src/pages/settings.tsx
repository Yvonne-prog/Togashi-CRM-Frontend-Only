import { useListUsers } from '@workspace/api-client-react';
import { Profile2User, Buildings, Shield, SearchNormal1 } from 'iconsax-react';

export default function Settings() {
  const { data: users } = useListUsers();

  return (
    <div className="flex h-[calc(100vh-64px)] -m-4 sm:-m-5 md:-m-6 bg-white">
      {/* Settings Left Nav */}
      <div className="w-56 lg:w-64 border-r border-slate-200 bg-slate-50/50 p-4 lg:p-6 flex flex-col gap-1 shrink-0">
        <h2 className="text-lg lg:text-xl font-bold text-slate-900 mb-4 lg:mb-6">Settings</h2>
        
        <button className="text-left px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg font-medium bg-[#E2E8F0] text-[#0F172A] text-sm">
          Users & Roles
        </button>
        <button className="text-left px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg font-medium text-slate-600 hover:bg-slate-100 text-sm">
          Organization Profile
        </button>
        <button className="text-left px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg font-medium text-slate-600 hover:bg-slate-100 text-sm">
          Departments
        </button>
        <button className="text-left px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg font-medium text-slate-600 hover:bg-slate-100 text-sm">
          Security & Audit
        </button>
      </div>

      {/* Settings Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight text-slate-950">Users & Roles</h3>
              <p className="text-slate-500 mt-1">Manage team members and their access permissions.</p>
            </div>
            <button className="bg-[#0F172A] hover:bg-[#1E293B] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
              Invite User
            </button>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <div className="relative w-72">
                <SearchNormal1 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} variant="Linear" color="currentColor" />
                <input 
                  type="text"
                  placeholder="Search users..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>
            
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-medium">User</th>
                  <th className="px-6 py-3 font-medium">Role</th>
                  <th className="px-6 py-3 font-medium">Department</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users?.data.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-[#1E293B] text-white flex items-center justify-center font-bold">
                          {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{user.firstName} {user.lastName}</div>
                          <div className="text-slate-500 text-xs">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 font-medium text-slate-700">
                        {user.role === 'Admin' && <Shield size={14} className="text-[#16A34A]" variant="Linear" color="currentColor"/>}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{user.department || '-'}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
