import axios from "axios";

// axios.defaults.baseURL = 'http://13.49.18.134/api'
axios.defaults.baseURL = 'http://localhost:8000/api'

const storedTokens = localStorage.getItem('authTokens');
if (storedTokens) {
    try {
        const parsed = JSON.parse(storedTokens);
        if (parsed?.access) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${parsed.access}`;
        }
    } catch (error) {
        // Ignore invalid tokens in localStorage.
    }
}

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error?.response?.status;
        const isRefreshRequest = originalRequest?.url?.includes('refresh/');

        if (status === 401 && originalRequest && !originalRequest._retry && !isRefreshRequest) {
            originalRequest._retry = true;
            const rawTokens = localStorage.getItem('authTokens');
            if (!rawTokens) {
                return Promise.reject(error);
            }

            try {
                const parsedTokens = JSON.parse(rawTokens);
                const refreshToken = parsedTokens?.refresh;
                if (!refreshToken) {
                    return Promise.reject(error);
                }

                const refreshResponse = await axios.post('refresh/', {
                    refresh: refreshToken,
                });

                const nextTokens = {
                    ...parsedTokens,
                    access: refreshResponse.data.access,
                };

                localStorage.setItem('authTokens', JSON.stringify(nextTokens));
                axios.defaults.headers.common['Authorization'] = `Bearer ${nextTokens.access}`;
                originalRequest.headers = {
                    ...originalRequest.headers,
                    Authorization: `Bearer ${nextTokens.access}`,
                };

                return axios(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('authTokens');
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);