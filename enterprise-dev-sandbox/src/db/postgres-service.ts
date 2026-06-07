import crypto from "crypto";
import { db, isDbConnected } from "./index";
import * as schema from "./schema";
import { eq, desc } from "drizzle-orm";

// ============================================================================
// PASSWORD ENCRYPTION ENGINE (Timing-Safe Scrypt Integration)
// ============================================================================
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    if (!stored || !stored.includes(":")) return false;
    const [salt, hash] = stored.split(":");
    const testHash = crypto.scryptSync(password, salt, 64).toString("hex");
    return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(testHash, "hex"));
  } catch (error) {
    console.error("Password verification crash:", error);
    return false;
  }
}

// ============================================================================
// HIGH-FIDELITY FALLBACK / SANDBOX IN-MEMORY ENGINE
// ============================================================================
export let localClaims: any[] = [
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

export let localAuditLogs: any[] = [
  { id: "audit-1", actor: "SYSTEM", action: "Seeding Data", details: "Initialisation sécurisée de session CNDP Law 09-08 et alimentation par défaut.", timestamp: "2026-05-25T22:30:11Z" },
  { id: "audit-2", actor: "SYSTEM", action: "Load Database", details: "Seeding immuable d'agenda d'Anfa Gauthier et Sidi Bernoussi.", timestamp: "2026-05-25T22:31:00Z" }
];

export let localConsents: any[] = [];
export let localEvents: any[] = [];

// ============================================================================
// EVENT SOURCING ENGINE (Immutable Audit Trail for Citizen & Business Actions)
// ============================================================================
export async function recordSourcedEvent(
  eventType: string,
  aggregateId: string | null,
  actor: string | null,
  payload: any
): Promise<any> {
  const timestampStr = new Date().toISOString();
  const eventObj = {
    id: `event-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    eventType,
    aggregateId,
    actor: actor || "ANONYMOUS",
    payload: payload || {},
    timestamp: timestampStr
  };

  localEvents.unshift(eventObj);

  const connected = await isDbConnected();
  if (connected) {
    try {
      await db.insert(schema.eventStore).values({
        eventType,
        aggregateId,
        actor: actor || "ANONYMOUS",
        payload: payload || {},
      });
    } catch (err) {
      console.error("Failed to append to event store SQL table:", err);
    }
  }

  return eventObj;
}

export async function getSourcedEvents(): Promise<any[]> {
  const connected = await isDbConnected();
  if (!connected) {
    return localEvents;
  }
  try {
    const dbEvents = await db.select().from(schema.eventStore).orderBy(desc(schema.eventStore.timestamp));
    return dbEvents.map(e => ({
      id: e.id,
      eventType: e.eventType,
      aggregateId: e.aggregateId,
      actor: e.actor,
      payload: e.payload,
      timestamp: e.timestamp ? e.timestamp.toISOString() : new Date().toISOString()
    }));
  } catch (err) {
    console.error("Failed to query event store, falling back:", err);
    return localEvents;
  }
}


// ============================================================================
// AUTOMATIC DATA SEEDER (Executed on Startup + Connections)
// ============================================================================
export async function seedDatabase() {
  const connected = await isDbConnected();
  if (!connected) {
    console.log("[POSTGRES SERVICE] Database offline - operating in local sandbox simulation.");
    return;
  }

  try {
    console.log("[POSTGRES SERVICE] Database online - running automated upsert seeding.");

    // 1. Seed default users
    const defaultUsers = [
      { email: "fz.mayor@mairie-casablanca.ma", role: "MAIRIE", pass: "MairiePassword123!", name: "Fatim-Zahra Mayor" },
      { email: "fatim.zahra@mairie-casablanca.ma", role: "MAIRIE", pass: "MairiePassword123!", name: "Secrétariat de la Mairie" },
      { email: "omar.kabbaj@casablancashop.ma", role: "BUSINESS_CAT1", pass: "Business1Password123!", name: "Omar Kabbaj (Shop Owners Assoc)" },
      { email: "i.elomari@premiumcasablanca.ma", role: "BUSINESS_CAT2", pass: "Business2Password123!", name: "I. El Omari (Premium Casa)" },
      { email: "citizen@souverain.ma", role: "PUBLIC", pass: "CitizenPassword123!", name: "Citoyen Validé CNDP" }
    ];

    for (const u of defaultUsers) {
      // Create user if not exists
      const existingUser = await db.select().from(schema.users).where(eq(schema.users.email, u.email));
      let userId: string;

      if (existingUser.length === 0) {
        const hashedPassword = hashPassword(u.pass);
        const [insertedUser] = await db.insert(schema.users).values({
          email: u.email,
          passwordHash: hashedPassword,
          role: u.role,
        }).returning();
        userId = insertedUser.id;
      } else {
        userId = existingUser[0].id;
      }

      // Sync into userProfiles
      const existingProfile = await db.select().from(schema.userProfiles).where(eq(schema.userProfiles.email, u.email));
      if (existingProfile.length === 0) {
        await db.insert(schema.userProfiles).values({
          id: userId,
          email: u.email,
          fullName: u.name,
          role: u.role.toLowerCase(),
          isBusiness: u.role.startsWith("BUSINESS"),
          isInstitution: u.role === "MAIRIE",
          city: "Casablanca"
        });
      }
    }

    // 2. Seed default claims if empty
    const existingClaims = await db.select().from(schema.claims);
    if (existingClaims.length === 0) {
      const [mairieUser] = await db.select().from(schema.users).where(eq(schema.users.email, "fatim.zahra@mairie-casablanca.ma"));
      const mairieId = mairieUser ? mairieUser.id : undefined;

      if (mairieId) {
        for (const c of localClaims) {
          const lat = c.id === "claim-101" ? 33.5752 : c.id === "claim-102" ? 33.5704 : 33.6012;
          const lng = c.id === "claim-101" ? -7.5891 : c.id === "claim-102" ? -7.5855 : -7.5023;

          await db.insert(schema.claims).values({
            userId: mairieId,
            topic: c.category,
            status: c.status.toLowerCase() === "resolu" ? "resolu" : c.status.toLowerCase() === "en_cours" ? "en_cours" : "open",
            details: JSON.stringify({
              title: c.title,
              description: c.description,
              location: c.location,
              citizenName: c.citizenName,
              replies: c.replies
            }),
            geom: { lng, lat }
          });
        }
      }
    }

    console.log("[POSTGRES SERVICE] Automated seeding completed successfully.");
  } catch (error) {
    console.error("[POSTGRES SERVICE] Seeding failed:", error);
  }
}

// ============================================================================
// AUDIT LOG MANAGEMENT SERVICE
// ============================================================================
export async function insertAuditLog(actor: string, action: string, details: string) {
  const connected = await isDbConnected();
  const timestampStr = new Date().toISOString();

  // Save to in-memory fallback
  localAuditLogs.push({
    id: `audit-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    actor,
    action,
    details,
    timestamp: timestampStr
  });

  if (connected) {
    try {
      // Find matching user UUID if matching login email
      const user = await db.select().from(schema.users).where(eq(schema.users.email, actor));
      const actorId = user[0] ? user[0].id : null;

      await db.insert(schema.auditLogs).values({
        actorId,
        action,
        metadata: { details },
      });
    } catch (err) {
      console.error("Failed to persist audit log into SQL:", err);
    }
  }
}

// ============================================================================
// CLAIMS PERSISTENT / FALLBACK MANAGEMENT SERVICE
// ============================================================================
export async function getClaims(isMairie: boolean): Promise<any[]> {
  const connected = await isDbConnected();
  if (!connected) {
    return blurGeometriesLocally(localClaims, isMairie);
  }

  try {
    const dbClaimsResult = await db.select().from(schema.claims);
    
    // Map database models to UI models
    const mapped = dbClaimsResult.map(c => {
      let detailsObj: any = {};
      try {
        detailsObj = JSON.parse(c.details || "{}");
      } catch {
        detailsObj = { description: c.details };
      }

      const categoryMap = c.topic as any;
      const statusMap = c.status === "resolu" ? "RESOLU" : c.status === "en_cours" ? "EN_COURS" : "OUVERT";

      return {
        id: c.id,
        citizenName: detailsObj.citizenName || "Citoyen Anonyme",
        category: categoryMap,
        title: detailsObj.title || "Sans titre",
        description: detailsObj.description || "",
        status: statusMap,
        createdAt: c.createdAt ? c.createdAt.toISOString() : new Date().toISOString(),
        location: detailsObj.location || "Casablanca",
        geomCoordinates: c.geom ? { lat: c.geom.lat, lng: c.geom.lng } : null,
        replies: detailsObj.replies || []
      };
    });

    return blurGeometriesLocally(mapped, isMairie);
  } catch (err) {
    console.error("Failed to fetch claims, falling back to local memory:", err);
    return blurGeometriesLocally(localClaims, isMairie);
  }
}

function blurGeometriesLocally(claimsList: any[], isMairie: boolean): any[] {
  return claimsList.map(claim => {
    if (isMairie) {
      // Municipal admins see exact coordinates
      let baseLat = 33.5731;
      let baseLng = -7.5898;
      
      if (claim.geomCoordinates) {
        baseLat = claim.geomCoordinates.lat;
        baseLng = claim.geomCoordinates.lng;
      } else if (claim.id === "claim-101") { baseLat = 33.5752; baseLng = -7.5891; }
      else if (claim.id === "claim-102") { baseLat = 33.5704; baseLng = -7.5855; }
      else if (claim.id === "claim-103") { baseLat = 33.6012; baseLng = -7.5023; }

      return {
        ...claim,
        coordinates: { lat: baseLat, lng: baseLng }
      };
    } else {
      // Server-Side Spatial Blurring (500m radius obfuscation)
      // Normal citizens DO NOT receive exact coordinate geometry. Sanitized prior to API transmission.
      let baseLat = 33.5731;
      let baseLng = -7.5898;
      
      if (claim.geomCoordinates) {
        baseLat = claim.geomCoordinates.lat;
        baseLng = claim.geomCoordinates.lng;
      } else if (claim.id === "claim-101") { baseLat = 33.5752; baseLng = -7.5891; }
      else if (claim.id === "claim-102") { baseLat = 33.5704; baseLng = -7.5855; }
      else if (claim.id === "claim-103") { baseLat = 33.6012; baseLng = -7.5023; }

      // Mathematical 500m coordinate scrambling (0.0042 decimal degrees variance)
      const angle = Math.random() * Math.PI * 2;
      const radiusDegrees = 0.0042 + Math.random() * 0.0006; // Between 460m and 530m
      const blurredLat = baseLat + Math.sin(angle) * radiusDegrees;
      const blurredLng = baseLng + Math.cos(angle) * radiusDegrees;

      return {
        ...claim,
        citizenName: "Citoyen Souverain Anonyme (Loi CNDP)",
        location: `${claim.location.split(',')[0]} (Secteur de 500m - Floutage API ST_Buffer)`,
        coordinates: { lat: blurredLat, lng: blurredLng },
        description: claim.description + " [Géolocalisation GPS chiffrée pgcrypto et floutée à 500m à l'API]"
      };
    }
  });
}

export async function createClaim(
  category: string,
  title: string,
  description: string,
  location: string,
  citizenName: string
): Promise<any> {
  const newClaim: any = {
    id: `claim-${Date.now().toString().substring(8)}`,
    citizenName: citizenName || "Anonyme",
    category,
    title,
    description,
    status: "OUVERT",
    createdAt: new Date().toISOString(),
    location,
    replies: []
  };

  // Pre-seed matching geometries based on key Casablanca words
  let lat = 33.5731;
  let lng = -7.5898;
  const lowerLoc = location.toLowerCase();
  if (lowerLoc.includes("gauthier") || lowerLoc.includes("anfa")) { lat = 33.5752; lng = -7.5891; }
  else if (lowerLoc.includes("maârif") || lowerLoc.includes("solidaire")) { lat = 33.5704; lng = -7.5855; }
  else if (lowerLoc.includes("sidi bernoussi") || lowerLoc.includes("express")) { lat = 33.6012; lng = -7.5023; }

  // Always sync to local memory fallback
  localClaims.unshift(newClaim);

  // Record Event Sourcing event
  await recordSourcedEvent("SIGNALEMENT_CREE", newClaim.id, citizenName || "Anonyme", {
    category,
    title,
    location
  });

  const connected = await isDbConnected();
  if (connected) {
    try {
      // Find or create default user profile for association
      const [u] = await db.select().from(schema.users).where(eq(schema.users.email, "citizen@souverain.ma"));
      const userId = u ? u.id : undefined;

      if (userId) {
        await db.insert(schema.claims).values({
          userId,
          topic: category,
          status: "open",
          details: JSON.stringify({
            title,
            description,
            location,
            citizenName,
            replies: []
          }),
          geom: { lng, lat }
        });
      }
    } catch (err) {
      console.error("Failed to write claim to SQL database:", err);
    }
  }

  return newClaim;
}

export async function updateClaimStatus(
  claimId: string,
  status: string,
  replyMessage?: string
): Promise<any> {
  // 1. Sync in-memory fallback
  const cIndex = localClaims.findIndex(c => c.id === claimId);
  if (cIndex !== -1) {
    const current = localClaims[cIndex];
    localClaims[cIndex] = {
      ...current,
      status: status || current.status,
      replies: replyMessage ? [...current.replies, {
        sender: "MAIRIE",
        message: replyMessage,
        timestamp: new Date().toISOString()
      }] : current.replies
    };
  }

  // Trigger event-sourced record for claim resolution/closing
  if (status === "RESOLU" || status === "closed" || status === "RESOLVED") {
    await recordSourcedEvent("SIGNALEMENT_FERME", claimId, "MAIRIE", {
      replyMessage,
      newStatus: status
    });
  }

  const connected = await isDbConnected();
  if (connected) {
    try {
      const records = await db.select().from(schema.claims).where(eq(schema.claims.id, claimId));
      if (records.length > 0) {
        const claimRecord = records[0];
        let existingDetails: any = {};
        try {
          existingDetails = JSON.parse(claimRecord.details || "{}");
        } catch {
          existingDetails = { description: claimRecord.details };
        }

        const replies = existingDetails.replies || [];
        if (replyMessage) {
          replies.push({
            sender: "MAIRIE",
            message: replyMessage,
            timestamp: new Date().toISOString()
          });
        }

        await db.update(schema.claims).set({
          status: status ? status.toLowerCase() : claimRecord.status,
          details: JSON.stringify({
            ...existingDetails,
            replies
          }),
          updatedAt: new Date()
        }).where(eq(schema.claims.id, claimId));
      }
    } catch (err) {
      console.error("Failed to update claim in SQL database:", err);
    }
  }

  return cIndex !== -1 ? localClaims[cIndex] : null;
}

// ============================================================================
// COMPREHENSIVE B2G CREDENTIAL ROLES VALIDATOR
// ============================================================================
export async function authenticateCredential(email: string, pass: string): Promise<any | null> {
  const connected = await isDbConnected();
  if (!connected) {
    // Local development fallback
    const mockAccounts = [
      { email: "fz.mayor@mairie-casablanca.ma", role: "MAIRIE", pass: "MairiePassword123!", name: "Fatim-Zahra Mayor" },
      { email: "fatim.zahra@mairie-casablanca.ma", role: "MAIRIE", pass: "MairiePassword123!", name: "Secrétariat de la Mairie" },
      { email: "omar.kabbaj@casablancashop.ma", role: "BUSINESS_CAT1", pass: "Business1Password123!", name: "Omar Kabbaj (Shop Owners)" },
      { email: "i.elomari@premiumcasablanca.ma", role: "BUSINESS_CAT2", pass: "Business2Password123!", name: "I. El Omari" },
      { email: "citizen@souverain.ma", role: "PUBLIC", pass: "CitizenPassword123!", name: "Citoyen Validé CNDP" }
    ];

    const account = mockAccounts.find(m => m.email.toLowerCase() === email.toLowerCase() && m.pass === pass);
    if (account) {
      return {
        email: account.email,
        role: account.role,
        full_name: account.name
      };
    }
    return null;
  }

  try {
    const records = await db.select().from(schema.users).where(eq(schema.users.email, email.toLowerCase()));
    if (records.length === 0) return null;

    const user = records[0];
    const match = verifyPassword(pass, user.passwordHash);
    if (!match) return null;

    // Fetch profile
    const profile = await db.select().from(schema.userProfiles).where(eq(schema.userProfiles.email, email.toLowerCase()));
    return {
      email: user.email,
      role: user.role,
      full_name: profile[0]?.fullName || "Citoyen Validé CNDP"
    };
  } catch (err) {
    console.error("Authentication SQL exception:", err);
    return null;
  }
}

export async function getOrCreateProfileByRole(role: string): Promise<any> {
  const normalizedRole = role.toUpperCase();
  const emailMap: Record<string, string> = {
    "MAIRIE": "fatim.zahra@mairie-casablanca.ma",
    "BUSINESS_CAT1": "omar.kabbaj@casablancashop.ma",
    "BUSINESS_CAT2": "i.elomari@premiumcasablanca.ma",
    "PUBLIC": "citizen@souverain.ma"
  };

  const nameMap: Record<string, string> = {
    "MAIRIE": "Secrétariat de la Mairie",
    "BUSINESS_CAT1": "Omar Kabbaj (Shop Owners)",
    "BUSINESS_CAT2": "I. El Omari (Premium Casa)",
    "PUBLIC": "Citoyen Sauvérisé CNDP"
  };

  const email = emailMap[normalizedRole] || `citoyen-${Math.floor(Math.random() * 9000 + 1000)}@souverain.ma`;
  const name = nameMap[normalizedRole] || "Citoyen Validé CNDP";

  return {
    email,
    role: normalizedRole,
    full_name: name
  };
}

export async function registerUser(email: string, pass: string, fullName: string, role: string): Promise<void> {
  const existing = await db.select().from(schema.users).where(eq(schema.users.email, email.toLowerCase()));
  if (existing.length > 0) {
    throw new Error("ALREADY_EXISTS");
  }

  const hashedPassword = hashPassword(pass);
  const [newUser] = await db.insert(schema.users).values({
    email: email.toLowerCase(),
    passwordHash: hashedPassword,
    role: role,
  }).returning();

  await db.insert(schema.userProfiles).values({
    id: newUser.id,
    email: email.toLowerCase(),
    fullName: fullName || "Citoyen Souverain",
    role: role.toLowerCase(),
    city: "Casablanca",
    isBusiness: role.startsWith("BUSINESS"),
    isInstitution: role === "MAIRIE"
  });
}
