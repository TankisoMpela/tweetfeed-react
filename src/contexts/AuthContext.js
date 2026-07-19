import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        setTimeout(async () => {
          await fetchProfile(session.user.id);
        }, 300);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchProfile(userId) {
    const id = userId || user?.id;
    if (!id) return null;
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    if (data) setProfile(data);
    return data;
  }

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/home',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    return { error };
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  function getUserDisplayName() {
    if (!profile) {
      return user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
    }
    return profile.display_name || profile.full_name || user?.email?.split('@')[0] || 'User';
  }

  function getUserHandle() {
    if (!profile) {
      return user?.user_metadata?.preferred_username || user?.user_metadata?.user_name || user?.email?.split('@')[0] || 'user';
    }
    return profile.username || user?.email?.split('@')[0] || 'user';
  }

  function getUserAvatar() {
    return profile?.avatar_url || user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null;
  }

  const value = {
    user,
    profile,
    loading,
    signInWithGoogle,
    signOut,
    fetchProfile,
    getUserDisplayName,
    getUserHandle,
    getUserAvatar,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
