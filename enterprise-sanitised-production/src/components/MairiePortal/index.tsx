import React, { lazy, Suspense } from 'react';
import { CitizenClaim, PharmacyDeGarde, HospitalStatus, CNDPPrivacyLog } from '../../types';
import { LanguageCode } from '../../data/translations';

// Lazy loader creates an isolated chunk bundle during the build.
// This allows true package compilation decoupling and future physical separation.
const MairiePortalLazy = lazy(() => import('./MairiePortal'));

interface MairiePortalProps {
  claims: CitizenClaim[];
  pharmacies: PharmacyDeGarde[];
  hospitals: HospitalStatus[];
  privacyLogs: CNDPPrivacyLog[];
  onUpdateClaimStatus: (claimId: string, newStatus: CitizenClaim['status'], reply?: string) => void;
  onAddLog: (action: string, details: string) => void;
  currentLang?: LanguageCode;
  onChangeUserRole?: (role: any) => void;
  onChangeActiveModule?: (module: 'URBAN' | 'MYHOME') => void;
  onOpenSqlSpec?: () => void;
  currentUserRole?: any;
}

export default function MairiePortalAdapter(props: MairiePortalProps) {
  return (
    <Suspense 
      fallback={
        <div id="mairie-portal-loading" className="w-full bg-[#161821]/60 border border-white/5 rounded-3xl p-12 flex flex-col items-center justify-center gap-4 animate-pulse">
          <div className="w-10 h-10 rounded-full border-t-2 border-[#6C3CFF] animate-spin"></div>
          <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">
            Chargement du portail Mairie...
          </span>
        </div>
      }
    >
      <MairiePortalLazy {...props} />
    </Suspense>
  );
}
