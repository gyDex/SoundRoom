import axios from 'axios';

export const axiosClient = axios.create({
  baseURL: 'http://localhost:4000',
  withCredentials: true, 
  timeout: 10000,
});

let refreshTokenRequest: Promise<string> | null = null;

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && 
        !originalRequest._retry && 
        !originalRequest.url.includes('/refresh')) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAuthToken();
        
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        
        return axiosClient(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        redirectToLogin();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

async function refreshAuthToken(): Promise<string> {
  if (refreshTokenRequest) {
    return refreshTokenRequest;
  }

  refreshTokenRequest = new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(
        'http://localhost:3001/graphql',
        {
          query: `
            mutation RefreshToken {
              refreshToken {
                accessToken
                refreshToken
                expiresIn
                tokenType
              }
            }
          `
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.data.errors) {
        throw new Error('Refresh token failed');
      }

      const { accessToken } = response.data.data.refreshToken;
      resolve(accessToken);
    } catch (error) {
      reject(error);
    } finally {
      refreshTokenRequest = null;
    }
  });

  return refreshTokenRequest;
}

function redirectToLogin() {
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}

export default axiosClient;