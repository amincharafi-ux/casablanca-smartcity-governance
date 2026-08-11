export type UserRole = 'PUBLIC' | 'PARTENAIRES' | 'MAIRIE' | 'DATA_TEAM' | 'CITOYEN' | 'COMMERCE' | 'RESIDENCE' | 'SYNDIC' | 'MUNICIPALITE' | 'SUPER_ADMIN';

export interface CitizenConsent {
  location: boolean;
  analytics: boolean;
  ble: boolean;
  ai_profiling: boolean;
}

export interface Review {
  id: string;
  userName: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
}

export interface CityEvent {
  id: string;
  title: string;
  description: string;
  category: 'CULTURE' | 'ECONOMIC' | 'ECO_CSR' | 'SERVICES' | 'SPORT' | 'EMERGENCY';
  date: string;
  isToday: boolean;
  partnerId: string;
  partnerName: string;
  isPremiumPartner: boolean;
  lat: number;
  lng: number;
  views: number;
  bookingsCount: number;
  revenue: number; // in MAD
  ticketPrice: number; // in MAD
  reviews: Review[];
  featuredImage?: string;
  tenantId?: string; // Multi-tenant SaaS isolation ID
}

export interface CitizenClaim {
  id: string;
  citizenName: string;
  category: 'CHAUSEE' | 'ECLAIRAGE' | 'DECHETS' | 'EAU_ASSAINISSEMENT' | 'AUTRE';
  title: string;
  description: string;
  status: 'OUVERT' | 'EN_COURS' | 'RESOLU';
  createdAt: string;
  location: string;
  satisfactionScore?: number; // 1 to 5 if resolved
  replies: {
    sender: 'MAIRIE' | 'CITIZEN';
    message: string;
    timestamp: string;
  }[];
  tenantId?: string; // Multi-tenant SaaS isolation ID
}

export interface BLEMessage {
  id: string;
  senderNode: string;
  recipientNode: string;
  payload: string;
  timestamp: string;
  hmacSignature: string;
}

export interface BLEStatus {
  isConnected: boolean;
  discoveredNodes: string[];
  sentCount: number;
  receivedCount: number;
  syncInProgress: boolean;
  logs: string[];
}

export interface CNDPPrivacyLog {
  timestamp: string;
  action: string;
  affectedRole: string;
  details: string;
}

export interface PharmacyDeGarde {
  id: string;
  name: string;
  address: string;
  phone: string;
  dutyType: 'JOUR' | 'NUIT' | 'PERMANENT';
  isOpenToday: boolean;
}

export interface HospitalStatus {
  id: string;
  name: string;
  occupancyRate: number; // 0 to 100%
  availableBeds: number;
  contact: string;
}

// ============================================================================
// PHASE 1: PRODUCTION READY FOUNDATION (RBAC, ABAC, MFA, VAULT, AUDIT TRAIL)
// ============================================================================

export type EnterpriseRole = 'CITOYEN' | 'COMMERCE' | 'RESIDENCE' | 'SYNDIC' | 'MUNICIPALITE' | 'SUPER_ADMIN';

export interface RBACPermission {
  action: 'READ' | 'WRITE' | 'DELETE' | 'ADMIN' | 'EXPORT' | 'DISPATCH' | 'SIMULATE';
  resource: 'CITIZEN_REPORTS' | 'COMMERCE_REVENUE' | 'SYNDIC_FINANCES' | 'MUNICIPAL_DISPATCH' | 'KNOWLEDGE_GRAPH' | 'DIGITAL_TWIN' | 'VAULT_SECRETS' | 'GEOINT_LAYERS' | 'SYSTEM_CONFIG';
}

export interface ABACContext {
  userId: string;
  role: EnterpriseRole;
  district?: string;
  residenceId?: string;
  commerceId?: string;
  tenantId: string;
  ipAddress?: string;
  mfaVerified: boolean;
}

export interface MFASession {
  userId: string;
  email: string;
  enabled: boolean;
  qrCodeUri?: string;
  secretPrefix: string;
  verifiedAt?: string;
  backupCodesCount: number;
}

export interface VaultSecretEntry {
  key: string;
  version: number;
  lastRotated: string;
  rotationPolicyDays: number;
  algorithm: 'AES-256-GCM' | 'RSA-4096' | 'KYBER-1024-PQ';
  status: 'ACTIVE' | 'ROTATING' | 'REVOKED';
}

export interface ChainedAuditTrailLog {
  id: string;
  index: number;
  timestamp: string;
  actorId: string;
  actorRole: EnterpriseRole;
  action: string;
  resource: string;
  tenantId: string;
  previousHash: string;
  hash: string;
  signature: string;
}

// ============================================================================
// PHASE 2: URBAN DATA FABRIC & EVENT-DRIVEN STREAMING (NATS JETSTREAM & CDC)
// ============================================================================

export type UrbanEventSubject = 
  | 'urban.citizen.report'
  | 'urban.citizen.engagement'
  | 'urban.commerce.transaction'
  | 'urban.commerce.promo'
  | 'urban.residence.alert'
  | 'urban.residence.payment'
  | 'urban.municipal.dispatch'
  | 'urban.municipal.ordinance'
  | 'urban.mobility.telemetry'
  | 'urban.iot.sensor_read'
  | 'urban.geoint.anomaly';

export interface UrbanEvent<T = any> {
  eventId: string;
  eventType: UrbanEventSubject;
  tenantId: string;
  district: string;
  category: string;
  timestamp: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
    neighborhood?: string;
  };
  payload: T;
  tracingContext: {
    traceId: string;
    spanId: string;
    emitter: string;
  };
}

export interface NatsStreamMetrics {
  streamName: string;
  subjectFilter: string;
  messagesCount: number;
  bytesCount: number;
  firstSeq: number;
  lastSeq: number;
  consumerCount: number;
  status: 'ONLINE' | 'DEGRADED' | 'REPLAYING';
}

export interface DebeziumCDCEvent {
  schema: string;
  table: string;
  operation: 'CREATE' | 'UPDATE' | 'DELETE' | 'READ';
  timestamp: string;
  lsn: string; // Log Sequence Number
  before: Record<string, any> | null;
  after: Record<string, any> | null;
  transactionId: string;
}

// ============================================================================
// PHASE 3: GEOINT LAYER & POSTGIS URBAN SPATIAL ENGINE
// ============================================================================

export type UrbanLayerType = 'DISTRICTS' | 'ROADS' | 'SCHOOLS' | 'HOSPITALS' | 'COMMERCE' | 'RESIDENCES' | 'PUBLIC_SERVICES';

export interface GeoIntFeature {
  id: string;
  layer: UrbanLayerType;
  name: string;
  geometryType: 'POINT' | 'POLYGON' | 'LINESTRING';
  coordinates: any; // GeoJSON geometry coordinates
  district: string;
  properties: {
    densityScore?: number;
    capacity?: number;
    criticality?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    trafficFlowPerHour?: number;
    connectedIoTCount?: number;
    status?: string;
    address?: string;
  };
}

export interface HeatmapDensityCell {
  id: string;
  lat: number;
  lng: number;
  district: string;
  weight: number; // 0.0 to 1.0
  metric: 'INCIDENTS' | 'SECURITY' | 'TRAFFIC' | 'COMMERCE_FOOTFALL' | 'CRITICALITY_INDEX';
  timestamp: string;
}

// ============================================================================
// PHASE 4: URBAN KNOWLEDGE GRAPH (TOPOLOGICAL & SEMANTIC ENGINE)
// ============================================================================

export type GraphNodeType = 'Citizen' | 'Residence' | 'Commerce' | 'Incident' | 'Event' | 'District' | 'Sensor' | 'Contractor' | 'MunicipalService';
export type GraphEdgeType = 'VISITS' | 'REPORTS' | 'OWNS' | 'ATTENDS' | 'LOCATED_IN' | 'CONNECTED_TO' | 'MAINTAINS' | 'AFFECTS' | 'SUPPLIES';

export interface KnowledgeGraphNode {
  id: string;
  label: string;
  type: GraphNodeType;
  district: string;
  properties: Record<string, any>;
  degree: number;
  pagerankScore: number;
  x?: number;
  y?: number;
  z?: number;
}

export interface KnowledgeGraphEdge {
  id: string;
  source: string;
  target: string;
  type: GraphEdgeType;
  weight: number;
  timestamp: string;
  properties?: Record<string, any>;
}

export interface KnowledgeGraphStats {
  totalNodes: number;
  totalEdges: number;
  density: number;
  diameter: number;
  connectedComponents: number;
  merkleRootHash: string;
  lastSyncTimestamp: string;
}

export interface GraphCascadeImpactResult {
  rootIncidentId: string;
  rootIncidentType: string;
  affectedDistricts: string[];
  totalDirectNodes: number;
  totalCascadedNodes: number;
  impactPath: {
    step: number;
    fromNode: string;
    toNode: string;
    relation: GraphEdgeType;
    delayMinutes: number;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  }[];
  criticalAssetsAtRisk: string[];
  recommendedMitigations: string[];
}

// ============================================================================
// PHASE 5: DIGITAL TWIN CITY (WHAT-IF SIMULATION & TELEMETRY CONVERGENCE)
// ============================================================================

export interface DigitalTwinCityState {
  city: string;
  timestamp: string;
  activeCitizens: number;
  gridLoadKw: number;
  waterPressureBar: number;
  trafficCongestionIndex: number; // 0 to 100%
  airQualityIndexAqi: number;
  activeIncidentsCount: number;
  wastePickupCompletionPct: number;
  publicTransitOnTimePct: number;
  telemetryIngestionRatePerSec: number;
}

export interface WhatIfScenarioRequest {
  id: string;
  name: string;
  description: string;
  category: 'CROWD_SURGE' | 'INFRASTRUCTURE_FAILURE' | 'EXTREME_WEATHER' | 'TRAFFIC_REROUTING';
  parameters: {
    targetDistrict: string;
    crowdVolumeDelta?: number; // e.g. +20000
    gridFailureDurationHours?: number; // e.g. 4
    rainfallMmPerHour?: number; // e.g. 60
    closedBoulevards?: string[];
  };
}

export interface WhatIfSimulationResult {
  scenarioId: string;
  computedAt: string;
  baselineState: DigitalTwinCityState;
  projectedState: DigitalTwinCityState;
  deltaImpact: {
    trafficCongestionDeltaPct: number;
    commercialRevenueImpactMad: number;
    emergencyResponseDelaySec: number;
    gridStabilityScore: number;
    publicSatisfactionDelta: number;
  };
  districtImpacts: {
    district: string;
    impactLevel: 'NORMAL' | 'ELEVATED' | 'SEVERE' | 'CRITICAL';
    keyBottleneck: string;
  }[];
  strategicDirectives: string[];
}

// ============================================================================
// PHASE 6: URBAN AI COPILOT & DECISION INTELLIGENCE
// ============================================================================

export interface UrbanAICopilotResponse {
  query: string;
  executiveSummary: string;
  confidenceScore: number;
  dataSourcesQueried: string[];
  graphRelationshipsAnalyzed: number;
  keyInsights: {
    category: string;
    finding: string;
    urgency: 'INFO' | 'ACTIONABLE' | 'CRITICAL';
  }[];
  recommendedInterventions: {
    actionTitle: string;
    assignedEntity: string;
    estimatedRoiMad: number;
    timeframe: string;
  }[];
  spatialHotspots: {
    district: string;
    lat: number;
    lng: number;
    reason: string;
  }[];
}

// ============================================================================
// PHASE 7: NATIONAL SCALE & MULTI-TENANCY
// ============================================================================

export interface MoroccanCityTenant {
  id: string;
  name: string;
  region: string;
  population: number;
  status: 'ACTIVE_PRODUCTION' | 'ONBOARDING' | 'STAGING';
  connectedDistrictsCount: number;
  activeUsers: number;
  dataSovereigntyEnclaveId: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface NationalTerritorialBenchmark {
  timestamp: string;
  tenants: {
    tenantId: string;
    cityName: string;
    incidentResolutionRatePct: number;
    commercialActivityIndex: number;
    residentEngagementScore: number;
    digitalTwinAccuracyPct: number;
  }[];
  nationalTrends: string[];
}

// ============================================================================
// PHASE 8: ECOSYSTEM PLATFORM & DEVELOPER SDK
// ============================================================================

export interface EcosystemApiKey {
  id: string;
  developerName: string;
  appName: string;
  organizationType: 'STARTUP' | 'MUNICIPAL_ERP' | 'COMMERCIAL_CHAIN' | 'RESEARCH_LAB';
  keyPrefix: string;
  rateLimitPerMinute: number;
  scopes: string[];
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
  totalCalls: number;
}

export interface UrbanMarketplaceService {
  id: string;
  title: string;
  category: 'TRANSPORT' | 'SANTE' | 'PARKING' | 'TOURISME' | 'EDUCATION' | 'IOT_CLEANTECH';
  providerName: string;
  verifiedSovereign: boolean;
  activeSubscribers: number;
  apiEndpointsCount: number;
  rating: number;
  description: string;
  iconName: string;
  pricingModel: 'FREE_OPEN_DATA' | 'FREEMIUM' | 'ENTERPRISE_API';
}

// ============================================================================
// SINAPS ENCLAVE & TERRITORIAL GRAPH LINK INTERFACES
// ============================================================================

export type SinapsEnclaveState = 'DISCONNECTED' | 'ATTESTING' | 'SECURED_ENCLAVE' | 'STREAMING' | 'REKEYING';

export interface SinapsEnclaveAttestation {
  enclaveId: string;
  hardwareTEE: 'INTEL_SGX_V2' | 'AWS_NITRO_ENCLAVE' | 'SOVEREIGN_TPM_HSM';
  pcr0: string; // Enclave measurement hash
  pcr1: string;
  pcr2: string;
  certificateFingerprint: string;
  handshakeTimestamp: string;
  encryptionCipher: 'AES-256-GCM-HKDF' | 'CHACHA20-POLY1305' | 'KYBER-1024-PQ';
  status: 'VERIFIED' | 'REVOKED' | 'EXPIRED';
  latencyMs: number;
  lastHeartbeat: string;
}

export interface SinapsDataStreamEvent {
  id: string;
  timestamp: string;
  topic: 'URBAN_TELEMETRY' | 'TERRITORIAL_GRAPH' | 'IOT_MESH_CDC' | 'MUNICIPAL_DISPATCH' | 'SYNDIC_WORKFLOW';
  originModule: 'MYCITY_CORE' | 'MYHOME_SYNDIC' | 'MYLIFE_MARKET' | 'MAIRIE_DISPATCH';
  encryptedPayloadHash: string;
  recordCount: number;
  anonymizationLevel: 'CNDP_L09_08_STRICT' | 'TOKENIZED_K_ANONYMITY' | 'AGGREGATED_HEATMAP';
  throughputKbps: number;
  status: 'DELIVERED' | 'IN_TRANSIT' | 'QUEUED';
}

export interface SinapsGraphSyncPayload {
  syncId: string;
  timestamp: string;
  nodesCount: number;
  edgesCount: number;
  embeddingDimensions: number;
  territorialClusters: string[];
  merkleRootHash: string;
  syncMode: 'DELTA_STREAM' | 'FULL_TOPOLOGICAL_SNAPSHOT';
  status: 'SYNCHRONIZED' | 'SYNCING' | 'ERROR';
}

export interface SinapsEnclaveQuery {
  id: string;
  queryType: 'TERRITORIAL_INFERENCE' | 'CROSS_DISTRICT_ANOMALY' | 'PREDICTIVE_RESOURCE_ROUTING' | 'SIMULATION_CASCADE';
  prompt: string;
  confidenceScore: number;
  insights: string[];
  impactedNodes: string[];
  latencyMs: number;
  timestamp: string;
}
