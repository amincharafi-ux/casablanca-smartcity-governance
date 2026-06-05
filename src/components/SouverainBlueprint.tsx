import React, { useState } from 'react';
import { 
  X, Shield, Users, Radio, Info, Key, CheckCircle, AlertTriangle, 
  ArrowRight, ArrowLeft, Layers, ShieldCheck, Database, HardDrive, Zap, Lock
} from 'lucide-react';

interface SouverainBlueprintProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SouverainBlueprint({ isOpen, onClose }: SouverainBlueprintProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const slides = [
    {
      title: "1. Vision Générale & Écosystème Souverain MyCity",
      subtitle: "Plan Directeur d'une Smart-City Hybride et Respectueuse de la Vie Privée",
      icon: <Layers className="w-6 h-6 text-[#00f0ff]" />,
      content: (
        <div className="space-y-4 text-xs text-gray-300 leading-relaxed">
          <p>
            Le projet <strong className="text-white">MyCity Casablanca</strong> redéfinit le concept de ville intelligente en plaçant la <strong className="text-[#00f0ff]">souveraineté des données citoyennes</strong> au cœur de son ingénierie. 
            Développé en parfaite conformité avec la <strong className="text-white">Loi Marocaine 09-08 de la CNDP</strong>, l'écosystème réconcilie services métropolitains de pointe et d'autres outils interactifs.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="bg-black/40 p-3 rounded-xl border border-white/5 space-y-1">
              <span className="text-xs font-bold text-white block">🏛️ Souveraineté Territoriale</span>
              <p className="text-[10px] text-gray-400">
                Hébergement souverain exclusif en local au Maroc. Aucune transmission de métadonnées géospatiales ou d'identités réelles vers des tiers transfrontaliers sans assentiment et filtrage.
              </p>
            </div>
            
            <div className="bg-black/40 p-3 rounded-xl border border-white/5 space-y-1">
              <span className="text-xs font-bold text-white block">🤝 Transparence Absolue</span>
              <p className="text-[10px] text-gray-400">
                Journalisation permanente de toutes les requêtes de données administratives sur un registre d'audit immuable. Les citoyens accèdent librement et exportent leur dossier complet.
              </p>
            </div>
            
            <div className="bg-black/40 p-3 rounded-xl border border-white/5 space-y-1">
              <span className="text-xs font-bold text-white block">🛡️ Minimisation & Droit à l'Oubli</span>
              <p className="text-[10px] text-gray-400">
                Purge définitive et instantanée en un clic (Droit à l'oubli). Les mécanismes internes appliquent les principes de Privacy-by-Design les plus exigeants au monde.
              </p>
            </div>
          </div>

          <div className="bg-[#161821] p-3.5 rounded-2xl border border-white/5 space-y-2 mt-2">
            <h4 className="text-[11px] font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Périmètre Non-Confidentiel du Blueprint Sanitisé
            </h4>
            <p className="text-[10px] text-gray-400 leading-normal">
              Ce document démontre comment l'écosystème neutralise les vecteurs d'attaques habituels (injections de requêtes de haut niveau, spoofing BLE, corruptions administratives) en scindant la couche cliente de la couche de validation du serveur.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "2. Les Trois Piliers Fonctionnels de l'Écosystème",
      subtitle: "Modulation structurelle unifiée pour un parcours citoyen sans friction",
      icon: <Users className="w-6 h-6 text-indigo-400" />,
      content: (
        <div className="space-y-4 text-xs text-gray-300 leading-relaxed">
          <p>
            L'architecture logicielle de premier plan sépare l'application en trois espaces dynamiques résilients. Cette modularité permet au système de s'adapter au profil de l'utilisateur de manière dynamique.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div className="bg-gradient-to-b from-[#11131e] to-black p-4 rounded-xl border border-white/5 space-y-2">
              <div className="text-lg">🏙️</div>
              <span className="text-xs font-bold text-white block uppercase tracking-wide">Portail Urban (MyCity)</span>
              <p className="text-[10px] text-gray-400 leading-normal">
                Permet la remontée géolocalisée d'incidents, la recherche en temps réel de pharmacies de garde, et la programmation culturelle de la ville sous protection cryptographique.
              </p>
            </div>

            <div className="bg-gradient-to-b from-[#11131e] to-black p-4 rounded-xl border border-white/5 space-y-2">
              <div className="text-lg">🏠</div>
              <span className="text-xs font-bold text-white block uppercase tracking-wide">Espace Résidence (MyHome)</span>
              <p className="text-[10px] text-gray-400 leading-normal">
                Regroupe les outils de copropriété régis par les Lois marocaines 18-00 et 106-12. Accueille le conseiller juridique intelligent et gère l'authentification des copropriétaires par téléversement de justificatifs sécurisés.
              </p>
            </div>

            <div className="bg-gradient-to-b from-[#11131e] to-black p-4 rounded-xl border border-white/5 space-y-2">
              <div className="text-lg">🌱</div>
              <span className="text-xs font-bold text-white block uppercase tracking-wide">Portail Santé & Sport (MyLife)</span>
              <p className="text-[10px] text-gray-400 leading-normal">
                Assure la coordination des bilans de santé, des agendas sportifs individuels et des signalements de résilience civique locaux avec une synchronisation locale hors-ligne ultra-sécurisée.
              </p>
            </div>
          </div>

          <div className="bg-indigo-950/20 border border-indigo-500/20 p-3 rounded-xl flex items-start gap-2.5">
            <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-[10px] text-gray-400">
              Chaque pilier d'application possède sa propre isolation d'API côté serveur. Si un incident venait à affecter le pilier immobilier (MyHome), la sécurité du réseau d'urgence principal (MyCity) reste hermétiquement inviolable.
            </div>
          </div>
        </div>
      )
    },
    {
      title: "3. Sécurité Extrême du Serveur & Protection des APIs",
      subtitle: "Les 6 remparts techniques de l'infrastructure souveraine de Casablanca",
      icon: <Shield className="w-6 h-6 text-red-400" />,
      content: (
        <div className="space-y-4 text-xs text-gray-200 leading-relaxed font-mono">
          <p className="font-sans text-xs text-gray-400">
            Afin d'assurer la résilience de l'architecture contre les interceptions ou détournements d'IA, 6 mesures de sécurité rigoureuses sont appliquées de manière impérative côté serveur :
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px]">
            <div className="bg-black/50 p-3 rounded-lg border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-[#00f0ff] font-bold">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>1. Signature JWT Supabase Serveur</span>
              </div>
              <p className="text-gray-400 text-[9px] leading-tight">
                Le rôle de l'utilisateur n'est jamais lu depuis la requête cliente. Le serveur valide cryptographiquement le jeton JWT par rapport à la clé stockée dans Doppler/Vault, puis en extrait de manière souveraine le rôle associé.
              </p>
            </div>

            <div className="bg-black/50 p-3 rounded-lg border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-[#00f0ff] font-bold">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>2. Filtrage & Contrôle d'Injection IA</span>
              </div>
              <p className="text-gray-400 text-[9px] leading-tight">
                Analyse structurelle de toutes les invites de l'utilisateur par des filtres de détection de contournement d'instructions heuristique (mots-clés d'évasion, métacognition d'invite, taille supérieure à 4 Ko bloquée).
              </p>
            </div>

            <div className="bg-black/50 p-3 rounded-lg border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>3. Rate-Limiting Actif (express-rate-limit)</span>
              </div>
              <p className="text-gray-400 text-[9px] leading-tight">
                Toutes les routes d'API subissent un étranglement global. Les requêtes intelligentes (Gemini AI) sont strictement limitées à 10 tentatives/minute par utilisateur, garantissant l'intégrité face au déni de service.
              </p>
            </div>

            <div className="bg-black/50 p-3 rounded-lg border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>4. Floutage GPS Intégral au Niveau API</span>
              </div>
              <p className="text-gray-400 text-[9px] leading-tight">
                Le grand public n'accède jamais aux coordonnées géospatiales directes. Le serveur procède à un bruilage algorithmique obligatoire selon ST_Buffer sur un rayon de 500 mètres avant l'envoi de la data.
              </p>
            </div>

            <div className="bg-black/50 p-3 rounded-lg border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-purple-400 font-bold">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>5. Pipeline de Médias Sharp (Pas d'EXIF)</span>
              </div>
              <p className="text-gray-400 text-[9px] leading-tight">
                Toutes les pièces jointes d'incidents sont décodées, débarrassées de leurs métadonnées EXIF (coordonnées GPS de l'appareil, ID constructeur) et reconstituées par Sharp en mémoire sous format stérile PNG.
              </p>
            </div>

            <div className="bg-black/50 p-3 rounded-lg border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-purple-400 font-bold">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>6. Scan MIME par Octets Magiques</span>
              </div>
              <p className="text-gray-400 text-[9px] leading-tight">
                Le terminal vérifie la signature de l'en-tête binaire (Magic Bytes) pour démasquer les extensions frauduleuses contenant des morceaux d'exploits SQL ou PHP déguisés en fichiers PNG banals.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "4. Registre Append-Only & Hash de Consentement SHA-256",
      subtitle: "Garantie mathématique d'intégrité et traçabilité pour l'audit DPO",
      icon: <Database className="w-6 h-6 text-amber-400" />,
      content: (
        <div className="space-y-4 text-xs text-gray-300 leading-relaxed">
          <p>
            La modification frauduleuse ou rétroactive de choix de confidentialité des citoyens est rendue impossible grâce à un dispositif de registre <strong className="text-amber-400 uppercase">Append-Only</strong> calqué sur le comportement des registres de blockchain souverains.
          </p>

          <div className="bg-black/45 p-4 rounded-xl border border-white/5 space-y-2.5">
            <span className="font-mono text-xs text-white block">🔗 Comment fonctionne la chaîne d'intégrité :</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px] text-gray-400 font-mono">
              <div className="bg-black/30 p-2.5 rounded border border-white/5 space-y-1">
                <strong className="text-white block">⚡ Mutation Interdite (Triggers)</strong>
                Les modifications d'enregistrements (UPDATE/DELETE) sont strictement interdites par les déclencheurs de base de données. Toute modification du consentement crée un enregistrement d'audit distinct.
              </div>
              <div className="bg-black/30 p-2.5 rounded border border-white/5 space-y-1">
                <strong className="text-white block">🔑 Signature Cryptographique SHA-256</strong>
                Chaque ajustement de consentement génère une empreinte unique : 
                <span className="text-amber-300 block text-[9px] mt-1 truncate">SHA256(id+userId+flags+time+actor)</span>
              </div>
            </div>
          </div>

          <div className="bg-[#161821] p-3 rounded-xl border border-[#ffd700]/10 flex items-start gap-2">
            <Lock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-[10px] text-gray-400">
              Lors de l'audit DPO ou de l'export citoyen, le système recalcule instantanément l'empreinte de toute l'historique du registre de consentement. À la moindre falsification d'un enregistrement au repos, l'intégrité de la chaîne se brise et déclenche une alerte de compromission majeure.
            </div>
          </div>
        </div>
      )
    },
    {
      title: "5. Sécurisation du BLE-MESH face aux Attaques de l'Urbain",
      subtitle: "Résilience résolue : Pourquoi et comment nous sécurisons notre réseau mesh local",
      icon: <Radio className="w-6 h-6 text-emerald-400" />,
      content: (
        <div className="space-y-4 text-xs text-gray-300 leading-relaxed">
          <div className="bg-emerald-950/15 border border-emerald-500/20 p-3.5 rounded-2xl space-y-1.5 flex flex-col">
            <span className="font-title font-bold text-white block uppercase tracking-wider text-[11px] text-emerald-400">Pourquoi un réseau Local BLE ?</span>
            <p className="text-[10px] text-gray-300">
              En cas d'incident grave ou d'indisponibilité du réseau Internet (coupure générale, séisme, surcharge), le réseau maillé local <span className="text-white font-bold">Bluetooth Low Energy (BLE) Mesh</span> permet d'émettre des alertes d'urgence et des messages critiques de proche en proche d'appareil à appareil sans dépendre des relais télécoms.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-white block border-b border-white/5 pb-1 uppercase tracking-widest text-[#00f0ff]">
              🛡️ Remparts de Sécurisation : Seuls les Émetteurs Habilités Opèrent
            </span>
            <p className="text-justify text-[10px] text-gray-400 leading-normal">
              Les réseaux mesh ordinaires sont hautement sensibles au <strong>Sybil-Attack</strong> (génération de faux nœuds d'alertes) et aux <strong>replays de signaux</strong> malveillants. MyCity intègre un protocole de défense cryptographique binaire stricte :
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-[9.5px]">
              <div className="bg-[#11131e] p-3 rounded-lg border border-white/5 space-y-1">
                <span className="text-white font-bold block">🔐 Profil GATT Privé & AES-128</span>
                <p className="text-gray-400 leading-snug">
                  La caractéristique d'écriture n'est pas publique. L'échange d'informations exige une liaison conforme à un profil GATT privé, chiffré en matériel avec un algorithme <strong>AES-128 natif</strong> sous clé dynamique globale Casablanca.
                </p>
              </div>

              <div className="bg-[#11131e] p-3 rounded-lg border border-white/5 space-y-1">
                <span className="text-white font-bold block">✍️ Signature d'Urgence ECDSA</span>
                <p className="text-gray-400 leading-snug">
                  Tout signal est signé à l'émetteur via sa clé cryptographique privée (<strong>ECDSA secp256k1</strong>). Les nœuds relais municipaux valident la signature de l'émetteur légitime avant de relayer le signal d'urgence. Les tentatives d'injection de fausses alertes sont éliminées à la source !
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#06070a]/100 animate-fade-in" style={{ backgroundColor: '#06070a' }}>
      <div className="bg-[#0f111a] border border-white/10 w-full max-w-4xl rounded-[32px] overflow-hidden flex flex-col shadow-2xl shadow-blue-500/10 h-[85vh] max-h-[640px]" style={{ backgroundColor: '#0f111a' }}>
        
        {/* PRESENTATION HEADER */}
        <div className="bg-[#161821] px-6 py-4 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/15">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xs font-mono font-bold text-blue-300 uppercase tracking-widest">
                MyCity Sanitised Blueprint
              </h1>
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">
                Présentation Générale & Posture de Sécurité Souveraine
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-neutral-900 border border-white/5 hover:border-white/10 hover:text-white text-gray-400 rounded-full cursor-pointer transition-all"
            title="Fermer la présentation"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* PROGRESS PROGRESSBAR */}
        <div className="w-full bg-[#121421] h-1.5 flex gap-0.5 border-b border-white/5 shrink-0">
          {slides.map((_, index) => (
            <div 
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`flex-1 h-full cursor-pointer transition-all ${
                index <= currentSlide ? 'bg-gradient-to-r from-blue-500 to-[#6C3CFF]' : 'bg-neutral-800'
              }`}
            />
          ))}
        </div>

        {/* WORKSPACE & BODY CONTENT */}
        <div className="flex-1 p-6 lg:p-8 overflow-y-auto flex flex-col justify-between">
          <div className="space-y-4">
            
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-blue-500/10 text-[#00f0ff] rounded-xl border border-blue-500/20 shrink-0 mt-0.5">
                {slides[currentSlide].icon}
              </div>
              <div>
                <h2 className="text-sm font-bold text-white font-title tracking-tight uppercase">
                  {slides[currentSlide].title}
                </h2>
                <p className="text-[11px] text-blue-400 font-mono uppercase tracking-wider mt-0.5">
                  {slides[currentSlide].subtitle}
                </p>
              </div>
            </div>

            <div className="border border-white/5 bg-black/20 rounded-2xl p-5 min-h-[280px] flex flex-col justify-center">
              {slides[currentSlide].content}
            </div>

          </div>

          {/* SLIDESHOW NAVIGATION BUTTONS */}
          <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4 shrink-0">
            <span className="text-[10px] font-mono text-gray-500 uppercase">
              Page {currentSlide + 1} de {slides.length}
            </span>
            <div className="flex items-center gap-3">
              <button
                disabled={currentSlide === 0}
                onClick={handlePrev}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-[10px] font-bold transition-all ${
                  currentSlide === 0 
                  ? 'border-white/5 text-gray-600 bg-transparent cursor-not-allowed' 
                  : 'border-white/10 hover:border-white/20 text-gray-300 hover:text-white bg-white/5 cursor-pointer'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Précédent</span>
              </button>

              <button
                onClick={currentSlide === slides.length - 1 ? onClose : handleNext}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#6C3CFF] hover:bg-[#5b31d6] text-white font-mono text-[10px] font-bold shadow-lg shadow-purple-500/25 transition-all cursor-pointer"
              >
                <span>{currentSlide === slides.length - 1 ? "Terminer" : "Suivant"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
