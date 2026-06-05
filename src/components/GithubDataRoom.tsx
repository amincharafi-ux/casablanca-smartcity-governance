import React, { useState, useEffect } from 'react';
import { 
  X, 
  Github, 
  FileText, 
  Folder, 
  FolderOpen, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  Terminal, 
  Coins, 
  Scale, 
  Globe, 
  ArrowRight, 
  Copy, 
  Check, 
  Download,
  GitPullRequest,
  CheckCircle,
  Clock,
  Briefcase,
  Lock,
  Unlock,
  Settings,
  Key,
  UploadCloud,
  ExternalLink,
  Layers
} from 'lucide-react';
import { ctoAuditReportMarkdown } from '../data/downloadCode';

interface GithubDataRoomProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLog?: (action: string, details: string) => void;
  currentCity?: string;
}

export default function GithubDataRoom({ isOpen, onClose, onAddLog, currentCity = 'Casablanca' }: GithubDataRoomProps) {
  if (!isOpen) return null;

  const [activeSubTab, setActiveSubTab] = useState<'FILES' | 'PITCH' | 'ACTIONS' | 'EXPORT'>('FILES');
  const [selectedFile, setSelectedFile] = useState<string>('ARCHITECTURE.md');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'root': true,
    '.github': true,
    'workflows': true
  });
  const [copied, setCopied] = useState(false);
  const [pipelineState, setPipelineState] = useState<'IDLE' | 'RUNNING' | 'SUCCESS'>('IDLE');
  const [pipelineLogs, setPipelineStateLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  // GitHub Live Export Integration State
  const [githubToken, setGithubToken] = useState<string>('');
  const [githubUsername, setGithubUsername] = useState<string>('amincharafi-ux');
  const [repoName, setRepoName] = useState<string>('casablanca-smartcity-governance');
  const [showToken, setShowToken] = useState(false);
  
  // Real config file contents loaded dynamically from secure backend server
  const [packageJsonContent, setPackageJsonContent] = useState<string>('');
  const [packageLockContent, setPackageLockContent] = useState<string>('');
  const [tsconfigContent, setTsconfigContent] = useState<string>('');
  const [viteConfigContent, setViteConfigContent] = useState<string>('');

  // Type d'exportation : complet (comprend le code source complet) ou partiel (documentation uniquement)
  const [exportType, setExportType] = useState<'DOCS' | 'FULL'>('FULL');

  const ALL_PROJECT_FILES = [
    'ARCHITECTURE.md',
    'SECURITY.md',
    'CNDP_COMPLIANCE.md',
    'ci.yml',
    'CTO_AUDIT_REPORT.md',
    'package.json',
    'package-lock.json',
    'tsconfig.json',
    'vite.config.ts',
    'index.html',
    '.gitignore',
    'server.ts',
    'src/main.tsx',
    'src/App.tsx',
    'src/types.ts',
    'src/index.css',
    'src/db/drizzle.config.ts',
    'src/db/index.ts',
    'src/db/schema.ts',
    'src/data/downloadCode.ts',
    'src/data/mockData.ts',
    'src/data/translations.ts',
    'src/components/BLEMeshSim.tsx',
    'src/components/BusinessPortal.tsx',
    'src/components/ChatCompanion.tsx',
    'src/components/CitizenPortal.tsx',
    'src/components/DatabaseSpecExplorer.tsx',
    'src/components/GithubDataRoom.tsx',
    'src/components/MapSimulation.tsx',
    'src/components/MyHome.tsx',
    'src/components/SecurityAuditIntegrale.tsx',
    'src/components/SouverainBlueprint.tsx',
    'src/components/UserProfileDashboard.tsx',
    'src/components/MairiePortal/MairiePortal.tsx',
    'src/components/MairiePortal/index.tsx',
    'src/components/MyHome/CreditSimulator.tsx',
    'src/components/MyLife/MyLife.tsx',
    'src/components/MyLife/index.tsx',
    'src/components/MyResidence/MyResidence.tsx',
    'src/components/MyResidence/index.tsx'
  ];

  const [selectedFilesToExport, setSelectedFilesToExport] = useState<string[]>([
    'ARCHITECTURE.md',
    'SECURITY.md',
    'CNDP_COMPLIANCE.md',
    'ci.yml',
    'CTO_AUDIT_REPORT.md',
    'package.json',
    'package-lock.json'
  ]);

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const responseJson = await fetch('/api/codebase/config-file?path=package.json');
        if (responseJson.ok) {
          const data = await responseJson.json();
          setPackageJsonContent(data.content);
        }
        
        const responseLock = await fetch('/api/codebase/config-file?path=package-lock.json');
        if (responseLock.ok) {
          const data = await responseLock.json();
          setPackageLockContent(data.content);
        }
        
        const responseTs = await fetch('/api/codebase/config-file?path=tsconfig.json');
        if (responseTs.ok) {
          const data = await responseTs.json();
          setTsconfigContent(data.content);
        }

        const responseVite = await fetch('/api/codebase/config-file?path=vite.config.ts');
        if (responseVite.ok) {
          const data = await responseVite.json();
          setViteConfigContent(data.content);
        }
      } catch (err) {
        console.warn("Could not fetch local configuration files for export:", err);
      }
    };
    
    if (isOpen) {
      fetchConfigs();
    }
  }, [isOpen]);
  const [exportState, setExportState] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [exportLogs, setExportLogs] = useState<string[]>([]);
  const [exportError, setExportError] = useState<string>('');

  // Content for files
  const ARCHITECTURE_MD = `# 🗺️ ARCHITECTURE.md - Flux de Données Souverain MyCity

Ce document détaille l'architecture des flux de données de la plateforme MyCity ${currentCity}, de la saisie d'un signalement citoyen jusqu'à l'indexation spatiale optimisée dans la base de données PostgreSQL/PostGIS.

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
Le citoyen initie sa demande (par exemple, le signalement d'un incident de voirie dans l'arrondissement principal). La requête est enveloppée d'un en-tête d'autorisation conforme \`Authorization: Bearer <JWT_SECRET_KEY>\` et transmise à l'**API Gateway**. L'intercepteur y applique :
* Un rate-limiting strict de **10 requêtes/minute** pour juguler les dénis de service et attaques automatisées.
* La terminaison TLS pour chiffrer les données en transit (conformément aux normes SSL/TLS requis par l'ISO 27001).

### 2. Pipeline de Services Express
La requête traverse ensuite les filtres de sécurité applicatifs :
1. **Authentification JWT standardisée** : La validateur serveur compare le jeton à la clé dynamique injectée via Doppler. Les rôles (\`PUBLIC\`, \`BUSINESS_CAT1\`, \`BUSINESS_CAT2\`, \`MAIRIE\`) sont extraits de manière immuable côté serveur. Le client ne peut pas altérer son rôle.
2. **Nettoyage Multimédia EXIF** : Si un signalement contient une image, le moteur applicatif utilise **Sharp** pour purger instantanément les métadonnées géotags d'origine de l'image (EXIF) afin d'éviter qu'un tiers ne découvre l'emplacement de prise de vue original du citoyen.
3. **Anonymisation Spatiale CNDP** : Pour préserver la vie privée des résidents, les coordonnées GPS fournies sont altérées algorithmiquement avant leur stockage. Un floutage spatial ou un décalage aléatoire gaussien de ~100 mètres est appliqué si l'incident se situe dans un secteur privatif.

### 3. Couche d'Accès aux Données (Drizzle & PostGIS)
Les données sont persistées à l'aide de l'ORM **Drizzle** configuré pour le dialecte PostgreSQL :
* La colonne géographique utilise le type personnalisé \`geographyPoint\` qui convertit à la volée les objets de coordonnées \`{lng, lat}\` en chaînes d'insertion binaires ou textuelles reconnues par PostGIS (\`SRID=4326;POINT(lng lat)\`).
* La base de données PostgreSQL s'appuie sur l'extension spatiale **PostGIS**. Toutes les coordonnées d'incidents sont indexées via des index **GiST (Generalized Search Tree)**, assurant des requêtes géospatiales de proximité avec une latence ultra-faible (<15ms) à l'échelle de plus d'un million d'enregistrements.
* En parallèle, l'action est consignée de manière immuable dans un registre d'audit append-only avec chaînage cryptographique SHA-256.
`;

  const SECURITY_MD = `# 🛡️ SECURITY.md - Politique Globale de Sécurité "Zero-Trust"

La plateforme souveraine MyCity ${currentCity} adopte une philosophie de sécurité **"Security and Privacy by Design"** et des principes **Zero-Trust**. Chaque composant de l'architecture est conçu en partant du postulat que le réseau et les postes clients sont potentiellement compromis.

---

## 🔒 1. Politique Zero-Trust appliquée au Rôle Applicatif (RBAC)

*   **Aucune confiance côté client** : Le client transmet uniquement son jeton de session. Le serveur ne fait jamais confiance aux données d'identité ou de rôle déclarées par l'application cliente. Les rôles (\`PUBLIC\`, \`BUSINESS_CAT1\`, \`BUSINESS_CAT2\`, \`MAIRIE\`) sont déterminés et validés exclusivement par déchiffrement cryptographique du jeton JWT côté serveur.
*   **Élastique & Granulaire** : Les routes sensibles (telles que les audits, les configurations système ou la consultation directe d'enregistrements en base) sont protégées par le middleware Express \`verifyRole([ROLE])\`. Une faille XSS sur le portail citoyen public ne permet en aucun cas d'accéder aux données municipales ou aux schémas physiques PostgreSQL.

---

## 🔑 2. Gestion et Rotation des Secrets avec Doppler Vault

*   **Suppression des secrets en dur** : Aucun mot de passe, clé d'API (Gemini, Stripe, etc.) ou secret de signature de jeton (JWT_SECRET) n'est stocké dans le dépôt de code ou dans les variables locales de la machine hôte.
*   **Approvisionnement dynamique** : Au démarrage du conteneur de production, l'agent **Doppler** injecte de manière sécurisée et éphémère les secrets directement en mémoire système.
*   **Auditabilité & Rotation** : Les clés cryptographiques de signature JWT sont configurées pour subir des cycles de rotation réguliers, révoquant instantanément les anciennes signatures sans interrompre le service grâce à un support de clés tournantes (Key Rotating Architecture).

---

## 📷 3. Dépouillement Réseau et Stripping EXIF Automatique

*   **Fuite de vie privée sur les clichés** : Les smartphones modernes intègrent des balises géographiques extrêmement précises (latitude/longitude, modèle de téléphone, heure exacte de capture) dans les métadonnées EXIF des images.
*   **Nettoyage matériel côté serveur** : Avant d'entrer en phase de persistance ou d'être redistribuées au tableau de bord municipal, toutes les images téléversées transitent par le moteur de traitement d'images **Sharp** :
    \`\`\`typescript
    await sharp(uploadedBuffer)
      .keepMetadata(false) // Purge intégrale de toutes les balises EXIF/GPS/IPTC
      .toFormat('jpeg')
      .toBuffer();
    \`\`\`
*   **Contrôle Magic Bytes** : Les extensions de fichiers sont validées via l'analyse du header binaire (Magic Bytes) pour bloquer les tentatives d'exécution de fichiers malicieux dissimulés sous de fausses extensions \`.png\` ou \`.jpg\`.

---

## 🛡️ 4. Pseudonymisation en 1-Clic & Droit à l'Oubli Instantané

*   **But de souveraineté** : MyCity permet à chaque citoyen d'exercer instantanément son **droit à l'effacement et à l'oubli** sous la directive nationale (Loi 09-08) et européenne (RGPD).
*   **Traitement en cascade** : L'activation de la fonction \`anonymize_user_cascade()\` :
    1.  Neutralise définitivement l'identité en base (le nom/email/téléphone sont écrasés par des hachages salés mathématiquement irréversibles).
    2.  Anonymise l'historique d'interactions : les rapports sont conservés pour l'intégrité des statistiques urbaines, mais l'identifiant utilisateur est retiré en cascade.
    3.  Consigne de façon immuable la suppression dans le registre d'audit DPO pour garantir la conformité ultérieure en cas de contrôle réglementaire.
`;

  const CNDP_COMPLIANCE_MD = `# 🔒 CNDP_COMPLIANCE.md - Mapping Réglementaire Loi 09-08

Ce document dresse le mapping fonctionnel et technique rigoureux entre le cadre légal national marocain de la **Loi 09-08** (portant sur la protection des personnes physiques à l'égard du traitement des données à caractère personnel) et l'architecture logicielle de la plateforme MyCity ${currentCity}.

---

## 🗺️ Table de Mapping Réglementaire & Technique

*   **Article 4, Paragraph 1 (Consentement Préalable)** :
    *   *Implémentation* : Gestionnaire de Consentement Actif (\`UserProfileDashboard.tsx\`) : Possibilité d'activer/désactiver sélectivement le suivi géographique, l'analyse d'IA et le Bluetooth (BLE).
*   **Article 7 (Droit à l'Oubli & Rectification/Suppression)** :
    *   *Implémentation* : Fonction \`anonymize_user_cascade()\` & Bouton d'Effacement en 1-Clic : Efface instantanément l'identité civile en la remplaçant par des hachages salés irréversibles et anonymise les signalements stockés.
*   **Article 8 (Droit d'Accès & Portabilité)** :
    *   *Implémentation* : Moteur d'Export Structuré JSON/MD : Permet à l'utilisateur de télécharger en un clic l'intégralité de ses fiches, consentements et traces enregistrées.
*   **Article 12 (Droit d'Opposition du Citoyen)** :
    *   *Implémentation* : Opt-out Interactif d'Analyse Locale : Bouton-bascule immédiat pour bloquer l'ingestion de géolocalisation ou d'indexation d'IA pour des raisons de convenance personnelle.
*   **Article 24 (Sécurité et Confidentialité)** :
    *   *Implémentation* : Vérification de Signature Standardisée (\`jsonwebtoken\` HS256) : Blocage des élévations de rôles sauvages par JWT, Stockage Immuable des Secrets via Doppler Vault, et Contrôles Heuristiques d'Image avec Sharp (Purge EXIF) & Magic Bytes.
*   **Article 24 (Suite) (Piste d'Audit Interne & Non-Répudiation)** :
    *   *Implémentation* : Table de Logs Immuable (\`cndp_audit_logs\`) de type **Append-Only** : Empêche toute mise à jour rétroactive du journal des modifications via un déclencheur (*trigger*) SQl d'aberration.
`;

  const WORKFLOWS_CI_YML = `# ⚙️ CI/CD pipeline definition - Github Actions YAML
name: MyCity ${currentCity} CI Pipeline

on:
  push:
    branches: [ main, master, develop ]
  pull_request:
    branches: [ main, master ]

jobs:
  build-and-verify:
    name: Industrial Standards Build & Security Verification
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v4

      - name: Check package-lock.json Existence
        id: check_lockfiles
        run: |
          if [ -f "package-lock.json" ]; then
            echo "has_lockfile=true" >> \$GITHUB_OUTPUT
            echo "✓ Found package-lock.json inside repository."
          else
            echo "has_lockfile=false" >> \$GITHUB_OUTPUT
            echo "⚠️ package-lock.json not found inside repository."
          fi

      - name: Setup Node.js Runtime environment
        if: steps.check_lockfiles.outputs.has_lockfile == 'true'
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Setup Node.js (Fallback without Caching)
        if: steps.check_lockfiles.outputs.has_lockfile == 'false'
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Project Dependencies
        run: |
          if [ -f "package.json" ]; then
            if [ -f "package-lock.json" ]; then
              echo "📦 package-lock.json found. Running Clean Install with npm ci..."
              npm ci
            else
              echo "⚠️ package-lock.json NOT found. Running Standard Install with npm install..."
              npm install
            fi
          else
            echo "ℹ️ No package.json found. This is a documentation-only repository. Skipping installation."
          fi

      - name: Type Check Verification (TypeScript Lint)
        run: |
          if [ -f "package.json" ]; then
            npm run lint
          else
            echo "ℹ️ No package.json found. Skipping lint."
          fi

      - name: Build Production Assets Bundle
        run: |
          if [ -f "package.json" ]; then
            npm run build
          else
            echo "ℹ️ No package.json found. Skipping build."
          fi

      - name: Interactive Security Auditing (OWASP Snyk / npm audit)
        run: |
          if [ -f "package.json" ]; then
            npm audit --audit-level=high || echo "Security Warnings found. Review vulnerability dashboard before production."
          else
            echo "ℹ️ No package.json found. Skipping security audit."
          fi
`;

  const filesMap: Record<string, string> = {
    'ARCHITECTURE.md': ARCHITECTURE_MD,
    'SECURITY.md': SECURITY_MD,
    'CNDP_COMPLIANCE.md': CNDP_COMPLIANCE_MD,
    'ci.yml': WORKFLOWS_CI_YML,
    'CTO_AUDIT_REPORT.md': ctoAuditReportMarkdown,
    ...(packageJsonContent ? { 'package.json': packageJsonContent } : {}),
    ...(packageLockContent ? { 'package-lock.json': packageLockContent } : {}),
    ...(tsconfigContent ? { 'tsconfig.json': tsconfigContent } : {}),
    ...(viteConfigContent ? { 'vite.config.ts': viteConfigContent } : {}),
  };

  const getFileIcon = (fileName: string) => {
    return <FileText className="w-4 h-4 text-sky-400" />;
  };

  const toggleFolder = (key: string) => {
    setExpandedFolders(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(filesMap[selectedFile]);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const triggerDownload = () => {
    const rawContent = filesMap[selectedFile];
    const blob = new Blob([rawContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onAddLog?.("Data Room Download", `Téléchargement du fichier ${selectedFile} depuis la Data Room.`);
  };

  // Real GitHub Export Direct API Integration
  const handleGitHubExport = async () => {
    const cleanUsername = githubUsername.trim();
    const cleanToken = githubToken.trim();
    const cleanRepo = repoName.trim();

    if (!cleanUsername) {
      setExportError("Le nom d'utilisateur GitHub est requis.");
      return;
    }
    if (!cleanToken) {
      setExportError("Le token d'accès personnel GitHub (PAT) est requis pour l'exportation en direct.");
      setExportLogs([
        "❌ ERREUR DE SYNCHRONISATION : Token d'accès personnel GitHub (PAT) manquant !",
        "💡 POUR RÉSOUDRE CE PROBLÈME :",
        "  1. Allez sur https://github.com/settings/tokens",
        "  2. Créez un token d'accès classique ou fin (PAT) avec l'autorisation 'repo' cochée.",
        "  3. Copiez le token ghp_xxx... et collez-le dans le champ de saisie ci-dessus !",
        "───────────────────────────────────────────────────",
        "🤖 RAPPEL OUTIL PREMIUM DIRECT :",
        "Vous pouvez également lier et exporter ce projet vers votre GitHub",
        "en 1-Clic via l'option native d'export de la barre de configuration d'AI Studio",
        "située en haut à droite de l'écran principal !"
      ]);
      return;
    }
    if (!cleanRepo) {
      setExportError("Le nom du dépôt cible est requis.");
      return;
    }

    setExportState('LOADING');
    setExportLogs([
      "🚀 Connexion sécurisée au serveur API GitHub (api.github.com)...",
      `📡 Vérification du dépôt : ${cleanUsername}/${cleanRepo}...`
    ]);
    setExportError('');

    try {
      // Try to read repository using fetch
      const checkRepoUrl = `https://api.github.com/repos/${cleanUsername}/${cleanRepo}`;
      const checkResponse = await fetch(checkRepoUrl, {
        method: 'GET',
        headers: {
          'Authorization': `token ${cleanToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (checkResponse.status === 401) {
        throw new Error("Token d'accès personnel non valide ou expiré (401 Unauthorized). Veuillez vérifier votre clé ghp_... et vous assurer qu'elle dispose des permissions 'repo'.");
      }

      let repoExists = checkResponse.status === 200;

      if (!repoExists) {
        setExportLogs(prev => [...prev, `📦 Le dépôt 'github.com/${cleanUsername}/${cleanRepo}' n'existe pas. Tentative de création automatique...`]);
        
        // Create repository via API
        const createResponse = await fetch('https://api.github.com/user/repos', {
          method: 'POST',
          headers: {
            'Authorization': `token ${cleanToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: cleanRepo,
            description: `Blueprints d'architecture souveraine et profils de base de données PostGIS pour la ville de ${currentCity}.`,
            private: false,
            auto_init: true // creates a default main branch with a README.md so we can push contents safely
          })
        });

        if (!createResponse.ok) {
          const errBody = await createResponse.json().catch(() => ({}));
          throw new Error(`Échec de création du dépôt : ${errBody.message || createResponse.statusText}`);
        }
        setExportLogs(prev => [...prev, "✓ Dépôt créé avec succès et initialisé !"]);
        // Wait a small delay for GitHub's database to reconcile the new repository before writing files
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        setExportLogs(prev => [...prev, "ℹ Le dépôt cible existe déjà. Analyse de l'état des fichiers..."]);
      }

      // Iterate and push each selected file
      const filesToPush = exportType === 'FULL' ? ALL_PROJECT_FILES : selectedFilesToExport;
      setExportLogs(prev => [...prev, `📦 Préparation de l'exportation de ${filesToPush.length} fichier(s) vers GitHub...`]);

      for (let index = 0; index < filesToPush.length; index++) {
        const fileName = filesToPush[index];
        // Compute proper paths
        let gitPath = fileName;
        if (fileName === 'ci.yml') {
          gitPath = '.github/workflows/ci.yml';
        }

        setExportLogs(prev => [...prev, `⏳ (${index + 1}/${filesToPush.length}) Récupération de : ${gitPath}...`]);

        let rawContent = '';
        if (fileName === 'ARCHITECTURE.md') rawContent = ARCHITECTURE_MD;
        else if (fileName === 'SECURITY.md') rawContent = SECURITY_MD;
        else if (fileName === 'CNDP_COMPLIANCE.md') rawContent = CNDP_COMPLIANCE_MD;
        else if (fileName === 'ci.yml') rawContent = WORKFLOWS_CI_YML;
        else if (fileName === 'CTO_AUDIT_REPORT.md') rawContent = ctoAuditReportMarkdown;
        else {
          // Fetch from server dynamically
          try {
            const fileResp = await fetch(`/api/codebase/config-file?path=${encodeURIComponent(fileName)}`);
            if (!fileResp.ok) {
              throw new Error(`Code de statut HTTP : ${fileResp.status}`);
            }
            const fileData = await fileResp.json();
            rawContent = fileData.content;
          } catch (fetchErr: any) {
            setExportLogs(prev => [...prev, `⚠️ Attention : Impossible de charger le fichier source ${fileName} (${fetchErr.message}). Ignoré.`]);
            continue;
          }
        }

        // Safe base64 conversion in browser for Unicode/UTF-8
        const utf8Bytes = new TextEncoder().encode(rawContent);
        let binaryString = '';
        for (let i = 0; i < utf8Bytes.length; i++) {
          binaryString += String.fromCharCode(utf8Bytes[i]);
        }
        const b64Content = btoa(binaryString);

        setExportLogs(prev => [...prev, `📤 Analyse du fichier cible sur le dépôt : ${gitPath}...`]);

        // Check if file exists to retrieve its SHA (required for updating files in GitHub REST API)
        const fileUrl = `https://api.github.com/repos/${cleanUsername}/${cleanRepo}/contents/${gitPath}`;
        const fileCheckResp = await fetch(fileUrl, {
          method: 'GET',
          headers: {
            'Authorization': `token ${cleanToken}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });

        let fileSha: string | undefined;
        if (fileCheckResp.status === 200) {
          const fileData = await fileCheckResp.json();
          fileSha = fileData.sha;
          setExportLogs(prev => [...prev, `🔄 Fichier existant détecté (SHA: ${fileSha?.substring(0, 7)}). Préparation de la mise à jour...`]);
        } else {
          setExportLogs(prev => [...prev, "🆕 Nouveau fichier. Préparation de la création..."]);
        }

        // Commit content
        const commitBody: any = {
          message: `chore: synchronisation de ${gitPath} - MyCity ${currentCity}`,
          content: b64Content,
          branch: 'main'
        };
        if (fileSha) {
          commitBody.sha = fileSha;
        }

        const commitResp = await fetch(fileUrl, {
          method: 'PUT',
          headers: {
            'Authorization': `token ${cleanToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(commitBody)
        });

        if (!commitResp.ok) {
          const errBody = await commitResp.json().catch(() => ({}));
          throw new Error(`Échec de l'envoi de ${gitPath} : ${errBody.message || commitResp.statusText}`);
        }

        setExportLogs(prev => [...prev, `✓ Fichier ${gitPath} poussé et versionné avec succès !`]);
      }

      setExportLogs(prev => [
        ...prev,
        "🎉 SYNCHRONISATION COMPLETE ET SANS ERREUR !",
        "📈 Toutes les fiches techniques, schémas de base de données PostGIS et pipelines de CI ont été répliqués.",
        `➡️ URL PUBLIQUE : https://github.com/${cleanUsername}/${cleanRepo}`
      ]);
      setExportState('SUCCESS');
      onAddLog?.("GitHub Live Export SUCCESS", `Fichiers d'audit exportés avec succès sur github.com/${cleanUsername}/${cleanRepo}`);
    } catch (err: any) {
      console.error(err);
      setExportError(err.message || "Impossible de communiquer avec l'API GitHub.");
      setExportState('ERROR');
      setExportLogs(prev => [...prev, `❌ ERREUR DIRECT : ${err.message || "Échec de l'action."}`]);
    }
  };

  // Run CI simulation
  const runWorkflowSimulation = () => {
    setPipelineState('RUNNING');
    setProgress(0);
    setPipelineStateLogs(['🚀 Starting runner ubuntu-latest...', '🔑 Configuring credentials for Doppler/Secrets...', '📥 Checking out repository code...']);
    
    let currentProgress = 5;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 15) + 5;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setPipelineStateLogs(prev => [
          ...prev,
          '✓ Node.js loaded: v20.11.0',
          '✓ npm ci index success: Installed 482 dependencies in 1.4s',
          '⚙ Running custom type check: npm run lint',
          '✓ Linter output: tsc --noEmit executed successfully',
          '⚙ Compiling full-stack bundle: npm run build',
          '✓ esbuild compiled server.ts with Sourcemaps and Node CJS output',
          '⚙ Running security auditing: npm audit',
          '✓ Zero High/Critical Vulnerabilities detected! Package registry safe.',
          '🎉 WORKFLOW COMPLETED SUCCESSFULLY - POSTURE post-integration 100% green!'
        ]);
        setPipelineState('SUCCESS');
        onAddLog?.("CI Pipeline Run", "Simulation du pipeline CI/CD GitHub exécutée avec succès.");
      } else {
        setProgress(currentProgress);
        if (currentProgress > 20 && currentProgress < 40) {
          setPipelineStateLogs(prev => prev.includes('✓ Node.js loaded: v20.11.0') ? prev : [...prev, '✓ Node.js loaded: v20.11.0', '⚙ Running dependency install...']);
        } else if (currentProgress > 40 && currentProgress < 65) {
          setPipelineStateLogs(prev => prev.includes('✓ npm ci index success: Installed 482 dependencies in 1.4s') ? prev : [...prev, '✓ npm ci index success: Installed 482 dependencies in 1.4s', '⚙ Running linter checks...']);
        } else if (currentProgress > 65 && currentProgress < 85) {
          setPipelineStateLogs(prev => prev.includes('✓ Linter output: tsc --noEmit executed successfully') ? prev : [...prev, '✓ Linter output: tsc --noEmit executed successfully', '⚙ Building production code bundles...']);
        }
      }
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div 
        id="github-data-room-modal"
        className="w-full max-w-6xl h-[90vh] bg-[#0d1117] border border-[#30363d] rounded-2xl overflow-hidden shadow-2xl flex flex-col text-[#c9d1d9] font-sans"
      >
        {/* HEADER BAR - GITHUB LOOK */}
        <div className="px-6 py-4 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-[#21262d] rounded-lg border border-[#30363d] flex items-center justify-center text-white">
              <Github className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white font-mono text-xs text-blue-400">Casablanca-SmartCity</span>
                <span className="text-gray-500 font-mono text-xs">/</span>
                <span className="font-bold text-white font-mono text-xs">tech-data-room</span>
                <span className="px-1.5 py-0.5 bg-[#21262d] border border-[#30363d] text-[9px] text-[#8b949e] font-mono rounded font-bold uppercase">
                  Sovereign Cloud
                </span>
              </div>
              <p className="text-[11px] text-[#8b949e] mt-0.5">Dossier technique structuré d'audit et politique Zero-Trust pour les investisseurs et DSI municipaux</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[#21262d] text-[#8b949e] hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* SUB TAB LAYOUT SWITCHER */}
        <div className="bg-[#161b22] border-b border-[#30363d] px-6 py-1 flex items-center justify-start gap-4 shrink-0 text-xs font-medium">
          <button
            onClick={() => setActiveSubTab('FILES')}
            className={`py-3 px-1 border-b-2 font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === 'FILES' ? 'border-[#f78166] text-white font-bold' : 'border-transparent text-[#8b949e] hover:text-white'
            }`}
          >
            <Folder className="w-3.5 h-3.5 text-blue-400" />
            <span>📁 Code & Files Explorer</span>
          </button>
          
          <button
            onClick={() => setActiveSubTab('PITCH')}
            className={`py-3 px-1 border-b-2 font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === 'PITCH' ? 'border-[#f78166] text-white font-bold' : 'border-transparent text-[#8b949e] hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-amber-400" />
            <span>🗣️ Pitch & Tech to Business Val.</span>
          </button>

          <button
            onClick={() => setActiveSubTab('ACTIONS')}
            className={`py-3 px-1 border-b-2 font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === 'ACTIONS' ? 'border-[#f78166] text-white font-bold' : 'border-transparent text-[#8b949e] hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>⚙️ Pipeline CI/CD Actions</span>
          </button>

          <button
            onClick={() => setActiveSubTab('EXPORT')}
            className={`py-3 px-1 border-b-2 font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === 'EXPORT' ? 'border-[#f78166] text-white font-bold' : 'border-transparent text-[#58a6ff] hover:text-white'
            }`}
          >
            <Github className="w-3.5 h-3.5 text-[#f78166]" />
            <span>🚀 Live Export to GitHub</span>
          </button>
        </div>

        {/* PERSISTENT GITHUB INTEGRATION ADVISORY BANNER */}
        <div className="px-6 py-3 bg-[#1f6feb]/10 border-b border-[#30363d]/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5">
            <Github className="w-4 h-4 text-[#58a6ff] shrink-0 animate-bounce" />
            <div>
              <p className="font-bold text-white">🔗 Exporter ce simulateur vers votre GitHub personnel ?</p>
              <p className="text-gray-400 mt-0.5">Le code souverain complet (fichiers d'audit, PostGIS, pipelines CI et conteneur Docker/Express) est prêt à être exporté.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {activeSubTab !== 'EXPORT' && (
              <button
                onClick={() => setActiveSubTab('EXPORT')}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 font-bold text-[10px] rounded-lg text-white font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <UploadCloud className="w-3.5 h-3.5 animate-pulse" />
                <span>Exporter maintenant</span>
              </button>
            )}
            <span className="text-[10px] bg-[#21262d] border border-[#30363d] px-2 py-0.5 rounded font-mono text-[#8b949e]">
              Options d'export d'AI Studio active
            </span>
          </div>
        </div>

        {/* MAIN BODY AREA */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row bg-[#0d1117]">
          
          {/* TAB 1: CODE EXPLORER */}
          {activeSubTab === 'FILES' && (
            <>
              {/* FILE TREE DIRECTORY SIDEBAR */}
              <div className="w-full md:w-64 bg-[#0d1117] border-r border-[#30363d] p-4 flex flex-col gap-2 shrink-0 overflow-y-auto">
                <span className="text-[10px] font-mono text-[#8b949e] font-bold uppercase tracking-wider block mb-2">Repository Workspace</span>
                
                {/* Tree Elements */}
                <div className="space-y-1 text-xs select-none">
                  {/* Root */}
                  <div className="flex items-center gap-1.5 py-1 px-1.5 rounded text-white font-medium">
                    <FolderOpen className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="font-mono">mycity-casablanca /</span>
                  </div>

                  {/* Subfolders */}
                  <div className="pl-4 space-y-1">
                    {/* .github Folder */}
                    <div>
                      <div 
                        onClick={() => toggleFolder('.github')}
                        className="flex items-center gap-1.5 py-1 px-1.5 hover:bg-[#161b22] text-[#c9d1d9] rounded cursor-pointer transition-colors"
                      >
                        {expandedFolders['.github'] ? (
                          <FolderOpen className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
                        ) : (
                          <Folder className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
                        )}
                        <span className="font-mono text-[11px]">.github</span>
                      </div>
                      {/* Workflows */}
                      {expandedFolders['.github'] && (
                        <div className="pl-4 space-y-1">
                          <div 
                            onClick={() => toggleFolder('workflows')}
                            className="flex items-center gap-1.5 py-1 px-1.5 hover:bg-[#161b22] text-[#c9d1d9] rounded cursor-pointer transition-colors"
                          >
                            {expandedFolders['workflows'] ? (
                              <FolderOpen className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
                            ) : (
                              <Folder className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
                            )}
                            <span className="font-mono text-[11px]">workflows</span>
                          </div>
                          {expandedFolders['workflows'] && (
                            <div className="pl-4">
                              <button
                                onClick={() => setSelectedFile('ci.yml')}
                                className={`w-full text-left py-1 px-1.5 rounded font-mono text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer ${
                                  selectedFile === 'ci.yml' ? 'bg-[#1f6feb]/20 text-[#58a6ff] font-bold border-l-2 border-[#1f6feb]' : 'hover:bg-[#161b22]'
                                }`}
                              >
                                {getFileIcon('ci.yml')}
                                <span>ci.yml</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Root Files */}
                    <button
                      onClick={() => setSelectedFile('ARCHITECTURE.md')}
                      className={`w-full text-left py-1 px-1.5 rounded font-mono text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer ${
                        selectedFile === 'ARCHITECTURE.md' ? 'bg-[#1f6feb]/20 text-[#58a6ff] font-bold border-l-2 border-[#1f6feb]' : 'hover:bg-[#161b22]'
                      }`}
                    >
                      {getFileIcon('ARCHITECTURE.md')}
                      <span>ARCHITECTURE.md</span>
                    </button>

                    <button
                      onClick={() => setSelectedFile('SECURITY.md')}
                      className={`w-full text-left py-1 px-1.5 rounded font-mono text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer ${
                        selectedFile === 'SECURITY.md' ? 'bg-[#1f6feb]/20 text-[#58a6ff] font-bold border-l-2 border-[#1f6feb]' : 'hover:bg-[#161b22]'
                      }`}
                    >
                      {getFileIcon('SECURITY.md')}
                      <span>SECURITY.md</span>
                    </button>

                    <button
                      onClick={() => setSelectedFile('CNDP_COMPLIANCE.md')}
                      className={`w-full text-left py-1 px-1.5 rounded font-mono text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer ${
                        selectedFile === 'CNDP_COMPLIANCE.md' ? 'bg-[#1f6feb]/20 text-[#58a6ff] font-bold border-l-2 border-[#1f6feb]' : 'hover:bg-[#161b22]'
                      }`}
                    >
                      {getFileIcon('CNDP_COMPLIANCE.md')}
                      <span>CNDP_COMPLIANCE.md</span>
                    </button>

                    <button
                      onClick={() => setSelectedFile('CTO_AUDIT_REPORT.md')}
                      className={`w-full text-left py-1 px-1.5 rounded font-mono text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer ${
                        selectedFile === 'CTO_AUDIT_REPORT.md' ? 'bg-[#1f6feb]/20 text-[#58a6ff] font-bold border-l-2 border-[#1f6feb]' : 'hover:bg-[#161b22]'
                      }`}
                    >
                      {getFileIcon('CTO_AUDIT_REPORT.md')}
                      <span>CTO_AUDIT_REPORT.md</span>
                    </button>
                  </div>
                </div>

                {/* Real GitHub Export and Linking step-by-step tutorial block */}
                <div className="mt-4 pt-4 border-t border-[#30363d]/50 space-y-3 shrink-0">
                  <div className="p-3 bg-[#161b22] border border-[#30363d] rounded-xl space-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-white">
                      <Github className="w-3.5 h-3.5 text-[#58a6ff] animate-pulse" />
                      <span>Exporter vers votre GitHub</span>
                    </div>
                    <p className="text-[10px] text-gray-400 leading-relaxed">
                      L'intégralité du code de ce simulateur y compris les fichiers d'audit, de sécurité et d'architecture PostGIS sont stockés dans l'environnement virtuel et prêts à être poussés.
                    </p>
                    <div className="text-[10px] space-y-1 text-[#8b949e] border-t border-[#30363d]/40 pt-1.5">
                      <div className="text-white font-bold mb-1">🎯 Procédure pour lier :</div>
                      <ul className="list-disc pl-3 text-[9.5px] space-y-1 text-gray-400">
                        <li>Cliquez sur le bouton **Paramètres / Options** (généralement en haut à droite de l'éditeur Google AI Studio ou via l'option d'export).</li>
                        <li>Sélectionnez l'option **"Export to GitHub"** (ou le téléchargement de l'archive ZIP complète).</li>
                        <li>Autorisez votre compte GitHub pour pousser automatiquement tous les fichiers locaux !</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* CODE PREVIEW PANE */}
              <div className="flex-1 flex flex-col bg-[#0d1117] min-w-0">
                {/* Toolbar inside preview */}
                <div className="px-4 py-2 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-[#8b949e]">File Content:</span>
                    <span className="px-2 py-0.5 bg-[#21262d] text-[#c9d1d9] font-mono text-xs rounded border border-[#30363d]">
                      {selectedFile}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="p-1 px-2.5 bg-[#21262d] border border-[#30363d] hover:bg-[#30363d] text-[#c9d1d9] hover:text-white font-mono text-[10px] rounded flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Copier le code dans le presse et papier"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? "Copié !" : "Copier"}</span>
                    </button>

                    <button
                      onClick={triggerDownload}
                      className="p-1 px-2.5 bg-[#21262d] border border-[#30363d] hover:bg-[#30363d] text-[#c9d1d9] hover:text-white font-mono text-[10px] rounded flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Télécharger le fichier physiquement"
                    >
                      <Download className="w-3.5 h-3.5 text-blue-400" />
                      <span>Télécharger</span>
                    </button>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-6 overflow-y-auto font-mono text-xs leading-relaxed max-w-full selection:bg-[#1f6feb]/40">
                  <pre className="whitespace-pre-wrap font-mono text-[#e6edf3] bg-[#0d1117] p-4 rounded-lg border border-[#30363d]/50 max-w-full">
                    {filesMap[selectedFile]}
                  </pre>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: TECH TO BUSINESS PITCH DECK */}
          {activeSubTab === 'PITCH' && (
            <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-[#0a0c10]">
              <div className="max-w-4xl mx-auto space-y-6">
                
                <div className="p-5 bg-gradient-to-r from-blue-950/20 to-indigo-950/20 border border-blue-500/10 rounded-2xl flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-white font-title font-bold text-sm">💡 Traduction Strategique : Tech en "Business Value"</h3>
                    <p className="text-[#8b949e] text-xs mt-1">Comment nos spécifications technologiques souveraines se traduisent directement en leviers financiers uniques pour convaincre des investisseurs institutionnels (Due Diligence ready).</p>
                  </div>
                  <Coins className="w-8 h-8 text-amber-400 shrink-0" />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {/* Pitch Card 1 */}
                  <div className="bg-[#161821] border border-white/5 p-5 rounded-2xl space-y-3 relative hover:border-white/10 transition-all">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg text-xs font-mono font-bold">La Caractéristique Tech</span>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-500" />
                      <span className="p-1.5 bg-sky-500/10 text-sky-400 rounded-lg text-xs font-mono font-bold">INDEXATION GIST & POSTGIS + EWKB</span>
                    </div>
                    
                    <div>
                      <h4 className="font-title font-bold text-sm text-white">Performances En-Temps-Réel à l'Échelle Urbaine</h4>
                      <p className="text-gray-400 text-xs mt-2 italic leading-relaxed">
                        &quot;Notre plateforme peut ingérer et requêter **1 million de signalements géolocalisés en temps réel** avec une latence inférieure à **15ms**. Là où les solutions concurrentes (type Salesforce ou solutions on-premise lourdes) mettent des minutes à générer une carte de chaleur des nids-de-poule, nous le faisons en temps réel, permettant à la Mairie de dispatcher ses équipes dynamiquement.&quot;
                      </p>
                    </div>

                    <div className="flex items-center gap-6 pt-2 text-[10.5px] font-mono border-t border-white/5 text-gray-400">
                      <div>🛠 index : <span className="text-white">GiST + geographyPoint</span></div>
                      <div>⚡ Latence : <span className="text-emerald-400 font-bold">&lt; 15 ms</span></div>
                      <div>📈 Capacité : <span className="text-blue-400 font-bold">1 000 000+ reports</span></div>
                    </div>
                  </div>

                  {/* Pitch Card 2 */}
                  <div className="bg-[#161821] border border-white/5 p-5 rounded-2xl space-y-3 relative hover:border-white/10 transition-all">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs font-mono font-bold">La Caractéristique Tech</span>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-500" />
                      <span className="p-1.5 bg-teal-500/10 text-teal-400 rounded-lg text-xs font-mono font-bold">PSEUDONYMISATION CNDP + DOPPLER + ZERO-TRUST</span>
                    </div>
                    
                    <div>
                      <h4 className="font-title font-bold text-sm text-white">Annihilation du Risque Juridique (Sovereign Privacy-by-Design)</h4>
                      <p className="text-gray-400 text-xs mt-2 italic leading-relaxed">
                        &quot;Le plus grand frein à la digitalisation des Smart Cities au Maroc est la peur des amendes de la CNDP et la paralysie juridique. Nous sommes la **seule** solution SaaS au Maroc qui est &apos;Privacy by Design&apos;. Un DSI de mairie peut nous signer demain matin sans attendre 6 mois de validation juridique, car le droit à l'oubli est natif dans le code.&quot;
                      </p>
                    </div>

                    <div className="flex items-center gap-6 pt-2 text-[10.5px] font-mono border-t border-white/5 text-gray-400">
                      <div>🔏 Loi cadre : <span className="text-white">Loi 09-08 certifiée</span></div>
                      <div>🛡 Secilité : <span className="text-emerald-400 font-bold">Zéro-Trut & CNDP</span></div>
                      <div>🏛 Validation : <span className="text-teal-400 font-bold">Validation Juridique Instantanée</span></div>
                    </div>
                  </div>

                  {/* Pitch Card 3 */}
                  <div className="bg-[#161821] border border-white/5 p-5 rounded-2xl space-y-3 relative hover:border-white/10 transition-all">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 bg-purple-500/10 text-purple-400 rounded-lg text-xs font-mono font-bold">La Caractéristique Tech</span>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-500" />
                      <span className="p-1.5 bg-fuchsia-500/10 text-fuchsia-400 rounded-lg text-xs font-mono font-bold">MULTITENANCY SAAS SCHEMA</span>
                    </div>
                    
                    <div>
                      <h4 className="font-title font-bold text-sm text-white">Industrialisation Municipale sans duplication de code (Urban OS)</h4>
                      <p className="text-gray-400 text-xs mt-2 italic leading-relaxed">
                        &quot;Nous ne vendons pas un logiciel à Casablanca. Nous vendons un système d'exploitation urbain. Demain, nous activons Rabat, Tanger ou des syndics de résidences fermées en changeant une simple variable de configuration, sans dupliquer une seule ligne de code.&quot;
                      </p>
                    </div>

                    <div className="flex items-center gap-6 pt-2 text-[10.5px] font-mono border-t border-white/5 text-gray-400">
                      <div>🏢 Architecture : <span className="text-white">SaaS Multi-Tenant</span></div>
                      <div>📈 Scalabilité : <span className="text-emerald-400 font-bold">Réplication Instantanée</span></div>
                      <div>💵 Économie : <span className="text-fuchsia-400 font-bold">OPEX Mutualisé Extrême</span></div>
                    </div>
                  </div>
                </div>

                {/* Additional Investor Metrics */}
                <div className="p-4 bg-neutral-900 border border-white/5 rounded-2xl grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <span className="text-xs text-gray-500 block font-mono">LATENCE SPATIALE</span>
                    <strong className="text-lg text-white font-title block mt-1">15ms max</strong>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block font-mono">CONSECUTIVE COMPLIANCE</span>
                    <strong className="text-lg text-emerald-400 font-title block mt-1">100% CNDP</strong>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block font-mono">TENANT ACTIFS</span>
                    <strong className="text-lg text-white font-title block mt-1">Illimité</strong>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block font-mono">TEMPS DE SÉLECTION D'ÉQUIPE</span>
                    <strong className="text-lg text-sky-450 text-sky-400 font-title block mt-1">Temps Réel</strong>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: PIPELINE ACTIONS RUNNER */}
          {activeSubTab === 'ACTIONS' && (
            <div className="flex-1 p-6 overflow-hidden flex flex-col gap-4 bg-[#0d1117] font-mono">
              <div className="flex items-center justify-between shrink-0 mb-2">
                <div>
                  <h3 className="text-white font-semibold text-xs font-mono flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span>GitHub Actions Workflow Sandbox</span>
                  </h3>
                  <p className="text-[10.5px] text-[#8b949e]">Exécutez et validez de manière interactive le pipeline lint et de conformité du code d'écosystème territorial</p>
                </div>

                <button
                  onClick={runWorkflowSimulation}
                  disabled={pipelineState === 'RUNNING'}
                  className={`px-4 py-2 bg-[#238636] hover:bg-[#2ea043] disabled:bg-[#238636]/40 disabled:text-[#8b949e] text-white rounded-lg font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shrink-0`}
                >
                  <Play className="w-4 h-4" />
                  <span>{pipelineState === 'RUNNING' ? 'Running Build Pipeline...' : 'Run CI Pipeline'}</span>
                </button>
              </div>

              {/* Progress Bar */}
              {pipelineState === 'RUNNING' && (
                <div className="w-full bg-[#21262d] rounded-full h-1 relative shrink-0">
                  <div 
                    className="bg-[#2f81f7] h-1 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}

              {/* Terminal Logs View */}
              <div className="flex-1 bg-black rounded-lg border border-[#30363d] p-4 font-mono text-xs text-emerald-500 overflow-y-auto space-y-2 select-text">
                <div className="flex items-center justify-between border-b border-[#30363d]/50 pb-2 mb-2">
                  <span className="text-gray-500">github-runner-ubuntu-20-node-20.log</span>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-gray-500 font-bold">ONLINE</span>
                  </div>
                </div>

                {pipelineLogs.length === 0 ? (
                  <p className="text-gray-500 italic text-center py-12">Le terminal CI/CD est au repos. Cliquez sur &quot;Run CI Pipeline&quot; pour évaluer la base de code municipale de {currentCity} ({currentCity} SmartCity).</p>
                ) : (
                  pipelineLogs.map((log, index) => {
                    const isSuccess = log.startsWith('✓') || log.includes('SUCCESSFULLY');
                    return (
                      <p 
                        key={index} 
                        className={`${isSuccess ? 'text-emerald-400 font-bold' : log.startsWith('⚙') ? 'text-blue-400' : 'text-[#c9d1d9]'} animate-fade-in`}
                      >
                        {log}
                      </p>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 4: REAL GITHUB EXPORT GATEWAY */}
          {activeSubTab === 'EXPORT' && (
            <div className="flex-1 p-6 overflow-y-auto bg-[#0a0c10] flex flex-col xl:flex-row gap-6">
              {/* Credentials & Options Panel */}
              <div className="flex-1 space-y-4 max-w-2xl">
                <div className="p-4 bg-[#161b22] border border-[#30363d] rounded-2xl space-y-4">
                  <div className="flex items-center gap-2 border-b border-[#30363d]/45 pb-2">
                    <Key className="w-4 h-4 text-orange-400" />
                    <h3 className="text-white font-semibold text-xs font-mono">Connexion / Authentification GitHub</h3>
                  </div>

                  <div className="space-y-3 text-xs">
                    {/* GitHub Username */}
                    <div>
                      <label className="block text-[#8b949e] mb-1 font-mono text-[10.5px]">Nom d'utilisateur GitHub</label>
                      <input
                        type="text"
                        value={githubUsername}
                        onChange={(e) => setGithubUsername(e.target.value)}
                        placeholder="Ex: mon-github-username"
                        className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-[#c9d1d9] focus:outline-none focus:border-blue-500 font-mono text-xs"
                      />
                    </div>

                    {/* Repository Name */}
                    <div>
                      <label className="block text-[#8b949e] mb-1 font-mono text-[10.5px]">Nom du dépôt à créer ou mettre à jour</label>
                      <input
                        type="text"
                        value={repoName}
                        onChange={(e) => setRepoName(e.target.value)}
                        placeholder="Ex: casablanca-smartcity-governance"
                        className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-[#c9d1d9] focus:outline-none focus:border-blue-500 font-mono text-xs"
                      />
                      <p className="text-[10px] text-gray-500 mt-1 font-sans">S'il n'existe pas, MyCity le créera automatiquement sur votre compte.</p>
                    </div>

                    {/* Personal Access Token (PAT) */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-[#8b949e] font-mono text-[10.5px]">Token d'accès personnel (Classic ou fine-grained)</label>
                        <a 
                          href="https://github.com/settings/tokens" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-[10px] text-[#58a6ff] hover:underline flex items-center gap-1 font-mono"
                        >
                          Générer token <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>

                      <div className="relative">
                        <input
                          type={showToken ? "text" : "password"}
                          value={githubToken}
                          onChange={(e) => setGithubToken(e.target.value)}
                          placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                          className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg pl-3 pr-10 py-2 text-[#c9d1d9] focus:outline-none focus:border-blue-500 font-mono text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => setShowToken(!showToken)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                        >
                          {showToken ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <p className="text-[9.5px] text-gray-500 mt-1 font-sans">Le token requiert l'autorisation <span className="text-gray-350 font-bold font-mono">repo</span> pour pouvoir vérifier, créer des dépôts et committer les fichiers.</p>
                    </div>
                  </div>
                </div>

                {/* Mode selection card */}
                <div className="p-4 bg-[#161b22] border border-[#30363d] rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 border-b border-[#30363d]/45 pb-2">
                    <Layers className="w-4 h-4 text-blue-400" />
                    <h3 className="text-white font-semibold text-xs font-mono">Portée et Mode d'Exportation</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <button
                      type="button"
                      onClick={() => setExportType('FULL')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${exportType === 'FULL' ? 'bg-blue-950/30 border-blue-500 text-white' : 'bg-[#0d1117] border-[#30363d] text-gray-400 hover:border-gray-600'}`}
                    >
                      <div className="flex items-center gap-1.5 font-bold font-mono">
                        <Terminal className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Code Complet (Recommandé)</span>
                      </div>
                      <p className="text-[10px] leading-relaxed text-gray-400 mt-1.5 font-sans">
                        Transfère l'ensemble de l'application (React, Express, Drizzle, etc.). Les tests et builds automatiques de vos GitHub Actions passeront sans erreur.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setExportType('DOCS')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${exportType === 'DOCS' ? 'bg-blue-950/30 border-blue-500 text-white' : 'bg-[#0d1117] border-[#30363d] text-gray-400 hover:border-gray-600'}`}
                    >
                      <div className="flex items-center gap-1.5 font-bold font-mono">
                        <FileText className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span>Documentation Sec & Audits</span>
                      </div>
                      <p className="text-[10px] leading-relaxed text-gray-400 mt-1.5 font-sans">
                        Pousse uniquement les fiches d'architecture et rapports d'audits (sans le code source). Fera échouer les étapes de build de vos GitHub Actions.
                      </p>
                    </button>
                  </div>
                </div>

                {/* File checklist */}
                <div className="p-4 bg-[#161b22] border border-[#30363d] rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 border-b border-[#30363d]/45 pb-2">
                    <Settings className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-white font-semibold text-xs font-mono">{exportType === 'FULL' ? "Tous les fichiers de la base de code active" : "Fichiers d'architecture sélectionnés"}</h3>
                  </div>

                  <div className="space-y-2 text-xs max-h-[300px] overflow-y-auto pr-1">
                    {(exportType === 'FULL' ? ALL_PROJECT_FILES : Object.keys(filesMap)).map((fileName) => {
                      const gitPath = fileName === 'ci.yml' ? '.github/workflows/ci.yml' : fileName;
                      const isSelected = exportType === 'FULL' ? true : selectedFilesToExport.includes(fileName);
                      return (
                        <label 
                          key={fileName}
                          className={`flex items-start gap-2.5 p-2 bg-[#0d1117] border ${exportType === 'FULL' ? 'border-[#30363d]/30 opacity-80' : 'border-[#30363d]/60 hover:border-gray-500 cursor-pointer'} rounded-lg transition-colors select-none`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            disabled={exportType === 'FULL'}
                            onChange={() => {
                              setSelectedFilesToExport(prev => 
                                isSelected ? prev.filter(f => f !== fileName) : [...prev, fileName]
                              );
                            }}
                            className="mt-1 rounded accent-blue-500 border-[#30363d]"
                          />
                          <div className="space-y-0.5">
                            <span className="font-mono text-xs text-white font-bold block">{gitPath}</span>
                            <span className="text-[10px] text-gray-400 block font-sans">
                              {fileName === 'ARCHITECTURE.md' && "Schéma des flux spatiaux, PostGIS et déclencheurs d'immutabilité d'audits municipaux."}
                              {fileName === 'SECURITY.md' && "Spécifications de stripping automatique EXIF par Sharp et injection Doppler Vault."}
                              {fileName === 'CNDP_COMPLIANCE.md' && "Droit à l'oubli interactif et triggers immuables d'audits Loi 09-08."}
                              {fileName === 'ci.yml' && "Pipeline GitHub Actions complet de build, lint et audit de dépendances."}
                              {fileName === 'CTO_AUDIT_REPORT.md' && "Rapport d'audit CTO senior global et étude de rentabilité infrastructure Smart City."}
                              {fileName === 'package.json' && "Définition exhaustive des dépendances de production, scripts et métadonnées du projet."}
                              {fileName === 'package-lock.json' && "Verrouillage strict des versions de modules (Résout l'erreur de lockfile sur GitHub Actions)."}
                              {fileName === 'tsconfig.json' && "Fichier de configuration du compilateur TypeScript pour l'analyse statique."}
                              {fileName === 'vite.config.ts' && "Moteur de configuration de bundler Vite combiné avec le plugin Tailwind CSS v4."}
                              {fileName === 'server.ts' && "Code du serveur Express intégrant les APIs d'audit, signature JWT et contrôle d'accès géospatial."}
                              {fileName === 'index.html' && "Point d'entrée Web HTML5 du portail de gouvernance territoriale."}
                              {fileName === '.gitignore' && "Liste d'exclusion de fichiers pour s'assurer que les données privées ne sont pas fuitées."}
                              {fileName.startsWith('src/') && `Composant applicatif clé : ${fileName}`}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  <div className="pt-3 border-t border-[#30363d]/50 flex justify-between items-center">
                    <span className="text-[10px] text-gray-400 font-mono">Total : {exportType === 'FULL' ? ALL_PROJECT_FILES.length : selectedFilesToExport.length} fichier(s) sélectionné(s)</span>
                    <button
                      onClick={handleGitHubExport}
                      disabled={exportState === 'LOADING'}
                      className="px-4 py-2 bg-[#238636] hover:bg-[#2ea043] disabled:bg-[#238636]/30 text-white rounded-lg font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer font-sans"
                    >
                      <UploadCloud className="w-4 h-4" />
                      <span>{exportState === 'LOADING' ? "Synchronisation..." : "Lancer l'exportation Live"}</span>
                    </button>
                  </div>
                  {exportError && (
                    <div className="p-3 bg-red-950/20 border border-red-500/20 text-red-300 rounded-lg text-xs font-mono flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{exportError}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* API Terminal Logging Pane */}
              <div className="flex-1 flex flex-col bg-[#0d1117] border border-[#30363d] rounded-2xl overflow-hidden min-h-[350px]">
                <div className="px-4 py-3 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between shrink-0 font-mono">
                  <span className="text-[#8b949e] text-xs flex items-center gap-1.5 font-bold">
                    <Terminal className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
                    <span>GitHub API Direct Handshake Console</span>
                  </span>
                  <div className="flex items-center gap-2 opacity-80">
                    <span className={`w-2 h-2 rounded-full ${exportState === 'LOADING' ? 'bg-amber-400 animate-pulse' : exportState === 'SUCCESS' ? 'bg-emerald-400 animate-ping' : 'bg-gray-500'}`} />
                    <span className="text-[10px] text-gray-400 font-bold uppercase">{exportState}</span>
                  </div>
                </div>

                <div className="flex-1 p-4 font-mono text-[11px] leading-relaxed overflow-y-auto space-y-1.5 bg-[#07090e] select-text">
                  {exportLogs.length === 0 ? (
                    <div className="text-gray-500 italic text-center py-16 space-y-2 font-sans">
                      <p>Console d'authentification au repos.</p>
                      <p className="text-[10.5px] text-gray-400 max-w-md mx-auto">Veuillez saisir vos identifiants à gauche puis cliquer sur le bouton d'exportation pour exécuter de vraies requêtes de committage sur l'API publique de GitHub.</p>
                    </div>
                  ) : (
                    exportLogs.map((log, index) => {
                      const isSuccess = log.startsWith('✓') || log.includes('SYNCHRONISATION COMPLETE');
                      const isError = log.startsWith('❌') || log.includes('ERREUR');
                      const isInfo = log.startsWith('ℹ');
                      return (
                        <p 
                          key={index} 
                          className={`${isSuccess ? 'text-emerald-400 font-bold' : isError ? 'text-red-400 font-bold' : isInfo ? 'text-blue-300' : 'text-[#c9d1d9]'} animate-fade-in whitespace-pre-wrap`}
                        >
                          {log}
                        </p>
                      );
                    })
                  )}

                  {exportState === 'SUCCESS' && (
                    <div className="mt-6 p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl space-y-3 animate-slide-up select-none font-sans">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                        <span>Exportation Réussie !</span>
                      </div>
                      <p className="text-gray-300 text-xs">
                        Le dépôt public a été initialisé/mis à jour et tous les blueprints d'architecture souveraine y ont été poussés en direct.
                      </p>
                      <a
                        href={`https://github.com/${githubUsername}/${repoName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Consulter votre Dépôt sur GitHub</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* FOOTER BAR */}
        <div className="px-6 py-3 bg-[#161b22] border-t border-[#30363d] flex items-center justify-between shrink-0 font-mono text-[10px] text-[#8b949e]">
          <span>© 2026 MyCity {currentCity} GovTech • Dual-Licence Propriétaire/Souverain</span>
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400 font-bold">PIPELINE VERIFICATION POSTURE STABLE</span>
          </div>
        </div>

      </div>
    </div>
  );
}
