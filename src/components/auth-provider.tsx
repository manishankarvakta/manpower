"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/lib/firebase/client";
import { doc, getDoc } from "firebase/firestore";

type AuthContextType = {
  user: User | null;
  role: "worker" | "contractor" | "admin" | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({ user: null, role: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AuthContextType["role"]>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "your-api-key" && typeof window !== "undefined") {
      // Dev Mode Mock Auth
      const mockRole = localStorage.getItem("dev_mock_role") as AuthContextType["role"];
      if (mockRole) {
        setUser({ uid: "mock-dev-user", email: "dev@example.com" } as User);
        setRole(mockRole);
      } else if (localStorage.getItem("dev_mock_logged_in")) {
        setUser({ uid: "mock-dev-user", email: "dev@example.com" } as User);
        setRole(null);
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch role from Firestore
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role as AuthContextType["role"]);
        } else {
          setRole(null); // Needs onboarding
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
