import React, { lazy, Suspense } from 'react';
import { LanguageCode } from '../../data/translations';
import { CityEvent } from '../../types';

const MyLifeLazy = lazy(() => import('./MyLife'));

interface MyLifeProps {
  currentLang?: LanguageCode;
  events?: CityEvent[];
  onPostReview?: (eventId: string, rating: number, comment: string) => void;
  onPostLike?: (eventId: string) => void;
  onSelectEventOnMap?: (evt: CityEvent) => void;
  defaultLifeTab?: 'PROVIDERS' | 'AGENDA';
  defaultCategoryId?: number;
}

export default function MyLifeAdapter({ 
  currentLang = 'FR',
  events,
  onPostReview,
  onPostLike,
  onSelectEventOnMap,
  defaultLifeTab,
  defaultCategoryId
}: MyLifeProps) {
  return (
    <Suspense 
      fallback={
        <div id="my-life-loading" className="w-full bg-[#161821]/60 border border-white/5 rounded-3xl p-12 flex flex-col items-center justify-center gap-4 animate-pulse">
          <div className="w-10 h-10 rounded-full border-t-2 border-[#d4af7a] animate-spin"></div>
          <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">
            {currentLang === 'AR' ? 'جاري تحميل فضاء حياتي...' : 'Chargement de l\'espace MyLife...'}
          </span>
        </div>
      }
    >
      <MyLifeLazy 
        currentLang={currentLang}
        events={events}
        onPostReview={onPostReview}
        onPostLike={onPostLike}
        onSelectEventOnMap={onSelectEventOnMap}
        defaultLifeTab={defaultLifeTab}
        defaultCategoryId={defaultCategoryId}
      />
    </Suspense>
  );
}
