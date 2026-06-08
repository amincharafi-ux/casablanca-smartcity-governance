import React, { useState, useEffect } from 'react';
import { Database, Terminal, Play, Server, Lock, Globe, Layers, Key, Check, Copy, X, FileText, Cpu, AlertTriangle, ShieldAlert, Download, RefreshCw } from 'lucide-react';
import { UserRole } from '../types';
import { cndpMarkdown, ecosystemMarkdown, ctoAuditReportMarkdown } from '../data/downloadCode';

interface DatabaseSpecExplorerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserRole: UserRole;
  eventsCount: number;
  claimsCount: number;
  onAddLog?: (action: string, details: string) => void;
  privacyConsent?: {
    location: boolean;
    analytics: boolean;
    ble: boolean;
    ai_profiling: boolean;
  };
  onUpdatePrivacy?: (consent: any) => void;
  onClearCitizenData?: () => void;
  currentLang?: string;
  initialTab?: 'ARCHITECTURE' | 'DATABASE' | 'SQL_CONSOLE' | 'ENV_CONFIG' | 'CNDP_COMPLIANCE' | 'EVENT_STORE';
  onOpenGithubRoom?: () => void;
}

export default function DatabaseSpecExplorer({
  isOpen,
  onClose,
  currentUserRole,
  eventsCount,
  claimsCount,
  onAddLog,
  privacyConsent = { location: true, analytics: true, ble: true, ai_profiling: true },
  onUpdatePrivacy,
  onClearCitizenData,
  currentLang = 'FR',
  initialTab,
  onOpenGithubRoom,
}: DatabaseSpecExplorerProps) {
  const [activeTab, setActiveTab] = useState<'ARCHITECTURE' | 'DATABASE' | 'SQL_CONSOLE' | 'ENV_CONFIG' | 'CNDP_COMPLIANCE' | 'EVENT_STORE'>('ARCHITECTURE');

  const [sourcedEvents, setSourcedEvents] = useState<any[]>([]);
  const [isEventsLoading, setIsEventsLoading] = useState(false);

  const fetchSourcedEvents = () => {
    setIsEventsLoading(true);
    fetch('/api/events/sourced')
      .then(res => res.json())
      .then(data => {
        setSourcedEvents(data);
      })
      .catch(err => {
        console.error("Failed to load sourced events:", err);
      })
      .finally(() => {
        setIsEventsLoading(false);
      });
  };

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    if (isOpen && activeTab === 'EVENT_STORE') {
      fetchSourcedEvents();
    }
  }, [isOpen, activeTab]);

  const triggerClientDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const [selectedTable, setSelectedTable] = useState<string>('user_profiles');
  const [copiedQuery, setCopiedQuery] = useState(false);
  const [customQuery, setCustomQuery] = useState('SELECT get_events_near(33.5731, -7.5898, 10.0, \'all\');');
  const [consoleResult, setConsoleResult] = useState<any | null>({
    status: "success",
    rows_affected: 3,
    latency_ms: 12,
    results: [
      { id: "evt-01", title: "Jazzablanca Festival 25", category: "CULTURE", price_mad: 200, dist_km: 1.2 },
      { id: "evt-02", title: "Salon International de l'Édition", category: "CULTURE", price_mad: 0, dist_km: 3.4 },
      { id: "evt-03", title: "Marathon International de Casablanca", category: "SPORT", price_mad: 100, dist_km: 4.8 }
    ]
  });

  const [rlsBypass, setRlsBypass] = useState(false);
  const [data, setData] = useState<{ tables: any; presetQueries: any[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // States for CNDP interactive actions
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [isPurging, setIsPurging] = useState(false);
  const [purgeSuccess, setPurgeSuccess] = useState(false);

  // Fetch PostgreSQL/PostGIS details dynamically from secure server endpoint
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setError(null);
      setData(null);

      onAddLog?.("SCHEMA_ACCESS_ATTEMPT", `Tentative d'inspection de la structure de base de données (rôle d'accès: ${currentUserRole}).`);

      // Retrieve real cryptographically signed JWT token from cookie with localStorage fallback
      const getCookieValue = (name: string) => {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : null;
      };
      const rawSessionJwt = getCookieValue("session_jwt") || localStorage.getItem("session_jwt") || "";
      // Sanitize the cookie value to filter out any non-ASCII characters, conforming to ByteString standard
      const sessionJwt = rawSessionJwt.split('').filter(c => c.charCodeAt(0) <= 255).join('');

      fetch('/api/admin/db-schema', {
        headers: {
          'Authorization': `Bearer ${sessionJwt}`
        }
      })
      .then(async (res) => {
        if (!res.ok) {
          const errPayload = await res.json().catch(() => ({}));
          throw new Error(errPayload.error || `Erreur HTTP ${res.status} de l'API de base de données.`);
        }
        return res.json();
      })
      .then((payload) => {
        setData(payload);
        onAddLog?.("SCHEMA_ACCESS_GRANTED", `Accès autorisé aux schémas PostGIS. Signature de session validée.`);
      })
      .catch((err) => {
        setError(err.message || "Consultation interdite: Informations techniques inaccessibles pour ce profil.");
        onAddLog?.("SCHEMA_ACCESS_FORBIDDEN", `ALERTE SECURITE : Tentative frauduleuse de lecture de la structure de base de données par le profil ${currentUserRole}.`);
      })
      .finally(() => {
        setIsLoading(false);
      });
    }
  }, [isOpen, currentUserRole]);

  // Handle RLS Bypass tracking logs
  const handleToggleRlsBypass = (val: boolean) => {
    setRlsBypass(val);
    onAddLog?.("SECURITY_BYPASS_TOGGLE", `Changement d'état RLS Bypass : ${val ? 'ACTIVÉ (Super-Admin Bypass)' : 'DÉSACTIVÉ'}`);
  };

  const tables = data?.tables || {};
  const tablesKeys = Object.keys(tables);
  const currentTableKey = tables[selectedTable] ? selectedTable : (tablesKeys[0] || 'user_profiles');
  const presetQueries = data?.presetQueries || [];

  if (!isOpen) return null;

  if (error) {
    return (
      <div id="db-spec-explorer-error-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
        <div id="db-spec-error-card" className="bg-[#161821] border border-red-500/30 w-full max-w-lg rounded-3xl overflow-hidden flex flex-col shadow-2xl shadow-red-500/5 p-6 space-y-4">
          <div id="db-spec-error-header" className="flex items-center gap-3 border-b border-white/5 pb-3">
            <div id="db-spec-error-icon-box" className="p-2 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 id="db-spec-error-title" className="text-xs font-semibold text-white uppercase tracking-wider">Erreur de Sécurité Majeure</h2>
              <p id="db-spec-error-sub" className="text-[10px] font-mono text-red-400 uppercase tracking-widest mt-0.5">Isolation Backend - Loi CNDP 09-08</p>
            </div>
          </div>
          
          <p id="db-spec-error-message" className="text-gray-300 text-xs leading-relaxed">
            {error}
          </p>
          
          <div id="db-spec-error-details" className="bg-black/40 p-3 rounded-xl border border-white/5 font-mono text-[9px] text-gray-400 space-y-1">
            <p id="db-spec-detail-role">• Rôle Utilisateur : {currentUserRole}</p>
            <p id="db-spec-detail-jwt">• Validation JWT : {error?.toLowerCase().includes("forbidden") || error?.toLowerCase().includes("interdit") || error?.toLowerCase().includes("suffis") || error?.toLowerCase().includes("autoris") || error?.toLowerCase().includes("403") ? "Succès de la Signature (Droits insuffisants pour ce rôle)" : "Échouée ou Manquante"}</p>
            <p id="db-spec-detail-id">• Audit Log ID : aut-{Date.now().toString(16)}</p>
            <p id="db-spec-detail-warn" className="text-red-400 font-bold">• Résultat : Tentative de scan inscrite sur l'historique d'audit de la ville.</p>
          </div>

          <div id="db-spec-error-actions" className="flex justify-end pt-2">
            <button
              id="db-spec-close-error-btn"
              onClick={onClose}
              className="px-4 py-2 bg-red-950/40 border border-red-500/30 hover:bg-red-500 hover:text-white text-red-400 transition-all font-mono text-xs font-bold rounded-xl cursor-pointer"
            >
              Fermer la Session d'Inspection
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div id="db-spec-explorer-loading-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
        <div id="db-spec-loading-card" className="bg-[#0f111a] border border-white/10 w-full max-w-lg rounded-3xl overflow-hidden flex flex-col p-8 items-center justify-center space-y-4 shadow-2xl">
          <div id="db-spec-loader" className="w-12 h-12 rounded-full border-t-2 border-emerald-400 animate-spin"></div>
          <span id="db-spec-loader-text" className="text-xs font-mono text-gray-400 uppercase tracking-widest">
            Vérification du Token JWT d'Administration...
          </span>
          <span id="db-spec-loader-api" className="text-[10px] font-mono text-gray-600 uppercase">
            Route d'API Sécurisée : /api/admin/db-schema
          </span>
        </div>
      </div>
    );
  }

  const runSqlConsole = (query: string) => {
    setCustomQuery(query);
    onAddLog?.("SQL_QUERY_EXECUTION", `Exécution virtuelle de requête : "${query.substring(0, 55)}${query.length > 55 ? '...' : ''}"`);
    const preset = presetQueries.find(p => p.query === query);
    if (preset) {
      setConsoleResult(preset.result);
    } else {
      // Dynamic simulated result
      setConsoleResult({
        status: "success",
        command: query.trim().substring(0, 20) + "...",
        latency_ms: 18,
        dataset: "Dynamic mock simulation response",
        note: "Simulateur SQL compilé avec succès conforme aux schémas PostGis.",
        row: rlsBypass ? "Contournement RLS Activé (Superuser Bypass)" : "Affichage restreinté par sécurité de Row Level Security (RLS)."
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#06070a]/100 animate-fade-in" style={{ backgroundColor: '#06070a' }}>
      <div className="bg-[#0f111a] border border-white/10 w-full max-w-5xl h-[85vh] rounded-[32px] overflow-hidden flex flex-col shadow-2xl shadow-emerald-500/10" style={{ backgroundColor: '#0f111a' }}>
        
        {/* MODAL HEADER */}
        <div className="bg-[#161821] px-6 py-4 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/10 shadow-lg shadow-emerald-500/5">
              <Database className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight uppercase flex items-center gap-2">
                MyCity Casablanca Spec Studio
                <span className="font-mono text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded uppercase font-bold tracking-widest">PostgreSQL v15 + PostGIS</span>
              </h2>
              <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mt-0.5">
                Inspecteur de Base de Données Immuable, Configurations & Conformité Maroc Loi 09-08 (CNDP)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-neutral-900 border border-white/5 hover:border-white/10 text-gray-400 hover:text-white rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* MODAL SIDEBAR NAVIGATION & CONTENT WORKSPACE */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* TAB SIDE-NAVIGATION */}
          <div className="w-full md:w-56 bg-[#121421] border-r border-white/5 p-4 space-y-2 flex flex-row md:flex-col overflow-x-auto md:overflow-y-auto shrink-0 transition-colors">
            <button
              onClick={() => setActiveTab('ARCHITECTURE')}
              className={`w-full text-justify px-3 py-2.5 rounded-xl font-mono text-[10.5px] transition-all flex items-center gap-2 ${
                activeTab === 'ARCHITECTURE' ? 'bg-[#6C3CFF] text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>1. Architecture Stack</span>
            </button>

            <button
              onClick={() => setActiveTab('DATABASE')}
              className={`w-full text-justify px-3 py-2.5 rounded-xl font-mono text-[10.5px] transition-all flex items-center gap-2 ${
                activeTab === 'DATABASE' ? 'bg-[#6C3CFF] text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>2. Schémas SQL (Tables)</span>
            </button>

            <button
              onClick={() => setActiveTab('SQL_CONSOLE')}
              className={`w-full text-justify px-3 py-2.5 rounded-xl font-mono text-[10.5px] transition-all flex items-center gap-2 ${
                activeTab === 'SQL_CONSOLE' ? 'bg-[#6C3CFF] text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>3. Live SQL Console</span>
            </button>

            <button
              onClick={() => setActiveTab('ENV_CONFIG')}
              className={`w-full text-justify px-3 py-2.5 rounded-xl font-mono text-[10.5px] transition-all flex items-center gap-2 ${
                activeTab === 'ENV_CONFIG' ? 'bg-[#6C3CFF] text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Key className="w-4 h-4" />
              <span>4. Configuration .env</span>
            </button>

            <button
              onClick={() => setActiveTab('CNDP_COMPLIANCE')}
              className={`w-full text-justify px-3 py-2.5 rounded-xl font-mono text-[10.5px] transition-all flex items-center gap-2 ${
                activeTab === 'CNDP_COMPLIANCE' ? 'bg-[#6C3CFF] text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>5. Conformité CNDP</span>
            </button>

            <button
              onClick={() => setActiveTab('EVENT_STORE')}
              className={`w-full text-justify px-3 py-2.5 rounded-xl font-mono text-[10.5px] transition-all flex items-center gap-2 ${
                activeTab === 'EVENT_STORE' ? 'bg-[#6C3CFF] text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>6. Journal Event Store</span>
            </button>


          </div>

          {/* MAIN TAB WORKSPACE CONTENT */}
          <div className="flex-1 p-6 overflow-y-auto bg-[#0a0c10] space-y-4">
            
            {/* TAB 1: ARCHITECTURE STACK PANEL */}
            {activeTab === 'ARCHITECTURE' && (
              <div className="space-y-4 animate-fade-in text-xs text-gray-300">
                <div className="flex items-center gap-2 border-b border-white/5 pb-2 text-white justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-[#6C3CFF]" />
                    <span className="font-title font-bold text-sm">Architecture Globale de Production Évolutive</span>
                  </div>
                  <span className="text-[9px] font-mono text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    Conforme Diligence Tech
                  </span>
                </div>

                <p className="leading-relaxed text-gray-400">
                  L'écosystème métropolitain de <strong>MyCity Casablanca</strong> repose sur une infrastructure moderne, haute performance et ultra-sécurisée réconciliant services Web, application mobile unifiée, recherche distribuée et conformité stricte CNDP.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 font-mono text-[10.5px]">
                  {/* FRONTEND & MOBILE */}
                  <div className="bg-[#161821] p-4 rounded-2xl border border-white/5 space-y-2.5">
                    <span className="text-white font-bold border-b border-white/5 pb-1 block flex items-center gap-1.5 text-xs text-[#00f0ff]">
                      📱 Frontend / Canaux Utilisateurs
                    </span>
                    <ul className="space-y-1.5 text-gray-400">
                      <li>
                        <strong className="text-white">Frontend Web :</strong>{' '}
                        <span className="text-[#6C3CFF]">React.js + TypeScript + Tailwind CSS</span>
                        <p className="text-[9px] text-gray-500 mt-0.5 leading-tight">Optimisation SEO, performance native et excellente maintenabilité UI.</p>
                      </li>
                      <li>
                        <strong className="text-white">Application Mobile :</strong>{' '}
                        <span className="text-[#6C3CFF]">Flutter Engine</span>
                        <p className="text-[9px] text-gray-500 mt-0.5 leading-tight">Codebase unique iOS/Android, vitesse et fluidité native à 60 FPS.</p>
                      </li>
                    </ul>
                  </div>

                  {/* BACKEND & APIS */}
                  <div className="bg-[#161821] p-4 rounded-2xl border border-white/5 space-y-2.5">
                    <span className="text-white font-bold border-b border-white/5 pb-1 block flex items-center gap-1.5 text-xs text-emerald-400">
                      ☁️ Services Backend & Moteur de Recherche
                    </span>
                    <ul className="space-y-1.5 text-gray-400">
                      <li>
                        <strong className="text-white">API Core Runtime :</strong>{' '}
                        <span className="text-emerald-400">Node.js + NestJS</span> ou <span className="text-emerald-400">Python + FastAPI</span>
                        <p className="text-[9px] text-gray-500 mt-0.5 leading-tight">Scalabilité horizontale maximale, architecture modulaire et écosystème IA.</p>
                      </li>
                      <li>
                        <strong className="text-white">Search Engine :</strong>{' '}
                        <span className="text-[#00ff99]">Elasticsearch Log/Node</span>
                        <p className="text-[9px] text-gray-500 mt-0.5 leading-tight">Recherche full-text ultra-rapide et tolérante sur les événements, signalements et doléances.</p>
                      </li>
                    </ul>
                  </div>

                  {/* DATABASES & CACHING */}
                  <div className="bg-[#161821] p-4 rounded-2xl border border-white/5 space-y-2.5">
                    <span className="text-white font-bold border-b border-white/5 pb-1 block flex items-center gap-1.5 text-xs text-yellow-400">
                      💾 Écosystème de Stockage Hybride (Relational, Logs & Memory)
                    </span>
                    <ul className="space-y-1.5 text-gray-400">
                      <li>
                        <strong className="text-white">Données Relationnelles :</strong>{' '}
                        <span className="text-amber-400">PostgreSQL (+ PostGIS)</span>
                        <p className="text-[9px] text-gray-500 mt-0.5 leading-tight">Garantie ACID immuable, requêtes géospatiales de métropole.</p>
                      </li>
                      <li>
                        <strong className="text-white">Logs & Événements :</strong>{' '}
                        <span className="text-amber-400">MongoDB database</span>
                        <p className="text-[9px] text-gray-500 mt-0.5 leading-tight">Ingestions à haut débit pour l'historique d'audit et la télémétrie locale.</p>
                      </li>
                      <li>
                        <strong className="text-white">Cache & Sessions :</strong>{' '}
                        <span className="text-amber-400">Redis cache</span>
                        <p className="text-[9px] text-gray-500 mt-0.5 leading-tight">Accélération mémoire, jetons d'authentification et compteurs rate limit.</p>
                      </li>
                    </ul>
                  </div>

                  {/* CLOUD DEPLOYMENT & CI/CD */}
                  <div className="bg-[#161821] p-4 rounded-2xl border border-white/5 space-y-2.5">
                    <span className="text-white font-bold block border-b border-white/5 pb-1 flex items-center gap-1.5 text-xs text-purple-400">
                      🐳 Cloud Infrastructure, CI/CD & API Gateway
                    </span>
                    <ul className="space-y-1.5 text-gray-400">
                      <li>
                        <strong className="text-white">AWS Cloud (Maroc Local Region / EU Closest) :</strong>
                        <p className="text-[9px] text-gray-500 leading-tight mt-0.5">S3 (Stockage titres), RDS (PostgreSQL managé), Lambda (Serverless), CloudFront (CDN).</p>
                      </li>
                      <li>
                        <strong className="text-white">API Gateway :</strong>{' '}
                        <span className="text-purple-400">Kong</span> ou <span className="text-purple-400">AWS API Gateway</span>
                        <p className="text-[9px] text-gray-500 mt-0.5 leading-tight">Gestion centrale : découpage d'URLs, authentification centralisée et sécurité.</p>
                      </li>
                      <li>
                        <strong className="text-white">CI/CD & DevOps Containerization :</strong>
                        <p className="text-[9px] text-gray-500 leading-tight mt-0.5">GitHub Actions, conteneurs Docker et Kubernetes (K8s) ou ECS pour le scaling automatique.</p>
                      </li>
                    </ul>
                  </div>

                  {/* MONITORING & WEBHOOK CONTROLS */}
                  <div className="bg-[#161821] p-4 rounded-2xl border border-white/5 space-y-2.5 col-span-1 md:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-white font-bold border-b border-white/5 pb-1 block text-rose-300">
                          📊 Super-Observabilité & Monitoring
                        </span>
                        <ul className="space-y-1.5 text-gray-400 mt-2">
                          <li>
                            <strong>Datadog / New Relic :</strong> Métriques CPU, RAM et latences d'API.
                          </li>
                          <li>
                            <strong>Sentry :</strong> Centralisation active des erreurs et traces d'exception.
                          </li>
                          <li>
                            <strong>LogRocket :</strong> Relecture de sessions clients pour l'audit d'expérience web.
                          </li>
                        </ul>
                      </div>
                      <div>
                        <span className="text-white font-bold border-b border-white/5 pb-1 block text-sky-400">
                          🤝 Protocoles Connectés & Limites
                        </span>
                        <ul className="space-y-1.5 text-gray-400 mt-2">
                          <li>
                            <strong>GraphQL :</strong> Requêtes complexes (ex. Dashboard Syndic MyHome avec multiples agrégations).
                          </li>
                          <li>
                            <strong>RESTful APIs :</strong> OpenAPI 3.0 Specs, Versioning (v1, v2), Pagination, Filtering.
                          </li>
                          <li>
                            <strong>Webhooks Temps Réel :</strong> Notifications asynchrones instantanées vers partenaires B2B.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RATE LIMIT BANNER */}
                <div className="bg-[#121421] border border-blue-500/10 p-3.5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left font-mono text-[10.5px]">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⏱️</span>
                    <div>
                      <span className="text-white font-bold block">Contrôle de Flux & Protection anti-Abus (Rate Limiting)</span>
                      <p className="text-gray-400 text-[10px] mt-0.5">Le Gateway protège l'infrastructure contre les comportements malveillants.</p>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <div className="bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded text-blue-300 text-center">
                      <strong className="block text-xs font-bold">1,000 req/min</strong>
                      <span className="text-[9px] text-gray-500">Par Citoyen</span>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded text-purple-300 text-center">
                      <strong className="block text-xs font-bold">10,000 req/min</strong>
                      <span className="text-[9px] text-gray-500">Par Partenaire B2B</span>
                    </div>
                  </div>
                </div>

                {/* DETAILED SECURITY HIGHLIGHTS */}
                <div className="bg-neutral-900 border border-white/5 p-4 rounded-2xl space-y-2 font-mono text-[10.5px]">
                  <span className="text-white font-bold block text-rose-400">🛡️ Sécurité Technique & Protection Cypher-Core</span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-gray-400 leading-relaxed">
                    <div className="bg-black/30 p-2.5 rounded-xl border border-white/5 space-y-1">
                      <strong className="text-white block">🔑 Authentification :</strong>
                      Structure JWT + Refresh Tokens, protocole standardisé OAuth2 pour les intégrations de partenaires de billetterie, et validation 2FA optionnelle (SMS/E-mail).
                    </div>
                    <div className="bg-black/30 p-2.5 rounded-xl border border-white/5 space-y-1">
                      <strong className="text-white block">🔒 Chiffrement de Données :</strong>
                      Clés AES-256 de grade militaire pour les dossiers sensibles comme les titres fonciers de Casablanca, et protocoles TLS 1.3 obligatoires en transit.
                    </div>
                    <div className="bg-black/30 p-2.5 rounded-xl border border-white/5 space-y-1">
                      <strong className="text-white block">🛡️ Protection Active :</strong>
                      WAF (Web Application Firewall) configuré pour bloquer les scans de vulnérabilités, Cloudflare DDoS Protection, et validation automatique contre les injections SQL.
                    </div>
                  </div>
                </div>

                {/* BLUEPRINT DOWNLOAD SECTION */}
                <div className="bg-[#101915] border border-emerald-500/15 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
                  <div className="space-y-1 text-left">
                    <span className="text-white font-bold block text-[11px] uppercase tracking-wide">📦 Spécification Technique en Téléchargement (BLUEPRINT.md)</span>
                    <p className="text-gray-400 text-[9.5px] leading-relaxed">
                      Téléchargez directement la spécification technique complète au format Markdown (conforme architecture système, schémas SQL immuables et réglementation CNDP marocaine Loi 09-08).
                    </p>
                  </div>
                  <a
                    href="/api/download-blueprint"
                    download="BLUEPRINT.md"
                    className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white hover:text-black font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shrink-0 cursor-pointer"
                  >
                     <FileText className="w-4 h-4" />
                     <span>TÉLÉCHARGER</span>
                  </a>
                </div>
              </div>
            )}

            {/* TAB 2: SQL SCHEMA EXPLORER */}
            {activeTab === 'DATABASE' && (
              <div className="space-y-4 animate-fade-in flex flex-col h-full">
                <div className="flex items-center gap-2 border-b border-white/5 pb-2 text-white shrink-0">
                  <Database className="w-5 h-5 text-[#6C3CFF]" />
                  <span className="font-title font-bold text-sm">Gestionnaire de Schémas SQL interactif</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full overflow-hidden">
                  
                  {/* SCRIPT SELECTOR LIST */}
                  <div className="bg-[#121421] p-3 rounded-2xl border border-white/5 space-y-2 max-h-[300px] md:max-h-[380px] overflow-y-auto">
                    <span className="font-title font-semibold text-xs text-white block mb-2 uppercase tracking-wide">Toutes les tables (Spec 2.0)</span>
                    <div className="space-y-1">
                      {tablesKeys.map((tKey) => (
                        <button
                          key={tKey}
                          onClick={() => setSelectedTable(tKey)}
                          className={`w-full text-left font-mono text-[10px] px-3 py-2 rounded-xl border transition-all cursor-pointer block ${
                            currentTableKey === tKey
                              ? 'bg-[#1b1d2a] border-[#6C3CFF] text-white font-bold'
                              : 'bg-transparent border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          🌐 {tables[tKey]?.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SCRIPT DETAIL AND CODE */}
                  <div className="md:col-span-2 bg-neutral-900 border border-white/5 p-4 rounded-2xl flex flex-col space-y-3 max-h-[380px] overflow-y-auto">
                    <div className="flex justify-between items-start border-b border-white/5 pb-2">
                      <div>
                        <h4 className="font-title font-bold text-xs text-white uppercase tracking-wide">
                          Table: <span className="text-[#00f0ff] font-mono">{tables[currentTableKey]?.name}</span>
                        </h4>
                        <p className="text-gray-400 text-[10px] mt-0.5">{tables[currentTableKey]?.description}</p>
                      </div>
                      <span className="font-mono text-[9px] bg-red-400/10 text-red-300 border border-red-500/10 px-2 py-0.5 rounded font-bold">
                        {tables[currentTableKey]?.rls}
                      </span>
                    </div>

                    <div className="relative">
                      <button
                        onClick={() => {
                          if (tables[currentTableKey]?.sql) {
                            navigator.clipboard.writeText(tables[currentTableKey].sql);
                            setCopiedQuery(true);
                            setTimeout(() => setCopiedQuery(false), 2000);
                          }
                        }}
                        className="absolute right-3 top-3 px-2 py-1 bg-neutral-950 border border-white/10 hover:border-white/20 text-[9px] font-mono text-gray-400 hover:text-white rounded-lg transition-all cursor-pointer flex items-center gap-1"
                      >
                        {copiedQuery ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedQuery ? 'Copied!' : 'Copy SQL'}</span>
                      </button>

                      <pre className="p-3 bg-[#0c0d12] rounded-xl overflow-x-auto text-emerald-400 font-mono text-[9.5px] text-left leading-relaxed max-r-0">
                        <code>{tables[currentTableKey]?.sql}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: LIVE SQL CONSOLE SIMULATOR */}
            {activeTab === 'SQL_CONSOLE' && (
              <div className="space-y-4 animate-fade-in text-xs text-gray-300">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div className="flex items-center gap-2 text-white">
                    <Terminal className="w-5 h-5 text-emerald-400" />
                    <span className="font-title font-bold text-sm">Console de Simulation PostGis</span>
                  </div>

                  {/* RLS Enforcer controls */}
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 text-[10px] text-gray-400 font-mono hover:text-white cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rlsBypass}
                        onChange={(e) => setRlsBypass(e.target.checked)}
                        className="rounded border-white/20 text-[#6C3CFF] focus:ring-[#6C3CFF]"
                      />
                      <span>Bypass RLS (Superuser Admin)</span>
                    </label>
                  </div>
                </div>

                <p className="text-gray-400 leading-normal">
                  Saisissez ou sélectionnez des instructions SQL pour interroger virtuellement la base PostGis de notre compagnon Casablanca. Le simulateur évalue les contraintes et RLS associées à votre profil actuel : <strong className="text-purple-400 font-mono">{currentUserRole}</strong>.
                </p>

                {/* QUERIES PRESET BUTTONS */}
                <div className="space-y-1.5 font-mono">
                  <span className="text-[9.5px] text-gray-500 block uppercase">Requêtes Recommandées du Blueprint :</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {presetQueries.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => runSqlConsole(item.query)}
                        className="p-2 text-left bg-[#161821] border border-white/5 hover:border-[#6C3CFF] rounded-xl text-[9px] text-[#00f0ff] transition-all cursor-pointer truncate"
                      >
                        ⚡ <strong>{item.label}</strong>
                        <span className="block text-gray-500 font-mono italic mt-0.5 truncate">{item.query}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* TYPING EDITOR BAR */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customQuery}
                    onChange={(e) => setCustomQuery(e.target.value)}
                    placeholder="Saisissez une requête SQL..."
                    className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2 font-mono text-[11px] text-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={() => runSqlConsole(customQuery)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 hover:text-black hover:font-bold text-white rounded-xl transition-all cursor-pointer font-semibold flex items-center gap-1 font-mono text-xs"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Run Query</span>
                  </button>
                </div>

                {/* CONSOLE FEEDBACK PANEL */}
                <div className="space-y-2">
                  <span className="font-mono text-[9px] text-gray-500 block uppercase font-bold tracking-widest">Résultat de la Console</span>
                  <pre className="p-4 bg-[#0c0d12] border border-white/5 rounded-2xl overflow-x-auto text-emerald-400 font-mono text-[10px] text-left leading-relaxed">
                    <code>{JSON.stringify(consoleResult, null, 2)}</code>
                  </pre>
                </div>
              </div>
            )}

            {/* TAB 4: CONFIGURATION .ENV AND API KEYS DEFINITIONS */}
            {activeTab === 'ENV_CONFIG' && (
              <div className="space-y-4 animate-fade-in text-xs text-gray-300">
                <div className="flex items-center gap-2 border-b border-white/5 pb-2 text-white justify-between">
                  <div className="flex items-center gap-2">
                    <Key className="w-5 h-5 text-yellow-400" />
                    <span className="font-title font-bold text-sm">Fichier .env d'Environnement de Production (.env.example)</span>
                  </div>
                  <span className="font-mono text-[9px] bg-yellow-500/10 text-yellow-300 border border-yellow-500/30 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                    Secures Mode Active
                  </span>
                </div>

                <p className="leading-relaxed text-gray-400">
                  Voici le registre complet des variables d'environnement configurées dans <code className="text-yellow-400 text-[11.5px]">.env.example</code> pour l'infrastructure unifiée (PostgreSQL, MongoDB, Redis, AWS API Gateway, et les secrets d'authentification).
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {/* APP SECRETS */}
                  <div className="bg-[#161821] p-3.5 rounded-2xl border border-white/5 space-y-2.5">
                    <span className="text-white font-bold block border-b border-white/5 pb-1 select-none text-[11px] text-[#00f0ff]">
                      🔐 Jetons & Authentification JWT
                    </span>
                    <div className="space-y-1.5 font-mono text-[9.5px]">
                      <div>
                        <span className="text-gray-500 block">JWT_SECRET_KEY</span>
                        <div className="bg-black/40 px-2 py-1.5 rounded border border-white/5 text-[#00ff66] truncate mt-0.5">************************ (AES-256 secure)</div>
                      </div>
                      <div>
                        <span className="text-gray-500 block">JWT_REFRESH_TOKEN_SECRET</span>
                        <div className="bg-black/40 px-2 py-1.5 rounded border border-white/5 text-gray-400 truncate mt-0.5">************************</div>
                      </div>
                      <div>
                        <span className="text-gray-500 block">B2B_OAUTH2_CLIENT_ID</span>
                        <div className="bg-black/40 px-2 py-1.5 rounded border border-white/5 text-[#3ccfff] truncate mt-0.5">mycity_partner_b2b_oauth</div>
                      </div>
                    </div>
                  </div>

                  {/* DATABASES & CACHING */}
                  <div className="bg-[#161821] p-3.5 rounded-2xl border border-white/5 space-y-2.5">
                    <span className="text-white font-bold block border-b border-white/5 pb-1 select-none text-[11px] text-emerald-400">
                      🗄️ Bases de données & Moteur de recherche
                    </span>
                    <div className="space-y-1.5 font-mono text-[9.5px]">
                      <div>
                        <span className="text-gray-500 block">DATABASE_URL_RDS_POSTGRES</span>
                        <div className="bg-black/40 px-2 py-1.5 rounded border border-white/5 text-gray-400 truncate mt-0.5">postgresql://admin:***@rds-pg-casa:5432/mycity</div>
                      </div>
                      <div>
                        <span className="text-gray-500 block">MONGODB_URI_LOGS</span>
                        <div className="bg-black/40 px-2 py-1.5 rounded border border-white/5 text-gray-400 truncate mt-0.5">mongodb+srv://admin:***@mongo-casa/prod_logs</div>
                      </div>
                      <div>
                        <span className="text-gray-500 block">REDIS_CACHE_URL</span>
                        <div className="bg-black/40 px-2 py-1.5 rounded border border-white/5 text-gray-400 truncate mt-0.5">redis://:***@redis-casa-cache:6379</div>
                      </div>
                      <div>
                        <span className="text-gray-500 block">ELASTICSEARCH_NODE_URL</span>
                        <div className="bg-black/40 px-2 py-1.5 rounded border border-white/5 text-gray-400 truncate mt-0.5">https://elasticsearch-casa.local:9200</div>
                      </div>
                    </div>
                  </div>

                  {/* AWS CLOUD KEYS */}
                  <div className="bg-[#161821] p-3.5 rounded-2xl border border-white/5 space-y-2.5">
                    <span className="text-white font-bold block border-b border-white/5 pb-1 select-none text-[11px] text-purple-400">
                      ☁️ AWS Infrastructure Configuration
                    </span>
                    <div className="space-y-1.5 font-mono text-[9.5px]">
                      <div>
                        <span className="text-gray-500 block">AWS_DEFAULT_REGION</span>
                        <div className="bg-black/40 px-2 py-1.5 rounded border border-white/5 text-[#ff8c00] mt-0.5">me-central-1 (Maroc local ou proche UE)</div>
                      </div>
                      <div>
                        <span className="text-gray-500 block">AWS_S3_BUCKET_TITRES_FONCIERS</span>
                        <div className="bg-black/40 px-2 py-1.5 rounded border border-white/5 text-gray-300 truncate mt-0.5">mycity-titres-fonciers-aes256</div>
                      </div>
                      <div>
                        <span className="text-gray-500 block">AWS_ACCESS_KEY_ID</span>
                        <div className="bg-black/40 px-2 py-1.5 rounded border border-white/5 text-gray-400 truncate mt-0.5">AKIAIOSFODNN7EXAMPLE</div>
                      </div>
                    </div>
                  </div>

                  {/* MONITORING CONTROLS */}
                  <div className="bg-[#161821] p-3.5 rounded-2xl border border-white/5 space-y-2.5">
                    <span className="text-white font-bold block border-b border-white/5 pb-1 select-none text-[11px] text-rose-400">
                      📊 Super-Observabilité Metrics
                    </span>
                    <div className="space-y-1.5 font-mono text-[9.5px]">
                      <div>
                        <span className="text-gray-500 block">DATADOG_API_KEY</span>
                        <div className="bg-black/40 px-2 py-1.5 rounded border border-white/5 text-gray-400 truncate mt-0.5">dd******************************f4</div>
                      </div>
                      <div>
                        <span className="text-gray-500 block">SENTRY_DSN</span>
                        <div className="bg-black/40 px-2 py-1.5 rounded border border-white/5 text-gray-400 truncate mt-0.5">https://pubkey@sentry.io/45070104</div>
                      </div>
                      <div>
                        <span className="text-gray-500 block">LOGROCKET_APP_ID</span>
                        <div className="bg-black/40 px-2 py-1.5 rounded border border-white/5 text-gray-400 truncate mt-0.5">mycity-casa/production-web-app</div>
                      </div>
                    </div>
                  </div>

                  {/* EXTERNAL INTEGRATIONS */}
                  <div className="bg-[#161821] p-3.5 rounded-2xl border border-white/5 space-y-2.5 col-span-1 md:col-span-2">
                    <span className="text-white font-bold block border-b border-white/5 pb-1 select-none text-[11px] text-sky-400">
                      ⚡ API Gateway Rate Limits & Partner Keys
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 font-mono text-[9.5px] pt-1">
                      <div>
                        <span className="text-gray-500 block">API_GATEWAY_URL_KONG</span>
                        <div className="bg-black/40 px-2 py-1.5 rounded border border-white/5 text-gray-400 truncate mt-0.5">https://gateway.mycity.ma</div>
                        <span className="text-gray-500 block mt-2">GATEWAY_RATE_LIMIT_USER</span>
                        <div className="bg-black/40 px-2 py-1 rounded border border-white/5 text-white font-bold mt-0.5">1000 / minute</div>
                      </div>
                      <div>
                        <span className="text-gray-500 block">GEMINI_API_KEY</span>
                        <div className="bg-black/40 px-2 py-1.5 rounded border border-white/5 text-gray-400 truncate mt-0.5">AIzaSyB****************_V1_KEY</div>
                        <span className="text-gray-500 block mt-2">GATEWAY_RATE_LIMIT_PARTNER</span>
                        <div className="bg-black/40 px-2 py-1 rounded border border-white/5 text-[#00ffcc] font-bold mt-0.5">10000 / minute</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#1f1915] border border-amber-500/10 p-4 rounded-2xl flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div className="space-y-1 font-mono text-[10px] leading-relaxed text-amber-400">
                    <strong>SECURITY INSTRUCTION FOR GATEWAY :</strong> Toutes les requêtes d'intégration sont acheminées par les filtres de sécurité Kong ou de l'AWS API Gateway. Les authentifications utilisent JWT + Refresh Tokens. Les jetons et secrets ne sont sous aucun prétexte divulgués aux clients finaux.
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: CNDP COMPLIANCE & RGPD DATA MANAGEMENT */}
            {activeTab === 'CNDP_COMPLIANCE' && (
              <div className="space-y-4 animate-fade-in text-xs text-gray-300">
                <div className="flex items-center gap-2 border-b border-white/5 pb-2 text-white">
                  <Lock className="w-5 h-5 text-[#00ff66]" />
                  <span className="font-title font-bold text-sm">Politique de Confidentialité & Grand livre CNDP (Loi 09-08)</span>
                </div>

                <p className="leading-relaxed">
                  Le cadre légal marocain régit la souveraineté numérique des citoyens de Casablanca. Le compagnon intègre proactivement la traçabilité complète de l'accès aux données sensibles.
                </p>

                {/* TABLE OF CNDP COMPLIANCE DETAILS */}
                <div className="bg-[#161821] rounded-2xl border border-white/5 overflow-hidden font-mono text-[10px]">
                  <div className="bg-[#1f1d2a] p-3 text-white font-bold grid grid-cols-4 border-b border-white/5 uppercase tracking-wide">
                    <span>Type de Donnée</span>
                    <span>Base Légale</span>
                    <span>Rétention</span>
                    <span>Protection Activé</span>
                  </div>
                  <div className="divide-y divide-white/5">
                    <div className="p-3 grid grid-cols-4">
                      <span className="text-[#00f0ff]">📍 Géolocalisation Fine</span>
                      <span className="text-gray-400">Consentement Explicite</span>
                      <span className="text-[#00ff66] font-bold">5 min (Purge auto)</span>
                      <span className="text-gray-400">Floutage ST_Buffer 500m</span>
                    </div>
                    <div className="p-3 grid grid-cols-4 py-2.5">
                      <span className="text-[#00f0ff]">👤 Profil & OAuth</span>
                      <span className="text-gray-400">Intérêt Légitime</span>
                      <span className="text-emerald-400">30 jours (Anonymisation)</span>
                      <span className="text-gray-400">JWT + Auto-refresh</span>
                    </div>
                    <div className="p-3 grid grid-cols-4 py-2.5">
                      <span className="text-[#00f0ff]">💳 Transactions / CMI</span>
                      <span className="text-gray-400">Exécution de Contrat</span>
                      <span className="text-yellow-400">5 ans (Fiscalité)</span>
                      <span className="text-gray-400">TLS 1.3 / Proxied server</span>
                    </div>
                    <div className="p-3 grid grid-cols-4 py-2.5">
                      <span className="text-[#00f0ff]">📝 Logs & Événements</span>
                      <span className="text-gray-400">Obligation Légale</span>
                      <span className="text-red-400">Indéterminé (Immuable)</span>
                      <span className="text-gray-400">MongoDB / Hash SHA-256</span>
                    </div>
                    <div className="p-3 grid grid-cols-4 py-2.5">
                      <span className="text-yellow-400">🏠 Titres Fonciers (MyHome)</span>
                      <span className="text-gray-400">Loi 18-00 & 106-12</span>
                      <span className="text-[#6C3CFF] font-bold">Permanent</span>
                      <span className="text-teal-400 font-bold">Chiffrement AES-256</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#12161f] border border-blue-500/10 p-4 rounded-2xl flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div className="space-y-1 text-slate-400 leading-relaxed text-[11px]">
                    <strong className="text-white">CONFORMITÉ DU COMPAGNON CASABLANCA :</strong> Les signalements géolocalisés contiennent une futilité de précision (système "Coarse 500m") garantissant indéfiniment la non-identification du domicile des plaignants. L'utilisateur a le plein droit à la suppression totale de ses données ("Droit d'erasure") immédiat en un clic.
                  </div>
                </div>

                {/* INTERACTIVE CNDP SYSTEM TRANSFERRED FROM USER PORTAL */}
                <div className="bg-[#12111d] border border-[#6C3CFF]/20 p-4 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#9e7cff]" />
                    <span className="font-title font-bold text-xs text-white uppercase tracking-wider">Console de Consentement & Droits de l'Utilisateur</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex items-center gap-2.5 bg-black/45 p-2.5 rounded-xl border border-white/5 cursor-pointer select-none text-[11px] text-gray-300 hover:border-white/10">
                      <input
                        type="checkbox"
                        checked={privacyConsent.location}
                        onChange={() => {
                          const updated = { ...privacyConsent, location: !privacyConsent.location };
                          onUpdatePrivacy?.(updated);
                          onAddLog?.("CNDP_CONSENT_CHG", `Localisation fine GPS position ${!privacyConsent.location ? 'ACTIVÉE' : 'DESACTIVÉE'}`);
                        }}
                        className="accent-[#6C3CFF] rounded w-3.5 h-3.5"
                      />
                      <div>
                        <div className="font-bold text-white text-[10.5px]">📍 Localisation GPS Fine</div>
                        <div className="text-[9px] text-gray-500 font-mono">Précision métrique pour signalements</div>
                      </div>
                    </label>

                    <label className="flex items-center gap-2.5 bg-black/45 p-2.5 rounded-xl border border-white/5 cursor-pointer select-none text-[11px] text-gray-300 hover:border-white/10">
                      <input
                        type="checkbox"
                        checked={privacyConsent.analytics}
                        onChange={() => {
                          const updated = { ...privacyConsent, analytics: !privacyConsent.analytics };
                          onUpdatePrivacy?.(updated);
                          onAddLog?.("CNDP_CONSENT_CHG", `Statistique télémétries logs ${!privacyConsent.analytics ? 'ACTIVÉE' : 'DESACTIVÉE'}`);
                        }}
                        className="accent-[#6C3CFF] rounded w-3.5 h-3.5"
                      />
                      <div>
                        <div className="font-bold text-white text-[10.5px]">📊 Statistiques & Télémétries</div>
                        <div className="text-[9px] text-gray-500 font-mono">Amélioration générale du service</div>
                      </div>
                    </label>

                    <label className="flex items-center gap-2.5 bg-black/45 p-2.5 rounded-xl border border-white/5 cursor-pointer select-none text-[11px] text-gray-300 hover:border-white/10">
                      <input
                        type="checkbox"
                        checked={privacyConsent.ble}
                        onChange={() => {
                          const updated = { ...privacyConsent, ble: !privacyConsent.ble };
                          onUpdatePrivacy?.(updated);
                          onAddLog?.("CNDP_CONSENT_CHG", `Mesh Bluetooth BLE proximity ${!privacyConsent.ble ? 'ACTIVÉE' : 'DESACTIVÉE'}`);
                        }}
                        className="accent-[#6C3CFF] rounded w-3.5 h-3.5"
                      />
                      <div>
                        <div className="font-bold text-white text-[10.5px]">📡 Maillage BLE Proximité</div>
                        <div className="text-[9px] text-gray-500 font-mono">Synchronisation réseau délocalisé</div>
                      </div>
                    </label>

                    <label className="flex items-center gap-2.5 bg-black/45 p-2.5 rounded-xl border border-white/5 cursor-pointer select-none text-[11px] text-gray-300 hover:border-white/10">
                      <input
                        type="checkbox"
                        checked={privacyConsent.ai_profiling}
                        onChange={() => {
                          const updated = { ...privacyConsent, ai_profiling: !privacyConsent.ai_profiling };
                          onUpdatePrivacy?.(updated);
                          onAddLog?.("CNDP_CONSENT_CHG", `Profilage IA comportemental ${!privacyConsent.ai_profiling ? 'ACTIVÉE' : 'DESACTIVÉE'}`);
                        }}
                        className="accent-[#6C3CFF] rounded w-3.5 h-3.5"
                      />
                      <div>
                        <div className="font-bold text-white text-[10.5px]">🧠 Intelligence Artificielle</div>
                        <div className="text-[9px] text-gray-500 font-mono">Dictionnaire de recommandation et prédiction</div>
                      </div>
                    </label>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5 text-[10.5px]">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setIsExporting(true);
                          onAddLog?.("CNDP_EX_DATA", "Demande d'export de l'historique de l'utilisateur relative à la loi 09-08 marocaine");
                          setTimeout(() => {
                            setIsExporting(false);
                            setExportSuccess(true);
                            
                            // Mock JSON download
                            const doc = {
                              cndp_decree: "Law 09-08 Compliance Dossier",
                              timestamp: new Date().toISOString(),
                              jurisdiction: "Kingdom of Morocco",
                              system: "Casablanca Sovereign Agent Engine",
                              citizen_consents: privacyConsent,
                              data_stores: {
                                postgres_citizen_claims: "Protected with SHA-256",
                                local_sqlite_buffer: "Anonymized via ST_Buffer"
                              }
                            };
                            const blob = new Blob([JSON.stringify(doc, null, 2)], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `Souverain-CNDP-Dossier-09-08.json`;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);

                            setTimeout(() => setExportSuccess(false), 4000);
                          }, 1500);
                        }}
                        disabled={isExporting}
                        className="px-3 py-1.5 bg-[#1b1c2b] text-[#9E8BFF] hover:bg-[#6c3cff] hover:text-white rounded-xl border border-[#6C3CFF]/25 font-bold cursor-pointer select-none transition-all flex items-center gap-1.5 disabled:opacity-50 text-[10.5px]"
                      >
                        {isExporting ? "Préparation..." : "Exporter mon Dossier CNDP (Loi 09-08)"}
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm("Êtes-vous sûr de vouloir purger définitivement toutes vos données ?")) {
                            setIsPurging(true);
                            onAddLog?.("CNDP_PURGE_ALL", "Purge complète et définitive de toutes les données personnelles");
                            setTimeout(() => {
                              onClearCitizenData?.();
                              setIsPurging(false);
                              setPurgeSuccess(true);
                              setTimeout(() => setPurgeSuccess(false), 4400);
                            }, 2000);
                          }
                        }}
                        disabled={isPurging}
                        className="px-3 py-1.5 bg-rose-950/40 border border-rose-500/20 text-rose-300 hover:bg-rose-900 hover:text-white rounded-xl font-bold cursor-pointer select-none transition-all flex items-center gap-1.5 disabled:opacity-50 text-[10.5px]"
                      >
                        {isPurging ? "Purge..." : "Purger définitivement mes données"}
                      </button>

                      <div className="hidden sm:block h-5 w-[1px] bg-white/10 mx-1"></div>

                      <button
                        onClick={() => {
                          onAddLog?.("CNDP_EXP_MD_CODE", "Téléchargement du code complet d'intégration CNDP (.md)");
                          triggerClientDownload(cndpMarkdown, "cndp_integration_codebase.md");
                        }}
                        className="px-3 py-1.5 bg-purple-900/30 hover:bg-purple-800 border border-purple-500/30 text-purple-200 rounded-xl font-bold cursor-pointer transition-all flex items-center gap-1.5 text-[10.5px]"
                        title="Télécharger le fichier de code d'intégration CNDP Loi 09-08"
                      >
                        <Download className="w-3.5 h-3.5 text-purple-400" />
                        <span>Télécharger Code CNDP (.md)</span>
                      </button>

                      <button
                        onClick={() => {
                          onAddLog?.("CNDP_EXP_MD_ECOSYSTEM", "Téléchargement de l'intégralité de l'écosystème MyCity (.md)");
                          triggerClientDownload(ecosystemMarkdown, "mycity_ecosystem_codebase.md");
                        }}
                        className="px-3 py-1.5 bg-indigo-900/30 hover:bg-indigo-800 border border-indigo-500/30 text-indigo-200 rounded-xl font-bold cursor-pointer transition-all flex items-center gap-1.5 text-[10.5px]"
                        title="Télécharger l'écosystème complet MyCity Casablanca Smart City"
                      >
                        <Download className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Télécharger Écosystème (.md)</span>
                      </button>

                      <button
                        onClick={() => {
                          onAddLog?.("CNDP_EXP_MD_CTO_AUDIT", "Appel à la Tech Data Room (GitHub)");
                          if (onOpenGithubRoom) {
                            onOpenGithubRoom();
                            onClose();
                          } else {
                            triggerClientDownload(ctoAuditReportMarkdown, "cto_audit_report.md");
                          }
                        }}
                        className="px-3 py-1.5 bg-amber-900/30 hover:bg-amber-800 border border-amber-500/30 text-amber-200 rounded-xl font-bold cursor-pointer transition-all flex items-center gap-1.5 text-[10.5px]"
                        title="Ouvrir la Tech Data Room (GitHub) intégrée"
                      >
                        <Cpu className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                        <span>Ouvrir GitHub Tech Suite</span>
                      </button>
                    </div>

                    {exportSuccess && (
                      <span className="text-emerald-400 font-mono text-[9px] animate-pulse">✓ Dossier téléchargé (.json)</span>
                    )}
                    {purgeSuccess && (
                      <span className="text-rose-400 font-mono text-[9px] animate-pulse">✓ Données purgées !</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: EVENT STORE PANELS */}
            {activeTab === 'EVENT_STORE' && (
              <div className="space-y-4 animate-fade-in text-xs text-gray-300">
                <div id="event-store-panel-header" className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div className="flex items-center gap-2 text-white">
                    <Database className="w-5 h-5 text-indigo-400" />
                    <span className="font-title font-bold text-sm">Registre Event Sourcing (Table : event_store)</span>
                  </div>
                  <button
                    onClick={fetchSourcedEvents}
                    disabled={isEventsLoading}
                    className="px-3 py-1.5 bg-[#6C3CFF]/20 hover:bg-[#6c3cff]/30 text-white font-mono text-[10px] rounded-lg border border-[#6c3cff]/40 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isEventsLoading ? "animate-spin" : ""}`} />
                    <span>Actualiser</span>
                  </button>
                </div>

                <p className="text-[11px] text-gray-400 font-mono leading-relaxed">
                  Conformément au principe d'immutabilité de l'architecture Event Sourcing, chaque action significative est conservée en tant qu'événement atomique dans la table <code className="text-[#00f0ff]">event_store</code>.
                </p>

                {isEventsLoading ? (
                  <div className="flex items-center justify-center py-12 text-gray-500 font-mono text-xs">
                    <RefreshCw className="w-5 h-5 animate-spin text-indigo-400 mr-2" />
                    Chargement du flux d'événements...
                  </div>
                ) : sourcedEvents.length === 0 ? (
                  <div className="bg-black/40 border border-white/5 rounded-2xl p-8 text-center text-gray-500 font-mono text-xs">
                    Aucun événement dans le Journal Event Store pour le moment.
                    <br />
                    <span className="text-[10px] text-gray-600">Allez faire des actions (Déposer un signalement, le résoudre ou cliquer sur les fiches de commerce) pour en journaliser !</span>
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-white/5 rounded-xl bg-[#0b0c14]">
                    <table className="w-full text-left border-collapse font-mono text-[10.5px]">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/5 uppercase text-gray-400 tracking-wider">
                          <th className="p-3">ID Événement</th>
                          <th className="p-3">Type d'Événement</th>
                          <th className="p-3">Agrégat ID</th>
                          <th className="p-3">Acteur</th>
                          <th className="p-3">Payload (Détails)</th>
                          <th className="p-3">Horodatage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sourcedEvents.map((evt) => (
                          <tr key={evt.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="p-3 text-gray-500 text-[9.5px]" title={evt.id}>{evt.id.substring(0, 13)}...</td>
                            <td className="p-3">
                              <span className={`px-2.5 py-0.5 rounded-full font-bold text-[9px] ${
                                evt.eventType === 'SIGNALEMENT_CREE' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                evt.eventType === 'SIGNALEMENT_FERME' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                evt.eventType === 'COMMERCE_VISITE' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                                'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                              }`}>
                                {evt.eventType}
                              </span>
                            </td>
                            <td className="p-3 text-indigo-300 font-bold">{evt.aggregateId || "—"}</td>
                            <td className="p-3 text-gray-300">{evt.actor}</td>
                            <td className="p-3 max-w-xs text-[10px]" title={JSON.stringify(evt.payload)}>
                              <div className="font-sans text-gray-400 max-h-12 overflow-y-auto">
                                {Object.entries(evt.payload || {}).map(([k, v]) => (
                                  <div key={k} className="truncate">
                                    <span className="font-mono text-indigo-400 shrink-0">{k}:</span> {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td className="p-3 text-gray-400 text-[10px]">{new Date(evt.timestamp).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}



          </div>

        </div>

        {/* MODAL FOOTER */}
        <div className="bg-[#161821] px-6 py-4 border-t border-white/5 flex items-center justify-between shrink-0 font-mono text-[10px] text-gray-500">
          <span>MyCity Engine Core Sim Server v1.5 • Active Connection</span>
          <span className="text-emerald-400 select-none">● MESH SECURE SHIELDS ENGAGED</span>
        </div>

      </div>
    </div>
  );
}
