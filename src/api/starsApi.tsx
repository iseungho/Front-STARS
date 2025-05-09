import axios from "axios";
import API_SERVER_HOST from "./apiConfig";

const prefix = `${API_SERVER_HOST}`;

// 실시간 모든 관광지 혼잡도 수신
export const subscribeCongestionUpdate = (
    onUpdate: (data: Record<string, unknown>) => void
): EventSource => {
    const eventSource = new EventSource(
        `${prefix}/control/congestion/main/congestion`
    );
    eventSource.addEventListener("congestion-update", (event) => {
        const congestionData = JSON.parse((event as MessageEvent).data);
        onUpdate(congestionData);
    });
    return eventSource;
};

// 실시간 혼잡도 알림 수신
export const subscribeCongestionAlert = (
    onAlert: (data: Record<string, unknown>) => void
): EventSource => {
    const eventSource = new EventSource(
        `${prefix}/control/congestion/main/congestion`
    );
    eventSource.addEventListener("congestion-alert", (event) => {
        const alertData = JSON.parse((event as MessageEvent).data);
        onAlert(alertData);
    });
    return eventSource;
};

// 실시간 날씨 정보
export const subscribeWeatherUpdate = (
    onUpdate: (data: Record<string, unknown>) => void
): EventSource => {
    const eventSource = new EventSource(
        `${prefix}/control/external/main/stream`
    );
    eventSource.addEventListener("weather-update", (event) => {
        const weatherData = JSON.parse((event as MessageEvent).data);
        onUpdate(weatherData);
    });
    return eventSource;
};

// 실시간 교통 정보 수신
export const subscribeTrafficUpdate = (
    onUpdate: (data: Record<string, unknown>) => void
): EventSource => {
    const eventSource = new EventSource(
        `${prefix}/control/external/main/stream`
    );
    eventSource.addEventListener("traffic-update", (event) => {
        const trafficData = JSON.parse((event as MessageEvent).data);
        onUpdate(trafficData);
    });
    return eventSource;
};

// 실시간 주차 정보 수신
export const subscribeParkUpdate = (
    onUpdate: (data: Record<string, unknown>) => void
): EventSource => {
    const eventSource = new EventSource(
        `${prefix}/control/external/main/stream`
    );
    eventSource.addEventListener("park-update", (event) => {
        const parkData = JSON.parse((event as MessageEvent).data);
        onUpdate(parkData);
    });
    return eventSource;
};

// 지역 목록 조회
export const getAreaList = async () => {
    const header = {
        headers: {
            "Content-Type": "application/json",
        },
    };
    const res = await axios.get(`${prefix}/place/main/area/list`, header);
    return res.data;
};

// 관광지 목록 조회
export const getAttractionList = async () => {
    const header = {
        headers: {
            "Content-Type": "application/json",
        },
    };
    const res = await axios.get(`${prefix}/place/main/attraction/list`, header);
    return res.data;
};

// 음식점 목록 조회
export const getRestaurantList = async () => {
    const header = {
        headers: {
            "Content-Type": "application/json",
        },
    };
    const res = await axios.get(`${prefix}/place/main/restaurant/list`, header);
    return res.data;
};

// 카페 목록 조회
export const getCafeList = async () => {
    const header = {
        headers: {
            "Content-Type": "application/json",
        },
    };
    const res = await axios.get(`${prefix}/place/main/cafe/list`, header);
    return res.data;
};

// 숙소 목록 조회
export const getAccommodationList = async () => {
    const header = {
        headers: {
            "Content-Type": "application/json",
        },
    };
    const res = await axios.get(
        `${prefix}/place/main/accommodation/list`,
        header
    );
    return res.data;
};

// 관광지 상세 조회
export const getAttractionDetail = async (attractionId: string) => {
    const header = {
        headers: {
            "Content-Type": "application/json",
        },
    };
    const res = await axios.get(
        `${prefix}/place/main/info/attraction/${attractionId}`,
        header
    );
    return res.data;
};

// 식당 상세 조회
export const getRestaurantDetail = async (restaurantId: string) => {
    const header = {
        headers: {
            "Content-Type": "application/json",
        },
    };
    const res = await axios.get(
        `${prefix}/place/main/info/restaurant/${restaurantId}`,
        header
    );
    return res.data;
};

// 카페 상세 조회
export const getCafeDetail = async (cafeId: string) => {
    const header = {
        headers: {
            "Content-Type": "application/json",
        },
    };
    const res = await axios.get(
        `${prefix}/place/main/info/cafe/${cafeId}`,
        header
    );
    return res.data;
};

// 숙소 상세 조회
export const getAccommodationDetail = async (accommodationId: string) => {
    const header = {
        headers: {
            "Content-Type": "application/json",
        },
    };
    const res = await axios.get(
        `${prefix}/place/main/info/accommodation/${accommodationId}`,
        header
    );
    return res.data;
};

// 행사 목록 조회
export const getEventList = async () => {
    const header = {
        headers: {
            "Content-Type": "application/json",
        },
    };
    const res = await axios.get(`${prefix}/place/main/events`, header);
    return res.data;
};

// 지역별 장소 목록 조회
export const getPlaceListByArea = async (areaId: string) => {
    const header = {
        headers: {
            "Content-Type": "application/json",
        },
    };
    const res = await axios.get(
        `${prefix}/place/main/place/list/${areaId}`,
        header
    );
    return res.data;
};
