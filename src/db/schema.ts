import { pgTable, text, varchar, boolean, timestamp, integer, doublePrecision, uuid, jsonb, decimal, primaryKey, customType, index } from "drizzle-orm/pg-core";

// Custom geography Point type for PostGIS
export const geographyPoint = customType<{
  data: { lng: number; lat: number };
  driverData: string;
}>({
  dataType() {
    return "geography(Point, 4326)";
  },
  toDriver(value: { lng: number; lat: number }): string {
    return `SRID=4326;POINT(${value.lng} ${value.lat})`;
  },
  fromDriver(value: unknown): { lng: number; lat: number } {
    if (!value) return { lng: -7.63, lat: 33.57 }; // Default to Casablanca center

    if (typeof value === "string") {
      // 1. WKT POINT(lng lat) representation
      const match = value.match(/POINT\s*\(\s*([-\d.]+)\s+([-\d.]+)\s*\)/i);
      if (match) {
        return { lng: parseFloat(match[1]), lat: parseFloat(match[2]) };
      }

      // 2. Hex EWKB representation parsing
      try {
        const buf = Buffer.from(value, "hex");
        if (buf.length >= 21) {
          const isLittleEndian = buf[0] === 0x01;
          let offset = 1;
          
          const type = isLittleEndian ? buf.readUInt32LE(offset) : buf.readUInt32BE(offset);
          offset += 4;
          
          const hasSRID = !!(type & 0x20000000) || type === 0x20000001 || type === 536870913;
          if (hasSRID) {
            offset += 4; // Skip SRID
          }
          
          const lng = isLittleEndian ? buf.readDoubleLE(offset) : buf.readDoubleBE(offset);
          offset += 8;
          const lat = isLittleEndian ? buf.readDoubleLE(offset) : buf.readDoubleBE(offset);
          
          return { lng, lat };
        }
      } catch (e) {
        console.error("Error parsing geographyPoint from hex EWKB:", e);
      }
    }

    if (typeof value === "object" && value !== null && "lng" in value && "lat" in value) {
      return value as { lng: number; lat: number };
    }

    return { lng: -7.63, lat: 33.57 }; // Fallback
  },
});

export const postgisPoint = geographyPoint;


// ============================================================================
// 1. TABLE: USER PROFILES
// ============================================================================
export const userProfiles = pgTable("user_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique().notNull(),
  fullName: text("full_name"),
  phone: text("phone"),
  role: varchar("role", { length: 20 }).default("public"),
  subscriptionTier: varchar("subscription_tier", { length: 20 }).default("free"),
  subStatus: varchar("sub_status", { length: 20 }).default("inactive"),
  subExpiresAt: timestamp("sub_expires_at", { withTimezone: true }),
  stripeCustomerId: text("stripe_customer_id"),
  isBusiness: boolean("is_business").default(false),
  isInstitution: boolean("is_institution").default(false),
  city: varchar("city", { length: 100 }).default("Casablanca"),
  deviceFingerprint: text("device_fingerprint"),
  avatarUrl: text("avatar_url"),
  bookingsCount: integer("bookings_count").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
});

// ============================================================================
// 2. TABLE: CITIES
// ============================================================================
export const cities = pgTable("cities", {
  slug: varchar("slug", { length: 50 }).primaryKey(),
  nameFr: varchar("name_fr", { length: 100 }).notNull(),
  nameAr: varchar("name_ar", { length: 100 }),
  centerLat: doublePrecision("center_lat").notNull(),
  centerLng: doublePrecision("center_lng").notNull(),
  zoomLevel: integer("zoom_level").default(13),
  moderationThreshold: decimal("moderation_threshold", { precision: 3, scale: 2 }).default("0.70"),
  activeCategories: jsonb("active_categories").default('["culture","business","sport","food","art","services"]'),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ============================================================================
// 3. TABLE: VENUES
// ============================================================================
export const venues = pgTable("venues", {
  id: uuid("id").primaryKey().defaultRandom(),
  ownerId: uuid("owner_id").references(() => userProfiles.id, { onDelete: "set null" }),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  address: text("address"),
  city: varchar("city", { length: 100 }).default("Casablanca"),
  geom: geographyPoint("geom").notNull(),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  logoUrl: text("logo_url"),
  verified: boolean("verified").default(false),
  category: varchar("category", { length: 50 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
}, (table) => ({
  geomGistIdx: index("venues_geom_gist_idx").using("gist", table.geom),
}));

// ============================================================================
// 4. TABLE: EVENTS
// ============================================================================
export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 300 }).notNull(),
  description: text("description"),
  startTime: timestamp("start_time", { withTimezone: true }).notNull(),
  endTime: timestamp("end_time", { withTimezone: true }),
  priceMad: decimal("price_mad", { precision: 8, scale: 2 }).default("0.00"),
  isFree: boolean("is_free").default(false),
  category: varchar("category", { length: 50 }).notNull(),
  venueId: uuid("venue_id").references(() => venues.id, { onDelete: "cascade" }),
  citySlug: varchar("city_slug", { length: 50 }).references(() => cities.slug, { onDelete: "cascade" }),
  organizerId: uuid("organizer_id").references(() => userProfiles.id, { onDelete: "cascade" }),
  imageUrl: text("image_url"),
  images: jsonb("images").default("[]"),
  sourceUrl: text("source_url"),
  ingestionSignature: varchar("ingestion_signature", { length: 64 }).unique(),
  markerType: varchar("marker_type", { length: 20 }).default("event_day"),
  status: varchar("status", { length: 20 }).default("draft"),
  createdBy: uuid("created_by").references(() => userProfiles.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
});

// ============================================================================
// 5. TABLE: BOOKINGS
// ============================================================================
export const bookings = pgTable("bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => userProfiles.id, { onDelete: "cascade" }).notNull(),
  eventId: uuid("event_id").references(() => events.id, { onDelete: "cascade" }).notNull(),
  ticketType: varchar("ticket_type", { length: 50 }).default("standard"),
  quantity: integer("quantity").default(1),
  totalMad: decimal("total_mad", { precision: 8, scale: 2 }).notNull(),
  status: varchar("status", { length: 20 }).default("pending"),
  paymentProvider: varchar("payment_provider", { length: 50 }),
  paymentId: text("payment_id"),
  paymentRaw: jsonb("payment_raw"),
  qrCode: text("qr_code"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  usedAt: timestamp("used_at", { withTimezone: true }),
});

// ============================================================================
// 6. TABLE: CLAIMS (Geolocated citizen reported incidents for municipal action)
// ============================================================================
export const claims = pgTable("claims", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => userProfiles.id, { onDelete: "cascade" }).notNull(),
  topic: varchar("topic", { length: 50 }).notNull(),
  details: text("details"),
  status: varchar("status", { length: 20 }).default("open"),
  geom: geographyPoint("geom"),
  imageUrl: text("image_url"),
  assignedTo: uuid("assigned_to").references(() => userProfiles.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
}, (table) => ({
  geomGistIdx: index("claims_geom_gist_idx").using("gist", table.geom),
}));

// ============================================================================
// 7. TABLE: FLASH MESSAGES
// ============================================================================
export const flashMessages = pgTable("flash_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  senderId: uuid("sender_id").references(() => userProfiles.id, { onDelete: "cascade" }).notNull(),
  content: text("content").notNull(),
  title: varchar("title", { length: 200 }),
  isActive: boolean("is_active").default(true),
  priority: varchar("priority", { length: 20 }).default("normal"),
  targetCity: varchar("target_city", { length: 50 }).references(() => cities.slug, { onDelete: "cascade" }),
  targetLat: doublePrecision("target_lat"),
  targetLng: doublePrecision("target_lng"),
  targetRadiusM: integer("target_radius_m").default(1000),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  createdByInstitution: boolean("created_by_institution").default(false),
});

// ============================================================================
// 8. TABLE: USER CONSENTS
// ============================================================================
export const userConsents = pgTable("user_consents", {
  userId: uuid("user_id").primaryKey().references(() => userProfiles.id, { onDelete: "cascade" }),
  location: boolean("location").default(false),
  aiProfiling: boolean("ai_profiling").default(false),
  calendarSync: boolean("calendar_sync").default(false),
  bleMesh: boolean("ble_mesh").default(false),
  version: integer("version").default(1),
  grantedAt: timestamp("granted_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ============================================================================
// 9. TABLE: RATE LIMITS
// ============================================================================
export const rateLimits = pgTable("rate_limits", {
  fingerprint: text("fingerprint").notNull(),
  action: varchar("action", { length: 50 }).notNull(),
  count: integer("count").default(0),
  windowStart: timestamp("window_start", { withTimezone: true }).defaultNow(),
  windowMinutes: integer("window_minutes").default(60),
}, (table) => [
  primaryKey({ columns: [table.fingerprint, table.action] })
]);

// ============================================================================
// 10. TABLE: SHADOWBANS
// ============================================================================
export const shadowbans = pgTable("shadowbans", {
  fingerprint: text("fingerprint").primaryKey(),
  reason: varchar("reason", { length: 50 }),
  triggeredAt: timestamp("triggered_at", { withTimezone: true }).defaultNow(),
  durationHours: integer("duration_hours").default(48),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
});

// ============================================================================
// 11. TABLE: AUDIT LOGS
// ============================================================================
export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  actorId: uuid("actor_id").references(() => userProfiles.id, { onDelete: "set null" }),
  action: varchar("action", { length: 100 }).notNull(),
  targetType: varchar("target_type", { length: 50 }),
  targetId: uuid("target_id"),
  metadata: jsonb("metadata"),
  timestamp: timestamp("timestamp", { withTimezone: true }).defaultNow(),
});
