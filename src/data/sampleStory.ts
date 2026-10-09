import { GeneratedStory, PhotoItem } from '../types/story';

// High-fidelity vector photographic canvases encoded as clean SVG data URLs
function createPhotographicSvg(
  title: string,
  gradient1: string,
  gradient2: string,
  accentColor: string,
  silhouetteType: 'beach' | 'graduation' | 'mountain' | 'celebration' | 'roadtrip' | 'campfire',
  caption: string
): string {
  let silhouetteSvg = '';
  if (silhouetteType === 'beach') {
    silhouetteSvg = `
      <ellipse cx="600" cy="500" rx="450" ry="80" fill="#1b2a4a" opacity="0.6"/>
      <circle cx="900" cy="220" r="110" fill="#fbbf24" opacity="0.85"/>
      <path d="M 0 540 Q 300 500 600 520 T 1200 530 L 1200 675 L 0 675 Z" fill="#0f172a"/>
      <path d="M 0 570 Q 350 540 700 560 T 1200 560 L 1200 675 L 0 675 Z" fill="#090d16"/>
      <!-- Silhouettes of two friends walking -->
      <circle cx="560" cy="460" r="14" fill="#05070a"/>
      <path d="M 552 475 L 568 475 L 565 530 L 555 530 Z" fill="#05070a"/>
      <circle cx="590" cy="465" r="13" fill="#05070a"/>
      <path d="M 583 480 L 597 480 L 595 530 L 585 530 Z" fill="#05070a"/>
    `;
  } else if (silhouetteType === 'graduation') {
    silhouetteSvg = `
      <!-- Sun rays -->
      <circle cx="600" cy="300" r="280" fill="#f59e0b" opacity="0.4"/>
      <!-- Campus arches -->
      <path d="M 100 675 L 100 350 Q 250 200 400 350 L 400 675 Z" fill="#1e1b4b" opacity="0.7"/>
      <path d="M 450 675 L 450 300 Q 600 150 750 300 L 750 675 Z" fill="#1e1b4b" opacity="0.8"/>
      <path d="M 800 675 L 800 350 Q 950 200 1100 350 L 1100 675 Z" fill="#1e1b4b" opacity="0.7"/>
      <!-- Graduation caps flying -->
      <polygon points="560,180 620,160 640,190 580,210" fill="#0f172a"/>
      <polygon points="400,210 450,195 470,220 420,235" fill="#0f172a"/>
      <polygon points="760,190 820,175 840,200 780,215" fill="#0f172a"/>
      <!-- Celebrants -->
      <circle cx="520" cy="450" r="16" fill="#090d16"/>
      <path d="M 505 466 L 535 466 L 530 560 L 510 560 Z" fill="#090d16"/>
      <circle cx="680" cy="445" r="16" fill="#090d16"/>
      <path d="M 665 461 L 695 461 L 690 560 L 670 560 Z" fill="#090d16"/>
    `;
  } else if (silhouetteType === 'mountain') {
    silhouetteSvg = `
      <!-- Mountain ridges -->
      <polygon points="200,160 480,675 -80,675" fill="#1e1b4b" opacity="0.85"/>
      <polygon points="650,110 980,675 320,675" fill="#0f172a"/>
      <polygon points="980,220 1300,675 700,675" fill="#1e293b" opacity="0.9"/>
      <!-- Climber with backpack -->
      <circle cx="480" cy="380" r="14" fill="#fbbf24"/>
      <path d="M 470 395 L 490 395 L 485 450 L 475 450 Z" fill="#f8fafc"/>
      <polygon points="455,400 470,395 470,430 455,420" fill="#f59e0b"/>
    `;
  } else if (silhouetteType === 'celebration') {
    silhouetteSvg = `
      <!-- Warm string lights -->
      <path d="M 50 120 Q 300 200 600 140 T 1150 160" stroke="#fef08a" stroke-width="3" fill="none" opacity="0.7"/>
      <circle cx="200" cy="165" r="9" fill="#fde047"/>
      <circle cx="380" cy="180" r="10" fill="#fde047"/>
      <circle cx="580" cy="145" r="9" fill="#fde047"/>
      <circle cx="780" cy="155" r="11" fill="#fde047"/>
      <circle cx="980" cy="160" r="9" fill="#fde047"/>
      <!-- Banquet table & friends raising a toast -->
      <rect x="250" y="470" width="700" height="150" rx="16" fill="#1e1b4b" opacity="0.85"/>
      <circle cx="360" cy="400" r="16" fill="#f8fafc" opacity="0.9"/>
      <circle cx="500" cy="390" r="16" fill="#f8fafc" opacity="0.9"/>
      <circle cx="680" cy="390" r="16" fill="#f8fafc" opacity="0.9"/>
      <circle cx="820" cy="400" r="16" fill="#f8fafc" opacity="0.9"/>
    `;
  } else if (silhouetteType === 'roadtrip') {
    silhouetteSvg = `
      <!-- Sunset horizon and desert road -->
      <circle cx="600" cy="380" r="160" fill="#f97316" opacity="0.7"/>
      <polygon points="600,380 0,675 1200,675" fill="#0f172a"/>
      <path d="M 590 380 L 595 675 L 605 675 L 610 380 Z" fill="#fbbf24" opacity="0.8"/>
      <!-- Vintage camper van -->
      <rect x="520" y="430" width="160" height="100" rx="12" fill="#38bdf8"/>
      <rect x="540" y="445" width="45" height="35" rx="4" fill="#0f172a"/>
      <rect x="615" y="445" width="45" height="35" rx="4" fill="#0f172a"/>
      <circle cx="555" cy="535" r="22" fill="#020617"/>
      <circle cx="645" cy="535" r="22" fill="#020617"/>
    `;
  } else {
    // Campfire starlight
    silhouetteSvg = `
      <!-- Pines -->
      <polygon points="150,220 230,675 70,675" fill="#064e3b" opacity="0.8"/>
      <polygon points="1050,200 1150,675 950,675" fill="#064e3b" opacity="0.8"/>
      <!-- Campfire glow -->
      <circle cx="600" cy="540" r="90" fill="#f97316" opacity="0.5"/>
      <polygon points="570,550 630,550 600,470" fill="#facc15"/>
      <polygon points="585,550 625,550 605,490" fill="#ef4444"/>
      <!-- Sitting figures -->
      <circle cx="480" cy="500" r="15" fill="#f8fafc"/>
      <circle cx="720" cy="500" r="15" fill="#f8fafc"/>
    `;
  }

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${gradient1}" />
        <stop offset="100%" stop-color="${gradient2}" />
      </linearGradient>
      <linearGradient id="overlayVignette" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stop-color="#000000" stop-opacity="0.3" />
        <stop offset="60%" stop-color="#000000" stop-opacity="0.1" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0.8" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <rect width="1200" height="675" fill="url(#bgGrad)" />
    ${silhouetteSvg}
    <rect width="1200" height="675" fill="url(#overlayVignette)" />
    <!-- Cinematic banner elements -->
    <text x="60" y="80" fill="${accentColor}" font-family="Plus Jakarta Sans, sans-serif" font-weight="700" font-size="20" letter-spacing="4" text-transform="uppercase">${title}</text>
    <text x="60" y="610" fill="#ffffff" font-family="Playfair Display, Georgia, serif" font-style="italic" font-weight="600" font-size="28" opacity="0.92">"${caption}"</text>
  </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}

export const SAMPLE_PHOTOS: PhotoItem[] = [
  {
    id: 'sample-photo-1',
    filename: '01_pacific_coastline_beginning.jpg',
    mimeType: 'image/jpeg',
    sizeBytes: 1024 * 420,
    order: 0,
    dataUrl: createPhotographicSvg(
      'CHAPTER I • THE DEPARTURE',
      '#1e1b4b',
      '#312e81',
      '#818cf8',
      'roadtrip',
      'Packed our bags with dreams, highway rolling toward the Pacific horizon.'
    ),
    analysis: {
      description: 'Vintage road trip camper heading out into open landscape at dusk.',
      objectsActivities: ['camper van', 'coastal highway', 'luggage', 'sunset road'],
      sceneSetting: 'Scenic highway overlooking golden hills and sunset horizon',
      ageGroupOrEra: 'Young adults / modern era',
      visualMood: 'Nostalgic, hopeful, adventurous',
      potentialChapter: 'The Departure',
      confidence: 'high',
    },
    customCaption: 'Packed our bags with dreams, highway rolling toward the horizon.',
    durationSeconds: 4,
  },
  {
    id: 'sample-photo-2',
    filename: '02_golden_hour_ocean_cliffs.jpg',
    mimeType: 'image/jpeg',
    sizeBytes: 1024 * 510,
    order: 1,
    dataUrl: createPhotographicSvg(
      'CHAPTER I • COASTAL SHORES',
      '#0c4a6e',
      '#0369a1',
      '#38bdf8',
      'beach',
      'Footprints in the damp sand, listening to the eternal rhythm of tides.'
    ),
    analysis: {
      description: 'Two friends walking barefoot along the golden-hour coastline.',
      objectsActivities: ['ocean waves', 'two friends walking', 'golden sand', 'distant seagulls'],
      sceneSetting: 'Expansive Pacific beach at late afternoon golden hour',
      ageGroupOrEra: 'Twenties / lifelong friends',
      visualMood: 'Serene, intimate, timeless',
      potentialChapter: 'Uncharted Waters',
      confidence: 'high',
    },
    customCaption: 'Footprints in the sand, listening to the rhythm of the tides.',
    durationSeconds: 4,
  },
  {
    id: 'sample-photo-3',
    filename: '03_alpine_peak_summit.jpg',
    mimeType: 'image/jpeg',
    sizeBytes: 1024 * 630,
    order: 2,
    dataUrl: createPhotographicSvg(
      'CHAPTER II • REACHING HIGHER',
      '#14532d',
      '#166534',
      '#4ade80',
      'mountain',
      'Steep trails conquered together, overlooking valleys draped in clouds.'
    ),
    analysis: {
      description: 'Backpacker triumphantly standing upon a sharp granite mountain summit.',
      objectsActivities: ['mountain peak', 'hiking gear', 'panoramic view', 'cloud sea'],
      sceneSetting: 'High elevation alpine ridge above the clouds',
      ageGroupOrEra: 'Young adult hikers',
      visualMood: 'Triumphant, awe-inspiring, resilient',
      potentialChapter: 'Climbing Mountains',
      confidence: 'high',
    },
    customCaption: 'Steep trails conquered together, breathless above the clouds.',
    durationSeconds: 4,
  },
  {
    id: 'sample-photo-4',
    filename: '04_twilight_starlit_campfire.jpg',
    mimeType: 'image/jpeg',
    sizeBytes: 1024 * 480,
    order: 3,
    dataUrl: createPhotographicSvg(
      'CHAPTER II • EMBERS & STORIES',
      '#451a03',
      '#78350f',
      '#fb923c',
      'campfire',
      'Sparks rising into the pine canopy, swapping stories that outlasted the cold.'
    ),
    analysis: {
      description: 'Campfire glowing warmly under a starlit pine forest canopy.',
      objectsActivities: ['campfire flame', 'pine trees', 'hot mugs', 'storytelling circle'],
      sceneSetting: 'Wilderness campsite under the Milky Way',
      ageGroupOrEra: 'Close friends group',
      visualMood: 'Warm, cozy, heartfelt',
      potentialChapter: 'Stories By The Fire',
      confidence: 'high',
    },
    customCaption: 'Sparks rising into the canopy, swapping memories late into the night.',
    durationSeconds: 4,
  },
  {
    id: 'sample-photo-5',
    filename: '05_celebration_milestone_dinner.jpg',
    mimeType: 'image/jpeg',
    sizeBytes: 1024 * 550,
    order: 4,
    dataUrl: createPhotographicSvg(
      'CHAPTER III • CELEBRATION',
      '#581c87',
      '#6b21a8',
      '#c084fc',
      'celebration',
      'Laughter spilling over warm string lights, raising glasses to the milestone.'
    ),
    analysis: {
      description: 'Festive outdoor evening dinner party with string lights and raised glasses.',
      objectsActivities: ['patio lights', 'dinner celebration', 'toasting drinks', 'laughter'],
      sceneSetting: 'Enchanted backyard terrace dining under lantern glow',
      ageGroupOrEra: 'Family & cherished friends',
      visualMood: 'Joyful, vibrant, grateful',
      potentialChapter: 'A Toast to Tomorrow',
      confidence: 'high',
    },
    customCaption: 'Laughter spilling over string lights, raising glasses to how far we came.',
    durationSeconds: 4,
  },
  {
    id: 'sample-photo-6',
    filename: '06_commencement_graduation_arch.jpg',
    mimeType: 'image/jpeg',
    sizeBytes: 1024 * 580,
    order: 5,
    dataUrl: createPhotographicSvg(
      'CHAPTER III • THE HORIZON CALLS',
      '#1e1b4b',
      '#2e1065',
      '#e879f9',
      'graduation',
      'Caps tossed in the morning light, stepping boldly into the next chapter.'
    ),
    analysis: {
      description: 'Graduates tossing caps beneath historic arches on a bright morning.',
      objectsActivities: ['graduation caps', 'historic arches', 'embrace', 'diplomas'],
      sceneSetting: 'Sunlit university quadrangle with towering brick arches',
      ageGroupOrEra: 'College graduates entering adulthood',
      visualMood: 'Proud, visionary, inspiring',
      potentialChapter: 'New Horizons',
      confidence: 'high',
    },
    customCaption: 'Caps tossed into the morning sky, stepping boldly toward tomorrow.',
    durationSeconds: 4,
  },
];

export const SAMPLE_STORY: GeneratedStory = {
  id: 'sample-odyssey-story',
  title: 'Wanderers of the Sun: A Journey of Miles and Milestones',
  summary:
    'A cinematic chronicle following five friends across six unforgettable chapters: from the first highway departure to mountaintop triumphs and the dawn of new horizons.',
  style: 'cinematic',
  photos: SAMPLE_PHOTOS,
  settings: {
    duration: '60s',
    narrationEnabled: true,
    voiceName: 'Kore',
    musicMood: 'uplifting',
    aspectRatio: '16:9',
    transitionStyle: 'crossfade',
    captionStyle: 'elegant',
    narrationVolume: 0.85,
    musicVolume: 0.35,
  },
  chapters: [
    {
      id: 'ch-1',
      title: 'Chapter I: Where The Road Calls',
      theme: 'Departure & Open Roads',
      photoIds: ['sample-photo-1', 'sample-photo-2'],
      narration:
        'Every defining journey begins with a single turn onto the open road. With packed bags and unwritten days ahead, the coastline welcomed us with rolling tides and boundless promise.',
      captions: {
        'sample-photo-1': 'Packed our bags with dreams, highway rolling toward the horizon.',
        'sample-photo-2': 'Footprints in the sand, listening to the rhythm of the tides.',
      },
      suggestedMusicMood: 'uplifting',
    },
    {
      id: 'ch-2',
      title: 'Chapter II: Heights and Ember Whispers',
      theme: 'Wilderness Resilience',
      photoIds: ['sample-photo-3', 'sample-photo-4'],
      narration:
        'We traded ocean spray for jagged granite summits. And when night fell cold over the pine forest, the amber fire held our deepest stories, glowing long after the sparks dissolved into the stars.',
      captions: {
        'sample-photo-3': 'Steep trails conquered together, breathless above the clouds.',
        'sample-photo-4': 'Sparks rising into the canopy, swapping memories late into the night.',
      },
      suggestedMusicMood: 'emotional',
    },
    {
      id: 'ch-3',
      title: 'Chapter III: Toasts and Tomorrow',
      theme: 'Milestones & New Beginnings',
      photoIds: ['sample-photo-5', 'sample-photo-6'],
      narration:
        'Years of striving distilled into an evening of unfiltered laughter and raised glasses. Under the morning arches, we flung our caps skyward—ready for whatever chapters wait over the horizon.',
      captions: {
        'sample-photo-5': 'Laughter spilling over string lights, raising glasses to how far we came.',
        'sample-photo-6': 'Caps tossed into the morning sky, stepping boldly toward tomorrow.',
      },
      suggestedMusicMood: 'uplifting',
    },
  ],
  createdAt: new Date().toISOString(),
};
