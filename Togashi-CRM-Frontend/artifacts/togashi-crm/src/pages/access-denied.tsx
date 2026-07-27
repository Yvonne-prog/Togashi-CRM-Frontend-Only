import { Link } from 'wouter';
import { ShieldCross } from 'iconsax-react';

export default function AccessDenied() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 min-h-[60vh]">
      <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-6">
        <ShieldCross size={40} variant="Bulk" color="#DC2626" />
      </div>
      <h2 className="text-xl font-semibold text-slate-900 mb-2">Access denied</h2>
      <p className="text-sm text-slate-500 max-w-md leading-relaxed">
        You do not have permission to view this page. Contact your administrator if you believe you need access.
      </p>
      <Link href="/" className="mt-6 bg-[#0F172A] hover:bg-[#1E293B] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors inline-flex items-center gap-2">
        Return to Dashboard
      </Link>
    </div>
  );
}
