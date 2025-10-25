// frontend/src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      isGuest: false,

      setToken: (token) => {
        let isGuestUser = false;
        if (token) {
          try {
            const decodedToken = jwtDecode(token); // Decode the token
            // Check if the payload has the user object and the isGuest flag
            isGuestUser = decodedToken.user?.isGuest === true;
          } catch (error) {
            console.error("Failed to decode token:", error);
            // Handle error case, maybe clear token if invalid
            token = null; // Clear token if decoding fails
            isGuestUser = false;
          }
        }
        set({
          token: token,
          isAuthenticated: !!token,
          isGuest: isGuestUser, // Set the guest status based on the token
        });
      },

      logout: () => {
        set({
          token: null,
          isAuthenticated: false,
          isGuest: false, // Reset guest status on logout
        });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;