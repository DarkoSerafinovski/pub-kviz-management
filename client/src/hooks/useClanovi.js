import { useState } from "react";
import api from "../api";

export const useClanovi = () => {
  const [sviClanovi, setSviClanovi] = useState([]);
  const [trenutniClanovi, setTrenutniClanovi] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSviMoguciClanovi = async () => {
    setLoading(true);
    try {
      const res = await api.get("/timovi/clanovi/svi");

      setSviClanovi(res.data);
    } catch (e) {
      console.error("Greška pri dobavljanju svih članova:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrenutniClanovi = async (dogadjajId, timId) => {
    setLoading(true);
    try {
      const res = await api.get(`/dogadjaj/${dogadjajId}/tim/${timId}/clanovi`);
      const mapiraniClanovi = res.data.map((c) => ({
        ...c,
        isNew: false,
      }));
      setTrenutniClanovi(mapiraniClanovi);
    } catch (e) {
      console.error("Greška pri dobavljanju postave:", e);
      setTrenutniClanovi([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    sviClanovi,
    trenutniClanovi,
    loading,
    fetchSviMoguciClanovi,
    fetchTrenutniClanovi,
  };
};
