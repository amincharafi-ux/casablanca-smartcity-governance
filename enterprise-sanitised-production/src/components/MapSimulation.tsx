import React, { useState } from 'react';
import { MapPin, ShieldAlert, HeartPulse, Sparkles, Building, AlertCircle, ShoppingBag, Home, Phone, Coins, ShieldCheck } from 'lucide-react';
import { CityEvent, CitizenClaim, PharmacyDeGarde, UserRole } from '../types';
import { translations, LanguageCode } from '../data/translations';

// Pre-seeded compliance-vetted Casablanca listings to showcase in the urban simulator
const SIMULATED_REAL_ESTATE_PINS = [
  {
    id: 'myhome-pin-1',
    title: "Appartement de Prestige Souverain - Boulevard d'Anfa",
    priceMAD: 2450000,
    areaSqm: 120,
    rooms: 3,
    district: "Anfa",
    isNewBuild: true,
    titleDeedNum: "48209/26",
    promoterName: "Sidi Bouskoura Promotion Pro",
    promoterContact: "+212 522-204010",
    promoterLogo: "SBP",
    coordinates: { x: 32, y: 48 },
    description: "Sublime T3 avec balcon filant orienté plein Sud, marbre de Carrare et cuisine italienne équipée haut-de-gamme."
  },
  {
    id: 'myhome-pin-2',
    title: "Penthouse Exclusif Gauthier - Standing Exceptionnel",
    priceMAD: 4100000,
    areaSqm: 185,
    rooms: 4,
    district: "Gauthier",
    isNewBuild: true,
    titleDeedNum: "93104/26",
    promoterName: "Anfa Club Promoteur",
    promoterContact: "+212 522-887766",
    promoterLogo: "ACP",
    coordinates: { x: 42, y: 46 },
    description: "Magnifique dernier étage, terrasse panoramique de 80m² sur la skyline de Casablanca et suite parentale royale."
  },
  {
    id: 'myhome-pin-3',
    title: "Villa Contemporaine California - Bâtiment d'Exception",
    priceMAD: 8900000,
    areaSqm: 420,
    rooms: 5,
    district: "California",
    isNewBuild: false,
    titleDeedNum: "12304/26",
    ownerName: "M. Bensouda Karim (Vendeur Particulier)",
    promoterContact: "+212 661-152030", // Under 1 listing condition
    coordinates: { x: 62, y: 75 },
    description: "Propriété de caractère avec piscine privative à débordement et double séjour de réception sous verrière."
  }
];

interface MapSimulationProps {
  userRole: UserRole;
  events: CityEvent[];
  claims: CitizenClaim[];
  pharmacies: PharmacyDeGarde[];
  activeCategoryFilter: string;
  onSelectEvent?: (event: CityEvent) => void;
  onSelectClaim?: (claim: CitizenClaim) => void;
  onSelectPharmacy?: (pharmacy: PharmacyDeGarde) => void;
  onSelectMyHome?: () => void; // Optional redirect
  currentLang?: LanguageCode;
}

export default function MapSimulation({
  userRole,
  events,
  claims,
  pharmacies,
  activeCategoryFilter,
  onSelectEvent,
  onSelectClaim,
  onSelectPharmacy,
  onSelectMyHome,
  currentLang = 'FR',
}: MapSimulationProps) {
  const t = translations[currentLang];
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showMyHomeOffers, setShowMyHomeOffers] = useState(true); // Enabled by default to highlight the feature immediately
  const [selectedMyHomeOffer, setSelectedMyHomeOffer] = useState<any | null>(null);
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);

  // Filter events based on role and criteria
  const visibleEvents = events.filter(evt => {
    // Partners can view all promotion events on the map to oversee placements
    if (userRole === 'PARTENAIRES') {
      if (activeCategoryFilter !== 'ALL' && evt.category !== activeCategoryFilter) {
        return false;
      }
      return true;
    }
    // Cat 1 partners are visible on map ONLY on Jour-J (isToday === true) for general audience or others
    if (evt.partnerId.includes('cat1') && !evt.isToday) {
      return false;
    }
    if (activeCategoryFilter !== 'ALL' && evt.category !== activeCategoryFilter) {
      return false;
    }
    return true;
  });

  // Hotspots for neighborhoods based on coordinate mapping (0-100 scale on SVG)
  const neighborhoods = [
    { name: 'Gauthier / Anfa', cx: 35, cy: 45, size: 70, heat: 'high', desc: 'Zone dense résidentielle & économique' },
    { name: 'Maârif', cx: 48, cy: 58, size: 90, heat: 'medium', desc: 'Centre commercial ultra-actif' },
    { name: 'Sidi Bernoussi', cx: 80, cy: 30, size: 110, heat: 'critical', desc: 'Quartier industriel et logistique' },
    { name: 'Corniche / El Hank', cx: 20, cy: 25, size: 60, heat: 'low', desc: 'Pôle culturel et touristique' },
  ];

  return (
    <div id="map-simulation-container" className="relative w-full h-[540px] rounded-[32px] overflow-hidden bg-[#0B0D14] border border-white/5 shadow-2xl">
      {/* Background Grid Pattern & SVG Roads Simulation */}
      <div className="absolute inset-0 bg-[#0f111a] opacity-85"></div>
      
      {/* Glowing radial grid from Elegant Dark template */}
      <div className="absolute inset-0 opacity-25 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#7dd3fc 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      
      {/* Grid line grid */}
      <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" width="100%" height="100%">
        <defs>
          <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(108, 60, 255, 0.4)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Styled Roads / Neighborhood Regions */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Oceans / Shoreline of Casablanca */}
        <path d="M 0 0 Q 30 15 55 10 T 100 0 L 0 0 Z" fill="rgba(108, 60, 255, 0.04)" />
        
        {/* Main Avenues / Lines */}
        <path d="M 10 45 L 90 25" stroke="rgba(255,255,255,0.04)" strokeWidth="0.8" fill="none" />
        <path d="M 20 25 Q 35 45 48 85" stroke="rgba(255,255,255,0.03)" strokeWidth="0.6" fill="none" />
        <path d="M 40 12 L 85 85" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" fill="none" />
        <path d="M 80 15 L 30 90" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" fill="none" />
        <path d="M 5 25 Q 40 30 95 65" stroke="rgba(108, 60, 255, 0.08)" strokeWidth="1.2" strokeDasharray="3,3" fill="none" />
        
        {/* Ocean Waves Accent */}
        <path d="M 20 8 Q 25 10 30 8 Q 35 6 40 8" stroke="rgba(108, 60, 255, 0.15)" strokeWidth="0.2" fill="none"/>
        <path d="M 70 4 Q 75 6 80 4" stroke="rgba(108, 60, 255, 0.15)" strokeWidth="0.2" fill="none"/>
      </svg>

      {/* HEATMAP LAYER FOR INSTITUTIONS (Mairie) */}
      {showHeatmap && (
        <div className="absolute inset-0 pointer-events-none transition-opacity duration-500">
          {neighborhoods.map((zone, idx) => (
            <div
              key={idx}
              className={`absolute rounded-full filter blur-xl opacity-30 transform -translate-x-1/2 -translate-y-1/2 animate-pulse`}
              style={{
                left: `${zone.cx}%`,
                top: `${zone.cy}%`,
                width: `${zone.size}px`,
                height: `${zone.size}px`,
                backgroundColor: 
                  zone.heat === 'critical' ? '#ff4747' :
                  zone.heat === 'high' ? '#ffb800' :
                  zone.heat === 'medium' ? '#7dd3fc' : '#00f0ff',
              }}
            />
          ))}
        </div>
      )}

      {/* NEIGHBORHOOD NAME LABELS */}
      <div className="absolute inset-0 pointer-events-none">
        <span className="absolute left-[15%] top-[12%] text-white/25 font-mono text-[10px] tracking-widest uppercase">Atlantique - Corniche</span>
        <span className="absolute left-[38%] top-[38%] text-white/30 font-title font-medium text-xs">Gauthier</span>
        <span className="absolute left-[45%] top-[65%] text-white/30 font-title font-medium text-xs">Maârif</span>
        <span className="absolute left-[72%] top-[34%] text-white/30 font-title font-medium text-xs">Sidi Bernoussi</span>
        <span className="absolute left-[22%] top-[55%] text-white/20 font-mono text-[9px] uppercase tracking-wide">Boulevard d'Anfa</span>
      </div>

      {/* CITIZEN CLAIM MARKERS (Shown for MAIRIE and optionally PUBLIC roles) */}
      {(userRole === 'MAIRIE' || userRole === 'PUBLIC') && claims.map(claim => {
        let cx = 35;
        let cy = 52;
        if (claim.id === 'claim-101') { cx = 39; cy = 46; }
        if (claim.id === 'claim-102') { cx = 52; cy = 60; }
        if (claim.id === 'claim-103') { cx = 78; cy = 32; }

        const statusColors = {
          'OUVERT': 'bg-red-500 border-red-300 shadow-red-500/50',
          'EN_COURS': 'bg-yellow-500 border-yellow-300 shadow-yellow-500/50',
          'RESOLU': 'bg-emerald-500 border-emerald-300 shadow-emerald-500/50',
        };

        const iconType = claim.category === 'ECLAIRAGE' ? '💡' : claim.category === 'DECHETS' ? '🗑️' : '⚠️';

        return (
          <button
            key={claim.id}
            id={`map-pin-${claim.id}`}
            onClick={() => {
              setSelectedPinId(claim.id);
              if (onSelectClaim) onSelectClaim(claim);
            }}
            className={`absolute z-20 group transform -translate-x-1/2 -translate-y-1/2 p-1.5 rounded-full border bg-neutral-900 transition-all duration-300 hover:scale-125 focus:outline-none ${
              selectedPinId === claim.id ? 'scale-125 ring-2 ring-[#7dd3fc]' : ''
            }`}
            style={{ left: `${cx}%`, top: `${cy}%` }}
          >
            <div className={`w-3 h-3 rounded-full ${statusColors[claim.status]} shadow-lg flex items-center justify-center`}>
              <span className="absolute -top-6 bg-black/90 text-[10px] text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity pointer-events-none">
                {iconType} {claim.title} ({claim.status})
              </span>
            </div>
            <div className={`absolute -inset-1.5 rounded-full animate-ping opacity-25 ${
              claim.status === 'OUVERT' ? 'bg-red-500' : 'bg-yellow-500'
            }`} />
          </button>
        );
      })}

      {/* PHARMACIES DE GARDE PINNEES (PUBLIC/MAIRIE only) */}
      {(userRole === 'PUBLIC' || userRole === 'MAIRIE') && pharmacies.map((ph, idx) => {
        let cx = 25 + (idx * 16);
        let cy = 30 + (idx * 12);
        if (ph.id === 'ph-1') { cx = 18; cy = 25; }
        if (ph.id === 'ph-2') { cx = 46; cy = 62; }
        if (ph.id === 'ph-3') { cx = 35; cy = 41; }
        if (ph.id === 'ph-4') { cx = 55; cy = 76; }

        if (!ph.isOpenToday) return null;

        return (
          <button
            key={ph.id}
            id={`map-pin-${ph.id}`}
            onClick={() => {
              setSelectedPinId(ph.id);
              if (onSelectPharmacy) onSelectPharmacy(ph);
            }}
            className={`absolute z-10 group transform -translate-x-1/2 -translate-y-1/2 p-1 rounded-lg bg-[#161821] border border-emerald-500/40 text-emerald-400 hover:bg-emerald-950/40 transition-all duration-200 cursor-pointer ${
              selectedPinId === ph.id ? 'ring-2 ring-emerald-500 border-emerald-400' : ''
            }`}
            style={{ left: `${cx}%`, top: `${cy}%` }}
          >
            <HeartPulse className="w-4 h-4" />
            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-neutral-900 border border-emerald-500/20 text-[10px] text-emerald-200 px-2 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 duration-200 pointer-events-none whitespace-nowrap">
              🟢 {t.mapCatDutyPharma}: {ph.name}
            </span>
          </button>
        );
      })}

      {/* CITY EVENT MARKERS (Dynamic depending on criteria & permissions) */}
      {visibleEvents.map((evt) => {
        let cx = 40;
        let cy = 50;
        if (evt.id === 'evt-1') { cx = 37; cy = 44; }
        if (evt.id === 'evt-2') { cx = 18; cy = 28; }
        if (evt.id === 'evt-3') { cx = 76; cy = 34; }
        if (evt.id === 'evt-4') { cx = 22; cy = 22; }

        const categoryColors = {
          'CULTURE': 'bg-brand-accent-culture shadow-brand-accent-culture/50 border-[#ff3c83]',
          'ECONOMIC': 'bg-brand-accent-economic shadow-brand-accent-economic/50 border-[#00f0ff]',
          'ECO_CSR': 'bg-emerald-400 shadow-emerald-400/50 border-emerald-300',
          'SERVICES': 'bg-brand-accent-services shadow-brand-accent-services/50 border-[#ffb800]',
          'SPORT': 'bg-brand-accent-sport shadow-brand-accent-sport/50 border-[#00ff66]',
          'EMERGENCY': 'bg-brand-accent-emergency shadow-brand-accent-emergency/50 border-[#ff4747]',
        };

        const isPremium = evt.isPremiumPartner;

        return (
          <button
            key={evt.id}
            id={`map-pin-${evt.id}`}
            onClick={() => {
              setSelectedPinId(evt.id);
              setSelectedMyHomeOffer(null);
              if (onSelectEvent) onSelectEvent(evt);

              // Event Sourcing API Integration - Evénement consulté
              fetch("/api/events/record", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  eventType: "EVENEMENT_CONSULTE",
                  aggregateId: evt.id,
                  payload: {
                    title: evt.title,
                    category: evt.category,
                    ticketPrice: evt.ticketPrice
                  }
                })
              }).catch(err => console.error("Event recording failed:", err));
            }}
            className={`absolute z-30 group transform -translate-x-1/2 -translate-y-1/2 p-2 rounded-xl transition-all duration-300 flex items-center justify-center cursor-pointer ${
              selectedPinId === evt.id 
                ? 'bg-brand-surface scale-125 ring-2 ring-[#7dd3fc] border border-white/10' 
                : 'hover:scale-110'
            }`}
            style={{ left: `${cx}%`, top: `${cy}%` }}
          >
            {isPremium && (
              <div className="absolute inset-0 rounded-xl bg-violet-600/20 animate-ping opacity-75 pointer-events-none" />
            )}
            
            <div className={`p-1.5 rounded-lg bg-neutral-950/90 border-2 cursor-pointer ${categoryColors[evt.category]}`}>
              {evt.category === 'ECONOMIC' && <Building className="w-3.5 h-3.5 text-[#00f0ff]" />}
              {evt.category === 'CULTURE' && <Sparkles className="w-3.5 h-3.5 text-[#ff3c83]" />}
              {evt.category === 'SPORT' && <MapPin className="w-3.5 h-3.5 text-[#00ff66]" />}
              {evt.category === 'ECO_CSR' && <Building className="w-3.5 h-3.5 text-emerald-400" />}
              {!['ECONOMIC', 'CULTURE', 'SPORT', 'ECO_CSR'].includes(evt.category) && <MapPin className="w-3.5 h-3.5 text-orange-400" />}
            </div>

            {isPremium && (
              <div className="absolute -top-1.5 -right-1 bg-yellow-400 text-[8px] font-black text-black px-1 rounded flex items-center">
                ★
              </div>
            )}

            <div className="absolute -bottom-11 text-center bg-neutral-900/95 text-[9px] text-gray-200 border border-white/5 shadow-xl px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 flex flex-col items-center whitespace-nowrap transition-opacity pointer-events-none">
              <span className="font-semibold">{evt.title}</span>
              <span className="text-gray-400 text-[8px]">{evt.partnerName} {isPremium && '⭐'}</span>
            </div>
          </button>
        );
      })}

      {/* MYHOME REAL ESTATE PINPOINTS MARKERS */}
      {showMyHomeOffers && SIMULATED_REAL_ESTATE_PINS.map((offer) => (
        <button
          key={offer.id}
          id={`map-pin-${offer.id}`}
          onClick={() => {
            setSelectedPinId(offer.id);
            setSelectedMyHomeOffer(offer);
          }}
          className={`absolute z-35 group transform -translate-x-1/2 -translate-y-1/2 p-1.5 rounded-xl transition-all duration-300 flex items-center justify-center cursor-pointer bg-[#151722]/90 border border-amber-500/50 hover:scale-125 hover:border-amber-400 ${
            selectedMyHomeOffer?.id === offer.id ? 'scale-125 ring-2 ring-amber-400 border-amber-400 bg-[#1e2133]' : 'shadow-lg shadow-amber-500/10'
          }`}
          style={{ left: `${offer.coordinates.x}%`, top: `${offer.coordinates.y}%` }}
        >
          {/* Beacon pulse circle */}
          <div className="absolute -inset-1 rounded-xl bg-amber-500/20 animate-pulse" />
          <Home className="w-3.5 h-3.5 text-amber-500" />
          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-neutral-900 border border-amber-500/20 text-[9px] text-amber-300 font-mono px-2 py-0.5 rounded shadow-xl opacity-0 group-hover:opacity-100 duration-200 pointer-events-none whitespace-nowrap z-50">
            🏠 <b>{offer.district}</b>: {offer.priceMAD.toLocaleString('fr-FR')} MAD
          </span>
        </button>
      ))}

      {/* INTERACTIVE POPUP DETAIL PREVIEW FOR COPROPRIÉTÉ / TRANSACTION */}
      {selectedMyHomeOffer && (
        <div className="absolute bottom-16 left-4 right-4 z-45 bg-[#12141d]/95 border border-amber-500/30 p-4 rounded-2xl shadow-2xl backdrop-blur-md animate-fade-in text-xs max-w-md mx-auto space-y-3">
          <div className="flex justify-between items-start gap-2">
            <div>
              <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                <span className="text-[9px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  {selectedMyHomeOffer.isNewBuild ? "PROMOTION NEUVE VEFA" : "MARKTPLACE NON-NEUF (1/User)"}
                </span>
                <span className="text-[9px] font-mono bg-violet-500/10 text-violet-300 border border-white/5 px-2 py-0.5 rounded">
                  Conserv. TF {selectedMyHomeOffer.titleDeedNum}
                </span>
              </div>
              <h4 className="font-title font-bold text-white text-xs leading-snug">{selectedMyHomeOffer.title}</h4>
              <p className="text-gray-400 text-[10.5px] mt-1 leading-relaxed">{selectedMyHomeOffer.description}</p>
            </div>
            <button 
              onClick={() => setSelectedMyHomeOffer(null)} 
              className="text-[#3cfff3] text-[11px] font-mono hover:text-white pb-1.5 shrink-0 px-1 border border-white/5 bg-black/30 rounded"
              title="Cacher l'infobulle"
            >
              Fermer ✕
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 text-[10px] font-mono bg-black/20 p-2 rounded-xl text-gray-300">
            <div>
              <span className="text-[8px] text-gray-500 block">SURFACE :</span>
              <span className="font-black text-white">{selectedMyHomeOffer.areaSqm} m²</span>
            </div>
            <div>
              <span className="text-[8px] text-gray-500 block">PIÈCES :</span>
              <span className="font-black text-white">{selectedMyHomeOffer.rooms} Ch.</span>
            </div>
            <div>
              <span className="text-[8px] text-gray-500 block font-bold text-yellow-400">PRIX :</span>
              <span className="font-black text-emerald-400">{(selectedMyHomeOffer.priceMAD / 1000000).toFixed(2)}M MAD</span>
            </div>
          </div>

          <div className="flex border-t border-white/5 pt-2 items-center justify-between text-[10px]">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 uppercase font-mono text-[9px]">Contact direct :</span>
              <span className="text-yellow-400 font-bold font-mono">{selectedMyHomeOffer.promoterContact}</span>
            </div>

            {onSelectMyHome ? (
              <button
                onClick={() => {
                  onSelectMyHome();
                  setSelectedMyHomeOffer(null);
                }}
                className="px-3 py-1 bg-[#7dd3fc] hover:bg-[#0284c7] text-white font-semibold font-title rounded-lg cursor-pointer transition-colors"
              >
                Accéder Espace MyHome 🏠
              </button>
            ) : (
              <span className="text-gray-500 bg-white/5 px-1.5 py-0.5 rounded text-[9px] font-mono">MyHome Secure</span>
            )}
          </div>
        </div>
      )}

      {/* TOP LEFT MAP CONTROLS */}
      <div className="absolute top-4 left-4 z-40 flex flex-col gap-2">
        <div className="bg-neutral-900/95 border border-white/10 rounded-lg p-2.5 flex flex-col text-xs font-mono text-gray-300">
          <span className="text-white text-[11px] font-bold tracking-widest uppercase mb-1">📡 {t.mapLiveTitle}</span>
          <div className="flex items-center gap-1.5 text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-gray-400">{t.mapP2PSync}</span>
          </div>
        </div>

        {/* Real Estate MyHome Listings Pin Overlay Switch */}
        <button
          id="myhome-pins-toggle-btn"
          onClick={() => {
            setShowMyHomeOffers(!showMyHomeOffers);
            setSelectedMyHomeOffer(null);
          }}
          className={`px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all duration-200 flex items-center gap-2 ${
            showMyHomeOffers 
              ? 'bg-amber-950/60 text-amber-400 border-amber-500/50 shadow-lg shadow-amber-500/10' 
              : 'bg-neutral-900/90 text-gray-300 border-white/5 hover:bg-neutral-800'
          }`}
          title="Afficher/Masquer les annonces immobilières MyHome sur la carte de Casablanca"
        >
          <Home className="w-3.5 h-3.5" />
          <span>🏠 MyHome Immobilier ({showMyHomeOffers ? 'Activé' : 'Masqué'})</span>
        </button>

        {/* Mairie Special Toggle for Heatmap Overlay */}
        {userRole === 'MAIRIE' && (
          <button
            id="heatmap-toggle-btn"
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all duration-200 flex items-center gap-2 ${
              showHeatmap 
                ? 'bg-red-950/60 text-red-400 border-red-500/50 shadow-lg shadow-red-500/10' 
                : 'bg-neutral-900/90 text-gray-300 border-white/5 hover:bg-neutral-800'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            {showHeatmap ? t.mapHideHeatmap : t.mapShowHeatmap}
          </button>
        )}
      </div>

      {/* FOOTER LEGEND */}
      <div className="absolute bottom-4 left-4 right-4 z-40 py-1.5 px-3 rounded-lg bg-neutral-950/85 border border-white/5 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-gray-400 backdrop-blur-md">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-[#00f0ff]" />
            <span>{t.mapCatEconomic}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff3c83]" />
            <span>{t.mapCatCulture}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-[#00ff66]" />
            <span>{t.mapCatSport}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{t.mapCatDutyPharma}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span>{t.mapCatActiveClaim}</span>
          </div>
          <div className="flex items-center gap-1 text-amber-400">
            <Home className="w-3.5 h-3.5" />
            <span>Immobilier MyHome 🏠</span>
          </div>
        </div>
        
        <div className="text-[9px] text-[#7dd3fc] font-bold">
          {userRole === 'PARTENAIRES' && (currentLang === 'FR' ? "Portail Partenaires : Visualisation complète des animations locales" : currentLang === 'AR' ? "بوابة الشركاء: عرض شامل لجميع العروض الترويجية للأعمال" : "Partners Portal: Full visualization of local business promos")}
          {userRole === 'PUBLIC' && t.mapRolePublic}
          {userRole === 'MAIRIE' && t.mapRoleMairie}
        </div>
      </div>
    </div>
  );
}
