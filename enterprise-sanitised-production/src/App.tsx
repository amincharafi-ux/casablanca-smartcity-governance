import React, { useState, useEffect } from 'react';
import { ShieldCheck, Shield, User, Building, Landmark, RefreshCw, Cpu, Activity, LogOut, Database, Lock, Download, Palette } from 'lucide-react';
import { UserRole, CityEvent, CitizenClaim, CitizenConsent, CNDPPrivacyLog } from './types';
import { INITIAL_EVENTS, INITIAL_CLAIMS, INITIAL_PHARMACIES, INITIAL_HOSPITALS } from './data/mockData';
import { LanguageCode, translations } from './data/translations';
import { cndpMarkdown, ecosystemMarkdown, ctoAuditReportMarkdown } from './data/downloadCode';

// Modular Component Imports
import MapSimulation from './components/MapSimulation';
import ChatCompanion from './components/ChatCompanion';
import BLEMeshSim from './components/BLEMeshSim';
import CitizenPortal from './components/CitizenPortal';
import BusinessPortal from './components/BusinessPortal';
import MairiePortal from './components/MairiePortal';
import DataTeamDashboard from './components/DataTeamDashboard';
import DatabaseSpecExplorer from './components/DatabaseSpecExplorer';
import SouverainBlueprint from './components/SouverainBlueprint';
import SecurityAuditIntegrale from './components/SecurityAuditIntegrale';
import UserProfileDashboard from './components/UserProfileDashboard';
import GithubDataRoom from './components/GithubDataRoom';
import BrandCharterExplorer from './components/BrandCharterExplorer';

import MyResidence from './components/MyResidence';
import MyLife from './components/MyLife';
import MyHome from './components/MyHome';
import HostModule from './components/MyHome/HostModule';
import XoviaUniverseDashboard from './components/XoviaUniverseDashboard';

// @ts-ignore
import cityLogo from './assets/images/city_logo_1779750911433-1.png';

export default function App() {

  // On mount, dynamically update the browser favicon with the imported png asset
  useEffect(() => {
    const updateFavicon = () => {
      let linkList = document.querySelectorAll("link[rel~='icon']");
      if (linkList.length > 0) {
        linkList.forEach((link: any) => {
          link.href = cityLogo;
        });
      } else {
        const link = document.createElement('link');
        link.type = 'image/png';
        link.rel = 'icon';
        link.href = cityLogo;
        document.getElementsByTagName('head')[0].appendChild(link);
      }
    };
    updateFavicon();
  }, []);

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

  // Global App States
  const [currentLang, setCurrentLang] = useState<LanguageCode>(
    (localStorage.getItem('mycity_lang') as LanguageCode) || 'FR'
  );

  const [currentCity, setCurrentCity] = useState<string>(() => {
    return localStorage.getItem('mycity_city') || 'Casablanca';
  });
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

  // Sync document title with active city name
  useEffect(() => {
    document.title = `MyCity Companion - ${currentCity}`;
  }, [currentCity]);

  // WCAG 2.1 AA Compliance - Screen Reader Language and Text Direction Sync
  useEffect(() => {
    document.documentElement.lang = currentLang.toLowerCase();
    document.documentElement.dir = currentLang === 'AR' ? 'rtl' : 'ltr';
  }, [currentLang]);

  const t = translations[currentLang];

  const [userRole, setUserRole] = useState<UserRole>('PUBLIC');

  // Synchroniser le jeton JWT signé cryptographiquement sur le serveur par rapport au rôle actif
  useEffect(() => {
    fetch("/api/auth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: userRole })
    })
    .then(res => {
      if (!res.ok) throw new Error("Erreur de synchronisation du jeton");
      return res.json();
    })
    .then(data => {
      if (data.token) {
        // Enregistrer dans le cookie pour être transmis automatiquement sur toutes les requêtes subséquentes
        document.cookie = `session_jwt=${data.token}; path=/; max-age=86400; SameSite=Strict; Secure`;
        localStorage.setItem("session_jwt", data.token);
        console.log(`[SECURE SOUVERAIN] JWT cryptographique synchronisé pour le rôle : ${userRole}`);
      }
    })
    .catch(err => {
      console.error("[CATASTROPHE] Impossible de synchroniser le jeton de sécurité :", err);
    });
  }, [userRole]);

  const [isSqlSpecOpen, setIsSqlSpecOpen] = useState(false);
  const [isUserDashboardOpen, setIsUserDashboardOpen] = useState(false);
  const [dbSpecInitialTab, setDbSpecInitialTab] = useState<'ARCHITECTURE' | 'DATABASE' | 'SQL_CONSOLE' | 'ENV_CONFIG' | 'CNDP_COMPLIANCE' | 'EVENT_STORE' | 'VECTOR_RAG'>('ARCHITECTURE');
  const [isBlueprintOpen, setIsBlueprintOpen] = useState(false);
  const [isSecurityAuditOpen, setIsSecurityAuditOpen] = useState(false);
  const [isGithubRoomOpen, setIsGithubRoomOpen] = useState(false);
  const [isBrandCharterOpen, setIsBrandCharterOpen] = useState(false);
  
  // XOVIA Architecture States
  const [xoviaModule, setXoviaModule] = useState<'HOME' | 'LIFE' | 'URBAN' | 'TRANSVERSE'>('HOME');
  const [activeMainModule, setActiveMainModule] = useState<'URBAN' | 'MYHOME' | 'MYLIFE'>('MYHOME');
  const [homeSubTab, setHomeSubTab] = useState<'RESIDENCE' | 'HOST' | 'IMMO' | 'SERVICES'>('RESIDENCE');
  const [lifeSubTab, setLifeSubTab] = useState<'EVENTS' | 'BUSINESS' | 'MARKETPLACE' | 'COMMUNITY'>('EVENTS');
  const [urbanSubTab, setUrbanSubTab] = useState<'CIVIC' | 'ALERT' | 'GOV' | 'DATA'>('DATA');
  const [transverseSubTab, setTransverseSubTab] = useState<'PAY' | 'MANAGER' | 'PARTNER' | 'AI' | 'TRUST' | 'ARCH_DASHBOARD'>('ARCH_DASHBOARD');

  const navigateXovia = (module: 'HOME' | 'LIFE' | 'URBAN' | 'TRANSVERSE') => {
    setXoviaModule(module);
    if (module === 'HOME') {
      setActiveMainModule('MYHOME');
    } else if (module === 'LIFE') {
      setActiveMainModule('MYLIFE');
    } else {
      setActiveMainModule('URBAN');
    }
  };

  const [events, setEvents] = useState<CityEvent[]>(INITIAL_EVENTS);
  const [claims, setClaims] = useState<CitizenClaim[]>(INITIAL_CLAIMS);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('ALL');

  const [activeToast, setActiveToast] = useState<string | null>(null);

  useEffect(() => {
    const originalAlert = window.alert;
    window.alert = (message: string) => {
      setActiveToast(message);
    };
    return () => {
      window.alert = originalAlert;
    };
  }, []);

  const [privacyConsent, setPrivacyConsent] = useState<CitizenConsent>({
    location: true,
    analytics: true,
    ble: true,
    ai_profiling: true,
  });

  // Pre-seed CNDP privacy trail logs
  const [privacyLogs, setPrivacyLogs] = useState<CNDPPrivacyLog[]>([
    { timestamp: "2026-05-25T22:30:11Z", action: "Consent Init", affectedRole: "PUBLIC", details: "Initialisation sécurisée de session CNDP Law 09-08." },
    { timestamp: "2026-05-25T22:31:00Z", action: "Load Database", affectedRole: "SYSTEM", details: "Seeding immuable d'agenda d'Anfa Gauthier et Sidi Bernoussi." },
  ]);

  // Add a trace action to privacy trail
  const handleAddPrivacyLog = (action: string, details: string) => {
    const newLog: CNDPPrivacyLog = {
      timestamp: new Date().toISOString(),
      action,
      affectedRole: userRole,
      details,
    };
    setPrivacyLogs(prev => [newLog, ...prev]);
  };

  // State-mutating handlers
  const handleAddevent = (newEvent: Omit<CityEvent, 'id' | 'views' | 'bookingsCount' | 'revenue' | 'reviews'>) => {
    const freshEvent: CityEvent = {
      ...newEvent,
      id: `evt-${Date.now()}`,
      views: 1,
      bookingsCount: 0,
      revenue: 0,
      reviews: []
    };
    setEvents(prev => [...prev, freshEvent]);
    handleAddPrivacyLog("Event Published", `Ajout de l'événement "${freshEvent.title}" sur la carte.`);
  };

  const handleAddClaim = (newClaim: Omit<CitizenClaim, 'id' | 'createdAt' | 'replies'>) => {
    const freshClaim: CitizenClaim = {
      ...newClaim,
      id: `claim-${Date.now().toString().substring(8)}`,
      createdAt: new Date().toISOString(),
      replies: []
    };
    setClaims(prev => [freshClaim, ...prev]);
    handleAddPrivacyLog("Claim Lodged", `Nouveau signalement citoyen enregistré : "${freshClaim.title}".`);
  };

  const handleUpdateClaimStatus = (claimId: string, status: CitizenClaim['status'], reply?: string) => {
    setClaims(prev => prev.map(c => {
      if (c.id === claimId) {
        const freshReplies = [...c.replies];
        if (reply && reply.trim()) {
          freshReplies.push({
            sender: 'MAIRIE',
            message: reply,
            timestamp: new Date().toISOString()
          });
        }
        return {
          ...c,
          status,
          replies: freshReplies
        };
      }
      return c;
    }));
  };

  const handlePostReview = (eventId: string, rating: number, comment: string) => {
    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        return {
          ...e,
          reviews: [
            ...e.reviews,
            {
              id: `rev-${Date.now()}`,
              userName: "Collaborateur Citoyen Anonyme",
              rating,
              comment,
              date: new Date().toISOString().split('T')[0]
            }
          ]
        };
      }
      return e;
    }));
    handleAddPrivacyLog("Add Star Review", `Publication d'une note (${rating}/5) et commentaire pour l'événement.`);
  };

  const handlePostLike = (eventId: string) => {
    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        return { ...e, views: e.views + 1 };
      }
      return e;
    }));
    handleAddPrivacyLog("Event Interaction", `Like/Vue attribué à l'élément de carte #${eventId}.`);
  };

  const handleUpdatePrivacy = (consent: CitizenConsent) => {
    setPrivacyConsent(consent);
    handleAddPrivacyLog("Update Consent", `Changement d'autorisation CNDP : Localisation [${consent.location ? 'OUI' : 'NON'}], Analytics [${consent.analytics ? 'OUI' : 'NON'}], BLE [${consent.ble ? 'OUI' : 'NON'}], Profilage IA [${consent.ai_profiling ? 'OUI' : 'NON'}]`);
    
    // Sync to backend CNDP server
    fetch("/api/consent/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(consent)
    })
      .then(res => res.json())
      .then(() => {
        setActiveToast("Vos choix de consentements granulaires ont été enregistrés et journalisés sur le serveur souverain.");
      })
      .catch(err => {
        console.error("Failed to sync consent on server:", err);
      });
  };

  // CNDP Law 09-08 1-click erase account ("Droit à l'oubli")
  const handleClearCitizenData = () => {
    setClaims(INITIAL_CLAIMS);
    setEvents(INITIAL_EVENTS);
    handleAddPrivacyLog("Erase Data", "Purge définitive effectuée d'activité utilisateur (Droit à l'oubli Art. 7).");
    
    // Call server purge
    fetch("/api/consent/purge", { method: "POST" })
      .then(() => {
        setActiveToast("Droit à l'oubli exécuté ! Toutes vos données de session, vos interactions IA et vos requêtes de réclamations ont été réinitialisées en toute sécurité.");
      })
      .catch(err => {
        setActiveToast("Droit à l'oubli exécuté localement! (Déconnecté du backend temporairement)");
      });
  };

  // Map coordination focus helper
  const handleSelectEventOnMap = (evt: CityEvent) => {
    setActiveCategoryFilter(evt.category);
    handleAddPrivacyLog("Map Navigation", `Focus géographique sur l'événement : "${evt.title}".`);
  };

  // Dynamic profile metadata mapping for Elegant Dark aesthetic
  const getDynamicUser = (role: UserRole) => {
    switch (role) {
      case 'PUBLIC':
        return { name: 'Sara Belghiti', roleLabel: 'Citoyen Souverain', initials: 'SB', color: 'text-emerald-400' };
      case 'PARTENAIRES':
        return { name: 'Ilyas El Omari', roleLabel: 'Partenaire Affilié (SaaS)', initials: 'IO', color: 'text-[#00ffcc]' };
      case 'MAIRIE':
        return { name: 'Mme. Fatim-Zahra', roleLabel: 'Conseil Municipal', initials: 'FZ', color: 'text-[#ff3c83]' };
      case 'DATA_TEAM':
        return { name: 'Yassine Alami', roleLabel: 'Directeur Data & BI', initials: 'YA', color: 'text-indigo-400' };
      default:
        return { name: 'Sara Belghiti', roleLabel: 'Citoyen', initials: 'SB', color: 'text-gray-400' };
    }
  };

  const currentUser = getDynamicUser(userRole);

  // Color configuration according to the 3 portals/universes
  const getPortalTheme = () => {
    switch (activeMainModule) {
      case 'URBAN':
        return {
          textColor: 'text-[#7dd3fc]',                     // MyCity: RGB 125, 211, 252 (#7dd3fc)
          borderColor: 'border-[#7dd3fc]',
          borderAlpha: 'border-[#7dd3fc]/20',
          hoverBorderColor: 'hover:border-[#7dd3fc]/50',
          bgAccent: 'bg-[#7dd3fc]',
          bgHover: 'hover:bg-[#7dd3fc]/90',
          bgLight: 'bg-[#7dd3fc]/10',
          textMuted: 'text-[#7dd3fc]/80',
          glowShadow: 'shadow-[#7dd3fc]/35',
          activeTabClass: 'bg-[#7dd3fc] text-slate-950 font-black shadow-lg shadow-[#7dd3fc]/35',
          accentColor: '#7dd3fc',
          bgGradient: 'from-[#7dd3fc]/15 to-transparent',
        };
      case 'MYLIFE':
        return {
          textColor: 'text-[#d4af7a]',                     // MyLife: RGB 212, 175, 122 (#d4af7a)
          borderColor: 'border-[#d4af7a]',
          borderAlpha: 'border-[#d4af7a]/20',
          hoverBorderColor: 'hover:border-[#d4af7a]/50',
          bgAccent: 'bg-[#d4af7a]',
          bgHover: 'hover:bg-[#d4af7a]/90',
          bgLight: 'bg-[#d4af7a]/15',
          textMuted: 'text-[#d4af7a]/80',
          glowShadow: 'shadow-[#d4af7a]/35',
          activeTabClass: 'bg-[#d4af7a] text-[#1c140a] font-black shadow-lg shadow-[#d4af7a]/35',
          accentColor: '#d4af7a',
          bgGradient: 'from-[#d4af7a]/15 to-transparent',
        };
      case 'MYHOME':
        return {
          textColor: 'text-[#a16eff]',                     // MyHome: RGB 161, 110, 255 (#a16eff)
          borderColor: 'border-[#a16eff]',
          borderAlpha: 'border-[#a16eff]/20',
          hoverBorderColor: 'hover:border-[#a16eff]/50',
          bgAccent: 'bg-[#a16eff]',
          bgHover: 'hover:bg-[#a16eff]/90',
          bgLight: 'bg-[#a16eff]/15',
          textMuted: 'text-[#a16eff]/80',
          glowShadow: 'shadow-[#a16eff]/35',
          activeTabClass: 'bg-[#a16eff] text-white font-black shadow-lg shadow-[#a16eff]/35',
          accentColor: '#a16eff',
          bgGradient: 'from-[#a16eff]/15 to-transparent',
        };
      default:
        return {
          textColor: 'text-[#7dd3fc]',
          borderColor: 'border-[#7dd3fc]',
          borderAlpha: 'border-[#7dd3fc]/20',
          hoverBorderColor: 'hover:border-[#7dd3fc]/50',
          bgAccent: 'bg-[#7dd3fc]',
          bgHover: 'hover:bg-[#7dd3fc]/90',
          bgLight: 'bg-[#7dd3fc]/10',
          textMuted: 'text-[#7dd3fc]/80',
          glowShadow: 'shadow-[#7dd3fc]/35',
          activeTabClass: 'bg-[#7dd3fc] text-slate-950 font-black shadow-lg shadow-[#7dd3fc]/35',
          accentColor: '#7dd3fc',
          bgGradient: 'from-[#7dd3fc]/15 to-transparent',
        };
    }
  };

  const portalTheme = getPortalTheme();

  return (
    <div 
      id="main-application-shell" 
      className="min-h-screen bg-[#0b0d14] text-gray-200 flex flex-col antialiased transition-colors duration-500"
      style={{
        '--portal-color': portalTheme.accentColor,
        '--portal-color-rgb': activeMainModule === 'URBAN' ? '125 211 252' : activeMainModule === 'MYLIFE' ? '212 175 122' : '161 110 255',
      } as React.CSSProperties}
    >
      
      {/* GLOBAL HEADER BLOCK (ELEGANT DARK PATTERN WITH RED PULSATING BANNER) */}
      <header className="sticky top-0 z-50 h-16 flex items-center justify-between px-6 lg:px-8 bg-[#161821]/80 backdrop-blur-md border-b border-white/5 shadow-lg shadow-black/20">
        {/* Left Side: Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 select-none flex items-center justify-center transition-transform hover:scale-105 shrink-0 duration-300">
            <img
              src={cityLogo}
              alt="MyCity Logo"
              className="w-full h-full object-contain pointer-events-none drop-shadow-[0_4px_12px_rgba(108,60,255,0.3)]"
              style={{ filter: `drop-shadow(0 4px 12px ${portalTheme.accentColor}4D)` }}
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-base font-bold leading-tight tracking-tight text-white font-title">
              MyCity
            </h1>
            <div className="relative">
              <button 
                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                className="flex items-center gap-1 text-[11px] font-medium leading-none text-gray-400 hover:text-white transition-colors py-0.5"
                title="Changer de ville"
              >
                <span className="text-gray-400 font-semibold">{currentCity}</span>
                <span className={`${portalTheme.textColor} font-black transition-colors duration-300`}>{currentLang === 'AR' ? 'Companion' : 'Companion'}</span>
                <svg className={`w-2.5 h-2.5 ml-0.5 ${portalTheme.textColor} transition-all duration-300 ${isCityDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isCityDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsCityDropdownOpen(false)}
                  />
                  <div className="absolute left-0 mt-1.5 w-40 bg-[#161821] border border-white/10 rounded-xl shadow-2xl z-50 py-1.5">
                    {['Casablanca', 'Rabat', 'Tanger', 'Marrakech', 'Agadir', 'Fes'].map((city) => (
                      <button
                        key={city}
                        onClick={() => {
                          setCurrentCity(city);
                          localStorage.setItem('mycity_city', city);
                          setIsCityDropdownOpen(false);
                          handleAddPrivacyLog("City Changed", `Utilisateur a changé la ville active vers: ${city}`);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs font-semibold transition-colors hover:bg-white/5 flex items-center justify-between ${
                          currentCity === city ? 'text-[#6C3CFF] bg-white/5' : 'text-gray-300 hover:text-white'
                        }`}
                      >
                        <span>{city}</span>
                        {currentCity === city && (
                          <span className="text-[8px] text-[#6C3CFF]">●</span>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Message Flash banner inside Header (extracted from Design HTML) */}
        <div className="hidden lg:flex flex-1 mx-6 xl:mx-12 max-w-xl">
          <div className="bg-red-500/10 border border-red-500/20 px-4 py-1.5 rounded-full flex items-center gap-3 overflow-hidden w-full">
            <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse shrink-0"></span>
            <p className="text-xs text-red-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
              <span className="font-bold uppercase tracking-wider">{t.flashTitle} :</span> {t.flashBody}
            </p>
          </div>
        </div>

        {/* Right Side: Active User Metadata & Language Switcher */}
        <div className="flex items-center gap-4">
          {/* Language Switcher Hub */}
          <div className="flex items-center bg-[#0b0d14] p-1 rounded-xl border border-white/5 gap-1 shrink-0">
            {(['FR', 'EN', 'AR'] as LanguageCode[]).map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  setCurrentLang(lang);
                  localStorage.setItem('mycity_lang', lang);
                  handleAddPrivacyLog("Language Changed", `Utilisateur a changé la langue vers: ${lang}`);
                }}
                className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-lg transition-all cursor-pointer ${
                  currentLang === lang
                    ? 'bg-[#6C3CFF] text-white shadow'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {lang === 'FR' && '🇫🇷 FR'}
                {lang === 'EN' && '🇬🇧 EN'}
                {lang === 'AR' && '🇲🇦 AR'}
              </button>
            ))}
          </div>

          <div 
            onClick={() => {
              setIsUserDashboardOpen(true);
              handleAddPrivacyLog("Profile Quick Link", "Utilisateur a cliqué sur son nom pour accéder au tableau d'activité.");
            }}
            className="hidden sm:flex flex-col items-end leading-none cursor-pointer group"
          >
            <p className="text-xs font-semibold text-white tracking-tight group-hover:text-[#6C3CFF] transition-colors">{currentUser.name}</p>
            <p className={`text-[10px] font-mono font-bold mt-1 ${currentUser.color}`}>
              {currentUser.roleLabel}
            </p>
          </div>
          <div 
            id="user-initials-bubble"
            onClick={() => {
              setIsUserDashboardOpen(true);
              handleAddPrivacyLog("Profile Quick Link", "Utilisateur a cliqué sur ses initiales pour accéder au tableau d'activité.");
            }}
            className="w-10 h-10 rounded-full bg-[#161821] border border-white/10 hover:border-[#6C3CFF]/50 hover:bg-[#1a1d29] active:scale-95 flex items-center justify-center text-xs font-semibold text-white shadow-inner shrink-0 tracking-wider cursor-pointer transition-all"
            title="Mon Profil & Tableau d'Interactions"
          >
            {currentUser.initials}
          </div>
        </div>
      </header>

      {/* STRATEGIC CONTROL CENTER FOR SIMULATING DIFFERENT USER EXPERIENCES */}
      <div className="w-full max-w-7xl mx-auto px-4 lg:px-6 pt-6 pb-2">
        <div className="bg-[#161821] border border-white/5 p-4 rounded-[24px] flex flex-col xl:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full xl:w-auto">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#6C3CFF]/10 text-[#6C3CFF] rounded-xl border border-[#6C3CFF]/10">
                <Cpu className="w-5 h-5 animate-spin-slow" />
              </div>
              <div className="text-xs leading-none">
                <span className="font-title font-bold text-sm text-white block">{t.cmdTitle}</span>
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mt-1">{t.cmdSub}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto md:ml-4 font-sans">
              {/* PRIMARY VISULAR TABS / LES ONGLETS DU SIMULATEUR */}
              <div id="simulator-view-tabs" className="flex items-center gap-1 p-1 bg-[#0b0d14]/80 border border-white/5 rounded-[14px] shrink-0 overflow-x-auto scrollbar-none">
                <button
                  id="technical-sql-dashboard-btn"
                  onClick={() => {
                    setDbSpecInitialTab('ARCHITECTURE');
                    setIsSqlSpecOpen(true);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1.5 md:px-3 md:py-2 bg-[#4c1d95]/70 hover:bg-[#6C3CFF]/40 border border-[#6C3CFF]/20 hover:border-[#6C3CFF]/50 text-indigo-200 rounded-lg cursor-pointer font-mono text-[10px] md:text-[11px] font-bold transition-all whitespace-nowrap"
                  title="Ouvrir le Tableau des Comptes & Schémas SQL"
                >
                  <Database className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{t.sqlSpecBtn}</span>
                </button>

                <button
                  id="blueprint-presentation-btn"
                  onClick={() => {
                    setIsBlueprintOpen(true);
                    handleAddPrivacyLog("Blueprint Presentation", "Utilisateur a ouvert le Blueprint d'écosystème sanitisé.");
                  }}
                  className="flex items-center gap-1 px-2.5 py-1.5 md:px-3 md:py-2 bg-[#1e1b4b]/80 hover:bg-[#1e1b4b]/95 border border-blue-500/20 hover:border-blue-500/50 text-blue-200 rounded-lg cursor-pointer font-mono text-[10px] md:text-[11px] font-bold transition-all whitespace-nowrap"
                  title="Ouvrir la Présentation du Blueprint Sanitisé"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>🗺️ Blueprint Écosystème</span>
                </button>

                <button
                  id="security-audit-btn"
                  onClick={() => {
                    setIsSecurityAuditOpen(true);
                    handleAddPrivacyLog("Security Audit Console", "Utilisateur a ouvert la console d'Audit de Sécurité Intégral.");
                  }}
                  className="flex items-center gap-1 px-2.5 py-1.5 md:px-3 md:py-2 bg-[#311016]/80 hover:bg-[#311016]/95 border border-red-500/20 hover:border-red-500/50 text-red-200 rounded-lg cursor-pointer font-mono text-[10px] md:text-[11px] font-bold transition-all whitespace-nowrap"
                  title="Ouvrir l'Audit de Sécurité Intégral de MyCity"
                >
                  <Shield className="w-3.5 h-3.5 text-red-400" />
                  <span>🛡️ Audit de Sécurité</span>
                </button>

                <button
                  id="cndp-compliance-dashboard-btn"
                  onClick={() => {
                    setDbSpecInitialTab('CNDP_COMPLIANCE');
                    setIsSqlSpecOpen(true);
                    handleAddPrivacyLog("CNDP Tab Open", "Utilisateur a cliqué sur le bouton de conformité CNDP pour ouvrir l'espace CNDP.");
                  }}
                  className="flex items-center gap-1 px-2.5 py-1.5 md:px-3 md:py-2 bg-[#064e3b]/70 hover:bg-[#10b981]/40 border border-[#10b981]/20 hover:border-[#10b981]/50 text-emerald-200 rounded-lg cursor-pointer font-mono text-[10px] md:text-[11px] font-bold transition-all whitespace-nowrap"
                  title="Ouvrir la Conformité Réglementaire CNDP"
                >
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>🔒 Conformité CNDP</span>
                </button>

                <button
                  id="rag-vector-redis-dashboard-btn"
                  onClick={() => {
                    setDbSpecInitialTab('VECTOR_RAG');
                    setIsSqlSpecOpen(true);
                    handleAddPrivacyLog("RAG Tab Open", "Utilisateur a ouvert le panneau RAG, pgvector et queues BullMQ/Redis.");
                  }}
                  className="flex items-center gap-1 px-2.5 py-1.5 md:px-3 md:py-2 bg-slate-900/90 hover:bg-slate-800 border border-emerald-500/30 hover:border-emerald-500/60 text-emerald-300 rounded-lg cursor-pointer font-mono text-[10px] md:text-[11px] font-bold transition-all whitespace-nowrap"
                  title="Ouvrir le panneau Moteur RAG & Files Redis"
                >
                  <Cpu className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>🧠 RAG, pgvector & Redis</span>
                </button>

                <button
                  id="brand-charter-explorer-btn"
                  onClick={() => {
                    setIsBrandCharterOpen(true);
                    handleAddPrivacyLog("Brand Charter Board", "Utilisateur a ouvert la charte graphique officielle de l'app MyCity.");
                  }}
                  className="flex items-center gap-1 px-2.5 py-1.5 md:px-3 md:py-2 bg-gradient-to-r from-purple-950/40 to-indigo-950/40 hover:from-purple-950/70 hover:to-indigo-950/70 border border-purple-500/30 hover:border-[#00ffcc]/60 text-indigo-200 rounded-lg cursor-pointer font-mono text-[10px] md:text-[11px] font-bold transition-all whitespace-nowrap"
                  title="Ouvrir la Charte Graphique Officielle (Normes, Courriers, Rapports & Correspondances)"
                >
                  <Palette className="w-3.5 h-3.5 text-[#00ffcc]" />
                  <span>🎨 Charte & Correspondance</span>
                </button>
              </div>

              {/* SECONDARY CODE EXPORTS / LES BOUTONS D'EXPORTATION D'CODE */}
              <div id="simulator-export-actions" className="flex items-center gap-1 p-1 bg-[#0b0d14]/40 border border-white/5 border-dashed rounded-[14px] shrink-0 overflow-x-auto scrollbar-none">
                <button
                  onClick={() => {
                    handleAddPrivacyLog("Download CNDP Code", "Téléchargement du code complet d'intégration CNDP loi 09-08.");
                    triggerClientDownload(cndpMarkdown, "cndp_integration_codebase.md");
                  }}
                  className="flex items-center gap-1 px-2.5 py-1.5 md:px-3 md:py-2 bg-purple-950/20 hover:bg-purple-950/50 border border-purple-500/20 hover:border-purple-500/60 text-purple-200 rounded-lg cursor-pointer font-mono text-[10px] md:text-[11px] font-bold transition-all whitespace-nowrap"
                  title="Télécharger l'intégralité du code CNDP au format MD exportable"
                >
                  <Download className="w-3.5 h-3.5 text-purple-400" />
                  <span>📥 Exp. CNDP (.md)</span>
                </button>

                <button
                  onClick={() => {
                    handleAddPrivacyLog("Download Ecosystem Code", "Téléchargement de l'intégralité du code structuré MyCity.");
                    triggerClientDownload(ecosystemMarkdown, "mycity_ecosystem_codebase.md");
                  }}
                  className="flex items-center gap-1 px-2.5 py-1.5 md:px-3 md:py-2 bg-indigo-950/20 hover:bg-indigo-950/50 border border-indigo-500/20 hover:border-indigo-500/60 text-indigo-300 rounded-lg cursor-pointer font-mono text-[10px] md:text-[11px] font-bold transition-all whitespace-nowrap"
                  title="Télécharger l'intégralité du code structuré de l'écosystème MyCity au format MD"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-400" />
                  <span>📥 Exp. Écosystème (.md)</span>
                </button>

                <button
                  onClick={() => {
                    setIsGithubRoomOpen(true);
                    handleAddPrivacyLog("GitHub Data Room Open", "Ouverture de la Tech Data Room GitHub & Pitch.");
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 md:px-3 md:py-2 bg-amber-950/20 hover:bg-amber-850 border border-amber-500/20 hover:border-amber-500/60 text-amber-200 rounded-lg cursor-pointer font-mono text-[10px] md:text-[11px] font-bold transition-all whitespace-nowrap"
                  title="Ouvrir la Tech Data Room (GitHub) de MyCity"
                >
                  <Cpu className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>🐙 GitHub Data Room</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex bg-[#0b0d14] p-1 rounded-2xl border border-white/5 gap-1 text-[10px] font-mono font-bold w-full xl:w-auto overflow-x-auto">
            {(['PUBLIC', 'PARTENAIRES', 'MAIRIE', 'DATA_TEAM'] as UserRole[]).map((role) => (
              <button
                key={role}
                id={`global-role-switch-${role}`}
                onClick={() => {
                  setUserRole(role);
                  handleAddPrivacyLog("Role Toggle", `Utilisateur a basculé vers le rôle : ${role}`);
                }}
                className={`flex-1 md:flex-none px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
                  userRole === role
                    ? portalTheme.activeTabClass
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {role === 'PUBLIC' && <User className="w-3.5 h-3.5" />}
                {role === 'PARTENAIRES' && <Building className="w-3.5 h-3.5 text-[#00ffcc]" />}
                {role === 'MAIRIE' && <Landmark className="w-3.5 h-3.5" />}
                {role === 'DATA_TEAM' && <Database className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />}
                
                {role === 'PUBLIC' && t.publicCitoyen}
                {role === 'PARTENAIRES' && (currentLang === 'FR' ? "PARTENAIRES (SaaS)" : currentLang === 'AR' ? "شركاء الأعمال" : "PARTNERS (SaaS)")}
                {role === 'MAIRIE' && t.mairieLabel}
                {role === 'DATA_TEAM' && (currentLang === 'FR' ? "Équipe Data" : currentLang === 'AR' ? "تحليل البيانات" : "Data Team")}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full max-w-7xl mx-auto px-4 lg:px-6 pt-2 pb-3">
        <div className="bg-[#12141c]/90 border border-white/5 p-1.5 rounded-2xl flex flex-col md:flex-row gap-2 shadow-2xl">
          <div className="flex-1 grid grid-cols-3 gap-1.5">
            <button
              onClick={() => {
                navigateXovia('HOME');
                handleAddPrivacyLog("Xovia Navigate Home", "Sélection du portefeuille XOVIA : MyCity Home (Habitat, syndic, immo).");
              }}
              className={`py-3 px-4 text-xs font-title font-black rounded-xl transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                xoviaModule === 'HOME'
                  ? 'bg-gradient-to-br from-[#a16eff] to-[#7c3aed] text-white shadow-lg shadow-[#a16eff]/20 scale-[1.01]'
                  : 'text-gray-400 hover:text-white hover:bg-[#a16eff]/5 border border-transparent'
              }`}
            >
              <span className="text-sm">🏠</span>
              <span>1. MyCity Home</span>
            </button>
            
            <button
              onClick={() => {
                navigateXovia('LIFE');
                handleAddPrivacyLog("Xovia Navigate Life", "Sélection du portefeuille XOVIA : MyCity Life (Commerces, événements, community).");
              }}
              className={`py-3 px-4 text-xs font-title font-black rounded-xl transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                xoviaModule === 'LIFE'
                  ? 'bg-gradient-to-br from-[#d4af7a] to-[#b88c4c] text-neutral-950 shadow-lg shadow-[#d4af7a]/20 scale-[1.01]'
                  : 'text-gray-400 hover:text-white hover:bg-[#d4af7a]/5 border border-transparent'
              }`}
            >
              <span className="text-sm">🌱</span>
              <span>2. MyCity Life</span>
            </button>

            <button
              onClick={() => {
                navigateXovia('URBAN');
                handleAddPrivacyLog("Xovia Navigate Urban", "Sélection du portefeuille XOVIA : MyCity Urban (Citoyenneté, voirie, alertes).");
              }}
              className={`py-3 px-4 text-xs font-title font-black rounded-xl transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                xoviaModule === 'URBAN'
                  ? 'bg-gradient-to-br from-[#7dd3fc] to-[#0284c7] text-slate-950 shadow-lg shadow-[#7dd3fc]/20 scale-[1.01]'
                  : 'text-gray-400 hover:text-white hover:bg-[#7dd3fc]/5 border border-transparent'
              }`}
            >
              <span className="text-sm">🏙️</span>
              <span>3. MyCity Urban</span>
            </button>
          </div>

          <div className="shrink-0 md:w-px md:h-auto h-px bg-white/10 w-full" />

          <button
            onClick={() => {
              navigateXovia('TRANSVERSE');
              handleAddPrivacyLog("Xovia Navigate Transverse", "Sélection du cockpit XOVIA Modules Transverses (Commissions, AI, Trust).");
            }}
            className={`py-3 px-5 text-xs font-title font-black rounded-xl transition-all flex flex-col items-center justify-center gap-1 cursor-pointer shrink-0 ${
              xoviaModule === 'TRANSVERSE'
                ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-neutral-950 shadow-lg shadow-emerald-500/20 scale-[1.01]'
                : 'text-[#00ffcc] hover:bg-emerald-500/5 hover:text-white border border-[#00ffcc]/10'
            }`}
          >
            <span className="text-sm">🔗</span>
            <span>Modules Transverses</span>
          </button>
        </div>

        {/* XOVIA SUB-MODULE DYNAMIC NAVIGATION BAR */}
        <div className="mt-3 bg-[#161821]/50 border border-white/5 rounded-xl p-1 flex gap-2 overflow-x-auto scrollbar-none">
          {xoviaModule === 'HOME' && (
            <>
              <button
                onClick={() => setHomeSubTab('RESIDENCE')}
                className={`flex-1 py-1 px-3 text-[11px] font-mono font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  homeSubTab === 'RESIDENCE' ? 'bg-[#a16eff]/20 text-[#a16eff] border border-[#a16eff]/30' : 'text-gray-400 hover:text-white'
                }`}
              >
                🏘️ MyResidence / MySyndic
              </button>
              <button
                onClick={() => setHomeSubTab('HOST')}
                className={`flex-1 py-1 px-3 text-[11px] font-mono font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  homeSubTab === 'HOST' ? 'bg-[#a16eff]/20 text-[#a16eff] border border-[#a16eff]/30' : 'text-gray-400 hover:text-white'
                }`}
              >
                ✈️ MyHost MRE
              </button>
              <button
                onClick={() => setHomeSubTab('IMMO')}
                className={`flex-1 py-1 px-3 text-[11px] font-mono font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  homeSubTab === 'IMMO' ? 'bg-[#a16eff]/20 text-[#a16eff] border border-[#a16eff]/30' : 'text-gray-400 hover:text-white'
                }`}
              >
                🔑 MyImmo
              </button>
              <button
                onClick={() => setHomeSubTab('SERVICES')}
                className={`flex-1 py-1 px-3 text-[11px] font-mono font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  homeSubTab === 'SERVICES' ? 'bg-[#a16eff]/20 text-[#a16eff] border border-[#a16eff]/30' : 'text-gray-400 hover:text-white'
                }`}
              >
                🛠️ MyHome Services
              </button>
            </>
          )}

          {xoviaModule === 'LIFE' && (
            <>
              <button
                onClick={() => setLifeSubTab('EVENTS')}
                className={`flex-1 py-1 px-3 text-[11px] font-mono font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  lifeSubTab === 'EVENTS' ? 'bg-[#d4af7a]/20 text-[#d4af7a] border border-[#d4af7a]/30' : 'text-gray-400 hover:text-white'
                }`}
              >
                🎭 MyEvents
              </button>
              <button
                onClick={() => setLifeSubTab('BUSINESS')}
                className={`flex-1 py-1 px-3 text-[11px] font-mono font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  lifeSubTab === 'BUSINESS' ? 'bg-[#d4af7a]/20 text-[#d4af7a] border border-[#d4af7a]/30' : 'text-gray-400 hover:text-white'
                }`}
              >
                🏪 MyBusiness
              </button>
              <button
                onClick={() => setLifeSubTab('MARKETPLACE')}
                className={`flex-1 py-1 px-3 text-[11px] font-mono font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  lifeSubTab === 'MARKETPLACE' ? 'bg-[#d4af7a]/20 text-[#d4af7a] border border-[#d4af7a]/30' : 'text-gray-400 hover:text-white'
                }`}
              >
                🛒 MyMarketplace
              </button>
              <button
                onClick={() => setLifeSubTab('COMMUNITY')}
                className={`flex-1 py-1 px-3 text-[11px] font-mono font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  lifeSubTab === 'COMMUNITY' ? 'bg-[#d4af7a]/20 text-[#d4af7a] border border-[#d4af7a]/30' : 'text-gray-400 hover:text-white'
                }`}
              >
                💬 MyCommunity
              </button>
            </>
          )}

          {xoviaModule === 'URBAN' && (
            <>
              <button
                onClick={() => setUrbanSubTab('CIVIC')}
                className={`flex-1 py-1 px-3 text-[11px] font-mono font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  urbanSubTab === 'CIVIC' ? 'bg-[#4fc3f7]/20 text-[#4fc3f7] border border-[#4fc3f7]/30' : 'text-gray-400 hover:text-white'
                }`}
              >
                🌿 MyCivic / Signalements
              </button>
              <button
                onClick={() => setUrbanSubTab('ALERT')}
                className={`flex-1 py-1 px-3 text-[11px] font-mono font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  urbanSubTab === 'ALERT' ? 'bg-[#4fc3f7]/20 text-[#4fc3f7] border border-[#4fc3f7]/30' : 'text-gray-400 hover:text-white'
                }`}
              >
                🚨 MyAlert / Sécurité
              </button>
              <button
                onClick={() => setUrbanSubTab('GOV')}
                className={`flex-1 py-1 px-3 text-[11px] font-mono font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  urbanSubTab === 'GOV' ? 'bg-[#4fc3f7]/20 text-[#4fc3f7] border border-[#4fc3f7]/30' : 'text-gray-400 hover:text-white'
                }`}
              >
                🏛️ MyGov / Administration
              </button>
              <button
                onClick={() => setUrbanSubTab('DATA')}
                className={`flex-1 py-1 px-3 text-[11px] font-mono font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  urbanSubTab === 'DATA' ? 'bg-[#4fc3f7]/20 text-[#4fc3f7] border border-[#4fc3f7]/30' : 'text-gray-400 hover:text-white'
                }`}
              >
                📊 MyUrban Data / BI
              </button>
            </>
          )}

          {xoviaModule === 'TRANSVERSE' && (
            <>
              <button
                onClick={() => setTransverseSubTab('ARCH_DASHBOARD')}
                className={`flex-1 py-1 px-3 text-[11px] font-mono font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  transverseSubTab === 'ARCH_DASHBOARD' ? 'bg-emerald-500/25 text-emerald-400 border border-emerald-500/30' : 'text-gray-400 hover:text-white'
                }`}
              >
                📊 Architecture & Requêtes XOVIA
              </button>
              <button
                onClick={() => setTransverseSubTab('PAY')}
                className={`flex-1 py-1 px-3 text-[11px] font-mono font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  transverseSubTab === 'PAY' ? 'bg-emerald-500/25 text-emerald-400 border border-emerald-500/30' : 'text-gray-400 hover:text-white'
                }`}
              >
                💰 MyCity Pay
              </button>
              <button
                onClick={() => setTransverseSubTab('MANAGER')}
                className={`flex-1 py-1 px-3 text-[11px] font-mono font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  transverseSubTab === 'MANAGER' ? 'bg-emerald-500/25 text-emerald-400 border border-emerald-500/30' : 'text-gray-400 hover:text-white'
                }`}
              >
                ⚙️ MyCity Manager
              </button>
              <button
                onClick={() => setTransverseSubTab('PARTNER')}
                className={`flex-1 py-1 px-3 text-[11px] font-mono font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  transverseSubTab === 'PARTNER' ? 'bg-emerald-500/25 text-emerald-400 border border-emerald-500/30' : 'text-gray-400 hover:text-white'
                }`}
              >
                🤝 MyCity Partner
              </button>
              <button
                onClick={() => setTransverseSubTab('AI')}
                className={`flex-1 py-1 px-3 text-[11px] font-mono font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  transverseSubTab === 'AI' ? 'bg-emerald-500/25 text-emerald-400 border border-emerald-500/30' : 'text-gray-400 hover:text-white'
                }`}
              >
                🧠 MyCity AI
              </button>
              <button
                onClick={() => setTransverseSubTab('TRUST')}
                className={`flex-1 py-1 px-3 text-[11px] font-mono font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  transverseSubTab === 'TRUST' ? 'bg-emerald-500/25 text-emerald-400 border border-emerald-500/30' : 'text-gray-400 hover:text-white'
                }`}
              >
                🛡️ Trust & Data/CNDP
              </button>
            </>
          )}
        </div>
      </div>

      {/* CORE GRID SHELL (MAPPED AS THEME bento GRID) */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: ACTIVE INTERACTIVE CITY MAP OR MYRESIDENCE HUB */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* RENDER MYCITY HOME WORKSPACES */}
          {xoviaModule === 'HOME' && (
            <div className="space-y-6">
              {homeSubTab === 'RESIDENCE' && (
                <div className="bg-[#161821] border border-white/5 p-4 rounded-3xl shadow-xl">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-4">
                    <span className="p-1 px-2.5 rounded bg-[#a16eff]/10 text-[#a16eff] font-mono text-[9px] font-bold">PORTFOLIO HOME</span>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">MyResidence & MySyndic</h3>
                  </div>
                  <MyResidence currentLang={currentLang} />
                </div>
              )}
              {homeSubTab === 'HOST' && (
                <div className="bg-[#161821] border border-white/5 p-6 rounded-3xl shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1 px-2.5 rounded bg-[#a16eff]/10 text-[#a16eff] font-mono text-[9px] font-bold font-black">PORTFOLIO HOME</span>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">MyHost MRE</h3>
                    </div>
                    <span className="font-mono text-[9px] text-gray-500 uppercase">Gestion Locative Court Terme</span>
                  </div>
                  <HostModule currentLang={currentLang} />
                </div>
              )}
              {homeSubTab === 'IMMO' && (
                <div className="bg-[#161821] border border-white/5 p-4 rounded-3xl shadow-xl">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-4">
                    <span className="p-1 px-2.5 rounded bg-[#a16eff]/10 text-[#a16eff] font-mono text-[9px] font-bold">PORTFOLIO HOME</span>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">MyImmo</h3>
                  </div>
                  <MyHome currentLang={currentLang} defaultSubTab="IMMO" />
                </div>
              )}
              {homeSubTab === 'SERVICES' && (
                <div className="bg-[#161821] border border-white/5 p-4 rounded-3xl shadow-xl">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-4">
                    <span className="p-1 px-2.5 rounded bg-[#a16eff]/10 text-[#a16eff] font-mono text-[9px] font-bold">PORTFOLIO HOME</span>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">MyHome Services</h3>
                  </div>
                  <MyHome currentLang={currentLang} defaultSubTab="CONCIERGE" />
                </div>
              )}
            </div>
          )}

          {/* RENDER MYCITY LIFE WORKSPACES */}
          {xoviaModule === 'LIFE' && (
            <div className="space-y-6">
              {lifeSubTab === 'EVENTS' && (
                <div className="bg-[#161821] border border-white/5 p-4 rounded-3xl shadow-xl">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-4">
                    <span className="p-1 px-2.5 rounded bg-[#d4af7a]/10 text-[#d4af7a] font-mono text-[9px] font-bold">PORTFOLIO LIFE</span>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">MyEvents</h3>
                  </div>
                  <MyLife 
                    currentLang={currentLang} 
                    events={events}
                    defaultLifeTab="AGENDA"
                    defaultCategoryId={1}
                    onPostReview={handlePostReview}
                    onPostLike={handlePostLike}
                    onSelectEventOnMap={handleSelectEventOnMap}
                  />
                </div>
              )}
              {lifeSubTab === 'BUSINESS' && (
                <div className="bg-[#161821] border border-white/5 p-4 rounded-3xl shadow-xl">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-4">
                    <span className="p-1 px-2.5 rounded bg-[#d4af7a]/10 text-[#d4af7a] font-mono text-[9px] font-bold">PORTFOLIO LIFE</span>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">MyBusiness Directory</h3>
                  </div>
                  <MyLife 
                    currentLang={currentLang} 
                    events={events}
                    defaultLifeTab="PROVIDERS"
                    defaultCategoryId={5}
                    onPostReview={handlePostReview}
                    onPostLike={handlePostLike}
                    onSelectEventOnMap={handleSelectEventOnMap}
                  />
                </div>
              )}
              {lifeSubTab === 'MARKETPLACE' && (
                <div className="bg-[#161821] border border-white/5 p-4 rounded-3xl shadow-xl">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-4">
                    <span className="p-1 px-2.5 rounded bg-[#d4af7a]/10 text-[#d4af7a] font-mono text-[9px] font-bold">PORTFOLIO LIFE</span>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">MyMarketplace / Réservations</h3>
                  </div>
                  <MyLife 
                    currentLang={currentLang} 
                    events={events}
                    defaultLifeTab="PROVIDERS"
                    defaultCategoryId={8}
                    onPostReview={handlePostReview}
                    onPostLike={handlePostLike}
                    onSelectEventOnMap={handleSelectEventOnMap}
                  />
                </div>
              )}
              {lifeSubTab === 'COMMUNITY' && (
                <div className="bg-[#161821] border border-white/5 p-6 rounded-3xl shadow-xl space-y-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="space-y-1">
                      <span className="p-1 px-2.5 rounded bg-[#d4af7a]/10 text-[#d4af7a] font-mono text-[9px] font-bold uppercase tracking-widest font-black">PORTFOLIO LIFE</span>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wide">MyCommunity</h3>
                    </div>
                    <span className="font-mono text-[9px] text-[#d4af7a] uppercase font-bold tracking-widest bg-[#d4af7a]/10 px-2.5 py-1 rounded">Voisinage Gauthier</span>
                  </div>
                  <p className="text-xs text-gray-300">Bienvenue dans l'espace communautaire de Casablanca. Échangez avec vos voisins, partagez des recommandations ou déposez des annonces de copropriété certifiées.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-black/30 p-4 border border-white/5 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-black uppercase">RECOMMANDATION</span>
                        <span className="text-[10px] text-gray-500 font-mono">Il y a 2h</span>
                      </div>
                      <h4 className="text-xs font-bold text-white">Recherche d'un bon menuisier à Gauthier</h4>
                      <p className="text-xs text-gray-400 leading-normal">"Bonjour, je recommande vivement Maâlem Abdelhalim. Il vient de rénover entièrement mes volets en bois à la rue de Rome. Prix juste, ponctuel et travail soigné."</p>
                      <div className="text-[10px] text-[#d4af7a] font-bold flex items-center gap-1">👤 Par Fatima O. • 👍 12 Likes</div>
                    </div>
                    
                    <div className="bg-black/30 p-4 border border-white/5 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded font-black uppercase">ANNONCE LOCALE</span>
                        <span className="text-[10px] text-gray-500 font-mono">Il y a 1 jour</span>
                      </div>
                      <h4 className="text-xs font-bold text-white">Cours de yoga collectif au Parc de la Ligue Arabe</h4>
                      <p className="text-xs text-gray-400 leading-normal">"Ce samedi matin à 9h. Amenez votre tapis ! Séance gratuite d'éveil musculaire sous les palmiers. Ouvert à tous les niveaux."</p>
                      <div className="text-[10px] text-[#d4af7a] font-bold flex items-center gap-1">👤 Par Yassine A. • 👍 24 Likes</div>
                    </div>
                  </div>

                  <div className="bg-[#1b1c26] p-4 rounded-2xl border border-white/5 space-y-3">
                    <h4 className="text-xs font-bold text-white">Publier une annonce / conseil de voisinage</h4>
                    <div className="flex gap-2">
                      <input type="text" placeholder="Qu'avez-vous à partager avec vos voisins ?" className="flex-1 bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#d4af7a]/5" />
                      <button onClick={() => alert("Votre annonce de voisinage a été cryptographiée et envoyée avec succès sur le réseau local souverain.")} className="px-4 py-2 bg-[#d4af7a] hover:bg-[#c39e6a] text-black font-title font-bold text-xs rounded-xl cursor-pointer">Ajouter</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* RENDER MYCITY URBAN WORKSPACES */}
          {xoviaModule === 'URBAN' && (
            <div className="space-y-6">
              {urbanSubTab === 'CIVIC' && (
                <div className="bg-[#161821] border border-white/5 p-4 rounded-3xl shadow-xl">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-4">
                    <span className="p-1 px-2.5 rounded bg-[#4fc3f7]/10 text-[#4fc3f7] font-mono text-[9px] font-bold">PORTFOLIO URBAN</span>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">MyCivic - Signalements Urbains</h3>
                  </div>
                  <CitizenPortal claims={claims} onSubmitClaim={handleAddClaim} currentLang={currentLang} />
                </div>
              )}
              {urbanSubTab === 'ALERT' && (
                <div className="bg-[#161821] border border-white/5 p-6 rounded-3xl shadow-xl space-y-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="space-y-1">
                      <span className="p-1 px-2.5 rounded bg-[#7dd3fc]/10 text-[#7dd3fc] font-mono text-[9px] font-bold uppercase tracking-widest font-black">PORTFOLIO URBAN</span>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wide">MyAlert</h3>
                    </div>
                    <span className="font-mono text-[9px] text-red-400 uppercase font-bold tracking-widest bg-red-400/10 px-2.5 py-1 rounded">Alerte Intégrée</span>
                  </div>
                  <p className="text-xs text-gray-300">Station d'alertes citoyennes en temps réel pour Casablanca. Suivez les notifications d'urgences, les coupures prévues et les travaux communaux.</p>

                  <div className="space-y-3">
                    <div className="bg-red-500/5 p-3 rounded-2xl border border-red-500/10 flex items-start gap-3">
                      <div className="p-2 bg-red-500/10 text-red-500 rounded-xl">⚠️</div>
                      <div className="text-xs space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-red-400">URGENT</span>
                          <span className="text-[10px] text-gray-500 font-mono">11/06/2026 à 14:00</span>
                        </div>
                        <p className="text-white font-bold leading-none">Coupure d'eau provisoire - Gauthier G2</p>
                        <p className="text-gray-400 leading-normal mt-0.5">Lydec annonce des travaux de raccordement réseau ce soir de 23:00 à 04:00. Stockage d'eau à prévoir d'urgence.</p>
                      </div>
                    </div>

                    <div className="bg-amber-500/5 p-3 rounded-2xl border border-amber-500/10 flex items-start gap-3">
                      <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl">🚧</div>
                      <div className="text-xs space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-amber-400">TRAVAUX</span>
                          <span className="text-[10px] text-gray-500 font-mono">Hier à 10:30</span>
                        </div>
                        <p className="text-white font-bold leading-none">Rénovation de voirie - Bd de l'Aéropostale</p>
                        <p className="text-gray-400 leading-normal mt-0.5">Voie de gauche fermée temporairement pour renouvellement de l'enrobé. Prudence recommandée chez tous les usagers.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {urbanSubTab === 'GOV' && (
                <div className="bg-[#161821] border border-white/5 p-4 rounded-3xl shadow-xl">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-4">
                    <span className="p-1 px-2.5 rounded bg-[#4fc3f7]/10 text-[#4fc3f7] font-mono text-[9px] font-bold font-black">PORTFOLIO URBAN</span>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider font-title">MyGov - Espace Municipal</h3>
                  </div>
                  <MairiePortal
                    claims={claims}
                    pharmacies={INITIAL_PHARMACIES}
                    hospitals={INITIAL_HOSPITALS}
                    privacyLogs={privacyLogs}
                    onUpdateClaimStatus={handleUpdateClaimStatus}
                    onAddLog={handleAddPrivacyLog}
                    currentLang={currentLang}
                    onChangeUserRole={setUserRole}
                    onChangeActiveModule={setActiveMainModule}
                    onOpenSqlSpec={() => setIsSqlSpecOpen(true)}
                    currentUserRole={userRole}
                  />
                </div>
              )}
              {urbanSubTab === 'DATA' && (
                <div className="space-y-6">
                  {/* Section Heading */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
                      🗺️ Simulateur de Télémétrie Urbaine
                      <span className="font-mono text-[9px] text-[#00f0ff] uppercase bg-indigo-950/40 border border-indigo-700/30 px-2 py-0.5 rounded tracking-widest font-black">Temps Réel</span>
                    </h2>
                    <div className="text-[10px] font-mono text-gray-500">
                      Coordonnées de Casablanca : <strong className="text-gray-300">33.57° N, -7.63° W</strong>
                    </div>
                  </div>

                  <MapSimulation
                    userRole={userRole}
                    events={events}
                    claims={claims}
                    pharmacies={INITIAL_PHARMACIES}
                    activeCategoryFilter={activeCategoryFilter}
                    onSelectEvent={handleSelectEventOnMap}
                    onSelectMyHome={() => {
                      navigateXovia('HOME');
                      handleAddPrivacyLog("Map Navigate Home", "Redirection depuis la carte vers MyHome (Espace immobilier).");
                    }}
                    currentLang={currentLang}
                  />

                  <div className="bg-[#161821] border border-white/5 p-4 rounded-3xl shadow-xl">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-4">
                      <span className="p-1 px-2.5 rounded bg-[#4fc3f7]/10 text-[#4fc3f7] font-mono text-[9px] font-bold">PORTFOLIO URBAN</span>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">MyUrban Data Dashboard</h3>
                    </div>
                    <DataTeamDashboard
                      events={events}
                      onAddLog={handleAddPrivacyLog}
                      currentLang={currentLang}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* RENDER XOVIA TRANSVERSE CORE WORKSPACES */}
          {xoviaModule === 'TRANSVERSE' && (
            <div className="space-y-6">
              {transverseSubTab === 'ARCH_DASHBOARD' && (
                <XoviaUniverseDashboard currentLang={currentLang} />
              )}
              {transverseSubTab === 'PAY' && (
                <div className="bg-[#161821] border border-white/5 p-6 rounded-3xl shadow-xl space-y-6">
                  <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <div className="space-y-1">
                      <span className="p-1 px-2.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[9px] font-bold font-black">TRANSVERSAL CORE</span>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wide">MyCity Pay</h3>
                    </div>
                    <span className="font-mono text-[9px] text-[#00ffcc] uppercase font-bold tracking-widest bg-[#00ffcc]/10 px-2.5 py-1 rounded">RÉSEAU SOUVERAIN</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">Passerelle de transaction financière anonymisée et sécurisée pour les règlements de charges syndicaux, commissions marketplace, et acomptes de prestations partenaires.</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/35 p-4 rounded-2xl border border-white/5 text-xs text-left">
                      <span className="text-[9px] font-mono text-gray-500 uppercase block">Total Transactions Copro</span>
                      <span className="text-lg font-black text-white font-mono mt-1 block">148,320 MAD</span>
                    </div>
                    <div className="bg-black/35 p-4 rounded-2xl border border-[#00ffcc]/15 text-xs text-left">
                      <span className="text-[9px] font-mono text-[#00ffcc] uppercase block">Assiette Commissions (1.5%)</span>
                      <span className="text-lg font-black text-[#00ffcc] font-mono mt-1 block">2,224.8 MAD</span>
                    </div>
                  </div>

                  <div className="bg-[#1b1c26] p-4 rounded-2xl border border-white/5 space-y-3">
                    <h4 className="text-xs font-bold text-white">Registre transactions récentes</h4>
                    <div className="space-y-2 text-[11px] font-mono">
                      <div className="flex justify-between items-center bg-black/20 p-2.5 rounded-lg border border-white/5">
                        <span className="text-gray-400">#TX-90341 (Charges Syndic Les Jardins)</span>
                        <span className="text-emerald-400 font-black font-mono">+1,200 MAD</span>
                      </div>
                      <div className="flex justify-between items-center bg-black/20 p-2.5 rounded-lg border border-white/5">
                        <span className="text-gray-400">#TX-90339 (Commission Padel Oasis)</span>
                        <span className="text-emerald-450 font-black text-emerald-400 font-mono">+9.5 MAD</span>
                      </div>
                      <div className="flex justify-between items-center bg-black/20 p-2.5 rounded-lg border border-white/5">
                        <span className="text-gray-400 font-medium text-gray-400">#TX-90338 (Maintenance Plomberie Hassan)</span>
                        <span className="text-emerald-400 font-black font-mono">+350 MAD</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {transverseSubTab === 'MANAGER' && (
                <div className="bg-[#161821] border border-white/5 p-6 rounded-3xl shadow-xl space-y-6">
                  <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <div className="space-y-1">
                      <span className="p-1 px-2.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[9px] font-bold font-black">TRANSVERSAL CORE</span>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wide">MyCity Manager</h3>
                    </div>
                    <span className="font-mono text-[9px] text-[#00ffcc] uppercase font-bold tracking-widest bg-[#00ffcc]/10 px-2.5 py-1 rounded">ADMIN BACK-OFFICE</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">Console de supervision interne réservée aux exploitants administratifs, syndics délégués, et modérateurs municipaux de Casablanca.</p>

                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                        <span className="text-[8px] font-mono text-gray-500 uppercase block">Copropriétés</span>
                        <span className="text-sm font-black text-white font-mono">14</span>
                      </div>
                      <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                        <span className="text-[8px] font-mono text-gray-500 uppercase block">Commerçants</span>
                        <span className="text-sm font-black text-white font-mono">82</span>
                      </div>
                      <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                        <span className="text-[8px] font-mono text-gray-500 uppercase block">Prestataires</span>
                        <span className="text-sm font-black text-white font-mono">245</span>
                      </div>
                    </div>

                    <div className="bg-[#1b1c26] p-4 rounded-2xl border border-white/5 space-y-2">
                      <h4 className="text-xs font-bold text-white">Actions d'Exploitant</h4>
                      <div className="flex flex-col gap-2 pt-1">
                        <button onClick={() => alert("Tous les syndics inactifs ont reçu une relance automatisée de paiement.")} className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-neutral-950 transition-colors text-xs font-bold font-title rounded-xl cursor-pointer">
                          ⚡ Relancer l'ensemble des Impayés Syndicaux
                        </button>
                        <button onClick={() => alert("Notification de tempête de sable envoyée à l'intégralité des résidents de Dar Bouazza.")} className="py-2.5 bg-neutral-900 border border-white/10 hover:bg-white/5 text-gray-300 hover:text-white transition-colors text-xs font-bold font-title rounded-xl cursor-pointer">
                          📡 Diffuser une Alerte Métropolitaine Directe
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {transverseSubTab === 'PARTNER' && (
                <div className="bg-[#161821] border border-white/5 p-6 rounded-3xl shadow-xl space-y-6">
                  <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <div className="space-y-1">
                      <span className="p-1 px-2.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[9px] font-bold font-black">TRANSVERSAL CORE</span>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wide">MyCity Partner Space</h3>
                    </div>
                    <span className="font-mono text-[9px] text-[#00ffcc] uppercase font-bold tracking-widest bg-[#00ffcc]/10 px-2.5 py-1 rounded font-bold">B2B SaaS</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">Espace partenaire dédié aux PME locales, agences immobilières d'Anfa, prestataires de travaux certifiés, et syndics professionnels de Casablanca.</p>

                  <div className="bg-black/35 p-5 border border-white/5 rounded-2xl space-y-3">
                    <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                      <span className="text-gray-400 font-medium">Bannière Publicitaire Promouvoir</span>
                      <span className="text-emerald-400 font-bold font-mono">Bientôt En Ligne</span>
                    </div>
                    <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                      <span className="text-gray-400 font-medium">Fiches Agences Immobilères</span>
                      <span className="text-white font-bold font-mono">12 Agréées</span>
                    </div>
                    <div className="flex justify-between text-xs pb-1">
                      <span className="text-gray-400 font-medium">Badge de labellisation MyCity</span>
                      <span className="text-[#a16eff] font-black font-mono">MyCity Certifié ★</span>
                    </div>
                  </div>
                </div>
              )}
              {transverseSubTab === 'AI' && (
                <div className="bg-[#161821] border border-white/5 p-6 rounded-3xl shadow-xl space-y-6">
                  <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <div className="space-y-1">
                      <span className="p-1 px-2.5 rounded bg-pink-500/10 text-pink-400 font-mono text-[9px] font-bold font-black">TRANSVERSAL CORE</span>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wide">MyCity AI Sémantique</h3>
                    </div>
                    <span className="font-mono text-[9px] text-pink-300 uppercase font-bold tracking-widest bg-pink-300/10 px-2.5 py-1 rounded">INTELLIGENCE</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">Algorithmes d'auto-classification et de priorisation. Tri contextuel automatique des réclamations routées vers la communes de Casablanca.</p>

                  <div className="bg-black/35 p-4 rounded-xl border border-white/5 space-y-3">
                    <h4 className="text-xs font-bold text-white font-title">Simulateur de Classification Sémantique</h4>
                    <p className="text-[10px] text-gray-400 leading-relaxed">Entrez un signalement citoyen pour simuler son extraction d'entités, attribution de priorité d'urgence et routage d'astreinte automatiques.</p>
                    
                    <div className="flex flex-col md:flex-row gap-2 pt-1">
                      <input id="ai-classification-box" defaultValue="Fuite d'eau abondante qui menace d'inonder le cellier de la copropriété" className="flex-grow bg-black/45 border border-white/10 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-pink-500/50 text-white font-sans" />
                      <button onClick={() => alert("CLASSIFICATION IA SOUVERAINE :\n\n🏷️ SERVICE : VOIRIE & INCIDENT TECHNIQUE (URGENT)\n🔥 SEVERITÉ : ÉLEVÉE (Fuite d'eau active)\n🤖 ASTREINTE : Envoyer à l'équipe locale de la Lydec Maârif\n📝 ANALYSE : Identification 'Fuite d'eauabondante' & 'Inondation'")} className="px-5 py-2.5 bg-pink-600 hover:bg-pink-500 text-white font-bold font-title text-xs rounded-xl cursor-pointer whitespace-nowrap">
                        Visualiser Dispatcher IA
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {transverseSubTab === 'TRUST' && (
                <div className="bg-[#161821] border border-white/5 p-6 rounded-3xl shadow-xl space-y-6">
                  <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <div className="space-y-1">
                      <span className="p-1 px-2.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[9px] font-bold font-black">TRANSVERSAL CORE</span>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wide">MyCity Trust & Data Security</h3>
                    </div>
                    <span className="font-mono text-[9px] text-emerald-400 uppercase font-bold tracking-widest bg-emerald-400/10 px-2.5 py-1 rounded">CNDP COMPLIANT</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">Journal d'audit cryptographique souverain de MyCity. Assure le respect strict du consentement de géolocalisation et le droit d'asphyxie réglementaire des empreintes (loi CNDP 09-08).</p>

                  <div className="bg-black/35 p-5 border border-white/5 rounded-2xl space-y-4 text-left">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase">
                      🔒 Actions Droits à l'Oubli & Consentements loi 09-08
                    </h4>
                    <p className="text-[11px] text-gray-400 leading-relaxed">Conformément à la législation nationale sur la protection des données personnelles, l'utilisateur possède à tout moment le droit de révoquer ses consentements granulaires ou de purger instantanément sa session.</p>
                    <div className="flex flex-wrap gap-2.5 pt-1">
                      <button 
                        onClick={() => {
                          setDbSpecInitialTab('CNDP_COMPLIANCE');
                          setIsSqlSpecOpen(true);
                        }} 
                        className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-neutral-950 transition-all text-xs font-bold font-title rounded-xl cursor-pointer"
                      >
                        🔒 Ouvrir le CNDP Compliance Panel
                      </button>
                      <button 
                        onClick={handleClearCitizenData} 
                        className="py-2 px-4 bg-red-950/40 hover:bg-red-950 border border-red-500/20 hover:border-red-500/60 text-red-200 hover:text-white transition-all text-xs font-bold font-title rounded-xl cursor-pointer"
                      >
                        🚨 Activer le Droit à l'Oubli (Effacer tout)
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: INTEGRATED PERSISTENT SIDEBAR UTILITIES WITH MONO TITLES */}
        <div className="space-y-6 flex flex-col justify-start">
          
          {/* AI COMPANION DIALOG WINDOW */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono text-white/40 uppercase tracking-widest flex items-center gap-1.5">
              🤖 AssistantIA Curation
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-pulse"></span>
            </h3>
            <ChatCompanion userRole={userRole} currentLang={currentLang} />
          </div>

          {/* OFFLINE MESH SIMULATOR SCREEN */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono text-white/40 uppercase tracking-widest flex items-center gap-1.5">
              📡 Module BLE Resiliency
            </h3>
            <BLEMeshSim onAddLog={handleAddPrivacyLog} currentLang={currentLang} />
          </div>

        </div>

      </main>

      {/* FOOTER BRUTALIST SIGNATURE BAR WITH CALM NEBULA LABELS */}
      <footer className="mt-auto py-3 px-6 bg-[#090b10] border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] font-mono text-gray-500">
        <div className="flex items-center gap-2">
          <span>🇲🇦 Casablanca, Maroc</span>
          <span>•</span>
          <span>SYSTEM: v2.4.1-STABLE</span>
          <span>•</span>
          <span>COMPLIANCE: CNDP 09-08 APPROVED</span>
        </div>
        <div>
          <span>MyCity Companion App • Déployé par AI Studio Build</span>
        </div>
      </footer>


      {/* SOUVERAIN DATABASE EXPOSER CONTROL PANEL */}
      <DatabaseSpecExplorer 
        isOpen={isSqlSpecOpen} 
        onClose={() => setIsSqlSpecOpen(false)} 
        currentUserRole={userRole} 
        eventsCount={events.length} 
        claimsCount={claims.length} 
        onAddLog={handleAddPrivacyLog}
        privacyConsent={privacyConsent}
        onUpdatePrivacy={handleUpdatePrivacy}
        onClearCitizenData={handleClearCitizenData}
        currentLang={currentLang}
        initialTab={dbSpecInitialTab}
        onOpenGithubRoom={() => setIsGithubRoomOpen(true)}
      />

      {/* USER PROFILE & INTERACTIONS SEAMLESS DASHBOARD */}
      <UserProfileDashboard
        isOpen={isUserDashboardOpen}
        onClose={() => setIsUserDashboardOpen(false)}
        currentUser={currentUser}
        currentUserRole={userRole}
        claims={claims}
        privacyConsent={privacyConsent}
        privacyLogs={privacyLogs}
        onUpdatePrivacy={handleUpdatePrivacy}
        onClearCitizenData={handleClearCitizenData}
        currentLang={currentLang}
      />

      {/* SANITISED BLUEPRINT SECURITY ARCHITECTURE PRESENTATION */}
      <SouverainBlueprint 
        isOpen={isBlueprintOpen} 
        onClose={() => setIsBlueprintOpen(false)} 
      />

      {/* DETAILED INTERACTIVE SECURITY AUDIT INTEGRALE */}
      <SecurityAuditIntegrale 
        isOpen={isSecurityAuditOpen} 
        onClose={() => setIsSecurityAuditOpen(false)} 
        onAddLog={handleAddPrivacyLog}
      />

      {/* GITHUB DATA ROOM MODAL */}
      <GithubDataRoom
        isOpen={isGithubRoomOpen}
        onClose={() => setIsGithubRoomOpen(false)}
        onAddLog={handleAddPrivacyLog}
        currentCity={currentCity}
      />

      {/* BRAND CHARTER AND CORRESPONDENCE EXPLORER */}
      <BrandCharterExplorer
        isOpen={isBrandCharterOpen}
        onClose={() => setIsBrandCharterOpen(false)}
        onAddLog={handleAddPrivacyLog}
      />

      {/* BEAUTIFUL NON-BLOCKING CUSTOM NOTIFICATION TOAST OVERLAY */}
      {activeToast && (
        <div className="fixed bottom-6 right-6 z-[99999] max-w-sm w-full bg-[#161821]/95 backdrop-blur border border-purple-500/30 rounded-2xl p-4 shadow-2xl shadow-black/85 animate-slide-up flex flex-col gap-3">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 bg-[#6C3CFF]/15 text-[#6c3cff] rounded-xl border border-[#6C3CFF]/20 mt-0.5 shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-left">
              <span className="font-title font-bold text-[10px] text-white uppercase tracking-wider block">Notification Système</span>
              <p className="font-mono text-[10px] leading-relaxed text-gray-300 mt-1">{activeToast}</p>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setActiveToast(null)}
              className="px-3 py-1 bg-[#6C3CFF]/20 hover:bg-[#6C3CFF] text-[#a78bfa] hover:text-white transition-all font-mono text-[9px] font-bold rounded-lg cursor-pointer"
            >
              OK, Compris
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
