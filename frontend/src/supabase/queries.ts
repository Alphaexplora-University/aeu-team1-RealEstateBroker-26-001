import { supabase } from './client';
import { Property, FilterState } from '../types';

export async function fetchPropertiesWithFilters(filters: FilterState) {
  let query = supabase.from('properties').select('*');

 
  if (filters.search) {
    query = query.ilike('title', `%${filters.search}%`);
  }


  if (filters.neighborhoods.length > 0) {
    query = query.in('neighborhood', filters.neighborhoods);
  }

 
  query = query.gte('price', filters.minPrice).lte('price', filters.maxPrice);

  // Apply boolean feature filters (server-side)
  const booleanFeatures: (keyof FilterState)[] = [
    'is_pet_friendly',
    'has_washer',
    'has_parking',
    'has_gym',
    'has_pool',
  ];

  booleanFeatures.forEach((feature) => {
    if (filters[feature]) {
      query = query.eq(feature as keyof Property, true);
    }
  });

  return await query;
}


export function sortProperties(
  properties: Property[],
  sortBy: 'newest' | 'price-low' | 'price-high'
): Property[] {
  const result = [...properties];

  switch (sortBy) {
    case 'price-low':
      return result.sort((a, b) => a.price - b.price);
    case 'price-high':
      return result.sort((a, b) => b.price - a.price);
    case 'newest':
    default:
      return result; // Keep original order from database
  }
}


export async function fetchNeighborhoods() {
  const { data, error } = await supabase
    .from('properties')
    .select('neighborhood')
    .order('neighborhood');

  if (error) {
    console.error('Error fetching neighborhoods:', error);
    return [];
  }

  // Extract unique neighborhoods
  const neighborhoods = Array.from(
    new Set(data?.map((item: any) => item.neighborhood) || [])
  ) as string[];

  return neighborhoods.sort();
}


export async function fetchPriceRange() {
  const { data, error } = await supabase
    .from('properties')
    .select('price')
    .order('price', { ascending: true });

  if (error) {
    console.error('Error fetching price range:', error);
    return { minPrice: 0, maxPrice: 15000 };
  }

  if (!data || data.length === 0) {
    return { minPrice: 0, maxPrice: 15000 };
  }

  const prices = data.map((item: any) => item.price);
  return {
    minPrice: Math.min(...prices),
    maxPrice: Math.max(...prices),
  };
}
