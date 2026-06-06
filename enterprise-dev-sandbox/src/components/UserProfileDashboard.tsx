import React from 'react';
import { 
  X, 
  User, 
  Shield, 
  Trash2, 
  CheckCircle, 
  FileText, 
  History, 
  Lock, 
  Activity, 
  Mail,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { UserRole, CitizenClaim, CitizenConsent, CNDPPrivacyLog } from '../types';
import { LanguageCode, translations } from '../data/translations';

interface UserProfileDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: {
    name: string;
    roleLabel: string;
    initials: string;
    color: string;
    email?: string;
  };
  currentUserRole: UserRole;
  claims: CitizenClaim[];
  privacyConsent: CitizenConsent;
  privacyLogs: CNDPPrivacyLog[];
  onUpdatePrivacy: (consent: CitizenConsent) => void;
  onClearCitizenData: () => void;
  currentLang: LanguageCode;
}

export default function UserProfileDashboard({
  isOpen,
  onClose,
  currentUser,
  currentUserRole,
  claims,
  privacyConsent,
  privacyLogs,
  onUpdatePrivacy,
  onClearCitizenData,
  currentLang,
}: UserProfileDashboardProps) {
  if (!isOpen) return null;

  const t = translations[currentLang];

  // Derive relevant info based on role
  const userEmail = currentUserRole === 'PUBLIC' ? 'sara.belghiti@gmail.com' :
                    currentUserRole === 'BUSINESS_CAT1' ? 'omar.kabbaj@casablancashop.ma' :
                    currentUserRole === 'BUSINESS_CAT2' ? 'ilyas.omari@anfa-plaza.com' :
                    'fatim.zahra@mairie-casablanca.ma';

  // Filter logs for this user's role or general interactions
  const myLogs = privacyLogs.filter(log => log.affectedRole === currentUserRole || log.affectedRole === 'PUBLIC');

  // Filter claims for this user's role or general
  const myClaims = claims; // Show active claims registered in the simulation

  const handleEraseClick = () => {
    const confirmationMsg = currentLang === 'AR' 
      ? "هل تريد بالتأكيد حذف حسابك وجميع سجلاتك وأنشتطك بضغطة زر واحدة بموجب قانون CNDP؟" 
      : currentLang === 'EN'
      ? "Are you sure you want to permanently erase all your interactions, claims, and logs in 1-click under CNDP rights?"
      : "Voulez-vous vraiment effacer définitivement vos réclamations, consentements et traces de navigation en 1-clic conformément aux droits de la CNDP ? (Cette action est immédiate et irréversible)";

    if (confirm(confirmationMsg)) {
      onClearCitizenData();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        id="user-profile-dashboard"
        className="relative w-full max-w-2xl bg-[#161821] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Banner header with Close lock icon */}
        <div className="px-6 py-4 bg-[#0f111a] border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl bg-[#6C3CFF]/10 flex items-center justify-center border border-[#6C3CFF]/20`}>
              <User className="w-5 h-5 text-[#6C3CFF]" />
            </div>
            <div>
              <h2 className="font-title font-bold text-sm text-white flex items-center gap-2">
                {currentLang === 'AR' ? "لوحة تحكم المستخدم والخصوصية" : currentLang === 'EN' ? "User Profile & Interaction Dashboard" : "Mon Profil & Tableau d'Interactions"}
                <span className="font-mono text-[8px] bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/20 px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">
                  Souverain CNDP
                </span>
              </h2>
              <p className="font-mono text-[9px] text-gray-400 mt-0.5">
                {currentLang === 'AR' ? "إدارة الخصوصية وحذف جميع بياناتك بضغطة زر واحدة" : currentLang === 'EN' ? "Manage your interaction footprint and erase everything in 1-click" : "Pilotez vos traces d'activité et exercez votre droit à l'oubli instantané."}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal body scrollable */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-140px)]">
          
          {/* PROFILE SUMMARY HERO */}
          <div className="p-4 bg-gradient-to-r from-indigo-950/20 to-purple-950/10 border border-[#6C3CFF]/20 rounded-xl flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#12111d] border border-dashed border-[#6C3CFF]/40 flex items-center justify-center text-lg font-bold text-white shrink-0">
              {currentUser.initials}
            </div>
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-title font-bold text-sm text-white truncate">{currentUser.name}</h3>
                <span className={`px-2 py-0.5 rounded font-mono text-[8.5px] font-bold bg-[#6C3CFF]/20 ${currentUser.color}`}>
                  {currentUser.roleLabel}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 text-gray-400 text-[10px] font-mono">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-[#6C3CFF]/60" /> {userEmail}
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="text-[#00ff66] font-bold">Statut CNDP: Conforme (Loi 09-08)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* INTERACTION HISTORY MODULES */}
            <div className="bg-[#0b0d14]/70 rounded-xl p-4 border border-white/5 space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono font-bold text-gray-400 flex items-center gap-1.5 uppercase tracking-wider mb-2">
                  <FileText className="w-4 h-4 text-[#6c3cff]" />
                  {currentLang === 'AR' ? "سجل البلاغات المودعة" : "Signalements Clés"}
                </span>
                
                <p className="text-[10px] text-gray-500 leading-normal mb-3">
                  {currentLang === 'AR' ? "سجل شكاوى البنية التحتية والمطالب المودعة في النظام" : "Historique de vos signalements de voirie et de pannes d'éclairage déclarés."}
                </p>

                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {myClaims.length === 0 ? (
                    <p className="text-gray-500 text-[10px] italic py-2 text-center">Aucun signalement actif.</p>
                  ) : (
                    myClaims.slice(0, 4).map((claim) => (
                      <div key={claim.id} className="p-2 bg-black/40 rounded-lg border border-white/5 flex items-center justify-between text-[10px]">
                        <span className="font-bold text-white truncate max-w-[120px]">{claim.title}</span>
                        <span className={`px-1 rounded font-mono text-[7px] ${
                          claim.status === 'OUVERT' ? 'bg-rose-500/10 text-rose-400' :
                          claim.status === 'EN_COURS' ? 'bg-indigo-500/10 text-indigo-400' :
                          'bg-emerald-500/10 text-emerald-400'
                        }`}>
                          {claim.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <p className="text-[8px] font-mono text-gray-500 mt-2">
                * Soumis cryptographiquement avec un masque d'anonymisation géo-spatial.
              </p>
            </div>

            {/* PRIVACY LOGS LIST */}
            <div className="bg-[#0b0d14]/70 rounded-xl p-4 border border-white/5 space-y-3">
              <span className="text-[11px] font-mono font-bold text-gray-400 flex items-center gap-1.5 uppercase tracking-wider">
                <History className="w-4 h-4 text-emerald-400" />
                {currentLang === 'AR' ? "آخر سجلات التتبع والنشاط" : "Logs d'Activités Récents"}
              </span>

              <p className="text-[10px] text-gray-500 leading-normal">
                {currentLang === 'AR' ? "السجل الزمني للعمليات الأمنية وتغيير الصلاحيات وحفظ الجلسات" : "Traces immuables enregistrées localement sur votre trousseau de clés."}
              </p>

              <div className="space-y-2 max-h-40 overflow-y-auto text-[9.5px] font-mono">
                {myLogs.length === 0 ? (
                  <p className="text-gray-500 italic text-center py-2">Aucun log enregistré.</p>
                ) : (
                  myLogs.slice(0, 5).map((log, idx) => (
                    <div key={idx} className="p-2 bg-[#12111d] rounded-lg border border-white/5 flex flex-col gap-0.5">
                      <div className="flex justify-between items-center text-[7.5px]">
                        <span className="text-indigo-400 font-bold shrink-0">{log.action}</span>
                        <span className="text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-gray-300 font-sans leading-relaxed text-[9px] mt-0.5">{log.details}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* GRANULAR CONSENT SWITCHES INSIDE PROFILE */}
          <div className="bg-[#12111d] border border-white/5 p-4 rounded-xl space-y-3">
            <span className="font-mono text-[10px] font-bold text-[#b5a3ff] uppercase tracking-wider block">
              🔧 {currentLang === 'AR' ? "خيارات الموافقة الصريحة CNDP" : "Gestion Active des Consentements Spécifiques"}
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* GPS position */}
              <button
                onClick={() => {
                  const updated = { ...privacyConsent, location: !privacyConsent.location };
                  onUpdatePrivacy(updated);
                }}
                className="flex items-center justify-between p-2.5 bg-black/40 rounded-xl border border-white/5 text-left hover:border-white/15 transition-all text-xs"
              >
                <div>
                  <div className="font-bold text-white text-[10.5px]">Géolocalisation Fine GPS</div>
                  <p className="text-[8.5px] text-gray-400">Position pour la pharmacie de garde</p>
                </div>
                {privacyConsent.location ? (
                  <ToggleRight className="w-8 h-8 text-[#00ff66] shrink-0 cursor-pointer" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-gray-500 shrink-0 cursor-pointer" />
                )}
              </button>

              {/* Analytics tracking */}
              <button
                onClick={() => {
                  const updated = { ...privacyConsent, analytics: !privacyConsent.analytics };
                  onUpdatePrivacy(updated);
                }}
                className="flex items-center justify-between p-2.5 bg-black/40 rounded-xl border border-white/5 text-left hover:border-white/15 transition-all text-xs"
              >
                <div>
                  <div className="font-bold text-white text-[10.5px]">Analyses d'Audience</div>
                  <p className="text-[8.5px] text-gray-400">Suivi statistique anonyme</p>
                </div>
                {privacyConsent.analytics ? (
                  <ToggleRight className="w-8 h-8 text-[#00ff66] shrink-0 cursor-pointer" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-gray-500 shrink-0 cursor-pointer" />
                )}
              </button>

              {/* Bluetooth Mesh */}
              <button
                onClick={() => {
                  const updated = { ...privacyConsent, ble: !privacyConsent.ble };
                  onUpdatePrivacy(updated);
                }}
                className="flex items-center justify-between p-2.5 bg-black/40 rounded-xl border border-white/5 text-left hover:border-white/15 transition-all text-xs"
              >
                <div>
                  <div className="font-bold text-white text-[10.5px]">Réseau Bluetooth Mesh</div>
                  <p className="text-[8.5px] text-gray-400">Relais offline des voisins</p>
                </div>
                {privacyConsent.ble ? (
                  <ToggleRight className="w-8 h-8 text-[#00ff66] shrink-0 cursor-pointer" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-gray-500 shrink-0 cursor-pointer" />
                )}
              </button>

              {/* AI Profiling */}
              <button
                onClick={() => {
                  const updated = { ...privacyConsent, ai_profiling: !privacyConsent.ai_profiling };
                  onUpdatePrivacy(updated);
                }}
                className="flex items-center justify-between p-2.5 bg-black/40 rounded-xl border border-white/5 text-left hover:border-white/15 transition-all text-xs"
              >
                <div>
                  <div className="font-bold text-white text-[10.5px]">Curation Recommandations IA</div>
                  <p className="text-[8.5px] text-gray-400">Analyse intelligente d'habitudes</p>
                </div>
                {privacyConsent.ai_profiling ? (
                  <ToggleRight className="w-8 h-8 text-[#00ff66] shrink-0 cursor-pointer" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-gray-500 shrink-0 cursor-pointer" />
                )}
              </button>
            </div>
          </div>

          {/* 1-CLICK PURGE ACTIONS */}
          <div className="p-4 bg-rose-950/20 border border-rose-500/20 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="font-bold text-white text-xs flex items-center gap-1.5">
                <Trash2 className="w-4 h-4 text-rose-400" />
                {currentLang === 'AR' ? "Droit à l'oubli • مسح البيانات" : "Droit à l'Oubli & Purge Immédiate (Art. 7)"}
              </span>
              <p className="text-[9.5px] text-gray-400 leading-normal max-w-md">
                Supprimez instantanément l'ensemble de vos données, réclamations et traces stockées. Cette action est souveraine et irréversible.
              </p>
            </div>
            
            <button
              onClick={handleEraseClick}
              className="py-2.5 px-4 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-950/40 cursor-pointer transition-all flex items-center gap-1.5 shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{currentLang === 'AR' ? "مسح البيانات في 1-Clic" : "Purger Tout en 1-Clic"}</span>
            </button>
          </div>

        </div>

        <div className="px-6 py-3 bg-[#0d0f17] border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-gray-500 uppercase">
          <span>Client cryptographique local</span>
          <span>Casablanca Smart City Platform</span>
        </div>
      </div>
    </div>
  );
}
