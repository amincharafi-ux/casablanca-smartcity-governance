# 🔒 CNDP_COMPLIANCE.md - Mapping Réglementaire Loi 09-08

Ce document dresse le mapping fonctionnel et technique rigoureux entre le cadre légal national marocain de la **Loi 09-08** (portant sur la protection des personnes physiques à l'égard du traitement des données à caractère personnel) et l'architecture logicielle de la plateforme MyCity Casablanca.

---

## 🗺️ Table de Mapping Réglementaire & Technique

*   **Article 4, Paragraph 1 (Consentement Préalable)** :
    *   *Implémentation* : Gestionnaire de Consentement Actif (`UserProfileDashboard.tsx`) : Possibilité d'activer/désactiver sélectivement le suivi géographique, l'analyse d'IA et le Bluetooth (BLE).
*   **Article 7 (Droit à l'Oubli & Rectification/Suppression)** :
    *   *Implémentation* : Fonction `anonymize_user_cascade()` & Bouton d'Effacement en 1-Clic : Efface instantanément l'identité civile en la remplaçant par des hachages salés irréversibles et anonymise les signalements stockés.
*   **Article 8 (Droit d'Accès & Portabilité)** :
    *   *Implémentation* : Moteur d'Export Structuré JSON/MD : Permet à l'utilisateur de télécharger en un clic l'intégralité de ses fiches, consentements et traces enregistrées.
*   **Article 12 (Droit d'Opposition du Citoyen)** :
    *   *Implémentation* : Opt-out Interactif d'Analyse Locale : Bouton-bascule immédiat pour bloquer l'ingestion de géolocalisation ou d'indexation d'IA pour des raisons de convenance personnelle.
*   **Article 24 (Sécurité et Confidentialité)** :
    *   *Implémentation* : Vérification de Signature Standardisée (`jsonwebtoken` HS256) : Blocage des élévations de rôles sauvages par JWT, Stockage Immuable des Secrets via Doppler Vault, et Contrôles Heuristiques d'Image avec Sharp (Purge EXIF) & Magic Bytes.
*   **Article 24 (Suite) (Piste d'Audit Interne & Non-Répudiation)** :
    *   *Implémentation* : Table de Logs Immuable (`cndp_audit_logs`) de type **Append-Only** : Empêche toute mise à jour rétroactive du journal des modifications via un déclencheur (*trigger*) SQl d'aberration.
