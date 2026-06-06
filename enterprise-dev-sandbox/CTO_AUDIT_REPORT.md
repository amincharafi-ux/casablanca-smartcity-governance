# RAPPORT D'AUDIT TECHNIQUE ET STRATÉGIQUE (CTO SENIOR / INVESTISSEUR)
## PROJET : MYCITY MULTI-TENANT SMART CITY (Casablanca, Rabat, Tanger, Marrakech, Agadir, Fes)

---

## Executive Summary (Synthèse Décisionnelle)

Cet audit évalue l'état de maturité technologique, la viabilité architecturale et la conformité légale du système souverain saas **MyCity** (déployé pour Casablanca, Rabat, Tanger, Marrakech, Agadir, Fes) dans le cadre d'une préparation à une **Technical Due Diligence** pour une levée de fonds.

Le diagnostic est clair : le MVP actuel possède une **excellente ergonomie (UX/UI)**, une architecture modulaire propre (Vite, React 18, Express, Tailwind) et démontre une vision produit exceptionnelle pour une infrastructure numérique territoriale. Cependant, pour passer d'un démonstrateur interactif (ou MVP) à une plate-forme d'envergure nationale supportant **plus d'un million d'utilisateurs**, des transitions techniques rigoureuses sont indispensables.

Ce rapport détaille les anomalies corrigées immédiatement, l'analyse d'impact des recommandations de l'auditeur, et dresse la feuille de route d'industrialisation requise par des investisseurs institutionnels.

---

## 1. Sécurité et Gestion des Identités : Actions Immédiates et Cible

L'auditeur a identifié plusieurs "Red Flags" critiques concernant l'authentification et l'étanchéité des rôles. Nous avons procédé à des correctifs critiques, tout en définissant la trajectoire vers la cible de production.

### 1.1. Actions Déjà Appliquées (Hotfixes Réalisés)
1.  **Suppression du JWT Custom Artisanal** : Le mécanisme d'encodage et de signature manuel (utilisant `crypto.createHmac` sans standardisation) a été **totalement remplacé** par la bibliothèque de référence `jsonwebtoken` (JWT standard). Les signatures respectent désormais les normes cryptographiques de l'algorithme `HS256`.
2.  **Mise en Place de Middlewares Express Stricts (RBAC)** : Création et déploiement du middleware `verifyRole` sur le serveur Express. Ce middleware vérifie cryptographiquement les signatures et restreint dynamiquement les routes d'API sensibles (telles que les mises à jour de réclamations de la Mairie, les audits de conformité DPO, et la consultation des schémas physiques de base de données).
3.  **Nettoyage de `package.json`** : Résolution des clés malformées (caractères d'espacement traînants `"name "` ou `"private "`) susceptibles d'altérer les pipelines CI/CD ou de trahir une absence de relecture post-génération.
4.  **Mise à jour des Codes-Bases Exportables** : Les fichiers structurés (`mycity_ecosystem_codebase.md` et `cndp_integration_codebase.md`) mis à disposition dans le simulateur intègrent désormais ces standards de sécurité officiels (JWT standardisé, validation des rôles sécurisée et architecture de secrets pérenne).

### 1.2. Trajectoire de Sécurité Cible (Production)
```
[ Authentification Client ] ──► [ API Gateway / Reverse Proxy ]
                                        │ (Vérification JWT & Rate Limit)
                                        ▼
                            [ Auth Service & MFA ] ──► [ Vault / Secrets Manager ]
                                        │
                                        ▼
                            [ Hachage Argon2id ] ──► [ User Database ]
```

*   **Gestion des Secrets** : Remplacer le générateur de secret rotatif déterministe (Doppler Local) par une intégration native de **GCP Secret Manager** ou **HashiCorp Vault** en environnement de production.
*   **Double Facteur (MFA)** : Imposer l'authentification multifacteur (MFA) via SMS (opérateurs locaux ou Twilio) ou TOTP (Google Authenticator) pour tous les comptes disposant de privilèges élevés (`MAIRIE`, `DISTRICT_MANAGER`, `SYNDIC_ADMIN`).
*   **Protection des Mots de Passe** : Implémenter le hachage des mots de passe côté serveur avec l'algorithme robuste **Argon2id** (ou à défaut `bcrypt` avec un facteur de coût élevé).

---

## 2. Scalabilité et Infrastructure (10k ──► 1M+ Utilisateurs)

La transition d'une architecture monolithique vers un système hautement distribué est indispensable pour absorber la charge d'une métropole comme Casablanca.

### 2.1. Analyse d'Échelle de Charge

| Métrique / Étape | 10 000 Utilisateurs Actifs | 100 000 Utilisateurs Actifs | 1 000 000+ Utilisateurs Actifs |
| :--- | :--- | :--- | :--- |
| **Topologie Serveur** | Unique instance Node.js robuste (VPS/Cloud Run 4 vCPU, 8 Go RAM). | Grappe d'instances auto-scalées derrière un Load Balancer (Nginx/HAProxy). | Architecture microservices orientée événements (Event-Driven Architecture). |
| **Stockage Fichiers** | Stockage sur disque local (Stateful, non recommandé). | Serveur de stockage dédié ou Bucket Cloud unique (GCS / AWS S3). | Multi-Buckets géorépliqués avec CDN mondial (Cloudflare) pour les assets et signalements. |
| **Base de Données** | PostgreSQL unique managé (RDS/Cloud SQL) avec index basiques. | Réplica de lecture PostgreSQL dédié, PgBouncer pour le pooling de connexions. | PostGIS partitionné géographiquement (par arrondissements), Read Replicas distribués. |
| **Gestion des Files** | Traitement synchrone (In-Memory Express). | Asynchrone léger (file d'attente Redis / BullMQ) pour l'envoi de mails et notification. | Broker de messages distribué (Apache Kafka / RabbitMQ) pour l'Event Sourcing global. |

### 2.2. Event Sourcing & Audit de Données
Pour valoriser l'infrastructure comme un **Urban Data Lake** (et non une simple application de signalements), l'architecture technique cible doit adopter l'**Event Sourcing**. Chaque action citoyenne ou administrative ne doit plus seulement mettre à jour un état, elle doit être enregistrée dans une table immuable d'événements :

```sql
CREATE TABLE event_store (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aggregate_id UUID NOT NULL,
    aggregate_type VARCHAR(50) NOT NULL, -- 'CLAIM', 'CONSENT', 'TRANSACTION'
    event_type VARCHAR(50) NOT NULL,     -- 'CREATED', 'ASSIGNED', 'RESOLVED'
    payload JSONB NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actor_id UUID NOT NULL
);
CREATE INDEX idx_event_store_aggregate ON event_store(aggregate_id);
```
*Bénéfice Due Diligence* : Traçabilité absolue pour les audits CNDP, reconstruction de l'état système à tout instant de l'histoire, et outil de business intelligence territorial hors pair pour la Mairie.

---

## 3. Optimisation Géospatiale & PostGIS au Cœur du Système

PostGIS est le pivot de l’infrastructure d'une Smart City. Pour un million d'utilisateurs, l'absence d'indexation géospatiale correcte conduira à un effondrement de la base de données.

### 3.1. Indexation Spatiale GIST
Toutes les géométries de signalements et de commerces doivent être indexées via des index **GIST (Generalized Search Tree)** pour éviter les analyses complètes de tables (*full table scans*) lors de requêtes de proximité :

```sql
-- Création de l'index spatial GIST sur la colonne géographique de géolocalisation
CREATE INDEX idx_citizen_claims_geom_gist ON citizen_claims USING GIST (geom);
```

### 3.2. Requêtes d'Analyse Métier Hautes Performances (Exemples SQL Cibles)

*   **Calcul des signalements dans un rayon (ST_DWithin)** :
    ```sql
    -- Recherche optimisée des réclamations à moins de 500 mètres d'un point GPS données
    SELECT id, title, category 
    FROM citizen_claims 
    WHERE ST_DWithin(geom, ST_SetSRID(ST_MakePoint(:lng, :lat)::geography, 4326), 500);
    ```

*   **Partitionnement de l'espace urbain par polygones d'arrondissements (ST_Contains)** :
    ```sql
    -- Déterminer automatiquement dans quel arrondissement administratif se situe une coordonnée GPS
    SELECT d.district_name, d.manager_id
    FROM city_districts d
    WHERE ST_Contains(d.geom_polygon, ST_SetSRID(ST_MakePoint(:lng, :lat)::geography, 4326));
    ```

*   **Extraction de cartes de densité thermique des anomalies urbaines (Heatmaps)** :
    ```sql
    -- Clustering spatial pour regrouper les anomalies et orienter les équipes de maintenance de la Mairie
    SELECT count(*), ST_Centroid(ST_Collect(geom))::geometry as cluster_center
    FROM citizen_claims
    WHERE status = 'OUVERT'
    GROUP BY ST_ClusterDBSCAN(geom, eps := 0.005, minPoints := 5) OVER ();
    ```

---

## 4. Souveraineté de la Donnée et Conformité Réelle CNDP (Loi 09-08)

La conformité CNDP n'est pas qu'une couche d'interface utilisateur (UI), elle doit être garantie par des structures physiques de stockage inviolables.

```
                  ┌─────────────────────────────────┐
                  │ Interface Citoyen : PURGE TOUT │
                  └────────────────┬────────────────┘
                                   │ (Déclenchement d'un Job Asynchrone)
                                   ▼
         ┌──────────────────────────────────────────────────┐
         │ 1. Anonymisation Cryptographique de la table User│ (is_anonymized = true)
         │ 2. Suppression en cascade des données sensibles   │ (reviews, localisations exactes)
         │ 3. Log de l'action dans Registre Immuable SHA-256 │ (cndp_audit_logs)
         └──────────────────────────────────────────────────┘
```

### 4.1. Anonymisation Effective vs Purge Destructive
Pour préserver les statistiques de la ville (par exemple savoir qu'un nid-de-poule a été réparé à un endroit, sans savoir *qui* l'a signalé), nous préconisons l'anonymisation cryptographique plutôt que la suppression systématique qui casse les relations de base de données :
*   Remplacer les colonnes nominatives (`citizen_name`, `email`, `phone`) par des valeurs génériques ou des hachages à sens unique salés d'identifiants.
*   Enregistrer la date d'anonymisation et marquer le compte utilisateur à l'aide d'un booléen `is_anonymized = true`.

### 4.2. Minimisation des Données Géographiques (Noise Radius)
La loi 09-08 impose de ne pas collecter de données disproportionnées. Enregistrer les coordonnées GPS exactes au millimètre près d'un citoyen chez lui pour un problème de lampadaire est une atteinte potentielle à sa vie privée :
*   **Solution Technique** : Floutage géographique à l'entrée. Avant de persister les coordonnées d'un signalement, arrondir les coordonnées au 4ème chiffre après la virgule (précision à ~11 mètres) ou appliquer un décalage aléatoire gaussien de 100 mètres.

### 4.3. Registre de Piste d'Audit Immuable
Toutes les actions de consultation et d'export du DPO doivent être tracées dans un registre immuable, protégé par des déclencheurs (*triggers*) de base de données bloquant les `UPDATE` et `DELETE` :

```sql
CREATE TABLE cndp_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    action_type VARCHAR(50) NOT NULL, -- 'EXCEL_EXPORT', 'DATA_PORTABILITY_REQUEST', 'PURGE'
    ip_hash VARCHAR(64) NOT NULL,     -- SHA-256 anonymisé de l'IP de l'opérateur
    user_agent_hash VARCHAR(64) NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger PostgreSQL bloquant toute modification du journal d'audit
CREATE OR REPLACE FUNCTION block_audit_log_mutation()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Database Exception: block_audit_mutation trigger active. Audit logs are strictly append-only.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER restrict_audit_mutations
BEFORE UPDATE OR DELETE ON cndp_audit_logs
FOR EACH ROW EXECUTE FUNCTION block_audit_log_mutation();
```

---

## 5. IA Territoriale et RAG Darija Souverain

L'IA ne doit pas être un simple "proxy" direct vers GPT ou Gemini sans contrôle. Une telle architecture expose le système à des hallucinations juridiques, à des coûts de requêtage incontrôlés, et à des failles de souveraineté.

### 5.1. Architecture RAG Darija Souveraine Proposée
```
[ Citoyen (Darija / FR) ] ────► [ API Gateway / Express ]
                                        │
                                        ▼ (Normalisation sémantique & Filtre d'Intention)
                                [ Agent d'Intention ] 
                                        │ (Extraction de requêtes vectorielles)
                                        ▼
                             [ pgvector / PostgreSQL ] ◄───► [ FAQ, Lois Communes, Lois 18-00 ]
                                        │
                                        ▼ (Extraction du contexte de loi réel)
                          [ RAG Context Integration ]
                                        │ (Envoi du contexte épuré et ultra-ciblé)
                                        ▼
                             [ Google Gemini API ] (Souverain localisé)
                                        │
                                        ▼ (Génération de la réponse en Darija)
                                [ Citoyen ]
```

### 5.2. Pipeline de Traitement d'Intention
1.  **Normalisation** : Un modèle de classification léger traduit et normalise la question en Darija/Arabe classique ou Français technique.
2.  **Recherche Dense Spatialisée** : Utilisation d'embeddings vectoriels stockés dans PostgreSQL à l'aide de l'extension **pgvector** pour rapprocher la demande de l'utilisateur des fiches de procédures officielles de l'arrondissement concerné.
3.  **Encadrement Systémique (Security Prompting)** : Le LLM est strictement bridé pour ne s'exprimer qu'à partir du contexte injecté par le RAG. Si la réponse n'est pas présente dans la documentation territoriale certifiée de la Mairie, le modèle doit explicitement dire qu'il ne sait pas, empêchant toute hallucination de fausses lois ou procédures administratives.

---

## 6. Architecture Cible Multi-Tenant pour la Scalabilité Économique

Pour convaincre un investisseur institutionnel, MyCity ne doit pas simplement être l'application d'une seule ville. Elle doit être commercialisable comme un modèle de **Software as a Service (SaaS)** multi-tenant pour toutes les municipalités du Royaume (Casablanca, Rabat, Marrakech, Tanger, Agadir, Fes) et leurs structures internes (Arrondissements, Résidences Co-propriétés, Commerces Locaux).

```
                            [ PLATFORME MULTI-TENANT ]
                                        │
                  ┌─────────────────────┼─────────────────────┐
                  ▼                     ▼                     ▼
          [ Tenant: Casa ]       [ Tenant: Rabat ]     [ Tenant: Tanger ]     [ Tenant: Agadir ]     [ Tenant: Fes ]
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
[ Anfa District ]   [ Bourgogne District ]
```

### Schéma de Données SaaS Cible :
```sql
-- Table des Villes / Clients SaaS Institutionnels (Tenants prioritaires)
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city_name VARCHAR(100) NOT NULL,
    subdomain VARCHAR(50) UNIQUE NOT NULL, -- casa.mycity.ma, rabat.mycity.ma
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des utilisateurs liés à un Tenant
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'SUPER_ADMIN', 'CITY_ADMIN', 'RESIDENCE_MANAGER', 'CITIZEN'
    is_anonymized BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des réclamations segmentée par Tenant
CREATE TABLE citizen_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    citizen_id UUID REFERENCES users(id) ON DELETE SET NULL,
    category VARCHAR(50) NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    geom GEOMETRY(Point, 4326) NOT NULL, -- Point géographique PostGIS
    status VARCHAR(50) DEFAULT 'OUVERT',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Règle de Sécurité : Toutes les requêtes de l'API doivent être indexées et filtrées par le tenant_id
CREATE INDEX idx_claims_tenant_status ON citizen_claims(tenant_id, status);
```

*Bénéfice Stratégique* : Cette architecture garantit une mutualisation parfaite de l'infrastructure d'hébergement (un seul cluster de conteneurs sert toutes les villes), réduit drastiquement les coûts opérationnels (OPEX) et démultiplie la valorisation financière de la startup lors d'un Technical Due Diligence.

---

## Conclusion & Plan de Route

Le projet MyCity détient les fondations idéales d’un projet à fort potentiel de croissance au Maroc. Les correctifs critiques de sécurité appliqués sur le JWT, les middlewares de contrôle d'accès sélectifs, la validation robuste et le nettoyage des structures de fichiers placent l'application sur une trajectoire conforme aux exigences de robustesse indispensables aux investisseurs. 

L'adoption graduelle de ce plan d'architecture (PostGIS optimisé, anonymisation CNDP concrète, Event Sourcing et RAG Darija canalisé) garantira le plein succès de la transition de l'échelle d'un MVP à un leader de la GovTech territoriale.
