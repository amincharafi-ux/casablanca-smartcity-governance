# 🛡️ SECURITY.md - Politique Globale de Sécurité "Zero-Trust"

La plateforme souveraine MyCity Casablanca adopte une philosophie de sécurité **"Security and Privacy by Design"** et des principes **Zero-Trust**. Chaque composant de l'architecture est conçu en partant du postulat que le réseau et les postes clients sont potentiellement compromis.

---

## 🔒 1. Politique Zero-Trust appliquée au Rôle Applicatif (RBAC)

*   **Aucune confiance côté client** : Le client transmet uniquement son jeton de session. Le serveur ne fait jamais confiance aux données d'identité ou de rôle déclarées par l'application cliente. Les rôles (`PUBLIC`, `BUSINESS_CAT1`, `BUSINESS_CAT2`, `MAIRIE`) sont déterminés et validés exclusivement par déchiffrement cryptographique du jeton JWT côté serveur.
*   **Élastique & Granulaire** : Les routes sensibles (telles que les audits, les configurations système ou la consultation directe d'enregistrements en base) sont protégées par le middleware Express `verifyRole([ROLE])`. Une faille XSS sur le portail citoyen public ne permet en aucun cas d'accéder aux données municipales ou aux schémas physiques PostgreSQL.

---

## 🔑 2. Gestion et Rotation des Secrets avec Doppler Vault

*   **Suppression des secrets en dur** : Aucun mot de passe, clé d'API (Gemini, Stripe, etc.) ou secret de signature de jeton (JWT_SECRET) n'est stocké dans le dépôt de code ou dans les variables locales de la machine hôte.
*   **Approvisionnement dynamique** : Au démarrage du conteneur de production, l'agent **Doppler** injecte de manière sécurisée et éphémère les secrets directement en mémoire système.
*   **Auditabilité & Rotation** : Les clés cryptographiques de signature JWT sont configurées pour subir des cycles de rotation réguliers, révoquant instantanément les anciennes signatures sans interrompre le service grâce à un support de clés tournantes (Key Rotating Architecture).

---

## 📷 3. Dépouillement Réseau et Stripping EXIF Automatique

*   **Fuite de vie privée sur les clichés** : Les smartphones modernes intègrent des balises géographiques extrêmement précises (latitude/longitude, modèle de téléphone, heure exacte de capture) dans les métadonnées EXIF des images.
*   **Nettoyage matériel côté serveur** : Avant d'entrer en phase de persistance ou d'être redistribuées au tableau de bord municipal, toutes les images téléversées transitent par le moteur de traitement d'images **Sharp** :
    ```typescript
    await sharp(uploadedBuffer)
      .keepMetadata(false) // Purge intégrale de toutes les balises EXIF/GPS/IPTC
      .toFormat('jpeg')
      .toBuffer();
    ```
*   **Contrôle Magic Bytes** : Les extensions de fichiers sont validées via l'analyse du header binaire (Magic Bytes) pour bloquer les tentatives d'exécution de fichiers malicieux dissimulés sous de fausses extensions `.png` ou `.jpg`.

---

## 🛡️ 4. Pseudonymisation en 1-Clic & Droit à l'Oubli Instantané

*   **But de souveraineté** : MyCity permet à chaque citoyen d'exercer instantanément son **droit à l'effacement et à l'oubli** sous la directive nationale (Loi 09-08) et européenne (RGPD).
*   **Traitement en cascade** : L'activation de la fonction `anonymize_user_cascade()` :
    1.  Neutralise définitivement l'identité en base (le nom/email/téléphone sont écrasés par des hachages salés mathématiquement irréversibles).
    2.  Anonymise l'historique d'interactions : les rapports sont conservés pour l'intégrité des statistiques urbaines, mais l'identifiant utilisateur est retiré en cascade.
    3.  Consigne de façon immuable la suppression dans le registre d'audit DPO pour garantir la conformité ultérieure en cas de contrôle réglementaire.
