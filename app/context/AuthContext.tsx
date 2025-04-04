import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

interface AuthProps {
  authState?: {
    token?: string;
    authenticated?: boolean;
    bot?: boolean;
    username?: string;
    userId?: number;
  };
  onRegister?: (username: string, password: string) => Promise<any>;
  onLogin?: (username: string, password: string) => Promise<any>;
  onGuest?: () => Promise<any>;
  onLogout?: () => Promise<any>;
}

const TOKEN_KEY = "rq-jwt";
const API_URL = process.env.EXPO_PUBLIC_API_URL;

const AuthContext = createContext<AuthProps>({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    token?: string;
    authenticated?: boolean;
    bot?: boolean;
    username?: string;
    userId?: number;
  }>();

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) {
        const tryParJson = (encoded: string): any => {
          try {
            return JSON.parse(encoded);
          } catch (e) {
            return null;
          }
        };

        const [header, payload] = token.split(".").map(tryParJson);

        // Get the current time in seconds since epoch
        const currentTime = Math.floor(Date.now() / 1000);

        if (payload?.exp && payload?.exp > currentTime) {
          setAuthState({
            token: token,
            authenticated: true,
            username: payload?.username,
            userId: payload?.id,
          });

          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
      }
    };

    axios.defaults.timeout = 1000;

    loadToken();
  }, []);

  const register = async (username: string, password: string) => {
    try {
      const API_ENDPOINT = `${API_URL}/register`;
      const result = await axios.post(API_ENDPOINT, { username, password });
      const response = result.data ?? { success: false };
      response.success ||= false;
      return response;
    } catch (error) {
      return {
        success: false,
        error: (error as any).response?.data?.error,
      };
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const API_ENDPOINT = `${API_URL}/login`;
      const result = await axios.post(API_ENDPOINT, { username, password });
      const response = result.data ?? { success: false };
      response.success ||= false;

      if (response.success === true) {
        setAuthState({
          token: response.token,
          authenticated: true,
          bot: false,
          username,
          userId: response.id,
        });

        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.token}`;

        //await SecureStore.setItemAsync(TOKEN_KEY, response.token);
      }

      return response;
    } catch (error) {
      return {
        success: false,
        error: (error as any).response?.data?.error,
      };
    }
  };

  const guest = async () => {
    try {
      const API_ENDPOINT = `${API_URL}/guest`;
      const result = await axios.post(API_ENDPOINT);
      const response = result.data ?? { success: false };
      response.success ||= false;

      if (response.success === true) {
        setAuthState({
          token: response.token,
          authenticated: true,
          bot: true,
          username: response.name,
          userId: response.id,
        });

        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.token}`;
      }

      return response;
    } catch (error) {
      return {
        success: false,
        error: (error as any).response?.data?.error,
      };
    }
  };

  const logout = async () => {
    if (authState?.bot === true) {
      // Delete item from storage
      //await SecureStore.deleteItemAsync(TOKEN_KEY);
    }

    // Update HTTP headers
    axios.defaults.headers.common["Authorization"] = "";

    // Reset auth state
    setAuthState({
      token: undefined,
      authenticated: false,
      bot: undefined,
      username: undefined,
      userId: undefined,
    });
  };

  const value: AuthProps = {
    onRegister: register,
    onLogin: login,
    onGuest: guest,
    onLogout: logout,
    authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
