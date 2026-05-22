import calmPet from '../assets/emotion-characters/good/calm.webp'
import contentPet from '../assets/emotion-characters/good/content.webp'
import emptyMindPet from '../assets/emotion-characters/good/empty_mind.webp'
import moviePet from '../assets/emotion-characters/good/movie.webp'
import napPet from '../assets/emotion-characters/good/nap.webp'
import readingPet from '../assets/emotion-characters/good/reading.webp'
import relaxedPet from '../assets/emotion-characters/good/relaxed.webp'
import restPet from '../assets/emotion-characters/good/rest.webp'
import smoothPet from '../assets/emotion-characters/good/smooth.webp'

export interface EmotionDesktopPetConfig {
  src: string
  motion: 'calm' | 'float' | 'soft' | 'sleepy' | 'focus'
}

const GOOD_DESKTOP_PETS: Record<string, EmotionDesktopPetConfig> = {
  calm: { src: calmPet, motion: 'calm' },
  empty_mind: { src: emptyMindPet, motion: 'soft' },
  smooth: { src: smoothPet, motion: 'float' },
  movie: { src: moviePet, motion: 'calm' },
  content: { src: contentPet, motion: 'soft' },
  rest: { src: restPet, motion: 'sleepy' },
  relaxed: { src: relaxedPet, motion: 'soft' },
  nap: { src: napPet, motion: 'sleepy' },
  reading: { src: readingPet, motion: 'focus' },
}

export function getEmotionDesktopPetByStateId(stateId: string | null | undefined) {
  if (!stateId) return null
  return GOOD_DESKTOP_PETS[stateId] ?? null
}
