import { useState, useEffect, useCallback, useMemo } from 'react';
import { Property, FilterState } from '../types';
import { fetchPropertiesWithFilters, sortProperties } from '../supabase/queries';

const INITIAL_FILTERS: FilterState = {
  search: '',
  neighborhoods: [],
  minPrice: 0,
  maxPrice: 15000,
  is_pet_friendly: false,
  has_washer: false,
  has_parking: false,
  has_gym: false,
  has_pool: false,
};

export type SortOption = 'newest' | 'price-low' | 'price-high';

export function usePropertyViewModel() {
  // --- State ---
  const [properties, setProperties] = useState<Property[]>([]);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Logic ---
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: supabaseError } = await fetchPropertiesWithFilters(filters);

      if (supabaseError) {
        setError(supabaseError.message || 'Failed to fetch properties');
        setProperties([]);
      } else {
        let result = data || [];
        
        // Handle empty results
        if (result.length === 0) {
          console.log('No properties match the current filter criteria');
        }
        
        // Apply sorting
        result = sortProperties(result, sortBy);

        setProperties(result);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setProperties([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchProperties();
    }, 300);

    return () => clearTimeout(debounce);
  }, [fetchProperties]);

  // --- Commands ---
  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    setSortBy('newest');
  }, []);

  // --- Computed Properties ---
  const resultCount = useMemo(() => properties.length, [properties]);
  const isEmpty = useMemo(() => properties.length === 0 && !loading, [properties, loading]);
  const hasFiltersActive = useMemo(() => {
    return JSON.stringify(filters) !== JSON.stringify(INITIAL_FILTERS) || sortBy !== 'newest';
  }, [filters, sortBy]);
  const emptyStateMessage = useMemo(() => {
    if (loading) return null;
    if (error) return 'An error occurred while fetching properties. Please try again.';
    if (isEmpty && hasFiltersActive) return 'No properties match your criteria';
    if (isEmpty) return 'No properties available';
    return null;
  }, [isEmpty, loading, error, hasFiltersActive]);

  return {
    // Data
    properties,
    filters,
    sortBy,
    loading,
    error,
    resultCount,
    isEmpty,
    emptyStateMessage,
    hasFiltersActive,
    
    // Actions
    setFilters,
    setSortBy,
    updateFilters,
    resetFilters,
    refresh: fetchProperties
  };
}
