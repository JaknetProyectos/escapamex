"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/supabase/client";
import type { Experience } from "@/data/experiences";
import { maptafiras } from "@/lib/tarifas";

interface UseExperienceResult {
  data: Experience | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useExperience(idOrSlug: string): UseExperienceResult {
  const [data, setData] = useState<Experience | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchExperience = useCallback(async () => {
    if (!idOrSlug) {
      setData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("experiences_escapamex")
        .select("*")
        .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
        .single();

      if (error) throw error;

      if (!data) {
        throw new Error("Experiencia no encontrada");
      }

      console.log(data)

      // Normalizar datos (por JSONB)
      const normalized: Experience = {
        ...data,
        tafiras: maptafiras(data.tafiras) ?? [],
        shortDescription: data.short_description,
        priceMax: data.price_max ?? undefined,
        images: data.images ?? [],
        included: data.included ?? [],
      };

      console.log(normalized)

      setData(normalized);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Error al cargar la experiencia"));
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [idOrSlug]);

  useEffect(() => {
    fetchExperience();
  }, [fetchExperience]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchExperience,
  };
}


export function useRelatedExperiences(experienceId: string, limit = 3) {
  const [data, setData] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      if (!experienceId) {
        setData([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        // 1. Obtener experiencia actual
        const { data: current, error: currentError } = await supabase
          .from("experiences_escapamex")
          .select("category")
          .eq("id", experienceId)
          .single();

        if (currentError || !current) throw currentError;

        // 2. Buscar relacionadas por categoría
        let { data: related, error } = await supabase
          .from("experiences_escapamex")
          .select("*")
          .eq("category", current.category)
          .neq("id", experienceId)
          .limit(limit);

        if (!related) {
          setData([])
          return;
        };

        if (error) throw error;

        // 3. Si faltan, completar con otras
        if (related.length < limit) {
          const { data: extra } = await supabase
            .from("experiences_escapamex")
            .select("*")
            .neq("id", experienceId)
            .limit(limit * 2); // traemos más para filtrar bien

          const combined = [...related, ...(extra || [])];

          // eliminar duplicados por id
          const unique = Array.from(
            new Map(combined.map(item => [item.id, item])).values()
          );

          related = unique.slice(0, limit);
        }

        const normalized = related.map((item) => ({
          ...item,
          shortDescription: item.short_description,
          priceMax: item.price_max ?? undefined,
          images: item.images ?? [],
          included: item.included ?? [],
        }));

        setData(normalized);
      } catch (err) {
        console.error(err);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelated();
  }, [experienceId, limit]);

  return { data, isLoading };
}