export type LanguageCode = 'AR' | 'FR' | 'EN';

export interface TranslationDictionary {
  appName: string;
  appSub: string;
  urbanPortal: string;
  residencePortal: string;
  flashTitle: string;
  flashBody: string;
  cmdTitle: string;
  cmdSub: string;
  sqlSpecBtn: string;
  publicCitoyen: string;
  businessBasic: string;
  businessPremium: string;
  mairieLabel: string;
  
  // Residence Tabs
  tabForum: string;
  tabAssistant: string;
  tabLaws: string;
  tabPros: string;
  tabBudget: string;
  tabValidation: string;
  
  // Residence Status Labels
  statusLabelTitle: string;
  statusUnverified: string;
  statusPending: string;
  statusVerified: string;
  statusSyndic: string;
  demoAdminRightsOn: string;
  demoAdminRightsOff: string;
  
  // Forum Locked Text
  forumLockedTitle: string;
  forumLockedDesc: string;
  authMethodsTitle: string;
  roleResidentOption: string;
  roleSyndicOption: string;
  aptNumberLabel: string;
  optACodeLabel: string;
  codePlaceholder: string;
  orLabel: string;
  optBDocLabel: string;
  docLydec: string;
  docBail: string;
  docTitre: string;
  docPV: string;
  clickDragUpload: string;
  submitAccessBtn: string;
  instantValidateBtn: string;
  
  // Forum Active UI Text
  forumSearchPlaceholder: string;
  catAll: string;
  catMaintenance: string;
  catAg: string;
  catSecurity: string;
  catCommon: string;
  catIncident: string;
  noDiscussions: string;
  byLabel: string;
  commentsCountLabelOne: string;
  commentsCountLabelPlural: string;
  replyPlaceholder: string;
  postTitleLabel: string;
  postContentLabel: string;
  newPostBtn: string;
  publishSuccessAlert: string;
  moderationBlockedTitle: string;
  moderationBlockedDesc: string;
  closeBtn: string;

  // Laws tab
  didYouKnowTitle: string;
  didYouKnowText: string;
  searchLawPlaceholder: string;
  majorityRequiredLabel: string;
  moroccanLawHub: string;
  regulatoryComplianceText: string;

  // Trades tab
  tradesHeader: string;
  tradesSub: string;
  verifiedSyndicBadge: string;
  interventionsCount: string;
  callBtn: string;
  recommendBtn: string;
  recommendedActive: string;
  reviewsCountLabel: string;

  // Budget tab
  totalRevenue: string;
  totalExpenses: string;
  currentBalance: string;
  reserveFundEst: string;
  categoryLabel: string;
  itemLabel: string;
  amountLabel: string;
  dateLabel: string;
  actionsLabel: string;
  addTransactionTitle: string;
  recetteLabel: string;
  depenseLabel: string;
  addBtn: string;
  deleteLabel: string;
  budgetSpreadsheetTitle: string;
  moroccoDirham: string;

  // Assistant chatbot tab
  welcomeIntro: string;
  aiLawAssistantText: string;
  aiChatPlaceholder: string;
  sendBtn: string;
  questionsSuggestionsTitle: string;

  // Validation Panel Tab
  controlPanelTitle: string;
  controlPanelSub: string;
  validatingApplicant: string;
  acceptBtn: string;
  rejectBtn: string;
  noPendingVerifications: string;

  // New translations added for full MyResidence completeness
  espaceMyResidence: string;
  copropriete: string;
  residenceSub: string;
  createNewBldGroupBtn: string;
  residentsCountLabel: string;
  apartmentsCountLabel: string;
  syndicLabel: string;
  createDiscussionTitle: string;
  aiModAlertText: string;
  discussionTitleLabel: string;
  discussionTitlePlaceholder: string;
  categoryFormLabel: string;
  messageLabel: string;
  messagePlaceholder: string;
  publishPostBtn: string;
  aiAssistantTitle: string;
  aiAssistantDesc: string;
  aiAssistantPlaceholderText: string;
  aiAssistantConsultingText: string;
  aiAssistantInputPlaceholder: string;
  filterLawPlaceholder: string;
  lawsTitle: string;
  reserveFundTitle: string;
  reserveFundPrefix: string;
  reserveFundSuffix: string;
  buildingLedgerTitle: string;
  unverifiedTreasureAlert: string;
  movementLabel: string;
  revenuePlusLabel: string;
  expenseMinusLabel: string;
  ledgerDesignationLabel: string;
  ledgerDesignationPlaceholder: string;
  ledgerAmountPlaceholder: string;
  ledgerSubmitBtn: string;
  verificationConsoleTitle: string;
  verificationConsoleDesc: string;
  activeCoproAdminLabel: string;
  verificationConsoleEmpty: string;
  proofLabel: string;
  depositedAgo: string;
  viewProofBtn: string;
  messageRejectedTitle: string;
  ethicsDetectorDesc: string;
  diagnosticAnalysisLabel: string;
  modifyPromptBtn: string;
  createBldModalTitle: string;
  createBldModalDesc: string;
  bldNameLabel: string;
  bldNamePlaceholder: string;
  bldAddressLabel: string;
  bldAddressPlaceholder: string;
  bldUnitsLabel: string;
  bldSyndicLabel: string;
  bldSyndicPlaceholder: string;
  bldSubmitBtn: string;

  // Urbain Portal UI Strings
  urbanTelemetrySim: string;
  realTimeActive: string;
  casaCoords: string;
  quickAccessProfileTitle: string;
  collaboratorAnonymous: string;
  droitOubliAlert: string;
  anonymousCitizen: string;

  // Map Simulation
  mapLiveTitle: string;
  mapP2PSync: string;
  mapShowHeatmap: string;
  mapHideHeatmap: string;
  mapCatEconomic: string;
  mapCatCulture: string;
  mapCatSport: string;
  mapCatEcoCsr: string;
  mapCatDutyPharma: string;
  mapCatActiveClaim: string;
  mapRolePublic: string;
  mapRoleMairie: string;
  mapRoleCat1: string;
  mapRoleCat2: string;

  // Citizen Portal Tabs & Filter
  tabExplore: string;
  tabClaim: string;
  tabPrivacy: string;
  filterAll: string;
  filterEco: string;
  filterCulture: string;
  filterEcoCsr: string;
  filterSport: string;
  officialSponsor: string;
  freeEntry: string;
  eventOrganizer: string;
  centerMap: string;
  syncCalendar: string;
  registerBtn: string;
  reserveBtn: string;
  commentsCount: string;
  hideBtn: string;
  rateBtn: string;
  giveOpinion: string;
  publishBtn: string;
  noReviewsYet: string;

  // Claim Form
  claimFormTitle: string;
  claimFormSub: string;
  claimCategoryLabel: string;
  claimCategoryChaussee: string;
  claimCategoryEclairage: string;
  claimCategoryDechets: string;
  claimCategoryEau: string;
  claimLocationLabel: string;
  claimLocationPlaceholder: string;
  claimSubjectLabel: string;
  claimSubjectPlaceholder: string;
  claimDescLabel: string;
  claimDescPlaceholder: string;
  claimCndpWarning: string;
  claimSubmitBtn: string;
  claimSuccess: string;

  // Privacy Studio / CNDP
  privacyTitle: string;
  privacySub: string;
  privacyConsentPanel: string;
  privacyOptAnalyticsTitle: string;
  privacyOptAnalyticsDesc: string;
  privacyOptLocationTitle: string;
  privacyOptLocationDesc: string;
  privacyOptBleTitle: string;
  privacyOptBleDesc: string;
  privacyExportTitle: string;
  privacyExportDesc: string;
  privacyExportBtn: string;
  privacyEraseTitle: string;
  privacyEraseDesc: string;
  privacyEraseBtn: string;

  // Ticket Checkout CMI
  cmiGateway: string;
  ticketTitle: string;
  ticketSub: string;
  checkoutEvent: string;
  checkoutCategory: string;
  checkoutOrganizer: string;
  checkoutTotal: string;
  checkoutSuccess: string;
  checkoutWarning: string;
  cancelBtn: string;
  checkoutPayBtn: string;
  calendarSyncMessage: string;
  calendarSyncDayJ: string;

  // Business Portal
  partnerSubCatLabel: string;
  partnerSwitchCat1Label: string;
  partnerSwitchCat2Label: string;
  partnerTabMetrics: string;
  partnerTabPublish: string;
  partnerTabMessages: string;
  metricsViews: string;
  metricsBookings: string;
  metricsCommission: string;
  metricsNetEarnings: string;
  metricsCommissionLabelStandard: string;
  metricsCommissionLabelPremium: string;
  metricsNetEarningsLabel: string;
  heatmapTitle: string;
  heatmapLocked: string;
  heatmapDetailedUnavailable: string;
  heatmapLockDesc: string;
  exportCsvBtn: string;
  validateTicketTitle: string;
  validateTicketDesc: string;
  ticketIdPlaceholder: string;
  validateBtn: string;
  campaignPushTitle: string;
  campaignPushAvailable: string;
  campaignPushLocked: string;
  campaignPushText: string;
  campaignTitleInputLabel: string;
  campaignTargetInputLabel: string;
  campaignStatusTarget: string;
  dispatchCampaignBtn: string;
  campaignDispatchedAlert: string;
  publishAnnonceTitle: string;
  publishAnnonceDesc: string;
  eventTitleInputLabel: string;
  eventTitlePlaceholder: string;
  eventCategoryInputLabel: string;
  eventDescInputLabel: string;
  eventDescPlaceholder: string;
  ticketPriceInputLabel: string;
  pinScheduleLabel: string;
  pinTodayRadio: string;
  pinFutureRadio: string;
  formCat1PinWarning: string;
  publishMarkerBtn: string;
  publishSuccessFeedback: string;
  directMessagesTitle: string;
  messageGuestInitials: string;
  msgReplyPlaceholder: string;
  replyBtn: string;
  cndpReceiptAlert: string;

  // Mairie Portal
  statsResolutionRate: string;
  statsOpenClaims: string;
  statsResolutionBeds: string;
  mairieTabClaims: string;
  mairieTabServices: string;
  mairieTabFlash: string;
  mairieTabAudit: string;
  claimsQueueTitle: string;
  aiReportLoading: string;
  aiReportGenerateBtn: string;
  claimDetailsTitle: string;
  claimHistoryExchange: string;
  claimHistoryEmpty: string;
  claimReplyLabel: string;
  claimReplyPlaceholder: string;
  engageWorkBtn: string;
  resolveIncidentBtn: string;
  incidentResolvedCndpAlert: string;
  satisfactionScoreLabel: string;
  selectIncidentPlaceholder: string;
  aiReportCloseBtn: string;
  aiReportCriticalZones: string;
  aiReportActions: string;
  pharmacyTitle: string;
  hospitalOccupancyTitle: string;
  hospitalAvailableBeds: string;
  hospitalAlertPeak: string;
  flashChannelTitle: string;
  flashChannelDesc: string;
  flashTargetLabel: string;
  flashTargetAll: string;
  flashTargetDistrict: string;
  flashTextInputLabel: string;
  flashTextPlaceholder: string;
  flashSendBtn: string;
  flashSuccessAlert: string;
  auditRegistryTitle: string;
  auditRegistryDesc: string;
  auditRegistryIntro: string;

  // AI Assistant Companion / Chat
  aiChatModelText: string;
  aiChatWelcome: string;
  aiChatServiceError: string;
  aiChatQuickEventCuration: string;
  aiChatQuickPrivacyCndp: string;
  aiChatQuickReportIncident: string;
  aiChatTitle: string;
  aiChatSubTitle: string;
  aiChatActiveProfile: string;
  aiChatThinking: string;
  aiChatInputPlaceholder: string;

  // BLE Mesh Simulator
  meshPowerBtnOn: string;
  meshPowerBtnOff: string;
  meshEmergencyTitle: string;
  meshEmitterLabel: string;
  meshRecipientLabel: string;
  meshPlaceholderText: string;
  meshMessagePrompt: string;
  meshPropagateBtn: string;
  meshPropagatingText: string;
  meshVisualTitle: string;
  meshVisualEmitter: string;
  meshVisualRelay: string;
  meshVisualGateway: string;
  meshVisualHop: string;
  meshLedgerTitle: string;
  meshLedgerEmpty: string;
  meshLogStatusTitle: string;
  meshPowerToggledOnLog: string;
  meshPowerToggledOffLog: string;
  meshClearQueueBtn: string;
}

export const translations: Record<LanguageCode, TranslationDictionary> = {
  FR: {
    appName: "MyCity Companion",
    appSub: "Calm Nebula Edition / Casablanca",
    urbanPortal: "🏙️ Portail Urbain",
    residencePortal: "🏢 Espace MyResidence",
    flashTitle: "MESSAGE FLASH",
    flashBody: "Travaux Bvd. Zerktouni - Déviation active via Rue Taha Houcine.",
    cmdTitle: "Tableau de Commande du Simulateur",
    cmdSub: "Permutez les identités ci-dessous pour vérifier la conformité d'accès CNDP & les formules business",
    sqlSpecBtn: "Spécification & Schémas SQL",
    publicCitoyen: "Citoyen",
    businessBasic: "Basique Cat 1 (299 MAD)",
    businessPremium: "Premium Cat 2 (799 MAD)",
    mairieLabel: "Conseil Mairie",
    
    tabForum: "💬 Forum Général",
    tabAssistant: "🤖 Assistant Juridique",
    tabLaws: "⚖️ Lois Marocaines",
    tabPros: "🛠️ Pros Copropriété",
    tabBudget: "📊 Recettes / Dépenses",
    tabValidation: "🛡️ Panel Validation",
    
    statusLabelTitle: "Votre Statut de membre :",
    statusUnverified: "Non vérifié",
    statusPending: "Validation en cours",
    statusVerified: "Résident Vérifié 🟢",
    statusSyndic: "Syndic Administrateur 👑",
    demoAdminRightsOn: "Activer droits administrateur (Démo)",
    demoAdminRightsOff: "Repasser résident standard (Démo)",
    
    forumLockedTitle: "🔒 Accès au Forum Résident Bloqué",
    forumLockedDesc: "Le forum général est un cercle privé réservé uniquement aux habitants légitimes et membres associés élus du syndic de l'immeuble. Pour débloquer l'accès :",
    authMethodsTitle: "Méthodes d'authentification résidentielle :",
    roleResidentOption: "🏠 Copropriétaire / Locataire",
    roleSyndicOption: "👑 Membre du Syndic électoral",
    aptNumberLabel: "N° d'Appartement :",
    optACodeLabel: "Option A : Entrer Code d'Invitation du Syndic (démo : 1800106) :",
    codePlaceholder: "Saisir le code PIN à 7 chiffres...",
    orLabel: "— OU —",
    optBDocLabel: "Option B : Charger un justificatif officiel marocain :",
    docLydec: "Facture Réseau Eau/Elec Lydec (< 3 mois)",
    docBail: "Contrat de bail enregistré localement",
    docTitre: "Acte de Propriété (Conservation Foncière)",
    docPV: "Procès-Verbal de l'Assemblée Générale (Élection)",
    clickDragUpload: "Cliquez ou glissez un fichier (PDF, PNG, JPG)",
    submitAccessBtn: "Soumettre Demande d'Accès",
    instantValidateBtn: "⚡ Validation Instantanée",
    
    forumSearchPlaceholder: "Rechercher une discussion dans la résidence...",
    catAll: "Toutes catégories",
    catMaintenance: "🛠️ Entretien",
    catAg: "🏛️ AG & Votes",
    catSecurity: "🛡️ Sécurité",
    catCommon: "🌱 Vie Commune",
    catIncident: "⚠️ Incident",
    noDiscussions: "Aucune discussion enregistrée. Soyez le premier à poster un message !",
    byLabel: "Par",
    commentsCountLabelOne: "Commentaire",
    commentsCountLabelPlural: "Commentaires",
    replyPlaceholder: "Répondre de manière bienveillante...",
    postTitleLabel: "Sujet du post :",
    postContentLabel: "Détaillez votre message...",
    newPostBtn: "Publier l'Annonce",
    publishSuccessAlert: "Alimentation réussie ! Votre post a été modéré par l'IA et publié.",
    moderationBlockedTitle: "🚫 Message Bloqué par la Modération IA",
    moderationBlockedDesc: "Le système intelligent de MyResidence a intercepté le message car il enfreint nos règles de communication (langage offensant, menaces ou propos injurieux).",
    closeBtn: "Fermer",

    didYouKnowTitle: "Le saviez-vous ? (Loi 106-12)",
    didYouKnowText: "Le quorum pour valider une assemblée générale de copropriété au Maroc est de plus de la moitié des voix des copropriétaires (les millièmes de propriété). Si ce quorum n'est pas réuni à la première date, une seconde réunion est légalement convoquée sous 30 jours et prend ses décisions à la majorité des membres présents et représentés.",
    searchLawPlaceholder: "Rechercher un article ou un mot clef de la Loi marocaine 18-00...",
    majorityRequiredLabel: "Majorité Requise :",
    moroccanLawHub: "Cadre Réglementaire de la Copropriété au Maroc",
    regulatoryComplianceText: "Tous les articles répertoriés sont issus de la Loi 18-00 et sa révision modernisée Loi 106-12, promulguée par Dahir afin d'orchestrer la gestion de la copropriété immobilière.",

    tradesHeader: "Annuaire des Prestataires de Services Référés",
    tradesSub: "Voisins & Syndic Recommandés",
    verifiedSyndicBadge: "Vérifié Syndic ✓",
    interventionsCount: "Interventions",
    callBtn: "Appeler",
    recommendBtn: "Recommander",
    recommendedActive: "Recommandé 👍",
    reviewsCountLabel: "Recommandations",

    totalRevenue: "Total Recettes",
    totalExpenses: "Total Dépenses",
    currentBalance: "Solde Courant",
    reserveFundEst: "Fonds d'Urgence Estimé",
    categoryLabel: "Catégorie",
    itemLabel: "Intitulé du Flux",
    amountLabel: "Montant (MAD)",
    dateLabel: "Date du mouvement",
    actionsLabel: "Actions",
    addTransactionTitle: "Ajouter une Ligne Comptable (Syndic/Copropriété)",
    recetteLabel: "Recette (+)",
    depenseLabel: "Dépense (-)",
    addBtn: "Ajouter au grand livre",
    deleteLabel: "Supprimer",
    budgetSpreadsheetTitle: "Calculateur & Feuille Comptable de la Copropriété",
    moroccoDirham: "MAD",

    welcomeIntro: "Bienvenue sur l'Assistant MyResidence",
    aiLawAssistantText: "Posez toutes vos questions relatives aux charges de copropriété, aux obligations légales du Syndic, aux règles de quorum et de majorité ou en cas de litige entre voisins au Maroc. Notre IA est spécialisée dans les Dahirs des lois 18-00 et 106-12.",
    aiChatPlaceholder: "Posez votre question juridique (ex: Quelle majorité pour peindre la façade ?)...",
    sendBtn: "Poser la question",
    questionsSuggestionsTitle: "Suggestions de questions juridiques :",

    controlPanelTitle: "Panel de Modération et Validation Syndic",
    controlPanelSub: "En tant que membre du Syndic éligible, examinez en temps réel les justificatifs d'habitation marocains téléversés par les résidents pour valider leur accès au forum.",
    validatingApplicant: "Demande de validation d'appartement",
    acceptBtn: "Approuver l'Habitant",
    rejectBtn: "Rejeter la demande",
    noPendingVerifications: "Aucune demande de validation résidentielle en attente. Tout est à jour !",

    // MyResidence added values for FR
    espaceMyResidence: "Espace MyResidence",
    copropriete: "Copropriété",
    residenceSub: "Sert de hub d'immeuble, gestionnaire de budget et conformité juridique marocaine (Loi 18-00).",
    createNewBldGroupBtn: "Créer un nouveau groupe d'immeuble",
    residentsCountLabel: "Résidents",
    apartmentsCountLabel: "Appartements",
    syndicLabel: "Syndic",
    createDiscussionTitle: "Créer une Discussion",
    aiModAlertText: "⚠️ AI Moderation Active : Le règlement interne de copropriété coopérative interdit strictement les outrages, vulgarités (Darija/FR/EN) et menaces de poursuites agressives directs.",
    discussionTitleLabel: "Titre de l'Avis :",
    discussionTitlePlaceholder: "Ex: Pression d'eau faiblarde au RdC",
    categoryFormLabel: "Catégorie :",
    messageLabel: "Message :",
    messagePlaceholder: "Décrivez votre sujet de manière détaillée et polie...",
    publishPostBtn: "Publier sur le Tableau",
    aiAssistantTitle: "Assistant Juridique Copropriété AI",
    aiAssistantDesc: "Interrogez notre assistant juridique sur le cadre de la Loi 18-00 au Maroc, les conflits de voisinage, les pouvoirs d'action du syndic et la répartition des coûts d'entretien du hall d'entrée ou de la toiture.",
    aiAssistantPlaceholderText: "Posez votre première question légale ci-dessous ou cliquez sur un de nos modèles pré-chargés pour simuler le conseil :",
    aiAssistantConsultingText: "Consultation des dahirs en cours...",
    aiAssistantInputPlaceholder: "Ex: Mon voisin refuse de payer sa part de l'ascenseur, que faire légalement ?",
    filterLawPlaceholder: "Filtrer par mot-clé (ex: quorum, majorite, syndic)...",
    lawsTitle: "📚 LOIS 18-00 ET 106-12 COP",
    reserveFundTitle: "Conformité Fonds de Réserve (Art. 36-2 l'exigence Marocaine)",
    reserveFundPrefix: "Le fonds prévisionnel de précaution s'élève estimativement à",
    reserveFundSuffix: "sur la base de cet exercice comptable. Son alimentation annuelle est obligatoire sous peine de poursuite civile du syndicat de copropriété.",
    buildingLedgerTitle: "Livre de compte de l'immeuble",
    unverifiedTreasureAlert: "Veuillez d'abord valider votre appartenance à la résidence pour pouvoir éditer la trésorerie budgétaire.",
    movementLabel: "Mouvement :",
    revenuePlusLabel: "(+) Recette",
    expenseMinusLabel: "(-) Dépense",
    ledgerDesignationLabel: "Libellé / Désignation :",
    ledgerDesignationPlaceholder: "Ex: Entretien toiture",
    ledgerAmountPlaceholder: "Saisir en Dirham...",
    ledgerSubmitBtn: "Valider le versement",
    verificationConsoleTitle: "Console de Vérification de la Copropriété",
    verificationConsoleDesc: "Validez ou rejetez les demandes de copropriétaires de la résidence.",
    activeCoproAdminLabel: "Admin Copro Actif",
    verificationConsoleEmpty: "🎉 Aucune validation en attente pour cette résidence. Toutes les charges et inscriptions sont à jour !",
    proofLabel: "Justificatif :",
    depositedAgo: "Déposé :",
    viewProofBtn: "Voir Justificatif",
    messageRejectedTitle: "⚠️ Message Rejeté : Détection d'Attaque éthique",
    ethicsDetectorDesc: "Le filtre d'éthique automatique MyResidence AI (Auto Moderation) a détecté des profanités, termes injurieux ou formulations violentes qui menacent le vivre-ensemble résidentiel.",
    diagnosticAnalysisLabel: "Analyse diagnostique :",
    modifyPromptBtn: "Modifier et corriger",
    createBldModalTitle: "Créer un nouveau groupe d'immeuble",
    createBldModalDesc: "Créez un nouvel espace forum et comptable autonome pour votre résidence.",
    bldNameLabel: "Nom de la Résidence :",
    bldNamePlaceholder: "Ex: Résidence Al Andalous",
    bldAddressLabel: "Adresse complète :",
    bldAddressPlaceholder: "Ex: 45 Rue Abou Faraj Al Isfahani",
    bldUnitsLabel: "Nombre d'appartements :",
    bldSyndicLabel: "Syndic Initiateur :",
    bldSyndicPlaceholder: "Ex: Syndic Pro ou votre nom",
    bldSubmitBtn: "Initialiser la copropriété",

    // Urbain Portal UI Strings
    urbanTelemetrySim: "Simulateur de Télémétrie Urbaine",
    realTimeActive: "Temps Réel",
    casaCoords: "Coordonnées de Casablanca :",
    quickAccessProfileTitle: "Accéder à mon Profil / Centre CNDP",
    collaboratorAnonymous: "Collaborateur Citoyen Anonyme",
    droitOubliAlert: "Droit à l'oubli exécuté ! Toutes vos données de session, vos interactions IA et vos requêtes de réclamations fictives ont été réinitialisées.",
    anonymousCitizen: "Collaborateur Citoyen Anonyme",

    // Map Simulation
    mapLiveTitle: "Casablanca Live Map",
    mapP2PSync: "P2P BLE Mesh: sync actif",
    mapShowHeatmap: "Afficher Zones Critiques (Flux)",
    mapHideHeatmap: "Masquer Zones Critiques",
    mapCatEconomic: "Salon / Économique",
    mapCatCulture: "Culturel / Rythmes",
    mapCatSport: "Sport / Solidaire",
    mapCatEcoCsr: "Éco-Citoyen",
    mapCatDutyPharma: "Pharmacie de Garde",
    mapCatActiveClaim: "Réclamation Active",
    mapRolePublic: "Mode Exploration Public",
    mapRoleMairie: "Tableau de Gouvernance Municipale",
    mapRoleCat1: "Cat 1 : Les événements s'affichent uniquement le jour J",
    mapRoleCat2: "Cat 2 : Visibilité permanente et badge Épinglé",

    // Citizen Portal Tabs & Filter
    tabExplore: "🔍 Agenda & Billetterie",
    tabClaim: "📢 Signaler un Problème",
    tabPrivacy: "🛡️ Confidentialité CNDP",
    filterAll: "🌐 Tous les événements",
    filterEco: "💼 Économique",
    filterCulture: "🎨 Culture & Concerts",
    filterEcoCsr: "🌱 Éco-Citoyen",
    filterSport: "🏃 Sport Solidaire",
    officialSponsor: "★ Sponsor Officiel",
    freeEntry: "Gratuit / Entrée Libre",
    eventOrganizer: "Organisateur :",
    centerMap: "Centrer Carte",
    syncCalendar: "📅 Sync",
    registerBtn: "S'inscrire",
    reserveBtn: "Réserver",
    commentsCount: "Commentaires",
    hideBtn: "Masquer",
    rateBtn: "⭐ Noter",
    giveOpinion: "Donnez votre avis...",
    publishBtn: "Publier",
    noReviewsYet: "Aucune note pour le moment. Soyez le premier !",

    // Claim Form
    claimFormTitle: "Signalement de Réclamation Citoyenne",
    claimFormSub: "Un problème de chaussée, d'électricité ou d'hygiène urbaine ? Informez la Mairie.",
    claimCategoryLabel: "Catégorie d'incident",
    claimCategoryChaussee: "🛣️ Chaussée (Trous, Chantiers sans signalisation)",
    claimCategoryEclairage: "💡 Éclairage Public Hors Service",
    claimCategoryDechets: "🗑️ Débordement d'Ordures / Bennes sauvages",
    claimCategoryEau: "💧 Fuite d'eau ou Assainissement",
    claimLocationLabel: "Zone Géographique / Adresse exacte",
    claimLocationPlaceholder: "Ex: Boulevard Maârif, angle rue Jura",
    claimSubjectLabel: "Sujet de l'alerte",
    claimSubjectPlaceholder: "Ex: Lampadaire éteint sur 100 mètres",
    claimDescLabel: "Description détaillée pour l'administration municipale",
    claimDescPlaceholder: "Veuillez décrire le problème afin de faciliter l'autovideau par les services techniques de Casa Baia ou direction de voirie de la ville...",
    claimCndpWarning: "Conformité Loi 09-08 : Vos réclamations seront encryptées et hébergées sur serveurs souverains marocains.",
    claimSubmitBtn: "🗳️ Soumettre la Réclamation Citoyenne",
    claimSuccess: "Réclamation enregistrée ! Elle s'affiche désormais en ROUGE sur votre carte interactive.",

    // Privacy Studio / CNDP
    privacyTitle: "Centre de Confidentialité & Conformité CNDP",
    privacySub: "Gérez vos consentements réglementés en conformité stricte avec la Loi Marocaine 09-08.",
    privacyConsentPanel: "Panneau d'Autorisations de Données",
    privacyOptAnalyticsTitle: "Suivi Analytique Anonyme",
    privacyOptAnalyticsDesc: "Permettre la mesure statistique anonymisée d'activité (Pages Vues, Interactions, likes) pour l'amélioration municipale.",
    privacyOptLocationTitle: "Géolocalisation Active",
    privacyOptLocationDesc: "Permettre l'interrogation de votre position pour le centrage de l'agenda et des pharmacies de garde les plus proches.",
    privacyOptBleTitle: "Participation Réseau Bluetooth Mesh Offline",
    privacyOptBleDesc: "Autoriser l'échange d'identifiants de balise pour relayer cryptographiquement les SOS de vos voisins en cas de coupure réseau.",
    privacyExportTitle: "Droit d'accès et d'export (Art. 5)",
    privacyExportDesc: "Exigez une copie complète de vos logs système sauvegardés et de vos dossiers de réclamations format JSON instantanément.",
    privacyExportBtn: "Exporter mon dossier Loi 09-08",
    privacyEraseTitle: "Droit à l'oubli / Rectification (Art. 7)",
    privacyEraseDesc: "Effacer définitivement l'ensemble de vos historiques d'assistance IA, caches réseau mesh, critiques et trames encodées.",
    privacyEraseBtn: "Supprimer 1-Clic mon Compte & Logs",

    // Ticket Checkout CMI
    cmiGateway: "CMI Gateway",
    ticketTitle: "Guichet de Billetterie MyCity",
    ticketSub: "Paiement Sécurisé CMI / Stripe",
    checkoutEvent: "Événement:",
    checkoutCategory: "Catégorie:",
    checkoutOrganizer: "Organisateur:",
    checkoutTotal: "Total à Payer:",
    checkoutSuccess: "🎉 Réservation validée ! Un pass d'accès QR code a été simulé et transmis par messagerie.",
    checkoutWarning: "⚠️ Validation fictive CMI : cette action effectue un versement d'abonnement vers le compte du commerce partenaire.",
    cancelBtn: "Annuler",
    checkoutPayBtn: "Simuler le Paiement (MAD)",
    calendarSyncMessage: "Synchronisation avec Google / Apple Calendar en cours pour :",
    calendarSyncDayJ: "Jour J programmé",

    // Business Portal
    partnerSubCatLabel: "Formule Partenaire Active",
    partnerSwitchCat1Label: "Basic Cat 1 (299 MAD)",
    partnerSwitchCat2Label: "★ Premium Cat 2 (799 MAD)",
    partnerTabMetrics: "📈 Stats & Diagnostics",
    partnerTabPublish: "➕ Publier Agenda",
    partnerTabMessages: "💬 Messagerie",
    metricsViews: "Clics / Vues",
    metricsBookings: "Réservations Validées",
    metricsCommission: "Commission Mairie",
    metricsNetEarnings: "Revenus Nets (MAD)",
    metricsCommissionLabelStandard: "Formule standard (8%)",
    metricsCommissionLabelPremium: "Réduite premium CNDP (5%)",
    metricsNetEarningsLabel: "Hors taxes et redevances",
    heatmapTitle: "Heatmaps & Données Démographiques",
    heatmapLocked: "🔒 Débloquer avec Cat 2",
    heatmapDetailedUnavailable: "Graphique détaillé indisponible",
    heatmapLockDesc: "Dégradez votre commission à 5% et débloquez l'intégration d'heatmaps démographiques en passant à la formule Cat 2.",
    exportCsvBtn: "Exporter CSV",
    validateTicketTitle: "Guichet Physique : Validation des Billets d'accès",
    validateTicketDesc: "Scannez ou entrez manuellement le code unique du visiteur émis par notre système pour valider sa carte d'entrée.",
    ticketIdPlaceholder: "ID Billet...",
    validateBtn: "Valider",
    campaignPushTitle: "Campagne de Push Notification Ciblée (1/mois incluse)",
    campaignPushAvailable: "Disponible",
    campaignPushLocked: "🔒 Option premium Cat 2",
    campaignPushText: "Augmentez l'impact de votre commerce ! La formule Cat 2 vous accorde une campagne de push ciblée mensuelle diffusée directement sur les montres/mobiles des résidents à proximité immédiate.",
    campaignTitleInputLabel: "Message d'accroche Push",
    campaignTargetInputLabel: "District Ciblé",
    campaignStatusTarget: "Anfa District (Rayon 2km)",
    dispatchCampaignBtn: "🚀 Diffuser la notification de campagne",
    campaignDispatchedAlert: "🚀 Notification envoyée aux serveurs d'Apple/Google APNS ! Centrage ciblée sur le segment géographique",
    publishAnnonceTitle: "Publier une annonce / événement sur la carte",
    publishAnnonceDesc: "Insérez un nouvel événement. Vous êtes connecté en tant que partenaire",
    eventTitleInputLabel: "Titre de l'événement",
    eventTitlePlaceholder: "Ex: Conférence Maroc IA",
    eventCategoryInputLabel: "Catégorie",
    eventDescInputLabel: "Description et détails d'accès",
    eventDescPlaceholder: "Précisez l'adresse, les thématiques et les intervenants...",
    ticketPriceInputLabel: "Prix du billet d'entrée (en MAD)",
    pinScheduleLabel: "Planification temporelle du pin",
    pinTodayRadio: "Visible Dès aujourd'hui (Jour-J)",
    pinFutureRadio: "Événement futur / Programmé",
    formCat1PinWarning: "⚠️ Formule Cat 1 : Ce pin s'affichera sur la carte uniquement si vous cochez la case \"Visible Dès aujourd'hui (Jour-J)\". Les événements planifiés dans le futur restent découvrables en texte seulement.",
    publishMarkerBtn: "💾 Publier le marqueur d'événement",
    publishSuccessFeedback: "🎉 Événement publié avec succès ! Retrouvez-le sur la carte municipale.",
    directMessagesTitle: "Messagerie Visiteurs & Questions Directes",
    messageGuestInitials: "M",
    msgReplyPlaceholder: "Saisissez votre réponse...",
    replyBtn: "Répondre",
    cndpReceiptAlert: "Réponse transmise avec accusé CNDP.",

    // Mairie Portal
    statsResolutionRate: "Taux Résolution",
    statsOpenClaims: "Réclamations Ouvertes",
    statsResolutionBeds: "Indices de satisfaction",
    mairieTabClaims: "Triage Réclamations",
    mairieTabServices: "Pharmacies de gardes",
    mairieTabFlash: "Alerte Flash Universelle",
    mairieTabAudit: "Audit Logs CNDP",
    claimsQueueTitle: "File de Tri Citoyenne",
    aiReportLoading: "Calcul AI en cours...",
    aiReportGenerateBtn: "Rapport de Synthèse IA Gemini",
    claimDetailsTitle: "ID:",
    claimHistoryExchange: "Historique d'Échange",
    claimHistoryEmpty: "Aucun message échangé pour le moment. Répondez au citoyen ci-dessous.",
    claimReplyLabel: "Répondre / Mettre à jour l'incident",
    claimReplyPlaceholder: "Saisissez la réponse municipale ou les détails de réparation technique...",
    engageWorkBtn: "⚠️ Engager Travaux (En cours)",
    resolveIncidentBtn: "✅ Résoudre l'Incident",
    incidentResolvedCndpAlert: "Incident totalement résolu et validé par le conseil.",
    satisfactionScoreLabel: "Satisfaction :",
    selectIncidentPlaceholder: "Veuillez sélectionner un incident citoyen dans le tri.",
    aiReportCloseBtn: "Fermer Rapport",
    aiReportCriticalZones: "Régions à Risque",
    aiReportActions: "Actions Prioritaires Recommandées",
    pharmacyTitle: "Pharmacies de garde aujourd'hui",
    hospitalOccupancyTitle: "Taux d'occupation lits d'Urgences CH&U",
    hospitalAvailableBeds: "lits disponibles",
    hospitalAlertPeak: "Urgences localisées",
    flashChannelTitle: "Canal d'Alerte Civique Flash (Message Flash Universel)",
    flashChannelDesc: "Diffuser des notifications instantanées push sur tous les smartphones des citoyens résidents.",
    flashTargetLabel: "Zone Géographique de ciblage",
    flashTargetAll: "📢 Casablanca Métropole (Tous les résidents)",
    flashTargetDistrict: "📍 Quartier",
    flashTextInputLabel: "Texte d'alerte universelle (Format d'urgence)",
    flashTextPlaceholder: "Ex: Alerte travaux coupure d'eau de nuit...",
    flashSendBtn: "📡 Diffuser Immédiatement l'Alerte Flash",
    flashSuccessAlert: "📡 Message de sécurité envoyé par satellite aux relais relais-mesh et émetteurs réseaux de Casablanca !",
    auditRegistryTitle: "Registre d'Audit Système & Sécurité de Mairie",
    auditRegistryDesc: "Conformité CNDP Loi 09-08 de traçabilité des données d'utilisateurs",
    auditRegistryIntro: "Ce grand livre immuable enregistre l'ensemble des requêtes utilisateur, l'administration, les changements de consentements et les transferts d'agenda ainsi que l'interrogation du réseau mesh Bluetooth.",

    // AI Assistant Companion / Chat
    aiChatModelText: "Marhaban ! Je suis **MyCity Assistant**, votre guide municipal intelligent. Comment puis-je vous aider aujourd'hui ? Je peux vous recommander des événements culturels, vous guider pour l'enregistrement d'une réclamation, ou vous informer sur le respect de la loi de protection des données CNDP 09-08.",
    aiChatWelcome: "Assistant IA MyCity",
    aiChatServiceError: "Service temporairement indisponible",
    aiChatQuickEventCuration: "📍 Curation événementielle",
    aiChatQuickPrivacyCndp: "🔒 Confidentialité CNDP 09-08",
    aiChatQuickReportIncident: "💡 Signaler une panne",
    aiChatTitle: "Assistant IA MyCity",
    aiChatSubTitle: "Powered by Gemini 2.5 Pro",
    aiChatActiveProfile: "Profil:",
    aiChatThinking: "L'intelligence municipale réfléchit...",
    aiChatInputPlaceholder: "Posez vos questions à la mairie...",

    // BLE Mesh Simulator
    meshPowerBtnOn: "Moteur Mesh ACTIF",
    meshPowerBtnOff: "Moteur Mesh ÉTEINT",
    meshEmergencyTitle: "Debug Réseau Maillé Offline (BLE Mesh)",
    meshEmitterLabel: "Noeud Émetteur Local",
    meshRecipientLabel: "Gateway Municipale Ciblé",
    meshPlaceholderText: "Ex: Signalement d'eau stagnante sur trottoir",
    meshMessagePrompt: "Message d'Urgence (Sans réseau Internet)",
    meshPropagateBtn: "Diffuser le paquet BLE signature HMAC",
    meshPropagatingText: "Propagating mesh wave...",
    meshVisualTitle: "Visualisation de Propagation",
    meshVisualEmitter: "Émetteur",
    meshVisualRelay: "Relais",
    meshVisualGateway: "Gateway",
    meshVisualHop: "hop",
    meshLedgerTitle: "SQLite Local Cache Ledger",
    meshLedgerEmpty: "Fichiers tampons vides. Prêt pour synchronisation BLE.",
    meshLogStatusTitle: "Derniers Logs Réseau BLE:",
    meshPowerToggledOnLog: "Démarrage du réseau Mesh local BLE V2.",
    meshPowerToggledOffLog: "Arrêt du module local Bluetooth BLE.",
    meshClearQueueBtn: "Purge Cache"
  },
  EN: {
    appName: "MyCity Companion",
    appSub: "Calm Nebula Edition / Casablanca",
    urbanPortal: "🏙️ Urban Portal",
    residencePortal: "🏢 MyResidence Hub",
    flashTitle: "FLASH MESSAGE",
    flashBody: "Zerktouni Blvd Construction - Dynamic detour active via Rue Taha Houcine.",
    cmdTitle: "Simulator Command Center",
    cmdSub: "Switch user roles below to verify CNDP privacy configurations & business tier subscriptions",
    sqlSpecBtn: "Technical Spec & SQL Schemas",
    publicCitoyen: "Citizen",
    businessBasic: "Basic Cat 1 (299 MAD)",
    businessPremium: "Premium Cat 2 (799 MAD)",
    mairieLabel: "City Council",
    
    tabForum: "💬 General Forum",
    tabAssistant: "🤖 Legal Assistant",
    tabLaws: "⚖️ Moroccan Laws",
    tabPros: "🛠️ HOA Professionals",
    tabBudget: "📊 Budgets & Books",
    tabValidation: "🛡️ Validation panel",
    
    statusLabelTitle: "Your Membership status:",
    statusUnverified: "Unverified",
    statusPending: "Validation pending",
    statusVerified: "Verified Resident 🟢",
    statusSyndic: "Syndic Administrator 👑",
    demoAdminRightsOn: "Grant Admin Role (Demo)",
    demoAdminRightsOff: "Revert to Standard Resident",
    
    forumLockedTitle: "🔒 Private Residence Forum Locked",
    forumLockedDesc: "The general forum belongs to a private condominium network. Access is limited to legitimate owners, leaseholders and elected building managers (Syndic). To unlock access:",
    authMethodsTitle: "Residential Authentication Methods:",
    roleResidentOption: "🏠 Co-Owner / Tenant",
    roleSyndicOption: "👑 Elected Syndic Member",
    aptNumberLabel: "Apartment Number:",
    optACodeLabel: "Option A: Enter Syndic Invitation Code (Demo code: 1800106):",
    codePlaceholder: "Enter 7-digit PIN...",
    orLabel: "— OR —",
    optBDocLabel: "Option B: Upload an official Moroccan utility document:",
    docLydec: "Lydec Water/Power Bill (< 3 months old)",
    docBail: "Locally registered rental lease contract",
    docTitre: "Real estate deeds (Conservation Foncière)",
    docPV: "General Assembly Minutes (Elected board status)",
    clickDragUpload: "Click or drag your document here (PDF, PNG, JPG)",
    submitAccessBtn: "Submit Access Request",
    instantValidateBtn: "⚡ Quick Demo Bypass",
    
    forumSearchPlaceholder: "Search building topics...",
    catAll: "All Categories",
    catMaintenance: "🛠️ Maintenance",
    catAg: "🏛️ Assembly Meetings",
    catSecurity: "🛡️ Safety & Security",
    catCommon: "🌱 Community Life",
    catIncident: "⚠️ Local Incident",
    noDiscussions: "No discussions recorded yet. Be the first to start a conversation!",
    byLabel: "By",
    commentsCountLabelOne: "Comment",
    commentsCountLabelPlural: "Comments",
    replyPlaceholder: "Write a kind reply...",
    postTitleLabel: "Post Title:",
    postContentLabel: "Type your message details here...",
    newPostBtn: "Publish Post",
    publishSuccessAlert: "Post successfully evaluated by AI and published to the private feed.",
    moderationBlockedTitle: "🚫 Post Intercepted by AI Moderator",
    moderationBlockedDesc: "The MyResidence security filter blocked this post because it contains terms categorized as inappropriate, toxic, or aggressive.",
    closeBtn: "Close",

    didYouKnowTitle: "Did you know? (Moroccan HOA Law)",
    didYouKnowText: "The quorum to validate a general assembly meeting of co-owners in Morocco is more than half of the property shares. If this is not met during the first call, a second assembly is scheduled within 30 days and decisions can be voted by a simple majority of those present and represented.",
    searchLawPlaceholder: "Search Moroccan co-ownership Law 18-00...",
    majorityRequiredLabel: "Required Majority:",
    moroccanLawHub: "Moroccan Condominium Code Framework",
    regulatoryComplianceText: "All articles cataloged correspond directly to the national Law 18-00 and its modern updates Law 106-12 regulating co-ownership.",

    tradesHeader: "Referred Service Providers Directory",
    tradesSub: "Neighbor & Board Endorsed Pros",
    verifiedSyndicBadge: "Syndic Endorsed ✓",
    interventionsCount: "Jobs completed",
    callBtn: "Call Now",
    recommendBtn: "Endorse",
    recommendedActive: "Endorsed 👍",
    reviewsCountLabel: "Endorsements",

    totalRevenue: "Total Revenue",
    totalExpenses: "Total Expenses",
    currentBalance: "Running Balance",
    reserveFundEst: "Est. Savings Fund",
    categoryLabel: "Category",
    itemLabel: "Line Item Name",
    amountLabel: "Amount (MAD)",
    dateLabel: "Transaction Date",
    actionsLabel: "Actions",
    addTransactionTitle: "Add Accounting Entry (Syndic Ledger)",
    recetteLabel: "Revenue (+)",
    depenseLabel: "Expense (-)",
    addBtn: "Commit Line to Books",
    deleteLabel: "Delete",
    budgetSpreadsheetTitle: "HOA Dynamic Accounting Ledger & Estimator",
    moroccoDirham: "MAD",

    welcomeIntro: "Welcome to MyResidence AI Advisor",
    aiLawAssistantText: "Ask questions on building fees, HOA syndic legal responsibilities, quorum majorities, or neighborhood dispute settlement under Moroccan laws 18-00 and 106-12.",
    aiChatPlaceholder: "Ask legal advice (e.g., What majority vote is needed to install cameras?)...",
    sendBtn: "Consult Advisor",
    questionsSuggestionsTitle: "Suggested Legal Questions:",

    controlPanelTitle: "Syndic Moderation & Resident Review",
    controlPanelSub: "As an admin board member, audit uploaded Moroccan tenant and ownership proof documents in real-time to grant forum access.",
    validatingApplicant: "Apartment Verification Claim",
    acceptBtn: "Approve Resident",
    rejectBtn: "Reject Request",
    noPendingVerifications: "No pending verification claims found. The building register is accurate!",

    // MyResidence added values for EN
    espaceMyResidence: "MyResidence Hub",
    copropriete: "Homeowners Association",
    residenceSub: "Acts as building hub, budget manager & Moroccan co-ownership law compliance (Law 18-00).",
    createNewBldGroupBtn: "Create a new building group",
    residentsCountLabel: "Residents",
    apartmentsCountLabel: "Apartments",
    syndicLabel: "Syndic",
    createDiscussionTitle: "Create a Discussion",
    aiModAlertText: "⚠️ AI Moderation Active: Internal co-ownership rules strictly prohibit direct slurs, vulgarity (Darija/FR/EN), and aggressive litigation threats.",
    discussionTitleLabel: "Topic Title:",
    discussionTitlePlaceholder: "E.g., Low water pressure on ground floor",
    categoryFormLabel: "Category:",
    messageLabel: "Message:",
    messagePlaceholder: "Describe your topic in a detailed and polite manner...",
    publishPostBtn: "Publish on Board",
    aiAssistantTitle: "MyResidence AI Legal Assistant",
    aiAssistantDesc: "Ask our legal assistant about Law 18-00 in Morocco, neighbor disputes, syndic powers, and the breakdown of maintenance costs for halls or roofs.",
    aiAssistantPlaceholderText: "Ask your first legal question below or click on one of our pre-loaded models to simulate advice:",
    aiAssistantConsultingText: "Consulting dahirs (laws) in progress...",
    aiAssistantInputPlaceholder: "E.g., My neighbor refuses to pay his share of the elevator, what should I do legally?",
    filterLawPlaceholder: "Filter by keyword (e.g., quorum, majority, syndic)...",
    lawsTitle: "📚 MOROCCAN LAWS 18-00 & 106-12",
    reserveFundTitle: "Reserve Fund Compliance (Art. 36-2 Moroccan Requirement)",
    reserveFundPrefix: "The preview precautionary emergency fund is estimated at",
    reserveFundSuffix: "based on this fiscal year. Its annual funding is mandatory under penalty of civil prosecution of the HOA council.",
    buildingLedgerTitle: "Building ledger books",
    unverifiedTreasureAlert: "Please verify your residency first to edit the building's treasury book.",
    movementLabel: "Movement type:",
    revenuePlusLabel: "(+) Revenue",
    expenseMinusLabel: "(-) Expense",
    ledgerDesignationLabel: "Label / Description:",
    ledgerDesignationPlaceholder: "E.g., Roof maintenance",
    ledgerAmountPlaceholder: "Enter amount in Dirhams...",
    ledgerSubmitBtn: "Submit transaction",
    verificationConsoleTitle: "HOA Verification & Audit Console",
    verificationConsoleDesc: "Approve or reject verification claims from residents.",
    activeCoproAdminLabel: "Active Board Admin",
    verificationConsoleEmpty: "🎉 No pending verification claims found. The building register is accurate!",
    proofLabel: "Document proof:",
    depositedAgo: "Submitted:",
    viewProofBtn: "View Document",
    messageRejectedTitle: "⚠️ Post Blocked: Ethical Toxicity Detected",
    ethicsDetectorDesc: "The MyResidence AI automated safety filter flagged profanity, offensive language, or aggressive formulation threatening co-existence.",
    diagnosticAnalysisLabel: "Diagnostic analysis:",
    modifyPromptBtn: "Edit and correct",
    createBldModalTitle: "Create a new building group",
    createBldModalDesc: "Launch a separate forum and bookkeeping system for your property.",
    bldNameLabel: "Residence Name:",
    bldNamePlaceholder: "E.g., Al Andalous Residence",
    bldAddressLabel: "Full Address:",
    bldAddressPlaceholder: "E.g., 45 Abou Faraj Al Isfahani Street",
    bldUnitsLabel: "Number of units:",
    bldSyndicLabel: "Initiator Syndic:",
    bldSyndicPlaceholder: "E.g., Syndic Pro or your name",
    bldSubmitBtn: "Initialize Property HOA",

    // Urbain Portal UI Strings
    urbanTelemetrySim: "Urban Telemetry Simulator",
    realTimeActive: "Live Telemetry",
    casaCoords: "Casablanca Coordinates:",
    quickAccessProfileTitle: "Access My Profile / CNDP Center",
    collaboratorAnonymous: "Anonymous Citizen Contributor",
    droitOubliAlert: "Right to be forgotten applied! All your session data, AI chat context and mock claims have been reset.",
    anonymousCitizen: "Anonymous Citizen Contributor",

    // Map Simulation
    mapLiveTitle: "Casablanca Live Map",
    mapP2PSync: "P2P BLE Mesh: sync active",
    mapShowHeatmap: "Show Critical Zones (Flow)",
    mapHideHeatmap: "Hide Critical Zones",
    mapCatEconomic: "Fair / Economic",
    mapCatCulture: "Cultural / Rhythms",
    mapCatSport: "Sport / Solidarity",
    mapCatEcoCsr: "Eco-Citizen",
    mapCatDutyPharma: "On-Duty Pharmacy",
    mapCatActiveClaim: "Active Citizen Incident",
    mapRolePublic: "Public Exploration Mode",
    mapRoleMairie: "Municipal Governance Dashboard",
    mapRoleCat1: "Cat 1: Pins visible only on D-Day",
    mapRoleCat2: "Cat 2: Permanent map presence & Pinned Badge",

    // Citizen Portal Tabs & Filter
    tabExplore: "🔍 Events & Booking",
    tabClaim: "📢 Support Ticket",
    tabPrivacy: "🛡️ CNDP Privacy",
    filterAll: "🌐 All Events",
    filterEco: "💼 Economic",
    filterCulture: "🎨 Culture & Concerts",
    filterEcoCsr: "🌱 Eco-Citizen",
    filterSport: "🏃 Sport Solidarity",
    officialSponsor: "★ Official Sponsor",
    freeEntry: "Free Entry / Open Doors",
    eventOrganizer: "Organizer:",
    centerMap: "Center Map",
    syncCalendar: "📅 Sync",
    registerBtn: "Register",
    reserveBtn: "Book Now",
    commentsCount: "Comments",
    hideBtn: "Hide",
    rateBtn: "⭐ Rate",
    giveOpinion: "Write a short notice...",
    publishBtn: "Post Billet",
    noReviewsYet: "No ratings yet. Be the first to share your experience!",

    // Claim Form
    claimFormTitle: "Lodge a Citizen Incident Claim",
    claimFormSub: "Spotted a street hole, broken lamppost, or illegal garbage heap? Notify city council.",
    claimCategoryLabel: "Incident Category",
    claimCategoryChaussee: "🛣️ Street & Pavement Holes / Unmarked Construction Sites",
    claimCategoryEclairage: "💡 Broken Street Lamps",
    claimCategoryDechets: "🗑️ Garbage Spill / Overfilled Dumpster",
    claimCategoryEau: "💧 Water Leak / Sewer Defect",
    claimLocationLabel: "Geographical Zone / Exact Street Address",
    claimLocationPlaceholder: "E.g., Maârif Blvd, corner of Jura Street",
    claimSubjectLabel: "Brief Subject Title",
    claimSubjectPlaceholder: "E.g., Offline street lamp spanning 100 meters",
    claimDescLabel: "Detailed description for the municipal technical services",
    claimDescPlaceholder: "Provide a complete description to assist technical teams (e.g. Casa Baia or public works directory) with dispatching crews...",
    claimCndpWarning: "Moroccan Law 09-08: Your reported incidents are end-to-end encrypted and hosted on secure municipal servers.",
    claimSubmitBtn: "🗳️ Lodge Ticket to City Council",
    claimSuccess: "Incident registered successfully! Your ticket is now visible in RED on your interactive map.",

    // Privacy Studio / CNDP
    privacyTitle: "CNDP Data Protection & Privacy Center",
    privacySub: "Verify and opt out of analytics tracking in accordance with Moroccan Law 09-08.",
    privacyConsentPanel: "Data Autonomy & Consent Panel",
    privacyOptAnalyticsTitle: "Anonymized Analytics",
    privacyOptAnalyticsDesc: "Allow anonymous logging of actions (Views, interactions, reviews) to assist municipal service optimization.",
    privacyOptLocationTitle: "Active Geolocalisation",
    privacyOptLocationDesc: "Permit querying device position to center local maps and identify nearest on-duty pharmacies.",
    privacyOptBleTitle: "BLE Peer-to-Peer Mesh Offline Network",
    privacyOptBleDesc: "Authorize sharing short-range beacon identifiers to securely relay neighbor emergency SOS payloads without internet access.",
    privacyExportTitle: "Right of access and export (Art. 5)",
    privacyExportDesc: "Download an instant complete JSON file of all processed system logs, AI chat transcripts and claims data.",
    privacyExportBtn: "Export My CNDP Law 09-08 Dossier",
    privacyEraseTitle: "Right to be forgotten / Erasure (Art. 7)",
    privacyEraseDesc: "Permanently delete cached mesh packets, AI response history, tickets, reviews and personal identifiers from all servers.",
    privacyEraseBtn: "1-Click Delete Account & All Logs",

    // Ticket Checkout CMI
    cmiGateway: "Secured CMI Gateway",
    ticketTitle: "MyCity Ticket Booking Counter",
    ticketSub: "Secured CMI / Credit Card Checkout",
    checkoutEvent: "Target Event:",
    checkoutCategory: "Category:",
    checkoutOrganizer: "Organizer:",
    checkoutTotal: "Total Due:",
    checkoutSuccess: "🎉 Booking verified ! Access QR pass simulated and dispatched to your email address.",
    checkoutWarning: "⚠️ Note: This is an educational checkout page. The simulated transaction behaves as a subscription charge towards our commercial partner.",
    cancelBtn: "Abort Pay",
    checkoutPayBtn: "Make simulated transaction (MAD)",
    calendarSyncMessage: "Syncing with Apple / Google Calendar event:",
    calendarSyncDayJ: "D-Day Schedule Active",

    // Business Portal
    partnerSubCatLabel: "Current Subscription Tier",
    partnerSwitchCat1Label: "Basic Cat 1 (299 MAD)",
    partnerSwitchCat2Label: "★ Premium Cat 2 (799 MAD)",
    partnerTabMetrics: "📈 Analytics & Diagnostics",
    partnerTabPublish: "➕ Publish Event",
    partnerTabMessages: "💬 Live Messages",
    metricsViews: "Views / Interactions",
    metricsBookings: "Confirmed Sales",
    metricsCommission: "Municipal Fee",
    metricsNetEarnings: "Net Revenue (MAD)",
    metricsCommissionLabelStandard: "Standard commission rate (8%)",
    metricsCommissionLabelPremium: "Premium CNDP discounted rate (5%)",
    metricsNetEarningsLabel: "Excluding municipal duties & VAT",
    heatmapTitle: "City Demographics & Dynamic Footprint Flow",
    heatmapLocked: "🔒 Exclusive Cat 2 Feature",
    heatmapDetailedUnavailable: "Detailed Analytics Chart Hidden",
    heatmapLockDesc: "Get premium discounted municipal fees (5%) and unlock demographic heatmap integrations by upgrading to the Premium Cat 2 tier.",
    exportCsvBtn: "Export CSV Data",
    validateTicketTitle: "Billet Registry: On-Site Ticket Validation Counter",
    validateTicketDesc: "Manually code-check or scan client tickets issued by MyCity to validate admission rights.",
    ticketIdPlaceholder: "Insert Billet ID...",
    validateBtn: "Validate Pass",
    campaignPushTitle: "Targeted Push Notification Campaign (1/Month)",
    campaignPushAvailable: "Available",
    campaignPushLocked: "🔒 Locked - Choose Cat 2 tier",
    campaignPushText: "Maximize local awareness: Cat 2 subscribers can schedule one targeted push advertisement per month, broadcasted directly to smartwatches of active users within 2km.",
    campaignTitleInputLabel: "Push Campaign Catchphrase",
    campaignTargetInputLabel: "Target District Segment",
    campaignStatusTarget: "Anfa District Ring (2km Radius)",
    dispatchCampaignBtn: "🚀 Broadcast Campaign Notification Now",
    campaignDispatchedAlert: "🚀 Notification queued to APNS/FCM servers! Geofenced on proximity segment.",
    publishAnnonceTitle: "Publish an event/pin on the Interactive Map",
    publishAnnonceDesc: "Create a new local pin. You are logged as partner merchant:",
    eventTitleInputLabel: "Event Name",
    eventTitlePlaceholder: "E.g., Moroccan AI & Data Summit",
    eventCategoryInputLabel: "Category Group",
    eventDescInputLabel: "Event Description & Location Details",
    eventDescPlaceholder: "Write address, schedule, speakers, and gate instructions...",
    ticketPriceInputLabel: "Individual Ticket Price (MAD)",
    pinScheduleLabel: "Timeline Scheduling for Map Pin",
    pinTodayRadio: "Active Today (D-Day Event)",
    pinFutureRadio: "Schedule for a future date",
    formCat1PinWarning: "⚠️ Cat 1 Subscription Limit: This map pin will display on the live map ONLY if scheduled as \"Active Today (D-Day Event)\". Upcoming events are cataloged as text-only search items in the agenda hub.",
    publishMarkerBtn: "💾 Save and Publish Interactive Pin",
    publishSuccessFeedback: "🎉 Event pin published successfully! Visible on Casablanca map search queries.",
    directMessagesTitle: "Leads & Direct Visitor Discussions Log",
    messageGuestInitials: "G",
    msgReplyPlaceholder: "Type your query answer...",
    replyBtn: "Reply Ticket",
    cndpReceiptAlert: "Reply sent with CNDP transmission receipt.",

    // Mairie Portal
    statsResolutionRate: "Fix Rate",
    statsOpenClaims: "Active Claims",
    statsResolutionBeds: "Citizen Score Indicator",
    mairieTabClaims: "Incident Registry",
    mairieTabServices: "Duty Pharmacies",
    mairieTabFlash: "Universal Flash Alert",
    mairieTabAudit: "CNDP Audit Trails",
    claimsQueueTitle: "Emergency Claims Sorting Queue",
    aiReportLoading: "Calculating Gemini vectors...",
    aiReportGenerateBtn: "Gemini AI Summary Report",
    claimDetailsTitle: "Ticket ID:",
    claimHistoryExchange: "Crews Dispatch & Communications History",
    claimHistoryEmpty: "No messages recorded yet. Type below to instruct technician dispatch.",
    claimReplyLabel: "Internal note / Municipal feedback line",
    claimReplyPlaceholder: "Type details of technical dispatch, parts ordered, or team notes...",
    engageWorkBtn: "⚠️ Dispatch Technical Crew (In Progress)",
    resolveIncidentBtn: "✅ Complete Work Order",
    incidentResolvedCndpAlert: "Incident resolved and approved by council.",
    satisfactionScoreLabel: "Score:",
    selectIncidentPlaceholder: "Please select an active citizen ticket from the queue array.",
    aiReportCloseBtn: "Close Summary",
    aiReportCriticalZones: "Highly Aggregating Incident Sectors",
    aiReportActions: "Recommended Municipal Priority Protocols",
    pharmacyTitle: "Casablanca On-Duty Pharmacies Today",
    hospitalOccupancyTitle: "ER Intensive Beds Live Occupancy Rate",
    hospitalAvailableBeds: "free beds",
    hospitalAlertPeak: "Emergency Congestion Warning",
    flashChannelTitle: "Emergency Universal Public Broadcast (Flash Message)",
    flashChannelDesc: "Push real-time safety critical notifications on smartwatches and mobile screens of all active Casablanca users.",
    flashTargetLabel: "Proximity Targeting Factor",
    flashTargetAll: "📢 Casablanca Métropole (All users)",
    flashTargetDistrict: "📍 Local District",
    flashTextInputLabel: "Flash Notification Body Text (Concise)",
    flashTextPlaceholder: "E.g., Warning: scheduled water outage in Anfa District...",
    flashSendBtn: "📡 Broadcast Flash Safety Notification Now",
    flashSuccessAlert: "📡 Security broadcast successfully emitted to all Casablanca active Bluetooth meshes and GSM cell nodes!",
    auditRegistryTitle: "Mairie Security Registry & CNDP Audit Logs",
    auditRegistryDesc: "Inmutable ledger ensuring total data tracking compliance under Law 09-08.",
    auditRegistryIntro: "This system log tracks page visits, token creation, CNDP opt-ins and BLE local mesh queries.",

    // AI Assistant Companion / Chat
    aiChatModelText: "Marhaban! I am **MyCity AI Companion**, your smart municipal guide. How can I assist you today? I can search local cultural events, assist you to register an incident claim, or clarify your data privacy rights in under Moroccan CNDP Law 09-08.",
    aiChatWelcome: "MyCity AI Assistant",
    aiChatServiceError: "Service temporarily offline",
    aiChatQuickEventCuration: "📍 Find local events",
    aiChatQuickPrivacyCndp: "🔒 CNDP Law 09-08 compliance",
    aiChatQuickReportIncident: "💡 Tell how to report street hole",
    aiChatTitle: "MyCity AI Advisor",
    aiChatSubTitle: "Powered by Gemini 2.5 Pro",
    aiChatActiveProfile: "Active Role Profile:",
    aiChatThinking: "Consulting municipal data nodes...",
    aiChatInputPlaceholder: "Ask something about Casablanca...",

    // BLE Mesh Simulator
    meshPowerBtnOn: "Mesh Engine ACTIVE",
    meshPowerBtnOff: "Mesh Engine DISABLED",
    meshEmergencyTitle: "Bluetooth Mesh Offline Resiliency Dashboard",
    meshEmitterLabel: "Broadcast Source Node",
    meshRecipientLabel: "Target Municipal Gateway",
    meshPlaceholderText: "E.g., Emergency: Water leak blocking access on Zerktouni Blvd",
    meshMessagePrompt: "Offline Emergency SMS Payload (HMAC Secured)",
    meshPropagateBtn: "Propagate BLE Packet Wave",
    meshPropagatingText: "Propagating mesh wave...",
    meshVisualTitle: "Live Wave Network Visualization",
    meshVisualEmitter: "Source",
    meshVisualRelay: "Relay",
    meshVisualGateway: "Gateway Node",
    meshVisualHop: "hop",
    meshLedgerTitle: "Local SQLite Buffer Ledger",
    meshLedgerEmpty: "Buffer queue empty. Ready to accept BLE payloads.",
    meshLogStatusTitle: "Active BLE Node Logs:",
    meshPowerToggledOnLog: "Initialized offline P2P BLE mesh environment V2.",
    meshPowerToggledOffLog: "Bluetooth low energy module shut down.",
    meshClearQueueBtn: "Purge Database"
  },
  AR: {
    appName: "MyCity Companion",
    appSub: "نسخة سديم الهدوء / الدار البيضاء",
    urbanPortal: "🏙️ البوابة الحضرية",
    residencePortal: "🏢 فضاء إقامتي",
    flashTitle: "رسالة عاجلة",
    flashBody: "أعمال شارع الزرقطوني - تحويل مسار السير نشط عبر شارع طه حسين.",
    cmdTitle: "لوحة التحكم للمحاكي",
    cmdSub: "تبديل الهويات للتحقق من امتثال المراقبة CNDP وباقات الأعمال المتوفرة الدار البيضاء",
    sqlSpecBtn: "مواصفات ومخططات قواعد البيانات",
    publicCitoyen: "مواطن",
    businessBasic: "بسيط فئة 1 (299 د.م)",
    businessPremium: "ممتاز فئة 2 (799 د.م)",
    mairieLabel: "مجلس المدينة",
    
    tabForum: "💬 منتدى السكان العام",
    tabAssistant: "🤖 المستشار القانوني",
    tabLaws: "⚖️ القوانين المغربية",
    tabPros: "🛠️ محترفو الإقامة",
    tabBudget: "📊 الإيرادات والمصاريف",
    tabValidation: "🛡️ لوحة التحقق",
    
    statusLabelTitle: "حالة العضوية الحالية :",
    statusUnverified: "غير مؤكد",
    statusPending: "قيد التحقق",
    statusVerified: "مقيم مؤكد 🟢",
    statusSyndic: "وكيل السنديك 👑",
    demoAdminRightsOn: "تمكين صلاحيات الإدارة (تجريبي)",
    demoAdminRightsOff: "العودة لوضع مقيم عادي",
    
    forumLockedTitle: "🔒 منتدى السكان مغلق وخاص",
    forumLockedDesc: "المنتدى العام فضاء خاص لسكان الإقامة والملاك ومجلس السنديك المنتخب لتسيير البناية. لولوج المنتدى يرجى الاستعانة بإحدى طرق التأكيد التالية:",
    authMethodsTitle: "طرق تفعيل هوية الإقامة وسكان البناية:",
    roleResidentOption: "🏠 مالك / مكتري",
    roleSyndicOption: "👑 عضو السنديك المنتخب",
    aptNumberLabel: "رقم الشقة / الجناح:",
    optACodeLabel: "الخيار أ: إدخال رمز الدعوة المسلم من السنديك (رمز التجربة: 1800106):",
    codePlaceholder: "أدخل الرمز السري المتكون من 7 أرقام...",
    orLabel: "— أو —",
    optBDocLabel: "الخيار ب: تحميل وثيقة أو فاتورة مغربية رسمية لإثبات السكن:",
    docLydec: "فاتورة استهلاك الماء والكهرباء ليدك (أقل من 3 أشهر)",
    docBail: "عقد الكراء مصادق عليه محلياً لحساب الشقة",
    docTitre: "شهادة الملكيّة (الوكالة الوطنية للمحافظة العقارية)",
    docPV: "محضر الجمع العام الاستثنائي لتسمية السنديك",
    clickDragUpload: "اضغط هنا لجلب وتحميل الوثيقة (PDF, PNG, JPG)",
    submitAccessBtn: "إرسال طلب تفعيل العضوية",
    instantValidateBtn: "⚡ تفعيل فوري سريع لغرض التجربة",
    
    forumSearchPlaceholder: "البحث في مواضيع ومقترحات إقامتنا...",
    catAll: "كل الفئات",
    catMaintenance: "🛠️ صيانة وإصلاحات",
    catAg: "🏛️ الجمع العام والتصويت",
    catSecurity: "🛡️ الأمن والأمان",
    catCommon: "🌱 العيش المشترك",
    catIncident: "⚠️ حوادث وأعطاب",
    noDiscussions: "لا توجد منشورات مسجلة بعد. كن أول من يفتتح النقاش مع جيرانك !",
    byLabel: "بواسطة",
    commentsCountLabelOne: "تعليق",
    commentsCountLabelPlural: "تعليقات",
    replyPlaceholder: "اكتب رداً لطيفاً وبناءً...",
    postTitleLabel: "موضوع المنشور :",
    postContentLabel: "اكتب تفاصيل مقترحك هنا...",
    newPostBtn: "نشر الموضوع بالمنتدى",
    publishSuccessAlert: "تم التحقق التلقائي للذكاء الاصطناعي ونشر منشورك بنجاح في الفضاء الخاص بالبناية.",
    moderationBlockedTitle: "🚫 الذكاء الاصطناعي حجب هذا المنشور",
    moderationBlockedDesc: "تم حظر هذا المحتوى تلقائياً لمخالفته لمعايير العيش المشترك (يتضمن عبارات غير لائقة، تهديدات، أو ألفاظاً نابية).",
    closeBtn: "إغلاق",

    didYouKnowTitle: "هل تعلم ؟ (قوانين الملكية المشتركة)",
    didYouKnowText: "النصاب القانوني لصحة المداولات في الجمع العام للملاكين بالمغرب يتطلب حضور أكثر من نصف الملاك المشتركين (أصوات الأنصبة). وفي حالة عدم بلوغ النصاب في الدعوة الأولى، يتم قانوناً استدعاء جمع ثانٍ داخل أجل 30 يوماً يتخذ قراراته بأغلبية أصوات الأعضاء الحاضرين والممثلين.",
    searchLawPlaceholder: "ابحث في فصول قانون الملكية المشتركة 18-00 بالمغرب...",
    majorityRequiredLabel: "الأغلبية المطلوبة :",
    moroccanLawHub: "الإطار القانوني والتنظيمي للملكية المشتركة بالمملكة المغربية",
    regulatoryComplianceText: "تستند تفاصيل الفصول المعروضة هنا على مقتضيات الظهير الشريف الصادر لتنفيذ القانون 18-00 والتعديلات الحديثة لحساب القانون رقم 106-12 المنظم للعقارات المشتركة.",

    tradesHeader: "دليل المقاولين والمحترفين المعتمدين والموصى بهم",
    tradesSub: "مرشح وموثق من طرف السكان والوكيل",
    verifiedSyndicBadge: "معتمد من السنديك ✓",
    interventionsCount: "عمليات منجزة",
    callBtn: "اتصال الهاتفي",
    recommendBtn: "توصية",
    recommendedActive: "تمت التوصية 👍",
    reviewsCountLabel: "توصيات السكان",

    totalRevenue: "مجموع المداخيل",
    totalExpenses: "مجموع المصاريف",
    currentBalance: "الرصيد الجاري الحالي",
    reserveFundEst: "صندوق الطوارئ والاحتياط الإلزامي",
    categoryLabel: "فئة",
    itemLabel: "اسم الفئة / الغرض",
    amountLabel: "المبلغ (درهم مغربي)",
    dateLabel: "تاريخ العملية",
    actionsLabel: "خيارات وتعديل",
    addTransactionTitle: "إدخال معاملة مالية جديدة بالميزانية",
    recetteLabel: "مداخيل وتحصيل (+)",
    depenseLabel: "مصاريف وصيانة (-)",
    addBtn: "تثبيت وضمه لدفاتر الحسابات",
    deleteLabel: "حذف",
    budgetSpreadsheetTitle: "جدول الميزانية ومعادلة المداخيل والمصارف التقديرية",
    moroccoDirham: "درهم",

    welcomeIntro: "مرحباً بك في مستشار إقامتي الذكي",
    aiLawAssistantText: "اطرح جميع أسئلتك بخصوص الواجبات الشهرية للإدارة، الصلاحيات القانونية لوكيل السنديك، أنصبة التصويت، أو تدابير تسوية النزاعات طبقاً للمقتضيات المنصوص عليها بالظهيرين 18-00 و106-12 بالمغرب.",
    aiChatPlaceholder: "اطرح سؤالاً قانونياً (مثال: ما هي الأغلبية اللازمة لطلاء واجهة العمارة ؟)...",
    sendBtn: "استشارة المساعد",
    questionsSuggestionsTitle: "مقترحات أسئلة سكان الإقامة المشتركة :",

    controlPanelTitle: "لوحة تسيير ومراجعة السكان (السنديك)",
    controlPanelSub: "بصفتك مسيراً للسنديك، راجع الوثائق المرفوعة في الوقت الفعلي لتأكيد هوية المقيمين الجدد وتفعيل ولوجهم للمنتدى.",
    validatingApplicant: "طلب تفعيل حساب مقيم للشقة",
    acceptBtn: "قبول وتفعيل حساب الساكن",
    rejectBtn: "رفض الطلب والمستندات",
    noPendingVerifications: "لا توجد طلبات تحقق جديدة معلقة في انتظار المراجعة. دفاتر السجل محدثة بالكامل !",

    // MyResidence added values for AR
    espaceMyResidence: "فضاء إقامتي الموحد",
    copropriete: "الملكية المشتركة",
    residenceSub: "يعمل كمركز للبناية، وتسيير الميزانية وتطبيق قانون الملكية المشتركة 18-00 بالمغرب.",
    createNewBldGroupBtn: "إنشاء مجموعة بناية جديدة",
    residentsCountLabel: "سكان",
    apartmentsCountLabel: "شقق",
    syndicLabel: "السنديك",
    createDiscussionTitle: "إنشاء مناقشة جديدة",
    aiModAlertText: "⚠️ الإشراف الذكي نشط: يمنع القانون الداخلي للملكية المشتركة منعاً كلياً الشتم، الألفاظ النابية (بالدارجة/الفرنسية/الإنجليزية)، أو التهديدات المباشرة.",
    discussionTitleLabel: "موضوع المنشور :",
    discussionTitlePlaceholder: "مثال: ضعف ضغط المياه في الطابق الأرضي",
    categoryFormLabel: "الفئة :",
    messageLabel: "نص الرسالة :",
    messagePlaceholder: "صف موضوعك بالتفصيل وبطريقة مهذبة...",
    publishPostBtn: "نشر على اللوحة",
    aiAssistantTitle: "المساعد القانوني الذكي للملكية المشتركة",
    aiAssistantDesc: "اطرح جميع أسئلتك بخصوص الواجبات الشهرية للإدارة، الصلاحيات القانونية لوكيل السنديك، أنصبة التصويت، أو تدابير تسوية النزاعات طبقاً للمقتضيات المنصوص عليها بالظهيرين 18-00 و106-12 بالمغرب.",
    aiAssistantPlaceholderText: "اطرح سؤالك القانوني الأول أدناه أو اضغط على أحد الأسئلة المقترحة لمحاكاة الاستشارة القانونية:",
    aiAssistantConsultingText: "جاري مراجعة ودراسة الظهائر الشريفة وفصول القانون...",
    aiAssistantInputPlaceholder: "مثال: جاري يرفض أداء نصيبه من صيانة المصعد، ما هي الخطوات القانونية ؟",
    filterLawPlaceholder: "ترشيح حسب الكلمة المفتاحية (مثال: النصاب، الأغلبية، السنديك)...",
    lawsTitle: "📚 القوانين المغربية 18-00 و 106-12 للملكية المشتركة",
    reserveFundTitle: "امتثال صندوق الاحتياط الإلزامي (الفصل 36-2 من القانون المغربي)",
    reserveFundPrefix: "يقدر الصندوق الاحتياطي التقديري للطوارئ بحوالي",
    reserveFundSuffix: "بناءً على حسابات السنة المالية الجارية. ويعتبر تمويله السنوي إلزامياً لتفادي ملاحقة اتحاد الملاك قانونياً.",
    buildingLedgerTitle: "دفاتر الحسابات ودفتر اليومية للبناية",
    unverifiedTreasureAlert: "يرجى أولاً تأكيد عضويتك في الإقامة لتتمكن من تعديل وتسيير ميزانية الصندوق المالي.",
    movementLabel: "نوع المعاملة :",
    revenuePlusLabel: "(+) مداخيل وتحصيل",
    expenseMinusLabel: "(-) مصاريف وصيانة",
    ledgerDesignationLabel: "اسم المعاملة / الغرض :",
    ledgerDesignationPlaceholder: "مثال: صيانة السطح",
    ledgerAmountPlaceholder: "سجل المبلغ بالدرهم...",
    ledgerSubmitBtn: "تثبيت وضخ المعاملة",
    verificationConsoleTitle: "شاشة مراجعة مقيمي البناية (السنديك)",
    verificationConsoleDesc: "تأكيد أو رفض طلبات التحقق للمقيمين والملاك في الإقامة.",
    activeCoproAdminLabel: "مسير السنديك نشط",
    verificationConsoleEmpty: "🎉 لا توجد شارات أو طلبات تأكيد معلقة. جميع سجلات البناية محدثة بالكامل !",
    proofLabel: "المستند المرفق :",
    depositedAgo: "تاريخ الطلب:",
    viewProofBtn: "عرض ووظيفة الملف المرفق",
    messageRejectedTitle: "⚠️ تم حظر المنشور: تم رصد عبارات تخالف معايير النظام",
    ethicsDetectorDesc: "رصد برنامج المراقبة والذكاء الاصطناعي للإقامة عينات غير لائقة أو عبارات هجومية تخالف ميثاق السلوك المشترك للبناية.",
    diagnosticAnalysisLabel: "التقرير التحليلي الفوري للذكاء الاصطناعي :",
    modifyPromptBtn: "تعديل وإعادة الصياغة",
    createBldModalTitle: "إنشاء مجموعة بناية جديدة بسجل مستقل",
    createBldModalDesc: "إطلاق فضاء تسيير ومنتدى مالي مستقل وخاص بالبناية الجديدة.",
    bldNameLabel: "اسم الإقامة / البناية :",
    bldNamePlaceholder: "مثال: إقامة الأندلس",
    bldAddressLabel: "العنوان بالكامل :",
    bldAddressPlaceholder: "مثال: 45 زنقة أبو الفرج الأصفهاني",
    bldUnitsLabel: "عدد شقق المجمع :",
    bldSyndicLabel: "اسم وكيل السنديك المعتمد :",
    bldSyndicPlaceholder: "مثال: سنديك برو أو اسمكم الكريم",
    bldSubmitBtn: "تأكيد وإطلاق فضاء البناية",

    // Urbain Portal UI Strings
    urbanTelemetrySim: "محاكي التليمترية الحضرية",
    realTimeActive: "البث التليميتري الحي",
    casaCoords: "إحداثيات الدار البيضاء:",
    quickAccessProfileTitle: "الولوج إلى ملفي الشخصي / مركز CNDP",
    collaboratorAnonymous: "مواطن ساهم مجهول",
    droitOubliAlert: "تم تطبيق حق النسيان! تم مسح جميع بيانات جلستك ومحادثات الذكاء الاصطناعي وبلاغاتك التجريبية.",
    anonymousCitizen: "مواطن ساهم مجهول",

    // Map Simulation
    mapLiveTitle: "خريطة الدار البيضاء الحية",
    mapP2PSync: "P2P BLE Mesh: المزامنة نشطة",
    mapShowHeatmap: "عرض المناطق الحيوية (التدفق)",
    mapHideHeatmap: "إخفاء المناطق الحيوية",
    mapCatEconomic: "معرض / اقتصادي",
    mapCatCulture: "ثقافي / إيقاعات",
    mapCatSport: "رياضة / تضامن",
    mapCatEcoCsr: "مواطنة بيئية",
    mapCatDutyPharma: "صيدلية الحراسة",
    mapCatActiveClaim: "بلاغ مواطن نشط",
    mapRolePublic: "وضع استكشاف عام",
    mapRoleMairie: "لوحة التحكم للحوكمة البلدية",
    mapRoleCat1: "فئة 1: تظهر العلامات على الخريطة فقط في اليوم المبرمج",
    mapRoleCat2: "فئة 2: ظهور دائم على الخريطة وعلامة مميزة",

    // Citizen Portal Tabs & Filter
    tabExplore: "🔍 الأنشطة والحجز",
    tabClaim: "📢 تقديم بلاغ",
    tabPrivacy: "🛡️ خصوصية CNDP",
    filterAll: "🌐 كل الأنشطة",
    filterEco: "💼 اقتصادي",
    filterCulture: "🎨 ثقافة وحفلات",
    filterEcoCsr: "🌱 مواطنة بيئية",
    filterSport: "🏃 رياضة تضامنية",
    officialSponsor: "★ راعي رسمي",
    freeEntry: "دخول مجاني / مفتوح",
    eventOrganizer: "المنظم:",
    centerMap: "توسيط الخريطة",
    syncCalendar: "📅 مزامنة",
    registerBtn: "التسجيل",
    reserveBtn: "احجز الآن",
    commentsCount: "تعليقات",
    hideBtn: "إخفاء",
    rateBtn: "⭐ تقييم",
    giveOpinion: "اكتب تعليقاً قصيراً...",
    publishBtn: "نشر التقييم",
    noReviewsYet: "لا توجد تقييمات بعد. كن أول من يشارك تجربته!",

    // Claim Form
    claimFormTitle: "تقديم شكوى مواطن",
    claimFormSub: "رأيت حفرة في الطريق، مصباح شارع مكسور أو تراكم نفايات؟ أخبر مجلس المدينة.",
    claimCategoryLabel: "فئة البلاغ",
    claimCategoryChaussee: "🛣️ حفر في الطرق / ورشات بدون علامات إرشادية",
    claimCategoryEclairage: "💡 مصابيح إنارة عمومية معطلة",
    claimCategoryDechets: "🗑️ تراكم النفايات / حاويات ممتلئة بالكامل",
    claimCategoryEau: "💧 تسرب مياه / مشكل الصرف الصحي",
    claimLocationLabel: "المنطقة الجغرافية / العنوان الدقيق بالشارع",
    claimLocationPlaceholder: "مثال: ممر المعاريف، زاوية شارع جورا",
    claimSubjectLabel: "عنوان مختصر للبلاغ",
    claimSubjectPlaceholder: "مثال: مصباح شارع منطفئ على طول 100 متر",
    claimDescLabel: "وصف تفصيلي للخدمات التقنية البلدية",
    claimDescPlaceholder: "يرجى تقديم تفاصيل كاملة لتسهيل عمل فرق المعالجة الميدانية (على سبيل المثال Casa Baia أو مديرية الطرق)...",
    claimCndpWarning: "القانون المغربي 09-08: بلاغاتك مشفرة بالكامل ومستضافة على خوادم بلدية آمنة.",
    claimSubmitBtn: "🗳️ إرسال البلاغ إلى مجلس المدينة",
    claimSuccess: "تم تسجيل البلاغ بنجاح! شكواك تظهر الآن باللون الأحمر على الخريطة التفاعلية.",

    // Privacy Studio / CNDP
    privacyTitle: "مركز حماية البيانات وخصوصية CNDP",
    privacySub: "تحقق وتحكم في تتبع بياناتك بما يتماشى مع مقتضيات القانون المغربي 09-08.",
    privacyConsentPanel: "لوحة التحكم بالخصوصية والبيانات الشخصية",
    privacyOptAnalyticsTitle: "التسجيل التحليلي مجهول الهوية",
    privacyOptAnalyticsDesc: "السماح بالولوج مجهول الهوية للأنشطة والتقييمات لمساعدة مجلس المدينة في تحسين الكفاءة والخدمات.",
    privacyOptLocationTitle: "تحديد الموقع النشط",
    privacyOptLocationDesc: "السماح بقراءة موقع جهازك الحالي لتوسيط الخريطة وتحديد الصيدليات الأقرب إليك.",
    privacyOptBleTitle: "المشاركة في شبكة البلوتوث Mesh المغلقة",
    privacyOptBleDesc: "تخويل مشاركة معرفات الرموز القريبة لنقل رسائل الإنقاذ العاجلة لجيرانك بشكل آمن بدون شبكة إنترنت.",
    privacyExportTitle: "حق الوصول والتصدير (الفصل 5)",
    privacyExportDesc: "قم بتحميل ملف JSON موحد وفوري يتضمن كل بيانات جلستك، سجل محادثاتك وسجل شكواك الشخصية.",
    privacyExportBtn: "تصدير مغلف ملف CNDP 09-08",
    privacyEraseTitle: "حق النسيان / المسح النهائي (الفصل 7)",
    privacyEraseDesc: "امسح نهائياً وبنقرة واحدة ملف الجلسة، محادثات الذكاء الاصطناعي، بلاغاتك وكل المعرفات المرتبطة بك.",
    privacyEraseBtn: "مسح فوري 1-Click للحساب والسجلات",

    // Ticket Checkout CMI
    cmiGateway: "بوابة CMI المؤمّنة",
    ticketTitle: "شباك حجز التذاكر لبلديتي",
    ticketSub: "أداء مؤمن CMI / بطاقة بنكية",
    checkoutEvent: "النشاط المترقب:",
    checkoutCategory: "الفئة:",
    checkoutOrganizer: "المنظم:",
    checkoutTotal: "المبلغ الإجمالي:",
    checkoutSuccess: "🎉 تم تأكيد الحجز بنجاح! تم إنشاء رمز الاستجابة السريعة (QR) لإثبات الدخول للمرسل إليه.",
    checkoutWarning: "⚠️ ملاحظة: هذه صفحة عملية دفع افتراضية تجريبية. تحاكي المعاملة تحويل مبلغ الاشتراك لصالح الشريك التجاري.",
    cancelBtn: "إلغاء الدفع",
    checkoutPayBtn: "محاكاة عملية الدفع (درهم)",
    calendarSyncMessage: "جاري المزامنة مع روزنامة آبل / جوجل للنشاط:",
    calendarSyncDayJ: "البرمجة نشطة لليوم المبرمج",

    // Business Portal
    partnerSubCatLabel: "الباقة النشطة للشريك",
    partnerSwitchCat1Label: "باقة بسيطة فئة 1 (299 د.م)",
    partnerSwitchCat2Label: "★ باقة ممتازة فئة 2 (799 د.م)",
    partnerTabMetrics: "📈 مؤشرات وأرقام تشخيصية",
    partnerTabPublish: "➕ نشر نشاط",
    partnerTabMessages: "💬 المحادثات المباشرة",
    metricsViews: "المشاهدات / التفاعلات",
    metricsBookings: "المبيعات والدخول المؤكد",
    metricsCommission: "رسم البلدية",
    metricsNetEarnings: "صافي الأرباح (درهم)",
    metricsCommissionLabelStandard: "نسبة الاقتطاع القياسية (8%)",
    metricsCommissionLabelPremium: "نسبة مخفضة لحساب CNDP الممتاز (5%)",
    metricsNetEarningsLabel: "باستثناء الرسوم البلدية والضريبة على القيمة المضافة",
    heatmapTitle: "الخصائص الديمغرافية الحية وتدفق المواطنين",
    heatmapLocked: "🔒 حصرية للباقة فئة 2",
    heatmapDetailedUnavailable: "مخطط التحليلات المتقدمة مخفي",
    heatmapLockDesc: "احصل على عمولة بلدية مخفضة (5٪) وافتح تفعيل خرائط الحرارة الديموغرافية عبر الترقية إلى باقة فئة 2.",
    exportCsvBtn: "تصدير ملف CSV",
    validateTicketTitle: "شباك التحقق الميداني والتحقق من التذاكر",
    validateTicketDesc: "أدخل يدوياً رمز التذكرة أو امسح الرمز الصادر لتأكيد أحقية دخول الزائر.",
    ticketIdPlaceholder: "أدخل معرف التذكرة...",
    validateBtn: "تأكيد الدخول",
    campaignPushTitle: "حملة إعلانية موجهة (مرة واحدة شهرياً شاملة)",
    campaignPushAvailable: "متاحة",
    campaignPushLocked: "🔒 مقفلة - اختر باقة فئة 2",
    campaignPushText: "ضاعف رواج عملك التجاري! تتيح باقة فئة 2 جدولة إشعار موجه شهرياً يرسل مباشرة لهواتف المستخدمين النشطين في محيط 2 كلم.",
    campaignTitleInputLabel: "عنوان الإعلان الترويجي",
    campaignTargetInputLabel: "المنطقة المستهدفة",
    campaignStatusTarget: "محيط حي أنفا (نصف قطر 2 كلم)",
    dispatchCampaignBtn: "🚀 بث الإعلان الترويجي الحين",
    campaignDispatchedAlert: "🚀 تم وضع الإشعار في طابور خوادم APNS/FCM! مستهدف على النطاق الجغرافي المحدد.",
    publishAnnonceTitle: "نشر نشاط أو موقع على الخريطة التفاعلية",
    publishAnnonceDesc: "أنشئ إشارة جغرافية جديدة على الخريطة. أنت مسجل كتاجر شريك بريد إلكتروني:",
    eventTitleInputLabel: "اسم النشاط",
    eventTitlePlaceholder: "مثال: المؤتمر المغربي للبيانات والذكاء الاصطناعي",
    eventCategoryInputLabel: "مجموعة الفئة",
    eventDescInputLabel: "وصف النشاط وتفاصيل الولوج",
    eventDescPlaceholder: "اكتب العنوان، التوقيت، المتدخلين وإرشادات البوابة...",
    ticketPriceInputLabel: "سعر التذكرة الفردية (درهم)",
    pinScheduleLabel: "الجدولة الزمنية لإشارة الخريطة",
    pinTodayRadio: "نشط اليوم (اليوم المبرمج)",
    pinFutureRadio: "جدولته لتاريخ مستقبلي مبرمج",
    formCat1PinWarning: "⚠️ قيود باقة فئة 1: سيتم عرض هذه الإشارة على الخريطة التفاعلية الحية فقط إذا تمت جدولته كـ \"نشط اليوم (اليوم المبرمج)\". الأنشطة المبرمجة مستقبلاً تظهر كنص فقط في قائمة الأنشطة.",
    publishMarkerBtn: "💾 حفظ ونشر الإشارة التفاعلية على الخريطة",
    publishSuccessFeedback: "🎉 تم نشر إشارة النشاط كخريطة حية بنجاح! تظهر الآن لمحركات البحث بالدار البيضاء.",
    directMessagesTitle: "سجل المحادثات والرسائل المباشرة للزوار",
    messageGuestInitials: "ز",
    msgReplyPlaceholder: "اكتب إجابتك هنا...",
    replyBtn: "إرسال الجواب",
    cndpReceiptAlert: "تم إرسال إشعار استلام CNDP.",

    // Mairie Portal
    statsResolutionRate: "معدل الحل",
    statsOpenClaims: "البلاغات النشطة",
    statsResolutionBeds: "مؤشر رضا المواطنين",
    mairieTabClaims: "سجل البلاغات والشكاوى",
    mairieTabServices: "صيدليات الحراسة",
    mairieTabFlash: "الإعلانات والإنذارات الشاملة عاجلة",
    mairieTabAudit: "سجل مراجعة CNDP",
    claimsQueueTitle: "طابور فرز ومعالجة بلاغات الطوارئ",
    aiReportLoading: "جاري حساب الأبعاد بمساعدة Gemini...",
    aiReportGenerateBtn: "تقرير تلخيص الذكاء الاصطناعي Gemini AI",
    claimDetailsTitle: "بلاغ رقم:",
    claimHistoryExchange: "سجل التوجيه والمحادثات لفرق الصيانة الميدانية",
    claimHistoryEmpty: "لم يتم تسجيل أي تحديثات بعد. اكتب أدناه لتوجيه تعليمات إلى فريق العمل الميداني.",
    claimReplyLabel: "ملاحظة داخلية / جواب توجيهي من مصلحة البلدية",
    claimReplyPlaceholder: "اكتب تفاصيل إرسال الفريق التقني، المواد المطلوبة أو مذكرات العمل...",
    engageWorkBtn: "⚠️ توجيه فريق تقني ميداني لعين المكان (قيد المعالجة)",
    resolveIncidentBtn: "✅ إكمال ومعالجة البلاغ بالكامل",
    incidentResolvedCndpAlert: "تم حل المشكل والموافقة الكاملة من المجلس البلدي.",
    satisfactionScoreLabel: "درجة الرضا:",
    selectIncidentPlaceholder: "يرجى تحديد بلاغ مواطن نشط من القائمة لمعالجته.",
    aiReportCloseBtn: "إغلاق التقرير",
    aiReportCriticalZones: "القطاعات الجغرافية الأكثر تسجيلاً للبلاغات",
    aiReportActions: "التدابير الموصى بها في إطار حماية المواطنين والمرافق",
    pharmacyTitle: "صيدليات الحراسة بالدار البيضاء اليوم",
    hospitalOccupancyTitle: "نسبة الملء المباشرة لأسرة الإنعاش المستعجل CHU",
    hospitalAvailableBeds: "أسرة فارغة متوفرة",
    hospitalAlertPeak: "تحذير من ضغط شديد بقسم المستعجلات",
    flashChannelTitle: "بث عام للسلامة من الطوارئ (رسالة فلاش عمومية)",
    flashChannelDesc: "بث إشعارات سلامة فورية وعاجلة على ساعات وهواتف جميع مواطني الدار البيضاء.",
    flashTargetLabel: "نطاق الاستهداف الجغرافي",
    flashTargetAll: "📢 ولاية الدار البيضاء الكبرى (جميع المستخدمين)",
    flashTargetDistrict: "📍 المنطقة المحلية الجغرافية",
    flashTextInputLabel: "نص بلاغ السلامة العاجل (مختصر)",
    flashTextPlaceholder: "مثال: انتباه: قطع مبرمج للمياه الصالحة للشرب بحي أنفا...",
    flashSendBtn: "📡 بث إشعار السلامة العاجل الحين",
    flashSuccessAlert: "📡 تم بث بلاغ السلامة بنجاح إلى شبكات البلوتوث Mesh المغلقة والاتصالات لجميع الفروع بالدار البيضاء!",
    auditRegistryTitle: "سجل المراقبة الأمنية وخصوصية CNDP بالبلدية",
    auditRegistryDesc: "دفتر حسابات غير قابل للتعديل يضمن التتبع الكامل لبيانات المواطنين طبقاً للقانون 09-08.",
    auditRegistryIntro: "يسجل السجل الأمني عمليات تصفح الصفحات، طلبات المفاتيح، تفعيلات الخصوصية وبلاغات شبكات Bluetooth القريبة.",

    // AI Assistant Companion / Chat
    aiChatModelText: "مرحباً بكم! أنا **المساعد الذكي لبلديتي**، مرشدكم البلدي الذكي. كيف يمكنني مساعدتكم اليوم؟ يمكنني البحث في الأنشطة الثقافية، مساعدتكم في تسجيل شكوى أو خدمة، أو إيضاح حقوقكم بموجب قانون CNDP 09-08 المغربي لحماية المعطيات الشخصية.",
    aiChatWelcome: "المساعد الذكي لمدينة الدار البيضاء",
    aiChatServiceError: "الخدمة غير متوفرة مؤقتاً بالبرنامج",
    aiChatQuickEventCuration: "📍 البحث عن أنشطة قريبة",
    aiChatQuickPrivacyCndp: "🔒 دليل حماية البيانات القانون 09-08",
    aiChatQuickReportIncident: "💡 كيف أقدم شكراً لحفرة طريق ؟",
    aiChatTitle: "المستشار الذكي لبلديتي",
    aiChatSubTitle: "مدعوم من Gemini 2.5 Pro",
    aiChatActiveProfile: "الصفة المهنية النشطة:",
    aiChatThinking: "جاري البحث في مراكز البيانات الحضرية...",
    aiChatInputPlaceholder: "اطرح سؤالاً بخصوص الدار البيضاء الحية...",

    // BLE Mesh Simulator
    meshPowerBtnOn: "شبكة الـ Mesh نشطة",
    meshPowerBtnOff: "شبكة الـ Mesh معطلة",
    meshEmergencyTitle: "لوحة تحكم مرونة شبكة البلوتوث Mesh الخارجية",
    meshEmitterLabel: "العقدة المصدر للإرسال",
    meshRecipientLabel: "المرشد التوجيهي أو بوابة البلدية المستهدفة",
    meshPlaceholderText: "مثال: بلاغ عاجل: تسرب مياه كبير يعوق حركة السير بشارع الزرقطوني",
    meshMessagePrompt: "حمولة رسالة الطوارئ غير المتصلة بالإنترنت (مؤمنة HMAC)",
    meshPropagateBtn: "بث حزمة الموجة BLE Mesh للإنقاذ",
    meshPropagatingText: "جاري نشر موجة الإنقاذ...",
    meshVisualTitle: "مخطط البث المباشر للشبكة",
    meshVisualEmitter: "العقدة المصدر",
    meshVisualRelay: "محطة relay",
    meshVisualGateway: "عقدة البوابة",
    meshVisualHop: "قفزة",
    meshLedgerTitle: "سجل التخزين المؤقت لملف SQLite المحلي",
    meshLedgerEmpty: "الطابور فارغ. مستعد لقبول المعاملات وحزم BLE.",
    meshLogStatusTitle: "سجلات العقد النشطة BLE:",
    meshPowerToggledOnLog: "تم التفعيل الكامل لشبكات BLE P2P الطارئة V2.",
    meshPowerToggledOffLog: "تم تعطيل مديول البلوتوث والاتصال المنخفض الطاقة.",
    meshClearQueueBtn: "مسح قاعدة البيانات"
  }
};
