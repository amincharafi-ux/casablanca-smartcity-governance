import React, { useState } from 'react';
import { Radio, WifiOff, RefreshCw, Send, CheckCircle, Database } from 'lucide-react';
import { BLEMessage, BLEStatus } from '../types';
import { translations, LanguageCode } from '../data/translations';

interface BLEMeshSimProps {
  onAddLog: (action: string, details: string) => void;
  currentLang?: LanguageCode;
}

export default function BLEMeshSim({ onAddLog, currentLang = 'FR' }: BLEMeshSimProps) {
  const t = translations[currentLang];
  const [powerOn, setPowerOn] = useState(true);
  const [selectedNode, setSelectedNode] = useState('Noeud-Citoyen-Mobile-01');
  const [recipientNode, setRecipientNode] = useState('Noeud-Central-Mairie-01');
  const [payloadText, setPayloadText] = useState('RÉCLAMATION: Éclairage en panne avenue Maârif');
  const [syncStatus, setSyncStatus] = useState<BLEStatus>({
    isConnected: true,
    discoveredNodes: [
      "Noeud-Central-Mairie-01",
      "Casa-TechHub-MeshNode",
      "Maârif-Relais-03",
      "Anfa-Terminal-CityGate",
      "Sidi-Bernoussi-Relais-09"
    ],
    sentCount: 3,
    receivedCount: 2,
    syncInProgress: false,
    logs: [
      "[08:45:10] Démarrage du réseau Mesh local BLE V2.",
      "[08:45:12] Poignée de main HMAC-SHA256 établie avec Maârif-Relais-03.",
      "[09:12:00] Signal de réclamation propagé par Casa-TechHub-MeshNode (3 sauts)."
    ]
  });

  const [messageQueue, setMessageQueue] = useState<BLEMessage[]>([
    {
      id: "ble-msg-1",
      senderNode: "Noeud-Citoyen-Mobile-01",
      recipientNode: "Noeud-Central-Mairie-01",
      payload: "RÉCLAMATION: Benne débordante Maârif",
      timestamp: new Date(Date.now() - 3600000).toLocaleTimeString(),
      hmacSignature: "8b7f16a04fbd9b31d044ec936dca88921ec5b1f0eebc9a930776bd7480cf65a1"
    }
  ]);

  // Handle simulation of message hopping through BLE relay nodes
  const handlePropagateMessage = () => {
    if (!powerOn) return;
    if (!payloadText.trim()) return;

    setSyncStatus(prev => ({ ...prev, syncInProgress: true }));

    // Mock calculations of AES-128 & ECDSA cryptographic signature representation
    const randomHex = () => Math.floor(Math.random() * 1e16).toString(16);
    const mockAesPayload = `aes128_iv_cbc_0x${randomHex()}${randomHex()}...`;
    const mockECDSAUrgentSignature = `ecdsa_secp256k1_sig_0x${randomHex().substring(0,6)}d429a3a1f9ee29b71f9cf38abff9b57ecd198f2b740efcb95`;
    
    setTimeout(() => {
      const newMsg: BLEMessage = {
        id: `ble-${Date.now()}`,
        senderNode: selectedNode,
        recipientNode: recipientNode,
        payload: payloadText,
        timestamp: new Date().toLocaleTimeString(),
        hmacSignature: mockECDSAUrgentSignature
      };

      setMessageQueue(prev => [newMsg, ...prev]);

      const logLines = [
        `[${newMsg.timestamp}] Connexion GATT sécurisée (Service UUID: 0000FFF0-0000-1000-8000-00805F9B34FB).`,
        `[${newMsg.timestamp}] Négociation de chiffrement matériel AES-128 activée sur Caractéristique Légal (UUID: 0000FFF1).`,
        `[${newMsg.timestamp}] Signature cryptographique ECDSA générée avec la clé privée de l'appareil (${selectedNode.substring(0,8)}... -> Private Key: secp256k1_0xaf8e...).`,
        `[${newMsg.timestamp}] Trame chiffrée AES-128 : [${mockAesPayload.substring(0, 32)}...]`,
        `[${newMsg.timestamp}] Saut 1 : Propagation vers le relais Maârif-Relais-03 avec validation de signature.`,
        `[${newMsg.timestamp}] Saut 2 : Relais vers Casa-TechHub-MeshNode. Intégrité vérifiée sans altération.`,
        `[${newMsg.timestamp}] Reçu par la Gateway ${recipientNode}. Décryptage AES-128 réussi et Signature ECDSA d'Urgence validée (Émetteur Légitime certifié CNDP).`
      ];

      setSyncStatus(prev => ({
        ...prev,
        syncInProgress: false,
        sentCount: prev.sentCount + 1,
        receivedCount: prev.receivedCount + 1,
        logs: [...prev.logs, ...logLines]
      }));

      // Persist this event in privacy logs for visual CNDP audit trail
      onAddLog("BLE Mesh Sync", `Synchronisation hors-ligne GATT AES-128 avec Signature ECDSA (${payloadText.substring(0, 20)}...)`);

      setPayloadText('');
    }, 1200);
  };

  const handleClearQueue = () => {
    setMessageQueue([]);
    onAddLog("Purge Mesh", "Effacement des trames locales BLE de la file d'attente client.");
  };

  return (
    <div id="ble-mesh-simulator-panel" className="rounded-xl glass-panel border border-white/5 p-4 flex flex-col h-full">
      {/* Container Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Radio className={`w-5 h-5 ${powerOn ? 'text-[#00ff66] animate-pulse' : 'text-gray-500'}`} />
          <div>
            <h3 className="font-title font-bold text-xs text-white">Debug BLE Mesh (Casablanca)</h3>
            <p className="font-mono text-[9px] text-gray-400">
              {currentLang === 'FR' && "Résilience d'urgence hors-ligne CNDP & HMAC."}
              {currentLang === 'AR' && "مقاومة حالات الطوارئ وانسجام الربط المحلي المشفر HMAC."}
              {currentLang === 'EN' && "Emergency offline resilience with local symmetric HMAC keys."}
            </p>
          </div>
        </div>

        {/* Bluetooth Telemetry Switch */}
        <button
          id="ble-power-btn"
          onClick={() => {
            setPowerOn(!powerOn);
            onAddLog("BLE Power Toggle", `Utilisateur a ${!powerOn ? 'activé' : 'désactivé'} le module local Bluetooth BLE.`);
          }}
          className={`px-2.5 py-1 rounded text-[10px] font-mono border flex items-center gap-1.5 transition-colors cursor-pointer ${
            powerOn 
              ? 'bg-emerald-950/30 text-emerald-400 border-emerald-500/30' 
              : 'bg-red-950/30 text-red-400 border-red-500/30'
          }`}
        >
          <WifiOff className="w-3 h-3" />
          {powerOn ? t.meshPowerBtnOn : t.meshPowerBtnOff}
        </button>
      </div>

      {powerOn ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
          {/* Left Column: Input and Hopping Simulation */}
          <div className="flex flex-col justify-between space-y-3">
            <div className="bg-black/40 border border-white/5 p-3 rounded-lg text-xs space-y-2.5">
              <span className="font-title font-semibold text-[10px] tracking-wider text-indigo-400 uppercase">{t.meshEmergencyTitle}</span>
              
              <div>
                <label className="block text-[9px] font-mono text-gray-500 mb-1">{t.meshEmitterLabel}</label>
                <select
                  value={selectedNode}
                  onChange={(e) => setSelectedNode(e.target.value)}
                  className="w-full bg-[#161821] border border-white/5 rounded px-2 py-1 text-xs text-gray-300 font-mono focus:outline-none"
                >
                  <option value="Noeud-Citoyen-Mobile-01">📱 Mon Smartphone (Maârif)</option>
                  <option value="Noeud-Citoyen-Mobile-02">📱 Smartphone Voisin (Anfa)</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-mono text-gray-500 mb-1">{t.meshRecipientLabel}</label>
                <select
                  value={recipientNode}
                  onChange={(e) => setRecipientNode(e.target.value)}
                  className="w-full bg-[#161821] border border-white/5 rounded px-2 py-1 text-xs text-gray-300 font-mono focus:outline-none"
                >
                  {syncStatus.discoveredNodes.map((n, i) => (
                    <option key={i} value={n}>{n}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-mono text-gray-500 mb-1">{t.meshMessagePrompt}</label>
                <input
                  type="text"
                  value={payloadText}
                  onChange={(e) => setPayloadText(e.target.value)}
                  placeholder={t.meshPlaceholderText}
                  className="w-full bg-[#161821] border border-white/5 rounded px-2.5 py-1 text-xs text-white placeholder-gray-600 focus:outline-none"
                />
              </div>

              <button
                id="ble-propagate-btn"
                onClick={handlePropagateMessage}
                disabled={syncStatus.syncInProgress || !payloadText.trim()}
                className="w-full py-1.5 bg-[#6c3cff] hover:bg-[#562ee6] disabled:bg-neutral-800 text-white font-medium text-xs rounded transition-all cursor-pointer flex items-center justify-center gap-1.5 font-bold shadow-lg"
              >
                {syncStatus.syncInProgress ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    {t.meshPropagatingText}
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    {t.meshPropagateBtn}
                  </>
                )}
              </button>
            </div>

            {/* Hopping chain graphics */}
            <div className="bg-black/30 border border-white/5 rounded-lg p-2 text-[10px] font-mono text-gray-400 space-y-1.5">
              <span className="text-[#00ff66] text-[9px] font-bold uppercase block tracking-wider">{t.meshVisualTitle}</span>
              <div className="flex items-center justify-between text-center border-t border-white/5 pt-1.5">
                <div className="flex flex-col items-center">
                  <span className="px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-500/20 text-[8px]">{t.meshVisualEmitter}</span>
                  <span className="text-[9px] text-gray-300 truncate w-14 mt-1">Citizen 01</span>
                </div>
                <div className="h-0.5 w-8 border-t border-dashed border-indigo-500/50 relative">
                  <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[7px] text-[#00f0ff] uppercase">{t.meshVisualHop}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="px-1.5 py-0.5 rounded bg-[#1f212f] text-gray-400 text-[8px]">{t.meshVisualRelay}</span>
                  <span className="text-[9px] text-gray-400 mt-1">Maârif</span>
                </div>
                <div className="h-0.5 w-8 border-t border-dashed border-indigo-500/50 relative">
                  <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[7px] text-[#00f0ff] uppercase">{t.meshVisualHop}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/20 text-[8px]">{t.meshVisualGateway}</span>
                  <span className="text-[9px] text-emerald-300 truncate w-14 mt-1">Mairie Gate</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Database Records (SQLite Emulator) */}
          <div className="flex flex-col justify-between space-y-3">
            <div className="flex-1 bg-black/45 border border-white/5 rounded-lg p-3 font-mono text-[9.5px] text-gray-300 space-y-2 flex flex-col">
              <div className="flex items-center justify-between border-b border-white/5 pb-1 mb-1">
                <div className="flex items-center gap-1 text-amber-400 text-[9px] font-bold uppercase tracking-wider">
                  <Database className="w-3.5 h-3.5" />
                  <span>{t.meshLedgerTitle}</span>
                </div>
                <button
                  id="ble-clear-btn"
                  onClick={handleClearQueue}
                  className="text-gray-500 hover:text-white transition-colors cursor-pointer text-[9px] bg-neutral-800/60 px-1.5 py-0.5 rounded"
                >
                  {t.meshClearQueueBtn}
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 max-h-[160px]">
                {messageQueue.length === 0 ? (
                  <span className="text-gray-600 italic block text-center py-4">{t.meshLedgerEmpty}</span>
                ) : (
                  messageQueue.map((m) => (
                    <div key={m.id} className="bg-neutral-900/80 p-2 rounded border border-white/5 space-y-1 animate-fade-in">
                      <div className="flex justify-between items-center text-gray-400 text-[8.5px]">
                        <span>ID: {m.id}</span>
                        <span>{m.timestamp}</span>
                      </div>
                      <div className="text-gray-200"><span className="text-[#00ff66] font-bold">Payload:</span> {m.payload}</div>
                      <div className="text-gray-400 flex flex-col text-[8px] leading-tight">
                        <span><span className="text-amber-500">Node path:</span> {m.senderNode} ➡️ {m.recipientNode}</span>
                        <span className="truncate text-gray-500 text-[7.5px]"><span className="text-indigo-400">HMAC-SHA256:</span> {m.hmacSignature}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Network status logs ticker */}
              <div className="pt-2 border-t border-white/5">
                <span className="text-gray-500 block text-[8px] uppercase font-bold tracking-wider mb-1">{t.meshLogStatusTitle}:</span>
                <div className="bg-neutral-950 p-2 rounded max-h-[80px] overflow-y-auto space-y-1 text-gray-400 text-[8px] leading-tight select-all">
                  {syncStatus.logs.map((log, lIdx) => (
                    <div key={lIdx}>{log}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-black/40 border border-dashed border-white/5 rounded-lg">
          <WifiOff className="w-12 h-12 text-gray-600 mb-2 animate-bounce" />
          <span className="text-xs text-gray-400 font-semibold mb-1">
            {currentLang === 'FR' ? "Moteur Mesh Éteint" : currentLang === 'AR' ? "شبكة البلوتوث معطلة" : "Mesh Engine Offline"}
          </span>
          <span className="text-[10px] text-gray-500 max-w-xs font-mono">
            {currentLang === 'FR' 
              ? "Activez le module BLE Mesh ci-dessus pour allumer la simulation d'ondes d'urgence et monitorer l'encryption HMAC."
              : currentLang === 'AR'
                ? "قم بتفعيل وحدة البلوتوث المجهري بالأعلى لتشغيل محاكاة موجات الطوارئ ومراقبة التشفير المشترك."
                : "Enable the BLE Mesh module above to turn on emergency hopping waves and monitor real-time HMAC protection."}
          </span>
        </div>
      )}
    </div>
  );
}
