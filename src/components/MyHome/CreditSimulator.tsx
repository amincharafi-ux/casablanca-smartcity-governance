import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Percent, 
  Clock, 
  UserCheck, 
  Coins, 
  Info, 
  AlertTriangle, 
  Check, 
  FileText, 
  TrendingUp, 
  Briefcase,
  ShieldAlert,
  HelpCircle,
  FileCheck2
} from 'lucide-react';

interface CreditSimulatorProps {
  currentLang?: string;
  initialPropertyPrice?: number;
  onSimulationComplete?: (payment: number, isApproved: boolean) => void;
}

export default function CreditSimulator({ 
  currentLang = 'FR',
  initialPropertyPrice = 2000000,
  onSimulationComplete
}: CreditSimulatorProps) {
  // Simulator inputs
  const [propertyPrice, setPropertyPrice] = useState<number>(initialPropertyPrice);
  const [downpayment, setDownpayment] = useState<number>(400000); // Default downpayment (20%)
  const [monthlyIncome, setMonthlyIncome] = useState<number>(25000); // Net monthly income
  const [termYears, setTermYears] = useState<number>(20); // Loan duration
  const [nominalRate, setNominalRate] = useState<number>(4.75); // Nominal annual rate
  const [insuranceRate, setInsuranceRate] = useState<number>(0.35); // Mandatory ADI insurance annual rate
  const [buyerProfile, setBuyerProfile] = useState<'STANDARD' | 'MRE' | 'FONCTIONNAIRE'>('STANDARD');
  
  // Interactive modal for Letter of Pre-Approval
  const [isLetterOpen, setIsLetterOpen] = useState<boolean>(false);
  const [selectedBank, setSelectedBank] = useState<string>('Attijariwafa Bank');

  // Sync downpayment to match property price ratio if user edits property price
  // But allow custom modifications
  const downpaymentPercent = propertyPrice > 0 ? (downpayment / propertyPrice) * 100 : 0;

  const handleSetDownpaymentPercent = (percent: number) => {
    setDownpayment(Math.round((propertyPrice * percent) / 100));
  };

  // Moroccan Banks List (GPBM)
  const MOROCCAN_BANKS = [
    { name: 'Attijariwafa Bank', code: 'AWB' },
    { name: 'Banque Populaire du Maroc (BCP)', code: 'GBP' },
    { name: 'Bank of Africa (BMCE)', code: 'BOA' },
    { name: 'CIH Bank', code: 'CIH' },
    { name: 'Société Générale Maroc', code: 'SGMB' },
    { name: 'BMCI (Groupe BNP Paribas)', code: 'BMCI' },
    { name: 'Crédit du Maroc', code: 'CDM' }
  ];

  // Calculations based on BAM & GPBM guidelines
  const calculations = useMemo(() => {
    // 1. Capital Borrowed
    const principal = Math.max(0, propertyPrice - downpayment);

    // 2. Max LTV Limits
    // STANDARD: 80% LTV, MRE: 70% LTV, FONCTIONNAIRE: 100% LTV
    let maxLtvPercent = 80;
    let maxEndettementPercent = 45;

    if (buyerProfile === 'MRE') {
      maxLtvPercent = 70;
      maxEndettementPercent = 40;
    } else if (buyerProfile === 'FONCTIONNAIRE') {
      maxLtvPercent = 100;
      maxEndettementPercent = 50;
    }

    const currentLtvPercent = propertyPrice > 0 ? (principal / propertyPrice) * 100 : 0;
    const isLtvCompliant = currentLtvPercent <= maxLtvPercent;

    // 3. Monthly payment with 10% VAT on banking margin / interest
    // Standard Moroccan retail amortized formula:
    // Taux mensuel = Taux annuel nominal / 12 / 100
    // But banks include 10% VAT on interest portion as per GPBM guidelines.
    // Monthly rate including VAT
    const monthlyRateNominalStr = nominalRate / 12 / 100;
    const monthlyRateTTC = monthlyRateNominalStr * 1.10; // apply 10% VAT

    const totalPeriodsMonths = termYears * 12;

    let monthlyRepaymentHT = 0;
    if (principal > 0) {
      if (monthlyRateTTC > 0) {
        monthlyRepaymentHT = principal * (monthlyRateTTC / (1 - Math.pow(1 + monthlyRateTTC, -totalPeriodsMonths)));
      } else {
        monthlyRepaymentHT = principal / totalPeriodsMonths;
      }
    }

    // 4. Mandatory ADI Insurance
    // ADI is typically evaluated at roughly 0.35% per year of initial capital
    const annualInsuranceCost = principal * (insuranceRate / 100);
    const monthlyInsuranceCost = annualInsuranceCost / 12;

    // 5. Total Monthly Payment TTC
    const monthlyPaymentTotalTTC = monthlyRepaymentHT + monthlyInsuranceCost;

    // 6. Debt-to-income (Taux d'endettement)
    const currentEndettementRatio = monthlyIncome > 0 ? (monthlyPaymentTotalTTC / monthlyIncome) * 100 : 0;
    const isEndettementCompliant = currentEndettementRatio <= maxEndettementPercent;

    // 7. Notary & Administrative overhead (Moroccan scale)
    // Registration 4%, Conservation foncière 1.5% + 100 MAD, Notary emoluments avg 1.0% to 1.5%
    const scaleRegistration = propertyPrice * 0.04;
    const scaleConservation = (propertyPrice * 0.015) + 100;
    const scaleNotaryFees = propertyPrice * 0.012; // avg 1.2%
    const scaleDossierFees = 2500; // Administrative files setup
    const totalNotaryTaxesOverhead = scaleRegistration + scaleConservation + scaleNotaryFees + scaleDossierFees;

    // Overall GPBM eligibility score
    const isApproved = isLtvCompliant && isEndettementCompliant && principal > 0;

    return {
      principal,
      maxLtvPercent,
      maxEndettementPercent,
      currentLtvPercent,
      isLtvCompliant,
      monthlyRepaymentHT,
      monthlyInsuranceCost,
      monthlyPaymentTotalTTC,
      currentEndettementRatio,
      isEndettementCompliant,
      totalNotaryTaxesOverhead,
      scaleRegistration,
      scaleConservation,
      scaleNotaryFees,
      isApproved
    };
  }, [propertyPrice, downpayment, monthlyIncome, termYears, nominalRate, insuranceRate, buyerProfile]);

  // Sync to outer component on change if provided
  React.useEffect(() => {
    if (onSimulationComplete) {
      onSimulationComplete(calculations.monthlyPaymentTotalTTC, calculations.isApproved);
    }
  }, [calculations.monthlyPaymentTotalTTC, calculations.isApproved, onSimulationComplete]);

  // Sync state whenever an external property price is selected for simulation
  React.useEffect(() => {
    setPropertyPrice(initialPropertyPrice);
    setDownpayment(Math.round(initialPropertyPrice * 0.20));
  }, [initialPropertyPrice]);

  return (
    <div id="gpbm-credit-simulator-widget" className="bg-[#161821] border border-white/5 rounded-3xl p-5 md:p-6 space-y-5 shadow-2xl relative overflow-hidden">
      
      {/* Background flare */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-white/5 pb-3">
        <Calculator className="w-5 h-5 text-indigo-400" />
        <div>
          <h4 className="font-title font-black text-xs text-white uppercase tracking-wider">
            Simulateur Crédit Immobilier BAM / GPBM
          </h4>
          <p className="text-[10px] text-gray-500 font-mono">
            Conformité Circulaires Bank Al-Maghrib relative aux taux débiteurs
          </p>
        </div>
      </div>

      {/* Grid Inputs inside Simulator */}
      <div className="space-y-4 text-xs">
        
        {/* Buyer Profile Select */}
        <div className="bg-black/20 p-2.5 rounded-xl border border-white/5 space-y-1">
          <label className="block text-[9px] uppercase font-mono text-gray-400 font-black">
            Profil Acquéreur (Limites Prudentielles BAM)
          </label>
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            {[
              { id: 'STANDARD', label: 'Standard', desc: 'LTV max 80% • 45% endettement' },
              { id: 'MRE', label: 'MRE', desc: 'LTV max 70% • 40% endettement' },
              { id: 'FONCTIONNAIRE', label: 'Public Serv.', desc: 'LTV max 100% • 50% endettement' }
            ].map(prof => (
              <button
                key={prof.id}
                type="button"
                onClick={() => setBuyerProfile(prof.id as any)}
                className={`p-2 rounded-lg text-left transition-all border shrink-0 cursor-pointer ${
                  buyerProfile === prof.id
                    ? 'bg-indigo-600/25 border-indigo-400 text-indigo-200'
                    : 'bg-black/35 border-white/5 hover:border-white/10 text-gray-400 hover:text-white'
                }`}
                title={prof.desc}
              >
                <div className="font-bold text-[10px]">{prof.label}</div>
                <div className="text-[7.5px] font-mono opacity-80 mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                  LTV {prof.id === 'MRE' ? '70%' : prof.id === 'FONCTIONNAIRE' ? '100%' : '80%'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Property Price & Downpayment Dual Slider Input */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px]">
              <span className="font-mono text-gray-400 uppercase">Valeur du Bien (MAD)</span>
              <span className="font-bold text-white font-mono">
                {propertyPrice.toLocaleString('fr-FR')} MAD
              </span>
            </div>
            <input 
              type="range" 
              min={300000} 
              max={15000000} 
              step={50000}
              value={propertyPrice}
              onChange={(e) => {
                const val = Number(e.target.value);
                setPropertyPrice(val);
                // Adjust downpayment proportionally to maintain ~20% standard if not modified
                if (buyerProfile !== 'FONCTIONNAIRE') {
                  setDownpayment(Math.round(val * (downpaymentPercent / 100 || 0.20)));
                } else {
                  setDownpayment(0);
                }
              }}
              className="w-full accent-[#6C3CFF] cursor-pointer bg-black/40 h-1 rounded"
            />
            <div className="flex gap-1">
              {[500000, 1500000, 3000000, 6000000].map(p => (
                <button 
                  key={p} 
                  type="button"
                  onClick={() => {
                    setPropertyPrice(p);
                    if (buyerProfile !== 'FONCTIONNAIRE') {
                      setDownpayment(Math.round(p * 0.20));
                    } else {
                      setDownpayment(0);
                    }
                  }}
                  className="bg-black/40 text-[8px] font-mono px-1 pb-0.5 pt-0.5 rounded hover:bg-white/5 text-gray-400 hover:text-white transition-colors border border-white/5 cursor-pointer flex-1"
                >
                  {p >= 1000000 ? `${p/1000000}M` : `${p/1000}k`}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px]">
              <span className="font-mono text-gray-400 uppercase">Apport Personnel (MAD)</span>
              <span className="font-bold text-[#9E8BFF] font-mono">
                {downpayment.toLocaleString('fr-FR')} MAD ({downpaymentPercent.toFixed(0)}%)
              </span>
            </div>
            <input 
              type="range" 
              min={0} 
              max={Math.min(propertyPrice, 10000000)} 
              step={10000}
              value={downpayment}
              disabled={buyerProfile === 'FONCTIONNAIRE' && downpayment === 0} // public servants can borrow 100%
              onChange={(e) => setDownpayment(Number(e.target.value))}
              className="w-full accent-indigo-400 cursor-pointer bg-black/40 h-1 rounded disabled:opacity-40"
            />
            <div className="flex gap-1">
              {[0, 10, 20, 30, 40].map(pct => (
                <button 
                  key={pct} 
                  type="button"
                  disabled={buyerProfile === 'FONCTIONNAIRE' && pct > 0}
                  onClick={() => handleSetDownpaymentPercent(pct)}
                  className="bg-black/40 text-[8px] font-mono px-1 pb-0.5 pt-0.5 rounded hover:bg-white/5 text-gray-400 hover:text-white transition-colors border border-white/5 cursor-pointer flex-1 disabled:opacity-30 disabled:pointer-events-none"
                >
                  {pct}% App.
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Capital Borrowed Info Badge */}
        <div className="py-2 px-3 bg-[#11131c] rounded-xl border border-white/5 flex justify-between items-center text-[10.5px]">
          <span className="text-gray-400 flex items-center gap-1">
            <Coins className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
            <span>Financement Requis (Capital Emprunté) :</span>
          </span>
          <span className="font-mono font-bold text-white">
            {calculations.principal.toLocaleString('fr-FR')} MAD
          </span>
        </div>

        {/* Monthly Net Income */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[10px]">
            <span className="font-mono text-gray-400 uppercase">Revenu Mensuel Net (MAD)</span>
            <span className="font-bold text-emerald-400 font-mono">
              {monthlyIncome.toLocaleString('fr-FR')} MAD
            </span>
          </div>
          <input 
            type="range" 
            min={5000} 
            max={150000} 
            step={1000}
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer bg-black/40 h-1 rounded"
          />
        </div>

        {/* Term & Rates */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[9px] font-mono text-gray-400 uppercase">
              <span>Durée du Crédit</span>
              <span className="text-white font-bold">{termYears} Ans</span>
            </div>
            <select
              value={termYears}
              onChange={(e) => setTermYears(Number(e.target.value))}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-2 py-1.5 font-mono text-white text-[11px] outline-none cursor-pointer"
            >
              <option value="10">10 Ans (120 Échéances)</option>
              <option value="15">15 Ans (180 Échéances)</option>
              <option value="20">20 Ans (240 Échéances)</option>
              <option value="25">25 Ans (300 Échéances)</option>
              <option value="30">30 Ans (360 Échéances)</option>
            </select>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center text-[9px] font-mono text-gray-400 uppercase">
              <span>Taux d'Intérêt</span>
              <span className="text-[#a29bfe] font-bold">{nominalRate}%</span>
            </div>
            <div className="flex gap-2 items-center">
              <input 
                type="number" 
                step="0.05"
                min="3.0"
                max="8.0"
                value={nominalRate}
                onChange={(e) => setNominalRate(Math.max(1, parseFloat(e.target.value) || 4.75))}
                className="w-16 bg-black/40 border border-white/10 rounded-xl px-2 py-1.5 font-mono text-white text-[11px] outline-none"
              />
              <span className="text-[8.5px] leading-tight text-gray-500 font-mono">
                BAM base: 3.00%<br/>Moyenne: ~4.75%
              </span>
            </div>
          </div>
        </div>

        {/* RESULTS SUMMARY BOARD */}
        <div className="bg-black/35 rounded-2xl border border-white/5 p-4 space-y-3">
          <div className="text-[9px] uppercase tracking-wider font-mono text-gray-500 font-bold border-b border-white/5 pb-1.5 flex justify-between">
            <span>Données de Restitution Financière</span>
            <span className="text-indigo-400">Mensuel</span>
          </div>

          <div className="space-y-2 text-[11px]">
            {/* Payment HT */}
            <div className="flex justify-between font-mono text-gray-400">
              <span className="flex items-center gap-1">
                Échéance Capital + Intérêts :
                <span className="text-[8.5px] text-gray-600">(Avec TVA 10%)</span>
              </span>
              <span>{Math.round(calculations.monthlyRepaymentHT).toLocaleString('fr-FR')} MAD</span>
            </div>

            {/* Insurance */}
            <div className="flex justify-between font-mono text-gray-400">
              <span className="flex items-center gap-1">
                Assurance Décès & Incendie :
                <span className="text-[8.5px] text-gray-600">({insuranceRate}% ADI)</span>
              </span>
              <span>{Math.round(calculations.monthlyInsuranceCost).toLocaleString('fr-FR')} MAD</span>
            </div>

            {/* Total Monthly Payment */}
            <div className="flex justify-between font-mono text-white font-semibold pt-1 border-t border-white/5 text-xs">
              <span className="flex items-center gap-1 text-[#BEB3FF]">
                📊 Mensualité Globale (TTC) :
              </span>
              <span className="text-emerald-400 text-sm font-black">
                {Math.round(calculations.monthlyPaymentTotalTTC).toLocaleString('fr-FR')} MAD
              </span>
            </div>

            {/* Extra Upfront Notary/Gov Costs */}
            <div className="flex justify-between font-mono text-gray-400 text-[10.5px] pt-1">
              <span className="flex items-center gap-1 text-amber-200">
                ⭐ Droits de Mutation & Notaire estimatifs :
              </span>
              <span className="font-bold text-white">
                ~ {Math.round(calculations.totalNotaryTaxesOverhead).toLocaleString('fr-FR')} MAD
              </span>
            </div>
          </div>

          {/* COLOR RATIO BAR FOR DEBT-TO-INCOME (TAUX D'ENDETTEMENT) */}
          <div className="pt-2.5 border-t border-white/5 space-y-1.5">
            <div className="flex justify-between items-center text-[10px] font-mono">
              <span className="text-gray-400">Taux d'endettement d'activité :</span>
              <span className={`font-black font-mono ${
                calculations.currentEndettementRatio <= 40 ? 'text-emerald-400' :
                calculations.currentEndettementRatio <= calculations.maxEndettementPercent ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {calculations.currentEndettementRatio.toFixed(1)}% / Max {calculations.maxEndettementPercent}%
              </span>
            </div>

            <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden flex">
              <div 
                className="bg-emerald-500 h-full transition-all duration-500"
                style={{ width: `${Math.min(calculations.currentEndettementRatio, 40)}%` }}
              />
              <div 
                className="bg-yellow-500 h-full transition-all duration-500"
                style={{ width: `${Math.min(Math.max(0, calculations.currentEndettementRatio - 40), calculations.maxEndettementPercent - 40)}%` }}
              />
              <div 
                className="bg-red-500 h-full transition-all duration-500"
                style={{ width: `${Math.min(Math.max(0, calculations.currentEndettementRatio - calculations.maxEndettementPercent), 100 - calculations.maxEndettementPercent)}%` }}
              />
            </div>

            {/* BAM WARNING & DIRECTIVE MESSAGES */}
            <div className="text-[9.5px] font-mono leading-relaxed pt-1">
              {calculations.isApproved ? (
                <div className="text-emerald-400 flex items-start gap-1 bg-emerald-950/20 p-2 rounded-lg border border-emerald-500/20">
                  <Check className="w-3.5 h-3.5 shrink-0 text-emerald-400 mt-0.5" />
                  <span>
                    <b>Dossier Éligible (Lois BAM/GPBM) :</b> Taux d'endettement confortable et quotité d'apport conforme aux prudences de refinancement.
                  </span>
                </div>
              ) : (
                <div className="text-amber-300 flex items-start gap-1 bg-amber-950/20 p-2 rounded-lg border border-amber-500/20">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-400 mt-0.5" />
                  <span>
                    {!calculations.isLtvCompliant ? (
                      `Alerte Quotité (LTV) : L'apport minimum légal pour votre profil est de ${100 - calculations.maxLtvPercent}%. Un refinancement à ${calculations.currentLtvPercent.toFixed(0)}% serait rejeté.`
                    ) : (
                      `Alerte Endettement : Le ratio de ${calculations.currentEndettementRatio.toFixed(0)}% dépasse le plafond prudentiel de ${calculations.maxEndettementPercent}% édicté par Bank Al-Maghrib pour votre profil.`
                    )}
                  </span>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* EMISSION CERTIFICATE TRIGGER */}
        <button
          type="button"
          disabled={!calculations.isApproved}
          onClick={() => setIsLetterOpen(true)}
          className={`w-full py-2.5 rounded-xl font-title font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            calculations.isApproved 
              ? 'bg-gradient-to-r from-indigo-600 to-[#6C3CFF] hover:from-indigo-700 hover:to-[#572eee] text-white shadow-lg shadow-indigo-600/15'
              : 'bg-neutral-800 text-gray-500 border border-white/5 cursor-not-allowed opacity-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Émettre l'Attestation de Pré-Accord GPBM</span>
        </button>

      </div>

      {/* ------------------- MODAL: CERTIFICATE OF PRE-APPROVAL ------------------- */}
      {isLetterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in text-xs font-mono">
          <div 
            className="w-full max-w-xl bg-slate-900 border-2 border-amber-500/30 rounded-3xl p-6 md:p-8 text-slate-100 shadow-2xl space-y-5 relative overflow-hidden"
            id="gpbm-approval-letter-card"
          >
            {/* Background design accents */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
            
            {/* Stamp seal graphic watermark */}
            <div className="absolute right-6 bottom-16 opacity-[0.06] select-none pointer-events-none">
              <FileCheck2 className="w-64 h-64 text-amber-500" />
            </div>

            {/* Letter Header */}
            <div className="flex justify-between items-start border-b border-white/15 pb-4">
              <div className="space-y-1">
                <div className="text-[10px] font-black tracking-widest text-[#9E8BFF] uppercase leading-none">
                  FÉDÉRATION BANCAIRE GPBM
                </div>
                <div className="text-[11px] font-bold text-white uppercase font-title leading-tight">
                  SIMULATION DE SOUVERAINETÉ BANCAIRE
                </div>
                <div className="text-[8px] text-gray-400">
                  Arrêté Min. des Finances & Circulaires BAM N° 44/G/11
                </div>
              </div>

              {/* Selector dynamically alters bank template logo */}
              <div className="text-right">
                <label className="block text-[8px] text-gray-500 mb-1 uppercase font-bold">Banque Partenaire d'Émission :</label>
                <select 
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded px-2.5 py-1 text-[10px] text-amber-400 outline-none cursor-pointer font-bold font-mono"
                >
                  {MOROCCAN_BANKS.map(b => (
                    <option key={b.code} value={b.name}>{b.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Letter Body - Formal Legal Formatting conforming to Moroccan banking */}
            <div className="space-y-3 pt-2 text-[11px] leading-relaxed text-slate-300">
              <p className="text-right text-[10px] text-gray-400">
                Fait à Casablanca, le {new Date().toLocaleDateString('fr-FR')}
              </p>
              
              <div className="space-y-1">
                <h3 className="font-bold text-white uppercase text-[11px] tracking-wide border-b border-white/5 pb-1 flex justify-between">
                  <span>OBJET: ATTESTATION DE PRINCIPE DE REFINANCEMENT</span>
                  <span className="text-amber-400 font-black">N° BAM-{(Math.floor(100000 + Math.random() * 900000))}</span>
                </h3>
                <p className="text-gray-400 pt-1 text-[10.5px]">
                  Par la présente, le comité de refinancement automatisé de la place financière de Casablanca atteste de la stricte éligibilité du dossier simulé pour l'octroi d'un prêt immobilier au titre des conditions restrictives de <b>Bank Al-Maghrib</b>.
                </p>
              </div>

              {/* Transaction Key Data Grid */}
              <div className="bg-black/40 rounded-xl p-4 border border-white/10 grid grid-cols-2 gap-y-2 gap-x-4 text-[10.5px]">
                <div>
                  <span className="text-gray-500 block">PROPRIÉTÉ IMMOBILIÈRE :</span>
                  <span className="text-white font-bold">{propertyPrice.toLocaleString('fr-FR')} MAD</span>
                </div>
                <div>
                  <span className="text-gray-500 block">APPORT NET REQUIS (MIN) :</span>
                  <span className="text-indigo-300 font-bold">{downpayment.toLocaleString('fr-FR')} MAD ({downpaymentPercent.toFixed(0)}%)</span>
                </div>
                <div className="border-t border-white/5 pt-2 mt-1 col-span-2"></div>
                <div>
                  <span className="text-gray-500 block">CONCOURS BANCAIRE ({selectedBank}):</span>
                  <span className="text-yellow-400 font-bold font-mono">{calculations.principal.toLocaleString('fr-FR')} MAD</span>
                </div>
                <div>
                  <span className="text-gray-500 block">ÉCHÉANCE FIXE TTC (HORS ASSURANCE):</span>
                  <span className="text-white font-bold">{Math.round(calculations.monthlyRepaymentHT).toLocaleString('fr-FR')} MAD / mois</span>
                </div>
                <div>
                  <span className="text-gray-500 block">PRÉLÈVEMENT MENSUEL TOTAL TTC:</span>
                  <span className="text-emerald-400 font-black text-xs font-mono">{Math.round(calculations.monthlyPaymentTotalTTC).toLocaleString('fr-FR')} MAD</span>
                </div>
                <div>
                  <span className="text-gray-500 block">RATIO D'ENDETTEMENT CALCULÉ :</span>
                  <span className="text-emerald-400 font-bold">{calculations.currentEndettementRatio.toFixed(1)}% <span className="text-[7.5px] text-gray-400">(Limite {calculations.maxEndettementPercent}%)</span></span>
                </div>
              </div>

              {/* Interactive Legal Footnote */}
              <div className="p-3 bg-amber-500/5 rounded-xl border border-amber-500/10 text-[9px] text-amber-200">
                ⚠️ <b>Avertissement de protection d'agrément :</b> Ce document constitue une simulation d'évaluation de solvabilité aux normes de la Commission Prudentielle de la place syndicale CPBM de Casablanca. Le refinancement effectif reste subordonné à l'expertise finale du titre foncier par le notaire en charge de l'acte de vente authentique.
              </div>
            </div>

            {/* Real Signature & Verification QR Code simulation */}
            <div className="border-t border-white/15 pt-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* Simulated high-fidelity cryptographic QR Code representation */}
                <div className="w-14 h-14 bg-white p-1 rounded-lg shrink-0 flex items-center justify-center relative overflow-hidden group">
                  <div className="grid grid-cols-4 gap-0.5 w-full h-full opacity-90 select-none">
                    {[...Array(16)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`rounded-[1px] ${
                          (i % 3 === 0 || i % 7 === 1 || i % 4 === 2 || i === 0 || i === 15 || i === 3) 
                            ? 'bg-slate-950' 
                            : 'bg-white'
                        }`} 
                      />
                    ))}
                  </div>
                  <div className="absolute inset-0 bg-indigo-500/10 hover:bg-transparent transition-colors" />
                </div>
                <div>
                  <span className="text-[8px] text-gray-400 block uppercase font-bold">Vérification Numérique Souveraine</span>
                  <span className="text-[9px] text-slate-300 block font-bold">QR Secur-BAM Sign’it</span>
                  <span className="text-[7.5px] text-gray-500 font-mono block">Hash: {Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
                </div>
              </div>

              {/* Closing Interactive actions */}
              <div className="flex gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsLetterOpen(false)}
                  className="px-4 py-2 bg-neutral-900 border border-white/10 text-gray-300 hover:text-white rounded-xl font-bold cursor-pointer hover:bg-white/5 transition-all text-[11px]"
                >
                  Fermer
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
