import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export const useSezone = () => {
  const [sezone, setSezone] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    pocetak: "",
    kraj: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState(null);

  const [ranking, setRanking] = useState([]);
  const [sezonaInfo, setSezonaInfo] = useState("");

  const navigate = useNavigate();

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const fetchSezone = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await api.get("/sezone", {
        params: {
          ...filters,
          page: currentPage,
        },
      });

      setSezone(data.data);
      setPaginationMeta(data.meta);
    } catch (err) {
      setError("Greška pri učitavanju sezona");
    } finally {
      setLoading(false);
    }
  };

  const createSezona = async (formData) => {
    setLoading(true);
    setError("");

    try {
      await api.post("/sezone", formData);
      navigate("/sezone");
    } catch (err) {
      setError(err?.message || "Došlo je do greške prilikom kreiranja sezone");
    } finally {
      setLoading(false);
    }
  };

  const fetchRangLista = async (id) => {
    setLoading(true);
    setError("");

    try {
      const data = await api.get(`/rezultati/${id}/rang-lista-sezone`);

      setRanking(data.data);
      setSezonaInfo(data.sezona_period);
    } catch (err) {
      setError("Greška pri učitavanju rang liste");
    } finally {
      setLoading(false);
    }
  };

  return {
    sezone,
    loading,
    error,

    filters,
    updateFilters,

    currentPage,
    setCurrentPage,
    paginationMeta,

    ranking,
    sezonaInfo,

    fetchSezone,
    createSezona,
    fetchRangLista,
  };
};
