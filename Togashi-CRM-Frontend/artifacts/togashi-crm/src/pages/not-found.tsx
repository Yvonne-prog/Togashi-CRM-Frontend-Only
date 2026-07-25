export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F3F8F5]">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-slate-200 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-slate-800 mb-2">Page Not Found</h2>
        <p className="text-slate-500 mb-8">The page you are looking for doesn't exist or has been moved.</p>
        <a href="/" className="bg-[#16A34A] hover:bg-[#15803D] text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors">
          Return to Dashboard
        </a>
      </div>
    </div>
  );
}
