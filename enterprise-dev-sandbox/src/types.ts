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
// ============================================================================
// PROGRAMME 1 & 5: URBAN DATA FABRIC, EVENT MESH (NATS JETSTREAM & CDC) & CANONICAL SINAPS CONTRACT
// ============================================================================

export type UrbanEventSubject = 
  | 'urban.report.created'
  | 'urban.report.updated'
  | 'urban.report.resolved'
  | 'urban.event.published'
  | 'urban.event.booked'
  | 'urban.business.registered'
  | 'urban.business.verified'
  | 'urban.vote.cast'
  | 'urban.ag.session_opened'
  | 'urban.residence.updated'
  | 'urban.residence.alert'
  | 'urban.residence.payment'
  | 'urban.municipal.dispatch'
  | 'urban.municipal.ordinance'
  | 'urban.mobility.telemetry'
  | 'urban.iot.telemetry'
  | 'urban.iot.sensor_read'
  | 'urban.geoint.anomaly'
  | 'urban.citizen.report'
  | 'urban.citizen.engagement'
  | 'urban.commerce.transaction'
  | 'urban.commerce.promo';

export interface UrbanEvent<T = any> {
  eventId: string;
  eventType: UrbanEventSubject | string;
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
    parentSpanId?: string;
    emitter: string;
    sampled?: boolean;
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

// CANONICAL SINAPS INTEGRATION CONTRACT (SINGLE UNIQUE DATA CONTRACT)
export interface SinapsCanonicalPayload<T = any> {
  eventId: string;
  eventType: UrbanEventSubject | string;
  timestamp: string;
  tenantId: string;
  geo: {
    lat: number;
    lng: number;
    district: string;
    srid: number;
    isochroneZone?: 'ZONE_5MIN' | 'ZONE_10MIN' | 'ZONE_15MIN' | 'OUTSIDE_15MIN';
    neighborhood?: string;
    address?: string;
  };
  entities: {
    id: string;
    type: GraphNodeType | string;
    label: string;
    properties: Record<string, any>;
  }[];
  relationships: {
    source: string;
    target: string;
    type: GraphEdgeType | string;
    weight: number;
    properties?: Record<string, any>;
  }[];
  confidence: number;
  cndpCompliance: {
    anonymized: boolean;
    kAnonymityScore?: number;
    legalBasis: string;
    pcr0AttestationHash: string;
    cryptoShreddingKeyId?: string;
  };
  lakehousePartition?: string;
  payload?: T;
}

// ============================================================================
// PROGRAMME 2: URBAN LAKEHOUSE & ANALYTICAL OLAP ENGINE (ICEBERG / DUCKDB)
// ============================================================================

export interface IcebergTableManifest {
  tableName: string;
  schemaVersion: number;
  currentSnapshotId: string;
  formatVersion: 2;
  partitionSpec: string[];
  totalRecords: number;
  totalDataSizeBytes: number;
  parquetFilesCount: number;
  lastUpdatedTimestamp: string;
  partitions: IcebergPartition[];
}

export interface IcebergPartition {
  partitionPath: string; // e.g. year=2026/month=08/district=maarif
  recordsCount: number;
  fileSizeBytes: number;
  minTimestamp: string;
  maxTimestamp: string;
  compression: 'SNAPPY_PARQUET' | 'ZSTD';
}

export interface LakehouseQueryResult {
  query: string;
  executionEngine: 'DUCKDB_OLAP' | 'CLICKHOUSE_VECTOR' | 'ICEBERG_SCAN';
  executionTimeMs: number;
  scannedBytes: number;
  scannedRows: number;
  columns: string[];
  rows: Record<string, any>[];
  cndpSanitized: boolean;
}

export interface LakehouseTimeTravelSnapshot {
  snapshotId: string;
  timestamp: string;
  operation: 'APPEND' | 'OVERWRITE' | 'DELETE';
  summary: string;
  addedRecords: number;
  totalRecords: number;
  merkleRootHash: string;
}

// ============================================================================
// PROGRAMME 3: URBAN KNOWLEDGE GRAPH & NEBULAGRAPH (nGQL) INTEGRATION
// ============================================================================

export interface NebulaGraphSpace {
  spaceName: string;
  partitionNum: number;
  replicaFactor: number;
  vidType: 'FIXED_STRING(64)' | 'INT64';
  tags: NebulaTagSchema[];
  edges: NebulaEdgeSchema[];
}

export interface NebulaTagSchema {
  tagName: string;
  properties: { name: string; type: string; nullable?: boolean; default?: any }[];
  indexes: string[];
}

export interface NebulaEdgeSchema {
  edgeName: string;
  properties: { name: string; type: string; nullable?: boolean; default?: any }[];
  indexes: string[];
}

export interface NGqlQueryResult {
  nGqlStatement: string;
  space: string;
  latencyUs: number;
  headers: string[];
  rows: any[][];
  errorMsg?: string;
}

// ============================================================================
// PROGRAMME 4: GEOSPATIAL INTELLIGENCE & URBAN ANALYTICS LAYER
// ============================================================================

export interface DistrictAttractivenessScore {
  district: string;
  overallScore: number; // 0 to 100
  commercialVibrancy: number; // 0 to 100
  pedestrianFootfallIndex: number;
  activeBusinessCount: number;
  amenityDiversityScore: number;
  safetyPerceptionScore: number;
  trendPercentage: number;
}

export interface MobilityAccessibilityScore {
  district: string;
  overallMobilityScore: number; // 0 to 100
  transitStopsWithin500m: number;
  tramwayConnectivityRating: number;
  avgBuswayWaitMinutes: number;
  parkingOccupancyPct: number;
  activeCongestionPoints: number;
  walkabilityIndex: number;
}

export interface IsochroneAccessZone {
  id: string;
  facilityName: string;
  facilityType: 'HOSPITAL' | 'SCHOOL' | 'MUNICIPALITY' | 'EMERGENCY' | 'TRANSIT_HUB';
  centerCoords: [number, number]; // [lng, lat]
  fiveMinPolygon: [number, number][];
  tenMinPolygon: [number, number][];
  fifteenMinPolygon: [number, number][];
  coveredPopulation15Min: number;
  coverageRatioPct: number;
}

export interface UnderservedUrbanZone {
  id: string;
  district: string;
  neighborhood: string;
  deficitType: 'GREEN_SPACE_VOID' | 'LIGHTING_DEFICIT' | 'WASTE_BIN_DEFICIT' | 'TRANSIT_DESERT' | 'HEALTHCARE_GAP';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  estimatedAffectedResidents: number;
  centroidCoords: [number, number];
  recommendedIntervention: string;
  estimatedBudgetMad: number;
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
  topic: 'URBAN_TELEMETRY' | 'TERRITORIAL_GRAPH' | 'IOT_MESH_CDC' | 'MUNICIPAL_DISPATCH' | 'SYNDIC_WORKFLOW' | 'CANONICAL_SINAPS_CONTRACT';
  originModule: 'MYCITY_CORE' | 'MYHOME_SYNDIC' | 'MYLIFE_MARKET' | 'MAIRIE_DISPATCH' | 'MYCITY_EVENT_MESH';
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

// ============================================================================
// STRATEGIC PROGRAMMES ALIASES & EXPORTS (CTO MASTERPLAN ROADMAP)
// ============================================================================

export type IcebergTableMetadata = IcebergTableManifest;
export type IcebergSnapshot = LakehouseTimeTravelSnapshot;
export type DuckDbQueryResult = LakehouseQueryResult;
export type UnderservedZone = UnderservedUrbanZone;
export type NebulaGraphResult = NGqlQueryResult;

// ============================================================================
// PROGRAMME P0: 100% DOMAIN EVENT MESH & REAL-TIME CDC CASCADE
// ============================================================================

export type UrbanDomain = 
  | 'CITIZEN_PUBLIC_SPACE'       // 1. Signalements, voirie, requêtes citoyennes
  | 'HOUSING_SYNDIC_VERTICAL'    // 2. Assemblées générales, votes, pannes parties communes
  | 'LOCAL_COMMERCE_ECONOMY'     // 3. Patentes, transactions de quartier, invendus
  | 'FIELD_CONTRACTOR_DISPATCH'  // 4. Ordres de mission, dispatching, clôtures avec photos CNDP
  | 'MOBILITY_TRANSIT_FLOWS'     // 5. Tramway, busway, capteurs de circulation, parkings
  | 'INFRASTRUCTURE_FLUIDS'      // 6. Télémétrie eau Lydec, électricité, qualité air, IoT
  | 'CRISIS_RISKS_RESILIENCE';   // 7. Crues des oueds, alertes météo, périmètres sécurité pompiers

export interface EventMeshPipelineStep {
  stage: 'POSTGRESQL_OLTP' | 'DEBEZIUM_CDC' | 'NATS_JETSTREAM' | 'LAKEHOUSE_ICEBERG' | 'KNOWLEDGE_GRAPH' | 'SINAPS_ENCLAVE';
  timestamp: string;
  latencyMs: number;
  status: 'SUCCESS' | 'PROCESSING' | 'SKIPPED' | 'ERROR';
  details: string;
  metadataHash?: string;
  lsnOrOffset?: string;
}

export interface EventMeshCascadeTrace {
  traceId: string;
  domain: UrbanDomain;
  eventName: string;
  entityId: string;
  district: string;
  timestamp: string;
  totalDurationMs: number;
  is100PercentCovered: boolean;
  steps: EventMeshPipelineStep[];
  cndpCompliant: boolean;
  canonicalPayloadId: string;
}

// ============================================================================
// PROGRAMME P1: COMPLETE INDUSTRIAL URBAN LAKEHOUSE STACK
// ============================================================================

export interface LakehouseObjectStorageBucket {
  bucketName: string;
  provider: 'SOVEREIGN_MINIO' | 'AWS_S3_COMPLIANT' | 'GCS_COMPLIANT';
  region: 'casablanca-dc1' | 'bouskoura-dc2';
  totalObjectsCount: number;
  totalSizeBytes: number;
  storageClass: 'HOT_PARQUET_ZSTD' | 'WARM_ICEBERG_DATA' | 'COLD_ARCHIVE_GLACIER';
  lastCompactionTimestamp: string;
  compressionRatio: number; // e.g. 4.8x
}

export interface ClickHouseTableSpec {
  database: string;
  tableName: string;
  engine: 'MergeTree' | 'ReplacingMergeTree' | 'SummingMergeTree' | 'MaterializedView';
  partitionBy: string;
  orderBy: string;
  primaryKey: string;
  rowCount: number;
  compressedBytes: number;
  uncompressedBytes: number;
  queryLatencyP99Ms: number;
}

export interface LakehouseComprehensiveStackStatus {
  sourcePostgresConnected: boolean;
  debeziumConnectorStatus: 'RUNNING' | 'PAUSED' | 'FAILED';
  objectStorage: LakehouseObjectStorageBucket[];
  icebergCatalogType: 'REST_CATALOG' | 'NESSIE' | 'HIVE_METASTORE';
  icebergTablesCount: number;
  clickhouseNodeStatus: 'CLUSTER_HEALTHY' | 'DEGRADED';
  clickhouseTables: ClickHouseTableSpec[];
  duckDbInProcessMemoryMb: number;
  totalProcessedEvents24h: number;
  totalStorageSavingsPct: number;
}

// ============================================================================
// PROGRAMME P2: 3-TIER FEDERATED URBAN GRAPH
// ============================================================================

export type FederatedGraphTier = 
  | 'LEVEL_1_MYCITY_LOCAL'     // Arrondissement & Ville (Entités physiques, commerces, capteurs locaux)
  | 'LEVEL_2_SINAPS_REGIONAL'  // Région Casablanca-Settat / Inter-villes (Corridors fret, résilience, transit régional)
  | 'LEVEL_3_NATIONAL_GRAPH';  // National Souverain (DGCL, Intérieur, HCP, Ministères, Vision Macro)

export interface FederatedGraphNode {
  federatedId: string; // e.g. "ma.nat.casablanca.maarif.residence_palmier"
  tier: FederatedGraphTier;
  label: string;
  type: string;
  jurisdiction: string; // e.g. "Arrondissement Maârif", "Région Casablanca-Settat", "Royaume du Maroc"
  localProperties: Record<string, any>;
  federationPolicy: 'STRICT_LOCAL' | 'ANONYMIZED_REGIONAL' | 'K_ANONYMOUS_NATIONAL';
  crossTierLinksCount: number;
  differentialPrivacyEpsilon?: number;
}

export interface FederatedGraphEdge {
  id: string;
  sourceFederatedId: string;
  targetFederatedId: string;
  relation: string;
  crossTier: boolean;
  weight: number;
  syncedToEnclave: boolean;
}

export interface CrossGraphFederatedQuery {
  queryId: string;
  originTier: FederatedGraphTier;
  targetTiers: FederatedGraphTier[];
  nGqlFederatedStatement: string;
  executionTimeMs: number;
  scannedGraphNodes: number;
  crossTierResolutionsCount: number;
  privacyProofHash: string;
  summary: string;
  results: Record<string, any>[];
}

// ============================================================================
// PROGRAMME P3: URBAN MEMORY FABRIC (COGNITIVE MEMORY SYSTEM)
// ============================================================================

export type UrbanMemoryType = 
  | 'EPISODIC'    // Souvenirs d'incidents passés, déroulé chronologique, résolutions réelles
  | 'SEMANTIC'    // Profils de quartiers, règles d'urbanisme, rythmes de vie, densité
  | 'PROCEDURAL'  // Protocoles d'intervention, SOPs communales, plans d'urgence
  | 'PROSPECTIVE';// Prédictions analogiques, anticipations d'impacts, simulations

export interface UrbanMemoryRecord {
  id: string;
  memoryType: UrbanMemoryType;
  title: string;
  description: string;
  district: string;
  coordinates?: { lat: number; lng: number };
  h3Index: string; // H3 Hexagonal spatial index (Resolution 8/9)
  temporalPattern: {
    seasonality?: 'WINTER_RAIN' | 'SUMMER_TOURISM' | 'RAMADAN_EVENING' | 'ALL_YEAR';
    timeOfDay?: 'PEAK_MORNING' | 'PEAK_EVENING' | 'NIGHT' | 'CONTINUOUS';
    recurringFrequencyDays?: number;
  };
  graphContext: {
    relatedEntityIds: string[];
    topologyCluster: string;
    impactRadiusMeters: number;
  };
  embeddingVector: number[]; // 1536-dim or 768-dim normalized embedding representation
  confidenceScore: number;
  associatedPlaybook?: string;
  lastRetrievedTimestamp?: string;
  reinforcementCount: number;
}

export interface UrbanMemorySynthesisPipeline {
  observationId: string;
  rawFact: string;
  timestamp: string;
  extractedEntities: string[];
  generatedEmbeddingHash: string;
  graphContextEnriched: {
    neighborhoodNodes: string[];
    cascadeRiskScore: number;
  };
  geoContextEnriched: {
    h3Cell: string;
    isochroneCoveragePct: number;
    nearbyCriticalFacilities: string[];
  };
  temporalContextEnriched: {
    isPeakHour: boolean;
    weatherCondition: string;
    historicalAnalogMatchesCount: number;
  };
  synthesizedMemory: UrbanMemoryRecord;
  proactiveRecommendation: string;
}

// ============================================================================
// PROGRAMME P4: DIGITAL TWIN CASABLANCA & STRICT OPERATIONAL ISOLATION LAYER
// ============================================================================

export type CityOperatingMode = 'OPERATIONAL_FABRIC' | 'DIGITAL_TWIN_SANDBOX';

export interface OperationalTelemetryMetrics {
  timestamp: string;
  source: 'REALTIME_PRODUCTION_POSTGRES' | 'IOT_HARDWARE_GATEWAYS' | 'DISPATCHED_CREWS_GPS';
  verifiedCitizensOnline: number;
  realWorldGridLoadKw: number;
  actualWaterPressureBar: number;
  realCongestionIndex: number;
  liveCriticalIncidentsCount: number;
  activeMunicipalVehicles: number;
  immutableAuditBlockHeight: number;
  productionDbLatencyMs: number;
}

export interface SimulationSandboxBranch {
  branchId: string;
  name: string;
  description: string;
  category: 'EXTREME_WEATHER_FLOOD' | 'TRAMWAY_GRID_OUTAGE' | 'MASS_GATHERING_CASABLANCA' | 'URBAN_EARTHQUAKE_STRESS';
  status: 'ACTIVE_SIMULATION' | 'PAUSED' | 'CONVERGED' | 'ARCHIVED';
  createdAt: string;
  forkedFromSnapshotLsn: string;
  simulatedSecondsAhead: number;
  syntheticEventsGenerated: number;
  zeroPollutionFirewallViolations: number; // Must be strictly 0
  projectedMetrics: {
    projectedCongestionIndex: number;
    projectedGridLoadKw: number;
    projectedEconomicImpactMad: number;
    projectedEvacuationTimeMinutes: number;
    criticalInterventionUnitsNeeded: number;
  };
  keyBottlenecks: {
    district: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    failureDescription: string;
  }[];
  mitigationActions: string[];
}

export interface IcebergDataFileMetadata {
  filePath: string;
  partitionValues: Record<string, any>;
  recordCount: number;
  fileSizeBytes: number;
  columnStats: {
    columnName: string;
    nullCount: number;
    minValue: string | number;
    maxValue: string | number;
  }[];
  compressionCodec: 'ZSTD' | 'SNAPPY' | 'GZIP';
  splitOffsets: number[];
}

export interface LakehouseQueryExplain {
  planNodes: {
    stage: string;
    description: string;
    rowsIn: number;
    rowsOut: number;
    simdVectorWidth?: number;
    partitionsPruned?: number;
    partitionsTotal?: number;
    timeMs: number;
  }[];
  vectorSimdEnabled: boolean;
  columnarMemoryAllocatedKb: number;
  scanThroughputMbPerSec: number;
  rowThroughputRowsPerSec: number;
  ioSavingsPercentage: number;
}

export interface CloudEventSpec {
  id: string;
  source: string;
  specversion: string;
  type: string;
  datacontenttype: string;
  time: string;
  subject: string;
  traceparent: string;
  data: Record<string, any>;
  cndpSanitized: boolean;
  domain: UrbanDomain;
  latencyFromOriginMs: number;
}

export interface DeadLetterQueueItem {
  id: string;
  originalEventId: string;
  domain: UrbanDomain;
  subject: string;
  failedAt: string;
  retryAttempts: number;
  maxRetries: number;
  errorReason: string;
  payload: Record<string, any>;
  status: 'PENDING_RETRY' | 'DEAD_LETTERED' | 'MANUALLY_RESOLVED';
}

export interface CrossTierEntityLink {
  id: string;
  sourceTier: FederatedGraphTier;
  sourceNodeId: string;
  sourceNodeLabel: string;
  targetTier: FederatedGraphTier;
  targetNodeId: string;
  targetNodeLabel: string;
  relationType: string;
  differentialPrivacyBudget: number;
  teeSignedHash: string;
  establishedAt: string;
}

export interface MemoryPipelineStepExecution {
  stepIndex: number;
  stepName: 'OBSERVATION' | 'EMBEDDING' | 'GRAPH_CONTEXT' | 'GEO_CONTEXT' | 'TEMPORAL_CONTEXT' | 'RECALL' | 'REASONING';
  title: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
  durationMs: number;
  outputSummary: string;
  details: Record<string, any>;
}

export interface UrbanMemoryRecallResult {
  memory: UrbanMemoryRecord;
  cosineSimilarity: number;
  geoProximityScore: number;
  graphConnectednessScore: number;
  temporalRelevanceScore: number;
  unifiedRecallScore: number; // Combined weighted score
  rank: number;
}

export interface OperationalVsTwinIsolationState {
  firewallActive: boolean;
  isolationProtocolVersion: string; // "v2026.4-TEE-FENCED"
  operationalLayer: OperationalTelemetryMetrics;
  activeSimulationBranches: SimulationSandboxBranch[];
  selectedSandboxBranchId: string;
  memoryNamespaceDecoupled: boolean;
  auditTrailZeroPollutionVerified: boolean;
  crossLayerDriftPct: number; // Difference between operational reality and sandbox projections
}




