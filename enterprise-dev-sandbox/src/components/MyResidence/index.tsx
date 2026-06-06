import React, { lazy, Suspense } from 'react';
import { LanguageCode } from '../../data/translations';

// Lazy loader creates an isolated chunk bundle during the build.
// This allows true package compilation decoupling and future physical separation.
const MyResidenceLazy = lazy(() => import('./MyResidence'));

interface MyResidenceProps {
  currentLang?: LanguageCode;
}

export default function MyResidenceAdapter({ currentLang = 'FR' }: MyResidenceProps) {
  return (
    <Suspense 
      fallback={
        <div id="my-residence-loading" className="w-full bg-[#161821]/60 border border-white/5 rounded-3xl p-12 flex flex-col items-center justify-center gap-4 animate-pulse">
          <div className="w-10 h-10 rounded-full border-t-2 border-[#6C3CFF] animate-spin"></div>
          <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">
            {currentLang === 'AR' ? 'جاري تحميل فضاء إقامتي...' : 'Chargement de l\'espace MyResidence...'}
          </span>
        </div>
      }
    >
      <MyResidenceLazy currentLang={currentLang} />
    </Suspense>
  );
}
