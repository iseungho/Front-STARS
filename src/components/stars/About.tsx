import { usePlace } from "../../context/PlaceContext";
import { places } from "../../data/placesData";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { useCountUp } from "../../hooks/useCountUp";
import { useEffect } from "react";

export default function About() {
    const { selectedPlace, triggerCountUp, setTriggerCountUp } = usePlace() as {
        selectedPlace: string;
        triggerCountUp: boolean;
        setTriggerCountUp: (value: boolean) => void;
    };
    const place = places[selectedPlace];

    const { ref: visitorCountRef, update } = useCountUp(
        place?.todayVisitors || 0,
        { duration: 2 }
    );

    useEffect(() => {
        if (triggerCountUp) {
            update(place?.todayVisitors || 0);
            setTriggerCountUp(false); // 트리거 초기화
        }
    }, [triggerCountUp, place, update, setTriggerCountUp]);

    if (!place)
        return (
            <div className="p-8 text-gray-500">정보를 찾을 수 없습니다.</div>
        );

    return (
        <div className="w-full h-screen bg-gray-100 p-8 grid grid-cols-12 gap-6">
            {/* 장소 정보 카드 */}
            <div className="bg-white rounded-2xl shadow p-6 col-span-3">
                <h2 className="text-xl text-gray-700 font-semibold">
                    {place.name}
                </h2>
                <p className="text-lg text-gray-500">{place.address}</p>
                <p className="text-xl mt-4 text-gray-500">오늘 방문객</p>
                <p className="text-4xl text-gray-700 font-bold mt-2">
                    <span ref={visitorCountRef}></span>명
                </p>
                <p
                    onClick={() => {
                        if (place) {
                            place.todayVisitors += 100; // 100씩 증가
                            update(place.todayVisitors); // 증가된 값으로 업데이트
                        }
                    }}
                    className="mt-2 text-sm text-gray-500 underline hover:text-gray-700 transition cursor-pointer"
                >
                    업데이트
                </p>
            </div>

            {/* 주간 방문자 추이 */}
            <div className="bg-white rounded-2xl shadow p-6 col-span-6">
                <h2 className="text-xl text-gray-700 font-semibold mb-4">
                    주간 방문자 추이
                </h2>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={place.weeklyStats}>
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="population"
                            stroke="#6366f1"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* 행사 */}
            <div className="bg-white rounded-2xl shadow p-6 col-span-3">
                <h2 className="text-xl text-gray-700 font-semibold mb-2">
                    진행 중인 행사
                </h2>
                <ul className="mt-4 space-y-2">
                    {place.events.map((e, i) => (
                        <li key={i} className="text-gray-700">
                            {e}
                        </li>
                    ))}
                </ul>
            </div>

            {/* 관심사 */}
            <div className="bg-white rounded-2xl shadow p-6 col-span-4">
                <h2 className="text-xl text-gray-700 font-semibold mb-4">
                    추천 관심사
                </h2>
                <div className="flex flex-wrap gap-2">
                    {place.tags.map((tag) => (
                        <span
                            key={tag}
                            className="bg-yellow-100 text-yellow-800 px-5 py-2 rounded-full"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* 대표 이미지 */}
            <div className="col-span-8 overflow-hidden rounded-2xl shadow">
                <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* 위로 이동 버튼 */}
            <button
                onClick={() => window.fullpage_api?.moveSectionUp()}
                className="z-10 absolute top-6 mt-6 right-6 bg-gray-300 rounded-full p-3 hover:bg-indigo-600 hover:text-white transition-colors"
                aria-label="이전 섹션으로 이동"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                    />
                </svg>
            </button>
        </div>
    );
}
