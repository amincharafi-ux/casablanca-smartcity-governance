import React, { useState, useEffect } from 'react';
import { translations, LanguageCode } from '../../data/translations';
import { 
  Building, 
  Home, 
  Users, 
  FileText, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  MessageSquare, 
  Send, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  Upload, 
  CheckCircle, 
  X, 
  Info, 
  Wrench, 
  Briefcase, 
  Scale, 
  Sliders, 
  Plus, 
  Trash2,
  Lock,
  Compass,
  FileCheck,
  ArrowRight
} from 'lucide-react';


// Define TS Interfaces
interface BuildingGroup {
  id: string;
  name: string;
  address: string;
  city: string;
  residentsCount: number;
  unitsCount: number;
  syndicName: string;
}

interface ForumPost {
  id: string;
  buildingId: string;
  authorName: string;
  authorRole: 'COPROPRIÉTAIRE' | 'SYNDIC_ÉLU' | 'LOCATAIRE';
  title: string;
  content: string;
  category: 'ENTRETIEN' | 'AG' | 'SECURITE' | 'VIE_COMMUNE' | 'INCIDENT';
  createdAt: string;
  commentsCount: number;
  comments: ForumComment[];
}

interface ForumComment {
  id: string;
  authorName: string;
  authorRole: string;
  content: string;
  createdAt: string;
}

interface LawArticle {
  id: string;
  source: 'Loi 18-00' | 'Loi 106-12' | 'Guide Pratique';
  article: string;
  topic: string;
  description: string;
  majorityRequired?: string;
  fullText?: string;
}

interface TradeProfessional {
  id: string;
  name: string;
  trade: 'PLOMBIER' | 'ELECTRICIEN' | 'SERRURIER' | 'AVOCAT' | 'HUISSIER' | 'NETTOYAGE';
  company: string;
  contact: string;
  rating: number;
  reviewsCount: number;
  verifiedBySyndic: boolean;
  address: string;
  recentCostRange: string;
}

interface BudgetLine {
  id: string;
  type: 'RECETTE' | 'DEPENSE';
  category: string;
  label: string;
  amount: number; // in MAD (Morocco Dirham)
  date: string;
}

interface VerificationRequest {
  id: string;
  residentName: string;
  apartment: string;
  buildingId: string;
  documentType: string;
  documentName: string;
  time: string;
}

interface MyResidenceProps {
  currentLang?: LanguageCode;
}

export default function MyResidence({ currentLang = 'FR' }: MyResidenceProps) {
  const tStr = translations[currentLang];
  const isRtl = currentLang === 'AR';

  // Buildings Database
  const [buildings, setBuildings] = useState<BuildingGroup[]>([
    { id: 'bld-1', name: "Résidence 'Les Jardins d'Anfa'", address: "32 Boulevard de l'Aéropostale, Anfa", city: "Casablanca", residentsCount: 24, unitsCount: 30, syndicName: "Charafi Syndic Pro" },
    { id: 'bld-2', name: "Copropriété 'El Bahia Gauthier'", address: "14 Rue Goulmima, Gauthier", city: "Casablanca", residentsCount: 18, unitsCount: 20, syndicName: "M. Yassine Alami" },
    { id: 'bld-3', name: "Immeuble 'Le Jasmin Maârif'", address: "85 Rue de l'Aisne, Maârif", city: "Casablanca", residentsCount: 12, unitsCount: 16, syndicName: "Conseil de Copropriété" }
  ]);

  const [activeBuildingId, setActiveBuildingId] = useState<string>('bld-1');
  const activeBuilding = buildings.find(b => b.id === activeBuildingId) || buildings[0];

  // Tab Selection
  const [activeTab, setActiveTab] = useState<'FORUM' | 'LAWS' | 'TRADES' | 'BUDGET' | 'ASSISTANT' | 'ADMIN_MOD'>('FORUM');

  // Co-ownership verification states for current user
  // This satisfies the /deepthink core requirement to allow authenticating residents through document upload or syndic code
  const [verificationStatus, setVerificationStatus] = useState<Record<string, 'UNVERIFIED' | 'PENDING' | 'APPROVED' | 'SYNDIC'>>({
    'bld-1': 'APPROVED', // Default approved for first building for easier onboarding
    'bld-2': 'UNVERIFIED',
    'bld-3': 'UNVERIFIED'
  });

  const getStatusLabelAndColor = (status: 'UNVERIFIED' | 'PENDING' | 'APPROVED' | 'SYNDIC') => {
    switch (status) {
      case 'UNVERIFIED': return { text: tStr.statusUnverified, color: "bg-red-500/10 text-red-400 border border-red-500/20" };
      case 'PENDING': return { text: tStr.statusPending, color: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/25 animate-pulse" };
      case 'APPROVED': return { text: tStr.statusVerified, color: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" };
      case 'SYNDIC': return { text: tStr.statusSyndic, color: "bg-purple-500/10 text-purple-400 border border-purple-500/20" };
    }
  };

  const activeStatus = verificationStatus[activeBuildingId] || 'UNVERIFIED';

  // Code Verification Inputs
  const [invitedCode, setInvitedCode] = useState('');
  const [uploadedDoc, setUploadedDoc] = useState<File | null>(null);
  const [uploadedDocType, setUploadedDocType] = useState('Facture Lydec');
  const [apartmentNumber, setApartmentNumber] = useState('');
  const [authRoleSelection, setAuthRoleSelection] = useState<'RESIDENT' | 'SYNDIC'>('RESIDENT');
  const [showAvocatModal, setShowAvocatModal] = useState(false);

  // New building registration inputs
  const [showNewBuildingModal, setShowNewBuildingModal] = useState(false);
  const [newBldName, setNewBldName] = useState('');
  const [newBldAddress, setNewBldAddress] = useState('');
  const [newBldUnits, setNewBldUnits] = useState('10');
  const [newBldSyndic, setNewBldSyndic] = useState('');

  // Interactive election process & MyCity authentication states
  const [lawsSubTab, setLawsSubTab] = useState<'CATALOGUE' | 'ELECTION_GUIDE' | 'AUTHENTICATION_PROCESS'>('CATALOGUE');
  const [electionChecklist, setElectionChecklist] = useState({
    noticeSent: false,
    agendaSet: false,
    quorumMet: false,
    pvDrafted: false,
    legalizedMoqataa: false,
  });
  const [pvGenBuildingName, setPvGenBuildingName] = useState('Résidence Al Andalous');
  const [pvGenCity, setPvGenCity] = useState('Casablanca');
  const [pvGenPresidentName, setPvGenPresidentName] = useState('Yassine Alami');
  const [pvGenDate, setPvGenDate] = useState('2026-05-28');
  const [pvGenIsGenerated, setPvGenIsGenerated] = useState(false);
  const [pvSimulationSuccess, setPvSimulationSuccess] = useState<string | null>(null);
  const [isSimulatingAuth, setIsSimulatingAuth] = useState(false);

  // Syndic administrative panel (Core /deepthink workflow)
  // Preseeding verification tickets that syndic administrator can review and accept/decline
  const [pendingVerifications, setPendingVerifications] = useState<VerificationRequest[]>([
    { id: 'tkt-1', residentName: "Ghali Boussaid", apartment: "Apt 14", buildingId: 'bld-1', documentType: "Facture Lydec (Eau/Elec)", documentName: "Lydec_Facture_Mai2026.pdf", time: "Il y a 2 heures" },
    { id: 'tkt-2', residentName: "Mouna El Alami", apartment: "Apt 2B", buildingId: 'bld-1', documentType: "Acte de Propriété", documentName: "Conservation_Foncière_Propriété.pdf", time: "Il y a 5 heures" },
    { id: 'tkt-3', residentName: "Karim Benslimane", apartment: "Apt 19", buildingId: 'bld-2', documentType: "Contrat d'habitation (Bail)", documentName: "Bail_Benslimane_Signe_Legale.pdf", time: "Hier" }
  ]);

  // Forum state with preseeded building forum posts
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([
    {
      id: 'post-1',
      buildingId: 'bld-1',
      authorName: "Anas Benjeloun",
      authorRole: 'COPROPRIÉTAIRE',
      title: "Remplacement du câble principal de l'ascenseur B",
      content: "Bonjour chers voisins. L'ascenseur du bloc B est de plus en plus bruyant. Le technicien Otis Maroc est passé et propose de changer les câbles de suspension pour un montant estimé de 12 000 MAD. Faut-il convoquer une assemblée extraordinaire ou le syndic peut-il l'engager sur le budget d'urgence courante ? Quels sont vos avis ?",
      category: 'ENTRETIEN',
      createdAt: "2026-05-26T14:20:00Z",
      commentsCount: 2,
      comments: [
        { id: 'c-1', authorName: "Khadija Chraibi", authorRole: "COPROPRIÉTAIRE", content: "L'ascenseur est un élément de secours et de sécurité essentiel. Un avis Otis de danger imminent justifie que le syndic engage les fonds d'urgence sans AG préalable.", createdAt: "2026-05-26T15:02:00Z" },
        { id: 'c-2', authorName: "Yassine Alami (Syndic)", authorRole: "SYNDIC_ÉLU", content: "Précisément, j'ai vérifié la Loi 106-12 : l'assemblée n'est pas requise en cas de travaux conservatoires d'urgence, mais je soumettrai le rapport d'expertise détaillé Otis sur le groupe whatsapp de sécurité.", createdAt: "2026-05-26T17:15:00Z" }
      ]
    },
    {
      id: 'post-2',
      buildingId: 'bld-1',
      authorName: "Yassine Alami (Syndic)",
      authorRole: 'SYNDIC_ÉLU',
      title: "Convocations pour l'Assemblée Générale Annuelle (AG)",
      content: "Chers copropriétaires. L'AG ordinaire annuelle se tiendra dans le hall d'entrée le samedi 12 Juin 2026 à 18h00. Les convocations officielles ont été remises par émargement auprès du concierge ou par lettre recommandée avec accusé de réception selon l'Article 20 de la Loi 18-00. L'ordre du jour inclut le rapport financier annuel, le renouvellement du mandat du syndic et la réévaluation du fonds de réserve obligatoire.",
      category: 'AG',
      createdAt: "2026-05-25T10:00:00Z",
      commentsCount: 1,
      comments: [
        { id: 'c-3', authorName: "Tariq Slimani", authorRole: "COPROPRIÉTAIRE", content: "Présent ! Pensez à ramener vos pouvoirs écrits signés et légalisés si vous devez représenter un voisin absent.", createdAt: "2026-05-25T11:40:00Z" }
      ]
    },
    {
      id: 'post-3',
      buildingId: 'bld-2',
      authorName: "Meryem Souiri",
      authorRole: 'COPROPRIÉTAIRE',
      title: "Fuite d'eau parties communes - G Gauthier",
      content: "Il y a une fuite d'eau constante à côté de la gaine technique au 3ème étage. Ça commence à endommager la peinture. M. le syndic, merci d'envoyer un plombier d'urgence.",
      category: 'INCIDENT',
      createdAt: "2026-05-27T08:00:00Z",
      commentsCount: 0,
      comments: []
    }
  ]);

  // Search filter inside forum
  const [forumSearch, setForumSearch] = useState('');
  const [forumCategoryFilter, setForumCategoryFilter] = useState<string>('ALL');

  // Input States for New Forum Post
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<'ENTRETIEN' | 'AG' | 'SECURITE' | 'VIE_COMMUNE' | 'INCIDENT'>('ENTRETIEN');

  // Interactive AI post moderation warning overlay state
  const [moderationWarning, setModerationWarning] = useState<{
    isOpen: boolean;
    reason: string;
    flaggedTerms: string[];
    originalText: string;
  } | null>(null);

  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState('');

  // Moroccan Co-ownership Law Catalogue
  const lawCatalog: LawArticle[] = [
    {
      id: 'law-1',
      source: 'Loi 18-00',
      article: "Article 11",
      topic: "Création et rôle obligatoire du Syndicat",
      description: "La copropriété donne naissance de plein droit à un syndicat des copropriétaires doté de la personnalité morale. Ce syndicat gère la conservation de l'immeuble et l'administration des parties communes. Les décisions du syndicat s'imposent à tous les copropriétaires et leurs ayants droit.",
      fullText: "Dahir n° 1-02-298 du 25 rejeb 1423 promulguant la loi n° 18-00 : Le syndicat est représenté par un syndic élu par les copropriétaires. Il a pour mandat d'exécuter les délibérations de l'assemblée générale et de veiller au bon état de l'immeuble."
    },
    {
      id: 'law-2',
      source: 'Loi 18-00',
      article: "Article 24",
      topic: "Décisions à la majorité simple",
      description: "Concerne les décisions courantes administratives, la désignation d'un nouveau syndic provisoire et l'approbation du budget ordinaire d'entretien. Requis : Plus de 50% des voix des copropriétaires présents ou représentés.",
      majorityRequired: "Majorité simple des voix des membres présents ou représentés",
      fullText: "Les décisions d'entretien ordinaire de l'immeuble, de réparation mineure des parties communes et l'approbation de l'ordre du jour se font à la majorité des voix des votants."
    },
    {
      id: 'law-3',
      source: 'Loi 106-12',
      article: "Article 25",
      topic: "Décisions à la majorité absolue",
      description: "Nécessaire pour nommer le Syndic définitif, fixer son indemnité, voter de grands travaux de modernisation (ravalement de façade, caméra, toiture) et déterminer les règles de sécurité. Requis : Majorité absolue de toutes les voix des copropriétaires de l'immeuble (50% + 1 de la quote-part totale).",
      majorityRequired: "La majorité des voix de TOUS les copropriétaires (Parts de copropriété)",
      fullText: "Loi 106-12 modifiant la Loi 18-00 : Si la majorité absolue n'est pas atteinte au premier tour, une nouvelle réunion se tient dans les 30 jours et peut décider à la majorité simple des voix présentes."
    },
    {
      id: 'law-4',
      source: 'Loi 106-12',
      article: "Article 26",
      topic: "Décisions soumises à la double majorité complexe",
      description: "Pour autoriser des travaux d'extension, surélever un étage, recruter un concierge ou modifier le règlement de copropriété. Requis : Les trois quarts (75%) des voix des copropriétaires.",
      majorityRequired: "Les trois quarts (75%) des voix de l'ensemble des copropriétaires",
    },
    {
      id: 'law-5',
      source: 'Loi 106-12',
      article: "Article 36-2",
      topic: "Fonds d'Urgence obligatoire Marocain",
      description: "Obligation légale au Maroc d'alimenter un fonds de réserve permanent appelé 'fonds de secours'. Ce fonds doit être rechargé chaque année d'au moins 5% du budget de fonctionnement annuel prévisionnel global pour pallier les avaries lourdes de la copropriété (ascenseur, fuite structurelle, incendie).",
      majorityRequired: "Prélèvement annuel obligatoire (Minimum 5% du budget annuel)",
      fullText: "Tout syndicat de copropriété est tenu de constituer un fonds de secours destiné à financer les travaux non prévisibles et urgents. Ce compte bancaire doit être indépendant du compte courant d'exploitation."
    },
    {
      id: 'law-6',
      source: 'Loi 18-00',
      article: "Article 40",
      topic: "Privilège du syndical pour cotisations impayées",
      description: "Le syndicat de copropriété bénéficie d'un privilège sur le lot d'un copropriétaire débiteur pour le recouvrement des charges impayées. Le syndic peut entamer une procédure simplifiée de mise en demeure et saisir le Tribunal de Première Instance de Casablanca.",
      majorityRequired: "Saisine légale après mise en demeure de 30 jours restée infructueuse."
    }
  ];

  const [lawSearchQuery, setLawSearchQuery] = useState('');
  const filteredLaws = lawCatalog.filter(l => 
    l.article.toLowerCase().includes(lawSearchQuery.toLowerCase()) ||
    l.topic.toLowerCase().includes(lawSearchQuery.toLowerCase()) ||
    l.description.toLowerCase().includes(lawSearchQuery.toLowerCase())
  );

  // Trades Professionals Directory Database
  const [trades, setTrades] = useState<TradeProfessional[]>([
    { id: 'tr-1', name: "Sifeddine Plomberie Anfa", trade: 'PLOMBIER', company: "Sifeddine & Frères SARL", contact: "+212 522-841920", rating: 4.8, reviewsCount: 37, verifiedBySyndic: true, address: "Avenue Driss Slaoui, Anfa, Casablanca", recentCostRange: "200 - 800 MAD" },
    { id: 'tr-2', name: "M. Younes El Ghazi (Elec)", trade: 'ELECTRICIEN', company: "Younes Elec Tech", contact: "+212 661-429011", rating: 4.9, reviewsCount: 22, verifiedBySyndic: true, address: "Rue Abou Jafar Al Mansour, Maârif", recentCostRange: "150 - 600 MAD" },
    { id: 'tr-3', name: "Maître Omar Squalli", trade: 'AVOCAT', company: "Squalli Avocats Associés Casablanca", contact: "+212 522-263041", rating: 4.6, reviewsCount: 15, verifiedBySyndic: true, address: "Boulevard Rachidi, Hassan II area, Casablanca", recentCostRange: "1,500 - 5,000 MAD / Cons." },
    { id: 'tr-4', name: "M. Ahmed Mansouri", trade: 'HUISSIER', company: "Mansouri Huissier de Justice Agréé", contact: "+212 662-851433", rating: 4.7, reviewsCount: 9, verifiedBySyndic: false, address: "Boulevard d'Anfa, face Tribunal Civil", recentCostRange: "1,000 - 2,500 MAD (Constat officiel)" },
    { id: 'tr-5', name: "Serrurerie Express Maârif", trade: 'SERRURIER', company: "Serrurier El Koutoubia", contact: "+212 663-125477", rating: 4.5, reviewsCount: 42, verifiedBySyndic: true, address: "Rue Jean Jaurès, Maârif", recentCostRange: "250 - 900 MAD" },
    { id: 'tr-6', name: "Casablanca Propreté & Syndic", trade: 'NETTOYAGE', company: "CASA CLEANING S.A.", contact: "+212 522-311899", rating: 4.4, reviewsCount: 19, verifiedBySyndic: true, address: "Bd de la résistance, Casablanca", recentCostRange: "1,200 MAD / Passage collectif" }
  ]);

  const [activeTradeFilter, setActiveTradeFilter] = useState<string>('ALL');
  const filteredTrades = activeTradeFilter === 'ALL' 
    ? trades 
    : trades.filter(t => t.trade === activeTradeFilter);

  // Recommendations state for prestataires
  const [recommendedTrades, setRecommendedTrades] = useState<string[]>([]);

  const handleToggleRecommend = (tradeId: string) => {
    if (recommendedTrades.includes(tradeId)) {
      setRecommendedTrades(prev => prev.filter(id => id !== tradeId));
      setTrades(prev => prev.map(t => {
        if (t.id === tradeId) {
          return {
            ...t,
            reviewsCount: Math.max(0, t.reviewsCount - 1),
            rating: parseFloat(Math.max(1.0, t.rating - 0.1).toFixed(1))
          };
        }
        return t;
      }));
    } else {
      setRecommendedTrades(prev => [...prev, tradeId]);
      setTrades(prev => prev.map(t => {
        if (t.id === tradeId) {
          return {
            ...t,
            reviewsCount: t.reviewsCount + 1,
            rating: parseFloat(Math.min(5.0, t.rating + 0.1).toFixed(1))
          };
        }
        return t;
      }));
    }
  };

  // Financial Sheet spreadsheet with preloaded data in MAD
  const [budgetItems, setBudgetItems] = useState<BudgetLine[]>([
    { id: 'item-1', type: 'RECETTE', category: "Charges Ordinaires", label: "Cotisations mensuelles copropriétaires (Mai 2026)", amount: 16800, date: "2026-05-01" },
    { id: 'item-2', type: 'RECETTE', category: "Fonds Obligatoire", label: "Rattrapage provisions fonds d'urgence Secours (Loi 106-12)", amount: 2400, date: "2026-05-05" },
    { id: 'item-3', type: 'RECETTE', category: "Publicité comm.", label: "Location espace panneau publicitaire façade", amount: 3500, date: "2026-05-10" },
    { id: 'item-4', type: 'DEPENSE', category: "Salaires", label: "Salaire du concierge (Brahim El Hadhri)", amount: 3300, date: "2026-05-25" },
    { id: 'item-5', type: 'DEPENSE', category: "Energie", label: "Facture collective Lydec (Eau et Électricité des parties communes)", amount: 2450, date: "2026-05-20" },
    { id: 'item-6', type: 'DEPENSE', category: "Contrats Maintenance", label: "Abonnement technique mensuel Ascenseur (Schindler Maroc)", amount: 1100, date: "2026-05-15" },
    { id: 'item-7', type: 'DEPENSE', category: "Nettoyage/Entretien", label: "Achat ampoules LED communes & produits de nettoyage", amount: 780, date: "2026-05-12" },
    { id: 'item-8', type: 'DEPENSE', category: "Assurance", label: "Assurance Multirisque Immeuble (Wafa Assurance)", amount: 4800, date: "2026-05-02" }
  ]);

  // Financial Line Input State
  const [newBudgetLabel, setNewBudgetLabel] = useState('');
  const [newBudgetAmount, setNewBudgetAmount] = useState('');
  const [newBudgetType, setNewBudgetType] = useState<'RECETTE' | 'DEPENSE'>('DEPENSE');
  const [newBudgetCategory, setNewBudgetCategory] = useState('Entretien');

  // Calculations for budget sheet
  const totals = budgetItems.reduce((acc, curr) => {
    if (curr.type === 'RECETTE') {
      acc.recettes += curr.amount;
    } else {
      acc.depenses += curr.amount;
    }
    return acc;
  }, { recettes: 0, depenses: 0 });

  const totalBalance = totals.recettes - totals.depenses;
  const reserveFundEstimate = Math.max(0, totals.recettes * 0.12); // Dynamic estimation of reserve fund
  const mandatoryReservePct = (totals.recettes > 0) ? ((totals.recettes - totalBalance) / totals.recettes) * 100 : 0;

  // AI Assistant Chat Interface specific for law/copropriété advice
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
  const [chatMessage, setChatMessage] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Pre-seed 3 helpful law advisor helper prompts
  const quickQuestions = [
    { label: "Maj. Ascenseur", q: "Quelle majorité est requise sous la loi 106-12 pour voter le changement complet ou la grosse réparation de l'ascenseur ?" },
    { label: "Charges impayées", q: "Quelles sanctions légales et étapes le syndic peut-il appliquer contre un propriétaire marocain qui ne paye pas ses cotisations depuis 6 mois ?" },
    { label: "Mandat Syndic", q: "Combien de temps dure légalement le mandat d'un syndic au Maroc et quel est le quorum requis pour le renouveler ?" }
  ];

  // Send request to co-ownership AI Advisor
  const handleSendChatMessage = async (textToSend?: string) => {
    const rawMsg = textToSend || chatMessage;
    if (!rawMsg.trim()) return;

    const userMsg = { role: 'user' as const, text: rawMsg };
    setChatHistory(prev => [...prev, userMsg]);
    if (!textToSend) setChatMessage('');
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/residence/chat-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: rawMsg,
          history: chatHistory
        })
      });

      const data = await response.json();
      setChatHistory(prev => [...prev, { role: 'model', text: data.reply }]);
    } catch (err) {
      console.error("AI assistant error", err);
      setChatHistory(prev => [...prev, { 
        role: 'model', 
        text: `⚠️ **Erreur de communication avec le serveur**. Pouvez-vous vérifier que l'application est bien lancée sur le port 3000 ?` 
      }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Submit active verification document (Resident verification)
  const handleRequestVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (authRoleSelection === 'RESIDENT' && invitedCode === '1800106') {
      // Instant code approve
      setVerificationStatus(prev => ({
        ...prev,
        [activeBuildingId]: 'APPROVED'
      }));
      alert("✅ Code d'invitation Syndic valide ! Vous êtes désormais vérifié en tant que copropriétaire de cette résidence.");
    } else {
      // Create pending validation ticket of file upload
      setVerificationStatus(prev => ({
        ...prev,
        [activeBuildingId]: 'PENDING'
      }));

      // Add to syndic admin tickets queue
      const fakeTicket: VerificationRequest = {
        id: `tkt-${Date.now()}`,
        residentName: authRoleSelection === 'SYNDIC' ? "Mme. Fatim-Zahra (Votre demande)" : "Utilisateur Démo",
        apartment: apartmentNumber || "Apt 15",
        buildingId: activeBuildingId,
        documentType: authRoleSelection === 'SYNDIC' ? "PV d'assemblée électorale" : uploadedDocType,
        documentName: uploadedDoc ? uploadedDoc.name : `${uploadedDocType.replace(/\s+/g, '_')}_justificatif.pdf`,
        time: "Il y a quelques secondes"
      };

      setPendingVerifications(prev => [fakeTicket, ...prev]);
      alert(`📂 Demande enregistrée ! Votre justificatif (${fakeTicket.documentName}) a été transmis au Syndic de la résidence. Basculez sur l'onglet 'Control Syndic (Démo)' en haut à droite si vous voulez approuver vous-même la demande !`);
    }
    setInvitedCode('');
    setUploadedDoc(null);
  };

  // Instant demo-verification button
  const handleInstantVerification = () => {
    setVerificationStatus(prev => ({
      ...prev,
      [activeBuildingId]: authRoleSelection === 'SYNDIC' ? 'SYNDIC' : 'APPROVED'
    }));
  };

  // Switch to syndic role and back for building management
  const toggleSyndicAdminRights = () => {
    const current = verificationStatus[activeBuildingId];
    if (current === 'SYNDIC') {
      setVerificationStatus(prev => ({ ...prev, [activeBuildingId]: 'APPROVED' }));
    } else {
      setVerificationStatus(prev => ({ ...prev, [activeBuildingId]: 'SYNDIC' }));
    }
  };

  // Admin approval action of pending tickets
  const handleApproveTicket = (ticket: VerificationRequest, approve: boolean) => {
    setPendingVerifications(prev => prev.filter(t => t.id !== ticket.id));
    if (approve) {
      // If we approved our own (or general user), set status to approved
      if (ticket.residentName.includes("Votre demande") || ticket.residentName === "Utilisateur Démo") {
        setVerificationStatus(prev => ({
          ...prev,
          [ticket.buildingId]: ticket.documentType.includes("PV d'assemblée") ? 'SYNDIC' : 'APPROVED'
        }));
      }
      alert(`✅ Candidature de ${ticket.residentName} (${ticket.apartment}) approuvée avec succès. Un email de confirmation lui a été envoyé.`);
    } else {
      alert(`❌ Candidature de ${ticket.residentName} rejetée.`);
    }
  };

  // Submit forum post with automatic AI moderation check
  const handleCreateForumPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    try {
      // Request moderation from the backend rule
      // BAN PROFANITY & BAN THREATS & VIOLENT LANGUAGE
      const response = await fetch("/api/residence/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: `${newPostTitle} - ${newPostContent}` })
      });

      const moderation = await response.json();

      if (!moderation.approved) {
        // Post contains censored items! Trigger interactive Warning layout
        setModerationWarning({
          isOpen: true,
          reason: moderation.reason || "Ce contenu a été bloqué par le modérateur d'éthique automatique.",
          flaggedTerms: moderation.flaggedTerms || ["Mots grossiers/violents"],
          originalText: `${newPostTitle} : ${newPostContent}`
        });
        return;
      }

      // Add post if approved
      const freshPost: ForumPost = {
        id: `post-${Date.now()}`,
        buildingId: activeBuildingId,
        authorName: activeStatus === 'SYNDIC' ? `${activeBuilding.syndicName} (Syndic)` : "Copropriétaire Anonyme",
        authorRole: activeStatus === 'SYNDIC' ? 'SYNDIC_ÉLU' : 'COPROPRIÉTAIRE',
        title: newPostTitle,
        content: newPostContent,
        category: newPostCategory,
        createdAt: new Date().toISOString(),
        commentsCount: 0,
        comments: []
      };

      setForumPosts(prev => [freshPost, ...prev]);
      setNewPostTitle('');
      setNewPostContent('');
      alert("🎉 Post publié avec succès sur le forum général privé !");
    } catch (err) {
      console.error("Moderation communication failed", err);
      alert("⚠️ Échec du service de modération. Recommencez dans un instant.");
    }
  };

  // Post comment inside a forum post
  const handleCreateComment = async (postId: string) => {
    if (!newCommentText.trim()) return;

    try {
      // Comment automated AI moderation
      const response = await fetch("/api/residence/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newCommentText })
      });

      const moderation = await response.json();

      if (!moderation.approved) {
        setModerationWarning({
          isOpen: true,
          reason: moderation.reason || "Commentaire bloqué par le filtre d'éthique automatique.",
          flaggedTerms: moderation.flaggedTerms || ["Termes injurieux"],
          originalText: newCommentText
        });
        return;
      }

      setForumPosts(prev => prev.map(post => {
        if (post.id === postId) {
          const freshComment: ForumComment = {
            id: `comment-${Date.now()}`,
            authorName: activeStatus === 'SYNDIC' ? `${activeBuilding.syndicName} (Syndic)` : "Habitant de la résidence",
            authorRole: activeStatus === 'SYNDIC' ? 'SYNDIC_ÉLU' : 'COPROPRIÉTAIRE',
            content: newCommentText,
            createdAt: new Date().toISOString()
          };
          return {
            ...post,
            commentsCount: post.commentsCount + 1,
            comments: [...post.comments, freshComment]
          };
        }
        return post;
      }));

      setNewCommentText('');
      setActiveCommentPostId(null);
    } catch (err) {
      console.error("Comment moderation error", err);
    }
  };

  // Add line to budget Calculator spreadsheet
  const handleAddBudgetLine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBudgetLabel.trim() || !newBudgetAmount) return;

    const freshItem: BudgetLine = {
      id: `item-${Date.now()}`,
      type: newBudgetType,
      category: newBudgetCategory,
      label: newBudgetLabel,
      amount: parseFloat(newBudgetAmount),
      date: new Date().toISOString().split('T')[0]
    };

    setBudgetItems(prev => [freshItem, ...prev]);
    setNewBudgetLabel('');
    setNewBudgetAmount('');
    alert(`👍 Enregistré : ${newBudgetType === 'RECETTE' ? 'Recette (+)' : 'Dépense (-)'} de ${freshItem.amount} MAD ajoutée.`);
  };

  const handleDeleteBudgetLine = (id: string) => {
    setBudgetItems(prev => prev.filter(item => item.id !== id));
  };

  // Register new building forum group
  const handleCreateBuildingGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBldName.trim() || !newBldAddress.trim()) return;

    const freshBuilding: BuildingGroup = {
      id: `bld-${Date.now()}`,
      name: newBldName,
      address: newBldAddress,
      city: "Casablanca",
      residentsCount: 1,
      unitsCount: parseInt(newBldUnits) || 12,
      syndicName: newBldSyndic ? newBldSyndic : "À élire par assemblée"
    };

    setBuildings(prev => [...prev, freshBuilding]);
    setVerificationStatus(prev => ({
      ...prev,
      [freshBuilding.id]: 'SYNDIC' // Creative touch: when you create the building, you are the founding Syndic!
    }));
    setActiveBuildingId(freshBuilding.id);
    setShowNewBuildingModal(false);
    setNewBldName('');
    setNewBldAddress('');
    setNewBldSyndic('');
    alert(`✨ Nouveau groupe créé ! Vous êtes enregistré comme Syndic fondateur pour la "${freshBuilding.name}".`);
  };

  const activeBuildingForumPosts = forumPosts.filter(p => p.buildingId === activeBuildingId);
  const searchedForumPosts = activeBuildingForumPosts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(forumSearch.toLowerCase()) || 
                          p.content.toLowerCase().includes(forumSearch.toLowerCase());
    const matchesCat = forumCategoryFilter === 'ALL' || p.category === forumCategoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="bg-[#12141c] border border-white/5 rounded-3xl p-5 lg:p-6 w-full shadow-2xl relative overflow-hidden">
      
      {/* Decorative Nebula Accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Main Core Section Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-white/5 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#a16eff]/10 text-[#a16eff] rounded-2xl border border-[#a16eff]/20">
            <Building className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-title font-bold text-lg text-white">{tStr.espaceMyResidence}</h2>
              <span className="font-mono text-[8px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded uppercase tracking-widest font-black">{tStr.copropriete}</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">{tStr.residenceSub}</p>
          </div>
        </div>

        {/* Dynamic active building dropdown and status badge */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <div className="relative">
            <select
              value={activeBuildingId}
              onChange={(e) => setActiveBuildingId(e.target.value)}
              className="appearance-none bg-[#1a1d29] border border-white/10 hover:border-[#a16eff]/50 text-white text-xs rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:border-[#a16eff] cursor-pointer"
            >
              {buildings.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-3 pointer-events-none" />
          </div>

          <button
            onClick={() => setShowNewBuildingModal(true)}
            className="p-2.5 bg-[#a16eff]/20 hover:bg-[#a16eff] text-[#a16eff] hover:text-white rounded-xl border border-[#a16eff]/10 transition-colors cursor-pointer"
            title={tStr.createNewBldGroupBtn}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Residence Specific Hub Header detailing active complex */}
      <div className="bg-[#1a1d29]/60 border border-white/5 p-4 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-gray-500" />
            <h3 className="text-sm font-semibold text-white tracking-tight">{activeBuilding.name}</h3>
          </div>
          <p className="text-xs text-gray-400 font-mono">{activeBuilding.address}, {activeBuilding.city}</p>
          <div className="flex items-center gap-4 text-[11px] font-mono text-gray-500 pt-2">
            <span>👥 {activeBuilding.residentsCount} {tStr.residentsCountLabel}</span>
            <span>🏢 {activeBuilding.unitsCount} {tStr.apartmentsCountLabel}</span>
            <span>📋 {tStr.syndicLabel} : <b className="text-gray-300">{activeBuilding.syndicName}</b></span>
          </div>
        </div>

        {/* Current Resident Verification Status Panel */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">{tStr.statusLabelTitle}</span>
          <div className={`text-xs font-semibold px-3 py-1.5 rounded-xl ${getStatusLabelAndColor(activeStatus).color}`}>
            {getStatusLabelAndColor(activeStatus).text}
          </div>
          {activeStatus === 'APPROVED' && (
            <button 
              onClick={toggleSyndicAdminRights}
              className="text-[10px] font-mono text-purple-400 hover:underline cursor-pointer"
            >
              {tStr.demoAdminRightsOn}
            </button>
          )}
          {activeStatus === 'SYNDIC' && (
            <button 
              onClick={toggleSyndicAdminRights}
              className="text-[10px] font-mono text-emerald-400 hover:underline cursor-pointer"
            >
              {tStr.demoAdminRightsOff}
            </button>
          )}
        </div>
      </div>

      {/* Internal Navigation tabs mapping */}
      <div className="flex border-b border-white/5 pb-2 mb-6 gap-2 overflow-x-auto scroller-hidden">
        {[
          { id: 'FORUM', label: tStr.tabForum, icon: MessageSquare },
          { id: 'ASSISTANT', label: tStr.tabAssistant, icon: Scale },
          { id: 'LAWS', label: tStr.tabLaws, icon: FileText },
          { id: 'TRADES', label: tStr.tabPros, icon: Wrench },
          { id: 'BUDGET', label: tStr.tabBudget, icon: DollarSign },
          ...(activeStatus === 'SYNDIC' ? [{ id: 'ADMIN_MOD', label: tStr.tabValidation, icon: Shield }] : [])
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#a16eff] text-white shadow shadow-[#a16eff]/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* RENDER ACTIVE TAB BODY WITH SECURITY GUARDS FOR THE FORUM */}

      {/* TAB 1: GENERAL FORUM */}
      {activeTab === 'FORUM' && (
        <div className="space-y-6">
          {/* Security Guard: Unverified residents are locked from accessing building group chats */}
          {activeStatus === 'UNVERIFIED' ? (
            <div className="border border-white/5 rounded-2xl bg-[#161822] p-6 text-center space-y-4 max-w-xl mx-auto shadow-inner">
              <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto border border-red-500/25">
                <Lock className="w-6 h-6 animate-bounce" />
              </div>
              <h4 className="font-title font-bold text-sm text-white">{tStr.forumLockedTitle}</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                {tStr.forumLockedDesc} <b>{activeBuilding.name}</b>
              </p>

              {/* CORE /DEEPTHINK SECURITY WORKFLOW ELEMENT */}
              <form onSubmit={handleRequestVerification} className="text-left bg-[#12141c] p-4 rounded-xl border border-white/5 space-y-3">
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-black block">{tStr.authMethodsTitle}</span>
                
                <div className="grid grid-cols-2 gap-2 text-[10px] font-bold font-mono">
                  <button
                    type="button"
                    onClick={() => setAuthRoleSelection('RESIDENT')}
                    className={`p-2 rounded-lg border transition-colors cursor-pointer text-center ${authRoleSelection === 'RESIDENT' ? 'border-[#a16eff] bg-[#a16eff]/10 text-white' : 'border-white/5 text-gray-400'}`}
                  >
                    {tStr.roleResidentOption}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthRoleSelection('SYNDIC')}
                    className={`p-2 rounded-lg border transition-colors cursor-pointer text-center ${authRoleSelection === 'SYNDIC' ? 'border-purple-500 bg-purple-500/10 text-white' : 'border-white/5 text-gray-400'}`}
                  >
                    {tStr.roleSyndicOption}
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-gray-500 mb-1">{tStr.aptNumberLabel}</label>
                    <input
                      type="text"
                      placeholder="Ex: Apt 14, Bloc A"
                      value={apartmentNumber}
                      onChange={(e) => setApartmentNumber(e.target.value)}
                      required
                      className="w-full bg-[#161822] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#a16eff] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono text-gray-500 mb-1">{tStr.optACodeLabel}</label>
                    <input
                      type="text"
                      placeholder={tStr.codePlaceholder}
                      value={invitedCode}
                      onChange={(e) => setInvitedCode(e.target.value)}
                      className="w-full bg-[#161822] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#a16eff] text-xs placeholder:text-gray-600"
                    />
                  </div>

                  <div className="py-1">
                    <span className="block text-[9px] uppercase font-mono text-gray-500 text-center mb-1">{tStr.orLabel}</span>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono text-gray-500 mb-1">{tStr.optBDocLabel}</label>
                    <select
                      value={uploadedDocType}
                      onChange={(e) => setUploadedDocType(e.target.value)}
                      className="w-full bg-[#161822] border border-white/10 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-[#a16eff] text-xs mb-2"
                    >
                      {authRoleSelection === 'RESIDENT' ? (
                        <>
                          <option value="Facture Lydec">{tStr.docLydec}</option>
                          <option value="Contrat de bail">{tStr.docBail}</option>
                          <option value="Titre foncier">{tStr.docTitre}</option>
                        </>
                      ) : (
                        <option value="PV d'assemblée">{tStr.docPV}</option>
                      )}
                    </select>

                    <div className="border border-dashed border-white/10 rounded-lg p-3 text-center bg-[#161822] hover:bg-[#1a1d29] transition-colors cursor-pointer relative">
                      <input 
                        type="file" 
                        onChange={(e) => setUploadedDoc(e.target.files?.[0] || null)}
                        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                      />
                      <Upload className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                      <span className="text-[10px] text-gray-400 block break-all">
                        {uploadedDoc ? `📁 ${uploadedDoc.name}` : tStr.clickDragUpload}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-[#a16eff] hover:bg-[#a16eff]/95 text-white text-xs font-bold rounded-lg transition-all cursor-pointer font-title shadow-lg"
                  >
                    {tStr.submitAccessBtn}
                  </button>

                  <button
                    type="button"
                    onClick={handleInstantVerification}
                    className="flex-1 py-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/30 text-xs font-bold rounded-lg transition-all cursor-pointer"
                    title="Contourne la simulation pour tester le forum instantanément"
                  >
                    {tStr.instantValidateBtn}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            // APPROVED OR SYNDIC USER FLOW: Forum UI
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column Forum List & Search Panel */}
              <div className="lg:col-span-2 space-y-4">
                
                {/* Search Bar & Categorization Switcher */}
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <div className="relative w-full">
                    <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      placeholder={tStr.forumSearchPlaceholder}
                      value={forumSearch}
                      onChange={(e) => setForumSearch(e.target.value)}
                      className="w-full bg-[#1a1d29] border border-white/5 rounded-xl py-2.5 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-[#a16eff]/70"
                    />
                  </div>

                  <select
                    value={forumCategoryFilter}
                    onChange={(e) => setForumCategoryFilter(e.target.value)}
                    className="w-full sm:w-44 bg-[#1a1d29] border border-white/5 text-xs text-gray-300 rounded-xl px-3 py-2.5 focus:outline-none"
                  >
                    <option value="ALL">{tStr.catAll}</option>
                    <option value="ENTRETIEN">{tStr.catMaintenance}</option>
                    <option value="AG">{tStr.catAg}</option>
                    <option value="SECURITE">{tStr.catSecurity}</option>
                    <option value="VIE_COMMUNE">{tStr.catCommon}</option>
                    <option value="INCIDENT">{tStr.catIncident}</option>
                  </select>
                </div>

                {/* Listing posts in building */}
                <div className="space-y-4">
                  {searchedForumPosts.length === 0 ? (
                    <div className="border border-white/5 rounded-2xl p-8 text-center text-gray-500 text-xs">
                      {tStr.noDiscussions}
                    </div>
                  ) : (
                    searchedForumPosts.map(post => (
                      <div key={post.id} className="bg-[#1a1d29]/40 border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-all flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded font-bold bg-[#a16eff]/10 text-[#a16eff] border border-[#a16eff]/15">
                                {post.category}
                              </span>
                              <span className="text-[10px] text-gray-500 font-mono">
                                {new Date(post.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                              </span>
                            </div>
                            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${post.authorRole === 'SYNDIC_ÉLU' ? 'bg-purple-500/10 text-purple-400' : 'bg-gray-800 text-gray-400'}`}>
                              {tStr.byLabel} {post.authorName} ({post.authorRole})
                            </span>
                          </div>

                          <h4 className="text-sm font-semibold text-white mb-2">{post.title}</h4>
                          <p className="text-xs text-gray-300 leading-relaxed mb-4 whitespace-pre-line">{post.content}</p>
                        </div>

                        {/* Interactive comment block */}
                        <div className="border-t border-white/5 pt-3 mt-2">
                          <button
                            onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                            className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-[#a16eff]" />
                            <span className="font-mono">{post.commentsCount} {post.commentsCount > 1 ? tStr.commentsCountLabelPlural : tStr.commentsCountLabelOne}</span>
                          </button>

                          {activeCommentPostId === post.id && (
                            <div className="space-y-3 mt-3 ml-2 pl-3 border-l-2 border-white/5">
                              {post.comments.map(c => (
                                <div key={c.id} className="bg-[#12141c]/50 p-2.5 rounded-xl border border-white/5">
                                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                                    <span className="text-[#3ccfff] font-bold">{c.authorName}</span>
                                    <span className="text-gray-500">{c.authorRole}</span>
                                  </div>
                                  <p className="text-xs text-gray-300">{c.content}</p>
                                </div>
                              ))}

                              {/* New comment input */}
                              <div className="flex gap-2 pt-1">
                                <input
                                  type="text"
                                  placeholder={tStr.replyPlaceholder}
                                  value={newCommentText}
                                  onChange={(e) => setNewCommentText(e.target.value)}
                                  className="flex-1 bg-[#12141c] border border-white/5 rounded-xl px-3 py-2 text-xs focus:outline-none"
                                />
                                <button
                                  onClick={() => handleCreateComment(post.id)}
                                  className="p-2 bg-[#a16eff] hover:bg-[#a16eff]/80 text-white rounded-xl transition-all cursor-pointer shadow"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Right Column: Write New Post with AUTOMATED AI MODERATION */}
              <div className="bg-[#1a1d29]/40 border border-white/5 rounded-2xl p-4 self-start space-y-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#ff3c83]" />
                  <h5 className="text-xs font-bold text-white uppercase tracking-wider">{tStr.createDiscussionTitle}</h5>
                </div>
                <p className="text-[11px] text-gray-400">
                  {tStr.aiModAlertText}
                </p>

                <form onSubmit={handleCreateForumPost} className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">{tStr.discussionTitleLabel}</label>
                    <input
                      type="text"
                      placeholder={tStr.discussionTitlePlaceholder}
                      value={newPostTitle}
                      onChange={(e) => setNewPostTitle(e.target.value)}
                      required
                      className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#ff3c83]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">{tStr.categoryFormLabel}</label>
                    <select
                      value={newPostCategory}
                      onChange={(e) => setNewPostCategory(e.target.value as any)}
                      className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300"
                    >
                      <option value="ENTRETIEN">{tStr.catMaintenance}</option>
                      <option value="AG">{tStr.catAg}</option>
                      <option value="SECURITE">{tStr.catSecurity}</option>
                      <option value="VIE_COMMUNE">{tStr.catCommon}</option>
                      <option value="INCIDENT">{tStr.catIncident}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">{tStr.messageLabel}</label>
                    <textarea
                      placeholder={tStr.messagePlaceholder}
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      required
                      rows={5}
                      className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#ff3c83] resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-[#a16eff] to-[#ff3c83] text-white text-xs font-bold rounded-xl transition-all hover:opacity-95 shadow cursor-pointer uppercase tracking-wider"
                  >
                    {tStr.publishPostBtn}
                  </button>
                </form>
              </div>

            </div>
          )}
        </div>
      )}

      {/* TAB 2: AI COPROPRIÉTÉ ASSISTANT */}
      {activeTab === 'ASSISTANT' && (
        <div className="space-y-4">
          <div className="bg-[#1a1d29]/40 border border-white/5 rounded-2xl p-4">
            <div className="flex gap-3 mb-4">
              <div className="p-2 bg-gradient-to-tr from-purple-500/10 to-indigo-500/10 text-[#a16eff] rounded-xl border border-white/5 self-start">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">{tStr.aiAssistantTitle}</h4>
                <p className="text-xs text-gray-400 mt-1">{tStr.aiAssistantDesc}</p>
              </div>
            </div>

            {/* AI Advisor Chat Panel */}
            <div className="border border-white/5 rounded-2xl bg-[#0b0d14] p-4 flex flex-col h-[400px]">
              
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
                {chatHistory.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <Compass className="w-10 h-10 text-gray-600 animate-spin-slow" />
                    <div className="max-w-md">
                      <p className="text-xs text-gray-400">{tStr.aiAssistantPlaceholderText}</p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2 pt-2">
                      {quickQuestions.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendChatMessage(q.q)}
                          className="px-3 py-1.5 bg-[#1a1d29] hover:bg-[#a16eff]/15 border border-white/5 text-gray-300 hover:text-white rounded-full text-xs transition-all cursor-pointer shadow font-mono"
                        >
                          {q.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  chatHistory.map((item, idx) => (
                    <div key={idx} className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                        item.role === 'user' 
                          ? 'bg-[#a16eff] text-white rounded-br-none' 
                          : 'bg-[#1a1d29] border border-white/5 text-gray-200 rounded-bl-none format-markdown whitespace-pre-line'
                      }`}>
                        {item.text}
                      </div>
                    </div>
                  ))
                )}
                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-[#1a1d29] border border-white/5 rounded-2xl rounded-bl-none px-4 py-3 text-xs text-gray-400 flex items-center gap-2">
                      <span className="flex h-2 w-2 rounded-full bg-[#a16eff] animate-ping"></span>
                      <span>{tStr.aiAssistantConsultingText}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="flex gap-2 pt-2 border-t border-white/5 shrink-0">
                <input
                  type="text"
                  placeholder={tStr.aiAssistantInputPlaceholder}
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                  className="flex-1 bg-[#161822] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#a16eff]"
                />
                <button
                  onClick={() => handleSendChatMessage()}
                  className="px-4 py-2.5 bg-[#a16eff] hover:bg-[#a16eff]/90 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MOROCCAN LAW CATALOGUE & INTERACTIVE ELECTION/AUTHENTICATION WIDGETS */}
      {activeTab === 'LAWS' && (
        <div className="space-y-6 animate-fade-in text-left">
          {/* Internal subnavigation */}
          <div className="flex bg-[#12141c] p-1.5 rounded-2xl border border-white/5 gap-1.5 shadow-inner">
            <button
              onClick={() => { setLawsSubTab('CATALOGUE'); setPvSimulationSuccess(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer text-center ${
                lawsSubTab === 'CATALOGUE'
                  ? 'bg-[#1a1d29] text-white border border-white/10 shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              📖 {currentLang === 'AR' ? 'كتالوج القوانين' : 'Catalogue de Lois'}
            </button>
            <button
              onClick={() => { setLawsSubTab('ELECTION_GUIDE'); setPvSimulationSuccess(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer text-center ${
                lawsSubTab === 'ELECTION_GUIDE'
                  ? 'bg-[#1a1d29] text-white border border-white/10 shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              🗳️ {currentLang === 'AR' ? 'دليل الانتخابات' : "Guide d'Élection"}
            </button>
            <button
              onClick={() => { setLawsSubTab('AUTHENTICATION_PROCESS'); setPvSimulationSuccess(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer text-center ${
                lawsSubTab === 'AUTHENTICATION_PROCESS'
                  ? 'bg-[#1a1d29] text-white border border-white/10 shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              🔒 {currentLang === 'AR' ? 'توثيق مدينتي' : 'Authentification MyCity'}
            </button>
          </div>

          {/* SUB-TAB 1: LAW ARTICLES DIRECTORY */}
          {lawsSubTab === 'CATALOGUE' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder={tStr.filterLawPlaceholder}
                    value={lawSearchQuery}
                    onChange={(e) => setLawSearchQuery(e.target.value)}
                    className="w-full bg-[#1a1d29] border border-white/5 rounded-xl py-2.5 pl-9 pr-4 text-xs text-white focus:outline-none"
                  />
                </div>
                
                <div className="text-[10px] font-mono text-[#00f0ff] uppercase bg-teal-950/20 border border-teal-700/30 px-3 py-1 rounded shrink-0 whitespace-nowrap">
                  {tStr.lawsTitle}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredLaws.map(law => (
                  <div key={law.id} className="bg-[#1a1d29]/40 border border-white/5 p-4 rounded-2xl hover:border-white/10 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/5">
                        <span className="font-mono text-xs text-[#a16eff] uppercase font-bold">{law.source} • {law.article}</span>
                        {law.majorityRequired && (
                          <span className="text-[9px] font-mono bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/20">
                            {law.majorityRequired.substring(0, 20)}...
                          </span>
                        )}
                      </div>
                      <h5 className="font-semibold text-xs text-white uppercase tracking-wider mb-2">{law.topic}</h5>
                      <p className="text-xs text-gray-300 leading-relaxed mb-3">{law.description}</p>
                    </div>
                    {law.fullText && (
                      <div className="mt-2 p-2 bg-[#12141c]/80 rounded-xl border border-white/5 text-[11px] text-gray-400 font-mono italic">
                        {law.fullText}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-[#161822] p-4 rounded-2xl border border-white/5 flex gap-3 text-xs text-gray-400">
                <Info className="w-5 h-5 text-gray-500 shrink-0" />
                <div>
                  <span className="font-bold text-white block mb-0.5">{tStr.didYouKnowTitle}</span>
                  {tStr.didYouKnowText}
                </div>
              </div>
            </div>
          )}

          {/* SUB-TAB 2: LEGAL ELECTION GUIDE & TEMPLATE GENERATOR */}
          {lawsSubTab === 'ELECTION_GUIDE' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-[#161822]/80 border border-teal-500/20 rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl transform translate-x-10 -translate-y-10" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-teal-400" />
                  Guide Pratique : Élection Légale du Syndic au Maroc
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  L'élection du président du syndic (ou administrateur) est encadrée au Maroc par la <strong>Loi 18-00</strong> modifiée par la <strong>Loi 106-12</strong>. Suivre ce processus garantit l'opposabilité juridique de votre syndicat d'immeuble vis-à-vis du cadastre, des banques et de la municipalité.
                </p>
              </div>

              {/* Steps grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#1a1d29]/40 border border-white/5 p-4 rounded-2xl space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-[#a16eff] uppercase tracking-widest block">Étape 1 • Convocations</span>
                  <h5 className="font-semibold text-xs text-white uppercase">Délai minimum de 15 jours</h5>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Le syndic en place ou un groupe représentant au moins 10% des parts de l'immeuble doit envoyer les convocations écrites contenant l'ordre du jour au moins 15 jours à l'avance.
                  </p>
                  <p className="text-[10px] font-mono text-gray-500 italic">
                    💡 Recommandé : Remise en main propre contre émargement ou lettre recommandée.
                  </p>
                </div>

                <div className="bg-[#1a1d29]/40 border border-white/5 p-4 rounded-2xl space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest block">Étape 2 • Quorums & Votes</span>
                  <h5 className="font-semibold text-xs text-white uppercase">Deux niveaux de Quorum</h5>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    <strong>1er Tour :</strong> Mandat voté à la majorité absolue des quotes-parts de copropriété de TOUT l'immeuble (50% + 1 des voix totales).<br />
                    <strong>2nd Tour :</strong> Si quorum non atteint, une deuxième AG tenue sous 30 jours vote à la majorité simple des membres présents ou représentés.
                  </p>
                </div>

                <div className="bg-[#1a1d29]/40 border border-white/5 p-4 rounded-2xl space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest block">Étape 3 • Procès-Verbal</span>
                  <h5 className="font-semibold text-xs text-white uppercase">Rédaction du PV d'AG d'Élection</h5>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Le PV d'AG doit mandater clairement le nouveau syndic, spécifier son nom, la durée de son mandat (maximum 2 ans renouvelables), et la validité du budget d'immeuble associé.
                  </p>
                </div>

                <div className="bg-[#1a1d29]/40 border border-white/5 p-4 rounded-2xl space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">Étape 4 • Légalisation</span>
                  <h5 className="font-semibold text-xs text-white uppercase">Enregistrement à la Moqataa locale</h5>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    <strong>Obligatoire au Maroc :</strong> Les signatures des membres du bureau de séance doivent faire l'objet d'une légalisation formelle de signature à l'annexe administrative étatique locale (Moqataa / المقاطعة) de l'arrondissement du bâtiment.
                  </p>
                </div>
              </div>

              {/* Interactive checklist block */}
              <div className="bg-[#1a1d29]/60 border border-white/5 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Simulateur de conformité : Votre élection est-elle légale ?</h4>
                  <span className="text-[9px] font-mono text-gray-400 bg-white/5 px-2 py-0.5 rounded">Règles Marocaines</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <label className="flex items-start gap-2.5 p-2 bg-[#12141c]/40 rounded-xl border border-white/5 hover:bg-[#12141c] transition-colors cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={electionChecklist.noticeSent} 
                      onChange={(e) => setElectionChecklist(prev => ({ ...prev, noticeSent: e.target.checked }))}
                      className="mt-0.5 accent-[#a16eff]"
                    />
                    <div>
                      <span className="font-bold text-white block">Convocations à J-15</span>
                      <p className="text-[11px] text-gray-500">Lettres écrites transmises au moins 15 jours avant la date de l'AG.</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-2 bg-[#12141c]/40 rounded-xl border border-white/5 hover:bg-[#12141c] transition-colors cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={electionChecklist.agendaSet} 
                      onChange={(e) => setElectionChecklist(prev => ({ ...prev, agendaSet: e.target.checked }))}
                      className="mt-0.5 accent-[#a16eff]"
                    />
                    <div>
                      <span className="font-bold text-white block">Ordre du jour formalisé</span>
                      <p className="text-[11px] text-gray-500">Contient explicitement : "Renouvellement/Élection du mandat du syndic".</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-2 bg-[#12141c]/40 rounded-xl border border-white/5 hover:bg-[#12141c] transition-colors cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={electionChecklist.quorumMet} 
                      onChange={(e) => setElectionChecklist(prev => ({ ...prev, quorumMet: e.target.checked }))}
                      className="mt-0.5 accent-[#a16eff]"
                    />
                    <div>
                      <span className="font-bold text-white block">Quorum et Majorité validés</span>
                      <p className="text-[11px] text-gray-500">Majorité absolue des tantièmes (Tour 1) ou simple des présents (Tour 2).</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-2 bg-[#12141c]/40 rounded-xl border border-white/5 hover:bg-[#12141c] transition-colors cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={electionChecklist.pvDrafted} 
                      onChange={(e) => setElectionChecklist(prev => ({ ...prev, pvDrafted: e.target.checked }))}
                      className="mt-0.5 accent-[#a16eff]"
                    />
                    <div>
                      <span className="font-bold text-white block">Procès-verbal rédigé & signé</span>
                      <p className="text-[11px] text-gray-500 font-sans">PV incluant les résolutions, signé par le bureau de l'AG.</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-2 bg-[#12141c]/40 rounded-xl border border-white/5 hover:bg-[#12141c] transition-colors cursor-pointer md:col-span-2">
                    <input 
                      type="checkbox" 
                      checked={electionChecklist.legalizedMoqataa} 
                      onChange={(e) => setElectionChecklist(prev => ({ ...prev, legalizedMoqataa: e.target.checked }))}
                      className="mt-0.5 accent-[#a16eff]"
                    />
                    <div>
                      <span className="font-bold text-white block text-teal-400">🔥 Légalisation administrative (Moqataa locale)</span>
                      <p className="text-[11px] text-gray-400">Le PV d'AG porte le cachet officiel d'authentification de signature de l'officier de la Moqataa.</p>
                    </div>
                  </label>
                </div>

                {/* Checklist result banner */}
                <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                  Object.values(electionChecklist).every(Boolean)
                    ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'
                    : 'bg-[#12141c]/60 border-white/5 text-gray-400'
                }`}>
                  {Object.values(electionChecklist).every(Boolean) ? (
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong>Félicitations, votre dossier d'élection est complet !</strong> Vous possédez un PV d'AG parfaitement régulier et légal. Procédez à l'étape suivante dans le panneau <strong>Authentification MyCity</strong> pour débloquer votre statut syndic administrateur.
                      </div>
                    </div>
                  ) : (
                    "Remplissez les points essentiels requis ci-dessus pour vous assurer de la pleine conformité réglementaire de l'élection de votre syndic."
                  )}
                </div>
              </div>

              {/* Automatic Procès-Verbal draft template generator */}
              <div className="bg-[#1a1d29]/40 border border-white/5 p-5 rounded-2xl space-y-4">
                <div className="border-b border-white/5 pb-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Outil d'Aide : Générateur de Modèle de PV d'AG (Dahir 18-00)</h4>
                  <p className="text-[10px] text-gray-400 mt-1">Saisissez les paramètres de votre immeuble pour prévisualiser instantanément un modèle de Procès-Verbal officiel conforme prêt pour impression / signature.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">Nom de l'immeuble ou Résidence</label>
                    <input 
                      type="text" 
                      value={pvGenBuildingName} 
                      onChange={(e) => setPvGenBuildingName(e.target.value)}
                      className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a16eff]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">Ville de la Copropriété</label>
                    <input 
                      type="text" 
                      value={pvGenCity} 
                      onChange={(e) => setPvGenCity(e.target.value)}
                      className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a16eff]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">Prénom & Nom du Syndic Élu</label>
                    <input 
                      type="text" 
                      value={pvGenPresidentName} 
                      onChange={(e) => setPvGenPresidentName(e.target.value)}
                      className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a16eff]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">Date théorique de Tenue d'AG</label>
                    <input 
                      type="date" 
                      value={pvGenDate} 
                      onChange={(e) => setPvGenDate(e.target.value)}
                      className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a16eff]"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setPvGenIsGenerated(true)}
                  className="w-full py-2 bg-[#a16eff] hover:bg-[#a16eff]/80 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow"
                >
                  <FileText className="w-4 h-4" />
                  Générer le projet de PV Légalisable
                </button>

                {pvGenIsGenerated && (
                  <div className="bg-[#12141c] border border-white/10 p-4 rounded-xl space-y-3 font-mono text-[11px] leading-relaxed text-gray-300 relative select-text overflow-x-auto scroller-hidden animate-fade-in max-h-72 overflow-y-auto">
                    <div className="absolute top-4 right-4 bg-[#1a1d29] px-2 py-1 rounded text-[9px] text-gray-500 uppercase border border-white/5 select-none">MODÈLE OFFICIEL</div>
                    <p className="text-center font-bold text-white">ROYAUME DU MAROC<br />PRÉFECTURE DE {pvGenCity.toUpperCase()}<br />SYNDICAT DES COPROPRIÉTAIRES DE LA COPROPRIÉTÉ : {pvGenBuildingName.toUpperCase()}</p>
                    <p className="text-center">----------------------------------------------------</p>
                    <p className="font-bold text-[#a16eff] text-xs">PROCÈS-VERBAL DE L'ASSEMBLÉE GÉNÉRALE ORDINAIRE</p>
                    <p>En date du <strong>{pvGenDate}</strong>, s'est tenue dans les locaux communs ou hall principal du bâtiment l'Assemblée Générale Ordinaire des copropriétaires de la copropriété <strong>{pvGenBuildingName}</strong>, sise à <strong>{pvGenCity}</strong>.</p>
                    <p>Était représentée par procuration ou présence physique : la majorité qualifiée requise prévue par l'<strong>Article 25 de la Loi 106-12</strong>.</p>
                    <p><strong>RÉSOLUTION N°1 : ÉLECTION DU SYNDIC ET MANDAT DIRECTEUR</strong><br />
                      L'assemblée générale procède au scrutin et élit en qualité de Secrétaire Syndic de la Copropriété, le co-votant désigné : <strong>M. {pvGenPresidentName}</strong> pour une durée légale de 2 ans, prenant effet le jour même de sa signature légalisée, à la majorité absolue.</p>
                    <p>Fait à {pvGenCity}, le {pvGenDate}.<br />
                      <i>Le Bureau d'Assemblée Générale :<br />
                      M. Le Secrétaire élut sous réserve de dépôt administratif.</i>
                    </p>
                    <p className="border-t border-dashed border-white/10 pt-2 text-teal-400 text-[10px]">
                      ✍️ Mention légale requise : Les signataires doivent faire précéder leurs paraphes de la mention manuscrite "Bon pour acceptation du mandat de syndic de copropriété".
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SUB-TAB 3: MYCITY ADMINISTRATIVE MODERATION & AUTHENTICATION PROTOCOL */}
          {lawsSubTab === 'AUTHENTICATION_PROCESS' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-[#161822]/80 border border-purple-500/20 rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl transform translate-x-10 -translate-y-10" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-purple-400" />
                  Souveraineté Comptable : Le Protocole d'Authentification MyCity
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Afin de prémunir les fonds de réserve et les données souveraines des résidents contre les hijacking de comptes, un citoyen ne peut pas s'autoproclamer syndic sur la plateforme MyCity simplement en déclarant un profil. Un sas de sécurité basé sur l'<strong>examen légal du PV de la Moqataa</strong> est systématiquement mené par l'équipe de modération de MyCity.
                </p>
              </div>

              {/* Protocol Flowchart */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">LE PROCES DE VÉRIFICATION EN PRATIQUE :</span>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#12141c]/50 border border-white/5 p-4 rounded-xl text-center space-y-2">
                    <div className="w-8 h-8 rounded-full bg-[#a16eff]/10 text-[#a16eff] flex items-center justify-center font-mono font-bold text-xs mx-auto">1</div>
                    <span className="font-bold text-xs text-white block">Dépôt du PV Moqataa</span>
                    <p className="text-[11px] text-gray-400">Le syndic dépose le scan PDF du Procès-Verbal muni du tampon officiel et des signatures légalisées.</p>
                  </div>

                  <div className="bg-[#12141c]/50 border border-white/5 p-4 rounded-xl text-center space-y-2">
                    <div className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center font-mono font-bold text-xs mx-auto">2</div>
                    <span className="font-bold text-xs text-white block">Audit de Sécurité MyCity</span>
                    <p className="text-[11px] text-gray-400 font-sans">Les modérateurs analysent l'authenticité étatique du sceau, du code d'arrondissement, et valident les tantièmes.</p>
                  </div>

                  <div className="bg-[#12141c]/50 border border-white/5 p-4 rounded-xl text-center space-y-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-mono font-bold text-xs mx-auto">3</div>
                    <span className="font-bold text-xs text-white block">Génération Clef Cryptographique</span>
                    <p className="text-[11px] text-gray-400">Le compte citoyen est certifié 'Syndic Élu Réel' et reçoit les droits d'écriture bancaire et d'administration.</p>
                  </div>
                </div>
              </div>

              {/* LIVE SIMULATOR WIDGET */}
              <div className="border border-white/5 bg-[#161822] rounded-2xl p-5 space-y-4">
                <div className="border-b border-white/5 pb-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Simulateur Interactif de Modération d'Authenticité</h4>
                  <p className="text-[10px] text-gray-400 mt-1">Vous venez d’élire un syndic légal ou vous l'êtes vous-même ? Simulez le dépôt de votre PV étatique légalisé pour tester de manière sécurisée l'authentification et libérer le rôle administratif au format de démonstration d'AI Studio.</p>
                </div>

                <div className="bg-[#12141c] p-4 rounded-xl border border-white/5 space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs gap-3">
                    <div>
                      <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">ÉLECTEUR DE DEMO</span>
                      <strong className="text-white text-xs">{pvGenPresidentName} (Espace {pvGenBuildingName})</strong>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2.5 py-1 rounded">
                        Statut : Dépôt de PV requis
                      </span>
                    </div>
                  </div>

                  <div className="border border-dashed border-white/10 rounded-xl p-5 text-center bg-[#161822] hover:bg-[#1a1d29]/60 transition-colors pointer-events-none">
                    <FileText className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                    <span className="text-xs text-teal-400 block font-bold">✓ Fichier PV Légalisé Préparé : PV_AG_Conforme_Loi106-12_{pvGenPresidentName.replace(' ', '_')}.pdf</span>
                    <span className="text-[10px] text-gray-500 mt-1 block">Taille: 1.4 Mo • Prêt pour injection OCR</span>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      disabled={isSimulatingAuth}
                      onClick={() => {
                        setIsSimulatingAuth(true);
                        setPvSimulationSuccess(null);
                        setTimeout(() => {
                          setIsSimulatingAuth(false);
                          setPvSimulationSuccess(`CONFORME : PV d'élection de M. ${pvGenPresidentName} légalisé par l'arrondissement communal de Casablanca validated.`);
                        }, 2200);
                      }}
                      className="w-full py-2.5 bg-gradient-to-r from-[#a16eff] to-purple-600 hover:opacity-90 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isSimulatingAuth ? (
                        <div className="flex items-center gap-2 text-xs">
                          <span className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></span>
                          <span>MyCity AI OCR : Analyse de la Moqataa de Casablanca en cours...</span>
                        </div>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>Lancer l'audit de sécurité automatisé MyCity</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Simulation Output Success Panel */}
                {pvSimulationSuccess && (
                  <div className="bg-emerald-950/25 border border-emerald-500/30 p-4 rounded-xl text-xs space-y-3 animate-fade-in text-emerald-300">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <strong className="text-white block">Audit Complété avec Succès!</strong>
                        <p className="text-[11px]">Le service de modération de sécurité MyCity a recoupé les éléments de l’AG avec le Registre des Signatures de l’arrondissement.</p>
                        <div className="grid grid-cols-2 gap-2 font-mono text-[10px] pt-1 text-gray-400">
                          <div>Sceau Administratif : <span className="text-emerald-400">✓ VALIDÉ (Moqataa)</span></div>
                          <div>Quorum des Tantièmes : <span className="text-emerald-400">✓ VALIDÉ (72.5% de voix)</span></div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-emerald-500/20 pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 select-none">
                      <span className="text-[10px] text-emerald-400 italic">Preuve légale cryptographique générée.</span>
                      <button
                        onClick={() => {
                          // Change verification status directly in the state
                          setVerificationStatus(prev => ({
                            ...prev,
                            [activeBuildingId]: 'SYNDIC'
                          }));
                          alert("🎉 Rôle Syndic Élu Activé ! L'espace de gestion et de validation est à présent débloqué pour vous.");
                          setPvSimulationSuccess(null);
                        }}
                        className="py-1.5 px-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-lg text-[10px] transition-colors cursor-pointer"
                      >
                        🔓 Activer le rôle Syndic Administrateur
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}


      {/* TAB 4: TRADE PROFESSIONALS DIRECTORY */}
      {activeTab === 'TRADES' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">{tStr.tradesHeader}</h4>
            <div className="text-[10px] font-mono text-[#3ccfff] uppercase">
              👷 {tStr.tradesSub}
            </div>
          </div>

          <div className="flex gap-1 overflow-x-auto pb-1.5">
            {['ALL', 'PLOMBIER', 'ELECTRICIEN', 'SERRURIER', 'AVOCAT', 'HUISSIER', 'NETTOYAGE'].map(trade => (
              <button
                key={trade}
                onClick={() => setActiveTradeFilter(trade)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTradeFilter === trade 
                    ? 'bg-[#a16eff]/20 text-white border border-[#a16eff]' 
                    : 'bg-[#1a1d29] text-gray-400 hover:text-white border border-white/5'
                }`}
              >
                {trade === 'ALL' ? (currentLang === 'AR' ? "الكل" : "Tous") : trade}
              </button>
            ))}
          </div>

          {/* Institution banner for Avocats if filter is ALL or AVOCAT */}
          {(activeTradeFilter === 'ALL' || activeTradeFilter === 'AVOCAT') && (
            <>
              <div 
                onClick={() => setShowAvocatModal(true)}
                className="p-4 bg-indigo-950/40 border border-[#a16eff]/25 rounded-2xl space-y-2 cursor-pointer hover:border-[#a16eff]/60 hover:bg-[#a16eff]/10 transition-all group scale-[0.99] hover:scale-[1.002]"
                title="Cliquez pour consulter le rôle, les recours en cas de malpratique et les coordonnées"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🏛️</span>
                    <span className="text-[11px] font-bold text-white uppercase tracking-wider font-mono">Ordre des Avocats de Casablanca</span>
                  </div>
                  <span className="text-[9px] bg-[#a16eff]/30 text-indigo-300 px-2 py-0.5 rounded-full font-mono font-bold uppercase group-hover:bg-[#a16eff] group-hover:text-white transition-colors">
                    📖 Guide des Droits & Recours
                  </span>
                </div>
                <p className="text-[9.5px] text-indigo-300 leading-normal">
                  Bâtonnier de Casablanca & Conseil de l'Ordre — Organe représentatif légal répertoriant le tableau officiel des avocats et veillant aux règles d'éthique. <span className="underline font-bold text-white">Cliquez pour consulter le guide légal complet</span>.
                </p>
              </div>

              {/* Avocat Detailed Malpractice & Rights Modal */}
              {showAvocatModal && (
                <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-[9999] animate-fade-in" style={{ direction: 'ltr' }}>
                  <div className="bg-[#11131e] border border-indigo-500/30 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
                    {/* Header */}
                    <div className="p-6 border-b border-indigo-500/15 flex items-start justify-between bg-indigo-950/20">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🏛️</span>
                        <div>
                          <h3 className="font-title font-bold text-base text-white">Ordre des Avocats de Casablanca</h3>
                          <p className="text-xs text-indigo-300 font-mono">Bâtonnier de Casablanca & Protection Déontologique</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setShowAvocatModal(false)}
                        className="p-1 px-2.5 bg-indigo-950/50 hover:bg-rose-950/50 text-gray-400 hover:text-white rounded-lg border border-white/5 transition-colors font-mono text-xs cursor-pointer"
                      >
                        ✕ Fermer
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6 text-xs text-gray-300 leading-relaxed">
                      {/* Section 1: Rôle Légal */}
                      <div className="space-y-2">
                        <h4 className="font-mono text-indigo-400 font-bold uppercase tracking-wider border-b border-indigo-500/10 pb-1 flex items-center gap-1.5">
                          <span>⚖️</span> Rôle Légal & Prérogatives Publiques
                        </h4>
                        <p>
                          Conformément à la <b>Loi n° 28-08</b> régissant la profession d'avocat au Maroc, l'Ordre des Avocats est l'institution régulatrice officielle de la profession de défenseur. Il dresse le tableau officiel des avocats autorisés à plaider à Casablanca, certifie les compétences professionnelles, et s'impose comme garant indéfectible du secret professionnel, du respect des règles déontologiques et de l'accès constitutionnel à la défense pour tous les citoyens.
                        </p>
                      </div>

                      {/* Section 2: Protection face aux maladresses / malpratiques */}
                      <div className="space-y-2">
                        <h4 className="font-mono text-indigo-400 font-bold uppercase tracking-wider border-b border-indigo-500/10 pb-1 flex items-center gap-1.5">
                          <span>🛡️</span> Protection contre les Malpratiques des Praticiens (Abus & Négligences)
                        </h4>
                        <p className="mb-2">
                          L'Ordre des Avocats a mis en place des mécanismes coercitifs et protecteurs pour réparer et arbitrer les cas d'abus :
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] bg-indigo-950/20 p-3.5 rounded-xl border border-indigo-500/10">
                          <div className="space-y-1">
                            <h5 className="font-bold text-white">💼 Contestation d'Honoraires</h5>
                            <p className="text-gray-400 text-[10.5px]">En cas de surfacturation ou d'honoraires sans rapport avec les tâches réelles, le Bureau du Bâtonnier est la seule autorité compétente pour recalculer de force le montant équitable et ordonner un remboursement.</p>
                          </div>
                          <div className="space-y-1">
                            <h5 className="font-bold text-white">⚠️ Erreurs de Procédure</h5>
                            <p className="text-gray-400 text-[10.5px]">Négligence fatale (ex: dépassement d'un délai de recours entraînant la déchéance de vos droits). Le Conseil de l'Ordre mène des enquêtes débouchant sur des sanctions disciplinaires rigoureuses pouvant aller jusqu'à l'exclusion définitive (radiation).</p>
                          </div>
                          <div className="space-y-1 md:col-span-2 pt-1 border-t border-white/5">
                            <h5 className="font-bold text-white">💰 Abus de Confiance & Détournement</h5>
                            <p className="text-gray-400 text-[10.5px]">Tout encaissement direct de fonds destinés au client sans passer par la Caisse Spéciale de l'Ordre (Secrétariat des Consignations CARPA) est une infraction grave. L'Ordre intervient pour restituer de plein droit l'argent légitime.</p>
                          </div>
                        </div>
                      </div>

                      {/* Section 3: Vos Droits & Comment les obtenir */}
                      <div className="space-y-3">
                        <h4 className="font-mono text-indigo-400 font-bold uppercase tracking-wider border-b border-indigo-500/10 pb-1 flex items-center gap-1.5">
                          <span>📋</span> Vos Droits Légitimes & Démarches d'Action (Étape par Étape)
                        </h4>
                        <ol className="space-y-2.5 text-gray-400 list-decimal pl-4">
                          <li>
                            <b className="text-white">Demander l'état complet du dossier à l'avocat :</b> Vous avez le droit absolu d'obtenir à tout moment l'ensemble des conclusions écrites déposées, les notifications officielles des tribunaux et l'état détaillé de ses démarches.
                          </li>
                          <li>
                            <b className="text-white">Saisine du Bâtonnier (Dépôt de plainte) :</b> Si un avocat manque à ses obligations déontologiques, adressez une lettre recommandée ou déposez contre décharge un pli écrit au secrétariat permanent du Bâtonnier. Mentionnez l'historique détaillé, le nom de l'avocat en cause, sa juridiction d'exercice et l'objet précis du grief.
                          </li>
                          <li>
                            <b className="text-white">La commission d'Assistance Judiciaire :</b> Si vous êtes confronté à un avocat indélicat dans une cause vitale et sans ressources matérielles, l'Ordre vous garantit la désignation immédiate et gratuite d'un avocat d'office pour sauvegarder vos intérêts.
                          </li>
                          <li>
                            <b className="text-white">Voie d'Appel des Arbitrages :</b> Si la décision du Bâtonnier concernant des honoraires ou un différend déontologique ne vous satisfait pas, la législation vous attribue un délai de 15 jours francs pour faire appel devant la cour d'appel locale.
                          </li>
                        </ol>
                      </div>

                      {/* Section 4: Contact Officiel */}
                      <div className="space-y-3 bg-[#11131e] border border-[#a16eff]/15 p-4 rounded-2xl">
                        <h4 className="font-mono text-white font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                          <span>📞</span> Coordonnées Officielles & Bureau de Casablanca
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] font-mono leading-relaxed">
                          <div>
                            <p><span className="text-gray-500">📍 Siège Central :</span> <span className="text-gray-200 font-sans">Maison de l'Avocat, Boulevard Moulay Youssef (à côté de la Cour d'Appel), Casablanca, Maroc</span></p>
                            <p className="mt-1"><span className="text-gray-500">📧 E-mail :</span> <span className="text-indigo-400">contact@barreau-casablanca.ma</span></p>
                          </div>
                          <div>
                            <p><span className="text-gray-500">📞 Standard Tél :</span> <span className="text-[#00ffcc] font-sans font-bold">+212 (0) 522-26 23 04</span></p>
                            <p><span className="text-gray-500">📠 Copieur / Fax :</span> <span className="text-gray-400 font-sans">+212 (0) 522-22 40 55</span></p>
                            <p className="mt-1"><span className="text-gray-500">🕒 Heures d'Accueil :</span> <span className="text-yellow-400">Lundi-Vendredi : 08:30 - 16:30</span></p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 bg-indigo-950/20 border-t border-indigo-500/15 flex justify-end">
                      <button 
                        onClick={() => setShowAvocatModal(false)}
                        className="px-5 py-2 bg-[#a16eff] hover:bg-[#5329df] text-white font-bold rounded-xl transition-all font-mono text-xs cursor-pointer shadow-lg shadow-indigo-500/10"
                      >
                        J'ai bien compris mes droits
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTrades.map(t => (
              <div key={t.id} className="bg-[#1a1d29]/40 border border-white/5 p-4 rounded-2xl flex flex-col justify-between relative hover:border-white/10 transition-transform">
                {t.verifiedBySyndic && (
                  <span className="absolute top-3 right-3 text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono font-bold uppercase">
                    {tStr.verifiedSyndicBadge}
                  </span>
                )}
                
                <div className="space-y-2">
                  <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{t.trade}</div>
                  <h5 className="font-semibold text-xs text-white">{t.name}</h5>
                  <p className="text-[11px] text-gray-400 font-mono">{t.company}</p>
                  <p className="text-[11px] text-[#a16eff] font-sans font-bold">{t.recentCostRange}</p>

                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="text-yellow-400">★ {t.rating}</span>
                    <span className="text-gray-500">({t.reviewsCount} {tStr.reviewsCountLabel})</span>
                  </div>
                  <p className="text-[10px] text-gray-500 font-mono leading-tight">{t.address}</p>
                </div>

                <div className="border-t border-white/5 pt-3 mt-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-gray-500">Contact:</span>
                    <span className="text-gray-300 font-bold">{t.contact}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      onClick={() => handleToggleRecommend(t.id)}
                      className={`flex-1 py-1.5 rounded-xl text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                        recommendedTrades.includes(t.id)
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                          : 'bg-[#1a1d29]/80 text-gray-400 hover:text-white border border-white/5 hover:bg-white/5'
                      }`}
                    >
                      <span>👍 {recommendedTrades.includes(t.id) ? tStr.recommendedActive : tStr.recommendBtn}</span>
                    </button>
                    <a
                      href={`tel:${t.contact.replace(/\s+/g, '')}`}
                      className="px-2.5 py-1.5 bg-[#a16eff]/10 text-[#a16eff] hover:bg-[#a16eff] hover:text-white transition-all rounded-xl text-[10px] font-bold font-mono text-center flex items-center justify-center gap-1 cursor-pointer border border-[#a16eff]/20"
                    >
                      📞 {tStr.callBtn}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: REVENUE & EXPENSES SPREADSHEET */}
      {activeTab === 'BUDGET' && (
        <div className="space-y-6">
          
          {/* Financial Summary KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="bg-[#1a1d29]/50 border border-white/5 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-gray-500 uppercase">{tStr.totalRevenue}</span>
                <p className="text-lg font-bold text-emerald-400 mt-1 font-mono">{totals.recettes.toLocaleString('fr-FR')} MAD</p>
              </div>
              <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-[#1a1d29]/50 border border-white/5 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-gray-500 uppercase">{tStr.totalExpenses}</span>
                <p className="text-lg font-bold text-red-400 mt-1 font-mono">{totals.depenses.toLocaleString('fr-FR')} MAD</p>
              </div>
              <div className="p-2.5 bg-red-500/10 text-red-400 rounded-xl">
                <TrendingDown className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-[#1a1d29]/50 border border-white/5 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-gray-500 uppercase">{tStr.currentBalance}</span>
                <p className={`text-lg font-bold mt-1 font-mono ${totalBalance >= 0 ? 'text-[#00f0ff]' : 'text-red-500'}`}>
                  {totalBalance.toLocaleString('fr-FR')} MAD
                </p>
              </div>
              <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Ledger Spreadsheet table */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold text-white uppercase tracking-wider">{tStr.buildingLedgerTitle}</h5>
                <span className="text-[10px] font-mono text-[#00f0ff] uppercase bg-cyan-950/20 px-2 py-0.5 rounded">Mai 2026</span>
              </div>

              <div className="border border-white/5 rounded-2xl overflow-hidden bg-[#161822]">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-[#1a1d29] text-[10px] uppercase font-mono text-gray-400 border-b border-white/5">
                    <tr>
                      <th className="p-3">Type</th>
                      <th className="p-3">{tStr.itemLabel}</th>
                      <th className="p-3">{tStr.categoryLabel}</th>
                      <th className="p-3 text-right">{tStr.amountLabel}</th>
                      {activeStatus === 'SYNDIC' && <th className="p-3 text-center">{tStr.actionsLabel}</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono text-[11px] text-gray-300">
                    {budgetItems.map(item => (
                      <tr key={item.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            item.type === 'RECETTE' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                          }`}>
                            {item.type}
                          </span>
                        </td>
                        <td className="p-3 max-w-[200px] truncate" title={item.label}>
                          {item.label}
                        </td>
                        <td className="p-3 text-gray-500">
                          {item.category}
                        </td>
                        <td className={`p-3 text-right font-bold ${
                          item.type === 'RECETTE' ? 'text-emerald-400' : 'text-gray-300'
                        }`}>
                          {item.type === 'DEPENSE' ? '-' : ''}{item.amount.toLocaleString('fr-FR')}
                        </td>
                        {activeStatus === 'SYNDIC' && (
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleDeleteBudgetLine(item.id)}
                              className="text-red-400 hover:text-red-500 p-1"
                              title="Retirer cette transaction"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Reserve Warning according to Loi 106-12 Article 36 */}
              <div className="bg-[#1a1d29]/40 border border-[#a16eff]/20 rounded-2xl p-4 flex gap-3 text-xs leading-relaxed text-gray-400">
                <FileCheck className="w-5 h-5 text-[#a16eff] shrink-0" />
                <div>
                  <span className="font-bold text-white block mb-0.5">{tStr.reserveFundTitle}</span>
                  {tStr.reserveFundPrefix} <b className="text-white">{reserveFundEstimate.toLocaleString('fr-FR')} MAD</b> {tStr.reserveFundSuffix}
                </div>
              </div>
            </div>

            {/* Right Column: Add transaction entry sheet (Only for Syndics or validated residents) */}
            <div className="bg-[#1a1d29]/40 border border-white/5 p-4 rounded-2xl self-start space-y-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#a16eff]" />
                <h5 className="text-xs font-bold text-white uppercase tracking-wider">{tStr.addTransactionTitle}</h5>
              </div>

              {activeStatus === 'UNVERIFIED' || activeStatus === 'PENDING' ? (
                <div className="text-center p-4 bg-black/20 border border-white/5 rounded-xl space-y-2">
                  <Lock className="w-4 h-4 mx-auto text-gray-500" />
                  <p className="text-[11px] text-gray-400">{tStr.unverifiedTreasureAlert}</p>
                </div>
              ) : (
                <form onSubmit={handleAddBudgetLine} className="space-y-3">
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">{tStr.movementLabel}</label>
                    <div className="grid grid-cols-2 gap-1 text-[10px] font-mono font-bold">
                      <button
                        type="button"
                        onClick={() => setNewBudgetType('RECETTE')}
                        className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${newBudgetType === 'RECETTE' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-white/5 text-gray-400'}`}
                      >
                        {tStr.revenuePlusLabel}
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewBudgetType('DEPENSE')}
                        className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${newBudgetType === 'DEPENSE' ? 'border-red-500 bg-red-500/10 text-red-500' : 'border-white/5 text-gray-400'}`}
                      >
                        {tStr.expenseMinusLabel}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">{tStr.ledgerDesignationLabel}</label>
                    <input
                      type="text"
                      placeholder={tStr.ledgerDesignationPlaceholder}
                      value={newBudgetLabel}
                      onChange={(e) => setNewBudgetLabel(e.target.value)}
                      required
                      className="w-full bg-[#12141c] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#a16eff] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">{tStr.categoryLabel}</label>
                    <input
                      type="text"
                      placeholder="Ex: Main-d'œuvre, Syndic"
                      value={newBudgetCategory}
                      onChange={(e) => setNewBudgetCategory(e.target.value)}
                      required
                      className="w-full bg-[#12141c] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#a16eff] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">{tStr.amountLabel}</label>
                    <input
                      type="number"
                      placeholder={tStr.ledgerAmountPlaceholder}
                      value={newBudgetAmount}
                      onChange={(e) => setNewBudgetAmount(e.target.value)}
                      required
                      className="w-full bg-[#12141c] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#a16eff] text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-[#a16eff] hover:bg-[#a16eff]/80 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow"
                  >
                    {tStr.ledgerSubmitBtn}
                  </button>
                </form>
              )}

            </div>

          </div>

        </div>
      )}

      {/* TAB 6: PENDING VALIDATION PANEL FOR SYNDIC BOARD */}
      {activeTab === 'ADMIN_MOD' && activeStatus === 'SYNDIC' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <div>
              <h4 className="text-sm font-semibold text-white">{tStr.verificationConsoleTitle}</h4>
              <p className="text-xs text-gray-400 mt-1">{tStr.verificationConsoleDesc}</p>
            </div>
            <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded border border-purple-500/20">
              {tStr.activeCoproAdminLabel}
            </span>
          </div>

          <div className="space-y-4">
            {pendingVerifications.filter(t => t.buildingId === activeBuildingId).length === 0 ? (
              <div className="border border-white/5 rounded-2xl bg-[#161822] p-8 text-center text-gray-500 text-xs">
                {tStr.verificationConsoleEmpty}
              </div>
            ) : (
              pendingVerifications.filter(t => t.buildingId === activeBuildingId).map(ticket => (
                <div key={ticket.id} className="bg-[#1a1d29]/40 border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{ticket.residentName}</span>
                      <span className="text-[10px] font-mono font-black italic bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded">
                        {ticket.apartment}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-400 font-mono">
                      {tStr.proofLabel} {ticket.documentType} ({ticket.documentName})
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono">{tStr.depositedAgo} {ticket.time}</div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApproveTicket(ticket, true)}
                      className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      {tStr.acceptBtn}
                    </button>
                    <button
                      onClick={() => handleApproveTicket(ticket, false)}
                      className="px-3 py-1.5 bg-red-500/10 border border-red-500/25 hover:bg-red-500 text-red-400 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      {tStr.rejectBtn}
                    </button>
                    <button
                      onClick={() => alert(`📂 Ouverture simulée du fichier justificatif: /verification_proofs/${ticket.documentName}`)}
                      className="px-3 py-1.5 bg-[#1a1d29] hover:bg-white/5 border border-white/5 text-gray-400 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      {tStr.viewProofBtn}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODERATION WARNING OVERLAY MODAL (AUTOMATED IA MODERATION ERROR FLOW) */}
      {moderationWarning && moderationWarning.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#12141c] border border-red-500/25 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
            <button 
              onClick={() => setModerationWarning(null)} 
              className="absolute top-4 right-4 text-gray-500 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto border border-red-500/30">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>

              <h4 className="font-title font-bold text-sm text-white uppercase tracking-wider text-red-400">{tStr.messageRejectedTitle}</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                {tStr.ethicsDetectorDesc}
              </p>

              <div className="bg-[#1a1d29] p-3.5 rounded-xl border border-white/5 text-left text-xs space-y-2">
                <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest font-black block">{tStr.diagnosticAnalysisLabel}</span>
                <p className="text-gray-400 font-mono italic break-all">"{moderationWarning.originalText.substring(0, 100)}..."</p>
                
                <div className="pt-2 border-t border-white/5 flex flex-wrap gap-1.5">
                  {moderationWarning.flaggedTerms.map((term, i) => (
                    <span key={i} className="text-[9px] font-mono bg-red-500/10 text-red-300 border border-red-500/25 px-2 py-0.5 rounded">
                      {term}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setModerationWarning(null)}
                  className="w-full py-2 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-xl text-xs font-bold border border-red-500/30 transition-all cursor-pointer font-title uppercase tracking-widest"
                >
                  {tStr.modifyPromptBtn}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW BUILDING DIALOG OVERLAY */}
      {showNewBuildingModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-[#12141c] border border-white/10 w-full max-w-md rounded-3xl p-6 shadow-2xl relative space-y-4">
            <button 
              onClick={() => setShowNewBuildingModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h4 className="font-title font-bold text-sm text-white">{tStr.createBldModalTitle}</h4>
              <p className="text-xs text-gray-400 mt-1">{tStr.createBldModalDesc}</p>
            </div>

            <form onSubmit={handleCreateBuildingGroup} className="space-y-3">
              <div>
                <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">{tStr.bldNameLabel}</label>
                <input
                  type="text"
                  placeholder={tStr.bldNamePlaceholder}
                  value={newBldName}
                  onChange={(e) => setNewBldName(e.target.value)}
                  required
                  className="w-full bg-[#161822] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">{tStr.bldAddressLabel}</label>
                <input
                  type="text"
                  placeholder={tStr.bldAddressPlaceholder}
                  value={newBldAddress}
                  onChange={(e) => setNewBldAddress(e.target.value)}
                  required
                  className="w-full bg-[#161822] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">{tStr.bldUnitsLabel}</label>
                  <input
                    type="number"
                    value={newBldUnits}
                    onChange={(e) => setNewBldUnits(e.target.value)}
                    required
                    className="w-full bg-[#161822] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">{tStr.bldSyndicLabel}</label>
                  <input
                    type="text"
                    placeholder={tStr.bldSyndicPlaceholder}
                    value={newBldSyndic}
                    onChange={(e) => setNewBldSyndic(e.target.value)}
                    className="w-full bg-[#161822] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#a16eff] hover:bg-[#a16eff]/80 text-white text-xs font-bold rounded-xl transition-all font-title uppercase tracking-wider"
              >
                {tStr.bldSubmitBtn}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
