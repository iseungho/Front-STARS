import axios, {
    InternalAxiosRequestConfig,
    AxiosResponse,
    AxiosError,
} from "axios";
import { getCookie, setCookie } from "./cookieUtil";
import host from "../api/apiConfig";

// axios 인스턴스 생성
const jwtAxios = axios.create();

// 쿠키 타입
interface UserCookie {
    accessToken: string;
    refreshToken: string;
}

// 응답 데이터 타입
interface RefreshResponse {
    accessToken: string;
    refreshToken: string;
}

interface ErrorResponse {
    error?: string;
    [key: string]: unknown;
}

// JWT 갱신 요청
const refreshJWT = async (
    accessToken: string,
    refreshToken: string
): Promise<RefreshResponse> => {
    const prefix = host;
    const header = { headers: { Authorization: `Bearer ${accessToken}` } };

    const res = await axios.get<RefreshResponse>(
        `${prefix}/user/refresh?refreshToken=${refreshToken}`,
        header
    );

    return res.data;
};

// 요청 인터셉터
const beforeReq = (
    config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig> => {
    const userInfo = getCookie<UserCookie>("user");

    if (!userInfo) {
        console.error("User NOT FOUND");
        return Promise.reject({
            response: {
                data: {
                    error: "REQUIRE_LOGIN",
                },
            },
        });
    }

    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${userInfo.accessToken}`;

    return config;
};

// 요청 실패 인터셉터
const requestFail = (err: AxiosError): Promise<never> => {
    console.error("request error............", err);
    return Promise.reject(err);
};

// 응답 인터셉터
const beforeRes = async (
    res: AxiosResponse<ErrorResponse>
): Promise<AxiosResponse> => {
    const data = res.data;

    if (data?.error === "ERROR_ACCESS_TOKEN") {
        const user = getCookie<UserCookie>("user");
        if (!user) {
            console.error("User info missing during token refresh");
            return Promise.reject("REQUIRE_LOGIN");
        }

        const result = await refreshJWT(user.accessToken, user.refreshToken);

        user.accessToken = result.accessToken;
        user.refreshToken = result.refreshToken;

        setCookie("user", JSON.stringify(user));

        const originalRequest = res.config;
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${result.accessToken}`;

        return axios(originalRequest);
    }

    return res;
};

// 응답 실패 인터셉터
const responseFail = (err: AxiosError): Promise<never> => {
    console.error("response fail error.............", err);
    return Promise.reject(err);
};

// 인터셉터 등록
jwtAxios.interceptors.request.use(beforeReq, requestFail);
jwtAxios.interceptors.response.use(beforeRes, responseFail);

export default jwtAxios;
