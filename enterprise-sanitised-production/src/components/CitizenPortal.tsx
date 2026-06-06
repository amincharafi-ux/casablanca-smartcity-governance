import React, { useState } from 'react';
import { 
  AlertCircle, 
  CheckCircle, 
  FileText,
  MapPin,
  ClipboardList
} from 'lucide-react';
import { CitizenClaim } from '../types';
import { translations, LanguageCode } from '../data/translations';

interface CitizenPortalProps {
  claims: CitizenClaim[];
  onSubmitClaim: (claim: Omit<CitizenClaim, 'id' | 'createdAt' | 'replies'>) => void;
  currentLang?: LanguageCode;
}

export default function CitizenPortal({
  claims,
  onSubmitClaim,
  currentLang = 'FR',
}: CitizenPortalProps) {
  const t = translations[currentLang];

  // Submit claim states
  const [claimCategory, setClaimCategory] = useState<'CHAUSEE' | 'ECLAIRAGE' | 'DECHETS' | 'EAU_ASSAINISSEMENT'>('CHAUSEE');
  const [claimTitle, setClaimTitle] = useState('');
  const [claimDesc, setClaimDesc] = useState('');
  const [claimLocation, setClaimLocation] = useState('Anfa Prolongé, Casablanca');
  const [showClaimSuccess, setShowClaimSuccess] = useState(false);

  // Submit claim helper
  const handleCreateClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitClaim({
      citizenName: 'Anonyme',
      category: claimCategory,
      title: claimTitle,
      description: claimDesc,
      location: claimLocation,
      status: 'OUVERT',
      satisfactionScore: undefined
    });

    setClaimTitle('');
    setClaimDesc('');
    setShowClaimSuccess(true);

    setTimeout(() => {
      setShowClaimSuccess(false);
    }, 6000);
  };

  return (
    <div id="citizen-portal-container" className="space-y-6">
      {/* Services de la Ville header banner */}
      <div className="bg-[#0f111a] border border-white/5 rounded-2xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#6C3CFF]/10 border border-[#6C3CFF]/20 flex items-center justify-center text-[#6C3CFF]">
          <FileText className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-title font-bold text-sm text-white flex items-center gap-2">
            {currentLang === 'AR' ? "بوابة الشكاوى والخدمات البلدية" : currentLang === 'EN' ? "City Infrastructure Claims Portal" : "Portail Signalements & Services Municipaux"}
          </h2>
          <p className="font-mono text-[9px] text-gray-400 mt-0.5 truncate">
            {currentLang === 'AR' ? "سجل شكايتك البلدية مباشرة لتحسين البنية التحتية المحلية للدار البيضاء" : currentLang === 'EN' ? "Directly report neighborhood concerns to help the Casablanca administration improve infrastructure" : "Signalez directement tout incident de voirie pour aider l'administration de Casablanca"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: FILING FORM */}
        <div className="lg:col-span-7 bg-[#161821] border border-white/5 p-4 rounded-2xl space-y-4 shadow-lg">
          <div className="flex items-center gap-2 text-rose-400">
            <AlertCircle className="w-5 h-5 font-title" />
            <div>
              <h3 className="font-title font-bold text-sm text-white">{t.claimFormTitle}</h3>
              <p className="font-mono text-[10px] text-gray-400">{t.claimFormSub}</p>
            </div>
          </div>

          <form onSubmit={handleCreateClaimSubmit} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-gray-400 mb-1">{t.claimCategoryLabel}</label>
                <select
                  value={claimCategory}
                  onChange={(e) => setClaimCategory(e.target.value as any)}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-gray-500 font-mono focus:outline-none focus:border-[#6c3cff] transition-all cursor-pointer"
                >
                  <option value="CHAUSEE">{t.claimCategoryChaussee}</option>
                  <option value="ECLAIRAGE">{t.claimCategoryEclairage}</option>
                  <option value="DECHETS">{t.claimCategoryDechets}</option>
                  <option value="EAU_ASSAINISSEMENT">{t.claimCategoryEau}</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-gray-400 mb-1">{t.claimLocationLabel}</label>
                <input
                  type="text"
                  value={claimLocation}
                  onChange={(e) => setClaimLocation(e.target.value)}
                  placeholder={t.claimLocationPlaceholder}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#6c3cff] transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-gray-400 mb-1">{t.claimSubjectLabel}</label>
              <input
                type="text"
                value={claimTitle}
                onChange={(e) => setClaimTitle(e.target.value)}
                placeholder={t.claimSubjectPlaceholder}
                className="w-full bg-black/40 border border-[#6C3CFF]/20 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#6c3cff] transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-gray-400 mb-1">{t.claimDescLabel}</label>
              <textarea
                value={claimDesc}
                onChange={(e) => setClaimDesc(e.target.value)}
                rows={3}
                placeholder={t.claimDescPlaceholder}
                className="w-full bg-black/40 border border-[#6C3CFF]/20 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#6c3cff] transition-all"
                required
              />
            </div>

            <div className="p-2 bg-indigo-950/20 border border-indigo-500/15 rounded-xl font-mono text-[9px] text-[#93a5ff] flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{t.claimCndpWarning}</span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                id="submit-claim-form-btn"
                className="px-4 py-2.5 bg-[#6c3cff] hover:bg-[#5324e9] text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-lg hover:shadow-[#6C3CFF]/25 active:scale-95"
              >
                {t.claimSubmitBtn}
              </button>
            </div>
          </form>

          {showClaimSuccess && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono rounded-xl mt-2 flex items-center gap-2 animate-pulse">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>{t.claimSuccess}</span>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: RECENT SIGNALEMENTS LIST */}
        <div className="lg:col-span-5 bg-[#161821] border border-white/5 p-4 rounded-2xl flex flex-col justify-between shadow-lg">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-indigo-400">
              <ClipboardList className="w-5 h-5" />
              <h3 className="font-title font-bold text-sm text-white">
                {currentLang === 'AR' ? "سجل البلاغات المودعة" : currentLang === 'EN' ? "Filed Claims Register" : "Registre des Signalements"}
              </h3>
            </div>
            
            <p className="text-[10px] text-gray-400 leading-normal font-sans">
              {currentLang === 'AR' ? "تعقب تقدم وحالة الشكاوى التي تم إرسالها من قبل مختلف مواطني الدائرة" : currentLang === 'EN' ? "Track real-time status and resolutions for infrastructure issues flagged by residents" : "Suivez l'avancement et l'état de résolution des pannes et signalements déclarés par la communauté."}
            </p>

            <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
              {claims.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-white/5 bg-[#0b0d14]/50 text-center text-gray-500 text-[11px]">
                  {currentLang === 'AR' ? "لم يتم الإبلاغ عن أي حادثة حتى الآن." : "Aucun signalement déposé pour l'instant."}
                </div>
              ) : (
                <div className="divide-y divide-white/5 border border-white/5 bg-black/20 rounded-xl">
                  {claims.map((claim) => (
                    <div key={claim.id} className="p-2.5 flex items-center justify-between gap-3 text-[11px]">
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white truncate text-[10.5px]">{claim.title}</span>
                          <span className={`px-1.5 py-0.5 rounded font-mono text-[7.5px] font-bold ${
                            claim.category === 'CHAUSEE' ? 'bg-amber-500/10 text-amber-400' :
                            claim.category === 'ECLAIRAGE' ? 'bg-yellow-500/10 text-yellow-400' :
                            claim.category === 'DECHETS' ? 'bg-teal-500/10 text-teal-400' :
                            'bg-sky-500/10 text-sky-400'
                          }`}>
                            {claim.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500 text-[9px]">
                          <MapPin className="w-2.5 h-2.5 text-gray-600 shrink-0" />
                          <span className="truncate uppercase font-mono">{claim.location}</span>
                        </div>
                      </div>
                      <div>
                        <span className={`px-2 py-0.5 rounded-full font-mono text-[8px] font-bold shrink-0 ${
                          claim.status === 'OUVERT' ? 'bg-rose-500/15 text-rose-400 border border-rose-500/10' :
                          claim.status === 'EN_COURS' ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/10' :
                          'bg-emerald-500/15 text-emerald-400 border border-emerald-500/10'
                        }`}>
                          {claim.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 text-[9px] text-gray-500 font-mono flex items-center justify-between mt-4">
            <span>MyCity Infrastructure Ledger</span>
            <span className="text-indigo-400 font-bold">CASABLANCA</span>
          </div>
        </div>
      </div>
    </div>
  );
}
