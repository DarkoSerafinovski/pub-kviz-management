import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { setSession } from "../auth/sessionStore";
import api from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSessionState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProfile = async (sessionUser) => {
    try {
      const res = await api.get("/auth/me");

      return {
        ...sessionUser,
        ...res,
      };
    } catch (err) {
      console.error("Greška pri fetch profila", err);
      return sessionUser;
    }
  };

  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();

      setSessionState(data.session);
      setSession(data.session);

      if (data.session?.user) {
        const fullUser = await fetchProfile(data.session.user);
        setUser(fullUser);
      } else {
        setUser(null);
      }

      setLoading(false);
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSessionState(session);
      setSession(session);

      if (session?.user) {
        const fullUser = await fetchProfile(session.user);

        setUser(fullUser);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setSessionState(data.session);
      setSession(data.session);

      const fullUser = await fetchProfile(data.user);

      setUser(fullUser);

      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password) => {
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      setSessionState(data.session);
      setSession(data.session);

      const fullUser = await fetchProfile(data.user);
      setUser(fullUser);

      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();

    setSessionState(null);
    setSession(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        error,
        login,
        register,
        logout,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};

export { AuthContext };
