import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Phone, 
  Globe, 
  Award, 
  Activity, 
  Heart, 
  Sparkles, 
  ChevronRight, 
  Filter, 
  Calendar, 
  CheckCircle2, 
  Users, 
  Dribbble, 
  Leaf, 
  Palette, 
  Coffee, 
  BookOpen,
  UtensilsCrossed,
  Clock,
  Briefcase,
  Star,
  Check,
  X,
  FileText,
  MessageSquare,
  Plus,
  Send,
  ChevronDown,
} from 'lucide-react';
import { LanguageCode, translations as globalTranslations } from '../../data/translations';
import { CityEvent } from '../../types';

// Interactive Review interface
interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

// Service Provider interface incorporating explicit requirements:
// ⭐ avis vérifiés
// ⭐ prestataires certifiés
// ⭐ demande de devis
interface Provider {
  id: string;
  categoryId: number; // 1 to 8
  subCategory: string; // strict matching of user requested subcategories
  name: string;
  neighborhood: string; // Casablanca neighborhood (Gauthier, Maarif, Bourgogne, Anfa, Ain Diab, Bouskoura, Dar Bouazza, Mohammedia)
  address: string;
  phone: string;
  website: string;
  rating: number; // calculated from reviews
  certified: boolean; // ⭐ prestataires certifiés
  highlight: string;
  description: string;
  reviews: Review[]; // ⭐ avis vérifiés
}

interface Category {
  id: number;
  name: string;
  emoji: string;
  color: string;
  description: string;
  subCategories: string[];
}

// Define the 8 main categories requested by the user
const CATEGORIES_DATA: Category[] = [
  {
    id: 1,
    name: "Sport & Activités",
    emoji: "🏃‍♂️",
    color: "from-blue-500/10 to-indigo-500/10 border-blue-500/30 text-blue-400",
    description: "Trouvez vos clubs, coachs et réservez des terrains",
    subCategories: [
      "Clubs & fédérations",
      "Salles de sport",
      "Coachs",
      "Running, vélo, randonnées",
      "Réservation terrains (padel, foot, tennis…)",
      "Activités enfants"
    ]
  },
  {
    id: 2,
    name: "Santé & Bien-être",
    emoji: "🌿",
    color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/30 text-emerald-400",
    description: "Prenez soin de votre corps et équilibre d'esprit",
    subCategories: [
      "Médecins / cliniques partenaires",
      "Pharmacies de garde",
      "Nutritionnistes",
      "Psychologues",
      "Spa / hammam",
      "Salons beauté",
      "Yoga / méditation",
      "Thérapies alternatives validées"
    ]
  },
  {
    id: 3,
    name: "Culture & Sorties",
    emoji: "🎭",
    color: "from-purple-500/10 to-pink-500/10 border-purple-500/30 text-purple-400",
    description: "Événements, cinémas, musées et cours thématiques",
    subCategories: [
      "Cinéma",
      "Théâtre",
      "Concerts",
      "Musées",
      "Expositions",
      "Festivals",
      "Cours (photo, cuisine, langues…)"
    ]
  },
  {
    id: 4,
    name: "Famille & Enfants",
    emoji: "👨‍👩‍👧",
    color: "from-pink-500/10 to-red-500/10 border-pink-500/30 text-pink-300",
    description: "Soutien scolaire, crèches, ateliers et activités week-end",
    subCategories: [
      "Activités enfants week-end",
      "Colonies",
      "Clubs vacances",
      "Soutien scolaire",
      "Crèches",
      "Anniversaires",
      "Orthophonistes / spécialistes enfants",
      "Aires de jeux",
      "Bons plans parents"
    ]
  },
  {
    id: 5,
    name: "Restaurants & Food",
    emoji: "🍽️",
    color: "from-amber-500/10 to-orange-500/10 border-amber-500/30 text-amber-400",
    description: "Gastronomie locale, traiteurs et pâtisseries fines",
    subCategories: [
      "Restaurants",
      "Cafés",
      "Brunch",
      "Traiteurs",
      "Pâtisseries"
    ]
  },
  {
    id: 6,
    name: "Shopping & Commerces",
    emoji: "🛍️",
    color: "from-rose-500/10 to-red-500/10 border-rose-500/30 text-rose-400",
    description: "Boutiques, concept stores et promotions de quartier",
    subCategories: [
      "Boutiques",
      "Concept stores",
      "Promotions quartier",
      "Artisans",
      "Marchés",
      "Terroir"
    ]
  },
  {
    id: 7,
    name: "Animaux",
    emoji: "🐶",
    color: "from-orange-500/10 to-amber-500/10 border-orange-500/30 text-orange-400",
    description: "Prestations vétérinaires, toilettage, pension et balade",
    subCategories: [
      "Vétérinaires",
      "Toilettage",
      "Pension",
      "Adoption",
      "Promeneurs"
    ]
  },
  {
    id: 8,
    name: "Maison & Services",
    emoji: "🏠",
    color: "from-cyan-500/10 to-blue-500/10 border-cyan-500/30 text-cyan-400",
    description: "Artisans qualifiés, dépannages et petits travaux",
    subCategories: [
      "Plombier",
      "Électricien",
      "Femme de ménage",
      "Jardinier",
      "Climatisation",
      "Réparation électroménager",
      "Déménagement",
      "Décoration",
      "Architectes",
      "Petits travaux"
    ]
  }
];

// Rich, hyper-realistic, localized database for Casablanca (and surroundings)
const PROVIDERS_DATABASE: Provider[] = [
  // --- SPORT & ACTIVITES (categoryId: 1) ---
  {
    id: "p1-1",
    categoryId: 1,
    subCategory: "Clubs & fédérations",
    name: "Fédération Royale Marocaine de Padel (FRM-Padel)",
    neighborhood: "Anfa",
    address: "Complexe Sportif Municipal, Rue Abderrahmane el Ghafiki, Casablanca",
    phone: "+212 522-981240",
    website: "www.frmt.ma/padel",
    rating: 4.8,
    certified: true,
    highlight: "Organisme Officiel National",
    description: "Soutien et encadrement aux clubs amateurs, licences officielles, organisation du circuit Casa-Padel Tour.",
    reviews: [
      { id: "r1-1-1", author: "Youssef B.", rating: 5, date: "15 Mai 2026", comment: "Excellent travail d'encadrement des nouveaux clubs sur Casablanca." },
      { id: "r1-1-2", author: "Karim A.", rating: 4, date: "2 Avril 2026", comment: "Réponse téléphonique rapide concernant les affiliations de tournois." }
    ]
  },
  {
    id: "p1-2",
    categoryId: 1,
    subCategory: "Salles de sport",
    name: "Passage Fitness Gauthier",
    neighborhood: "Gauthier",
    address: "Rue Jean Jaurès, Résidence Al-Manar, Casablanca",
    phone: "+212 522-274020",
    website: "www.passagefitness.ma",
    rating: 4.9,
    certified: true,
    highlight: "Plateau Premium & Coachs de haut niveau",
    description: "Plus de 2000m² dédiés au fitness, musculation moderne, cardio connecté, et cours collectifs originaux dans un cadre sécuritaire d'exception.",
    reviews: [
      { id: "r1-2-1", author: "Sarah M.", rating: 5, date: "28 Mai 2026", comment: "La meilleure salle de Gauthier. Propreté impeccable et coachs à l'écoute." },
      { id: "r1-2-2", author: "Hamza T.", rating: 5, date: "12 Avril 2026", comment: "Matériel dernier cri. Le prix en vaut largement la chandelle !" }
    ]
  },
  {
    id: "p1-3",
    categoryId: 1,
    subCategory: "Coachs",
    name: "Coach Reda - Préparation Physique",
    neighborhood: "Anfa",
    address: "Stade d'Anfa, Boulevard Franklin Roosevelt, Casablanca",
    phone: "+212 661-893041",
    website: "www.reda-coachcasa.ma",
    rating: 4.7,
    certified: true,
    highlight: "Perte de poids & Remise en forme",
    description: "Coaching particulier ou en petit groupe. Programmes nutritionnels sur mesure et suivi digital hebdomadaire pour garantir vos objectifs.",
    reviews: [
      { id: "r1-3-1", author: "Anas L.", rating: 5, date: "20 Mai 2026", comment: "Super pédagogue, m'a aidé à perdre 12 kilos en 4 mois de manière saine." },
      { id: "r1-3-2", author: "Ghita B.", rating: 4, date: "7 Mars 2026", comment: "Méthode rigoureuse et bienveillante. Je recommande vivement !" }
    ]
  },
  {
    id: "p1-4",
    categoryId: 1,
    subCategory: "Running, vélo, randonnées",
    name: "Bouskoura Forest Trail Club",
    neighborhood: "Bouskoura",
    address: "Forêt de Bouskoura, Point Accueil Santé, Casablanca",
    phone: "+212 660-452290",
    website: "www.bouskoura-runners.com",
    rating: 4.8,
    certified: true,
    highlight: "Sorties hebdomadaires gratuites en communauté",
    description: "Regroupement de passionnés pour des sorties de trail, courses forestières, VTT et randonnées écologiques sous les eucalyptus de la Ville Verte.",
    reviews: [
      { id: "r1-4-1", author: "Rania H.", rating: 5, date: "1 Juin 2026", comment: "Ambiance géniale le dimanche matin. Parfait pour respirer du bon air !" }
    ]
  },
  {
    id: "p1-5",
    categoryId: 1,
    subCategory: "Réservation terrains (padel, foot, tennis…)",
    name: "Padel Oasis Club & Football Hub",
    neighborhood: "L'Oasis",
    address: "Boulevard de l'Oasis, près de la gare, Casablanca",
    phone: "+212 522-258810",
    website: "www.padeloasis.ma",
    rating: 4.6,
    certified: true,
    highlight: "Réservation instantanée & Terrains de qualité olympique",
    description: "6 pistes de padel éclairées en bleu panoramique et 2 terrains de foot à 5 en gazon synthétique haut de gamme.",
    reviews: [
      { id: "r1-5-1", author: "Nabil S.", rating: 4, date: "29 Avril 2026", comment: "Les pistes sont superbes. Bon accueil par l'équipe." }
    ]
  },
  {
    id: "p1-6",
    categoryId: 1,
    subCategory: "Activités enfants",
    name: "Kids Sports Academy Casa",
    neighborhood: "Ain Diab",
    address: "Boulevard de la Corniche, Complexe Paradise, Casablanca",
    phone: "+212 522-791015",
    website: "www.kidssports.ma",
    rating: 4.9,
    certified: true,
    highlight: "Multi-sports de 4 à 14 ans",
    description: "Éveil psychomoteur, initiation au tennis, basket-ball et gymnastique douce encadrée par des éducateurs diplômés d'État.",
    reviews: [
      { id: "r1-6-1", author: "Amal J.", rating: 5, date: "3 Mai 2026", comment: "Mes enfants adorent l'académie de tennis le mercredi après-midi. Éducateurs adorables." }
    ]
  },

  // --- SANTE & BIEN-ETRE (categoryId: 2) ---
  {
    id: "p2-1",
    categoryId: 2,
    subCategory: "Médecins / cliniques partenaires",
    name: "Cabinet de Médecine Intégrative - Dr El Fassi",
    neighborhood: "Gauthier",
    address: "Boulevard d'Anfa, Imm. B, 3ème étage, Casablanca",
    phone: "+212 522-489012",
    website: "www.drelfassi-integrative.ma",
    rating: 4.8,
    certified: true,
    highlight: "Souveraineté des soins & Médecine globale",
    description: "Prise en charge personnalisée alliant médecine conventionnelle, bilans biologiques de pointe et nutrition d'avant-garde.",
    reviews: [
      { id: "r2-1-1", author: "Mariam F.", rating: 5, date: "22 Mai 2026", comment: "Un médecin exceptionnel qui prend le temps de comprendre la cause globale." }
    ]
  },
  {
    id: "p2-2",
    categoryId: 2,
    subCategory: "Pharmacies de garde",
    name: "Pharmacie Principale de l'Avenue",
    neighborhood: "Bourgogne",
    address: "88 Boulevard de Bourgogne, Angle Boulevard Moulay Youssef, Casablanca",
    phone: "+212 522-390455",
    website: "www.pharmaciedefrance.ma/garde",
    rating: 4.9,
    certified: true,
    highlight: "Ouverte 24h/24 & 7j/7 - Stock complet d'urgence",
    description: "Pharmacie centrale connectée à la base de santé souveraine de MyCity. Équipe d'officine expérimentée pour les dispensations d'urgence.",
    reviews: [
      { id: "r2-2-1", author: "Tariq O.", rating: 5, date: "30 Mai 2026", comment: "Toujours ouverte, service d'urgence irréprochable au milieu de la nuit." }
    ]
  },
  {
    id: "p2-3",
    categoryId: 2,
    subCategory: "Nutritionnistes",
    name: "Inès Bensouda - Diététicienne & Nutrition",
    neighborhood: "Maarif",
    address: "Rue Taha Hussein, Résidence Sofia, Casablanca",
    phone: "+212 522-985011",
    website: "www.inesbensouda-nutrition.ma",
    rating: 4.7,
    certified: true,
    highlight: "Rééquilibrage alimentaire sans frustration",
    description: "Spécialiste en micronutrition et accompagnement métabolique. Impédancemétrie médicale et applications mobiles de suivi de repas.",
    reviews: [
      { id: "r2-3-1", author: "Fouad K.", rating: 4, date: "15 Avril 2026", comment: "Résultats mesurables très rapidement. Conseils nutritionnels intelligents." }
    ]
  },
  {
    id: "p2-4",
    categoryId: 2,
    subCategory: "Psychologues",
    name: "Dr. Leila Amrani - Thérapies Cognitives (TCC)",
    neighborhood: "Bourgogne",
    address: "Avenue Hassan II, Résidence El-Yasmine, Casablanca",
    phone: "+212 522-261205",
    website: "www.drleilaamrani.ma",
    rating: 4.9,
    certified: true,
    highlight: "Gestion du stress urbain & Burnout",
    description: "Cabinet d'accompagnement psychologique pour adultes et couples. Sessions de pleine conscience cliniques individuelles.",
    reviews: [
      { id: "r2-4-1", author: "Soumia B.", rating: 5, date: "24 Mai 2026", comment: "Une thérapeute extrêmement fine et bienveillante. M'a beaucoup aidée face au surmenage." }
    ]
  },
  {
    id: "p2-5",
    categoryId: 2,
    subCategory: "Spa / hammam",
    name: "Hammam & Spa Les Jardins d'Anfa",
    neighborhood: "Ain Diab",
    address: "Boulevard d'Anfa Littoral, Casablanca",
    phone: "+212 522-364402",
    website: "www.lesjardinsdanfa-spa.ma",
    rating: 5.0,
    certified: true,
    highlight: "Soin Royal au savon noir de l'Atlas & Bain de vapeur",
    description: "Dans un magnifique décor en zelliges traditionnels de Fès, profitez d'un hammam purifiant et d'un massage drainant à l'huile pure d'argan bio d'Essaouira.",
    reviews: [
      { id: "r2-5-1", author: "Isabelle G.", rating: 5, date: "18 Mai 2026", comment: "Expérience magique. Le gommage traditionnel est d'une sérénité absolue." },
      { id: "r2-5-2", author: "Khalid M.", rating: 5, date: "4 Mai 2026", comment: "Un cadre reposant, accueil et massages d'un professionnalisme rare." }
    ]
  },
  {
    id: "p2-6",
    categoryId: 2,
    subCategory: "Salons beauté",
    name: "Salon de Beauté Maison d'Eden",
    neighborhood: "Gauthier",
    address: "Rue Jean Jaurès, Résidence Fleurie, Casablanca",
    phone: "+212 522-271510",
    website: "www.maisondeden-beauty.ma",
    rating: 4.6,
    certified: true,
    highlight: "Soins capillaires organiques & Esthétique",
    description: "Maison de beauté haut de gamme utilisant exclusivement des huiles et pigments végétaux naturels, propices à la santé cutanée capillaire.",
    reviews: [
      { id: "r2-6-1", author: "Nora D.", rating: 4, date: "10 Avril 2026", comment: "Très bon salon de coiffure bio. Ambiance de calme propice." }
    ]
  },
  {
    id: "p2-7",
    categoryId: 2,
    subCategory: "Yoga / méditation",
    name: "Studio Om Yoga",
    neighborhood: "Bouskoura",
    address: "Bouskoura Golf City, Casablanca",
    phone: "+212 522-320490",
    website: "www.omyogabouskoura.ma",
    rating: 4.8,
    certified: true,
    highlight: "Kundalini, Vinyasa & Méditation sonore gongs",
    description: "Havre de paix verdoyant au sein de la ville verte. Cours collectifs en salle lumineuse ouverte sur les arbres forestiers, ainsi que des ateliers détox.",
    reviews: [
      { id: "r2-7-1", author: "Zineb F.", rating: 5, date: "2 Juin 2026", comment: "Pratiquer le yoga face aux arbres de la forêt de Bouskoura est une sensation incroyable." }
    ]
  },
  {
    id: "p2-8",
    categoryId: 2,
    subCategory: "Thérapies alternatives validées",
    name: "Centre d'Ostéopathie & d'Acupuncture de Casablanca",
    neighborhood: "Gauthier",
    address: "Angle Boulevard Zerktouni & Rue Omar El Mokhtar, Casablanca",
    phone: "+212 522-475890",
    website: "www.osteopathe-acupuncture-casa.ma",
    rating: 4.7,
    certified: true,
    highlight: "Praticiens agréés & protocoles validés scientifiquement",
    description: "Thérapies de soulagement ostéopathiques et acupuncture traditionnelle chinoise pour réguler le stress urbain, l'insomnie et les contractures cervicales.",
    reviews: [
      { id: "r2-8-1", author: "Ayoub V.", rating: 5, date: "14 Mai 2026", comment: "Séance d'ostéopathie très efficace pour mes douleurs lombaires chroniques." }
    ]
  },

  // --- CULTURE & SORTIES (categoryId: 3) ---
  {
    id: "p3-1",
    categoryId: 3,
    subCategory: "Cinéma",
    name: "Al-Massira Imax Theatre",
    neighborhood: "Ain Diab",
    address: "Morocco Mall, Corniche de Casablanca",
    phone: "+212 522-792015",
    website: "www.massiraimax.ma",
    rating: 4.7,
    certified: true,
    highlight: "Cinéma 3D Géant & Son immersif",
    description: "Profitez des dernières sorties cinématographiques mondiales et de documentaires scientifiques en très haute définition Imax.",
    reviews: [
      { id: "r3-1-1", author: "Yassine R.", rating: 5, date: "15 Mai 2026", comment: "La meilleure expérience cinéma du Royaume, sans aucun doute." }
    ]
  },
  {
    id: "p3-2",
    categoryId: 3,
    subCategory: "Théâtre",
    name: "Théâtre du Complexe Mohamed VI",
    neighborhood: "Maarif",
    address: "Boulevard Bir Anzarane, Casablanca",
    phone: "+212 522-990140",
    website: "www.theatrecasablanca.ma",
    rating: 4.8,
    certified: true,
    highlight: "Pièces locales réputées & troupes rattachées de Casablanca",
    description: "Scène dramatique d'envergure, accueillant des comédies populaires marocaines d'auteurs engagés de la métropole.",
    reviews: [
      { id: "r3-2-1", author: "Fatima Z.", rating: 5, date: "1 Mai 2026", comment: "Toujours d'excellentes pièces programmées le week-end." }
    ]
  },
  {
    id: "p3-3",
    categoryId: 3,
    subCategory: "Concerts",
    name: "La scène musicale Casa-Port Live",
    neighborhood: "Centre-Ville",
    address: "Esplanade de la nouvelle marina, Casablanca",
    phone: "+212 522-421100",
    website: "www.marinalivemusic.ma",
    rating: 4.5,
    certified: true,
    highlight: "Concerts acoustiques gratuits au bord de mer",
    description: "Des rencontres musicales mensuelles mettant en valeur la jeune garde de la musique marocaine alternative, du jazz fusion et du gnaoua métissé.",
    reviews: []
  },
  {
    id: "p3-4",
    categoryId: 3,
    subCategory: "Musées",
    name: "Musée de la Fondation Abderrahman Slaoui",
    neighborhood: "Gauthier",
    address: "12 Rue du Parc, Quartier Gauthier, Casablanca",
    phone: "+212 522-206217",
    website: "www.museeslaoui.ma",
    rating: 4.9,
    certified: true,
    highlight: "Manuscrits précieux & Affiches de collection du Maroc",
    description: "Une superbe maison d'époque abritant des collections d'art islamique exceptionnelles, des bijoux en ambre saharien originaux et des peintures d'archives.",
    reviews: [
      { id: "r3-4-1", author: "Jean-Pierre D.", rating: 5, date: "10 Mai 2026", comment: "Un joyau culturel secret de Casablanca. À visiter absolument de passage." }
    ]
  },
  {
    id: "p3-5",
    categoryId: 3,
    subCategory: "Expositions",
    name: "Villa des Arts de Casablanca Zone - Fondation ONA",
    neighborhood: "Bourgogne",
    address: "29 Rue d'Alger, Quartier Bourgogne, Casablanca",
    phone: "+212 522-295080",
    website: "www.villadesarts-casa.ma",
    rating: 4.8,
    certified: true,
    highlight: "Expositions d'art contemporain gratuites",
    description: "Espace pluridisciplinaire d'expositions pour les artistes contemporains d'Afrique de l'Ouest et du bassin méditerranéen.",
    reviews: [
      { id: "r3-5-1", author: "Ines G.", rating: 4, date: "14 Avril 2026", comment: "Superbe jardin art déco, très belles expositions d'artistes locaux." }
    ]
  },
  {
    id: "p3-6",
    categoryId: 3,
    subCategory: "Festivals",
    name: "Jazzablanca Festival",
    neighborhood: "Anfa",
    address: "Hippodrome de Casablanca-Anfa, Casablanca",
    phone: "+212 522-390500",
    website: "www.jazzablanca.com",
    rating: 4.9,
    certified: true,
    highlight: "Le rendez-vous annuel du Jazz de Casablanca",
    description: "Scènes d'exception réunissant stars internationales de la soul et du blues et innovations musicales métissées en plein cœur d'Anfa.",
    reviews: [
      { id: "r3-6-1", author: "Mehdi L.", rating: 5, date: "3 Juin 2026", comment: "Ambiance inoubliable chaque année à l'hippodrome !" }
    ]
  },
  {
    id: "p3-7",
    categoryId: 3,
    subCategory: "Cours (photo, cuisine, langues…)",
    name: "Atelier Créatif Maârif - Beaux Arts & Photo",
    neighborhood: "Maarif",
    address: "Rue Jean Jaurès, Résidence Al-Moustakbal, Casablanca",
    phone: "+212 662-301140",
    website: "www.ateliercreatif-casa.ma",
    rating: 4.9,
    certified: true,
    highlight: "Cours pratiques adultes & adolescents",
    description: "Ateliers intensifs en photographie de rue analogique, cours de cuisine marocaine traditionnelle de terroir et apprentissage des langues orientales.",
    reviews: [
      { id: "r3-7-1", author: "Hanae F.", rating: 5, date: "10 Mai 2026", comment: "Le cours de photo de rue de Casablanca est juste fascinant !" }
    ]
  },

  // --- FAMILLE & ENFANTS (categoryId: 4) ---
  {
    id: "p4-1",
    categoryId: 4,
    subCategory: "Activités enfants week-end",
    name: "L'Île aux Trésors - Café Poussette & Jeux",
    neighborhood: "Gauthier",
    address: "Rue Omar El Mokhtar, Casablanca",
    phone: "+212 522-261541",
    website: "www.lileauxtresors-casa.ma",
    rating: 4.8,
    certified: true,
    highlight: "Jeux éducatifs & Pâtisseries saines adaptées",
    description: "Espace d'éveil sécurisé, théâtres de marionnettes, ateliers d'argile de Safi et éveil sensoriel pour tout-petits.",
    reviews: []
  },
  {
    id: "p4-2",
    categoryId: 4,
    subCategory: "Colonies",
    name: "Atlas Aventure - Colonies Nature Écologique",
    neighborhood: "Bouskoura",
    address: "Forêt de Bouskoura / Bureau d'Anscription Maarif",
    phone: "+212 522-901122",
    website: "www.atlas-aventurecolonie.ma",
    rating: 4.7,
    certified: true,
    highlight: "Immersion forestière de 8 à 15 ans",
    description: "Séjours de vacances orientés survie verte, orientation sylvestre, potager bio et sensibilisation à la préservation des nappes phréatiques du Maroc.",
    reviews: [
      { id: "r4-2-1", author: "Salma S.", rating: 5, date: "16 Mai 2026", comment: "Mon fils en est revenu enchanté. Grand sérieux de l'équipe de mono." }
    ]
  },
  {
    id: "p4-3",
    categoryId: 4,
    subCategory: "Soutien scolaire",
    name: "Académie Pythagore - Cours Scientifiques",
    neighborhood: "Sidi Maârouf",
    address: "A côté de Casanearshore, Résidence Les Palmiers, Casablanca",
    phone: "+212 522-805011",
    website: "www.pythagore-scolaire.ma",
    rating: 4.8,
    certified: true,
    highlight: "Classes de mathématiques & physique adaptées",
    description: "Préparation rigoureuse aux examens nationaux et baccalauréats internationaux avec des professeurs de classes préparatoires réputés.",
    reviews: []
  },
  {
    id: "p4-4",
    categoryId: 4,
    subCategory: "Crèches",
    name: "Le Berceau de Gauthier - Micro-Crèche Verte",
    neighborhood: "Gauthier",
    address: "Angle Rue de Dijon et Rue d'Alger, Casablanca",
    phone: "+212 522-230490",
    website: "www.leberceau-gauthier.ma",
    rating: 4.9,
    certified: true,
    highlight: "Matériaux écologiques & alimentation 100% bio",
    description: "Accueil chaleureux, bilingue Français-Arabe classique, motricité d'inspiration Montessori pour un épanouissement harmonieux.",
    reviews: [
      { id: "r4-4-1", author: "Meryem A.", rating: 5, date: "1 Juin 2026", comment: "Le personnel est d'une tendresse infinie. Un immense soulagement de laisser mon bébé ici." }
    ]
  },
  {
    id: "p4-5",
    categoryId: 4,
    subCategory: "Anniversaires",
    name: "Casakids Events & Châteaux Gonflables",
    neighborhood: "Bourgogne",
    address: "Avenue de Bordeaux, Casablanca",
    phone: "+212 661-480922",
    website: "www.casakidsevents.ma",
    rating: 4.6,
    certified: true,
    highlight: "Animation clé-en-main sur mesure",
    description: "Décorations thématiques magiques, animateurs professionnels maquilleurs, magiciens de théâtre d'enfance et gâteaux de créateurs.",
    reviews: []
  },
  {
    id: "p4-6",
    categoryId: 4,
    subCategory: "Orthophonistes / spécialistes enfants",
    name: "Cabinet de Spécialités Pédiatriques Dr Amina Touimi",
    neighborhood: "Anfa",
    address: "Boulevard d'Anfa, Imm. Pasteur, Casablanca",
    phone: "+212 522-368599",
    website: "www.touimi-orthophonie-enfants.ma",
    rating: 4.9,
    certified: true,
    highlight: "Orthophonie fine & psychomotricité",
    description: "Bilan global du langage, prises en charge des retards de parole et d'audition infantile dans un cadre calme, rassurant et ludique.",
    reviews: [
      { id: "r4-6-1", author: "Wafaa B.", rating: 5, date: "12 Avril 2026", comment: "Dr Touimi a fait des miracles avec ma fille. Très grande patience." }
    ]
  },

  // --- RESTAURANTS & FOOD (categoryId: 5) ---
  {
    id: "p5-1",
    categoryId: 5,
    subCategory: "Restaurants",
    name: "La Table de Gauthier - Trattoria Organic",
    neighborhood: "Gauthier",
    address: "33 Rue Omar El Mokhtar, Casablanca",
    phone: "+212 522-262728",
    website: "www.latabledegauthier.ma",
    rating: 4.9,
    certified: true,
    highlight: "Cuisine méditerranéenne saine de terroir",
    description: "Une table réputée associant le raffinement de la gastronomie italienne aux produits frais de coopératives paysannes d'Ifrane.",
    reviews: [
      { id: "r5-1-1", author: "Amine C.", rating: 5, date: "3 Juin 2026", comment: "Une cuisine succulente et un service impeccable dans l'arrière-cour." },
      { id: "r5-1-2", author: "Layla P.", rating: 4, date: "24 Mai 2026", comment: "Plats originaux et excellente séléctions d'huiles d'olive." }
    ]
  },
  {
    id: "p5-2",
    categoryId: 5,
    subCategory: "Cafés",
    name: "Café de Flore - Maârif Littéraire",
    neighborhood: "Maarif",
    address: "Rue Taha Hussein, Casablanca",
    phone: "+212 522-984022",
    website: "www.cafedeflorecasa.ma",
    rating: 4.8,
    certified: true,
    highlight: "Cafés de spécialité torréfiés localement & Librairie",
    description: "Ambiance vintage parisienne et marocaine littéraire combinée, idéale pour la lecture, l'étude ou les rencontres professionnelles.",
    reviews: [
      { id: "r5-2-1", author: "Mehdi K.", rating: 5, date: "15 Mai 2026", comment: "Espressos d'exception et calme idéal pour travailler en matinée." }
    ]
  },
  {
    id: "p5-3",
    categoryId: 5,
    subCategory: "Brunch",
    name: "Cozy Brunch Oasis d'Hélios",
    neighborhood: "L'Oasis",
    address: "Résidence Les Jardins d'Oasis, Casablanca",
    phone: "+212 522-254410",
    website: "www.oasisbrunchhelios.ma",
    rating: 4.9,
    certified: true,
    highlight: "Brunch dominical d'exception à base d'Argan & Safran",
    description: "Savourez des pancakes légers au msemmen marocain, miels sauvages et œufs fermiers biologiques locaux de Benslimane.",
    reviews: [
      { id: "r5-3-1", author: "Fatima G.", rating: 5, date: "31 Mai 2026", comment: "Copieux, sain et d'une fraîcheur absolue. Pensez à réserver !" }
    ]
  },
  {
    id: "p5-4",
    categoryId: 5,
    subCategory: "Pâtisseries",
    name: "Pâtisserie Amoud Bourgogne",
    neighborhood: "Bourgogne",
    address: "Boulevard de Bourgogne, Casablanca",
    phone: "+212 522-390400",
    website: "www.amoud.ma",
    rating: 4.9,
    certified: true,
    highlight: "Institution pâtissière nationale",
    description: "Reconnue pour ses légendaires brioches aux amandes, chocolats d'exception et spécialités boulangères artisanales de Casablanca.",
    reviews: [
      { id: "r5-4-1", author: "Zineb B.", rating: 5, date: "1 Juin 2026", comment: "Amoud reste l'incontournable absolu pour les cérémonies de mariage et délices sucrés." }
    ]
  },

  // --- SHOPPING & COMMERCES (categoryId: 6) ---
  {
    id: "p6-1",
    categoryId: 6,
    subCategory: "Boutiques",
    name: "Maison de l'Argan Certifiée & Terroir",
    neighborhood: "Gauthier",
    address: "Rue de Dijon, Gauthier, Casablanca",
    phone: "+212 522-265140",
    website: "www.maisonargancertifiee.ma",
    rating: 4.9,
    certified: true,
    highlight: "Cosmétiques & Huiles de coopératives d'Essaouira",
    description: "Approvisionnement éthique direct, sans intermédiaire. Huiles d'argan cosmétique et alimentaire certifiées pures par la souveraineté écolo locale.",
    reviews: [
      { id: "r6-1-1", author: "Celine M.", rating: 5, date: "24 Mai 2026", comment: "Le miel d'oranger de coopérative est incroyable de parfum !" }
    ]
  },
  {
    id: "p6-2",
    categoryId: 6,
    subCategory: "Concept stores",
    name: "Anfa Place Craft & Modernity Concept Store",
    neighborhood: "Ain Diab",
    address: "Centre Commercial Anfa Place, Casablanca",
    phone: "+212 522-200490",
    website: "www.anfaplacecraft.ma",
    rating: 4.8,
    certified: true,
    highlight: "Designers marocains contemporains",
    description: "Maroquinerie d'art moderne réinventée, luminaires d'artisans de Marrakech et prêt-à-porter éco-conçu en coton marocain biologique.",
    reviews: []
  },
  {
    id: "p6-3",
    categoryId: 6,
    subCategory: "Marchés",
    name: "Le Marché Solidaire de l'Oasis de Casablanca",
    neighborhood: "L'Oasis",
    address: "Gare de l'Oasis, Esplanade d'entrée, Casablanca",
    phone: "+212 522-259011",
    website: "www.marchesolidaireoasis.ma",
    rating: 4.9,
    certified: true,
    highlight: "Plus de 8000 produits de terroirs marocains",
    description: "Haut-lieu éco-énergétique national géré par la Fondation Mohammed V pour la Solidarité réunissant le travail de coopératives engagées féminines.",
    reviews: [
      { id: "r6-3-1", author: "Aicha B.", rating: 5, date: "28 Mai 2026", comment: "Tout est certifié d'origine marocaine. Les prix reviennent directement aux coopératives." }
    ]
  },

  // --- ANIMAUX (categoryId: 7) ---
  {
    id: "p7-1",
    categoryId: 7,
    subCategory: "Vétérinaires",
    name: "Clinique Vétérinaire des Palmiers - Dr Naciri",
    neighborhood: "Anfa",
    address: "Boulevard Franklin Roosevelt, Casablanca",
    phone: "+212 522-368512",
    website: "www.drnaciri-vet.ma",
    rating: 4.9,
    certified: true,
    highlight: "Chirurgie & Urgences vétérinaires 24h/24",
    description: "Clinique moderne équipée d'une imagerie par résonance magnétique et de boxes de soin chauffés de haute physiologie animale.",
    reviews: [
      { id: "r7-1-1", author: "Othmane K.", rating: 5, date: "15 Mai 2026", comment: "Dr Naciri a sauvé mon berger allemand d'un foudroiement gastrique. Professionnalisme hors norme." }
    ]
  },
  {
    id: "p7-2",
    categoryId: 7,
    subCategory: "Toilettage",
    name: "Toilettage Canin Le Chien Sophistiqué",
    neighborhood: "Gauthier",
    address: "Angle Boulevard Zerktouni & Rue Omar El Mokhtar, Casablanca",
    phone: "+212 522-261545",
    website: "www.chiensophistique-casa.ma",
    rating: 4.8,
    certified: true,
    highlight: "Soins d'hygiène douce aux huiles d'argan",
    description: "Coupe ciseaux délicate, bain désinfectant antiparasitaire protecteur et taille des griffes pour chiens de petite et grande morphologie.",
    reviews: []
  },
  {
    id: "p7-3",
    categoryId: 7,
    subCategory: "Pension",
    name: "Pension Canine Forêt Verte de Bouskoura",
    neighborhood: "Bouskoura",
    address: "Sidi Bouskoura Est, Terrain Rural, Casablanca",
    phone: "+212 662-411200",
    website: "www.pensioncaninebouskoura.ma",
    rating: 4.9,
    certified: true,
    highlight: "Parcs de détente végétalisés extérieurs",
    description: "Éducateurs présents en permanence, alimentation haut de gamme, et balades en pleine forêt deux fois par jour.",
    reviews: [
      { id: "r7-3-1", author: "Rachid G.", rating: 5, date: "20 Mai 2026", comment: "Mon dalmatien y séjourne pendant mes voyages d'affaires. Des vidéos me sont envoyées tous les jours." }
    ]
  },

  // --- MAISON & SERVICES (categoryId: 8) ---
  {
    id: "p8-1",
    categoryId: 8,
    subCategory: "Plombier",
    name: "Allo Plomberie Rapide - Hassan & Fils",
    neighborhood: "Bourgogne",
    address: "Angle Boulevard Moulay Youssef, Casablanca",
    phone: "+212 661-390412",
    website: "www.hassan-plomberierapide.ma",
    rating: 4.8,
    certified: true,
    highlight: "Déplacement offert pour Devis & Dépannage en 30 minutes",
    description: "Spécialiste en recherche de fuites invisibles d'eau par caméra acoustique, débouchage mécanique lourd et étanchéité des terrasses de Casa.",
    reviews: [
      { id: "r8-1-1", author: "Chakib B.", rating: 5, date: "2 Juin 2026", comment: "Intervenu en urgence pour une rupture de canalisation. Réparation propre et sans bavures." },
      { id: "r8-1-2", author: "Amine S.", rating: 4, date: "10 Mai 2026", comment: "Honnête et ponctuel. Le tarif a été annoncé avant de percer." }
    ]
  },
  {
    id: "p8-2",
    categoryId: 8,
    subCategory: "Électricien",
    name: "Rachid Électrotechnique Générale",
    neighborhood: "Maarif",
    address: "Angle Boulevard Bir Anzarane, Casablanca",
    phone: "+212 660-254011",
    website: "www.rachidcasa-electricite.ma",
    rating: 4.7,
    certified: true,
    highlight: "Mise aux normes NF, domotique de sécurité",
    description: "Installations de détecteurs d'incendies, rénovations complètes de tableaux électriques désuets, pose de climatiseurs légers.",
    reviews: [
      { id: "r8-2-1", author: "Latifa A.", rating: 5, date: "14 Avril 2026", comment: "Très pro, a ré-équipé tout mon salon avec des dalles LED esthétiques." }
    ]
  },
  {
    id: "p8-3",
    categoryId: 8,
    subCategory: "Femme de ménage",
    name: "Clean Home Casablanca Services Premium",
    neighborhood: "Anfa",
    address: "Boulevard Roosevelt, Résidence Palmeraie, Casablanca",
    phone: "+212 522-390499",
    website: "www.cleanhome-casa.ma",
    rating: 4.9,
    certified: true,
    highlight: "Intervenantes formées, certifiées & déclarées",
    description: "Service de nettoyage d'intérieur de prestige, repassage méticuleux, et lessives préservant les fibres textiles. Disponibilité d'urgences.",
    reviews: [
      { id: "r8-3-1", author: "Nadia L.", rating: 5, date: "28 Mai 2026", comment: "Le service est d'une fiabilité totale. La prestation est contrôlée à chaque passage." }
    ]
  },
  {
    id: "p8-4",
    categoryId: 8,
    subCategory: "Jardinier",
    name: "Espaces Verts de l'Atlas - Maroc Paysage",
    neighborhood: "Bouskoura",
    address: "Ville Verte, Point Entreprises, Casablanca",
    phone: "+212 663-801240",
    website: "www.marocpaysage.ma",
    rating: 4.8,
    certified: true,
    highlight: "Aménagement de jardins secs économes en eau",
    description: "Taille des arbres ornementaux, réajustement des sols, installation d'arrosages automatiques connectés goute-à-goute optimaux.",
    reviews: []
  },
  {
    id: "p8-5",
    categoryId: 8,
    subCategory: "Climatisation",
    name: "Climatisation Dépannage Direct MyCity",
    neighborhood: "Ain Diab",
    address: "Boulevard de l'Océan Atlantique, Casablanca",
    phone: "+212 522-794011",
    website: "www.climdirect-casa.ma",
    rating: 4.7,
    certified: true,
    highlight: "Installation de pompes à chaleur classe A+++",
    description: "Entretien préventif annuel des filtres anti-pollen, réparation immédiate de fuites de gaz réfrigérants écologiques certifiés.",
    reviews: [
      { id: "r8-5-1", author: "Imed E.", rating: 4, date: "30 Mai 2026", comment: "De bons conseils techniques concernant la pose d'unité Inverter économique." }
    ]
  }
];

interface MyLifePortalProps {
  currentLang?: LanguageCode;
  events?: CityEvent[];
  onPostReview?: (eventId: string, rating: number, comment: string) => void;
  onPostLike?: (eventId: string) => void;
  onSelectEventOnMap?: (evt: CityEvent) => void;
}

export default function MyLifePortal({ 
  currentLang = 'FR',
  events = [],
  onPostReview,
  onPostLike,
  onSelectEventOnMap,
}: MyLifePortalProps) {
  // Navigation & filter states
  const [myLifeTab, setMyLifeTab] = useState<'PROVIDERS' | 'AGENDA'>('AGENDA');
  const [eventCategoryFilter, setEventCategoryFilter] = useState<'ALL' | 'CULTURE' | 'ECONOMIC' | 'ECO_CSR' | 'SPORT'>('ALL');
  const [activeReviewEventId, setActiveReviewEventId] = useState<string | null>(null);
  const [userRating, setUserRating] = useState<number>(5);
  const [userComment, setUserComment] = useState<string>('');
  const [checkoutEvent, setCheckoutEvent] = useState<CityEvent | null>(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [calendarSyncTarget, setCalendarSyncTarget] = useState<string | null>(null);

  const tGlobal = globalTranslations[currentLang];

  const [activeCategoryId, setActiveCategoryId] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("ALL");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>("ALL");
  const [onlyCertified, setOnlyCertified] = useState<boolean>(false);
  const [minRating, setMinRating] = useState<number>(0);

  // States for reviews expander (avis vérifiés)
  const [expandedReviewsProviderId, setExpandedReviewsProviderId] = useState<string | null>(null);

  // States for dynamic quote request form (demande de devis)
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState<boolean>(false);
  const [selectedProviderForQuote, setSelectedProviderForQuote] = useState<Provider | null>(null);
  const [quoteStep, setQuoteStep] = useState<number>(1); // 1: Form, 2: Simulated Verification & Handshake, 3: Success Voucher
  const [quoteFormData, setQuoteFormData] = useState({
    serviceType: "",
    urgencyLevel: "normal",
    description: "",
    deliveryDate: "",
    estimatedBudget: "",
    clientName: "",
    clientPhone: "",
    clientEmail: ""
  });
  const [simulatedProgress, setSimulatedProgress] = useState<number>(0);

  // Filter events based on active category
  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      if (eventCategoryFilter === 'ALL') return true;
      return evt.category === eventCategoryFilter;
    });
  }, [events, eventCategoryFilter]);

  const handleCalendarSync = (title: string) => {
    setCalendarSyncTarget(title);
    setTimeout(() => {
      setCalendarSyncTarget(null);
    }, 5000);
  };

  const handleTicketCheckout = (evt: CityEvent) => {
    setCheckoutEvent(evt);
    setCheckoutSuccess(false);
  };

  const handlePayTicketSim = () => {
    setCheckoutSuccess(true);
    setTimeout(() => {
      setCheckoutEvent(null);
      setCheckoutSuccess(false);
    }, 3000);
  };

  // Unique lists from data based on current active category
  const activeCategory = useMemo(() => {
    return CATEGORIES_DATA.find(c => c.id === activeCategoryId) || CATEGORIES_DATA[0];
  }, [activeCategoryId]);

  const uniqueNeighborhoods = useMemo(() => {
    // Only return neighborhoods where we have active providers in this specific category to prevent dead filters
    const list = PROVIDERS_DATABASE
      .filter(p => p.categoryId === activeCategoryId)
      .map(p => p.neighborhood);
    return ["ALL", ...Array.from(new Set(list))];
  }, [activeCategoryId]);

  // Combined Search & Filtering Logic
  const filteredProviders = useMemo(() => {
    return PROVIDERS_DATABASE.filter(prov => {
      // Must belong to active category
      if (prov.categoryId !== activeCategoryId) return false;

      // Class sub-filter
      if (selectedSubCategory !== "ALL" && prov.subCategory !== selectedSubCategory) return false;

      // Neighborhood filter
      if (selectedNeighborhood !== "ALL" && prov.neighborhood !== selectedNeighborhood) return false;

      // Certified providers only toggle
      if (onlyCertified && !prov.certified) return false;

      // Minimum rating filter
      if (prov.rating < minRating) return false;

      // Main Text search
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesName = prov.name.toLowerCase().includes(query);
        const matchesDesc = prov.description.toLowerCase().includes(query);
        const matchesSub = prov.subCategory.toLowerCase().includes(query);
        const matchesHigh = prov.highlight.toLowerCase().includes(query);
        const matchesNeigh = prov.neighborhood.toLowerCase().includes(query);
        return matchesName || matchesDesc || matchesSub || matchesHigh || matchesNeigh;
      }

      return true;
    });
  }, [activeCategoryId, selectedSubCategory, selectedNeighborhood, onlyCertified, minRating, searchQuery]);

  const recordCommerceVisit = (p: Provider) => {
    fetch("/api/events/record", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType: "COMMERCE_VISITE",
        aggregateId: p.id,
        payload: {
          name: p.name,
          category: p.subCategory,
          neighborhood: p.neighborhood
        }
      })
    }).catch(err => console.error("Failed to record commerce visit event:", err));
  };

  // Open multi-step quote builder for specific provider
  const handleOpenQuoteForm = (provider: Provider) => {
    recordCommerceVisit(provider);
    setSelectedProviderForQuote(provider);
    setQuoteFormData({
      serviceType: provider.subCategory,
      urgencyLevel: "normal",
      description: "",
      deliveryDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // tomorrow by default
      estimatedBudget: "",
      clientName: "Amin Charafi", // Default mock user
      clientPhone: "+212 661-000000",
      clientEmail: "amin.charafi@gmail.com"
    });
    setQuoteStep(1);
    setIsQuoteModalOpen(true);
  };

  // Submit quote request and show high-fidelity real-time handshake process
  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteStep(2);
    setSimulatedProgress(10);

    // Simulate real-time progress steps for a highly interactive and responsive experience
    const interval = setInterval(() => {
      setSimulatedProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setQuoteStep(3);
          return 100;
        }
        return prev + 15;
      });
    }, 300);
  };

  // Translation helpers suited for French (default request), with robust multilingual integration
  const translations = {
    title: {
      FR: "Portail MyCity : Écosystème MyLife",
      EN: "MyCity Portal: MyLife Ecosystem",
      AR: "بوابة مدينتي: فضاء حياتي"
    },
    subtitle: {
      FR: "Votre annuaire de confiance à Casablanca : sport, bien-être, culture, famille, alimentation, commerces, animaux et services de maison. Trouvez des prestataires certifiés de quartier avec avis vérifiés.",
      EN: "Your trusted Casablanca directory: sports, wellness, culture, family, restaurants, shopping, pets, and home services. Find neighborhood certified providers with verified ratings.",
      AR: "دليلك الموثوق بالدار البيضاء: الرياضة، الرفاهية، الثقافة، الأسرة، التغذية، التسوق، الحيوانات والأشغال المنزلية. اعثر على مقدمي خدمات معتمدين بحيك مجهزين بآراء حقيقية."
    },
    verifiedBadge: {
      FR: "Avis Vérifié",
      EN: "Verified Review",
      AR: "رأي موثق"
    },
    certifiedBadge: {
      FR: "Prestataire Certifié",
      EN: "Certified Provider",
      AR: "مزود معتمد"
    },
    requestQuoteBtn: {
      FR: "Demander de Devis",
      EN: "Request a Quote",
      AR: "طلب تقدير سعر"
    },
    searchPlaceholder: {
      FR: "Rechercher par mot-clé, nom, quartier, spécialité...",
      EN: "Search by keyword, name, neighborhood, specialty...",
      AR: "ابحث بالكلمة المفاتيح، الحي، الاسم أو التخصص..."
    },
    certifiedToggleLabel: {
      FR: "Prestataires certifiés uniques",
      EN: "Only certified providers",
      AR: "المزودين المعتمدين فقط"
    },
    allSubCategoriesLabel: {
      FR: "Toutes les sous-activités",
      EN: "All activities",
      AR: "جميع الأنشطة الفرعية"
    },
    allNeighborhoodsLabel: {
      FR: "Tous les quartiers",
      EN: "All neighborhoods",
      AR: "كل الأحياء"
    },
    scoreSuffix: {
      FR: "sur 5",
      EN: "out of 5",
      AR: "من 5"
    },
    noResults: {
      FR: "Aucun prestataire trouvé correspondant à ces critères.",
      EN: "No providers found matching these criteria.",
      AR: "لم يتم العثور على أي نتائج مطابقة للتصفية."
    }
  };

  const t = (key: keyof typeof translations) => {
    return translations[key][currentLang] || translations[key]["FR"];
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12" id="mylife-restructured-root">
      
      {/* 1. Header Hero Card with Local Vibe & Indicators */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#11131a] via-[#151926] to-[#0c0e14] border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#6C3CFF]/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -ml-16 -mb-16" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-[10px] font-bold font-mono rounded-full uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              Souveraineté, Proximité & Confiance
            </div>
            <h1 className="text-xl md:text-3xl font-black font-title text-white tracking-tight leading-tight flex items-center gap-2">
              <span>{t("title")}</span>
              <span className="text-sm px-2.5 py-0.5 rounded bg-[#6C3CFF]/20 text-[#9E8BFF] font-mono border border-[#6C3CFF]/40 font-bold uppercase">
                8 Axes Libres
              </span>
            </h1>
            <p className="text-gray-400 text-xs md:text-sm max-w-3xl leading-relaxed">
              {t("subtitle")}
            </p>
          </div>
          
          <div className="shrink-0 flex sm:flex-col gap-2 bg-black/40 p-3 rounded-2xl border border-white/5 text-[10.5px] font-mono text-gray-400">
            <div className="flex items-center gap-2 px-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Prestataires Actifs : <b className="text-white">164 certifiés</b></span>
            </div>
            <div className="flex items-center gap-2 px-1 border-l sm:border-l-0 sm:border-t border-white/10 pt-1.5 mt-0 sm:mt-0.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Avis Contrôlés : <b className="text-yellow-400">100% Vérifiés</b></span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Switcher for Providers Directory vs City Events Agenda */}
      <div className="flex border border-white/5 bg-[#0f111a] rounded-xl p-1 gap-1 max-w-md shadow-inner">
        <button
          onClick={() => setMyLifeTab('AGENDA')}
          className={`flex-1 py-2 px-3.5 rounded-lg text-[11px] font-title font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            myLifeTab === 'AGENDA' 
              ? 'bg-gradient-to-r from-indigo-600 to-[#6C3CFF] text-white shadow-md' 
              : 'text-gray-400 hover:text-white hover:bg-white/5 font-medium'
          }`}
        >
          <span>📅</span>
          <span>
            {currentLang === 'AR' ? "الأجندة والأنشطة" : currentLang === 'EN' ? "City Events & Booking" : "Agenda & Billetterie"}
          </span>
        </button>
        <button
          onClick={() => setMyLifeTab('PROVIDERS')}
          className={`flex-1 py-2 px-3.5 rounded-lg text-[11px] font-title font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            myLifeTab === 'PROVIDERS' 
              ? 'bg-gradient-to-r from-indigo-600 to-[#6C3CFF] text-white shadow-md' 
              : 'text-gray-400 hover:text-white hover:bg-white/5 font-medium'
          }`}
        >
          <span>🏢</span>
          <span>
            {currentLang === 'AR' ? "دليل مقدمي الخدمات" : currentLang === 'EN' ? "Local Directory" : "Annuaire Prestataires"}
          </span>
        </button>
      </div>

      {myLifeTab === 'PROVIDERS' ? (
        <>
          {/* 2. Categorized Bento Selection Grid for the 8 axes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3" id="categories-selector-belt">
        {CATEGORIES_DATA.map((cat) => {
          const isActive = activeCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategoryId(cat.id);
                setSelectedSubCategory("ALL");
                setSelectedNeighborhood("ALL");
                setExpandedReviewsProviderId(null);
              }}
              className={`p-3 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-2 cursor-pointer relative overflow-hidden group ${
                isActive 
                  ? 'bg-gradient-to-b from-[#1c1a2f] to-[#121124] border-[#6C3CFF] text-[#9E8BFF] shadow-lg shadow-[#6C3CFF]/10 scale-[1.03]' 
                  : 'bg-[#10121a]/85 border-white/5 text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/10'
              }`}
            >
              <span className="text-2xl transition-transform duration-300 group-hover:scale-125">{cat.emoji}</span>
              <span className="text-[11px] font-bold font-title tracking-tight line-clamp-2 leading-tight">
                {cat.name}
              </span>
              <div className="absolute bottom-1 w-4 h-[2px] rounded bg-current opacity-0 scale-x-0 transition-transform duration-300 group-hover:opacity-100 group-hover:scale-x-100" />
            </button>
          );
        })}
      </div>

      {/* 3. Deep Filter & Diagnostics Bar */}
      <div className="bg-[#10121a]/95 border border-white/5 p-4 rounded-2xl shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Main text search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/5 hover:border-white/10 focus:border-[#6C3CFF]/50 text-white rounded-xl text-xs font-mono placeholder-gray-500 outline-none transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
            {/* Sub-activity filter */}
            <select
              value={selectedSubCategory}
              onChange={(e) => setSelectedSubCategory(e.target.value)}
              className="px-3 py-2.5 bg-black/40 border border-white/5 focus:border-[#6C3CFF]/30 text-gray-300 hover:text-white rounded-xl text-xs font-mono outline-none cursor-pointer"
            >
              <option value="ALL">{t("allSubCategoriesLabel")}</option>
              {activeCategory.subCategories.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>

            {/* Neighborhood filter */}
            <select
              value={selectedNeighborhood}
              onChange={(e) => setSelectedNeighborhood(e.target.value)}
              className="px-3 py-2.5 bg-black/40 border border-white/5 focus:border-[#6C3CFF]/30 text-gray-300 hover:text-white rounded-xl text-xs font-mono outline-none cursor-pointer"
            >
              <option value="ALL">{t("allNeighborhoodsLabel")}</option>
              {uniqueNeighborhoods.filter(n => n !== "ALL").map(neigh => (
                <option key={neigh} value={neigh}>{neigh}</option>
              ))}
            </select>

            {/* Minimun rating filter */}
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="px-3 py-2.5 bg-black/40 border border-white/5 focus:border-[#6C3CFF]/30 text-yellow-400 rounded-xl text-xs font-mono outline-none cursor-pointer"
            >
              <option value="0">Tout score</option>
              <option value="4.6">★ 4.6+</option>
              <option value="4.8">★ 4.8+</option>
              <option value="4.9">★ 4.9+</option>
            </select>
          </div>
        </div>

        {/* Toggles bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-3 text-[11px] font-mono text-gray-400">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={onlyCertified}
                onChange={(e) => setOnlyCertified(e.target.checked)}
                className="rounded border-white/10 text-indigo-500 bg-black focus:ring-indigo-500/20"
              />
              <span className="group-hover:text-white transition-colors">{t("certifiedToggleLabel")} ⭐</span>
            </label>
            <div className="w-1.5 h-1.5 rounded-full bg-white/10 hidden sm:block"></div>
            <span className="hidden sm:inline">Sous-catégories de confiance à Casablanca</span>
          </div>

          <div className="text-[10.5px] text-gray-500">
            Affiche <b className="text-indigo-400">{filteredProviders.length}</b> correspondances pour <span className="text-gray-300">"{activeCategory.name}"</span>
          </div>
        </div>
      </div>

      {/* Institution representative banner for Médecins if activeCategoryId is 2 */}
      {activeCategoryId === 2 && (
        <div className="p-4 bg-emerald-950/20 border border-emerald-500/15 rounded-2xl mb-4 space-y-1 select-none">
          <div className="flex items-center gap-2">
            <span className="text-sm">🏥</span>
            <span className="text-[11px] font-bold text-white uppercase tracking-wider font-mono">Conseil de l'Ordre des Médecins de Casablanca</span>
          </div>
          <p className="text-[9.5px] text-emerald-300 leading-normal">
            Ordre National des Médecins du Maroc — Organe de régulation déontologique et légal de l'exercice médical veillant sur la qualité, la probité et le respect absolu de la déontologie professionnelle.
          </p>
        </div>
      )}

      {/* 4. Active List of Matching Providers & Services */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="mylife-providers-grid">
        {filteredProviders.map((provider) => {
          const isReviewsOpen = expandedReviewsProviderId === provider.id;
          return (
            <div
              key={provider.id}
              className="bg-gradient-to-b from-[#11131c] to-[#0c0e14] border border-white/5 hover:border-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/5 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 group"
            >
              <div className="space-y-3">
                {/* Badges and SubCategory */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[9px] font-mono uppercase px-2.5 py-0.5 bg-[#6C3CFF]/15 text-[#9E8BFF] border border-[#6C3CFF]/20 rounded-full">
                    {provider.subCategory}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {/* Prestataire Certifié Badge */}
                    {provider.certified && (
                      <span 
                        className="inline-flex items-center gap-1 text-[9px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
                        title="Vérifié par la commission locale et les standards de souveraineté."
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>{t("certifiedBadge")}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Name, Highlight and Description */}
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-white group-hover:text-[#9E8BFF] transition-colors font-title flex items-center gap-1.5">
                    {provider.name}
                  </h3>
                  <p className="text-[11px] text-[#00f0ff] font-mono font-medium">
                    ✨ {provider.highlight}
                  </p>
                  <p className="text-[11px] text-gray-400 leading-relaxed pt-1">
                    {provider.description}
                  </p>
                </div>

                {/* Local Meta Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10.5px] font-mono text-gray-500 bg-black/20 p-2.5 rounded-lg border border-white/5">
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span><b>[{provider.neighborhood}]</b> {provider.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-self-start sm:justify-self-end text-gray-400">
                    <Phone className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                    <span>{provider.phone}</span>
                  </div>
                </div>
              </div>

               {/* Verified rating and Devis interaction footer */}
              <div className="border-t border-white/5 pt-3.5 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Avis Vérifiés Control */}
                <button
                  onClick={() => {
                    const nextState = isReviewsOpen ? null : provider.id;
                    setExpandedReviewsProviderId(nextState);
                    if (nextState) {
                      recordCommerceVisit(provider);
                    }
                  }}
                  className="flex items-center gap-2 group/review cursor-pointer bg-black/10 hover:bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5 transition-all text-left"
                  title="Cliquez pour visualiser les avis détaillés des citoyens de Casablanca."
                >
                  <div className="flex items-center text-amber-400 stroke-amber-400 shrink-0">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3 h-3 ${i < Math.round(provider.rating) ? "fill-amber-400" : "opacity-30"}`} 
                      />
                    ))}
                  </div>
                  <div className="leading-none">
                    <span className="text-[11px] font-bold text-amber-300 font-mono">
                      {provider.rating.toFixed(1)} {t("scoreSuffix")}
                    </span>
                    <span className="text-[9px] text-gray-500 block">
                      ({provider.reviews.length} {t("verifiedBadge")}(s) <ChevronDown className={`inline w-2.5 h-2.5 transform transition-transform ${isReviewsOpen ? "rotate-180" : ""}`} />)
                    </span>
                  </div>
                </button>

                {/* Multi-step quote button */}
                <button
                  onClick={() => handleOpenQuoteForm(provider)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-title font-black text-xs rounded-xl cursor-pointer shadow-lg shadow-indigo-600/15 transition-all flex items-center gap-1.5 justify-center"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{t("requestQuoteBtn")}</span>
                </button>
              </div>

              {/* RENDER EXPANDED REVIEWS CONTAINER */}
              {isReviewsOpen && (
                <div className="mt-4 p-4 bg-black/40 border border-white/5 rounded-xl space-y-3 divide-y divide-white/5 animate-slide-up">
                  <div className="flex items-center justify-between pb-1.5 text-[10px] font-mono text-gray-400">
                    <span className="text-emerald-400 font-bold uppercase flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Avis certifiés souveraineté locale
                    </span>
                    <span>Origine : Citoyens de Casa</span>
                  </div>

                  {provider.reviews.length === 0 ? (
                    <div className="text-center py-4 text-[10.5px] text-gray-500 font-mono">
                      Aucun avis détaillé rédigé pour le moment.
                    </div>
                  ) : (
                    provider.reviews.map((rev) => (
                      <div key={rev.id} className="pt-2.5 space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="text-gray-300 font-bold">{rev.author}</span>
                          <span className="text-gray-500">{rev.date}</span>
                        </div>
                        <div className="flex items-center text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-2.5 h-2.5 ${i < rev.rating ? "fill-amber-500" : "opacity-20"}`} 
                            />
                          ))}
                        </div>
                        <p className="text-[10.5px] text-gray-400 leading-normal font-mono">
                          "{rev.comment}"
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filteredProviders.length === 0 && (
          <div className="col-span-1 lg:col-span-2 text-center py-16 bg-[#11131c]/50 rounded-3xl border border-dashed border-white/5 space-y-2">
            <span className="text-4xl">🔍</span>
            <p className="text-sm text-gray-400 font-mono font-bold leading-normal">{t("noResults")}</p>
            <p className="text-xs text-gray-500 font-mono max-w-md mx-auto">
              Essayez de désactiver le filtre "Prestataires certifiés uniquement" ou de lancer une recherche avec des termes moins spécifiques.
            </p>
          </div>
        )}
      </div>

      {/* 5. INTERACTIVE QUOTE MODAL (DEMANDE DE DEVIS) */}
      {isQuoteModalOpen && selectedProviderForQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div 
            className="w-full max-w-lg bg-[#0f1118] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
            id="quote-dialog-container"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-indigo-950/40 via-[#0f1118] to-indigo-950/40 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{activeCategory.emoji}</span>
                <div>
                  <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest leading-none">
                    Demande de Devis Souverain
                  </h3>
                  <span className="text-xs font-black text-white font-title leading-tight">
                    {selectedProviderForQuote.name}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsQuoteModalOpen(false)}
                className="p-1.5 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Step 1: User Request Form details */}
            {quoteStep === 1 && (
              <form onSubmit={handleSubmitQuote} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-mono text-gray-500 uppercase mb-1">
                      Prestation demandée
                    </label>
                    <input
                      type="text"
                      required
                      value={quoteFormData.serviceType}
                      onChange={(e) => setQuoteFormData({ ...quoteFormData, serviceType: e.target.value })}
                      className="w-full bg-black/40 border border-white/5 focus:border-[#6C3CFF]/50 text-white rounded-lg px-3 py-2 text-xs font-mono outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono text-gray-500 uppercase mb-1">
                      Niveau d'urgence
                    </label>
                    <select
                      value={quoteFormData.urgencyLevel}
                      onChange={(e) => setQuoteFormData({ ...quoteFormData, urgencyLevel: e.target.value })}
                      className="w-full bg-black/40 border border-white/5 focus:border-[#6C3CFF]/50 text-gray-300 rounded-lg p-2 text-xs font-mono outline-none cursor-pointer"
                    >
                      <option value="normal">Normal (Sans urgence)</option>
                      <option value="rapid">Rapide (Sous 48 heures)</option>
                      <option value="immediate">Urgent (Intervention immédiate)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-mono text-gray-500 uppercase mb-0.5">
                    Description détaillée du besoin
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Surface, nature des travaux, horaires recommandés, contraintes d'accès d'appartement de Casablanca etc."
                    value={quoteFormData.description}
                    onChange={(e) => setQuoteFormData({ ...quoteFormData, description: e.target.value })}
                    className="w-full bg-black/40 border border-white/5 focus:border-[#6C3CFF]/50 text-white rounded-xl p-3 text-xs font-mono placeholder-gray-600 outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-mono text-gray-500 uppercase mb-1">
                      Date d'accès souhaitée
                    </label>
                    <input
                      type="date"
                      required
                      value={quoteFormData.deliveryDate}
                      onChange={(e) => setQuoteFormData({ ...quoteFormData, deliveryDate: e.target.value })}
                      className="w-full bg-black/40 border border-white/5 focus:border-[#6C3CFF]/50 text-white rounded-lg px-3 py-2 text-xs font-mono outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono text-gray-500 uppercase mb-1">
                      Budget estimé (MAD)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: 500 MAD"
                      value={quoteFormData.estimatedBudget}
                      onChange={(e) => setQuoteFormData({ ...quoteFormData, estimatedBudget: e.target.value })}
                      className="w-full bg-black/40 border border-white/5 focus:border-[#6C3CFF]/50 text-white rounded-lg px-3 py-2 text-xs font-mono outline-none"
                    />
                  </div>
                </div>

                {/* Secure Contact Block (Autonomous local privacy) */}
                <div className="p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10 space-y-2">
                  <span className="text-[9px] font-mono text-indigo-300 uppercase font-black block leading-none">
                    🔑 Coordonnées de contact sécurisées anonymes
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Nom complet"
                      value={quoteFormData.clientName}
                      onChange={(e) => setQuoteFormData({ ...quoteFormData, clientName: e.target.value })}
                      className="bg-black/40 border border-white/5 focus:border-[#6C3CFF]/40 text-white rounded px-2 py-1.5 text-[10.5px] font-mono outline-none w-full"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Téléphone"
                      value={quoteFormData.clientPhone}
                      onChange={(e) => setQuoteFormData({ ...quoteFormData, clientPhone: e.target.value })}
                      className="bg-black/40 border border-white/5 focus:border-[#6C3CFF]/40 text-white rounded px-2 py-1.5 text-[10.5px] font-mono outline-none w-full"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Email de contact"
                      value={quoteFormData.clientEmail}
                      onChange={(e) => setQuoteFormData({ ...quoteFormData, clientEmail: e.target.value })}
                      className="bg-black/40 border border-white/5 focus:border-[#6C3CFF]/40 text-white rounded px-2 py-1.5 text-[10.5px] font-mono outline-none w-full"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-title font-black text-xs rounded-xl cursor-pointer transition-all flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Envoyer la demande sécurisée</span>
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: Simulated Transmitting & Handshake */}
            {quoteStep === 2 && (
              <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
                <div className="relative flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-t-2 border-indigo-500 border-r-2 border-indigo-500/30 animate-spin"></div>
                  <span className="absolute text-xs text-indigo-400 font-mono font-black">{simulatedProgress}%</span>
                </div>
                
                <div className="space-y-1.5">
                  <h4 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider">
                    Transmission du devis souverain
                  </h4>
                  <p className="text-[11px] text-gray-500 max-w-sm font-mono leading-relaxed">
                    Chiffrement local des coordonnées, validation par les serveurs de souveraine souveraineté de Casablanca, et acheminement vers {selectedProviderForQuote.name}...
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Success Certificate Voucher */}
            {quoteStep === 3 && (
              <div className="p-6 space-y-4 font-mono text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
                  <Check className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-emerald-400">
                    Demande transmise avec succès !
                  </h4>
                  <p className="text-xs text-gray-400 leading-normal px-4">
                    Le prestataire certifié vient de recevoir un message d'appel d'offres prioritaires encrypté.
                  </p>
                </div>

                {/* High quality certificate layout */}
                <div className="bg-black/40 border border-white/10 rounded-xl p-4 text-left text-[11px] space-y-2 relative overflow-hidden">
                  <div className="absolute right-1 bottom-1 opacity-5 text-4xl font-extrabold select-none">KYC</div>
                  
                  <div className="flex justify-between border-b border-white/5 pb-1 text-gray-500">
                    <span>RÉFÉRENCE DE DEMANDE</span>
                    <span className="text-indigo-400 font-bold">MYC-{(Math.floor(100000 + Math.random() * 900000))}</span>
                  </div>

                  <div className="space-y-1">
                    <div>
                      <span className="text-gray-500">PRESTATAIRE : </span>
                      <span className="text-white font-bold">{selectedProviderForQuote.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">TYPE DE BESOIN : </span>
                      <span className="text-indigo-300">{quoteFormData.serviceType}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">DATE ESTIMÉE : </span>
                      <span className="text-gray-300">{quoteFormData.deliveryDate}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">DEVIS MAXIMUM : </span>
                      <span className="text-yellow-400 font-bold">{quoteFormData.estimatedBudget || "Non spécifié"}</span>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-2 text-[10px] text-emerald-400 flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>Transmis en direct. Délai de traitement moyen : 15 min.</span>
                  </div>
                </div>

                <div className="flex justify-center pt-2">
                  <button
                    onClick={() => {
                      setIsQuoteModalOpen(false);
                      setQuoteStep(1);
                    }}
                    className="px-4 py-2 bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-500/20 text-[#9E8BFF] hover:text-white text-xs font-bold rounded-xl cursor-pointer transition-all"
                  >
                    Fermer l'accusé de réception
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
        </>
      ) : (
        <div className="space-y-6 animate-fade-in" id="mylife-agenda-tab">
          {calendarSyncTarget && (
            <div className="p-3 bg-emerald-950/45 border border-emerald-500/30 text-emerald-300 rounded-lg text-xs font-mono animate-bounce flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{tGlobal.calendarSyncMessage} "{calendarSyncTarget}"...</span>
              </div>
              <span className="text-[10px] text-emerald-500 font-bold">{tGlobal.calendarSyncDayJ}</span>
            </div>
          )}

          {/* Agenda Categories Filters */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {(['ALL', 'ECONOMIC', 'CULTURE', 'ECO_CSR', 'SPORT'] as const).map((cat) => (
              <button
                key={cat}
                id={`mylife-agenda-filter-cat-${cat}`}
                onClick={() => setEventCategoryFilter(cat)}
                className={`px-3 py-1.5 text-[11px] font-mono rounded-full border cursor-pointer select-none transition-colors whitespace-nowrap ${
                  eventCategoryFilter === cat 
                    ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50' 
                    : 'bg-neutral-900 text-gray-400 border-white/5 hover:bg-neutral-800'
                }`}
              >
                {cat === 'ALL' && (currentLang === 'AR' ? "كل الأنشطة" : currentLang === 'EN' ? "All Events" : "Tous les Événements")}
                {cat === 'ECONOMIC' && tGlobal.filterEco}
                {cat === 'CULTURE' && tGlobal.filterCulture}
                {cat === 'ECO_CSR' && tGlobal.filterEcoCsr}
                {cat === 'SPORT' && tGlobal.filterSport}
              </button>
            ))}
          </div>

          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="mylife-agenda-events-grid">
              {filteredEvents.map((evt) => (
                <div 
                  key={evt.id} 
                  id={`mylife-event-card-${evt.id}`}
                  className="rounded-2xl bg-[#11131c] border border-white/5 p-4 flex flex-col justify-between hover:border-white/15 transition-all shadow-md overflow-hidden relative"
                >
                  {/* Premium sponsor ribbon */}
                  {evt.isPremiumPartner && (
                    <div className="absolute top-2.5 right-2.5 bg-yellow-400 text-black font-title font-extrabold text-[8px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg tracking-wider uppercase">
                      {tGlobal.officialSponsor}
                    </div>
                  )}

                  <div className="space-y-3">
                    {/* Category Label and Date */}
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded text-[8.5px] font-mono tracking-widest uppercase text-white font-bold ${
                        evt.category === 'CULTURE' ? 'bg-[#ff3c83]' :
                        evt.category === 'ECONOMIC' ? 'bg-[#00f0ff] !text-black' :
                        evt.category === 'ECO_CSR' ? 'bg-emerald-500' : 'bg-blue-600'
                      }`}>
                        {evt.category}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-500" />
                        {evt.date} {evt.isToday && <span className="text-[#00ff66] font-bold">(JOUR J !)</span>}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="font-title font-bold text-white text-sm" title={evt.title}>
                      {evt.title}
                    </h4>

                    {/* Desc */}
                    <p className="text-gray-400 text-xs text-justify leading-relaxed line-clamp-3">
                      {evt.description}
                    </p>

                    <div className="pt-2 border-t border-white/5 text-[11px] flex justify-between items-center text-gray-500 font-mono">
                      <span>{tGlobal.eventOrganizer} <strong className="text-gray-300 font-semibold">{evt.partnerName}</strong></span>
                      {evt.ticketPrice > 0 ? (
                        <span className="text-[#9E8BFF] font-black">{evt.ticketPrice} MAD</span>
                      ) : (
                        <span className="text-[#00ff66] font-bold">{tGlobal.freeEntry}</span>
                      )}
                    </div>
                  </div>

                  {/* Operational actions footer inside card */}
                  <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2.5">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onSelectEventOnMap?.(evt)}
                        className="text-[10px] text-indigo-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1 bg-[#1e2030] px-2.5 py-1.5 rounded-xl font-mono"
                      >
                        <MapPin className="w-3 h-3 text-indigo-400" />
                        {tGlobal.centerMap}
                      </button>
                      
                      <button
                        onClick={() => handleCalendarSync(evt.title)}
                        className="text-[10px] text-emerald-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1 bg-[#152a21] px-2.5 py-1.5 rounded-xl font-mono"
                      >
                        <Calendar className="w-3 h-3 text-emerald-400" />
                        {tGlobal.syncCalendar}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onPostLike?.(evt.id)}
                        className="text-gray-400 hover:text-[#ff3c83] active:scale-125 transition-all cursor-pointer flex items-center gap-1 text-[11px] bg-black/30 p-1 px-2 rounded-xl border border-white/5"
                      >
                        <Heart className="w-3.5 h-3.5 text-gray-500 fill-transparent hover:fill-[#ff4081]" />
                        <span>{evt.views}</span>
                      </button>

                      <button
                        onClick={() => handleTicketCheckout(evt)}
                        className="px-3 py-1.5 bg-[#6c3cff] hover:bg-[#562ee6] text-white rounded-xl text-[10px] font-bold cursor-pointer transition-all hover:shadow-[#6c3cff]/15"
                      >
                        {evt.ticketPrice > 0 ? tGlobal.reserveBtn : tGlobal.registerBtn}
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Comments Module */}
                  <div className="mt-3.5 bg-black/45 rounded-xl p-3 text-xs border border-white/5">
                    <div className="flex justify-between items-center mb-1.5 border-b border-white/5 pb-1">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">{tGlobal.commentsCount} ({evt.reviews.length})</span>
                      <button
                        onClick={() => setActiveReviewEventId(activeReviewEventId === evt.id ? null : evt.id)}
                        className="text-[10px] text-[#9E8BFF] hover:underline cursor-pointer font-bold font-mono"
                      >
                        {activeReviewEventId === evt.id ? tGlobal.hideBtn : tGlobal.rateBtn}
                      </button>
                    </div>

                    {activeReviewEventId === evt.id && (
                      <div className="space-y-3.5 mt-2 pt-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10.5px] text-gray-400 font-mono">Notez cet événement :</span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((stars) => (
                              <button
                                key={stars}
                                type="button"
                                onClick={() => setUserRating(stars)}
                                className={`cursor-pointer transition-colors text-base select-none ${
                                  stars <= userRating ? 'text-amber-400' : 'text-gray-600'
                                }`}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={userComment}
                            onChange={(e) => setUserComment(e.target.value)}
                            placeholder={tGlobal.giveOpinion}
                            className="flex-1 bg-[#0a0a0f] border border-white/10 rounded-xl text-[11px] px-3 py-1.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#6c3cff] font-mono"
                          />
                          <button
                            onClick={() => {
                              if (!userComment.trim()) return;
                              onPostReview?.(evt.id, userRating, userComment);
                              setUserComment('');
                              setActiveReviewEventId(null);
                            }}
                            className="bg-[#6c3cff] hover:bg-[#5324e9] text-white px-3.5 py-1.5 rounded-xl text-[10px] font-bold cursor-pointer"
                          >
                            {tGlobal.publishBtn}
                          </button>
                        </div>
                      </div>
                    )}

                    {evt.reviews.length > 0 ? (
                      <div className="mt-2 space-y-1.5 max-h-[100px] overflow-y-auto pr-1">
                        {evt.reviews.map(r => (
                          <div key={r.id} className="text-[10px] text-gray-300 bg-[#1e2030]/50 p-2 rounded-lg border border-white/5">
                            <div className="flex justify-between font-mono text-[9px] text-[#00f0ff] mb-0.5 font-bold">
                              <span>{r.userName}</span>
                              <span className="text-amber-400">{'★'.repeat(r.rating)}</span>
                            </div>
                            <p className="text-gray-400 text-justify">{r.comment}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[10px] text-gray-600 italic block mt-1 py-1 font-mono text-center">{tGlobal.noReviewsYet}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 text-center text-gray-500 font-mono">
              <span className="text-2xl">📅</span>
              <p className="text-xs">Aucun événement n'est programmé dans cette catégorie pour le moment.</p>
            </div>
          )}

          {/* CMI Checkout Modal inside Agenda tab */}
          {checkoutEvent && (
            <div id="cmi-checkout-modal" className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4">
              <div className="w-full max-w-sm bg-[#161821] border border-[#6c3cff]/40 rounded-3xl p-5 space-y-4 shadow-2xl relative animate-scale-in">
                <span className="absolute top-3 right-3 px-2 py-0.5 bg-indigo-950 text-[#00f0ff] font-mono text-[8px] rounded border border-indigo-500/20 uppercase tracking-widest">{tGlobal.cmiGateway}</span>
                
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#ff3c83]/10 flex items-center justify-center text-lg shadow-inner">
                    💳
                  </div>
                  <div>
                    <h3 className="font-title font-bold text-xs text-white">{tGlobal.ticketTitle}</h3>
                    <p className="font-mono text-[9px] text-gray-400">{tGlobal.ticketSub}</p>
                  </div>
                </div>

                <div className="bg-black/40 border border-white/5 p-3 rounded-xl space-y-1.5 text-[11px] font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-mono">ÉVÉNEMENT :</span>
                    <span className="text-white font-semibold truncate w-40 text-right">{checkoutEvent.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-mono">CATÉGORIE :</span>
                    <span className="text-white font-semibold">{checkoutEvent.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-mono">ORGANISATEUR :</span>
                    <span className="text-gray-300 font-semibold">{checkoutEvent.partnerName}</span>
                  </div>
                  <div className="flex justify-between border-t border-white/10 pt-2 text-xs">
                    <span className="text-[#00f0ff] font-bold">{tGlobal.checkoutTotal}</span>
                    <span className="text-white font-black">{checkoutEvent.ticketPrice} MAD</span>
                  </div>
                </div>

                {checkoutSuccess ? (
                  <div className="p-3 bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-xs font-mono rounded-xl text-center items-center justify-center flex gap-1.5 animate-pulse">
                    <span>✓</span>
                    <span>{tGlobal.checkoutSuccess}</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="p-2.5 bg-amber-950/20 border border-amber-500/10 rounded-xl font-mono text-[9px] text-amber-500 leading-normal text-justify">
                      {tGlobal.checkoutWarning}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCheckoutEvent(null)}
                        className="flex-1 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold cursor-pointer select-none transition-colors border border-white/5"
                      >
                        {tGlobal.cancelBtn}
                      </button>
                      <button
                        onClick={handlePayTicketSim}
                        className="flex-1 py-2 bg-[#6c3cff] hover:bg-[#5424e9] text-white rounded-xl text-xs font-bold cursor-pointer select-none transition-all hover:shadow-[#6c3cff]/15"
                      >
                        {tGlobal.checkoutPayBtn}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
