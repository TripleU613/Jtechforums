import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, firestore } from '../lib/firebase';

const AuthContext = createContext({ user: null, loading: true });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser?.email) {
        try {
          const emailKey = firebaseUser.email.toLowerCase();
          const userRef = doc(firestore, 'users', emailKey);
          const snapshot = await getDoc(userRef);
          if (snapshot.exists() && snapshot.data()?.banned) {
            await signOut(auth);
            setUser(null);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error('Auth guard failed', error);
        }
      }
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user?.email) return undefined;
    let cancelled = false;

    const syncUserDoc = async () => {
      try {
        const emailKey = user.email.toLowerCase();
        const userRef = doc(firestore, 'users', emailKey);
        const snapshot = await getDoc(userRef);
        if (!snapshot.exists() && !cancelled) {
          await setDoc(userRef, {
            email: user.email,
            banned: false,
            isAdmin: false,
          });
        }
      } catch (error) {
        console.error('Unable to sync user record', error);
      }
    };

    syncUserDoc();
    return () => {
      cancelled = true;
    };
  }, [user?.email]);

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
