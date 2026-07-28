import React, { useState } from 'react';
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
  ToggleRight,
  Download,
  Check,
  Fingerprint,
  Info
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

  const [downloading, setDownloading] = useState(false);
  const [anonymizing, setAnonymizing] = useState(false);
  const [proof, setProof] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const t = translations[currentLang];

  // Derive relevant info based on role
  const userEmail = currentUserRole === 'PUBLIC' ? 'sara.belghiti@gmail.com' :
                    currentUserRole === 'PARTENAIRES' ? 'ilyas.omari@anfa-plaza.com' :
                    'fatim.zahra@mairie-casablanca.ma';

  // Filter logs for this user's role or general interactions
  const myLogs = privacyLogs.filter(log => log.affectedRole === currentUserRole || log.affectedRole === 'PUBLIC');

  // Filter claims for this user's role or general
  const myClaims = claims; // Show active claims registered in the simulation

  // CNDP Article 7: Export complete citizen dossier in JSON format
  const handleDownloadMyData = async () => {
    try {
      setDownloading(true);
      const res = await fetch("/api/consent/export-my-data");
      if (!res.ok) {
        throw new Error("Impossible de récupérer votre dossier citoyen. Session expirée ou invalide.");
      }
      const data = await res.json();
      
      // Create actual file download
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", jsonString);
      downloadAnchor.setAttribute("download", `Casablanca_CNDP_Dossier_Portabilite_${currentUser.name.replace(/\s+/g, '_')}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err: any) {
      alert("Erreur lors de l'exportation : " + err.message);
    } finally {
      setDownloading(false);
    }
  };

  // CNDP Article 8: Server-side irreversible anonymization with certificate log
  const handleRightToBeForgotten = async () => {
    const confirmationMsg = currentLang === 'AR' 
      ? "هل تريد بالتأكيد تفعيل حقك النسيان وحذف حسابك وجميع سجلاتك وأنشتطك نهائياً بموجب القانون الـ CNDP؟" 
      : "Voulez-vous vraiment invoquer votre 'Droit à l'Oubli' (Article 8 CNDP) ? Cette opération est irréversible, détruira l'ensemble de vos données nominatives sur le serveur de la Mairie, et générera un certificat d'anonymisation chiffré.";

    if (!confirm(confirmationMsg)) return;

    try {
      setAnonymizing(true);
      const res = await fetch("/api/consent/right-to-be-forgotten", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      
      if (!res.ok) {
        throw new Error("Échec de l'anonymisation serveur.");
      }

      const outcome = await res.json();
      setProof(outcome.proof);
      
      // Clear client state
      onClearCitizenData();
    } catch (err: any) {
      alert("Échec du droit à l'oubli : " + err.message);
    } finally {
      setAnonymizing(false);
    }
  };

  const handleCopyProof = () => {
    if (proof) {
      navigator.clipboard.writeText(JSON.stringify(proof, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
            <div 
              className="w-9 h-9 rounded-xl flex items-center justify-center border"
              style={{ backgroundColor: 'rgb(var(--portal-color-rgb) / 0.1)', borderColor: 'rgb(var(--portal-color-rgb) / 0.2)' }}
            >
              <User className="w-5 h-5" style={{ color: 'var(--portal-color)' }} />
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
          <div 
            className="p-4 bg-gradient-to-r from-slate-900 to-[#12141c] border rounded-xl flex items-center gap-4"
            style={{ borderColor: 'rgb(var(--portal-color-rgb) / 0.2)' }}
          >
            <div 
              className="w-14 h-14 rounded-full bg-[#12111d] border border-dashed flex items-center justify-center text-lg font-bold text-white shrink-0"
              style={{ borderColor: 'rgb(var(--portal-color-rgb) / 0.4)' }}
            >
              {currentUser.initials}
            </div>
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-title font-bold text-sm text-white truncate">{currentUser.name}</h3>
                <span 
                  className={`px-2 py-0.5 rounded font-mono text-[8.5px] font-bold ${currentUser.color}`}
                  style={{ backgroundColor: 'rgb(var(--portal-color-rgb) / 0.2)' }}
                >
                  {currentUser.roleLabel}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 text-gray-400 text-[10px] font-mono">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3" style={{ color: 'rgb(var(--portal-color-rgb) / 0.6)' }} /> {userEmail}
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

          {/* CNDP ARTICLE 7 & 8 REGULATORY COMPLIANCE ACTIONS */}
          <div className="space-y-4 pt-2">
            
            {/* Split actions panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Data Portability (Art. 7) */}
              <div className="p-4 bg-blue-950/10 border border-blue-500/15 rounded-xl space-y-3 flex flex-col justify-between">
                <div>
                  <span className="font-bold text-white text-xs flex items-center gap-1.5 font-sans">
                    <Download className="w-4 h-4 text-blue-400" />
                    Portabilité des Données (Art. 7)
                  </span>
                  <p className="text-[9px] text-gray-400 leading-normal mt-1">
                    Téléchargez instantanément votre dossier citoyen complet au format JSON structuré structurant vos consentements granulaires, vos logs, et vos signalements enregistrés.
                  </p>
                </div>
                
                <button
                  onClick={handleDownloadMyData}
                  disabled={downloading}
                  className="py-2.5 px-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all w-full mt-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{downloading ? "Téléchargement..." : "Télécharger mes données"}</span>
                </button>
              </div>

              {/* Erase Account & Anonymize (Art. 8) */}
              <div className="p-4 bg-rose-950/10 border border-rose-500/15 rounded-xl space-y-3 flex flex-col justify-between">
                <div>
                  <span className="font-bold text-white text-xs flex items-center gap-1.5 font-sans">
                    <Trash2 className="w-4 h-4 text-rose-400" />
                    Droit à l'Oubli (Art. 8)
                  </span>
                  <p className="text-[9px] text-gray-400 leading-normal mt-1">
                    Réclamez l'anonymisation chiffrée définitive et irréversible de l'intégralité de vos comptes, répertoires d'activité géo-spatiaux et transactions de la Mairie.
                  </p>
                </div>
                
                <button
                  onClick={handleRightToBeForgotten}
                  disabled={anonymizing || !!proof}
                  className="py-2.5 px-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all w-full mt-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{anonymizing ? "Anonymisation..." : "Activer le Droit à l'oubli"}</span>
                </button>
              </div>

            </div>

            {/* Proof of Deletion Cryptographic Certificate Display */}
            {proof && (
              <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-3 animate-slide-up">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase">
                    <CheckCircle className="w-4 h-4" />
                    Certificat Souverain d'Anonymisation Validé
                  </span>
                  <button 
                    onClick={handleCopyProof}
                    className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded text-[9px] font-mono flex items-center gap-1 transition-all"
                  >
                    {copied ? <Check className="w-2.5 h-2.5" /> : <Fingerprint className="w-2.5 h-2.5" />}
                    <span>{copied ? "Copié !" : "Copier le JSON"}</span>
                  </button>
                </div>

                <div className="space-y-1.5 font-mono text-[9px] leading-relaxed text-gray-300">
                  <p className="font-sans text-[10.5px] text-emerald-100/90 leading-normal">
                    Conformément à la directive Marocaine <strong>CNDP 09-08 Article 8</strong>, vos identifiants nominatifs ont été complètement anonymisés ou détruits dans la base PostgreSQL de la Mairie.
                  </p>
                  <div className="p-2.5 bg-black/60 rounded-lg border border-emerald-500/10 space-y-1 mt-1 text-gray-400">
                    <div><span className="text-emerald-300 font-bold">Certificate UUID:</span> {proof.certificateId}</div>
                    <div><span className="text-emerald-300 font-bold">Timestamp:</span> {proof.timestamp}</div>
                    <div><span className="text-emerald-300 font-bold">SHA-256 Ledger Witness:</span> <span className="text-gray-300 break-all">{proof.signature}</span></div>
                    <div><span className="text-emerald-300 font-bold">Target Hash:</span> <span className="text-gray-300 break-all">{proof.certificate.targetEmailHash}</span></div>
                    <div><span className="text-emerald-300 font-bold">Officer Sign-off:</span> DPO de la Mairie de Casablanca</div>
                  </div>
                  <p className="text-[8.5px] text-emerald-500/70 italic">
                    * Ce certificat de tombstone immuable a été inséré dans le registre d'audit logs immuable et sert de preuve opposable devant l'autorité de protection.
                  </p>
                </div>
              </div>
            )}

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
