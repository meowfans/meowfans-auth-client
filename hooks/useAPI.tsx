import { authCookieKey, authRefreshCookieKey, CreatorSignupInput, FetchMethods, LoginInput, SignupInput } from '@/lib/constants';
import { configService } from '@/util/config';
import { OptionsType, setCookie } from 'cookies-next';

export const fetchRequest = async (input: { init: RequestInit; fetchMethod: FetchMethods; pathName: string }) => {
  const { init, fetchMethod, pathName } = input;
  const url = new URL(configService.NEXT_PUBLIC_API_URL);
  url.pathname = pathName;
  const res = await fetch(url, {
    ...init,
    method: fetchMethod
  });
  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
};

const useAPI = () => {
  const setAuthCookie = (key: string, data: any, options: OptionsType) => {
    setCookie(key, data, {
      ...options,
      path: '/',
      domain: configService.NEXT_PUBLIC_APP_DOMAINS,
      sameSite: 'none',
      secure: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });
  };

  const login = async (input: LoginInput) => {
    const data = await fetchRequest({
      fetchMethod: FetchMethods.POST,
      pathName: '/auth/login',
      init: {
        body: JSON.stringify(input),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    });

    setAuthCookie(authCookieKey, data.accessToken, {});
    setAuthCookie(authRefreshCookieKey, data.refreshToken, {});
    return data;
  };

  const signup = async (input: SignupInput) => {
    const data = await fetchRequest({
      fetchMethod: FetchMethods.POST,
      pathName: '/auth/fan-signup',
      init: {
        body: JSON.stringify(input),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    });
    setAuthCookie(authCookieKey, data.accessToken, {});
    setAuthCookie(authRefreshCookieKey, data.refreshToken, {});
    return data;
  };

  const creatorSignup = async (input: CreatorSignupInput) => {
    const data = await fetchRequest({
      fetchMethod: FetchMethods.POST,
      pathName: '/auth/creator-signup',
      init: {
        body: JSON.stringify(input),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    });
    setAuthCookie(authCookieKey, data.accessToken, {});
    setAuthCookie(authRefreshCookieKey, data.refreshToken, {});
    return data;
  };

  return {
    login,
    signup,
    creatorSignup
  };
};

export default useAPI;
