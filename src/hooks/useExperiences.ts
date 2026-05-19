"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/supabase/client";
import type { Experience } from "@/data/experiences";

interface UseExperiencesOptions {
  category?: string;
  featured?: boolean;
  search?: string;
  page?: number;
  pageSize?: number;
}

interface UseExperiencesResult {
  data: Experience[];
  isLoading: boolean;
  error: Error | null;
  total: number;
  page: number;
  hasMore: boolean;
  refetch: () => void;
}

export function useExperiences(options: UseExperiencesOptions = {}): UseExperiencesResult {
  const {
    category,
    featured,
    search,
    page = 1,
    pageSize = 6,
  } = options;

  const [data, setData] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);

  const fetchExperiences = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from("experiences_escapamex")
        .select("*", { count: "exact" });

      // 🔎 búsqueda (title + category + location)
      if (search) {
        query = query.or(
          `title.ilike.%${search}%,category.ilike.%${search}%,location.ilike.%${search}%`
        );
      }

      // 📂 filtro por categoría
      if (category) {
        query = query.ilike("category", category);
      }

      // ⭐ featured
      if (featured !== undefined) {
        query = query.eq("featured", featured);
      }

      // 📄 paginación
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      query = query.range(from, to).order("created_at", { ascending: false });

      const { data, error, count } = await query;

      if (error) throw error;

      setData((data as Experience[]) || []);
      setTotal(count || 0);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Error al cargar experiencias"));
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [category, featured, search, page, pageSize]);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  return {
    data,
    isLoading,
    error,
    total,
    page,
    hasMore: page * pageSize < total,
    refetch: fetchExperiences,
  };
}
