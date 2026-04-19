import { useState, useEffect, useCallback } from "react";
import api from "../api";

export const useDogadjaji = (sezonaId) => {
  const [dogadjaji, setDogadjaji] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginationMeta, setPaginationMeta] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ naziv: "", omiljeni: false });
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [podaci, setPodaci] = useState([]);
  const [naslovDogadjaja, setNaslovDogadjaja] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters((prev) => ({ ...prev, naziv: searchTerm }));
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const fetchDogadjaji = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/dogadjaj", {
        params: {
          sezona_id: sezonaId,
          naziv: filters.naziv,
          omiljeni: filters.omiljeni ? 1 : 0,
          page: currentPage,
        },
      });
      setDogadjaji(response.data);
      setPaginationMeta(response.meta);
    } catch (error) {
      console.error("Greška prilikom učitavanja događaja:", error);
    } finally {
      setLoading(false);
    }
  }, [sezonaId, filters, currentPage]);

  const createDogadjaj = async (formData) => {
    setLoading(true);
    setError("");
    try {
      await api.post("/dogadjaj", formData);
      return true;
    } catch (err) {
      console.log(err);
      setError(err.message || "Greška pri kreiranju događaja.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (dogadjajId) => {
    try {
      await api.post(`/dogadjaj/${dogadjajId}/favorites`);

      setDogadjaji((prev) =>
        prev.map((d) =>
          d.id === dogadjajId ? { ...d, is_favorite: !d.is_favorite } : d,
        ),
      );
    } catch (error) {
      console.error("Greška sa favoritima:", error);
    }
  };

  const fetchRangLista = async (dogadjajId) => {
    setLoading(true);
    try {
      const response = await api.get(
        `/rezultati/${dogadjajId}/rang-lista-dogadjaja`,
      );
      setPodaci(response.data);
      const naziv =
        response.data.message?.match(/"([^"]+)"/)?.[1] || "Rang Lista";
      setNaslovDogadjaja(naziv);
    } catch (error) {
      console.error("Greška pri učitavanju rang liste:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateScore = async (timId, dogadjajId, noviScore) => {
    setLoading(true);
    try {
      await api.patch("/rezultati", {
        tim_id: Number(timId),
        dogadjaj_id: Number(dogadjajId),
        score: Number(noviScore),
      });
      return { success: true };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Greška pri ažuriranju rezultata.";
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return {
    dogadjaji,
    error,
    loading,
    paginationMeta,
    currentPage,
    setCurrentPage,
    filters,
    updateFilters,
    searchTerm,
    podaci,
    naslovDogadjaja,
    setSearchTerm,
    toggleFavorite,
    fetchDogadjaji,
    createDogadjaj,
    fetchRangLista,
    updateScore,
  };
};
