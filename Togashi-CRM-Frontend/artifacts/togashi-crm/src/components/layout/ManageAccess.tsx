import { useState, useCallback } from 'react';
import {
  ArrowLeft, CloseSquare, TickCircle, InfoCircle,
  Copy, DocumentDownload,
} from 'iconsax-react';
import type { Permission } from '@/lib/permissions';
import {
  MODULE_LABELS, MODULE_PERMISSION_DEFS, ACCESS_PRESETS,
  ALL_PERMISSIONS,
} from '@/lib/permissions';
import type { MockUser } from '@/lib/mockUsers';
import { MOCK_USERS, getAccessSummary } from '@/lib/mockUsers';
import type { ModulePermissionGroup } from '@/lib/permissions';

interface ManageAccessProps {
  targetUser: MockUser;
  onClose: () => void;
  onSave: (permissions: Permission[]) => void;
}

const DISPLAY_MODULES: ModulePermissionGroup[] = [
  'dashboard', 'contacts', 'companies', 'leads', 'deals',
  'quotations', 'invoices', 'receipts', 'projects', 'tasks',
  'calendar', 'documents', 'communications', 'reports',
  'users', 'settings', 'financial',
];

function buildInitialPermissions(user: MockUser): Permission[] {
  return [...user.permissions];
}

export function ManageAccess({ targetUser, onClose, onSave }: ManageAccessProps) {
  const [permissions, setPermissions] = useState<Permission[]>(() => buildInitialPermissions(targetUser));
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [showPresets, setShowPresets] = useState(false);
  const [showCopyFrom, setShowCopyFrom] = useState(false);
  const [copyUserId, setCopyUserId] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [saved, setSaved] = useState(false);

  const togglePermission = useCallback((perm: Permission) => {
    setPermissions((prev) => {
      const exists = prev.includes(perm);
      const next = exists ? prev.filter((p) => p !== perm) : [...prev, perm];
      return next;
    });
    setHasChanges(true);
  }, []);

  const toggleModuleEnabled = useCallback((module: ModulePermissionGroup) => {
    setPermissions((prev) => {
      const modPerms = MODULE_PERMISSION_DEFS[module]?.map((d) => d.key as Permission) || [];
      const hasView = modPerms.find((p) => p.endsWith('.view'));
      const isEnabled = hasView ? prev.includes(hasView) : modPerms.some((p) => prev.includes(p));

      if (isEnabled) {
        return prev.filter((p) => !modPerms.includes(p));
      } else {
        const toAdd = hasView ? [hasView] : modPerms;
        return [...new Set([...prev, ...toAdd])];
      }
    });
    setHasChanges(true);
  }, []);

  const isModuleEnabled = useCallback((module: ModulePermissionGroup): boolean => {
    const viewPerm = `${module}.view` as Permission;
    return permissions.includes(viewPerm) || module === 'financial';
  }, [permissions]);

  const applyPreset = useCallback((presetKey: string) => {
    const preset = ACCESS_PRESETS[presetKey];
    if (preset) {
      setPermissions([...preset.permissions]);
      setHasChanges(true);
    }
    setShowPresets(false);
  }, []);

  const copyFromUser = useCallback(() => {
    const sourceUser = MOCK_USERS.find((u) => u.id === copyUserId);
    if (sourceUser) {
      setPermissions([...sourceUser.permissions]);
      setHasChanges(true);
    }
    setShowCopyFrom(false);
    setCopyUserId('');
  }, [copyUserId]);

  const handleSave = useCallback(() => {
    onSave(permissions);
    setSaved(true);
    setHasChanges(false);
    window.setTimeout(() => setSaved(false), 2000);
  }, [permissions, onSave]);

  const handleCloseAttempt = useCallback(() => {
    if (hasChanges) {
      setShowDiscardDialog(true);
    } else {
      onClose();
    }
  }, [hasChanges, onClose]);

  const toggleExpand = useCallback((mod: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(mod)) next.delete(mod);
      else next.add(mod);
      return next;
    });
  }, []);

  const noAccessSet = permissions.length === 0;

  return (
    <div className="fixed inset-0 z-[100] bg-[#F7F7F5] overflow-y-auto">
      {showDiscardDialog && (
        <div className="fixed inset-0 z-[200] bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Discard unsaved access changes?</h3>
            <p className="text-sm text-slate-500 mb-6">You have unsaved permission changes. If you leave now, your changes will be lost.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDiscardDialog(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Continue Editing
              </button>
              <button
                onClick={() => { setShowDiscardDialog(false); onClose(); }}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
              >
                Discard Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={handleCloseAttempt}
            className="p-1.5 -ml-1 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <ArrowLeft size={20} variant="Linear" color="currentColor" />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Manage Access — {targetUser.fullName}</h2>
            <p className="text-xs text-slate-500">{targetUser.jobTitle} · {getAccessSummary(targetUser)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCloseAttempt}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="px-5 py-2 rounded-lg text-sm font-semibold bg-[#16A34A] hover:bg-[#15803D] disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
          >
            {saved ? 'Saved' : 'Save Access'}
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {saved && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-2">
            <TickCircle size={18} variant="Bold" color="#16A34A" />
            <span className="text-sm font-medium text-emerald-700">Access updated successfully.</span>
          </div>
        )}

        {noAccessSet && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <InfoCircle size={18} variant="Bold" color="#D97706" />
            <div>
              <p className="text-sm font-medium text-amber-800">No Access Yet</p>
              <p className="text-xs text-amber-600 mt-0.5">This user currently has no module permissions. Enable modules below to grant access.</p>
            </div>
          </div>
        )}

        {targetUser.accountType === 'ADMIN' && (
          <div className="bg-[#1E293B] rounded-xl p-4 flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-[#16A34A]/20 flex items-center justify-center shrink-0">
              <TickCircle size={18} variant="Bold" color="#16A34A" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Administrator Account</p>
              <p className="text-xs text-slate-400 mt-0.5">Administrators have full system access by default. Individual permissions cannot be removed, but you can review the full permission set below.</p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowPresets(!showPresets)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <DocumentDownload size={14} variant="Linear" color="currentColor" />
            Access Presets
          </button>
          <button
            onClick={() => setShowCopyFrom(!showCopyFrom)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <Copy size={14} variant="Linear" color="currentColor" />
            Copy From Another User
          </button>
        </div>

        {showPresets && (
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Access Presets</p>
            <p className="text-xs text-slate-400 mb-3">Apply a preset to pre-select permissions, then adjust individually.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries(ACCESS_PRESETS).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => applyPreset(key)}
                  className="text-left px-4 py-3 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all"
                >
                  <p className="text-sm font-semibold text-slate-900">{preset.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{preset.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {showCopyFrom && (
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Copy Access From Another User</p>
            <div className="flex items-center gap-3">
              <select
                value={copyUserId}
                onChange={(e) => setCopyUserId(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="">Select a user...</option>
                {MOCK_USERS.filter((u) => u.id !== targetUser.id).map((u) => (
                  <option key={u.id} value={u.id}>{u.fullName} ({u.jobTitle})</option>
                ))}
              </select>
              <button
                onClick={copyFromUser}
                disabled={!copyUserId}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-[#16A34A] text-white hover:bg-[#15803D] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
              >
                Copy & Review
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2">This copies the selected user&apos;s current permissions for review. The two accounts are not linked permanently.</p>
          </div>
        )}

        <div className="space-y-3">
          {DISPLAY_MODULES.map((module) => {
            const defs = MODULE_PERMISSION_DEFS[module];
            if (!defs || defs.length === 0) return null;
            const isExpanded = expandedModules.has(module);
            const enabled = isModuleEnabled(module);
            const modPerms = defs.map((d) => d.key as Permission);
            const checkedCount = modPerms.filter((p) => permissions.includes(p)).length;

            return (
              <div key={module} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleModuleEnabled(module)}
                      disabled={targetUser.accountType === 'ADMIN'}
                      className={`relative w-10 h-6 rounded-full transition-colors shrink-0 ${
                        targetUser.accountType === 'ADMIN'
                          ? 'bg-emerald-200 cursor-not-allowed'
                          : enabled
                            ? 'bg-[#16A34A]'
                            : 'bg-slate-200'
                      }`}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                        enabled ? 'left-[18px]' : 'left-0.5'
                      }`} />
                    </button>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{MODULE_LABELS[module]}</p>
                      <p className="text-[11px] text-slate-400">
                        {enabled
                          ? `${checkedCount}/${modPerms.length} permissions`
                          : 'Module disabled'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleExpand(module)}
                    className="text-xs font-medium text-[#16A34A] hover:text-[#15803D] transition-colors"
                  >
                    {isExpanded ? 'Collapse' : 'Configure'}
                  </button>
                </div>

                {isExpanded && (
                  <div className="border-t border-slate-100 px-4 py-3 space-y-2 bg-slate-50/50">
                    {!enabled && targetUser.accountType !== 'ADMIN' && (
                      <p className="text-xs text-slate-400 italic mb-2">Enable this module first to configure individual permissions.</p>
                    )}
                    {defs.map((def) => {
                      const isView = def.key.endsWith('.view');
                      const checked = permissions.includes(def.key as Permission);
                      const disabled = targetUser.accountType === 'ADMIN' || (!enabled && !isView);

                      return (
                        <label
                          key={def.key}
                          className={`flex items-center gap-3 py-1.5 ${disabled && !checked ? 'opacity-40' : ''}`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => togglePermission(def.key as Permission)}
                            disabled={disabled || targetUser.accountType === 'ADMIN'}
                            className="h-4 w-4 rounded border-slate-300 text-[#16A34A] focus:ring-[#16A34A]/20 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-sm text-slate-700">{def.label}</span>
                            {def.help && (
                              <span className="text-[11px] text-slate-400 ml-1">— {def.help}</span>
                            )}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
