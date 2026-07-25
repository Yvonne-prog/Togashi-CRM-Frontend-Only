import { useState } from 'react';
import { documents as mockDocs, documentStats, documentCategories, recentDocuments } from '@/data/dashboardMockData';
import type { Document } from '@/data/dashboardMockData';
import { Link } from 'wouter';
import {
  Add, SearchNormal1, More, CloseSquare, DocumentDownload, Folder2, Clock, Share,
  DocumentText, DocumentFilter, DocumentCloud, Gallery, Buildings, Briefcase, TaskSquare, Profile2User, Eye,
} from 'iconsax-react';

const TYPE_ICONS: Record<string, { icon: React.ComponentType<any>; color: string; label: string }> = {
  pdf: { icon: DocumentText, color: '#DC2626', label: 'PDF' },
  docx: { icon: DocumentText, color: '#3B82F6', label: 'DOCX' },
  xlsx: { icon: DocumentFilter, color: '#16A34A', label: 'XLSX' },
  pptx: { icon: DocumentCloud, color: '#F59E0B', label: 'PPTX' },
  png: { icon: Gallery, color: '#8B5CF6', label: 'PNG' },
  jpg: { icon: Gallery, color: '#8B5CF6', label: 'JPG' },
  zip: { icon: DocumentFilter, color: '#F97316', label: 'ZIP' },
};

const RELATED_ICONS: Record<string, React.ComponentType<any>> = { company: Buildings, deal: Briefcase, project: TaskSquare, contact: Profile2User };
const RELATED_URLS: Record<string, string> = { company: '/companies', deal: '/deals', project: '/projects', contact: '/contacts' };

const formatSize = (bytes: number) => {
  if (bytes >= 1e6) return (bytes / 1e6).toFixed(1) + ' MB';
  if (bytes >= 1e3) return (bytes / 1e3).toFixed(0) + ' KB';
  return bytes + ' B';
};

export default function Documents() {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('modified');
  const [detailDoc, setDetailDoc] = useState<Document | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [menuDocId, setMenuDocId] = useState<string | null>(null);

  const filtered = mockDocs.filter(d => {
    const q = search.toLowerCase();
    return (!q || d.name.toLowerCase().includes(q) || d.relatedName.toLowerCase().includes(q) || d.tags.some(t => t.includes(q)) || d.uploadedBy.toLowerCase().includes(q))
      && (!catFilter || d.category === catFilter);
  });

  const recent = recentDocuments.map(id => mockDocs.find(d => d.id === id)).filter(Boolean) as Document[];

  return (
    <div className="space-y-2 max-w-[1600px] mx-auto pb-12 bg-[#F7F7F5] -m-5 md:-m-6 p-5 md:p-6 min-h-[calc(100vh-64px)]" onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={e => { e.preventDefault(); setDragOver(false); }} onClick={() => setMenuDocId(null)}>
      {dragOver && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-[#16A34A]/10 border-4 border-dashed border-[#16A34A] pointer-events-none"><div className="text-center"><DocumentDownload size={48} variant="Bulk" color="#16A34A" className="mx-auto mb-3"/><p className="text-lg font-semibold text-[#16A34A]">Drop files to upload</p></div></div>)}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-semibold tracking-tight text-slate-950">Documents</h2><p className="text-slate-500 mt-0.5 text-sm">Centralized storage for all client and deal files.</p></div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[{ l: 'Total Documents', i: Folder2, v: String(documentStats.totalDocuments), c: '#64748B' },
          { l: 'Recently Updated', i: Clock, v: documentStats.recentlyUpdated + ' Files', c: '#F59E0B' },
          { l: 'Shared This Week', i: Share, v: String(documentStats.sharedThisWeek), c: '#16A34A' },
          { l: 'Recently Uploaded', i: Add, v: String(documentStats.recentlyUploaded), c: '#3B82F6' },
        ].map(({ l, i: Icon, v, c }) => (
          <div key={l} className="bg-white rounded-xl p-2.5 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
            <div className="flex items-center gap-1.5 mb-0.5"><Icon size={13} variant="Linear" color={c}/><span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{l}</span></div>
            <p className="text-lg font-semibold text-slate-900 leading-tight">{v}</p>
          </div>
        ))}
      </div>

      {/* Category Chips */}
      <div className="flex flex-wrap items-center gap-1.5">
        <button onClick={() => setCatFilter(null)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${!catFilter ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 shadow-[0_1px_3px_rgba(15,23,42,0.04)]'}`}>All</button>
        {documentCategories.map(c => (
          <button key={c} onClick={() => setCatFilter(catFilter === c ? null : c)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${catFilter === c ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 shadow-[0_1px_3px_rgba(15,23,42,0.04)]'}`}>{c}</button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-56">
          <SearchNormal1 className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} variant="Linear" color="currentColor"/>
          <input type="text" placeholder="Filter this document library..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-8 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none shadow-[0_1px_3px_rgba(15,23,42,0.04)]"/>
        </div>
        <select value={catFilter || ''} onChange={e => setCatFilter(e.target.value || null)} className="border border-slate-200 bg-white rounded-lg text-xs px-3 py-2 text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
          <option value="">Category</option>{documentCategories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="border border-slate-200 bg-white rounded-lg text-xs px-3 py-2 text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
          <option value="modified">Sort ▼</option><option value="name">Name</option><option value="size">Size</option><option value="type">Type</option>
        </select>
        <button className="bg-[#16A34A] hover:bg-[#15803D] text-white h-9 px-4 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0"><Add size={15} variant="Linear" color="currentColor"/>Upload</button>
      </div>

      {/* Table + Recently Opened */}
      <div className="flex gap-4 items-start min-h-0">
        <div className="flex-1 min-w-0 bg-white rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.04)] overflow-hidden">
          {filtered.length > 0 ? (
            <table className="w-full text-left text-sm">
              <thead><tr className="border-b border-slate-100">
                <th className="px-5 py-2.5 text-[11px] font-medium text-slate-500 uppercase tracking-wider">File</th>
                <th className="px-5 py-2.5 text-[11px] font-medium text-slate-500 uppercase tracking-wider">Related To</th>
                <th className="px-5 py-2.5 text-[11px] font-medium text-slate-500 uppercase tracking-wider w-24">Modified</th>
                <th className="px-5 py-2.5 text-[11px] font-medium text-slate-500 uppercase tracking-wider w-10"></th>
              </tr></thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(doc => { const ti = TYPE_ICONS[doc.type] || TYPE_ICONS.pdf; const RI = RELATED_ICONS[doc.relatedType]; return (
                  <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors group">
                    <td className="px-5 py-3.5 cursor-pointer" onClick={() => setDetailDoc(doc)}>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: ti.color + '15' }}><ti.icon size={20} variant="Linear" color={ti.color}/></div>
                        <div className="min-w-0">
                          <p className="text-[14px] font-semibold text-slate-900 group-hover:text-[#16A34A] transition-colors truncate">{doc.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <div className="flex items-center gap-1"><div className="h-4 w-4 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-semibold text-slate-600 shrink-0">{doc.uploadedBy.split(' ').map((n: string) => n[0]).join('')}</div><span className="text-[11px] text-slate-400">{doc.uploadedBy}</span></div>
                            <span className="text-[10px] text-slate-300">·</span>
                            <span className="text-[11px] text-slate-400">{formatSize(doc.size)}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <Link href={RELATED_URLS[doc.relatedType] || '/'} onClick={e => e.stopPropagation()} className="flex items-center gap-1.5 text-[13px] text-slate-600 hover:text-[#16A34A] transition-colors">
                        {RI ? <RI size={14} variant="Linear" color="#94A3B8"/> : null}
                        <span>{doc.relatedName}</span>
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 text-[12px] text-slate-400">{doc.lastModified}</td>
                    <td className="px-5 py-3.5 relative">
                      <button onClick={e => { e.stopPropagation(); setMenuDocId(menuDocId === doc.id ? null : doc.id); }} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                        <More size={16} variant="Linear" color="currentColor"/>
                      </button>
                      {menuDocId === doc.id && (
                        <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-30" onClick={e => e.stopPropagation()}>
                          <button className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-2" onClick={() => { setDetailDoc(doc); setMenuDocId(null); }}><Eye size={13} variant="Linear" color="#94A3B8"/>Preview</button>
                          <button className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-2"><DocumentDownload size={13} variant="Linear" color="#94A3B8"/>Download</button>
                          <button className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-2"><Share size={13} variant="Linear" color="#94A3B8"/>Share</button>
                          <div className="border-t border-slate-100 my-1"/>
                          <button className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50">Rename</button>
                          <button className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50">Move</button>
                          <button className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50">Delete</button>
                        </div>
                      )}
                    </td>
                  </tr>
                );})}
              </tbody>
            </table>
          ) : (
            <div className="py-16 text-center">
              <div className="mb-4 mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-50"><Folder2 size={28} variant="Bulk" color="#CBD5E1"/></div>
              <h3 className="text-lg font-medium text-slate-900">{catFilter ? `No documents in ${catFilter}` : search ? 'No matching documents' : 'No documents found'}</h3>
              <p className="text-sm text-slate-500 mt-1">{search || catFilter ? 'Try adjusting your search or filters.' : 'Drag files here or click Upload to add documents.'}</p>
              {!search && !catFilter && <button className="mt-4 bg-[#16A34A] hover:bg-[#15803D] text-white h-10 px-5 rounded-full text-sm font-semibold transition-colors inline-flex items-center gap-2"><Add size={18} variant="Linear" color="currentColor"/><span>Upload File</span></button>}
            </div>
          )}
        </div>

        {/* Recently Opened */}
        <div className="w-52 shrink-0 bg-white rounded-xl p-3 shadow-[0_2px_8px_rgba(15,23,42,0.03)] hidden lg:block sticky top-5">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Recently Opened</p>
          <div className="space-y-1.5">
            {recent.map(d => { const ti = TYPE_ICONS[d.type]; return (
              <div key={d.id} className="flex items-center gap-2.5 cursor-pointer hover:bg-slate-50 rounded-lg p-1.5 -mx-1.5 transition-colors" onClick={() => setDetailDoc(d)}>
                <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: ti.color + '12' }}><ti.icon size={17} variant="Linear" color={ti.color}/></div>
                <div className="flex-1 min-w-0"><p className="text-[12px] text-slate-700 font-medium truncate">{d.name}</p><p className="text-[10px] text-slate-400 truncate">{d.category}</p></div>
              </div>
            );})}
          </div>
        </div>
      </div>

      {/* Detail Drawer */}
      {detailDoc && (() => { const ti = TYPE_ICONS[detailDoc.type] || TYPE_ICONS.pdf; return (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setDetailDoc(null)}><div className="absolute inset-0 bg-black/20"/><div className="relative w-full max-w-md bg-white h-full shadow-2xl overflow-y-auto" onClick={e => e.stopPropagation()}>
          <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10"><h3 className="font-semibold text-slate-900">File Details</h3><button onClick={() => setDetailDoc(null)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><CloseSquare size={18} variant="Linear" color="currentColor"/></button></div>
          <div className="px-6 py-5">
            <div className="flex items-center gap-3 mb-4"><div className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: ti.color + '15' }}><ti.icon size={24} variant="Linear" color={ti.color}/></div><div className="min-w-0"><h2 className="text-base font-semibold text-slate-900 truncate">{detailDoc.name}</h2><p className="text-xs text-slate-500 mt-0.5">{ti.label} · {formatSize(detailDoc.size)} · v1.0</p></div></div>
            <div className="grid grid-cols-2 gap-3 mb-6">{[{ l: 'Type', v: ti.label },{ l: 'Category', v: detailDoc.category },{ l: 'Related To', v: detailDoc.relatedName },{ l: 'Uploaded By', v: detailDoc.uploadedBy },{ l: 'Size', v: formatSize(detailDoc.size) },{ l: 'Modified', v: detailDoc.lastModified }].map(({ l, v }) => (<div key={l} className="bg-slate-50 rounded-xl p-3"><p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{l}</p><p className="text-sm font-medium text-slate-700">{v}</p></div>))}</div>
            <div className="mb-6"><p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Tags</p><div className="flex flex-wrap gap-1.5">{detailDoc.tags.map(t => <span key={t} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium">{t}</span>)}</div></div>
            <div className="border-t border-slate-100 pt-4 space-y-2"><div className="flex gap-2"><button className="flex-1 py-2 rounded-lg bg-[#16A34A] text-white text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-[#15803D] transition-colors"><DocumentDownload size={14} variant="Linear" color="currentColor"/>Download</button><button className="flex-1 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors"><Share size={14} variant="Linear" color="currentColor"/>Share</button></div><div className="flex gap-2"><button className="flex-1 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">Rename</button><button className="flex-1 py-2 rounded-lg border border-red-200 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors">Delete</button></div></div>
            <div className="border-t border-slate-100 pt-4 mt-4"><p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Version History</p><p className="text-xs text-slate-500">v1.0 — No previous versions.</p></div>
          </div>
        </div></div>
      );})()}
    </div>
  );
}
