import React, { useState } from 'react';
import CreditSimulator from './MyHome/CreditSimulator';
import ConciergeModule from './MyHome/ConciergeModule';
import { 
  Building, 
  Home, 
  Users, 
  FileText, 
  Phone, 
  Shield, 
  Plus, 
  Trash2, 
  Map, 
  Search, 
  Award, 
  Scale, 
  ExternalLink, 
  Lock, 
  AlertCircle, 
  Compass, 
  DollarSign, 
  Globe, 
  MapPin, 
  UserCheck,
  CheckCircle,
  Clock,
  Briefcase,
  ShoppingBag,
  Sparkles,
  Truck,
  Wrench,
  Calendar,
  Key
} from 'lucide-react';

// Define property representation
interface RealEstateOffer {
  id: string;
  title: string;
  description: string;
  priceMAD: number;
  areaSqm: number;
  rooms: number;
  type: 'APPARTEMENT' | 'VILLA' | 'TERRAIN' | 'STUDIO';
  city: string;
  district: string;
  isNewBuild: boolean;
  // UserGroup1 Promoter elements
  promoterName?: string;
  promoterContact?: string;
  promoterLogo?: string;
  // UserGroup2 Seller profile
  ownerId?: string;
  ownerName?: string;
  titleDeedNum: string; // Held only locally inside browser session
  titleDeedHash?: string; // Stored cryptographic hash
  zkpProofToken?: string; // Zero-Knowledge Proof token
  coordinates: { x: number; y: number }; // Relative coordinates on the map [0-100]
}

// Cryptographic simulation of SHA-256 for Zero-Knowledge Proof (ZKP) match to avoid holding sensitive land titles on server
export function computeTitleDeedHash(titleNum: string): { hash: string; zkpToken: string } {
  const clean = (titleNum || '').trim().replace(/\s+/g, '');
  let hashVal = 0;
  for (let i = 0; i < clean.length; i++) {
    hashVal = (hashVal << 5) - hashVal + clean.charCodeAt(i);
    hashVal = hashVal & hashVal; // 32-bit integer signature
  }
  const hex = Math.abs(hashVal).toString(16).padStart(8, '0');
  const hash = `0x${hex}eb581977fbc8${hex}53ef32f41b7d5ac8e2f`;
  const zkpToken = `zkp_proof_v2_1800_${hex.substring(0, 4)}_valid_sig_ef9108`;
  return { hash, zkpToken };
}

interface Notary {
  id: string;
  name: string;
  address: string;
  phone: string;
  city: string;
  rating: number;
  verified: boolean;
}

export interface HomeBusiness {
  id: string;
  name: string;
  category: 'FURNITURE' | 'DECO' | 'KITCHEN' | 'GARDENING' | 'SATELLITES'; // ameublement, déco, cuisinistes, jardinage, satellites
  cityZone: 'Casablanca' | 'Mohammedia' | 'Bouskoura' | 'Dar Bouazza';
  address: string;
  phone: string;
  rating: number;
  description: string;
  highlight: string; 
  services: string[]; 
  tags: string[];
}

const HOME_BUSINESSES: HomeBusiness[] = [
  {
    id: 'hb-1',
    name: "Roche Bobois - Showroom Casablanca",
    category: 'FURNITURE',
    cityZone: "Casablanca",
    address: "36 Boulevard d'Anfa, Gauthier, Casablanca",
    phone: "+212 522-390450",
    rating: 4.9,
    description: "Le leader mondial du mobilier de luxe et du design d'intérieur haut de gamme. Collections exclusives de canapés de créateur, tables à manger et dressings d'architectes célèbres.",
    highlight: "Showroom Signature de 1200 m²",
    services: ["Conseil d'architecte d'intérieur", "Simulation d'aménagement 3D", "Livraison & Installation"],
    tags: ["Luxe", "Design", "Canapé", "Salon", "Casablanca"]
  },
  {
    id: 'hb-2',
    name: "Arche de Noé - Ville Verte Rous",
    category: 'FURNITURE',
    cityZone: "Bouskoura",
    address: "Résidences de la Ville Verte, Lotissement 4, Bouskoura",
    phone: "+212 522-894120",
    rating: 4.8,
    description: "Spécialiste renommé du mobilier contemporain en bois massif noble de cèdre et chêne. Confort haut de gamme et finitions à la main adaptées aux grandes villas et appartements de Bouskoura.",
    highlight: "Ambiance Nature & Bois Massif Noble",
    services: ["Fabrication sur-mesure", "Garantie sérénité 5 ans", "Livraison Bouskoura offerte"],
    tags: ["Bois Massif", "Lit", "Chambre", "Bouskoura", "Contemporain"]
  },
  {
    id: 'hb-3',
    name: "Les Salons Magnifiques de Mohammedia",
    category: 'FURNITURE',
    cityZone: "Mohammedia",
    address: "Avenue des FAR, face au Parc des Villes Jumelées, Mohammedia",
    phone: "+212 523-324560",
    rating: 4.7,
    description: "Conception émérite de salons marocains traditionnels somptueusement revisités. Structures en bois de cèdre ciselé par des maîtres artisans et tissus velours damassés importés.",
    highlight: "Ciselure Traditionnelle Faite Main",
    services: ["Garnissage garantie 10 ans", "De devis gratuit", "Tissus de créateurs"],
    tags: ["Tradition", "Salon Marocain", "Cèdre", "Mohammedia"]
  },
  {
    id: 'hb-4',
    name: "Yasmine Outdoor Design & Patio",
    category: 'FURNITURE',
    cityZone: "Dar Bouazza",
    address: "Route d'Azemmour, Km 16, Dar Bouazza",
    phone: "+212 661-345091",
    rating: 4.6,
    description: "Mobilier de jardin d'exception adapté à l'air marin. Tables artisanales en teck résistant aux embruns côtiers, parasols géants déportés et canapés en cordages marins tressés.",
    highlight: "Teck Premium & Matériaux Hydrophobes",
    services: ["Stock de saison permanent", "Garantie anti-corrosion marine", "Installation à domicile"],
    tags: ["Outdoor", "Jardin", "Piscine", "Rotin", "Dar Bouazza"]
  },
  {
    id: 'hb-5',
    name: "Tapis Berbères d'Origine & Tableaux d'Art",
    category: 'DECO',
    cityZone: "Casablanca",
    address: "14 Rue Gauthier, Quartier Gauthier, Casablanca",
    phone: "+212 522-264580",
    rating: 4.9,
    description: "Galerie de prestige référençant des pièces uniques de l'artisanat marocain d'art. Importation directe de tapis tissés à la main auprès de coopératives de femmes du Moyen Atlas (Beni Ouarain et Taznakht).",
    highlight: "100% Laine Vierge Certifiée ONDA",
    services: ["Certificat d'authenticité", "Nettoyage traditionnel expert", "Essai possible chez vous"],
    tags: ["Beni Ouarain", "Tapis", "Berbère", "Casablanca", "Artisanat"]
  },
  {
    id: 'hb-6',
    name: "L'Atelier Décoratif & Éclairage Design",
    category: 'DECO',
    cityZone: "Mohammedia",
    address: "Boulevard Hassan II, Imm. Les Fleurs, Mohammedia",
    phone: "+212 523-305120",
    rating: 4.6,
    description: "Luminaires contemporains haut de gamme, miroirs biseautés design, papiers peints panoramiques et solutions écologiques de peintures à effets cirés ou sablés.",
    highlight: "Luminaires Connectés & Conseils Stylisme",
    services: ["Conseils d'harmonie colorée", "Pose de papier peint expert", "Garantie mécanique luminaires"],
    tags: ["Luminaire", "Miroir", "Peinture", "Mohammedia"]
  },
  {
    id: 'hb-7',
    name: "Schmidt Showroom de Cuisines Allemandes",
    category: 'KITCHEN',
    cityZone: "Casablanca",
    address: "185 Boulevard Zerktouni, Maârif, Casablanca",
    phone: "+212 522-481920",
    rating: 4.9,
    description: "Conception de cuisines intégrées allemandes premium avec solutions d'angle robotisées et dressings d'exception. Finitions irréprochables et matériaux garantis haute longévité.",
    highlight: "Cuisine Ergonomique & Intelligence de Rangement",
    services: ["Implantation 3D photoréaliste", "Mesures au laser chez vous", "Garantie pièces 10 ans"],
    tags: ["Premium", "Cuisine", "Dressing", "Zerktouni", "Schmidt"]
  },
  {
    id: 'hb-8',
    name: "Dar Kitchen & Marbre d'Extérieur",
    category: 'KITCHEN',
    cityZone: "Dar Bouazza",
    address: "Boulevard Moulay Abdellah, Dar Bouazza",
    phone: "+212 522-901840",
    rating: 4.7,
    description: "Concept exclusif de cuisines extérieures (Pool & Kitchen Hub) résistantes à l'oxydation côtière. Bar de marbre de Taza flammé et éviers de granit massif résistant aux taches.",
    highlight: "Plan en Granit Flammé Noir Anti-Taches",
    services: ["Modulaire 3D", "Éclairage LED d'extérieur étanche", "Garantie inox de classe marine"],
    tags: ["Outer Kitchen", "Béton Ciré", "Granit", "Dar Bouazza", "Piscine"]
  },
  {
    id: 'hb-9',
    name: "La Pépinière de la Forêt - Bouskoura",
    category: 'GARDENING',
    cityZone: "Bouskoura",
    address: "Route de la Forêt de Bouskoura, Bouskoura",
    phone: "+212 662-809140",
    rating: 4.9,
    description: "Le plus grand espace horticole de la Ville Verte. Vente de palmiers matures, d'oliviers d'ornement séculaires, d'arbustes fleuris méditerranéens et de gazon naturel d'excellente repousse.",
    highlight: "Pépinière de Co-Production Écologique",
    services: ["Étude d'aménagement paysager", "Arrosage goutte-goutte connecté", "Livraison plantes géantes"],
    tags: ["Horticulture", "Olivier", "Palmier", "Bouskoura", "Jardin"]
  },
  {
    id: 'hb-10',
    name: "L'Oasis Bleue Paysagiste",
    category: 'GARDENING',
    cityZone: "Dar Bouazza",
    address: "Avenue de l'Océan, Dar Bouazza",
    phone: "+212 664-981230",
    rating: 4.8,
    description: "Architectes paysagistes créateurs de jardins tropicaux et de patios minimalistes face à la plage. Conception de murets en pierre d'Anza, pergolas bioclimatiques et cascades murmureuses.",
    highlight: "Jardins de Sable & Conception Pergolas",
    services: ["Conception paysagère Assistée par Ordinateur", "Entretien hebdomadaire de piscine", "Systèmes connectés RainBird"],
    tags: ["Paysagiste", "Pergola", "Bassin", "Zen", "Dar Bouazza"]
  },
  {
    id: 'hb-11',
    name: "Domotique Casa Smart Home éco-énergie",
    category: 'SATELLITES',
    cityZone: "Casablanca",
    address: "Boulevard Rachidi, Centre-Ville, Casablanca",
    phone: "+212 522-205410",
    rating: 4.8,
    description: "Équipementier domotique de pointe intégrant des capteurs d'économie d'énergie, climatisation intelligente, contrôle centralisé par appli mobile et motorisation de volets.",
    highlight: "Protocole KNX & Économies d'Énergie Garanties",
    services: ["Audit énergétique de villa offert", "Support technique 24/7", "Garantie matérielle 3 ans"],
    tags: ["Domotique", "Smart Home", "Énergie", "Casablanca"]
  },
  {
    id: 'hb-12',
    name: "Maâlems du Zellige & Plâtres de Fès",
    category: 'SATELLITES',
    cityZone: "Bouskoura",
    address: "Zone d'Artisans, Bouskoura Ville Verte",
    phone: "+212 661-234588",
    rating: 4.9,
    description: "Atelier de Maâlems qualifiés assurant la pose rigoureuse de zellige authentique coupé à la main et de plâtres sculptés traditionnels géométriques ou floraux d'excellence royale.",
    highlight: "Artisans d'Art Agréés par le Ministère",
    services: ["Façonnage artisanal de Fès", "Restauration d'intérieurs d'exception", "Devis 48H"],
    tags: ["Zellige", "Artisanat d'Art", "Plâtre", "Bouskoura"]
  }
];

export default function MyHome({ currentLang = 'FR', defaultSubTab = 'IMMO' }: { currentLang: string; defaultSubTab?: 'RESIDENCE' | 'CONCIERGE' | 'HOST' | 'LOCAL' | 'IMMO' }) {
  // Sub-tab selection for MyHome: CONCIERGE, LOCAL, IMMO
  const [myHomeSubTab, setMyHomeSubTab] = useState<'CONCIERGE' | 'LOCAL' | 'IMMO'>(
    defaultSubTab === 'CONCIERGE' || defaultSubTab === 'LOCAL' || defaultSubTab === 'IMMO'
      ? defaultSubTab
      : 'IMMO'
  );
  const [simPropertyPrice, setSimPropertyPrice] = useState<number>(2000000);
  const [businessSearch, setBusinessSearch] = useState('');
  const [selectedBusinessCategory, setSelectedBusinessCategory] = useState<string>('ALL');
  const [selectedBusinessCity, setSelectedBusinessCity] = useState<string>('ALL');
  const [selectedBusiness, setSelectedBusiness] = useState<any | null>(null);
  const [showNotaireModal, setShowNotaireModal] = useState(false);

  // MyImmo Sub-tabs: BUY (Purchase/Sale) vs RENT (Rental & B'n'B)
  const [immoTab, setImmoTab] = useState<'BUY' | 'RENT'>('BUY');

  // Rentals / B'n'B offer representation
  interface RentalOffer {
    id: string;
    title: string;
    description: string;
    priceValue: number; // Nightly price for SHORT, Monthly price for LONG
    type: 'SHORT' | 'LONG';  // SHORT = B'n'B / Courte durée, LONG = Location Longue Durée
    propertyType: 'APPARTEMENT' | 'VILLA' | 'STUDIO';
    district: string;
    areaSqm: number;
    rooms: number;
    ownerName: string;
    ownerContact: string;
    verifiedMyHost: boolean;
  }

  // Initial Rentals / B'n'B listings
  const [rentalOffers, setRentalOffers] = useState<RentalOffer[]>([
    {
      id: 'rent-1',
      title: "Magnifique Loft Face Mer - B'n'B Sunset",
      description: "Profitez d'un séjour inoubliable dans ce loft haut de gamme avec vue panoramique sur l'océan Atlantique. Idéal pour séjours d'affaires ou vacances courtes. Wifi haut débit par fibre optique, climatisation intégrale.",
      priceValue: 950,
      type: 'SHORT',
      propertyType: 'APPARTEMENT',
      district: "Anfa",
      areaSqm: 75,
      rooms: 1,
      ownerName: "Youssef Bennani",
      ownerContact: "+212 661-344910",
      verifiedMyHost: true,
    },
    {
      id: 'rent-2',
      title: "Appartement d'Architecte - Longue Durée Gauthier",
      description: "Très bel appartement non-meublé pour longue durée dans un immeuble moderne résidentiel hautement sécurisé. Cuisine haut de gamme ouverte en marbre, balcon filant de 12m, deux places de parking titrées.",
      priceValue: 12500,
      type: 'LONG',
      propertyType: 'APPARTEMENT',
      district: "Gauthier",
      areaSqm: 110,
      rooms: 3,
      ownerName: "Laila El Alami",
      ownerContact: "+212 663-911802",
      verifiedMyHost: true,
    },
    {
      id: 'rent-3',
      title: "Studio Cozy Moderne - Près Clinique du Val",
      description: "Charmant studio moderne entièrement équipé et géré via le pass intelligent MyHost (Keyless check-in). Idéal pour courte durée ou transit professionnel. Propreté impeccable garantie.",
      priceValue: 550,
      type: 'SHORT',
      propertyType: 'STUDIO',
      district: "Maârif",
      areaSqm: 45,
      rooms: 1,
      ownerName: "Karim Guessous",
      ownerContact: "+212 662-774021",
      verifiedMyHost: true,
    },
    {
      id: 'rent-4',
      title: "Villa Privative d'exception - Bouskoura Golf Resort",
      description: "Exceptionnelle villa en courte durée aux abords du complexe golfique de la Ville Verte. Piscine chauffée, personnel de maison disponible sous option, tranquillité absolue et green d'exception.",
      priceValue: 3500,
      type: 'SHORT',
      propertyType: 'VILLA',
      district: "Bouskoura",
      areaSqm: 380,
      rooms: 4,
      ownerName: "Fadel Slaoui",
      ownerContact: "+212 654-200900",
      verifiedMyHost: false,
    }
  ]);

  // Booking states
  const [selectedRentalForBooking, setSelectedRentalForBooking] = useState<RentalOffer | null>(null);
  const [bookingCheckIn, setBookingCheckIn] = useState<string>('');
  const [bookingCheckOut, setBookingCheckOut] = useState<string>('');
  const [bookingGuests, setBookingGuests] = useState<number>(2);
  const [bookingDuration, setBookingDuration] = useState<number>(3); // days for short, months for long
  const [bookingTenantName, setBookingTenantName] = useState<string>('Amin Charafi');
  const [bookingTenantEmail, setBookingTenantEmail] = useState<string>('amin.charafi@gmail.com');
  const [bookingSuccessData, setBookingSuccessData] = useState<any | null>(null);

  // New rental listing state (MyHost deployment form)
  const [newRentTitle, setNewRentTitle] = useState('');
  const [newRentDesc, setNewRentDesc] = useState('');
  const [newRentPrice, setNewRentPrice] = useState('');
  const [newRentType, setNewRentType] = useState<'SHORT' | 'LONG'>('SHORT');
  const [newRentPropertyType, setNewRentPropertyType] = useState<'APPARTEMENT' | 'VILLA' | 'STUDIO'>('APPARTEMENT');
  const [newRentDistrict, setNewRentDistrict] = useState('Anfa');
  const [newRentArea, setNewRentArea] = useState('');
  const [newRentRooms, setNewRentRooms] = useState('2');
  const [newRentVerifiedHostFlag, setNewRentVerifiedHostFlag] = useState<boolean>(true);

  // Account Roles for Simulation
  // UserGroup1: Promoteurs immobilliers professionnels (ImmoPro Account)
  // UserGroup2: Tous comptes utilisateurs / MarketPlace non-neuf (Limit: 1 listing)
  const [userRole, setUserRole] = useState<'IMMO_PRO' | 'CITIZEN'>('IMMO_PRO');
  const [currentUserListingsCount, setCurrentUserListingsCount] = useState<number>(0);
  const [currentUserRentalsCount, setCurrentUserRentalsCount] = useState<number>(0);

  // Pro promoter profile definition (UserGroup1)
  const proProfile = {
    name: "Yasmine Luxury Properties",
    contact: "+212 522-894512",
    logoText: "YLP",
    logoColor: "from-amber-500 to-yellow-600"
  };

  // Citizen profile definition (UserGroup2)
  const citizenProfile = {
    name: "Mohamed El Alami",
    contact: "+212 661-423590",
  };

  // Pre-seed Listings Database conforme aux lois marocaines (e.g. price, area, title deed)
  const [listings, setListings] = useState<RealEstateOffer[]>(() => [
    {
      id: 'lst-1',
      title: "Appartement de Prestige avec vue mer - Anfa",
      description: "Magnifique F4 luxueusement meublé situé au coeur du quartier branché d'Anfa. Résidence gardée 24/7 avec piscine collective. Climatisation centralisée, marbre au sol, cuisine équipée allemande.",
      priceMAD: 3200000,
      areaSqm: 124,
      rooms: 3,
      type: 'APPARTEMENT',
      city: "Casablanca",
      district: "Anfa",
      isNewBuild: true,
      promoterName: "Anfa Real Estate Promoteur",
      promoterContact: "+212 522-950201",
      promoterLogo: "ARE",
      titleDeedNum: "95123/26",
      coordinates: { x: 32, y: 35 }
    },
    {
      id: 'lst-2',
      title: "Villa Contemporaine de Maître - California",
      description: "Prestation haut de gamme pour cette villa neuve de 5 suites parentales. Grand jardin arboré avec piscine privative à débordement. Double salon avec baies vitrées de 5 mètres thermiques conformes aux normes thermiques.",
      priceMAD: 8900000,
      areaSqm: 410,
      rooms: 5,
      type: 'VILLA',
      city: "Casablanca",
      district: "California",
      isNewBuild: true,
      promoterName: "Casablanca Prom Lux",
      promoterContact: "+212 522-100200",
      promoterLogo: "CPL",
      titleDeedNum: "108542/26",
      coordinates: { x: 58, y: 68 }
    },
    {
      id: 'lst-3',
      title: "Studio Meublé Moderne - Maârif Extension",
      description: "Studio d'occasion parfait pour investissement locatif ou pied-à-terre. Très bon rendement dans un immeuble récent de moins de 5 ans. Vendu meublé avec place de garage titrée.",
      priceMAD: 950000,
      areaSqm: 52,
      rooms: 1,
      type: 'STUDIO',
      city: "Casablanca",
      district: "Maârif",
      isNewBuild: false,
      ownerName: "Amine Charafi (Particulier)",
      ownerId: "user-1",
      promoterContact: "+212 662-300150",
      titleDeedNum: "85231/26",
      coordinates: { x: 45, y: 56 }
    },
    {
      id: 'lst-4',
      title: "Duplex Lumineux rénové - Gauthier",
      description: "Splendide duplex de charme avec double exposition et terrasse de 25m2. Rénovation complète effectuée en 2025. Cheminée en fonction, parquet massif, deux places de parking titrées en sous-sol.",
      priceMAD: 2450000,
      areaSqm: 145,
      rooms: 4,
      type: 'APPARTEMENT',
      city: "Casablanca",
      district: "Gauthier",
      isNewBuild: false,
      ownerName: "Fatim-Zahra Bennani",
      ownerId: "user-2",
      promoterContact: "+212 665-980120",
      titleDeedNum: "45321/26",
      coordinates: { x: 38, y: 48 }
    }
  ].map(item => {
    const crypto = computeTitleDeedHash(item.titleDeedNum);
    return {
      ...item,
      titleDeedHash: crypto.hash,
      zkpProofToken: crypto.zkpToken
    } as RealEstateOffer;
  }));

  // List of registered notaries for validation of transactions
  const defaultNotaries: Notary[] = [
    { id: 'not-1', name: "Maître Amina Bennani", address: "82 Boulevard d'Anfa, 3ème étage, Casablanca", phone: "+212 522-263015", city: "Casablanca", rating: 4.9, verified: true },
    { id: 'not-2', name: "Maître Kamal El Alami", address: "14 Rue de Goulmima, Gauthier, Casablanca", phone: "+212 522-489022", city: "Casablanca", rating: 4.8, verified: true },
    { id: 'not-3', name: "Maître Ghita Slimani", address: "115 Boulevard Zerktouni, face Twin Center", phone: "+212 522-311540", city: "Casablanca", rating: 4.7, verified: true },
    { id: 'not-4', name: "Maître Omar Slaoui", address: "44 Avenue 2 Mars, Casablanca", phone: "+212 522-814030", city: "Casablanca", rating: 4.6, verified: false }
  ];

  // Forms and details interaction state
  const [selectedOffer, setSelectedOffer] = useState<RealEstateOffer | null>(null);
  const [searchDistrict, setSearchDistrict] = useState<string>('');
  const [searchType, setSearchType] = useState<string>('ALL');
  const [searchCondition, setSearchCondition] = useState<string>('ALL'); // NEW vs SECOND-HAND

  // Property addition form
  const [newPropTitle, setNewPropTitle] = useState('');
  const [newPropDesc, setNewPropDesc] = useState('');
  const [newPropPrice, setNewPropPrice] = useState('');
  const [newPropArea, setNewPropArea] = useState('');
  const [newPropRooms, setNewPropRooms] = useState('2');
  const [newPropType, setNewPropType] = useState<'APPARTEMENT' | 'VILLA' | 'TERRAIN' | 'STUDIO'>('APPARTEMENT');
  const [newPropDistrict, setNewPropDistrict] = useState('Anfa');
  const [newPropDeed, setNewPropDeed] = useState('');
  const [newPropIsNew, setNewPropIsNew] = useState<boolean>(true);

  // Cadastre simulation tool
  const [cadastreTitleNum, setCadastreTitleNum] = useState('');
  const [cadastreStatusResult, setCadastreStatusResult] = useState<{
    success: boolean;
    titleNum: string;
    owner: string;
    area: number;
    encumbrances: string;
    authenticityDate: string;
    titleDeedHash?: string;
    zkpProofToken?: string;
  } | null>(null);

  // Agence Urbaine simulation tool
  const [urbanNoteDistrict, setUrbanNoteDistrict] = useState('Anfa');
  const [urbanNotePlot, setUrbanNotePlot] = useState('');
  const [urbanNoteResult, setUrbanNoteResult] = useState<{
    success: boolean;
    district: string;
    zoningCode: string;
    maxHeight: string;
    cos: number; // Coefficient d'occupation du sol
    ces: number; // Coefficient d'emprise au sol
    restrictions: string;
  } | null>(null);

  // Filter state for Rentals / B'n'B
  const [rentFilter, setRentFilter] = useState<'ALL' | 'SHORT' | 'LONG'>('ALL');

  // Publish dynamic rental to the local feed
  const handlePublishRental = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRentTitle || !newRentPrice || !newRentArea) {
      alert("Erreur: Veuillez remplir tous les champs obligatoires.");
      return;
    }

    // HARD CONDITION verification: 1 rental listing per user account for citizen (anti-spam)
    if (userRole === 'CITIZEN' && currentUserRentalsCount >= 1) {
      alert("⚠️ Limitation Résidente Anti-Spam: Dans le cadre des normes de protection d'utilisation MyHost, les comptes citoyens/particuliers sont strictement limités à 1 offre en location active à la fois. Passez en mode Promoteur Professionnel dans l'entête pour bénéficier d'un quota de location pro illimité.");
      return;
    }

    const price = parseFloat(newRentPrice);
    const area = parseFloat(newRentArea);
    if (isNaN(price) || isNaN(area)) {
      alert("Erreur: Le prix et la surface doivent être des valeurs numériques.");
      return;
    }

    const newOffer: RentalOffer = {
      id: `rent-custom-${Date.now()}`,
      title: newRentTitle,
      description: newRentDesc || "Aucune description supplémentaire fournie.",
      priceValue: price,
      type: newRentType,
      propertyType: newRentPropertyType,
      district: newRentDistrict,
      areaSqm: area,
      rooms: parseInt(newRentRooms),
      ownerName: userRole === 'IMMO_PRO' ? proProfile.name : citizenProfile.name,
      ownerContact: userRole === 'IMMO_PRO' ? proProfile.contact : citizenProfile.contact,
      verifiedMyHost: newRentVerifiedHostFlag
    };

    setRentalOffers(prev => [newOffer, ...prev]);
    if (userRole === 'CITIZEN') {
      setCurrentUserRentalsCount(prev => prev + 1);
    }
    alert(`🎉 Succès ! Votre logement a été enregistré avec succès et déployé sur MyHost !\nIl est maintenant disponible à la réservation en direct par nos utilisateurs.`);
    
    // Reset state
    setNewRentTitle('');
    setNewRentDesc('');
    setNewRentPrice('');
    setNewRentArea('');
  };

  // Confirm booking action
  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRentalForBooking) return;
    
    const isShort = selectedRentalForBooking.type === 'SHORT';
    const totalAmount = selectedRentalForBooking.priceValue * bookingDuration;
    
    // Generate a random smart lock PIN
    const rawPin = Math.floor(1000 + Math.random() * 9000);
    const pinCode = `*#${rawPin}#`;
    const resRef = `RES-MH-${Math.floor(100000 + Math.random() * 900000)}`;

    setBookingSuccessData({
      ref: resRef,
      propertyTitle: selectedRentalForBooking.title,
      propertyDistrict: selectedRentalForBooking.district,
      type: selectedRentalForBooking.type,
      tenantName: bookingTenantName,
      tenantEmail: bookingTenantEmail,
      checkIn: bookingCheckIn || (isShort ? "Aujourd'hui" : "Créneau 1er du mois"),
      guests: bookingGuests,
      duration: bookingDuration,
      totalAmount,
      pinCode,
      ownerContact: selectedRentalForBooking.ownerContact
    });
  };

  // Anti-spam checking rule
  const handleAddProperty = (e: React.FormEvent) => {
    e.preventDefault();

    // Check blank validations
    if (!newPropTitle || !newPropPrice || !newPropArea || !newPropDeed) {
      alert("Erreur: Veuillez remplir tous les champs obligatoires, y compris le numéro de Titre Foncier.");
      return;
    }

    // HARD CONDITION verification: 1 listing per user account for civilian marketplace (No spamming)
    if (userRole === 'CITIZEN' && currentUserListingsCount >= 1) {
      alert("⚠️ Limitation Résidente Anti-Spam: Dans le cadre des normes de protection d'utilisation MyHome, les comptes citoyens/particuliers sont strictement limités à 1 annonce active à la fois. Passez en mode Promoteur Professionnel dans l'entête pour bénéficier d'un quota de publication pro.");
      return;
    }

    const price = parseFloat(newPropPrice);
    const area = parseFloat(newPropArea);

    if (isNaN(price) || isNaN(area)) {
      alert("Erreur: Le prix et la surface doivent être des valeurs numériques.");
      return;
    }

    // Cryptographically hash the title deed as part of our Zero-Knowledge Proof (ZKP) pipeline
    // MyCity never stores the raw land title on its central server to mitigate legal/data privacy risks
    const crypto = computeTitleDeedHash(newPropDeed);

    // Create property object
    const newOffer: RealEstateOffer = {
      id: `lst-custom-${Date.now()}`,
      title: newPropTitle,
      description: newPropDesc,
      priceMAD: price,
      areaSqm: area,
      rooms: parseInt(newPropRooms),
      type: newPropType,
      city: "Casablanca",
      district: newPropDistrict,
      isNewBuild: userRole === 'IMMO_PRO' ? newPropIsNew : false, // Particuliers sell non-neuf
      titleDeedNum: `${newPropDeed.substring(0, Math.min(newPropDeed.length, 3))}**/*** (Souverain Masqué)`,
      titleDeedHash: crypto.hash,
      zkpProofToken: crypto.zkpToken,
      coordinates: { x: 30 + Math.random() * 40, y: 30 + Math.random() * 40 } // random placing inside carto area
    };

    if (userRole === 'IMMO_PRO') {
      newOffer.promoterName = proProfile.name;
      newOffer.promoterContact = proProfile.contact;
      newOffer.promoterLogo = proProfile.logoText;
    } else {
      newOffer.ownerName = citizenProfile.name;
      newOffer.ownerId = "citizen-main";
      newOffer.promoterContact = citizenProfile.contact;
      setCurrentUserListingsCount(prev => prev + 1);
    }

    setListings(prev => [newOffer, ...prev]);
    alert(`🎉 Succès ! Votre annonce immobilière a été dûment validée aux normes de la loi marocaine de protection des consommateurs.\n\n🛡️ COMPLIANCE LOI 18-00 & ANCFCC :\nAucun Titre Foncier en clair n'est hébergé. MyCity a uniquement enregistré l'empreinte numérique sécurisée (ZKP) :\n${crypto.hash}\n\nL'intégrité de la transaction est garantie sans risque légal de fuite.`);
    
    // Clear inputs
    setNewPropTitle('');
    setNewPropDesc('');
    setNewPropPrice('');
    setNewPropArea('');
    setNewPropDeed('');
  };

  const handleDeleteListing = (id: string, isCitizen: boolean) => {
    setListings(prev => prev.filter(l => l.id !== id));
    if (isCitizen) {
      setCurrentUserListingsCount(prev => Math.max(0, prev - 1));
    }
  };

  // Simulating the Cadastre (ANCFCC) registry inquiry with local browser-only matching
  const handleQueryCadastre = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cadastreTitleNum.trim()) return;

    // Simulation mapping
    const cleanNum = cadastreTitleNum.trim();
    const isRealistic = /^\d+\/\d+$/.test(cleanNum);
    const crypto = computeTitleDeedHash(cleanNum);

    setCadastreStatusResult({
      success: true,
      titleNum: `${cleanNum.substring(0, Math.min(cleanNum.length, 3))}**/*** (Souverain Masqué)`,
      owner: isRealistic ? "Société Foncière Marocaine / M. El Alami" : "Hoirs de Feu Bennani",
      area: isRealistic ? 184 : 450,
      encumbrances: isRealistic ? "Aucun privilège ni hypothèque inscrite. Libre de cession" : "Hypothèque légale bancaire active (Crédit Immobilier et Hôtelier)",
      authenticityDate: new Date().toLocaleDateString('fr-FR'),
      titleDeedHash: crypto.hash,
      zkpProofToken: crypto.zkpToken
    });
  };

  // Simulating the Agence Urbaine Casablanca (AUC) planning check
  const handleQueryUrbanPlanning = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urbanNotePlot.trim()) return;

    const code = urbanNoteDistrict === 'Anfa' ? 'D2-R+5' : urbanNoteDistrict === 'California' ? 'V-S1' : 'C-R+4';
    const height = urbanNoteDistrict === 'Anfa' ? '18.5 mètres (Rez-de-chaussée + 5 étages)' : urbanNoteDistrict === 'California' ? '8.5 mètres (Villa R+1)' : '15.0 mètres (R+4)';
    const cosVal = urbanNoteDistrict === 'Anfa' ? 3.2 : urbanNoteDistrict === 'California' ? 0.6 : 2.4;
    const cesVal = urbanNoteDistrict === 'Anfa' ? 0.6 : urbanNoteDistrict === 'California' ? 0.4 : 0.5;

    setUrbanNoteResult({
      success: true,
      district: urbanNoteDistrict,
      zoningCode: code,
      maxHeight: height,
      cos: cosVal,
      ces: cesVal,
      restrictions: urbanNoteDistrict === 'Anfa' 
        ? "Implantation sur alignement de rue obligatoire. Sous-sol parking obligatoire sous peine d'amende foncière de 50 000 MAD."
        : "Zone villas exclusivement résidentielle à faible densité. Retrait d'au moins 5 mètres requis de toutes les clôtures mitoyennes."
    });
  };

  // Listings filtering logic
  const filteredListings = listings.filter(item => {
    const matchesDistrict = searchDistrict === '' || item.district.toLowerCase().includes(searchDistrict.toLowerCase());
    const matchesType = searchType === 'ALL' || item.type === searchType;
    const matchesCondition = searchCondition === 'ALL' || 
                             (searchCondition === 'NEW' && item.isNewBuild) ||
                             (searchCondition === 'USED' && !item.isNewBuild);
    return matchesDistrict && matchesType && matchesCondition;
  });

  return (
    <div id="myhome-container" className="space-y-6">
      
      {/* Simulation Command Center Bar */}
      <div id="myhome-sim-header" className="bg-[#1a1d29]/90 border border-[#a16eff]/30 p-4 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] font-mono text-[#a16eff] uppercase tracking-widest font-black block">MyHome - Authentification Utilisateur</span>
          <h4 className="text-xs font-bold text-white uppercase mt-0.5">Permuter l'identité de simulation de listing :</h4>
          <p className="text-[10px] text-gray-400 mt-1">Conforme à la condition stricte anti-spam (Max 1 annonce pour particuliers).</p>
        </div>
        
        <div className="flex gap-2">
          <button
            id="role-immo-pro-btn"
            onClick={() => setUserRole('IMMO_PRO')}
            className={`px-4 py-2 rounded-xl border text-xs font-bold font-title flex items-center gap-2 transition-all cursor-pointer ${
              userRole === 'IMMO_PRO'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white border-amber-400 shadow-md shadow-amber-500/10'
                : 'bg-transparent text-gray-400 border-white/5 hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Group 1: ImmoPro (Promoteur)</span>
          </button>
          
          <button
            id="role-citizen-btn"
            onClick={() => setUserRole('CITIZEN')}
            className={`px-4 py-2 rounded-xl border text-xs font-bold font-title flex items-center gap-2 transition-all cursor-pointer ${
              userRole === 'CITIZEN'
                ? 'bg-[#a16eff] text-white border-[#a16eff] shadow-md'
                : 'bg-transparent text-gray-400 border-white/5 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Group 2: Particulier (MarketPlace)</span>
          </button>
        </div>
      </div>

      {/* Header Profile for User Group 1 / User Group 2 */}
      <div id="myhome-banner-profile" className="bg-[#161821] border border-white/5 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
        {userRole === 'IMMO_PRO' ? (
          <>
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${proProfile.logoColor} flex items-center justify-center font-title font-black text-xl text-black shadow-lg`}>
                {proProfile.logoText}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-black tracking-widest uppercase">Promoteur Agréé</span>
                  <span className="font-mono text-[9px] bg-sky-500/10 text-sky-400 border border-sky-500/10 px-2 py-0.5 rounded font-bold uppercase">Loi 31-08 Conforme</span>
                </div>
                <h3 className="font-title font-bold text-base text-white">{proProfile.name}</h3>
                <p className="text-xs text-gray-400">Directeur de comptes promoteurs : <b>Yasmine Mansouri</b></p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 font-mono text-xs">
              <span className="text-gray-500">Contact d'Agence Immobilière :</span>
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> {proProfile.contact}
              </span>
              <div className="text-[10px] text-gray-500 mt-1">
                Portefeuille Actif : <span className="text-amber-400 font-bold">Illimité (Multi-bien)</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#a16eff]/10 border border-[#a16eff]/20 flex items-center justify-center font-title font-black text-xl text-white shadow-lg">
                ME
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded font-black tracking-widest uppercase">Compte Particulier</span>
                  <span className="font-mono text-[9px] bg-red-500/10 text-red-400 border border-red-500/10 px-2 py-0.5 rounded font-bold uppercase">Max 1 annonce / type</span>
                </div>
                <h3 className="font-title font-bold text-base text-white">{citizenProfile.name}</h3>
                <p className="text-xs text-gray-400">Actif sur le forum et la marketplace non-neuf de Casablanca.</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 font-mono text-xs">
              <span className="text-gray-500">Contact personnel vérifié :</span>
              <span className="text-[#a16eff] font-black flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> {citizenProfile.contact}
              </span>
              <div className="text-[10px] text-gray-400 mt-1 flex flex-col items-end gap-0.5">
                <span>Ventes actives : <span className="text-white font-bold">{currentUserListingsCount} / 1</span></span>
                <span>Locations actives : <span className="text-white font-bold">{currentUserRentalsCount} / 1</span></span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main Sub-Tabs Selector inside MyHome */}
      <div className="flex bg-[#12141c]/90 border border-white/5 p-1 rounded-2xl gap-1 max-w-xl mx-auto shadow-md mb-6">
        <button
          onClick={() => setMyHomeSubTab('IMMO')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            myHomeSubTab === 'IMMO' 
              ? 'bg-[#a16eff] text-white shadow-lg' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>🔑 MyImmo</span>
        </button>
        <button
          onClick={() => setMyHomeSubTab('CONCIERGE')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            myHomeSubTab === 'CONCIERGE' 
              ? 'bg-[#a16eff] text-white shadow-lg' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>🛠️ MyServices</span>
        </button>
        <button
          onClick={() => setMyHomeSubTab('LOCAL')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            myHomeSubTab === 'LOCAL' 
              ? 'bg-[#a16eff] text-white shadow-lg' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>🛒 Showrooms Déco</span>
        </button>
      </div>

      {/* Conditional Rendering of MyHome sections */}
      {myHomeSubTab === 'CONCIERGE' && <ConciergeModule currentLang={currentLang} />}

      {myHomeSubTab === 'LOCAL' && (
        <div className="space-y-6 animate-fade-in" id="myhome-business-portal">
          {/* Header Card for Business Portal */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#12141c] via-[#161a29] to-[#0d0f17] border border-white/5 rounded-3xl p-6 md:p-8 shadow-xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#a16eff]/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -ml-16 -mb-16" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#a16eff]/15 border border-[#a16eff]/20 text-[#BEB3FF] text-xs font-bold font-mono rounded-full uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  Réseau d'Experts Habitat
                </div>
                <h1 className="text-xl md:text-2xl font-black font-title text-white tracking-tight leading-tight mt-1">
                  🛒 Commerces & Showrooms de la Maison
                </h1>
                <p className="text-gray-400 text-xs md:text-sm max-w-2xl leading-relaxed">
                  Trouvez les meilleurs showrooms d'ameublement contemporain, décoration d'art traditionnel, cuisinistes d'élite, pépiniéristes et artisans marbriers à Casablanca, Mohammedia, Bouskoura et Dar Bouazza.
                </p>
              </div>
            </div>
          </div>

          {/* Search bar + filters for Businesses */}
          <div className="bg-[#12141c]/80 border border-white/5 p-4 rounded-2xl flex flex-col md:flex-row gap-3 items-center shadow-lg">
            <div className="relative w-full flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Rechercher canapé, tapis Beni Ouarain, dressing, paysagiste, plâtrier, zellige..."
                value={businessSearch}
                onChange={(e) => setBusinessSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/5 hover:border-white/10 focus:border-[#a16eff]/50 text-white rounded-xl text-xs font-mono placeholder-gray-500 outline-none transition-colors"
                id="business-search-input"
              />
            </div>

            {/* City zone selector */}
            <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
              <Map className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              <select
                value={selectedBusinessCity}
                onChange={(e) => setSelectedBusinessCity(e.target.value)}
                className="w-full md:w-44 px-3 py-2 bg-black/40 border border-white/5 text-gray-300 rounded-xl text-xs font-mono outline-none cursor-pointer"
              >
                <option value="ALL">Grand Casablanca (Toutes)</option>
                <option value="Casablanca">Casablanca Centre</option>
                <option value="Mohammedia">Mohammedia</option>
                <option value="Bouskoura">Bouskoura Ville Verte</option>
                <option value="Dar Bouazza">Dar Bouazza Littoral</option>
              </select>
            </div>
          </div>

          {/* Categories Tab Selector */}
          <div className="flex flex-wrap gap-2 justify-center border-b border-white/5 pb-4">
            {[
              { id: 'ALL', label: 'Tout voir 📋' },
              { id: 'FURNITURE', label: '🪑 Ameublement & Mobilier' },
              { id: 'DECO', label: '🪴 Design & Décoration' },
              { id: 'KITCHEN', label: '🍳 Cuisines & Cuisinistes' },
              { id: 'GARDENING', label: '🌳 Jardinage & Aménagements' },
              { id: 'SATELLITES', label: '⚡ Experts & Satellites Domotique' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedBusinessCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  selectedBusinessCategory === cat.id
                    ? 'bg-[#a16eff] text-white border-[#a16eff] shadow-lg shadow-[#a16eff]/20'
                    : 'bg-black/20 text-gray-400 border-white/5 hover:text-white hover:bg-black/40'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Business Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {HOME_BUSINESSES.filter(biz => {
              const matchesSearch = biz.name.toLowerCase().includes(businessSearch.toLowerCase()) ||
                                    biz.description.toLowerCase().includes(businessSearch.toLowerCase()) ||
                                    biz.tags.some(t => t.toLowerCase().includes(businessSearch.toLowerCase()));
              const matchesCategory = selectedBusinessCategory === 'ALL' || biz.category === selectedBusinessCategory;
              const matchesCity = selectedBusinessCity === 'ALL' || biz.cityZone === selectedBusinessCity;
              return matchesSearch && matchesCategory && matchesCity;
            }).map(biz => (
              <div
                key={biz.id}
                className="bg-[#161821] border border-white/5 hover:border-[#a16eff]/40 p-5 rounded-2xl flex flex-col justify-between transition-all duration-300 shadow-xl group relative overflow-hidden"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="text-[10px] font-mono uppercase bg-[#a16eff]/15 text-[#9E8BFF] px-2 py-0.5 rounded border border-[#a16eff]/10 font-bold">
                      {biz.category === 'FURNITURE' && "Ameublement"}
                      {biz.category === 'DECO' && "Décoration d'Art"}
                      {biz.category === 'KITCHEN' && "Cuisiniste d'Art"}
                      {biz.category === 'GARDENING' && "Jardin & Extérieurs"}
                      {biz.category === 'SATELLITES' && "Artisans & Domotique"}
                    </span>
                    <span className="text-yellow-400 font-mono text-xs font-bold">⭐ {biz.rating.toFixed(1)}</span>
                  </div>

                  <h3 className="font-title font-black text-sm text-white mt-1 group-hover:text-[#9E8BFF] transition-colors">
                    {biz.name}
                  </h3>

                  <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-mono mt-2">
                    <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span><b>[{biz.cityZone}]</b> {biz.address}</span>
                  </div>

                  <p className="text-gray-400 text-xs mt-3 line-clamp-3 leading-relaxed">
                    {biz.description}
                  </p>

                  <div className="mt-3 py-1 bg-black/10 px-2.5 rounded-lg border border-white/5 flex items-center justify-between text-[10.5px] font-mono text-emerald-300">
                    <span className="text-gray-400 font-sans">Atout-phare :</span>
                    <span className="font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#9E8BFF] animate-pulse" /> {biz.highlight}
                    </span>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5 mt-3.5">
                    {biz.tags.map(tag => (
                      <span key={tag} className="text-[9px] font-mono text-gray-500 bg-white/5 border border-white/5 px-2 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/5 mt-5 pt-4 flex gap-2">
                  <button
                    onClick={() => setSelectedBusiness(biz)}
                    className="w-full py-2 bg-[#a16eff]/15 hover:bg-[#a16eff] text-white hover:text-white border border-[#a16eff]/20 rounded-xl text-xs font-bold transition-all cursor-pointer text-center block font-title"
                  >
                    🤝 Voir Showroom & Services
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {myHomeSubTab === 'IMMO' && (
        <div id="myimmo-wrapper" className="space-y-6 animate-fade-in">
          
          {/* Subtab Selector for Buy vs Rent */}
          <div className="bg-[#12141c]/80 border border-white/5 p-1 rounded-2xl flex max-w-sm gap-1">
            <button
              id="immo-buy-tab-btn"
              onClick={() => setImmoTab('BUY')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                immoTab === 'BUY'
                  ? 'bg-gradient-to-r from-emerald-500/10 to-[#a16eff]/20 border border-[#a16eff]/30 text-white shadow shadow-emerald-500/10 font-extrabold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Building className="w-3.5 h-3.5 text-emerald-400" />
              <span>Achat / Vente Directe</span>
            </button>
            <button
              id="immo-rent-tab-btn"
              onClick={() => setImmoTab('RENT')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                immoTab === 'RENT'
                  ? 'bg-gradient-to-r from-purple-500/10 to-[#a16eff]/25 border border-[#a16eff]/30 text-white shadow shadow-purple-500/10 font-extrabold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Home className="w-3.5 h-3.5 text-purple-400" />
              <span>Location / B'n'B (MyHost)</span>
            </button>
          </div>

          {immoTab === 'BUY' ? (
            <div id="myhome-grid" className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Listing Feed and Interactive Search */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Search filters panel */}
          <div className="bg-[#161821] p-4 rounded-2xl border border-white/5 flex flex-wrap gap-3 items-center">
            
            <div className="relative flex-1 min-w-[160px]">
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Ex: Anfa, Gauthier, Maârif..."
                value={searchDistrict}
                onChange={(e) => setSearchDistrict(e.target.value)}
                className="w-full bg-[#1c1f2b] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white text-xs placeholder:text-gray-500 outline-none focus:border-[#a16eff]"
              />
            </div>

            <div className="relative min-w-[140px]">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="appearance-none w-full bg-[#1c1f2b] border border-white/10 rounded-xl px-3 py-2 pr-8 text-white text-xs outline-none cursor-pointer focus:border-[#a16eff]"
              >
                <option value="ALL">Tous les types</option>
                <option value="APPARTEMENT">🏢 Appartements</option>
                <option value="VILLA">🏡 Villas</option>
                <option value="TERRAIN">🌱 Terrains</option>
                <option value="STUDIO">📐 Studios</option>
              </select>
            </div>

            <div className="relative min-w-[140px]">
              <select
                value={searchCondition}
                onChange={(e) => setSearchCondition(e.target.value)}
                className="appearance-none w-full bg-[#1c1f2b] border border-white/10 rounded-xl px-3 py-2 pr-8 text-white text-xs outline-none cursor-pointer focus:border-[#a16eff]"
              >
                <option value="ALL">Neuf ou Occasion</option>
                <option value="NEW">🌟 Neuf (Promoteurs)</option>
                <option value="USED">📦 Occasion (Marketplace)</option>
              </select>
            </div>
            
            <span className="text-[10px] font-mono text-gray-500 hidden sm:inline ml-auto">
              {filteredListings.length} correspondances
            </span>
          </div>

          {/* Elegant Horizontal Listings List */}
          <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent snap-x">
            {filteredListings.map(item => (
              <div 
                key={item.id} 
                className="bg-[#161821] border border-white/5 hover:border-[#a16eff]/50 p-4 rounded-2xl transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden shadow-lg hover:shadow-2xl shrink-0 w-[310px] md:w-[350px] snap-start"
              >
                {/* Visual Label Tag */}
                <div className="absolute top-3 right-3 flex gap-1.5">
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-black ${
                    item.isNewBuild 
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                      : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  }`}>
                    {item.isNewBuild ? "NEUF (Promoteur)" : "OCCASION"}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-[#a29bfe] font-mono">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{item.district}, {item.city}</span>
                  </div>

                  <h4 className="font-title font-bold text-sm text-white leading-snug group-hover:text-[#a16eff] transition-colors pr-20">
                    {item.title}
                  </h4>

                  <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Moroccan conformance items */}
                  <div className="bg-black/20 p-2.5 rounded-xl border border-white/5 space-y-1 text-[9.5px] font-mono text-gray-400">
                    <div className="flex justify-between items-center">
                      <span>Titre Foncier (Conservation):</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5 text-emerald-400" />
                        N° {item.titleDeedNum}
                      </span>
                    </div>
                    {item.titleDeedHash && (
                      <div className="flex justify-between items-center text-[8.5px] text-gray-500 bg-black/40 px-1.5 py-0.5 rounded border border-white/5">
                        <span className="flex items-center gap-0.5 text-emerald-400 font-black">
                          <CheckCircle className="w-2 h-2 text-emerald-400" /> ZKP :
                        </span>
                        <span className="font-mono truncate max-w-[160px]" title={item.titleDeedHash}>{item.titleDeedHash}</span>
                      </div>
                    )}
                    {item.promoterName && (
                      <div className="flex justify-between items-center text-gray-300">
                        <span>Promoteur :</span>
                        <span className="font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                          {item.promoterName}
                        </span>
                      </div>
                    )}
                    {item.ownerName && (
                      <div className="flex justify-between items-center text-purple-400">
                        <span>Vendeur Particulier :</span>
                        <span className="font-bold">{item.ownerName}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card footer details */}
                <div className="border-t border-white/5 mt-4 pt-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono text-gray-500 uppercase block">Surface & Pièces :</span>
                    <span className="text-xs text-white font-mono font-bold">
                      {item.areaSqm} m² • {item.rooms} {item.rooms > 1 ? 'Chambres' : 'Chambre'}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] font-mono text-gray-500 block">Prix de cession :</span>
                    <span className="text-sm font-black text-emerald-400 font-mono">
                      {item.priceMAD.toLocaleString('fr-FR')} MAD
                    </span>
                  </div>
                </div>

                {/* Interactive buttons */}
                <div className="flex gap-2 mt-4 pt-1 w-full">
                  <button
                    onClick={() => setSelectedOffer(item)}
                    className="flex-1 py-1.5 bg-[#a16eff]/10 hover:bg-[#a16eff] text-white text-[10.5px] font-bold rounded-xl transition-all border border-[#a16eff]/20 cursor-pointer text-center font-title block"
                  >
                    🔍 Voir Détails
                  </button>

                  <button
                    onClick={() => {
                      setSimPropertyPrice(item.priceMAD);
                      const el = document.getElementById('gpbm-credit-simulator-widget');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex-1 py-1.5 bg-indigo-950/40 hover:bg-indigo-600 text-indigo-300 hover:text-white text-[10.5px] font-bold rounded-xl transition-all border border-indigo-500/25 cursor-pointer text-center font-title block"
                    title="Calculer la simulation de crédit immobilier aux normes BAM/GPBM"
                  >
                    📊 Simuler Crédit
                  </button>

                  {/* Enable deletability if it's user's custom created one */}
                  {item.id.includes('custom') && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteListing(item.id, !item.promoterName);
                      }}
                      className="p-1.5 bg-red-950/40 hover:bg-red-600 hover:text-white border border-red-500/20 text-red-400 rounded-xl transition-colors cursor-pointer"
                      title="Supprimer cette annonce"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Form to add listing (Strictly bounded by rules) */}
          <div className="bg-[#161821] border border-white/5 rounded-3xl p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Plus className="w-5 h-5 text-emerald-400" />
              <div>
                <h4 className="font-title font-bold text-sm text-white">Insérer une annonce conforme Loi 31-08</h4>
                <p className="text-[10px] text-gray-400 mt-0.5">L'enregistrement requiert un numéro de Titre Foncier enregistré au Cadastre.</p>
              </div>
            </div>

            <form onSubmit={handleAddProperty} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-mono text-gray-500 mb-1">Titre de l'Offre *</label>
                  <input
                    type="text"
                    placeholder="Ex: Superbe Penthouse Triangulaire - Gauthier"
                    value={newPropTitle}
                    onChange={(e) => setNewPropTitle(e.target.value)}
                    required
                    className="w-full bg-[#1c1f2b] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#a16eff]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono text-gray-500 mb-1">Titre Foncier (Conservation Foncière) *</label>
                  <input
                    type="text"
                    placeholder="Ex: 105432/26 (Format marocain requis)"
                    value={newPropDeed}
                    onChange={(e) => setNewPropDeed(e.target.value)}
                    required
                    className="w-full bg-[#1c1f2b] border border-white/10 rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono text-gray-500 mb-1">Description Détaillée</label>
                <textarea
                  placeholder="Décrivez précisément l'équipement, les orientations, le voisinage, le standing..."
                  value={newPropDesc}
                  onChange={(e) => setNewPropDesc(e.target.value)}
                  rows={2}
                  className="w-full bg-[#1c1f2b] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#a16eff] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-mono text-gray-500 mb-1">Prix (MAD) *</label>
                  <input
                    type="number"
                    placeholder="Ex: 1800000"
                    value={newPropPrice}
                    onChange={(e) => setNewPropPrice(e.target.value)}
                    required
                    className="w-full bg-[#1c1f2b] border border-white/10 rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-[#a16eff]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono text-gray-500 mb-1">Surface Utile (m²) *</label>
                  <input
                    type="number"
                    placeholder="Ex: 85"
                    value={newPropArea}
                    onChange={(e) => setNewPropArea(e.target.value)}
                    required
                    className="w-full bg-[#1c1f2b] border border-white/10 rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-[#a16eff]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono text-gray-500 mb-1">Pièces</label>
                  <select
                    value={newPropRooms}
                    onChange={(e) => setNewPropRooms(e.target.value)}
                    className="w-full bg-[#1c1f2b] border border-white/10 rounded-xl px-2 py-2 text-white outline-none cursor-pointer"
                  >
                    <option value="1">1 Chambre / Studio</option>
                    <option value="2">2 Chambres / F3</option>
                    <option value="3">3 Chambres / F4</option>
                    <option value="4">4 Chambres / Duplex</option>
                    <option value="5">5 Chambres / Triplex / Villa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono text-gray-500 mb-1">Catégorie</label>
                  <select
                    value={newPropType}
                    onChange={(e) => setNewPropType(e.target.value as any)}
                    className="w-full bg-[#1c1f2b] border border-white/10 rounded-xl px-2 py-2 text-white outline-none cursor-pointer"
                  >
                    <option value="APPARTEMENT">Appartement</option>
                    <option value="VILLA">Villa</option>
                    <option value="TERRAIN">Terrain nu</option>
                    <option value="STUDIO">Studio</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-mono text-gray-500 mb-1">Quartier de Casablanca</label>
                  <select
                    value={newPropDistrict}
                    onChange={(e) => setNewPropDistrict(e.target.value)}
                    className="w-full bg-[#1c1f2b] border border-white/10 rounded-xl px-2.5 py-2 text-white outline-none cursor-pointer"
                  >
                    <option value="Anfa">Anfa / Boulevard d'Anfa</option>
                    <option value="Gauthier">Gauthier</option>
                    <option value="Maârif">Maârif / Maârif Extension</option>
                    <option value="California">California</option>
                    <option value="Bourgogne">Bourgogne</option>
                  </select>
                </div>

                {userRole === 'IMMO_PRO' ? (
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-gray-500 mb-1">Type de Construction Pro</label>
                    <div className="flex gap-2 py-1.5">
                      <label className="flex items-center gap-1.5 text-white cursor-pointer">
                        <input
                          type="radio"
                          checked={newPropIsNew}
                          onChange={() => setNewPropIsNew(true)}
                          className="accent-amber-500"
                        />
                        <span>Neuf en l'État Future d'Achèvement (VEFA)</span>
                      </label>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-gray-500 mb-1">Note Marketplace particulier</label>
                    <p className="text-gray-400 py-1 font-mono text-[10px]">
                      🔒 Les particuliers peuvent publier 1 seule offre pour de l'ancien/occasion.
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-title font-bold text-xs rounded-xl cursor-pointer shadow-lg shadow-emerald-500/15"
                >
                  {userRole === 'IMMO_PRO'
                    ? "✨ Diffuser mon Offre Promoteur Pro (Pas de Limite)"
                    : "🔒 Publier mon Listing Particulier (Limite d'Annonce: 1)"}
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Right 1 Col: Notary Directory + Agence Urbaine & Cadastres Simulations */}
        <div className="space-y-6">
          
          {/* Real Estate BAM/GPBM Credit Simulator */}
          <CreditSimulator initialPropertyPrice={simPropertyPrice} currentLang={currentLang} />

          {/* Moroccan Real Estate Legislation Summary */}
          <div className="bg-[#161821] border border-white/5 rounded-3xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-amber-500 border-b border-white/5 pb-2.5">
              <Scale className="w-5 h-5" />
              <h4 className="font-title font-bold text-xs text-white uppercase tracking-wider">Taxes & Frais d'acquisition au Maroc</h4>
            </div>

            <p className="text-gray-400 text-[11px] leading-relaxed">
              Tout transfert de propriété immobilière au Maroc est régi par le code civil et assujetti à des barèmes officiels de recouvrement.
            </p>

            <div className="space-y-2 text-[10.5px]">
              <div className="bg-black/20 p-2.5 rounded-xl border border-white/5 space-y-2 font-mono">
                <div className="flex justify-between border-b border-white/5 pb-1 text-gray-300">
                  <span>Droits d'Enregistrement :</span>
                  <span className="text-white font-bold">4.0 %</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1 text-gray-300">
                  <span>Conservation Foncière :</span>
                  <span className="text-white font-bold">1.5 % + 100 MAD</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1 text-gray-300">
                  <span>Emoluments Notaire :</span>
                  <span className="text-white font-bold">1.0 % à 1.5 %</span>
                </div>
                <div className="flex justify-between text-yellow-400">
                  <span>Taxe Plus-Value (Vendeur) :</span>
                  <span className="font-bold">20% (Min 3% du prix)</span>
                </div>
              </div>
              
              <div className="p-3 bg-red-950/20 border border-red-500/15 rounded-xl text-[10px] text-red-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                <span>
                  <b>Loi 31-08 Pro-Consommateurs :</b> Le vendeur professionnel a interdiction formelle de percevoir des arrhes non garanties avant l'achèvement des fondations sous peine de nullité de la convention.
                </span>
              </div>
            </div>
          </div>

          {/* Agence Urbaine Casablanca (AUC Note Simulator) */}
          <div className="bg-[#161821] border border-white/5 rounded-3xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-[#00f0ff] border-b border-white/5 pb-2.5">
              <Compass className="w-5 h-5 animate-pulse" />
              <div>
                <h4 className="font-title font-bold text-xs text-white uppercase tracking-wider">Note de Renseignement Urbain</h4>
                <p className="text-[9px] text-gray-500">Service Lié Agence Urbaine de Casablanca (AUC)</p>
              </div>
            </div>

            <form onSubmit={handleQueryUrbanPlanning} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] uppercase font-mono text-gray-500 mb-1">Zone Urbaine</label>
                  <select
                    value={urbanNoteDistrict}
                    onChange={(e) => setUrbanNoteDistrict(e.target.value)}
                    className="w-full bg-[#1c1f2b] border border-white/10 rounded-xl px-2 py-1.5 text-white"
                  >
                    <option value="Anfa">Anfa District</option>
                    <option value="California">California Villa Block</option>
                    <option value="Maârif">Maârif Central Zone</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] uppercase font-mono text-gray-500 mb-1">N° de Parcelle</label>
                  <input
                    type="text"
                    placeholder="Ex: P-931"
                    value={urbanNotePlot}
                    onChange={(e) => setUrbanNotePlot(e.target.value)}
                    required
                    className="w-full bg-[#1c1f2b] border border-white/10 rounded-xl px-3 py-1.5 text-white font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-1.5 bg-[#00f0ff]/10 hover:bg-[#00f0ff] text-[#00f0ff] hover:text-black font-title font-bold text-[10px] rounded-xl transition-all cursor-pointer border border-[#00f0ff]/20 uppercase"
              >
                Simuler Note de Renseignement
              </button>
            </form>

            {urbanNoteResult && (
              <div className="bg-black/30 p-3 rounded-xl border border-white/5 font-mono text-[10px] space-y-1.5 text-gray-400">
                <div className="flex justify-between items-center text-white pb-1.5 border-b border-white/5">
                  <span className="font-bold">Zonage AUC:</span>
                  <span className="text-[#00f0ff] font-extrabold bg-[#00f0ff]/10 px-1.5 rounded">{urbanNoteResult.zoningCode}</span>
                </div>
                <p className="text-[10px] text-gray-300"><b>Hauteur Max :</b> {urbanNoteResult.maxHeight}</p>
                <div className="grid grid-cols-2 gap-1 text-[9.5px]">
                  <span><b>C.O.S (Densité) :</b> {urbanNoteResult.cos}</span>
                  <span><b>C.E.S (Emprise) :</b> {urbanNoteResult.ces}</span>
                </div>
                <p className="text-[9px] text-red-300 leading-normal pt-1 bg-red-950/20 px-2 py-1 rounded">
                  <b>Restrictions de construction :</b> {urbanNoteResult.restrictions}
                </p>
              </div>
            )}
          </div>

          {/* Cadastre ANCFCC Simulation */}
          <div className="bg-[#161821] border border-white/5 rounded-3xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 border-b border-white/5 pb-2.5">
              <Globe className="w-5 h-5" />
              <div>
                <h4 className="font-title font-bold text-xs text-white uppercase tracking-wider">Conservation Foncière</h4>
                <p className="text-[9px] text-gray-500">ANCFCC cadastre national marocain</p>
              </div>
            </div>

            <form onSubmit={handleQueryCadastre} className="space-y-2 text-xs">
              <div>
                <label className="block text-[9px] uppercase font-mono text-gray-400 mb-1">N° du Titre Foncier</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Format: 12453/26"
                    value={cadastreTitleNum}
                    onChange={(e) => setCadastreTitleNum(e.target.value)}
                    required
                    className="flex-1 bg-[#1c1f2b] border border-white/10 rounded-xl px-3 py-1.5 text-white font-mono text-xs outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3 bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Vérifier
                  </button>
                </div>
              </div>
            </form>

            {cadastreStatusResult && (
              <div className="bg-black/30 p-3 rounded-xl border border-white/5 font-mono text-[10px] space-y-1.5 text-gray-400">
                <p><b>Statut Cadastral :</b> <span className="text-emerald-400 font-bold">Inscrit & Titré 🟢</span></p>
                <p className="truncate"><b>Masquage Souverain :</b> <span className="text-white font-bold">{cadastreStatusResult.titleNum}</span></p>
                <p className="truncate"><b>Propriétaire :</b> {cadastreStatusResult.owner}</p>
                <p><b>Surface du Sol :</b> {cadastreStatusResult.area} m²</p>
                <p className="text-[9px] text-yellow-300"><b>Charges/Privilèges :</b> {cadastreStatusResult.encumbrances}</p>
                
                {cadastreStatusResult.titleDeedHash && (
                  <div className="mt-2 pt-2 border-t border-white/5 space-y-1 text-[8.5px] text-gray-500">
                    <p className="font-bold text-emerald-400 uppercase tracking-wider text-[8px] flex items-center gap-0.5">
                      <Shield className="w-2.5 h-2.5" /> Preuve Cryptographique (ZKP)
                    </p>
                    <p className="truncate"><b>Empreinte :</b> <span className="text-gray-300">{cadastreStatusResult.titleDeedHash}</span></p>
                    <p className="truncate"><b>Preuve ZKP :</b> <span className="text-indigo-400">{cadastreStatusResult.zkpProofToken}</span></p>
                    <p className="text-[8px] text-gray-500 font-sans italic bg-emerald-950/20 p-1.5 rounded mt-1">
                      Conforme Loi 18-00 : Aucun Titre Foncier n'est transmis ni conservé sur les serveurs de MyCity.
                    </p>
                  </div>
                )}
                
                <p className="text-[8px] text-gray-500 text-right pt-1 border-t border-white/5">Signature d'authenticité de l'État : {cadastreStatusResult.authenticityDate}</p>
              </div>
            )}
          </div>

          {/* List of Notaries */}
          <div className="bg-[#161821] border border-white/5 rounded-3xl p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2.5 text-amber-500">
              <Award className="w-5 h-5" />
              <div>
                <h4 className="font-title font-bold text-xs text-white uppercase tracking-wider">Notaires Agrées Associés</h4>
                <p className="text-[9px] text-gray-500">Secrétariat de signature des actes authentiques</p>
              </div>
            </div>

            {/* Institution representative banner for Notaires - FIXED and non-scrollable */}
            <div 
              onClick={() => setShowNotaireModal(true)}
              className="p-3 bg-amber-950/20 border border-amber-500/25 rounded-2xl space-y-2 font-sans cursor-pointer hover:border-amber-500/60 hover:bg-amber-500/10 transition-all group scale-[0.99] hover:scale-[1.002]"
              title="Cliquez pour consulter le rôle, les recours en cas de malpratique et les coordonnées"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">🏛️</span>
                  <span className="text-[11px] font-bold text-white uppercase tracking-wider font-mono text-amber-400">Conseil Régional des Notaires de Casablanca</span>
                </div>
                <span className="text-[9px] bg-amber-500/30 text-amber-200 px-2 py-0.5 rounded-full font-mono font-bold uppercase group-hover:bg-amber-500 group-hover:text-white transition-colors">
                  📖 Guide des Droits & Recours
                </span>
              </div>
              <p className="text-[9.5px] text-amber-200/90 leading-normal">
                Ordre National des Notaires du Maroc — Organe représentatif légal régissant l'authenticité et la sécurité juridique des actes à Casablanca. <span className="underline font-bold text-white">Cliquez pour consulter le guide légal complet</span>.
              </p>
            </div>

            {/* Notaire Detailed Malpractice & Rights Modal */}
            {showNotaireModal && (
              <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-[9999] animate-fade-in" style={{ direction: 'ltr' }}>
                <div className="bg-[#11131e] border border-amber-500/30 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
                  {/* Header */}
                  <div className="p-6 border-b border-amber-500/15 flex items-start justify-between bg-amber-950/20">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🏛️</span>
                      <div>
                        <h3 className="font-title font-bold text-base text-white">Conseil Régional des Notaires de Casablanca</h3>
                        <p className="text-xs text-amber-300 font-mono">Ordre National des Notaires du Maroc — Sécurité de la Propriété</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowNotaireModal(false)}
                      className="p-1 px-2.5 bg-amber-950/50 hover:bg-rose-950/50 text-gray-400 hover:text-white rounded-lg border border-white/5 transition-colors font-mono text-xs cursor-pointer"
                    >
                      ✕ Fermer
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-6 text-xs text-gray-300 leading-relaxed">
                    {/* Section 1: Rôle Légal */}
                    <div className="space-y-2">
                      <h4 className="font-mono text-amber-400 font-bold uppercase tracking-wider border-b border-amber-500/10 pb-1 flex items-center gap-1.5">
                        <span>📄</span> Rôle Légal du Notaire & Mission Public-Privé
                      </h4>
                      <p>
                        Régit par la <b>Loi n° 32-09</b> relative à l'organisation de la profession de notaire au Maroc, le notaire est un officier public nommé par l'État pour conférer le caractère d'authenticité aux actes (actes authentiques). Le notaire apporte une sécurité juridique absolue aux transactions immobilières en Casablanca en certifiant l'identité des parties, la régularité foncière des titres, et en prélevant pour le compte de l'État les taxes de mutation indispensables avant toute inscription cadastrale définitive.
                      </p>
                    </div>

                    {/* Section 2: Protection face aux maladresses / malpratiques */}
                    <div className="space-y-2">
                      <h4 className="font-mono text-amber-400 font-bold uppercase tracking-wider border-b border-amber-500/10 pb-1 flex items-center gap-1.5">
                        <span>🛡️</span> Protection face aux Malpratiques des Notaires (Négligences & Détournements)
                      </h4>
                      <p className="mb-2">
                        Les notaires marocains sont soumis à des contrôles d'une extrême rigueur par le Ministère de la Justice d'une part, et par leur ordre professionnel d'autre part :
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] bg-amber-950/20 p-3.5 rounded-xl border border-amber-500/10">
                        <div className="space-y-1">
                          <h5 className="font-bold text-white">🔐 Caisse de Garantie Obligatoire</h5>
                          <p className="text-gray-400 text-[10.5px]">En cas d'insolvabilité foncière ou de faute civile grave du notaire causant un dommage financier, la Caisse nationale de Garantie des Actes Notariés indemnise les acquéreurs lésés de leurs débours perdus.</p>
                        </div>
                        <div className="space-y-1">
                          <h5 className="font-bold text-white">💰 Consignation Sécurisée à la CDG</h5>
                          <p className="text-gray-400 text-[10.5px]">Tout versement de fonds d'un bien immobilier (prix de vente, frais d'acte) doit être obligatoirement consigné sur un compte spécial ouvert à la Caisse de Dépôt et de Gestion (CDG). La conservation directe sur un compte personnel du notaire est interdite.</p>
                        </div>
                        <div className="space-y-1 md:col-span-2 pt-1 border-t border-white/5">
                          <h5 className="font-bold text-white">⏳ Action contre les retards de publication</h5>
                          <p className="text-gray-400 text-[10.5px]">Tout retard inconsidéré dans l'enregistrement de l'acte de vente auprès de l'ANCFCC (Conservation Foncière) fait courir le risque de vente parallèle. L'Ordre intervient pour forcer l'enregistrement ou saisir le Procureur du Roi.</p>
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Vos Droits & Comment les obtenir */}
                    <div className="space-y-3">
                      <h4 className="font-mono text-amber-400 font-bold uppercase tracking-wider border-b border-amber-500/10 pb-1 flex items-center gap-1.5">
                        <span>📋</span> Droits de l'Acquéreur & Démarche de Contrôle et Plaintes
                      </h4>
                      <ol className="space-y-2.5 text-gray-400 list-decimal pl-4">
                        <li>
                          <b className="text-white">Le droit de vérifier le Certificat de Propriété :</b> Avant de verser le moindre centime au vendeur, exigez du notaire un certificat de propriété daté du jour de l'ANCFCC confirmant l'absence de saisies judiciaires, d'hypothèques ou d'interdictions de vente sur le titre.
                        </li>
                        <li>
                          <b className="text-white">Le droit aux reçus officiels (Quittances CDG) :</b> Chaque versement effectué auprès d'une étude de notaire doit faire l'objet d'une quittance officielle numérotée mentionnant le numéro d'ordre CDG. Ne versez jamais de frais en espèces sans un reçu scrupuleusement rédigé.
                        </li>
                        <li>
                          <b className="text-white">Dépôt de plainte formelle :</b> En cas de rétention prolongée de fonds, d'inactivité injustifiée ou de fautes avérées, déposez un dossier de plainte écrite auprès du Président du Conseil Régional des Notaires de Casablanca, étayé par une copie du contrat de compromis de vente ou d'acte authentique non publié.
                        </li>
                        <li>
                          <b className="text-white">Saisine du Procureur du Roi :</b> Pour les cas critiques d'escroquerie, d'abus de blanc-seing ou d'appropriation frauduleuse de fonds dépositaires, déposez immédiatement plainte directement auprès du Procureur du Roi près de la Cour d'Appel de Casablanca, qui détient la compétence de suspendre l'officier public par intérim.
                        </li>
                      </ol>
                    </div>

                    {/* Section 4: Contact Officiel */}
                    <div className="space-y-3 bg-[#11131e] border border-amber-500/15 p-4 rounded-2xl">
                      <h4 className="font-mono text-white font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                        <span>📞</span> Coordonnées Officielles & Bureau de Casablanca
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] font-mono leading-relaxed">
                        <div>
                          <p><span className="text-gray-500">📍 Siège Central :</span> <span className="text-gray-200 font-sans">Angle Boulevard d'Anfa et Rue de Rome, Résidence d'Anfa, Casablanca, Maroc</span></p>
                          <p className="mt-1"><span className="text-gray-500">📧 E-mail :</span> <span className="text-amber-400">regional.casablanca@notariat.ma</span></p>
                        </div>
                        <div>
                          <p><span className="text-gray-500">📞 Standard Tél :</span> <span className="text-[#00ffcc] font-sans font-bold">+212 (0) 522-39 51 52</span></p>
                          <p><span className="text-gray-500">🕒 Heures d'Accueil :</span> <span className="text-yellow-400">Lundi-Vendredi : 09:00 - 17:00</span></p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-4 bg-amber-950/20 border-t border-amber-500/15 flex justify-end">
                    <button 
                      onClick={() => setShowNotaireModal(false)}
                      className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-all font-mono text-xs cursor-pointer shadow-lg shadow-amber-500/10"
                    >
                      J'ai bien compris mes droits d'acquéreur
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {defaultNotaries.map(not => (
                <div key={not.id} className="bg-black/20 p-3 rounded-xl border border-white/5 flex justify-between gap-2 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white hover:underline">{not.name}</span>
                      {not.verified && (
                        <span className="text-[8px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 rounded uppercase font-black">Conseil Agrée</span>
                      )}
                    </div>
                    <p className="text-gray-400 text-[10px] leading-relaxed">{not.address}</p>
                    <div className="text-[10px] text-[#a29bfe] font-mono flex items-center gap-2">
                      <span>📞 {not.phone}</span>
                      <span>⭐ {not.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
          ) : (
             <div id="myrent-grid" className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-fade-in" style={{ direction: 'ltr' }}>
               
               {/* Left 2 Cols: Rent Available Feed + Publish via MyHost form */}
               <div className="xl:col-span-2 space-y-6">
                 
                 {/* Search / Filters Panel */}
                 <div className="bg-[#161821] p-4 rounded-2xl border border-white/5 flex flex-wrap gap-3 items-center">
                   <div className="relative flex-1 min-w-[160px]">
                     <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                     <input
                       type="text"
                       placeholder="Filtrer par quartier (ex: Anfa, Gauthier, Maârif)..."
                       value={searchDistrict}
                       onChange={(e) => setSearchDistrict(e.target.value)}
                       className="w-full bg-[#1c1f2b] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white text-xs placeholder:text-gray-500 outline-none focus:border-[#a16eff]"
                     />
                   </div>

                   {/* Filter Pills for Short vs Long */}
                   <div className="flex gap-1">
                     {[
                       { id: 'ALL', label: 'Tout voir 📋' },
                       { id: 'SHORT', label: "🏨 B'n'B / Courte" },
                       { id: 'LONG', label: '🔑 Longue Durée' }
                     ].map(pill => (
                       <button
                         key={pill.id}
                         type="button"
                         onClick={() => setRentFilter(pill.id as any)}
                         className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                           rentFilter === pill.id
                             ? 'bg-purple-600 text-white border-purple-500 shadow font-extrabold'
                             : 'bg-black/20 text-gray-400 border-white/5 hover:text-white'
                         }`}
                       >
                         {pill.label}
                       </button>
                     ))}
                   </div>
                 </div>

                 {/* Rental list Cards */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {rentalOffers.filter(offer => {
                     const matchesDistrict = searchDistrict === '' || offer.district.toLowerCase().includes(searchDistrict.toLowerCase());
                     const matchesType = rentFilter === 'ALL' || offer.type === rentFilter;
                     return matchesDistrict && matchesType;
                   }).map(offer => (
                     <div
                       key={offer.id}
                       className="bg-[#161821] border border-white/5 hover:border-[#a16eff]/40 p-5 rounded-2xl flex flex-col justify-between transition-all duration-300 shadow-xl relative overflow-hidden group"
                     >
                       {/* MyHost Verified Badge */}
                       <div className="absolute top-4 right-4 flex items-center gap-1">
                         {offer.verifiedMyHost ? (
                           <span className="text-[8.5px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-black uppercase flex items-center gap-1">
                             <CheckCircle className="w-2.5 h-2.5 text-emerald-400" /> Compliant MyHost
                           </span>
                         ) : (
                           <span className="text-[8.5px] font-mono bg-amber-500/5 text-amber-500 border border-amber-500/10 px-2 py-0.5 rounded font-bold uppercase">
                             Particulier Direct
                           </span>
                         )}
                       </div>

                       <div className="space-y-2 mt-2">
                         <div className="flex items-center gap-1 text-[10.5px] text-gray-400 font-mono">
                           <MapPin className="w-3.5 h-3.5 text-red-500" />
                           <span>{offer.district}, Casablanca</span>
                         </div>

                         <h3 className="font-title font-bold text-sm text-white group-hover:text-[#be8bff] transition-colors pr-10">
                           {offer.title}
                         </h3>

                         <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">
                           {offer.description}
                         </p>

                         <div className="bg-black/15 p-2.5 rounded-xl border border-white/5 flex justify-between text-[10.5px] text-gray-400 font-mono">
                           <span>Surface : <b>{offer.areaSqm} m²</b></span>
                           <span>Pièces : <b>{offer.rooms} {offer.rooms > 1 ? 'Chambres' : 'Chambre'}</b></span>
                         </div>
                       </div>

                       {/* Price + Action Button */}
                       <div className="border-t border-white/5 mt-5 pt-4 flex items-center justify-between">
                         <div>
                           <span className="text-[9px] font-mono text-gray-500 block uppercase">Tarif :</span>
                           <span className="text-sm font-black text-emerald-400 font-mono">
                             {offer.priceValue.toLocaleString('fr-FR')} MAD 
                             <span className="text-gray-500 font-normal text-[10px] font-sans">
                               {offer.type === 'SHORT' ? ' / nuit' : ' / mois'}
                             </span>
                           </span>
                         </div>

                         <button
                           onClick={() => setSelectedRentalForBooking(offer)}
                           className="px-4 py-2 bg-gradient-to-r from-purple-500 to-[#a16eff] hover:from-purple-600 hover:to-[#be8bff] text-white text-xs font-black font-title rounded-xl transition-all cursor-pointer shadow-md shadow-purple-500/10"
                         >
                           🏨 Réserver (Book)
                         </button>
                       </div>
                     </div>
                   ))}
                   {rentalOffers.filter(offer => {
                     const matchesDistrict = searchDistrict === '' || offer.district.toLowerCase().includes(searchDistrict.toLowerCase());
                     const matchesType = rentFilter === 'ALL' || offer.type === rentFilter;
                     return matchesDistrict && matchesType;
                   }).length === 0 && (
                     <div className="md:col-span-2 text-center py-8 text-gray-500 text-xs font-mono bg-[#161821]/50 border border-white/5 rounded-2xl">
                       Aucun bien en location ne correspond à votre recherche.
                     </div>
                   )}
                 </div>

                 {/* Form to list my property via MyHost */}
                 <div id="rent-publish-container" className="bg-[#161821] border border-white/5 rounded-3xl p-5 space-y-4">
                   <div className="flex items-center gap-2 border-b border-white/5 pb-3 justify-between">
                     <div className="flex items-center gap-2">
                       <Home className="w-5 h-5 text-purple-400" />
                       <div>
                         <h4 className="font-title font-bold text-sm text-white">Mettre mon bien en location via MyHost</h4>
                         <p className="text-[10px] text-gray-400 mt-0.5">Propulsez votre logement en courte ou longue durée avec gestion automatisée.</p>
                       </div>
                     </div>
                     <span className="text-[10px] font-bold font-mono text-medium bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-lg uppercase">MyHost Premium</span>
                   </div>

                   <form onSubmit={handlePublishRental} className="space-y-3.5 text-xs">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                         <label className="block text-[10px] uppercase font-mono text-gray-500 mb-1">Titre de l'annonce de location *</label>
                         <input
                           type="text"
                           placeholder="Ex: Charmante Suite Gauthier avec Terrasse"
                           value={newRentTitle}
                           onChange={(e) => setNewRentTitle(e.target.value)}
                           required
                           className="w-full bg-[#1c1f2b] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#a16eff]"
                         />
                       </div>

                       <div>
                         <label className="block text-[10px] uppercase font-mono text-gray-500 mb-1">Quartier</label>
                         <select
                           value={newRentDistrict}
                           onChange={(e) => setNewRentDistrict(e.target.value)}
                           className="w-full bg-[#1c1f2b] border border-white/10 rounded-xl px-2.5 py-2 text-white outline-none cursor-pointer"
                         >
                           <option value="Anfa">Anfa / Boulevard d'Anfa</option>
                           <option value="Gauthier">Gauthier / Centre</option>
                           <option value="Maârif">Maârif Extension</option>
                           <option value="Bouskoura">Bouskoura Ville Verte</option>
                           <option value="Bourgogne">Bourgogne</option>
                         </select>
                       </div>
                     </div>

                     <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                       <div>
                         <label className="block text-[10px] uppercase font-mono text-gray-500 mb-1 font-mono">Type de bail *</label>
                         <select
                           value={newRentType}
                           onChange={(e) => setNewRentType(e.target.value as any)}
                           className="w-full bg-[#1c1f2b] border border-white/10 rounded-xl px-2 py-2 text-white outline-none cursor-pointer"
                         >
                           <option value="SHORT">Chambre / B'n'B (Courte)</option>
                           <option value="LONG">Longue Durée (Mensuel)</option>
                         </select>
                       </div>

                       <div>
                         <label className="block text-[10px] uppercase font-mono text-gray-500 mb-1 font-mono">Loyer estimé (MAD) *</label>
                         <input
                           type="number"
                           placeholder={newRentType === 'SHORT' ? "Ex: 800" : "Ex: 10000"}
                           value={newRentPrice}
                           onChange={(e) => setNewRentPrice(e.target.value)}
                           required
                           className="w-full bg-[#1c1f2b] border border-white/10 rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-[#a16eff]"
                         />
                       </div>

                       <div>
                         <label className="block text-[10px] uppercase font-mono text-gray-500 mb-1">Surface (m²) *</label>
                         <input
                           type="number"
                           placeholder="Ex: 65"
                           value={newRentArea}
                           onChange={(e) => setNewRentArea(e.target.value)}
                           required
                           className="w-full bg-[#1c1f2b] border border-white/10 rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-[#a16eff]"
                         />
                       </div>

                       <div>
                         <label className="block text-[10px] uppercase font-mono text-gray-500 mb-1 font-mono">Chambres / Pièces</label>
                         <select
                           value={newRentRooms}
                           onChange={(e) => setNewRentRooms(e.target.value)}
                           className="w-full bg-[#1c1f2b] border border-white/10 rounded-xl px-2 py-2 text-white outline-none cursor-pointer"
                         >
                           <option value="1">1 Chambre (Studio)</option>
                           <option value="2">2 Chambres (F3)</option>
                           <option value="3">3 Chambres (F4)</option>
                           <option value="4">4+ Chambres (Grande)</option>
                         </select>
                       </div>
                     </div>

                     <div>
                       <label className="block text-[10px] uppercase font-mono text-gray-500 mb-1">Description et équipements</label>
                       <textarea
                         placeholder="Quartier calme, climatisé, équipements de cuisine, Smart Lock, parfait état..."
                         value={newRentDesc}
                         onChange={(e) => setNewRentDesc(e.target.value)}
                         rows={2}
                         className="w-full bg-[#1c1f2b] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#a16eff] resize-none"
                       />
                     </div>

                     <div className="flex items-center pt-2">
                       <label className="flex items-center gap-2 cursor-pointer text-white text-[11px] font-mono">
                         <input
                           type="checkbox"
                           checked={newRentVerifiedHostFlag}
                           onChange={(e) => setNewRentVerifiedHostFlag(e.target.checked)}
                           className="accent-purple-500 w-4 h-4 text-purple-500 border border-white/10"
                         />
                         <span>Activer la labellisation et serrure connectée MyHost</span>
                       </label>
                     </div>

                     <button
                       type="submit"
                       className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-[#a16eff] hover:from-purple-700 hover:to-[#be8bff] text-white font-title font-bold text-xs rounded-xl cursor-pointer shadow-lg shadow-purple-500/15"
                     >
                       🚀 Mettre en ligne sur MyCity (via MyHost)
                     </button>
                   </form>
                 </div>
               </div>

               {/* Right 1 Col: MyHost details and statistics */}
               <div className="space-y-6 col-span-1">
                 
                 {/* Why list with MyHost */}
                 <div className="bg-[#161821] border border-white/5 rounded-3xl p-5 space-y-4">
                   <div className="flex items-center gap-2 text-[#a16eff] border-b border-white/5 pb-2.5 bg-gradient-to-r from-transparent to-transparent">
                     <Sparkles className="w-5 h-5 text-purple-400" />
                     <h4 className="font-title font-bold text-xs text-white uppercase tracking-wider font-title">Pourquoi louer via MyHost ?</h4>
                   </div>
                   <p className="text-gray-400 text-[11px] leading-relaxed font-sans">
                     MyHost simplifie l'expérience locative des loueurs et voyageurs grâce à la souveraineté numérique locale :
                   </p>

                   <div className="space-y-3 text-[10px] font-mono">
                     <div className="p-2.5 bg-black/20 rounded-xl border border-white/5 space-y-1">
                       <p className="text-white font-bold flex items-center gap-1.5"><Key className="w-3.5 h-3.5 text-purple-400" /> Auto Check-in intelligent</p>
                       <p className="text-gray-400 text-[9.5px] font-sans leading-normal">Génération automatique de codes à chiffre unique transmis physiquement à la serrure connectée de l'appartement.</p>
                     </div>
                     <div className="p-2.5 bg-black/20 rounded-xl border border-white/5 space-y-1">
                       <p className="text-white font-bold flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-emerald-400" /> Déclaration Sécurisée</p>
                       <p className="text-gray-400 text-[9.5px] font-sans leading-normal">Toute réservation transmet automatiquement les identités requises aux autorités locales via API conforme CNDP.</p>
                     </div>
                     <div className="p-2.5 bg-black/20 rounded-xl border border-white/5 space-y-1">
                       <p className="text-white font-bold flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5 text-yellow-400" /> Protection des Hôtes</p>
                       <p className="text-gray-400 text-[9.5px] font-sans leading-normal">Garantie contre les pépins physiques et assurance dommage d'un million de dirhams incluse d'office.</p>
                     </div>
                   </div>
                 </div>

                 {/* Active guest statistics */}
                 <div className="bg-[#161821] border border-white/5 rounded-3xl p-5 space-y-3">
                   <h4 className="text-[10px] uppercase font-mono tracking-wider text-gray-400 border-b border-white/5 pb-2 font-bold font-mono">🎯 Tendances Locatives à Casablanca :</h4>
                   <div className="grid grid-cols-2 gap-3 text-center font-mono">
                     <div className="p-3 bg-black/20 border border-white/5 rounded-2xl">
                       <span className="text-[9px] uppercase text-gray-500 block">Loyer Moyen B'n'B</span>
                       <strong className="text-xs text-purple-400">820 MAD/nuit</strong>
                     </div>
                     <div className="p-3 bg-black/20 border border-white/5 rounded-2xl">
                       <span className="text-[9px] uppercase text-gray-500 block">Taux de Remplissage</span>
                       <strong className="text-xs text-emerald-400">81.5 % moyen</strong>
                     </div>
                   </div>
                 </div>
               </div>
               
             </div>
          )}

        </div>
      )}

      {/* Details modal with Map simulation & PIN pointer */}
      {selectedOffer && (
        <div id="listing-details-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#06070a]/100 animate-fade-in" style={{ backgroundColor: '#06070a' }}>
          <div id="listing-details-card" className="bg-[#161821] border border-[#a16eff]/20 w-full max-w-4xl rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl h-[90vh] md:h-auto md:max-h-[85vh]" style={{ backgroundColor: '#161821' }}>
            
            {/* Left Hand: Property details info */}
            <div className="flex-1 p-6 md:p-8 space-y-4 overflow-y-auto border-b md:border-b-0 md:border-r border-white/5">
              
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-black uppercase ${
                  selectedOffer.isNewBuild 
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                    : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                }`}>
                  {selectedOffer.isNewBuild ? "Construction Neuve (VEFA)" : "Occasion certifiée"}
                </span>
                <span className="font-mono text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 px-2 py-0.5 rounded font-bold uppercase flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> Titre Foncier N° {selectedOffer.titleDeedNum}
                </span>
              </div>

              {selectedOffer.titleDeedHash && (
                <div className="bg-[#1b1c26] border border-emerald-500/15 p-3 rounded-2xl space-y-1.5 text-xs text-justify">
                  <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                    <span className="text-[10px] uppercase font-mono font-bold text-emerald-400 flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5" /> Certificat d'Empreinte Numérique (ZKP)
                    </span>
                    <span className="text-[8px] font-mono bg-emerald-400/10 text-emerald-400 px-1.5 py-0.5 rounded uppercase font-black tracking-wide border border-emerald-400/20">
                      Loi 18-00 & ANCFCC Compliant
                    </span>
                  </div>
                  <p className="text-[10.5px] text-gray-400 leading-normal">
                    Fidèle à la directive stricte d'exemption de risque juridique, l'infrastructure MyCity ne stocke aucun document d'acte original ou de titre foncier en clair. Seul ce condensat de hachage cryptographique et sa preuve à divulgation nulle (ZKP) sont conservés à des fins d'authentification souveraine absolue auprès du cadastre.
                  </p>
                  <div className="bg-black/35 p-2 rounded-xl text-[9px] font-mono text-gray-500 space-y-0.5 border border-white/5">
                    <p className="truncate"><b>Hachage immuable :</b> <span className="text-gray-300 font-bold select-all">{selectedOffer.titleDeedHash}</span></p>
                    <p className="truncate"><b>Authenticité cryptographique :</b> <span className="text-[#a29bfe] font-bold select-all">{selectedOffer.zkpProofToken}</span></p>
                  </div>
                </div>
              )}

              <h2 className="font-title font-black text-lg md:text-xl text-white leading-snug">
                {selectedOffer.title}
              </h2>

              <p className="text-gray-300 text-xs leading-relaxed">
                {selectedOffer.description}
              </p>

              {/* Grid specifics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-black/30 p-3 rounded-xl border border-white/5 space-y-0.5">
                  <span className="text-[9px] font-mono text-gray-500 uppercase block">Surface utile :</span>
                  <span className="text-sm font-black text-white font-mono">{selectedOffer.areaSqm} m²</span>
                </div>
                <div className="bg-black/30 p-3 rounded-xl border border-white/5 space-y-0.5">
                  <span className="text-[9px] font-mono text-gray-500 uppercase block">Pièces & chambres :</span>
                  <span className="text-sm font-black text-white font-mono">{selectedOffer.rooms} pièce(s)</span>
                </div>
                <div className="bg-black/30 p-3 rounded-xl border border-white/5 space-y-0.5">
                  <span className="text-[9px] font-mono text-gray-500 uppercase block">Situation :</span>
                  <span className="text-sm font-black text-[#a29bfe] font-mono">{selectedOffer.district}, Casablanca</span>
                </div>
                <div className="bg-black/30 p-3 rounded-xl border border-[#a16eff]/15 space-y-0.5">
                  <span className="text-[9px] font-mono text-[#a16eff] uppercase block">Prix de cession :</span>
                  <span className="text-sm font-black text-emerald-400 font-mono">{selectedOffer.priceMAD.toLocaleString('fr-FR')} MAD</span>
                </div>
              </div>

              {/* Promoter/Owner Contact section */}
              <div className="bg-black/25 p-4 rounded-xl border border-white/5 space-y-2">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">Contact de cette transaction</span>
                
                {selectedOffer.promoterName ? (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs">
                      {selectedOffer.promoterLogo}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{selectedOffer.promoterName}</h4>
                      <p className="text-[10px] text-gray-400">Promoteur immobilier professionnel certifié.</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#a16eff]/10 border border-[#a16eff]/20 text-[#a16eff] font-bold flex items-center justify-center text-xs">
                      MP
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{selectedOffer.ownerName || "Vendeur Particulier"}</h4>
                      <p className="text-[10px] text-gray-400">Transaction de particulier à particulier.</p>
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-white/5 flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-mono">Ligne directe sécurisée :</span>
                  <span className="text-[#a16eff] font-black font-mono select-all flex items-center gap-1">
                    📞 {selectedOffer.promoterContact}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 gap-2">
                <button
                  onClick={() => {
                    setSimPropertyPrice(selectedOffer.priceMAD);
                    setSelectedOffer(null);
                    setTimeout(() => {
                      const el = document.getElementById('gpbm-credit-simulator-widget');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-title font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center gap-1"
                >
                  📊 Lancer Simulation Crédit BAM
                </button>

                <button
                  onClick={() => setSelectedOffer(null)}
                  className="px-4 py-2 bg-neutral-950 border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white transition-all font-mono text-xs rounded-xl cursor-pointer"
                >
                  Indicateur de fermeture ✕
                </button>
              </div>

            </div>

            {/* Right Hand: Interactive PIN on Casablanca Map simulation */}
            <div className="flex-1 p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest block">Visualisation Géographique</span>
                <h4 className="text-xs font-bold text-white">PIN interactif sur la carte de Casablanca</h4>
                <p className="text-[10px] text-gray-400">Pointage géographique conforme aux déclarations cadastrales d'Anfa.</p>
              </div>

              {/* Live Mini Map Vector Container */}
              <div className="relative w-full h-[280px] bg-[#0c0e17] border border-white/5 rounded-2xl overflow-hidden shadow-inner">
                {/* Background lines representing roads */}
                <div className="absolute inset-0 bg-[#0c0e17] opacity-90"></div>
                
                {/* Roads Map Vector Draw */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M 0 0 Q 30 15 55 10 T 100 0 L 0 0 Z" fill="#a16eff" />
                  <path d="M 10 45 L 90 25 M 20 25 Q 35 45 48 85 M 40 12 L 85 85" stroke="white" strokeWidth="0.8" fill="none" />
                  <path d="M 5 25 Q 40 30 95 65" stroke="#a16eff" strokeWidth="1.2" strokeDasharray="3,3" fill="none" />
                </svg>

                {/* Grid nodes */}
                <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#a16eff 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>

                {/* Neighborhood labels */}
                <span className="absolute left-[10%] top-[8%] text-white/20 font-mono text-[8px] uppercase tracking-widest">Atlantique</span>
                <span className="absolute left-[30%] top-[45%] text-[#a16eff]/50 font-title font-medium text-[9px]">Gauthier</span>
                <span className="absolute left-[50%] top-[70%] text-[#a16eff]/50 font-title font-medium text-[9px]">California</span>

                {/* Targeted Property Interactive PIN of selected item */}
                <div 
                  className="absolute z-40 transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${selectedOffer.coordinates.x}%`, top: `${selectedOffer.coordinates.y}%` }}
                >
                  {/* Glowing pulse ring */}
                  <div className="absolute -inset-3 rounded-full bg-amber-400/20 animate-ping opacity-75"></div>
                  
                  {/* Rounded marker box */}
                  <div className="relative bg-amber-500 text-black p-2 rounded-xl shadow-2xl border border-yellow-200 animate-bounce flex items-center justify-center gap-1.5">
                    <Home className="w-4 h-4" />
                    <div className="flex flex-col text-left">
                      <span className="text-[8px] font-black leading-none uppercase">IMMO PIN</span>
                      <span className="text-[9px] font-bold font-mono leading-tight">{selectedOffer.priceMAD >= 1000000 ? `${(selectedOffer.priceMAD / 1000000).toFixed(1)}M MAD` : `${selectedOffer.priceMAD / 1000}k MAD`}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informative notice on legal search status */}
              <div className="p-3 bg-[#a16eff]/5 border border-[#a16eff]/15 rounded-xl text-[10px] text-[#b2a9f4] space-y-1 font-mono">
                <span className="font-bold flex items-center gap-1 text-white">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Coordonnées Titrées Conformité
                </span>
                <p className="leading-normal">
                  Ce bien a été localisé via le système d'Information Géographique (SIG) de l'Agence Urbaine de Casablanca. Transaction sécurisée de dépôt obligatoire.
                </p>
              </div>

              <button
                onClick={() => setSelectedOffer(null)}
                className="w-full py-2 bg-[#a16eff] hover:bg-[#a16eff]/90 text-white font-title font-bold text-xs rounded-xl cursor-pointer shadow-lg shadow-[#a16eff]/20"
              >
                Fermer l'Aperçu Cartographique
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Selected Business Modal */}
      {selectedBusiness && (
        <div id="business-details-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#06070a]/100 animate-fade-in" style={{ backgroundColor: '#06070a' }}>
          <div id="business-details-card" className="bg-[#161821] border border-[#a16eff]/20 w-full max-w-2xl rounded-3xl overflow-hidden flex flex-col shadow-2xl p-6 md:p-8 space-y-5" style={{ backgroundColor: '#161821' }}>
            
            <div className="flex justify-between items-start border-b border-white/5 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase bg-[#a16eff]/20 text-[#BEB3FF] px-2.5 py-1 rounded-md border border-[#a16eff]/10 font-bold">
                  {selectedBusiness.category === 'FURNITURE' && "Ameublement & Mobilier"}
                  {selectedBusiness.category === 'DECO' && "Design & Décoration"}
                  {selectedBusiness.category === 'KITCHEN' && "Cuisines de Créateurs"}
                  {selectedBusiness.category === 'GARDENING' && "Jardinage & Aménagements Extérieurs"}
                  {selectedBusiness.category === 'SATELLITES' && "Artisans & Domotique d'Art"}
                </span>
                <h2 className="font-title font-black text-lg md:text-xl text-white mt-2">
                  {selectedBusiness.name}
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-gray-400 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  <span><b>{selectedBusiness.cityZone}</b> • {selectedBusiness.address}</span>
                </div>
              </div>
              <span className="text-yellow-400 font-mono text-sm font-bold bg-yellow-400/10 px-2 py-1 rounded">⭐ {selectedBusiness.rating.toFixed(1)}</span>
            </div>

            <div className="space-y-3">
              <p className="text-gray-300 text-xs leading-relaxed">
                {selectedBusiness.description}
              </p>

              {/* Highlights & Atouts */}
              <div className="bg-black/35 p-4 rounded-2xl border border-[#a16eff]/15 space-y-2">
                <span className="text-[10px] font-mono text-[#9E8BFF] uppercase tracking-wider block font-bold">✨ Avantages & Services Exclusifs</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300">
                  {selectedBusiness.services.map((srv: string, ind: number) => (
                    <div key={ind} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{srv}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Showroom location block simulation */}
              <div className="p-3.5 bg-neutral-950 rounded-xl space-y-1">
                <span className="text-[9px] font-mono text-gray-500 block uppercase">Spécifications Showroom</span>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Atout phare :</span>
                  <span className="text-emerald-400 font-mono font-bold">{selectedBusiness.highlight}</span>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-gray-400">Territoire d'intervention :</span>
                  <span className="text-white font-mono">Grand Casablanca (Casablanca, Mohammedia, Bouskoura, Dar Bouazza)</span>
                </div>
              </div>
            </div>

            <div className="bg-black/25 p-4 rounded-xl border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[9px] font-mono text-gray-500 uppercase block">Contact direct Showroom</span>
                <span className="text-white font-mono font-semibold">📞 Téléphone fixe & Service Clientèle</span>
              </div>
              <span className="text-[#a16eff] font-black font-mono text-sm bg-[#a16eff]/10 border border-[#a16eff]/20 px-3 py-1.5 rounded-xl select-all">
                {selectedBusiness.phone}
              </span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedBusiness(null)}
                className="px-5 py-2 bg-[#a16eff] hover:bg-[#a16eff]/90 text-white font-bold transition-all text-xs rounded-xl cursor-pointer shadow-lg shadow-[#a16eff]/25 font-title"
              >
                Fermer l'aperçu expert
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Booking Modal for Rentals / B'n'B */}
      {selectedRentalForBooking && !bookingSuccessData && (
        <div id="booking-sheet" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#06070a]/90 backdrop-blur-md animate-fade-in" style={{ direction: 'ltr' }}>
          <div className="bg-[#161821] border border-[#a16eff]/30 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl p-6 md:p-8 space-y-5" style={{ backgroundColor: '#161821' }}>
            <div className="flex justify-between items-start border-b border-white/5 pb-3">
              <div>
                <span className="font-mono text-[9px] bg-purple-500/15 text-[#be8bff] border border-purple-500/25 px-2 py-0.5 rounded font-black uppercase">
                  Réservation directe - MyHost
                </span>
                <h3 className="font-title font-black text-sm text-white mt-1.5 leading-tight">
                  {selectedRentalForBooking.title}
                </h3>
                <span className="text-[10.5px] text-gray-400 font-mono">Quartier : {selectedRentalForBooking.district}</span>
              </div>
              <button
                onClick={() => setSelectedRentalForBooking(null)}
                className="p-1 px-2.5 bg-black/40 hover:bg-rose-950/40 text-gray-400 hover:text-white rounded-lg border border-white/5 transition-colors font-mono text-xs cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-4 text-xs text-gray-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[9px] uppercase font-mono text-gray-500 mb-1">Nom Complet du réservataire *</label>
                  <input
                    type="text"
                    value={bookingTenantName}
                    onChange={(e) => setBookingTenantName(e.target.value)}
                    required
                    className="w-full bg-[#1c1f2b] border border-white/10 rounded-xl px-2.5 py-2 text-white outline-none focus:border-[#a16eff]"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase font-mono text-gray-500 mb-1">Adresse E-mail *</label>
                  <input
                    type="email"
                    value={bookingTenantEmail}
                    onChange={(e) => setBookingTenantEmail(e.target.value)}
                    required
                    className="w-full bg-[#1c1f2b] border border-white/10 rounded-xl px-2.5 py-2 text-white outline-none focus:border-[#a16eff]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[9px] uppercase font-mono text-gray-500 mb-1">Date d'arrivée *</label>
                  <input
                    type="date"
                    value={bookingCheckIn}
                    onChange={(e) => setBookingCheckIn(e.target.value)}
                    required
                    className="w-full bg-[#1c1f2b] border border-white/10 rounded-xl px-2.5 py-1.5 text-white outline-none focus:border-[#a16eff] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[9px] uppercase font-mono text-gray-500 mb-1">Nombre d'invités</label>
                  <select
                    value={bookingGuests}
                    onChange={(e) => setBookingGuests(parseInt(e.target.value))}
                    className="w-full bg-[#1c1f2b] border border-white/10 rounded-xl px-2 py-1.5 text-white outline-none cursor-pointer"
                  >
                    <option value="1">1 Personne</option>
                    <option value="2">2 Personnes</option>
                    <option value="3">3 Personnes</option>
                    <option value="4">4+ Personnes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] uppercase font-mono text-gray-500 mb-1">
                    {selectedRentalForBooking.type === 'SHORT' ? 'Nombre de nuits *' : 'Nombre de mois *'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={bookingDuration}
                    onChange={(e) => setBookingDuration(parseInt(e.target.value) || 1)}
                    required
                    className="w-full bg-[#1c1f2b] border border-white/10 rounded-xl px-2.5 py-1.5 text-white outline-none focus:border-[#a16eff] font-mono"
                  />
                </div>
              </div>

              {/* Price Calculation Widget */}
              <div className="bg-black/45 p-3 rounded-2xl border border-white/5 space-y-1.5 font-mono">
                <div className="flex justify-between items-center text-[10px]">
                  <span>Tarif de base ({selectedRentalForBooking.type === 'SHORT' ? 'par nuit' : 'par mois'}):</span>
                  <span className="text-white font-bold">{selectedRentalForBooking.priceValue.toLocaleString('fr-FR')} MAD</span>
                </div>
                <div className="flex justify-between items-center text-[10px] pb-1.5 border-b border-white/5">
                  <span>Période / Durée :</span>
                  <span className="text-white font-bold">
                    {bookingDuration} {selectedRentalForBooking.type === 'SHORT' ? 'nuit(s)' : 'mois'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold font-sans pt-1">
                  <span className="text-gray-400">Total à régler (TTC) :</span>
                  <span className="text-emerald-400 font-mono text-sm font-black">
                    {(selectedRentalForBooking.priceValue * bookingDuration).toLocaleString('fr-FR')} MAD
                  </span>
                </div>
              </div>

              {/* Automated security compliance explanation */}
              <p className="text-[10px] text-gray-400 leading-normal font-sans italic">
                🛡️ Transmis via MyHost : Votre identité sera cryptographiquement sécurisée auprès du Conseil de copropriété pour conformité d'accès de nuit (Conforme CNDP).
              </p>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setSelectedRentalForBooking(null)}
                  type="button"
                  className="flex-1 py-2.5 bg-neutral-950 hover:bg-white/5 border border-white/10 text-gray-400 text-xs font-bold rounded-xl cursor-pointer transition-all uppercase tracking-wider font-mono text-center"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-[#a16eff] hover:from-purple-700 hover:to-[#be8bff] text-white text-xs font-black font-title rounded-xl cursor-pointer shadow-lg shadow-purple-500/20 text-center uppercase tracking-wider"
                >
                  Confirmer mon séjour 🏨
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Booking Confirmation Receipt Sheet */}
      {selectedRentalForBooking && bookingSuccessData && (
        <div id="booking-success-sheet" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#06070a]/95 backdrop-blur-md animate-fade-in" style={{ direction: 'ltr' }}>
          <div className="bg-[#161821] border border-emerald-500/30 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-6 md:p-8 space-y-4" style={{ backgroundColor: '#161821' }}>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/35 flex items-center justify-center mx-auto text-emerald-400 text-xl font-bold animate-pulse">
                ✓
              </div>
              <h3 className="font-title font-black text-sm text-white">Réservation confirmée avec MyHost !</h3>
              <p className="text-[10.5px] text-gray-400">Votre quittance numérique souveraine a été enregistrée avec succès.</p>
            </div>

            <div className="bg-black/40 p-4 rounded-2xl border border-white/5 space-y-2 text-xs font-mono text-gray-300">
              <div className="flex justify-between items-center pb-1.5 border-b border-white/5">
                <span className="text-gray-500">Référence séjour :</span>
                <span className="text-white font-bold text-[#e1bcff]">{bookingSuccessData.ref}</span>
              </div>
              <div className="space-y-0.5 text-[10.5px]">
                <p className="truncate text-white font-bold">{bookingSuccessData.propertyTitle}</p>
                <p className="text-gray-400 font-sans">Zone : <b>{bookingSuccessData.propertyDistrict}</b></p>
                <p className="text-gray-400 font-sans">Voyageur : <b>{bookingSuccessData.tenantName}</b></p>
                <p className="text-gray-400 font-sans">Durée : <b>{bookingSuccessData.duration} {bookingSuccessData.type === 'SHORT' ? 'nuit(s)' : 'mois'}</b></p>
                <p className="text-gray-400 font-sans">Date d'arrivée : <b>{bookingSuccessData.checkIn}</b></p>
              </div>
              <div className="flex justify-between items-center pt-1.5 border-t border-white/5">
                <span className="text-gray-500 font-sans">Montant total réglé :</span>
                <span className="text-emerald-400 font-bold">{bookingSuccessData.totalAmount.toLocaleString('fr-FR')} MAD</span>
              </div>
            </div>

            {/* Smart Lock activation indicator */}
            <div className="bg-[#12141c] p-3 rounded-xl border border-purple-500/25 text-center space-y-2">
              <span className="font-mono text-[9px] uppercase bg-purple-500/20 text-[#be8bff] border border-purple-500/20 px-2 py-0.5 rounded font-black tracking-widest">
                🗝️ Smart Lock Pass MyHost
              </span>
              <p className="text-[10px] text-gray-400 font-sans leading-relaxed">
                Voici le code d'accès de nuit à la serrure connectée de cet appartement, valide dès votre arrivée :
              </p>
              <div className="py-2.5 bg-black/50 border border-white/5 rounded-xl text-lg font-black font-mono text-[#be8bff] tracking-wider select-all cursor-pointer">
                {bookingSuccessData.pinCode}
              </div>
              <p className="text-[9px] text-gray-500 italic font-sans leading-tight">
                Entrez ce code sur le digicode de la poignée de l'appartement. Assistance Voyageur MyCity : +212 522-890010 (24h/24)
              </p>
            </div>

            <button
              onClick={() => {
                setSelectedRentalForBooking(null);
                setBookingSuccessData(null);
              }}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-title font-bold text-xs rounded-xl cursor-pointer shadow-lg shadow-emerald-600/10 text-center uppercase tracking-wider"
            >
              Terminer & fermer la quittance
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
