
"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithRedirect,
  getRedirectResult
} from 'firebase/auth';
import { auth, db, isFirebaseConfigured } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { type AppUser } from '@/types';


interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  signOut: () => Promise<void>;
  isProcessingSocialLogin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isProcessingSocialLogin, setIsProcessingSocialLogin] = useState(true);


  useEffect(() => {
    if (!isFirebaseConfigured || !auth || !db) {
      setLoading(false);
      setIsProcessingSocialLogin(false);
      return;
    }

    // This handles the redirect result from Google/GitHub
    getRedirectResult(auth)
      .catch((error) => {
        console.error("Error getting redirect result:", error);
      })
      .finally(() => {
        setIsProcessingSocialLogin(false);
      });

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data() as AppUser;
          setIsAdmin(userData.role === 'admin');
        } else {
          // New user (first-time sign-up/social login), create their record in Firestore
          const newUser: AppUser = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email?.split('@')[0] || 'User',
            photoURL: user.photoURL,
            role: 'user', // Default role for all new users
          };
          await setDoc(userDocRef, newUser);
          // New users are not admins by default.
          // To make a user an admin, change their role in the Firestore console.
          setIsAdmin(false);
        }
        setUser(user);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, pass: string) => {
    if (!auth) {
      throw new Error("Firebase is not configured.");
    }
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signUp = async (email: string, pass: string) => {
    if (!auth) {
      throw new Error("Firebase is not configured.");
    }
    await createUserWithEmailAndPassword(auth, email, pass);
  };
  
  const signInWithGoogle = async () => {
    if (!auth) throw new Error("Firebase is not configured.");
    setIsProcessingSocialLogin(true);
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
  };
  
  const signInWithGitHub = async () => {
    if (!auth) throw new Error("Firebase is not configured.");
    setIsProcessingSocialLogin(true);
    const provider = new GithubAuthProvider();
    await signInWithRedirect(auth, provider);
  };

  const signOut = async () => {
    if (auth) {
      await firebaseSignOut(auth);
    }
  };

  const value = { user, isAdmin, loading, signIn, signUp, signInWithGoogle, signInWithGitHub, signOut, isProcessingSocialLogin };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
