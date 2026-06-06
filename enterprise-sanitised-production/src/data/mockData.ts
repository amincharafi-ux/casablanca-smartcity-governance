import { CityEvent, CitizenClaim, PharmacyDeGarde, HospitalStatus } from "../types";

export const INITIAL_EVENTS: CityEvent[] = [
  {
    id: "evt-1",
    title: "Moroccan Tech Ventures Summit",
    description: "Le grand forum annuel de l'entrepreneuriat technologique marocain. Rencontrez des investisseurs, découvrez les innovations locales et participez aux pitchs d'écosystèmes.",
    category: "ECONOMIC",
    date: new Date().toISOString().split('T')[0], // Today (Jour J)
    isToday: true,
    partnerId: "partner-cat2-1",
    partnerName: "Casablanca Tech Hub",
    isPremiumPartner: true,
    lat: 33.5898,
    lng: -7.6038,
    views: 1240,
    bookingsCount: 420,
    revenue: 125580,
    ticketPrice: 299,
    reviews: [
      { id: "rev-1-1", userName: "Amine S.", rating: 5, comment: "Incroyable initiative pour la jeunesse !", date: "2026-05-24" },
      { id: "rev-1-2", userName: "Sara Benarafa", rating: 4, comment: "Très bon choix d'intervenants.", date: "2026-05-25" }
    ],
    featuredImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: "evt-2",
    title: "Festival Nocturne de Rythmes de l'Anfa",
    description: "Une célébration musicale vibrante réunissant musiciens gnaoua traditionnels et sonorités jazz électroniques sur l'esplanade d'Anfa Park.",
    category: "CULTURE",
    date: new Date().toISOString().split('T')[0], // Today (Jour J)
    isToday: true,
    partnerId: "partner-cat1-1",
    partnerName: "Association Art Anfa",
    isPremiumPartner: false,
    lat: 33.5721,
    lng: -7.6582,
    views: 890,
    bookingsCount: 154,
    revenue: 15400,
    ticketPrice: 100,
    reviews: [
      { id: "rev-2-1", userName: "Driss K.", rating: 5, comment: "Ambiance magique sous les étoiles marocaines !", date: "2026-05-25" }
    ],
    featuredImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: "evt-3",
    title: "Atelier 'Casablanca Verte' & Éco-Citoyenneté",
    description: "Atelier collaboratif pour imaginer des solutions de végétalisation, de recyclage urbain et de micro-compostage de quartier à Sidi Bernoussi.",
    category: "ECO_CSR",
    date: "2026-05-30", // Upcoming
    isToday: false,
    partnerId: "partner-cat2-2",
    partnerName: "EcoAct Maroc",
    isPremiumPartner: true,
    lat: 33.6189,
    lng: -7.5098,
    views: 620,
    bookingsCount: 95,
    revenue: 0, // Free event
    ticketPrice: 0,
    reviews: [],
    featuredImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: "evt-4",
    title: "Semi-Marathon Solidaire",
    description: "Courir pour l'éducation des enfants ruraux. Un parcours magnifique le long de la Corniche de Casablanca à destination du Phare d'El Hank.",
    category: "SPORT",
    date: "2026-06-05", // Upcoming
    isToday: false,
    partnerId: "partner-cat1-2",
    partnerName: "Casa Run League",
    isPremiumPartner: false,
    lat: 33.6067,
    lng: -7.6534,
    views: 2450,
    bookingsCount: 890,
    revenue: 133500,
    ticketPrice: 150,
    reviews: [
      { id: "rev-4-1", userName: "Younes M.", rating: 4, comment: "Parcours superbe, je participe chaque année.", date: "2026-05-20" }
    ],
    featuredImage: "https://images.unsplash.com/photo-1502224562085-639556652f33?w=600&auto=format&fit=crop&q=60"
  }
];

export const INITIAL_CLAIMS: CitizenClaim[] = [
  {
    id: "claim-101",
    citizenName: "Karim El Amri",
    category: "ECLAIRAGE",
    title: "Lampadaire hors-service sur l'Avenue Gauthier",
    description: "Toute la section supérieure de l'allée des palmiers est plongée dans le noir complet depuis 3 nuits. Cela pose des problèmes évidents de sécurité pour les piétons sortant des commerces locaux.",
    status: "OUVERT",
    createdAt: "2026-05-24T18:30:10Z",
    location: "Gauthier, Angle Boulevard d'Anfa",
    replies: []
  },
  {
    id: "claim-102",
    citizenName: "Naima Tazi",
    category: "DECHETS",
    title: "Bennes à ordures débordantes près du Marché Solidaire",
    description: "Accumulation massive de bio-déchets à l'extérieur des bacs bleus sur la chaussée. Les odeurs sont fortes de bon matin et attirent les nuisibles du quartier.",
    status: "EN_COURS",
    createdAt: "2026-05-23T09:12:45Z",
    location: "Maârif Prolongé",
    replies: [
      {
        sender: "MAIRIE",
        message: "Bonjour Mme Tazi, l'alerte a été transmise au service d'exploitation d'hygiène urbaine de Casa Baia. Une équipe d'évacuation d'urgence effectue un passage de benne de renfort cet après-midi.",
        timestamp: "2026-05-23T14:20:00Z"
      }
    ]
  },
  {
    id: "claim-103",
    citizenName: "Houssame S.",
    category: "CHAUSEE",
    title: "Nid-de-poule dangereux sur voie express Sidi Bernoussi",
    description: "Un trou de près de 15cm de profondeur s'est formé dans la sortie de rond-point d'autoroute. C'est extrêmement dangereux pour les deux-roues et fatigue les suspensions.",
    status: "RESOLU",
    createdAt: "2026-05-20T07:15:00Z",
    location: "Rond Point de l'Échangeur Sidi Bernoussi",
    satisfactionScore: 5,
    replies: [
      {
        sender: "MAIRIE",
        message: "L'équipe de l'infrastructure de voirie a rebouché le nid-de-poule avec un enrobé chaud rapide ce jeudi. Le passage est à nouveau totalement sécurisé.",
        timestamp: "2026-05-21T16:00:00Z"
      },
      {
        sender: "CITIZEN",
        message: "Merci beaucoup pour l'intervention ultra rapide ! Le revêtement est parfait.",
        timestamp: "2026-05-22T08:10:00Z"
      }
    ]
  }
];

export const INITIAL_PHARMACIES: PharmacyDeGarde[] = [
  { id: "ph-1", name: "Pharmacie de la Corniche", address: "Boulevard de la Corniche, El Hank", phone: "0522-364589", dutyType: "JOUR", isOpenToday: true },
  { id: "ph-2", name: "Pharmacie du Maârif", address: "Rue Jura, Quartier Maârif", phone: "0522-251436", dutyType: "NUIT", isOpenToday: true },
  { id: "ph-3", name: "Pharmacie d'Anfa", address: "Boulevard d'Anfa, face Hôtel Barcelo", phone: "0522-985412", dutyType: "PERMANENT", isOpenToday: true },
  { id: "ph-4", name: "Pharmacie Atlas", address: "Avenue 2 Mars", phone: "0522-475896", dutyType: "NUIT", isOpenToday: false }
];

export const INITIAL_HOSPITALS: HospitalStatus[] = [
  { id: "hosp-1", name: "CH&U Ibn Rochd (Urgences)", occupancyRate: 88, availableBeds: 14, contact: "0522-484040" },
  { id: "hosp-2", name: "Hôpital Khalifa Bin Zayed", occupancyRate: 64, availableBeds: 38, contact: "0522-989898" },
  { id: "hosp-3", name: "Hôpital Moulay Youssef", occupancyRate: 45, availableBeds: 25, contact: "0522-442200" }
];

export const BLE_NODES = [
  "Noeud-Central-Mairie-01",
  "Casa-TechHub-MeshNode",
  "Maârif-Relais-03",
  "Anfa-Terminal-CityGate",
  "Sidi-Bernoussi-Relais-09"
];
