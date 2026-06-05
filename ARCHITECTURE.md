# 🗺️ ARCHITECTURE.md - Flux de Données Souverain MyCity

Ce document détaille l'architecture des flux de données de la plateforme MyCity Casablanca, de la saisie d'un signalement citoyen jusqu'à l'indexation spatiale optimisée dans la base de données PostgreSQL/PostGIS.

---

## 🏗 Schéma Synoptique du Flux de Données
Le flux suit un schéma strict d'interception, enrichissement, validation et isolation :
  
*   **Citoyen** (📱 Client Mobile & Web) --[ Requête HTTPS + JWT ]--> **API Gateway** (Nginx/Kong)
*   **API Gateway** --[ Contrôle de conformité & Rate Limiting ]--> **Middleware d'Authentification / RBAC** (verifyRole)
*   **Middleware Security** --[ Sharp Exif Stripper ]--> **Filtre Photo & Geoflutter Noise**
*   **Filtre Anonymisation CNDP** --[ Drizzle ORM Type ]--> **Drizzle Model Engines**
*   **Drizzle ORM** --[ SQL Insert geographyPoint ]--> **PostgreSQL Database + PostGIS** (Index Spatial GiST)
*   **Database Engine** --[ Triggers immutabilité ]--> **Registre d'Audit Append-Only SHA-256**

---

## 🔄 Analyse Étape par Étape

### 1. Client & API Gateway
Le citoyen initie sa demande (par exemple, le signalement d'un incident de voirie dans l'arrondissement d'Anfa). La requête est enveloppée d'un en-tête d'autorisation conforme `Authorization: Bearer <JWT_SECRET_KEY>` et transmise à l'**API Gateway**. L'intercepteur y applique :
* Un rate-limiting strict de **10 requêtes/minute** pour juguler les dénis de service et attaques automatisées.
* La terminaison TLS pour chiffrer les données en transit (conformément aux normes SSL/TLS requis par l'ISO 27001).

### 2. Pipeline de Services Express
La requête traverse ensuite les filtres de sécurité applicatifs :
1. **Authentification JWT standardisée** : La validateur serveur compare le jeton à la clé dynamique injectée via Doppler. Les rôles (`PUBLIC`, `BUSINESS_CAT1`, `BUSINESS_CAT2`, `MAIRIE`) sont extraits de manière immuable côté serveur. Le client ne peut pas altérer son rôle.
2. **Nettoyage Multimédia EXIF** : Si un signalement contient une image, le moteur applicatif utilise **Sharp** pour purger instantanément les métadonnées géotags d'origine de l'image (EXIF) afin d'éviter qu'un tiers ne découvre l'emplacement de prise de vue original du citoyen.
3. **Anonymisation Spatiale CNDP** : Pour préserver la vie privée des résidents, les coordonnées GPS fournies sont altérées algorithmiquement avant leur stockage. Un floutage spatial ou un décalage aléatoire gaussien de ~100 mètres est appliqué si l'incident se situe dans un secteur privatif.

### 3. Couche d'Accès aux Données (Drizzle & PostGIS)
Les données sont persistées à l'aide de l'ORM **Drizzle** configuré pour le dialecte PostgreSQL :
* La colonne géographique utilise le type personnalisé `geographyPoint` qui convertit à la volée les objets de coordonnées `{lng, lat}` en chaînes d'insertion binaires ou textuelles reconnues par PostGIS (`SRID=4326;POINT(lng lat)`).
* La base de données PostgreSQL s'appuie sur l'extension spatiale **PostGIS**. Toutes les coordonnées d'incidents sont indexées via des index **GiST (Generalized Search Tree)**, assurant des requêtes géospatiales de proximité avec une latence ultra-faible (<15ms) à l'échelle de plus d'un million d'enregistrements.
* En parallèle, l'action est consignée de manière immuable dans un registre d'audit append-only avec chaînage cryptographique SHA-256.
