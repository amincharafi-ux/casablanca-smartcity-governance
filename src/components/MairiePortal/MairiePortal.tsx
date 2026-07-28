import React, { useState } from 'react';
import { ShieldCheck, MessageSquare, AlertCircle, Send, CheckCircle, BarChart2, Eye, Server, RefreshCw, Sparkles, Phone, Shield, MapPin, TrendingUp } from 'lucide-react';
import { CitizenClaim, PharmacyDeGarde, HospitalStatus, CNDPPrivacyLog } from '../../types';
import { translations, LanguageCode } from '../../data/translations';

interface MairiePortalProps {
  claims: CitizenClaim[];
  pharmacies: PharmacyDeGarde[];
  hospitals: HospitalStatus[];
  privacyLogs: CNDPPrivacyLog[];
  onUpdateClaimStatus: (claimId: string, newStatus: CitizenClaim['status'], reply?: string) => void;
  onAddLog: (action: string, details: string) => void;
  currentLang?: LanguageCode;
  onChangeUserRole?: (role: any) => void;
  onChangeActiveModule?: (module: 'URBAN' | 'MYHOME') => void;
  onOpenSqlSpec?: () => void;
  currentUserRole?: any;
}

export default function MairiePortal({
  claims,
  pharmacies,
  hospitals,
  privacyLogs,
  onUpdateClaimStatus,
  onAddLog,
  currentLang = 'FR',
  onChangeUserRole,
  onChangeActiveModule,
  onOpenSqlSpec,
  currentUserRole,
}: MairiePortalProps) {
  const t = translations[currentLang];

  const [activeSubTab, setActiveSubTab] = useState<'DASHBOARD' | 'CLAIMS' | 'WORKFLOW' | 'MARKETPLACE' | 'SERVICES' | 'FLASH' | 'AUDIT' | 'USERS'>('DASHBOARD');

  const currentCityForTenant = localStorage.getItem('mycity_city') || 'Casablanca';

  // -------------------------------------------------------------
  // MUNICIPAL WORKFLOW & WORK ORDERS STATE
  // -------------------------------------------------------------
  const [departments] = useState([
    { id: 'dept-1', name: 'Service Voirie & Réfection Routes', manager: 'M. Ahmed Laroui', staff: 24 },
    { id: 'dept-2', name: 'Service Éclairage Métropolitain', manager: 'Mme. Fatime-Zahra', staff: 12 },
    { id: 'dept-3', name: 'Réseau Eau & Assainissement', manager: 'M. Rachid El Ghandour', staff: 18 },
    { id: 'dept-4', name: 'Hygiène & Collecte Déchets (Casa Baia)', manager: 'M. Salim Alami', staff: 45 },
  ]);

  const [agents, setAgents] = useState([
    { id: 'ag-1', name: 'Youssef Alaoui', email: 'youssef.a@casa.ma', status: 'DISPONIBLE', department: 'dept-1', badge: 'M-7831', phone: '+212661334455' },
    { id: 'ag-2', name: 'Amina Chraïbi', email: 'amina.c@casa.ma', status: 'DISPONIBLE', department: 'dept-2', badge: 'M-2245', phone: '+212661556677' },
    { id: 'ag-3', name: 'Omar Bennani', email: 'omar.b@casa.ma', status: 'EN_MISSION', department: 'dept-1', badge: 'M-5511', phone: '+212661889900' },
    { id: 'ag-4', name: 'Samira Belkacem', email: 'samira.b@casa.ma', status: 'DISPONIBLE', department: 'dept-4', badge: 'M-1024', phone: '+212661223344' },
  ]);

  const [workOrders, setWorkOrders] = useState([
    { id: 'wo-1', claimId: 'claim-102', agentId: 'ag-3', title: 'Collecte débordante Marché Solidaire', instructions: 'Rétablir la salubrité de la voirie et redéployer les bennes de Casa Baia.', priority: 'URGENT', status: 'EN_COURS', scheduledAt: '2026-06-10', completedAt: null as string | null, createdAt: new Date().toISOString() }
  ]);

  const [claimHistory, setClaimHistory] = useState([
    { id: 'h-1', claimId: 'claim-102', formerStatus: 'OUVERT', newStatus: 'EN_COURS', agentEmail: 'fz.mayor@mairie-casablanca.ma', notes: 'Transmission fiches d\'exploitation Casa Baia.', timestamp: '2026-06-09T14:20:00Z' },
    { id: 'h-2', claimId: 'claim-103', formerStatus: 'EN_COURS', newStatus: 'RESOLU', agentEmail: 'fz.mayor@mairie-casablanca.ma', notes: 'Enrobé rapide chaud posé par agents municipaux.', timestamp: '2026-05-21T16:00:00Z' }
  ]);

  const [selectedClaimForWO, setSelectedClaimForWO] = useState<string>('');
  const [selectedAgentForWO, setSelectedAgentForWO] = useState<string>('');
  const [woInstructionsInput, setWoInstructionsInput] = useState<string>('');
  const [woPriorityInput, setWoPriorityInput] = useState<'NORMAL' | 'URGENT' | 'CRITIQUE'>('NORMAL');

  // -------------------------------------------------------------
  // TERRITORY MARKETPLACE, SUBSCRIPTIONS & CERTIFIED INVOICES STATE
  // -------------------------------------------------------------
  const [marketplaceProducts] = useState([
    { id: 'p-1', title: 'Passe Piscine Municipale Maarif', description: 'Accès mensuel illimité aux bassins chauffés.', price: 150 },
    { id: 'p-2', title: 'Abonnement Parking Résidant Gauthier', description: 'Vignette officielle d\'occupation de voirie pour 1 mois.', price: 300 },
    { id: 'p-3', title: 'Ticket Théâtre National Mohamed V', description: 'Billet standard pour la pièce "L\'Amour à Casa" le 18 juin.', price: 80 },
    { id: 'p-4', title: 'Validation Plan d\'Aménagement Syndic', description: 'Frais administratifs légaux de dépôt de dossier sous Dahir 18-00.', price: 450 },
  ]);

  const [myOrders, setMyOrders] = useState([
    { id: 'ord-10041', productId: 'p-2', qty: 1, subtotal: 300, tva: 60, total: 360, status: 'LIVRÉ', date: '2026-06-08' }
  ]);

  const [myInvoices, setMyInvoices] = useState([
    { id: 'inv-100251', orderId: 'ord-10041', subtotal: 300, tva: 60, total: 360, hash: 'sha256-a19bd8c78c3b40d6eef2d08a0dca959952a6a57ba8d6c7b39a3fcfd9a8c0efee', date: '2026-06-08' }
  ]);

  const [lastInvoiceJustGenerated, setLastInvoiceJustGenerated] = useState<any | null>(null);

  // Simulation parameters for multi-tenant cyber security
  const [rlsAttacking, setRlsAttacking] = useState(false);
  const [rlsAttackResult, setRlsAttackResult] = useState<'IDLE' | 'BLOCKED'>('IDLE');

  const handleCreateWorkOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClaimForWO || !selectedAgentForWO) return;
    
    const targetClaim = claims.find(c => c.id === selectedClaimForWO);
    const targetAgent = agents.find(a => a.id === selectedAgentForWO);
    if (!targetClaim || !targetAgent) return;

    const newWOId = `wo-${Date.now().toString().substring(8)}`;
    const newWO = {
      id: newWOId,
      claimId: selectedClaimForWO,
      agentId: selectedAgentForWO,
      title: `Intervention: ${targetClaim.title}`,
      instructions: woInstructionsInput || 'Intervention standard de salubrité et réparation.',
      priority: woPriorityInput,
      status: 'ASSIGNED',
      scheduledAt: new Date().toISOString().split('T')[0],
      completedAt: null as string | null,
      createdAt: new Date().toISOString(),
    };

    setWorkOrders(prev => [newWO, ...prev]);

    // Transition claim status to EN_COURS
    onUpdateClaimStatus(selectedClaimForWO, 'EN_COURS', `Mission d'intervention #${newWOId} initiée. Agent d'exploitation assigné : ${targetAgent.name} (${targetAgent.badge}).`);
    
    // Add to history
    const newHistoryEntry = {
      id: `h-${Date.now()}`,
      claimId: selectedClaimForWO,
      formerStatus: targetClaim.status,
      newStatus: 'EN_COURS' as const,
      agentEmail: targetAgent.email,
      notes: `Affection du Bon de Travail #${newWOId}. Instructions techniques: ${newWO.instructions}`,
      timestamp: new Date().toISOString()
    };
    setClaimHistory(prev => [newHistoryEntry, ...prev]);

    // Update agent status to EN_MISSION
    setAgents(prev => prev.map(a => a.id === selectedAgentForWO ? { ...a, status: 'EN_MISSION' } : a));

    // Clear inputs
    setSelectedClaimForWO('');
    setSelectedAgentForWO('');
    setWoInstructionsInput('');

    onAddLog("Work Order Dispatch", `Création du Bon #${newWOId} assigné à ${targetAgent.name} pour l'incident #${selectedClaimForWO}.`);
  };

  const handleBuyProduct = (productId: string) => {
    const prod = marketplaceProducts.find(p => p.id === productId);
    if (!prod) return;

    const ordId = `ord-${Date.now().toString().substring(8)}`;
    const sub = prod.price;
    const tvaVal = Math.round(sub * 0.20 * 100) / 100; // 20% Moroccan TVA normal rate
    const tot = sub + tvaVal;

    const freshOrder = {
      id: ordId,
      productId,
      qty: 1,
      subtotal: sub,
      tva: tvaVal,
      total: tot,
      status: 'APPROUVÉ',
      date: new Date().toISOString().split('T')[0]
    };

    const invNum = `inv-${Date.now().toString().substring(7)}`;
    // SHA-256 Mock hash generator
    const hexChars = '0123456789abcdef';
    let mockHash = 'sha256-';
    for (let i = 0; i < 64; i++) {
      mockHash += hexChars[Math.floor(Math.random() * 16)];
    }

    const freshInvoice = {
      id: invNum,
      orderId: ordId,
      subtotal: sub,
      tva: tvaVal,
      total: tot,
      hash: mockHash,
      date: new Date().toISOString().split('T')[0]
    };

    setMyOrders(prev => [freshOrder, ...prev]);
    setMyInvoices(prev => [freshInvoice, ...prev]);
    setLastInvoiceJustGenerated(freshInvoice);

    onAddLog("Marketplace Transact", `Achat du produit : "${prod.title}". Facture certifiée émise : #${invNum} (Total ${tot} MAD incluant TVA 20% de ${tvaVal} MAD).`);
  };

  const simulateRlsHostileAttack = () => {
    setRlsAttacking(true);
    setRlsAttackResult('IDLE');
    onAddLog("Security Threat Audit", `Simulation d'attaque par injection : essai de lecture inter-tenant des comptes SQL.`);
    setTimeout(() => {
      setRlsAttacking(false);
      setRlsAttackResult('BLOCKED');
    }, 1200);
  };

  // Simulated User Accounts state list
  const [simulatedAccounts, setSimulatedAccounts] = useState([
    { id: 'usr-1', name: 'Sara Belghiti', role: 'PUBLIC', email: 'sara.belghiti@casacity.ma', status: 'Actif', tier: 'Citoyen Gratuit', consent: 'Conforme CNDP (Loi 09-08)', initials: 'SB', color: '#10b981' },
    { id: 'usr-2', name: 'Omar Kabbaj', role: 'BUSINESS_CAT1', email: 'o.kabbaj@cafegauthier.ma', status: 'Actif', tier: 'Basic Formule (299 MAD)', consent: 'Conforme CNDP (Loi 09-08)', initials: 'OK', color: '#9ca3af' },
    { id: 'usr-3', name: 'Ilyas El Omari', role: 'BUSINESS_CAT2', email: 'i.elomari@premiumcasablanca.ma', status: 'Actif', tier: 'Premium Formule (799 MAD)', consent: 'Conforme CNDP (Loi 09-08)', initials: 'IE', color: '#3ccfff' },
    { id: 'usr-4', name: 'Mme. Fatim-Zahra', role: 'MAIRIE', email: 'fz.mayor@mairie-casablanca.ma', status: 'Actif', tier: 'Conseil Municipal Admin', consent: 'Conforme Immuable', initials: 'FZ', color: '#ff3c83' },
    { id: 'usr-5', name: 'Khadija Chraibi', role: 'PUBLIC', email: 'k.chraibi@copro-alkasbah.ma', status: 'Copropriétaire', tier: 'Résident Al Kasbah (Apt 14)', consent: 'Conforme CNDP (Loi 09-08)', initials: 'KC', color: '#10b981', isResidentFlow: true },
    { id: 'usr-6', name: 'Yassine Alami', role: 'PUBLIC', email: 'y.alami@syndic-alkasbah.ma', status: 'Syndic Élu', tier: 'Syndic Certifié (Loi 18-00)', consent: 'Conforme CNDP (Loi 09-08)', initials: 'YA', color: '#a78bfa', isSyndicFlow: true }
  ]);

  const [banStatus, setBanStatus] = useState<Record<string, boolean>>({});

  const handleToggleBan = (userId: string, name: string) => {
    const isNowBanned = !banStatus[userId];
    setBanStatus(prev => ({ ...prev, [userId]: isNowBanned }));
    onAddLog(isNowBanned ? "Ban Simulated" : "Unban Simulated", `${isNowBanned ? 'Bannissement' : 'Restauration'} immuable simulé pour le compte de ${name}.`);
  };

  // Claim moderation panel states
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(claims[0]?.id || null);
  const [municipalMsgInput, setMunicipalMsgInput] = useState('');

  // Universal Message Flash fields
  const [flashMessage, setFlashMessage] = useState('⚠️ VAGUE DE CHALEUR : Distribution d\'eau minérale gratuite aux points de services de Maârif.');
  const [flashZone, setFlashZone] = useState('ALL');
  const [flashFeedback, setFlashFeedback] = useState(false);

  // Gemini AI automatic claims report
  const [aiReport, setAiReport] = useState<any | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const handleUpdateClaimSubmit = (claimId: string, status: CitizenClaim['status']) => {
    onUpdateClaimStatus(claimId, status, municipalMsgInput);
    setMunicipalMsgInput('');
    onAddLog("Claim Triage", `Mise à jour du statut ticket #${claimId} vers [${status}] avec réponse administrative.`);
  };

  const handlePostFlashMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flashMessage.trim()) return;

    setFlashFeedback(true);
    onAddLog("Universal Flash Alert", `Diffusion de l'alerte Flash à destination de "${flashZone === 'ALL' ? 'Toute la ville' : flashZone}": ${flashMessage}`);
    setTimeout(() => {
      setFlashFeedback(false);
      setFlashMessage('');
    }, 2500);
  };

  // Perform backend query to analyze claims with Gemini 2.0/2.5 AI
  const handleQueryGeminiClaimsAnalysis = async () => {
    setAiLoading(true);
    setAiReport(null);
    try {
      const response = await fetch('/api/gemini/analyze-claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claims })
      });

      if (!response.ok) {
        throw new Error("Erreur de retour de l'API de modération.");
      }

      const reportData = await response.json();
      setAiReport(reportData);
      onAddLog("Gemini Moderation Query", "Génération automatique du rapport analytique IA de sécurité par la Mairie.");
    } catch (err: any) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const activeClaim = claims.find(c => c.id === selectedClaimId);

  // Strategic statistics calculations
  const resolvedCount = claims.filter(c => c.status === 'RESOLU').length;
  const resolutionPercentage = claims.length > 0 ? (resolvedCount / claims.length) * 100 : 100;
  
  return (
    <div id="mairie-portal-container" className="space-y-4 text-xs">
      
      {/* Top Strategical stats summary banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-gray-300">
        <div className="bg-[#161821] border border-white/5 p-3 rounded-lg flex items-center justify-between animate-fade-in">
          <div>
            <span className="text-gray-500 text-[10px] uppercase block">{t.statsResolutionRate}</span>
            <span className="text-sm font-bold text-[#00ff66]">{resolutionPercentage.toFixed(0)} %</span>
          </div>
          <CheckCircle className="w-5 h-5 text-emerald-400" />
        </div>

        <div className="bg-[#161821] border border-white/5 p-3 rounded-lg flex items-center justify-between animate-fade-in">
          <div>
            <span className="text-gray-500 text-[10px] uppercase block">{t.statsOpenClaims}</span>
            <span className="text-sm font-bold text-red-400">{claims.filter(c => c.status === 'OUVERT').length} incidents</span>
          </div>
          <AlertCircle className="w-5 h-5 text-red-400" />
        </div>

        <div className="bg-[#161821] border border-white/5 p-3 rounded-lg flex items-center justify-between animate-fade-in">
          <div>
            <span className="text-gray-500 text-[10px] uppercase block">{t.statsResolutionBeds}</span>
            <span className="text-sm font-bold text-yellow-400">4.8 / 5 ⭐</span>
          </div>
          <BarChart2 className="w-5 h-5 text-yellow-500" />
        </div>
      </div>

      {/* Sub Menu */}
      <div className="flex border-b border-white/5 bg-[#0f111a] rounded-lg p-1 gap-1 overflow-x-auto scroller-hidden">
        <button
          id="mairie-tab-dashboard"
          onClick={() => setActiveSubTab('DASHBOARD')}
          className={`px-3 py-1.5 rounded text-center transition-all cursor-pointer font-semibold text-xs whitespace-nowrap min-w-[70px] ${
            activeSubTab === 'DASHBOARD' ? 'bg-[#6c3cff] text-white shadow' : 'text-gray-400 hover:text-white'
          }`}
        >
          Dashboard Analytics
        </button>
        <button
          id="mairie-tab-claims"
          onClick={() => setActiveSubTab('CLAIMS')}
          className={`px-3 py-1.5 rounded text-center transition-all cursor-pointer font-semibold text-xs whitespace-nowrap min-w-[70px] ${
            activeSubTab === 'CLAIMS' ? 'bg-[#6c3cff] text-white shadow' : 'text-gray-400 hover:text-white'
          }`}
        >
          {t.mairieTabClaims} ({claims.filter(c => c.status !== 'RESOLU').length})
        </button>
        <button
          id="mairie-tab-workflow"
          onClick={() => setActiveSubTab('WORKFLOW')}
          className={`px-3 py-1.5 rounded text-center transition-all cursor-pointer font-semibold text-xs whitespace-nowrap min-w-[70px] ${
            activeSubTab === 'WORKFLOW' ? 'bg-[#d97706] text-white shadow' : 'text-gray-400 hover:text-white'
          }`}
        >
          🛠️ Flux Municipal
        </button>
        <button
          id="mairie-tab-marketplace"
          onClick={() => setActiveSubTab('MARKETPLACE')}
          className={`px-3 py-1.5 rounded text-center transition-all cursor-pointer font-semibold text-xs whitespace-nowrap min-w-[70px] ${
            activeSubTab === 'MARKETPLACE' ? 'bg-[#059669] text-white shadow' : 'text-gray-400 hover:text-white'
          }`}
        >
          🏪 Place de Marché
        </button>
        <button
          id="mairie-tab-services"
          onClick={() => setActiveSubTab('SERVICES')}
          className={`px-3 py-1.5 rounded text-center transition-all cursor-pointer font-semibold text-xs whitespace-nowrap min-w-[70px] ${
            activeSubTab === 'SERVICES' ? 'bg-[#6c3cff] text-white shadow' : 'text-gray-400 hover:text-white'
          }`}
        >
          {t.mairieTabServices}
        </button>
        <button
          id="mairie-tab-users"
          onClick={() => setActiveSubTab('USERS')}
          className={`px-3 py-1.5 rounded text-center transition-all cursor-pointer font-semibold text-xs whitespace-nowrap min-w-[70px] ${
            activeSubTab === 'USERS' ? 'bg-[#6c3cff] text-white shadow' : 'text-gray-400 hover:text-white'
          }`}
        >
          Comptes Utilisateurs
        </button>
        <button
          id="mairie-tab-flash"
          onClick={() => setActiveSubTab('FLASH')}
          className={`px-3 py-1.5 rounded text-center transition-all cursor-pointer font-semibold text-xs whitespace-nowrap min-w-[70px] ${
            activeSubTab === 'FLASH' ? 'bg-[#6c3cff] text-white shadow' : 'text-gray-400 hover:text-white'
          }`}
        >
          {t.mairieTabFlash}
        </button>
        <button
          id="mairie-tab-audit"
          onClick={() => setActiveSubTab('AUDIT')}
          className={`px-3 py-1.5 rounded text-center transition-all cursor-pointer font-semibold text-xs whitespace-nowrap min-w-[70px] flex-1 ${
            activeSubTab === 'AUDIT' ? 'bg-[#6c3cff] text-white shadow' : 'text-gray-400 hover:text-white'
          }`}
        >
          {t.mairieTabAudit}
        </button>
      </div>

      {/* DASHBOARD TAB WORKSPACE */}
      {activeSubTab === 'DASHBOARD' && (
        <div id="mairie-dashboard-panel" className="space-y-4 animate-fade-in">
          {/* Main Grid: Categories, Geography and System Health */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* 1. Categorized Claims distribution with styled progress bars */}
            <div className="bg-[#161821] p-4 rounded-xl border border-white/5 space-y-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold text-xs font-mono uppercase tracking-wider flex items-center gap-1.5">
                    Répartition par Thème
                  </span>
                  <span className="font-mono text-[10px] text-gray-400 font-semibold">{claims.length} au total</span>
                </div>
                <p className="text-[10px] text-gray-400 leading-normal mt-1">
                  Distribution fonctionnelle des incidents actifs déclarés par les citoyens de Casablanca.
                </p>

                <div className="space-y-2 mt-3.5">
                  {[
                    { label: 'Voirie & Route', count: claims.filter(c => c.category === 'CHAUSEE' || c.title.toLowerCase().includes('nid') || c.title.toLowerCase().includes('trou') || c.title.toLowerCase().includes('carref')).length, color: 'bg-indigo-500' },
                    { label: 'Éclairage Public', count: claims.filter(c => c.category === 'ECLAIRAGE' || c.title.toLowerCase().includes('panne') || c.title.toLowerCase().includes('lamp') || c.title.toLowerCase().includes('sombre')).length, color: 'bg-yellow-500' },
                    { label: 'Propreté & Déchets', count: claims.filter(c => c.category === 'DECHETS' || c.title.toLowerCase().includes('poubelle') || c.title.toLowerCase().includes('déchet') || c.title.toLowerCase().includes('ordure')).length, color: 'bg-emerald-500' },
                    { label: 'Eau & Canalisations', count: claims.filter(c => c.category === 'EAU_ASSAINISSEMENT' || c.title.toLowerCase().includes('fuite') || c.title.toLowerCase().includes('eau') || c.title.toLowerCase().includes('égout')).length, color: 'bg-cyan-500' },
                    { label: 'Sécurité & Citoyenneté', count: claims.filter(c => c.category === 'AUTRE' || c.title.toLowerCase().includes('bruit') || c.title.toLowerCase().includes('commerce') || c.title.toLowerCase().includes('syndic') || c.title.toLowerCase().includes('incendie')).length, color: 'bg-rose-500' },
                  ].map((cat, i) => {
                    const pct = claims.length > 0 ? (cat.count / claims.length) * 100 : 0;
                    return (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-mono">
                          <span className="text-gray-300 font-sans">{cat.label}</span>
                          <span className="text-white font-bold">{cat.count} ({pct.toFixed(0)}%)</span>
                        </div>
                        <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
                          <div className={`h-full ${cat.color} rounded-full transition-all duration-500`} style={{ width: `${Math.max(pct, 5)}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 2. Geographic SLA compliance by Arrondissements */}
            <div className="bg-[#161821] p-4 rounded-xl border border-white/5 space-y-3.5 flex flex-col justify-between">
              <div>
                <span className="text-white font-semibold text-xs font-mono uppercase tracking-wider flex items-center gap-1.5">
                  Performance Territoriale
                </span>
                <p className="text-[10px] text-gray-400 leading-normal mt-1">
                  Temps de résolution estimé et conformité SLA par pôle urbain de Casablanca.
                </p>

                <div className="space-y-3 mt-3.5">
                  {[
                    { zone: 'Maârif / Gauthier', perf: '94%', delay: '1.8 j', status: 'Optimal', badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                    { zone: 'Sidi Maârouf / Oasis', perf: '89%', delay: '2.5 j', status: 'Conforme', badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                    { zone: 'Anfa / Aïn Diab', perf: '82%', delay: '3.1 j', status: 'Conforme', badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                    { zone: 'Roches Noires / Belvédère', perf: '68%', delay: '4.7 j', status: 'Attention', badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                  ].map((arr, i) => (
                    <div key={i} className="p-2 bg-black/20 rounded-lg flex items-center justify-between border border-white/5">
                      <div className="space-y-0.5">
                        <span className="text-gray-300 font-bold block text-[10px]">{arr.zone}</span>
                        <span className="text-[9px] text-gray-500 font-mono">Délai moyen : <strong className="text-gray-400">{arr.delay}</strong></span>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <span className="text-xs font-bold font-mono text-white">{arr.perf} SLA</span>
                        <span className={`px-1 rounded-[4px] border font-mono text-[7.5px] uppercase font-bold ${arr.badgeColor}`}>{arr.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Sovereign Cybersecurity, Registry and Identity sync */}
            <div className="bg-[#161821] p-4 rounded-xl border border-white/5 space-y-3.5 flex flex-col justify-between">
              <div>
                <span className="text-white font-semibold text-xs font-mono uppercase tracking-wider flex items-center gap-1.5">
                  Souveraineté & Cyber-Défense
                </span>
                <p className="text-[10px] text-gray-400 leading-normal mt-1">
                  Sûreté cryptographique des clés, registres CNDP et logs immuables.
                </p>

                <div className="space-y-2 mt-3.5 font-mono text-[10px]">
                  <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                    <span className="text-gray-400">Uptime Services Cloud Run</span>
                    <span className="text-[#00ff66] font-bold">99.998% (Actif)</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                    <span className="text-gray-400">Base Drizzle Relational</span>
                    <span className="text-white font-bold">PostgreSQL Active</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                    <span className="text-gray-400">Intégrité Sessions JWT</span>
                    <span className="text-[#00f0ff] font-bold">256-bit HS256 Active</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                    <span className="text-gray-400">Registres d'Audits CNDP</span>
                    <span className="text-purple-400 font-bold">{privacyLogs.length} Entrées Scellées</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 pt-2">
                    <span className="text-gray-400">Assainissement Doppler Vault</span>
                    <span className="text-emerald-400 font-bold uppercase text-[9px] bg-emerald-500/15 border border-emerald-500/20 px-1.5 py-0.5 rounded">Activé</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Analytical Deep-Dive / AI Insight Generation inside Dashboard */}
          <div className="p-4 bg-gradient-to-r from-[#0f111a] via-[#161821] to-[#0f111a] border border-[#6c3cff]/15 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#6c3cff]/10 flex items-center justify-center border border-[#6c3cff]/20 shrink-0">
                <Sparkles className="w-5 h-5 text-[#6c3cff]" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-title font-bold text-xs text-white">Analyse Prédictive par Intelligence Artificielle</h4>
                <p className="text-[10px] text-gray-400 max-w-xl">
                  Générez un rapport de tri automatisé des goulots d'étranglement urbains ou des pannes récurrentes avec l'IA Souveraine Gemini.
                </p>
              </div>
            </div>
            <button
              id="mairie-dash-ai-btn"
              onClick={handleQueryGeminiClaimsAnalysis}
              disabled={aiLoading}
              className="px-4 py-2 bg-[#6c3cff] hover:bg-[#5329df] disabled:bg-[#6c3cff]/40 text-white font-bold text-[10px] uppercase font-mono rounded flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              {aiLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Analyse en cours...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Consulter l'IA</span>
                </>
              )}
            </button>
          </div>

          {/* If AI Report loaded, show it inside Dashboard too! */}
          {aiReport && (
            <div className="p-4 bg-[#0a0c10] border border-white/5 rounded-xl space-y-3 animate-fade-in text-xs leading-relaxed text-gray-300">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-white font-bold font-mono text-xs flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                  Rapport Analytique Généré par Gemini AI
                </span>
                <span className="text-[9px] text-[#00f0ff] bg-indigo-950/40 border border-indigo-700/30 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">Automatique</span>
              </div>
              <div className="space-y-2 text-[11px] max-h-48 overflow-y-auto pr-1">
                <p className="font-bold text-indigo-300">📌 Synthèse des Priorities Urbaines :</p>
                <p className="text-gray-400">{aiReport.analysis || "Rapports d'incident urbains impeccables détectés."}</p>
                
                <p className="font-bold text-emerald-400 mt-2">🛡️ Recommandations de Planification Municipale :</p>
                <div className="bg-black/20 p-2.5 rounded border border-white/5 font-mono text-[10px] text-slate-300 whitespace-pre-line">
                  {aiReport.moderationAdvice || "Aucune alerte prioritaire détectée pour le moment."}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Triage Workspace */}
      {activeSubTab === 'CLAIMS' && (
        <div id="mairie-claims-panel" className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Claims checklist pipeline */}
          <div className="bg-[#161821] p-3 rounded-xl border border-white/5 space-y-2.5">
            <span className="font-title font-semibold text-xs text-white block">{t.claimsQueueTitle}</span>
            
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {claims.map((claim) => (
                <button
                  key={claim.id}
                  id={`mairie-claim-card-${claim.id}`}
                  onClick={() => setSelectedClaimId(claim.id)}
                  className={`w-full text-justify p-2.5 rounded-lg border text-xs transition-all cursor-pointer block ${
                    selectedClaimId === claim.id 
                      ? 'bg-neutral-900 border-[#6c3cff]/60 shadow-lg' 
                      : 'bg-[#1b1d2a] border-transparent hover:border-white/5'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-[9px] text-[#00f0ff]">{claim.id}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[8px] font-mono text-white ${
                      claim.status === 'OUVERT' ? 'bg-red-500' :
                      claim.status === 'EN_COURS' ? 'bg-yellow-500 text-black font-semibold' : 'bg-emerald-500'
                    }`}>
                      {claim.status}
                    </span>
                  </div>
                  <h4 className="font-semibold text-white truncate">{claim.title}</h4>
                  <p className="text-gray-500 text-[10px] truncate">{claim.location}</p>
                </button>
              ))}
            </div>

            {/* AI Claims summary button */}
            <button
              id="mairie-ai-audit-btn"
              onClick={handleQueryGeminiClaimsAnalysis}
              disabled={aiLoading}
              className="w-full py-2 bg-[#6c3cff] hover:bg-[#5329df] text-white font-mono font-bold text-[10px] rounded flex items-center justify-center gap-1.5 transition-all cursor-pointer uppercase shadow-lg"
            >
              {aiLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  {t.aiReportLoading}
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  {t.aiReportGenerateBtn}
                </>
              )}
            </button>
          </div>

          {/* Active Claim details and resolution form */}
          <div className="bg-[#161821] p-4 rounded-xl border border-white/5 md:col-span-2 space-y-4">
            {activeClaim ? (
              <div className="space-y-3">
                <div className="flex justify-between items-start border-b border-white/5 pb-2">
                  <div>
                    <span className="font-mono text-[8.5px] text-gray-500">{t.claimDetailsTitle} {activeClaim.id}</span>
                    <h3 className="font-title font-bold text-sm text-white">{activeClaim.title}</h3>
                    <p className="text-gray-400 font-mono text-[10px] mt-0.5">🟢 {activeClaim.location}</p>
                  </div>
                  <div className="text-right text-[10.5px] font-mono">
                    <span className="text-gray-400 block mb-0.5">{t.anonymousCitizen}:</span>
                    <strong className="text-white block">{activeClaim.citizenName}</strong>
                  </div>
                </div>

                <div className="bg-black/30 p-3 rounded text-gray-300 leading-relaxed text-xs">
                  {activeClaim.description}
                </div>

                {/* Conversation flow */}
                <div className="space-y-2">
                  <span className="font-mono text-[9px] text-gray-500 uppercase block">{t.claimHistoryExchange}</span>
                  <div className="max-h-[120px] overflow-y-auto space-y-1.5 pr-1">
                    {activeClaim.replies.map((rep, idx) => (
                      <div key={idx} className={`p-2 rounded max-w-[90%] ${
                        rep.sender === 'MAIRIE' ? 'bg-[#1e2030] border border-white/5 mr-auto' : 'bg-neutral-900 ml-auto border border-white/5'
                      }`}>
                        <div className="flex justify-between font-mono text-[8px] text-[#00f0ff] mb-1">
                          <span>{rep.sender === 'MAIRIE' ? '🏛️ Administration' : `📱 ${activeClaim.citizenName}`}</span>
                          <span>{new Date(rep.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-gray-300 italic">"{rep.message}"</p>
                      </div>
                    ))}
                    {activeClaim.replies.length === 0 && (
                      <span className="text-gray-600 block text-[10px] italic">{t.claimHistoryEmpty}</span>
                    )}
                  </div>
                </div>

                {/* Status action station */}
                {activeClaim.status !== 'RESOLU' ? (
                  <div className="pt-2 border-t border-white/5 space-y-2.5">
                    <span className="text-gray-500 text-[9.5px] font-mono block uppercase">{t.claimReplyLabel}</span>
                    <textarea
                      value={municipalMsgInput}
                      onChange={(e) => setMunicipalMsgInput(e.target.value)}
                      placeholder={t.claimReplyPlaceholder}
                      className="w-full bg-black/40 border border-white/10 rounded p-2 text-xs text-white focus:outline-none"
                      rows={2}
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        id="claim-status-executing"
                        onClick={() => handleUpdateClaimSubmit(activeClaim.id, 'EN_COURS')}
                        className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-500 text-black font-title font-bold text-[10.5px] rounded transition-colors cursor-pointer"
                      >
                        {t.engageWorkBtn}
                      </button>
                      
                      <button
                        id="claim-status-resolved"
                        onClick={() => handleUpdateClaimSubmit(activeClaim.id, 'RESOLU')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-[#00ff66] text-white hover:text-black font-title font-bold text-[10.5px] rounded transition-colors cursor-pointer"
                      >
                        {t.resolveIncidentBtn}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-950/20 text-emerald-400 border border-emerald-500/20 rounded-lg flex items-center justify-between font-mono">
                    <span>{t.incidentResolvedCndpAlert}</span>
                    {activeClaim.satisfactionScore && <span>{t.satisfactionScoreLabel} {activeClaim.satisfactionScore}/5 ⭐</span>}
                  </div>
                )}
              </div>
            ) : (
              <span className="text-gray-500 italic block py-12 text-center text-xs">{t.selectIncidentPlaceholder}</span>
            )}

            {/* Render AI summary claims response outcomes */}
            {aiReport && (
              <div className="bg-[#121422] border border-[#a78bfa]/20 rounded-xl p-4 space-y-3 mt-4 animate-stagger">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5 text-indigo-400 font-bold uppercase tracking-wide">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>Gemini AI Safety Modératrice</span>
                  </div>
                  <button
                    onClick={() => setAiReport(null)}
                    className="text-gray-500 hover:text-white transition-colors cursor-pointer text-xs"
                  >
                    {t.aiReportCloseBtn}
                  </button>
                </div>

                <div className="text-gray-300 font-mono text-[10.5px] whitespace-pre-line text-justify leading-relaxed">
                  {aiReport.summary}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px] font-mono">
                  <div className="bg-black/30 p-2 rounded">
                    <span className="text-red-400 font-bold block mb-1">{t.aiReportCriticalZones}</span>
                    <ul className="list-disc pl-3 text-gray-400 space-y-0.5">
                      {aiReport.criticalZones.map((z: string, i: number) => (
                        <li key={i}>{z}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-black/30 p-2 rounded">
                    <span className="text-[#00f0ff] font-bold block mb-1">{t.aiReportActions}</span>
                    <ol className="list-decimal pl-3 text-gray-400 space-y-0.5">
                      {aiReport.actions.map((act: string, i: number) => (
                        <li key={i}>{act}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FLUX MUNICIPAL: WORKFLOWS AND DISPATCH */}
      {activeSubTab === 'WORKFLOW' && (
        <div id="mairie-workflow-panel" className="space-y-6 animate-fade-in">
          {/* Header context */}
          <div className="bg-gradient-to-r from-amber-600/10 to-transparent p-4 rounded-2xl border border-amber-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-title font-bold text-sm text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                🛠️ Gestionnaire de Flux Municipal — {currentCityForTenant} Enterprise
              </h3>
              <p className="text-[10px] font-mono text-gray-400">
                Liaison d'exploitation : Signalement citoyen → Émission Bon d'Intervention → Dispatch de l'Agent → Clôture
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-1 bg-amber-950/40 text-amber-300 border border-amber-500/20 rounded">
                SaaS Tenant Isolation Policy Active
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Col: Dispatch Form (5 cols) */}
            <div className="lg:col-span-5 bg-[#161821] border border-white/5 p-4 rounded-xl flex flex-col justify-between shadow-md">
              <div className="space-y-4">
                <span className="font-title font-semibold text-xs text-white block pb-2 border-b border-white/5">
                  📋 Émettre un Nouveau Bon de Travail (Work Order)
                </span>

                <form onSubmit={handleCreateWorkOrder} className="space-y-3 font-mono text-[11px]">
                  <div>
                    <label className="block text-[10px] text-gray-400 mb-1">1. Sélectionner l'Incident (Filtre Ouverts)</label>
                    <select
                      value={selectedClaimForWO}
                      onChange={(e) => setSelectedClaimForWO(e.target.value)}
                      required
                      className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-white text-[11px] font-semibold"
                    >
                      <option value="">-- Choisir un signalement actif --</option>
                      {claims.filter(c => c.status !== 'RESOLU').map(c => (
                        <option key={c.id} value={c.id}>
                          [{c.id}] {c.title.substring(0, 35)}... ({c.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-400 mb-1">2. Assignation d'un Agent Municipal</label>
                    <select
                      value={selectedAgentForWO}
                      onChange={(e) => setSelectedAgentForWO(e.target.value)}
                      required
                      className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-white text-[11px] font-semibold"
                    >
                      <option value="">-- Choisir un technicien qualifié --</option>
                      {agents.map(a => {
                        const dept = departments.find(d => d.id === a.department);
                        return (
                          <option key={a.id} value={a.id}>
                            {a.name} ({a.badge} - {a.status}) — {dept?.name.substring(8, 25)}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-gray-400 mb-1">Priorité RLS</label>
                      <select
                        value={woPriorityInput}
                        onChange={(e) => setWoPriorityInput(e.target.value as any)}
                        className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-white text-[11px]"
                      >
                        <option value="NORMAL">Standard</option>
                        <option value="URGENT">🚨 Urgente</option>
                        <option value="CRITIQUE">🔥 Critique</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-400 mb-1">Date Prévue</label>
                      <input
                        type="text"
                        disabled
                        value="Aujourd'hui (Planifié)"
                        className="w-full bg-black/10 border border-white/5 rounded px-2 py-1.5 text-gray-500 text-[10px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-400 mb-1">Instructions d'Exploitation Techniques</label>
                    <textarea
                      rows={3}
                      value={woInstructionsInput}
                      onChange={(e) => setWoInstructionsInput(e.target.value)}
                      placeholder="Indiquer le matériel requis (enrobé chaud, nacelle électrique, raccordement de câbles ou vannes...)"
                      className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-white text-[11px] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white font-title text-xs font-bold rounded transition-colors cursor-pointer"
                  >
                    🚀 Déployer le Bon de Travail & Transmettre la Fiche
                  </button>
                </form>
              </div>

              {/* Quick department overview */}
              <div className="mt-4 pt-3 border-t border-white/5 space-y-1.5 text-[10px] font-mono leading-relaxed select-none">
                <span className="text-gray-400 font-bold uppercase block">Départements d'Infrastructure Répertoriés :</span>
                {departments.map(d => (
                  <div key={d.id} className="flex justify-between text-gray-550 border-b border-white/2 pb-1">
                    <span>🏢 {d.name}</span>
                    <span className="text-gray-400">{d.staff} agents act.</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Col: Active pipeline and history (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Active Bons are displayed */}
              <div className="bg-[#161821] border border-white/5 p-4 rounded-xl space-y-3 shadow-md">
                <span className="font-title font-semibold text-xs text-amber-400 block">
                  🛠️ Bons d'Intervention en Cours d'Opération ({workOrders.length})
                </span>

                <div className="space-y-2 max-h-[220px] overflow-y-auto">
                  {workOrders.map(wo => {
                    const matchedClaim = claims.find(c => c.id === wo.claimId);
                    const matchedAgent = agents.find(a => a.id === wo.agentId);
                    return (
                      <div key={wo.id} className="p-3 bg-black/40 border border-white/5 rounded-xl font-mono text-[10px] flex items-start justify-between gap-3">
                        <div className="space-y-1.5 text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-bold bg-amber-950/60 border border-amber-500/20 px-1.5 py-0.5 rounded text-[8px]">
                              {wo.id}
                            </span>
                            <span className="font-bold text-gray-300">{wo.title}</span>
                          </div>
                          <p className="text-gray-400 leading-normal text-[9.5px]">
                            <strong>Instructions :</strong> "{wo.instructions}"
                          </p>
                          <div className="flex gap-3 text-[9px] text-gray-500">
                            <span>Agent : <strong className="text-gray-300">{matchedAgent?.name || 'Inconnu'}</strong></span>
                            <span>Secteur de signalement : <strong className="text-gray-300">{matchedClaim?.location || 'Mairie'}</strong></span>
                          </div>
                        </div>

                        <div className="text-right shrink-0 flex flex-col items-end justify-between self-stretch gap-2">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold text-white uppercase ${
                            wo.priority === 'CRITIQUE' ? 'bg-red-600' : wo.priority === 'URGENT' ? 'bg-amber-600' : 'bg-blue-600'
                          }`}>
                            {wo.priority}
                          </span>
                          <span className="text-[9.5px] text-emerald-400 font-bold block">
                            ⚙️ EN COURS
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* History list of claim status updates */}
              <div className="bg-[#161821] border border-white/5 p-4 rounded-xl space-y-3 shadow-md">
                <span className="font-title font-semibold text-xs text-white block">
                  🔄 Audite-Trail : Historique des Transitions Métier (claim_status_history)
                </span>

                <div className="space-y-2 max-h-[180px] overflow-y-auto font-mono text-[9.5px]">
                  {claimHistory.map(h => (
                    <div key={h.id} className="p-2 bg-neutral-950/50 border-l-2 border-emerald-500/60 pl-2.5 rounded flex justify-between gap-2">
                      <div className="space-y-1 text-left">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <strong className="text-slate-300">{h.claimId}</strong>
                          <span className="text-gray-550 border border-white/5 px-1 rounded text-[8px]">{h.agentEmail}</span>
                          <p className="text-gray-400 leading-normal text-[9px] mt-0.5">
                            "{h.notes}"
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-1">
                          <span className="text-red-400">{h.formerStatus}</span>
                          <span className="text-gray-500">➔</span>
                          <span className="text-emerald-400">{h.newStatus}</span>
                        </div>
                        <span className="text-[8px] text-gray-550 block mt-0.5">
                          {new Date(h.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PLACE DE MARCHÉ ET FACTURATION CERTIFIÉE */}
      {activeSubTab === 'MARKETPLACE' && (
        <div id="mairie-marketplace-panel" className="space-y-6 animate-fade-in">
          {/* Marketplace header */}
          <div className="bg-gradient-to-r from-emerald-600/10 to-transparent p-4 rounded-2xl border border-emerald-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-title font-bold text-sm text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                🏪 Place de Marché Territoriale MyCity
              </h3>
              <p className="text-[10px] font-mono text-gray-400">
                Abonnements urbains et Services territoriaux sous Dahir 18-00. TVA applicable 20% avec signature cryptographique.
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              <span className="text-[9.5px] font-mono font-bold px-2 py-1 bg-emerald-950/40 text-emerald-300 border border-emerald-500/20 rounded">
                VAT Rule : Normal 20% Applied
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Catalyst List of products to buy */}
            <div className="lg:col-span-6 bg-[#161821] border border-white/5 p-4 rounded-xl space-y-4 shadow-md">
              <span className="font-title font-semibold text-xs text-white block pb-2 border-b border-white/5">
                🛍️ Service Catalogue — Abonnements & Droits Municipaux
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {marketplaceProducts.map(prod => (
                  <div key={prod.id} className="p-3 bg-black/40 border border-white/5 rounded-xl flex flex-col justify-between font-mono gap-3.5">
                    <div className="space-y-1 text-left">
                      <strong className="text-white text-[11px] block">{prod.title}</strong>
                      <p className="text-gray-400 text-[9px] leading-relaxed">
                        {prod.description}
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-white/2 select-none">
                      <div className="leading-none text-left">
                        <strong className="text-emerald-400 text-sm font-bold block">{prod.price} MAD</strong>
                        <span className="text-[8px] text-gray-500 block uppercase font-black">+20% tva applicable</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleBuyProduct(prod.id)}
                        className="py-1 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[10px] transition-all cursor-pointer"
                      >
                        ⚡ Acheter
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Just and newly generated certified receipt detail view */}
              {lastInvoiceJustGenerated && (
                <div className="bg-black/80 rounded-2xl p-4 border border-emerald-500/30 font-mono text-[10px] space-y-3 text-left">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-emerald-400 font-bold uppercase shrink-0">📜 Facture Municipale Émise</span>
                    <span className="text-gray-400">{lastInvoiceJustGenerated.id}</span>
                  </div>

                  <div className="space-y-1 leading-normal text-slate-300">
                    <div className="flex justify-between">
                      <span>Hors Taxes (Montant HT) :</span>
                      <span>{lastInvoiceJustGenerated.subtotal.toFixed(2)} MAD</span>
                    </div>
                    <div className="flex justify-between">
                      <span>TVA Collectée (20% Dahir) :</span>
                      <span className="text-amber-500">{lastInvoiceJustGenerated.tva.toFixed(2)} MAD</span>
                    </div>
                    <div className="flex justify-between border-t border-white/5 pt-1 font-bold text-white text-xs">
                      <span>Montant TTC (Total Payé) :</span>
                      <span className="text-emerald-400">{lastInvoiceJustGenerated.total.toFixed(2)} MAD</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10 text-[8.5px] text-gray-500 break-all leading-normal space-y-1">
                    <span className="font-bold text-gray-400 block uppercase">Clé d'Audit de Sécurité RLS / CNDP (SHA-256 PDF Hash) :</span>
                    <code className="text-purple-300 select-all font-sans bg-purple-950/15 p-1 rounded block">{lastInvoiceJustGenerated.hash}</code>
                  </div>
                </div>
              )}
            </div>

            {/* Invoices and orders databases */}
            <div className="lg:col-span-6 space-y-4">
              {/* List of orders */}
              <div className="bg-[#161821] border border-white/5 p-4 rounded-xl space-y-3 shadow-md">
                <span className="font-title font-semibold text-xs text-emerald-400 block">
                  🧾 Base de Commandes (Enregistrements Territoriaux)
                </span>

                <div className="space-y-2 max-h-[160px] overflow-y-auto">
                  {myOrders.map(ord => {
                    const matchedProd = marketplaceProducts.find(p => p.id === ord.productId);
                    return (
                      <div key={ord.id} className="p-2.5 bg-black/40 border border-white/5 rounded-xl font-mono text-[9.5px] flex items-center justify-between">
                        <div className="text-left space-y-1">
                          <strong className="text-white shrink-0 block">{matchedProd?.title || 'Produit Spécial'}</strong>
                          <span className="text-gray-500 block">Identifiant Commande : {ord.id}</span>
                        </div>

                        <div className="text-right shrink-0 leading-normal">
                          <strong className="text-white block">{ord.total.toFixed(2)} MAD</strong>
                          <span className="text-[8px] text-emerald-400 font-bold uppercase">{ord.status}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* List of invoices */}
              <div className="bg-[#161821] border border-white/5 p-4 rounded-xl space-y-3 shadow-md">
                <span className="font-title font-semibold text-xs text-white block">
                  🔒 Journal Cryptographique des Factures Certifiées
                </span>

                <div className="space-y-1.5 max-h-[170px] overflow-y-auto">
                  {myInvoices.map(inv => (
                    <div key={inv.id} className="p-2 bg-black/50 rounded-lg border border-white/2 font-mono text-[8.5px] text-left space-y-1">
                      <div className="flex justify-between font-bold text-slate-300">
                        <span>{inv.id} (Rattaché à {inv.orderId})</span>
                        <span className="text-emerald-400">{inv.total.toFixed(2)} MAD</span>
                      </div>
                      <div className="truncate text-gray-550 font-sans">
                        Fingerprint : <strong className="text-purple-300 font-mono select-all shrink-0">{inv.hash}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SaaS Isolation and hostiles attack simulation widget */}
          <div className="bg-black p-4 rounded-2xl border border-red-500/10 space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-left space-y-1">
                <strong className="text-white text-xs block font-title flex items-center gap-1.5 uppercase text-red-400">
                  ⚠️ Vérification de Sécurité Multi-Tenant RLS & SQL Policy
                </strong>
                <p className="font-mono text-[9px] text-gray-500">
                  Notre architecture s'assure qu'un utilisateur ne puisse JAMAIS élever ses privilèges pour forcer l'accès aux données des autres villes.
                </p>
              </div>

              <button
                type="button"
                onClick={simulateRlsHostileAttack}
                disabled={rlsAttacking}
                className="px-3.5 py-1.5 bg-red-600/20 hover:bg-red-600 border border-red-500/30 text-red-200 hover:text-white font-mono text-[10px] font-bold rounded-lg transition-all shrink-0 cursor-pointer disabled:opacity-55"
              >
                {rlsAttacking ? '⚡ Injection SQL en Cours...' : '🔥 Simuler Pénétration SQL Escalade'}
              </button>
            </div>

            {rlsAttackResult === 'BLOCKED' && (
              <div className="p-3 bg-red-950/20 text-red-300 border border-red-500/25 rounded-lg font-mono text-[9.5px] leading-relaxed text-left flex items-start gap-2.5 animate-pulse">
                <span className="text-xs">🛡️</span>
                <div className="space-y-1">
                  <strong className="text-red-400 block font-bold">ACCÈS EN TRANSGRESSION REJETE ! (Espace Isolé RLS)</strong>
                  <p>
                    <strong>Instruction reçue :</strong> SELECT * FROM claims WHERE tenant_id = 'rabat' (Tentative depuis la session active de {currentCityForTenant}).
                  </p>
                  <p className="text-gray-400">
                    <strong>Raison :</strong> Le moteur Postgres RLS a levé l'exception code 403 : le rôle de session JWT est cloisonné immuablement sous tenant_id = '{currentCityForTenant.toLowerCase()}'. Aucune trace inter-tenant n'est propagée en mémoire.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SERVICES EMERGENCY / DE GARDE */}
      {activeSubTab === 'SERVICES' && (
        <div id="mairie-hospital-panel" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pharmacy duty roster list */}
          <div className="bg-[#161821] border border-white/5 p-4 rounded-xl space-y-3 shadow-md flex flex-col">
            <span className="font-title font-semibold text-xs text-white block">{t.pharmacyTitle}</span>
            
            {/* FIXED Header - L'Ordre des Pharmaciens de Casablanca */}
            <div className="p-3 bg-[#6c3cff]/10 border border-[#6c3cff]/20 rounded-xl space-y-1 select-none">
              <div className="flex items-center gap-2">
                <span className="text-sm">🏛️</span>
                <span className="text-[11px] font-bold text-white uppercase tracking-wider font-mono">Ordre des Pharmaciens de Casablanca</span>
              </div>
              <p className="text-[9.5px] text-purple-300 leading-normal">
                Conseil Régional des Pharmaciens du Sud — Organe de régulation légal et de validation de la charte de garde pharmaceutique à Casablanca.
              </p>
            </div>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {pharmacies.map(ph => (
                <div key={ph.id} className="p-2.5 bg-black/30 rounded border border-white/5 flex justify-between items-center font-mono">
                  <div>
                    <strong className="text-white text-[11px] block">{ph.name}</strong>
                    <span className="text-gray-400 text-[9.5px] block">{ph.address}</span>
                    <span className="text-gray-500 text-[8.5px] block">📞 {ph.phone}</span>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold text-white uppercase ${
                      ph.dutyType === 'PERMANENT' ? 'bg-[#ff3c83]' : 'bg-emerald-600'
                    }`}>
                      {ph.dutyType === 'PERMANENT' ? t.mapCatDutyPharma : ph.dutyType}
                    </span>
                    <span className="text-[10px] text-[#00ff66] block font-bold mt-1">🟡 {currentLang === 'FR' ? 'Active' : currentLang === 'AR' ? 'نشطة' : 'Active'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hospital Occupancy beds */}
          <div className="bg-[#161821] border border-white/5 p-4 rounded-xl space-y-3 shadow-md">
            <span className="font-title font-semibold text-xs text-white block">{t.hospitalOccupancyTitle}</span>

            <div className="space-y-3">
              {hospitals.map(hosp => (
                <div key={hosp.id} className="p-2.5 bg-black/30 rounded border border-white/5 font-mono text-[10.5px]">
                  <div className="flex justify-between items-center mb-1">
                    <strong className="text-white text-[11px] block">{hosp.name}</strong>
                    <span className="text-gray-400">📞 {hosp.contact}</span>
                  </div>

                  <div className="flex justify-between text-[10px] text-gray-500 mb-0.5">
                    <span>Occupation lits</span>
                    <span>{hosp.occupancyRate}% ({hosp.availableBeds} {t.hospitalAvailableBeds})</span>
                  </div>

                  <div className="w-full bg-neutral-900 h-2 rounded overflow-hidden">
                    <div className={`h-full rounded ${
                      hosp.occupancyRate > 80 ? 'bg-red-500 animate-pulse' :
                      hosp.occupancyRate > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`} style={{ width: `${hosp.occupancyRate}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* COMPOSING BROADCAST FLASH ALERT */}
      {activeSubTab === 'FLASH' && (
        <div id="mairie-flash-panel" className="bg-[#161821] border border-white/5 p-4 rounded-xl space-y-4 shadow-md">
          <div className="flex items-center gap-2 text-amber-400">
            <ShieldCheck className="w-5 h-5 animate-bounce text-red-400" />
            <div>
              <h3 className="font-title font-bold text-xs text-white">{t.flashChannelTitle}</h3>
              <p className="font-mono text-[9px] text-gray-400">{t.flashChannelDesc}</p>
            </div>
          </div>

          <form onSubmit={handlePostFlashMessage} className="space-y-3 font-mono">
            <div>
              <label className="block text-[10px] text-gray-400 mb-1">{t.flashTargetLabel}</label>
              <select
                value={flashZone}
                onChange={(e) => setFlashZone(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded px-3 py-1.5 text-xs text-white focus:outline-none"
              >
                <option value="ALL">{t.flashTargetAll}</option>
                <option value="Maârif">{t.flashTargetDistrict} (Maârif)</option>
                <option value="Anfa">{t.flashTargetDistrict} (Anfa)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-gray-400 mb-1">{t.flashTextInputLabel}</label>
              <input
                type="text"
                value={flashMessage}
                onChange={(e) => setFlashMessage(e.target.value)}
                placeholder={t.flashTextPlaceholder}
                className="w-full bg-black/40 border border-white/10 rounded px-3 py-1.5 text-xs text-white focus:outline-none"
                required
              />
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                id="mairie-post-flash-btn"
                className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold font-title text-xs rounded transition-colors cursor-pointer"
              >
                {t.flashSendBtn}
              </button>
            </div>

            {flashFeedback && (
              <div className="p-2.5 bg-red-950/20 text-red-300 border border-red-500/20 rounded font-mono text-[9px] animate-pulse">
                {t.flashSuccessAlert}
              </div>
            )}
          </form>
        </div>
      )}

      {/* COMPTES UTILISATEURS SUPERVISION PANEL */}
      {activeSubTab === 'USERS' && (
        <div id="mairie-users-panel" className="bg-[#161821] border border-white/5 p-4 rounded-xl space-y-4 shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
            <div className="flex items-center gap-1.5 text-indigo-400">
              <Shield className="w-5 h-5 text-purple-400" />
              <div>
                <strong className="text-white text-xs block">👥 Annuaire Souverain des Comptes Citoyens</strong>
                <span className="font-mono text-[9px] text-gray-500">Traçabilité et Certifications Loi CNDP 09-08</span>
              </div>
            </div>

            {currentUserRole === 'MAIRIE' && onOpenSqlSpec && (
              <button
                type="button"
                id="mairie-inspect-sql-btn"
                onClick={() => {
                  onAddLog("SQL_SHORTCUT_CLICK", "Clic sur le raccourci de consultation du Schéma SQL technique.");
                  onOpenSqlSpec();
                }}
                className="px-3 py-1 bg-purple-950/40 border border-purple-500/20 hover:border-purple-500/50 text-purple-300 font-mono text-[10px] rounded-lg transition-all cursor-pointer flex items-center gap-1 shrink-0"
              >
                <Server className="w-3.5 h-3.5" />
                <span>Consulter le Schéma SQL Technique</span>
              </button>
            )}
          </div>

          <p className="text-gray-400 text-[11px] leading-relaxed select-none">
            En tant qu'autorité municipale de Casablanca, vous pouvez superviser la souveraineté numérique des citoyens et partenaires commerciaux, valider les certifications de syndics élus (Loi 18-00), ou permuter instantanément de session expérimentale pour tester les différentes vues.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
            {simulatedAccounts.map((user) => {
              const isBanned = !!banStatus[user.id];
              return (
                <div 
                  key={user.id} 
                  className={`bg-black/30 border p-3 rounded-2xl flex flex-col justify-between gap-3 transition-all relative ${
                    isBanned ? 'border-red-500/20 opacity-60 bg-red-950/5' : 'border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 select-none border"
                      style={{ borderColor: user.color, color: user.color, background: `${user.color}10` }}
                    >
                      {user.initials}
                    </div>

                    <div className="text-left space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <strong className="text-white text-[11.5px] font-title">{user.name}</strong>
                        {isBanned && (
                          <span className="px-1.5 py-0.2 rounded text-[8px] bg-red-500 text-white font-mono uppercase font-black">
                            Banni
                          </span>
                        )}
                      </div>
                      <span className="text-gray-500 text-[9.5px] block font-mono">{user.email}</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#1c1d29] border border-white/5 text-gray-400">
                          ⚙️ {user.tier}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#10b981]/15 text-[#10b981] font-medium">
                          ✓ {user.consent}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                    {onChangeUserRole && (
                      <button
                        type="button"
                        onClick={() => {
                          onChangeUserRole(user.role);
                          onAddLog("Session Switch", `Simulation d'accès direct au rôle ${user.role} pour ${user.name}`);
                          if (user.isResidentFlow || user.isSyndicFlow) {
                            onChangeActiveModule?.('MYHOME');
                          } else {
                            onChangeActiveModule?.('URBAN');
                          }
                        }}
                        className="flex-1 py-1 px-2 bg-[#6c3cff]/25 hover:bg-[#6c3cff] border border-[#6c3cff]/40 text-white text-[10px] font-bold rounded-lg transition-all cursor-pointer font-mono whitespace-nowrap text-center"
                      >
                        🔌 Permuter Session
                      </button>
                    )}

                    {(user.isResidentFlow || user.isSyndicFlow) && onChangeActiveModule && (
                      <button
                        type="button"
                        onClick={() => {
                          onChangeUserRole?.('PUBLIC');
                          onChangeActiveModule('MYHOME');
                          onAddLog("Inspect Copro", `Navigation municipale vers l'Espace Co-propriété pour inspecter Résidence Al Kasbah.`);
                        }}
                        className="flex-1 py-1 px-2 bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/30 text-emerald-300 hover:text-white text-[10px] font-bold rounded-lg transition-all cursor-pointer font-mono whitespace-nowrap text-center"
                      >
                        🏠 Ouvrir MyHome
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleToggleBan(user.id, user.name)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer ${
                        isBanned 
                          ? 'bg-amber-500/15 border border-amber-500/30 text-amber-400 hover:bg-amber-500 hover:text-black' 
                          : 'bg-red-500/10 border border-red-500/25 text-red-400 hover:bg-red-500 hover:text-white'
                      }`}
                    >
                      {isBanned ? 'Restaurer' : 'Bannir'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CNDP CYBERSECURITY AUDIT LOGS DISPLAY */}
      {activeSubTab === 'AUDIT' && (
        <div id="mairie-audit-panel" className="bg-[#161821] border border-white/5 p-4 rounded-xl space-y-3 shadow-md">
          <div className="flex items-center gap-1 text-emerald-400 mb-1">
            <Server className="w-5 h-5" />
            <div>
              <strong className="text-white text-xs block">{t.auditRegistryTitle}</strong>
              <span className="font-mono text-[9px] text-gray-500">{t.auditRegistryDesc}</span>
            </div>
          </div>

          <p className="text-gray-400 text-[10.5px]">
            {t.auditRegistryIntro}
          </p>

          <div className="bg-black/40 border border-white/10 rounded-lg p-3 font-mono text-[9px] text-slate-300 max-h-[220px] overflow-y-auto space-y-1.5">
            {privacyLogs.map((log, index) => (
              <div key={index} className="flex flex-col sm:flex-row justify-between border-b border-white/5 pb-1.5 hover:bg-neutral-900/50">
                <span className="text-[#00f0ff] w-36 shrink-0">{log.timestamp}</span>
                <span className="text-amber-500 w-36 shrink-0 font-bold uppercase">[{log.action}]</span>
                <span className="text-slate-200">{log.details}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
