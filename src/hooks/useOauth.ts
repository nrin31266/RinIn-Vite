import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch } from "../store/store";
import { googleOauthLoginOrRegister } from "../store/authSlice";

const GOOGLE_OAUTH2_CLIENT_ID = import.meta.env.VITE_GOOGLE_OAUTH2_CLIENT_ID;
const GOOGLE_OAUTH_URL = import.meta.env.VITE_GOOGLE_OAUTH_URL;

export const useOauth = ({ page }: { page: "login" | "signup" }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const [isOauthInProgress, setIsOauthInProgress] = useState(
    code !== null || error !== null
  );
  const dispatch = useAppDispatch();
  const [oauthError, setOauthError] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      if (error) {
        if (error === "access_denied") {
          setOauthError("You denied access to your Google account.");
        } else {
          setOauthError("An unknown error occurred.");
        }
        setIsOauthInProgress(false);
        setSearchParams({});
        return;
      }
      if (!code || !state) return;

      const { destination, antiForgeryToken } = JSON.parse(state);

      if (antiForgeryToken !== "n6kibcv2ov") {
        setOauthError("Invalid state parameter.");
        setIsOauthInProgress(false);
        setSearchParams({});
        return;
      }
      console.log(`OAuth code received: ${code}`);
      console.log(`OAuth state received: ${state}`);

      // Redirect to the destination page after successful OAuth
      try {
        await dispatch(googleOauthLoginOrRegister({ code, page })).unwrap();
        setTimeout(() => {
            
            setIsOauthInProgress(false);
            setSearchParams({});
            navigate(destination);
        }, 1000); // Optional delay for UX

      } catch (error) {
        if (error instanceof Error) {
          setOauthError(error.message);
        } else {
          setOauthError("An unknown error occurred.");
        }
        setIsOauthInProgress(false);
        setSearchParams({});
      }
    };
    fetchData();
  }, [code, error, navigate, page, setSearchParams, state]);
  const handleOauthClick = () => {
    const redirectUri = `${window.location.origin}/auth/${page}`;
    const oauthUrl = `${GOOGLE_OAUTH_URL}?client_id=${GOOGLE_OAUTH2_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid+email+profile&state=${JSON.stringify({
      destination: location.state?.from || "/",
      antiForgeryToken: "n6kibcv2ov",
    })}`;
    window.location.href = oauthUrl;
  };

  return {
    isOauthInProgress,
    oauthError,
    handleOauthClick,
  };
};
