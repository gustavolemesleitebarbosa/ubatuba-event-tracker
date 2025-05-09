export const EVENT_CATEGORIES = [
  'Music',
  'Sports',
  'Education',
  'Food',
  'Art',
  'Literature',
  'Surf'
] as const;

export const CategoryColors: Record<EventCategory, string> = {
  'Music': 'bg-blue-500',
  'Sports': 'bg-red-500',
  'Education': 'bg-green-500',
  'Food': 'bg-yellow-500',
  'Art': 'bg-purple-500',
  'Literature': 'bg-orange-500',
  'Surf': 'bg-teal-500'
}

export const CategoryTranslations: Record<EventCategory, string> = {
  'Music': 'Música',
  'Sports': 'Esportes',
  'Education': 'Educação',
  'Food': 'Comida',
  'Art': 'Arte',
  'Literature': 'Literatura',
  'Surf': 'Surfe'
}

export type EventCategory = typeof EVENT_CATEGORIES[number];

// Helper function to check if a string is a valid category
export function isValidCategory(category: string): category is EventCategory {
  return EVENT_CATEGORIES.includes(category as EventCategory);
} 