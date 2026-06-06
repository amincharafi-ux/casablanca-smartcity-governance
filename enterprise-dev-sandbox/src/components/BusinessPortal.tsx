import React, { useState } from 'react';
import { Sparkles, BarChart2, MessageSquare, Send, CheckCircle, ShieldAlert, Plus, Download, Mail, QrCode } from 'lucide-react';
import { CityEvent } from '../types';
import { translations, LanguageCode } from '../data/translations';

interface BusinessPortalProps {
  events: CityEvent[];
  onAddEvent: (newEvent: Omit<CityEvent, 'id' | 'views' | 'bookingsCount' | 'revenue' | 'reviews'>) => void;
  onAddLog: (action: string, details: string) => void;
  currentLang?: LanguageCode;
}

export default function BusinessPortal({ events, onAddEvent, onAddLog, currentLang = 'FR' }: BusinessPortalProps) {
  const t = translations[currentLang];

  const [partnerSubCat, setPartnerSubCat] = useState<'CAT1' | 'CAT2'>('CAT1');
  const [activeTab, setActiveTab] = useState<'METRICS' | 'PUBLISH' | 'MESSAGES'>('METRICS');

  // New event registration fields
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventCategory, setNewEventCategory] = useState<'ECONOMIC' | 'CULTURE' | 'SPORT'>('ECONOMIC');
  const [newEventPrice, setNewEventPrice] = useState(150);
  const [newEventIsToday, setNewEventIsToday] = useState(true);
  const [publishFeedback, setPublishFeedback] = useState<string | null>(null);

  // Ticket validation scanner fields
  const [mockTicketCode, setMockTicketCode] = useState('QR-CASA-98547-A');
  const [validationResult, setValidationResult] = useState<string | null>(null);

  // Campaign Push composer
  const [campaignTitle, setCampaignTitle] = useState('Grande Braderie de l\'Anfa !');
  const [campaignTarget, setCampaignTarget] = useState('Anfa District');
  const [campaignFeedback, setCampaignFeedback] = useState(false);

  // Messages with guests
  const [messages, setMessages] = useState([
    { id: 1, guest: 'Sara B.', text: 'Bonjour, l\'événement Tech de Maârif comprend-il un buffet végétarien ?', date: 'il y a 2h', replied: false },
    { id: 2, guest: 'Omar K.', text: 'Est-il possible d\'obtenir une facture pour la billetterie Stripe ?', date: 'il y a 4h', replied: true }
  ]);
  const [replyInputs, setReplyInputs] = useState<Record<number, string>>({});

  const handleSendMessageReply = (msgId: number) => {
    const txt = replyInputs[msgId];
    if (!txt?.trim()) return;

    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, replied: true } : m));
    setReplyInputs(prev => ({ ...prev, [msgId]: '' }));
    onAddLog("Business Reply", `Réponse envoyée au client pour le ticket #${msgId}.`);
  };

  const handlePublishEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim() || !newEventDesc.trim()) return;

    // Constraints checks
    if (partnerSubCat === 'CAT1') {
      const cat1Count = events.filter(evt => evt.partnerId.includes('cat1')).length;
      if (cat1Count >= 3) {
        setPublishFeedback(currentLang === 'FR' 
          ? "⚠️ Limite de formule : Limite de 1 événement par semaine atteinte pour les abonnements Catérogie 1."
          : currentLang === 'AR'
            ? "⚠️ حد باقة فئة 1: تم الوصول للحد الأقصى المسموح به لمشتركي الفئة الأولى وهو إعلان واحد بالأسبوع."
            : "⚠️ Subscription Limit: Limit of 1 event per week reached for Category 1 formulas.");
        return;
      }
    }

    onAddEvent({
      title: newEventTitle,
      description: newEventDesc,
      category: newEventCategory,
      date: new Date().toISOString().split('T')[0], // Today
      isToday: newEventIsToday,
      partnerId: partnerSubCat === 'CAT2' ? 'partner-cat2-user' : 'partner-cat1-user',
      partnerName: partnerSubCat === 'CAT2' ? "Commerce Premium (Épinglé)" : "Commerce Basique Max (Jour-J)",
      isPremiumPartner: partnerSubCat === 'CAT2',
      lat: 33.5821 + (Math.random() - 0.5) * 0.05,
      lng: -7.6382 + (Math.random() - 0.5) * 0.05,
      ticketPrice: Number(newEventPrice)
    });

    setPublishFeedback(t.publishSuccessFeedback);
    setNewEventTitle('');
    setNewEventDesc('');
    
    onAddLog("Event Created", `Création de l'événement "${newEventTitle}" par le partenaire ${partnerSubCat}`);
    
    setTimeout(() => {
      setPublishFeedback(null);
      setActiveTab('METRICS');
    }, 2500);
  };

  const handleValidateQrCode = () => {
    setValidationResult("Scannage en cours...");
    setTimeout(() => {
      setValidationResult(currentLang === 'FR' 
        ? `✅ Verrou CMI Débloqué ! Billet [${mockTicketCode}] validé à l'instant. Admission autorisée.`
        : currentLang === 'AR'
          ? `✅ تم التحقق والقبول بنجاح! تم إلغاء قفل بوابة CMI للتذكرة [${mockTicketCode}] والترخيص بالدخول.`
          : `✅ Secured Gate Unlocked! Ticket [${mockTicketCode}] validated just now. Admission granted.`);
      onAddLog("Ticket Scanned", `Validation physique QR Code pour le ticket : ${mockTicketCode}`);
    }, 1200);
  };

  const handleLaunchCampaign = () => {
    setCampaignFeedback(true);
    onAddLog("Push Dispatched", `Envoi d'une notification de campagne ciblée sur "${campaignTarget}": ${campaignTitle}`);
    setTimeout(() => setCampaignFeedback(false), 2000);
  };

  const handleExportCSV = () => {
    const headers = "Event ID,Title,Views,Ticket Sales Count,Price (MAD),Commission %,Net Profit (MAD)\n";
    const rows = events
      .filter(evt => evt.partnerId.includes(partnerSubCat.toLowerCase()))
      .map(e => {
        const comm = partnerSubCat === 'CAT2' ? 0.05 : 0.08;
        const total = e.revenue;
        const commMAD = total * comm;
        const net = total - commMAD;
        return `${e.id},"${e.title.replace(/"/g, '""')}",${e.views},${e.bookingsCount},${e.ticketPrice},${comm * 100}%,${net}`;
      }).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.setAttribute("href", url);
    downloadLink.setAttribute("download", `MyCity-Partner-${partnerSubCat}-Analytics.csv`);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  // Metrics statistics calculation
  const partnerEvents = events.filter(evt => {
    if (partnerSubCat === 'CAT2') {
      return evt.isPremiumPartner;
    }
    return !evt.isPremiumPartner;
  });

  const totalViews = partnerEvents.reduce((acc, current) => acc + current.views, 0);
  const totalSalesCount = partnerEvents.reduce((acc, current) => acc + current.bookingsCount, 0);
  const totalRawBilling = partnerEvents.reduce((acc, current) => acc + current.revenue, 0);
  const activeCommission = partnerSubCat === 'CAT2' ? 0.05 : 0.08;
  const netEarnings = Math.max(0, totalRawBilling * (1 - activeCommission));

  return (
    <div id="business-portal-container" className="space-y-4">
      {/* Formula Sub-selector */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-[#1f212f] border border-[#6c3cff]/15">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <div className="text-xs">
            <span className="font-semibold text-white block">{t.partnerSubCatLabel}</span>
            <p className="font-mono text-[9px] text-gray-400">
              {currentLang === 'FR' && "Cliquez ci-contre pour permuter les paliers et tester les contraintes."}
              {currentLang === 'EN' && "Click opposite to change subscription plans and test features."}
              {currentLang === 'AR' && "انقر بجانب لتبديل العضوية وتأثير القيود على الخريطة."}
            </p>
          </div>
        </div>

        <div className="flex bg-[#161821] p-0.5 rounded border border-white/5 gap-1 text-[10px] font-mono font-bold">
          <button
            id="partner-switch-cat1"
            onClick={() => {
              setPartnerSubCat('CAT1');
              onAddLog("Subscription Toggle", "Permutation vers l'abonnement Catégorie 1 (Basique 299 MAD/mois).");
            }}
            className={`px-3 py-1 rounded transition-all cursor-pointer ${
              partnerSubCat === 'CAT1' ? 'bg-[#6c3cff] text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            {t.partnerSwitchCat1Label}
          </button>
          
          <button
            id="partner-switch-cat2"
            onClick={() => {
              setPartnerSubCat('CAT2');
              onAddLog("Subscription Toggle", "Permutation vers l'abonnement Catégorie 2 (Premium 799 MAD/mois).");
            }}
            className={`px-3 py-1 rounded transition-all cursor-pointer flex items-center gap-1 ${
              partnerSubCat === 'CAT2' ? 'bg-[#6c3cff] text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>{t.partnerSwitchCat2Label}</span>
          </button>
        </div>
      </div>

      {/* Tab select option */}
      <div className="flex border-b border-white/5 bg-[#0f111a] p-1 rounded-lg gap-1">
        <button
          id="partner-tab-metrics"
          onClick={() => setActiveTab('METRICS')}
          className={`flex-1 py-1.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
            activeTab === 'METRICS' ? 'bg-[#1e2030] text-white font-semibold' : 'text-gray-400'
          }`}
        >
          {t.partnerTabMetrics}
        </button>
        <button
          id="partner-tab-publish"
          onClick={() => setActiveTab('PUBLISH')}
          className={`flex-1 py-1.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
            activeTab === 'PUBLISH' ? 'bg-[#1e2030] text-white font-semibold' : 'text-gray-400'
          }`}
        >
          {t.partnerTabPublish}
        </button>
        <button
          id="partner-tab-messages"
          onClick={() => setActiveTab('MESSAGES')}
          className={`flex-1 py-1.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
            activeTab === 'MESSAGES' ? 'bg-[#1e2030] text-white font-semibold' : 'text-gray-400'
          }`}
        >
          {t.partnerTabMessages}
        </button>
      </div>

      {/* TABS METRICS */}
      {activeTab === 'METRICS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#161821] border border-white/5 rounded-lg p-2.5">
              <span className="text-[10px] text-gray-500 font-mono uppercase block">{t.metricsViews}</span>
              <span className="text-lg font-bold text-white font-mono">{totalViews}</span>
            </div>

            <div className="bg-[#161821] border border-white/5 rounded-lg p-2.5">
              <span className="text-[10px] text-gray-500 font-mono uppercase block">{t.metricsBookings}</span>
              <span className="text-lg font-bold text-emerald-400 font-mono">{totalSalesCount} billets</span>
            </div>

            <div className="bg-[#161821] border border-white/5 rounded-lg p-2.5">
              <span className="text-[10px] text-gray-500 font-mono uppercase block">{t.metricsCommission}</span>
              <span className="text-sm font-semibold text-rose-400 font-mono">
                {commPercent()}%
              </span>
              <p className="text-[8px] text-gray-400 font-mono leading-tight mt-0.5">
                {partnerSubCat === 'CAT2' ? t.metricsCommissionLabelPremium : t.metricsCommissionLabelStandard}
              </p>
            </div>

            <div className="bg-[#161821] border border-[#ff3c83]/20 rounded-lg p-2.5 relative overflow-hidden">
              <span className="text-[10px] text-gray-500 font-mono uppercase block">{t.metricsNetEarnings}</span>
              <span className="text-base font-bold text-indigo-300 font-mono">{netEarnings.toLocaleString()} MAD</span>
              <p className="text-[8px] text-gray-400 font-mono leading-tight mt-0.5">{t.metricsNetEarningsLabel}</p>
            </div>
          </div>

          {/* Dynamic Map Demographics Footprint Flow */}
          <div className="bg-[#161821] border border-white/5 rounded-xl p-3 space-y-2">
            <h4 className="font-title font-medium text-xs text-white flex items-center gap-1.5">
              <span>{t.heatmapTitle}</span>
              <span className="px-1.5 py-0.5 text-[8px] font-mono bg-blue-500/20 text-blue-400 rounded">LIVE ACTIF</span>
            </h4>

            {partnerSubCat === 'CAT1' ? (
              <div className="h-32 rounded bg-black/60 border border-dashed border-white/10 flex flex-col items-center justify-center p-3 text-center space-y-1 relative">
                <span className="text-lg">🔒</span>
                <span className="font-semibold text-[11px] text-rose-400">{t.heatmapLocked}</span>
                <p className="text-[9px] text-gray-500 max-w-[260px]">{t.heatmapLockDesc}</p>
                <div className="absolute inset-0 bg-neutral-900/35 filter blur-[1px] -z-10 bg-[radial-gradient(#1e2030_1px,transparent_1px)] bg-[size:10px_10px]"></div>
              </div>
            ) : (
              <div className="space-y-2 animate-fade-in text-[11px] font-mono text-gray-400 bg-neutral-900/40 p-2.5 rounded border border-indigo-500/10">
                <div className="flex justify-between items-center text-[10px] pb-1 border-b border-white/5">
                  <span className="text-gray-500">Flux piétons Anfa</span>
                  <span className="text-indigo-400 font-bold">12 400 passages/jour</span>
                </div>
                <div className="flex justify-between items-center text-[10px] pb-1 border-b border-white/5">
                  <span className="text-gray-500">Taux de conversion Stripe</span>
                  <span className="text-emerald-400 font-bold">4.2%</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-gray-500">Segment d'affinité favori</span>
                  <span className="text-indigo-300 font-bold">18-35 ans, Cadres</span>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-1">
              <button
                type="button"
                id="export-csv-metrics-btn"
                onClick={handleExportCSV}
                className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 font-mono text-[10px] text-white rounded transition-all cursor-pointer flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                {t.exportCsvBtn}
              </button>
            </div>
          </div>

          {/* Ticket Validation Scanner Form */}
          <div className="bg-[#161821] border border-white/5 rounded-xl p-3 space-y-3">
            <h4 className="font-title font-medium text-xs text-white">{t.validateTicketTitle}</h4>
            <p className="text-[10px] text-gray-500 leading-tight">{t.validateTicketDesc}</p>
            
            <div className="flex gap-1.5 font-mono text-xs">
              <input
                type="text"
                value={mockTicketCode}
                onChange={(e) => setMockTicketCode(e.target.value)}
                placeholder={t.ticketIdPlaceholder}
                className="flex-1 bg-black/40 border border-white/10 rounded px-2.5 py-1 text-white focus:outline-none focus:border-[#6c3cff]"
              />
              <button
                type="button"
                id="validate-ticket-btn"
                onClick={handleValidateQrCode}
                className="px-3 py-1 bg-[#6c3cff] hover:bg-[#562ee6] text-white rounded font-bold cursor-pointer flex items-center gap-1 text-[11px]"
              >
                <QrCode className="w-3.5 h-3.5" />
                {t.validateBtn}
              </button>
            </div>

            {validationResult && (
              <div className="p-2.5 bg-[#0f111a] border border-[#00f0ff]/30 text-[#00f0ff] font-mono text-[10px] rounded leading-relaxed animate-pulse">
                {validationResult}
              </div>
            )}
          </div>
        </div>
      )}

      {/* FORM PUBLISH EVENT */}
      {activeTab === 'PUBLISH' && (
        <div id="publish-custom-marker-panel" className="bg-[#161821] border border-white/5 p-4 rounded-xl space-y-4 shadow-lg">
          <div>
            <h3 className="font-title font-bold text-sm text-white">{t.publishAnnonceTitle}</h3>
            <p className="font-mono text-[10px] text-gray-500">{t.publishAnnonceDesc} <span className="text-[#00f0ff] underline">merchant@mycity.ma</span></p>
          </div>

          <form onSubmit={handlePublishEventSubmit} className="space-y-3 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-10px font-mono text-gray-400 mb-1">{t.eventTitleInputLabel}</label>
                <input
                  type="text"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder={t.eventTitlePlaceholder}
                  className="w-full bg-black/40 border border-white/15 rounded px-2.5 py-1.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#6c3cff]"
                  required
                />
              </div>

              <div>
                <label className="block text-10px font-mono text-gray-400 mb-1">{t.eventCategoryInputLabel}</label>
                <select
                  value={newEventCategory}
                  onChange={(e) => setNewEventCategory(e.target.value as any)}
                  className="w-full bg-black/40 border border-white/15 rounded px-2.5 py-1.5 text-white placeholder-gray-500 font-mono focus:outline-none focus:border-[#6c3cff]"
                >
                  <option value="ECONOMIC">{t.filterEco}</option>
                  <option value="CULTURE">{t.filterCulture}</option>
                  <option value="SPORT">{t.filterSport}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-10px font-mono text-gray-400 mb-1">{t.ticketPriceInputLabel}</label>
                <input
                  type="number"
                  value={newEventPrice}
                  onChange={(e) => setNewEventPrice(Number(e.target.value))}
                  className="w-full bg-black/40 border border-white/15 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-[#6c3cff]"
                  required
                />
              </div>

              <div>
                <label className="block text-10px font-mono text-gray-400 mb-1">{t.pinScheduleLabel}</label>
                <div className="flex items-center gap-3 py-1 font-mono text-[10px] text-gray-300">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      checked={newEventIsToday}
                      onChange={() => setNewEventIsToday(true)}
                    />
                    <span>{t.pinTodayRadio}</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      checked={!newEventIsToday}
                      onChange={() => setNewEventIsToday(false)}
                    />
                    <span>{t.pinFutureRadio}</span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-10px font-mono text-gray-400 mb-1">{t.eventDescInputLabel}</label>
              <textarea
                value={newEventDesc}
                onChange={(e) => setNewEventDesc(e.target.value)}
                rows={3}
                placeholder={t.eventDescPlaceholder}
                className="w-full bg-black/40 border border-white/15 rounded px-2.5 py-1.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#6c3cff]"
                required
              />
            </div>

            {partnerSubCat === 'CAT1' && (
              <div className="p-2.5 bg-amber-950/20 border border-amber-500/10 rounded font-mono text-[9px] text-amber-500 text-justify">
                {t.formCat1PinWarning}
              </div>
            )}

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                id="publish-custom-event-btn"
                className="px-4 py-2 bg-[#6c3cff] hover:bg-[#562ee6] text-white font-bold rounded transition-all cursor-pointer flex items-center gap-2 text-xs shadow-lg"
              >
                <Plus className="w-4 h-4" />
                {t.publishMarkerBtn}
              </button>
            </div>
          </form>

          {publishFeedback && (
            <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] rounded animate-pulse">
              {publishFeedback}
            </div>
          )}
        </div>
      )}

      {/* TABS MESSAGES LOG */}
      {activeTab === 'MESSAGES' && (
        <div className="space-y-4">
          <div className="bg-[#161821] border border-white/5 rounded-xl p-3 space-y-3">
            <h4 className="font-title font-medium text-xs text-white pb-1.5 border-b border-white/5">{t.directMessagesTitle}</h4>
            
            <div className="space-y-3">
              {messages.map(msg => (
                <div key={msg.id} className="bg-[#0f111a] rounded p-2.5 border border-white/5 space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-mono text-gray-400">
                    <span className="flex items-center gap-1 text-white font-semibold">
                      <span className="w-4 h-4 rounded-full bg-indigo-500 text-[9px] text-center shrink-0 uppercase text-black font-extrabold flex items-center justify-center">
                        {msg.guest.charAt(0)}
                      </span>
                      {msg.guest}
                    </span>
                    <span>{msg.date}</span>
                  </div>

                  <p className="text-[11px] text-gray-300 leading-tight">{msg.text}</p>
                  
                  {msg.replied ? (
                    <div className="p-1.5 bg-emerald-950/35 border border-emerald-500/20 text-emerald-300 font-mono text-[9.5px] rounded animate-pulse">
                      {t.cndpReceiptAlert}
                    </div>
                  ) : (
                    <div className="flex gap-1 pt-1">
                      <input
                        type="text"
                        placeholder={t.msgReplyPlaceholder}
                        value={replyInputs[msg.id] || ''}
                        onChange={(e) => setReplyInputs(prev => ({ ...prev, [msg.id]: e.target.value }))}
                        className="flex-1 bg-black/40 border border-white/10 rounded px-2.5 py-1 text-[10.5px] text-white placeholder-gray-600 focus:outline-none focus:border-[#6c3cff]"
                      />
                      <button
                        type="button"
                        id={`btn-reply-msg-${msg.id}`}
                        onClick={() => handleSendMessageReply(msg.id)}
                        className="px-2.5 py-1 bg-[#6c3cff] hover:bg-[#562ee6] text-white rounded text-[10px] font-bold cursor-pointer"
                      >
                        {t.replyBtn}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* GEOFENCE MOBILE AD TARGETING FOR PREMIUM */}
          <div className="bg-[#161821] border border-white/5 rounded-xl p-3 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-title font-medium text-xs text-white">{t.campaignPushTitle}</h4>
              <span className={`px-2 py-0.5 text-[8.5px] font-mono rounded font-bold uppercase ${
                partnerSubCat === 'CAT2' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
              }`}>
                {partnerSubCat === 'CAT2' ? t.campaignPushAvailable : t.campaignPushLocked}
              </span>
            </div>

            <p className="text-[10px] text-gray-500 leading-snug">{t.campaignPushText}</p>

            {partnerSubCat === 'CAT2' ? (
              <div id="partner-push-composer" className="space-y-2 text-xs font-mono animate-fade-in">
                <div>
                  <label className="block text-[10.5px] text-gray-500 mb-0.5">{t.campaignTitleInputLabel}</label>
                  <input
                    type="text"
                    value={campaignTitle}
                    onChange={(e) => setCampaignTitle(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded px-2.5 py-1 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10.5px] text-gray-500 mb-0.5">{t.campaignTargetInputLabel}</label>
                    <input
                      type="text"
                      value={campaignTarget}
                      onChange={(e) => setCampaignTarget(e.target.value)}
                      className="w-full bg-black/40 border border-white/15 rounded px-2.5 py-1 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] text-gray-400 mb-0.5">Statut Cible</label>
                    <span className="block px-2.5 py-1 bg-indigo-950/40 text-indigo-300 font-bold rounded text-[10px]">
                      {t.campaignStatusTarget}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleLaunchCampaign}
                    className="px-3.5 py-1.5 bg-[#6c3cff] hover:bg-[#562ee6] text-white rounded font-bold cursor-pointer inline-flex items-center gap-1"
                  >
                    {t.dispatchCampaignBtn}
                  </button>
                </div>

                {campaignFeedback && (
                  <div className="p-2 bg-emerald-950/35 border border-emerald-500/20 text-[#00ff66] text-[10px] rounded animate-pulse">
                    {t.campaignDispatchedAlert}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );

  function commPercent() {
    return partnerSubCat === 'CAT2' ? 5 : 8;
  }
}
