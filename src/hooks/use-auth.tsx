"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  User, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      setLoading(false); // If firebase is not configured, stop loading.
    }
  }, []);

  const signIn = async (email: string, pass: string) => {
    if (!auth) {
      throw new Error("Firebase is not configured.");
    }
    await signInWithEmailAndPassword(auth, email, pass);
  };
  
  const signInWithGoogle = async () => {
    if (!auth) {
      throw new Error("Firebase is not configured.");
    }
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };
  
  const signInWithGitHub = async () => {
    if (!auth) {
      throw new Error("Firebase is not configured.");
    }
    const provider = new GithubAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signOut = async () => {
    if (auth) {
      await firebaseSignOut(auth);
    }
  };

  const value = { user, loading, signIn, signInWithGoogle, signInWithGitHub, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
