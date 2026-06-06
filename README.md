# 🏛️ Écosystème Souverain MyCity Casablanca — Double-Core Showcase

Bienvenue dans le dépôt officiel de démonstration et d'architecture de l'écosystème souverain de gestion de ville intelligente **MyCity Casablanca**.

Pour offrir à nos prospects de l'administration publique, aux investisseurs B2G et aux auditeurs de sécurité une transparence technique absolue sans compromettre l'intégrité ou la sécurité, ce projet est structuré en deux environnements distincts :

---

## 📂 Architecture & Organisation du Dépôt

### 1. 📂 [enterprise-dev-sandbox/](./enterprise-dev-sandbox/)
> **Environnement de Sandbox & Prototypage Rapide (Mocks de Dev activés)**
- **Contenu** : Portails Citoyens et Métiers complets, serveur robuste Express API, Drizzle migrations, BLE-Mesh, géolocalisation et configuration de base de données.
- **Sécurité** : Intègre des clés fallbacks cryptographiques de développement pré-configurées. Permet à un ingénieur prospect de cloner instantanément le code et d'exécuter un build local en un clic, facilitant l'évaluation directe.
- **Boot local rapide** : 
  ```bash
  cd enterprise-dev-sandbox
  npm install
  npm run dev
  ```

### 2. 📂 [enterprise-sanitised-production/](./enterprise-sanitised-production/)
> **Environnement de Production Assaini (Strictement Limité & Conforme CNDP)**
- **Contenu** : Le code source de niveau entreprise prêt à être déployé sur votre cloud souverain (Maroc Télécom Cloud, inwi Business, etc.).
- **Sécurité** : **100% Nettoyé et Assaini**. Toutes les clés de démo statiques par défaut ont été purgées. Les secrets de signature d'autorité sont injectés dynamiquement via la commande d'environnement Doppler Vault ou Secrets Kubernetes. Conforme aux grilles d'audit de sécurité cloud de classe critique.
- **Intégration CI/CD** : Incorpore un orchestrateur GitHub Actions de production sécurisé poussant directement vers les containers de production.

---

## 🔒 Posture de Souveraineté & Législation
MyCity Casablanca est construit conformément aux cadres réglementaires marocains :
- **Loi 09-08 (Sécurité des données)** sous l'égide de la **CNDP**.
- **Dahir n° 1-02-238 (Loi 18-00)** régulant la copropriété immobilière et la légalisation des assemblées de copropriétaires.
- **Chiffrement hybride et Mesh Bluetooth d'urgence** empêchant l'altération ou l'interruption des informations critiques métropolitaines.

---
*© 2026 Écosystème Ville de Casablanca - Direction de la Transformation Numérique Gouvernementale.*