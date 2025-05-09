// UserInfo.tsx
import React, { useState, useEffect } from "react";
import UserInfoShow from "./UserInfoShow";
import UserInfoEdit from "./UserInfoEdit";

import { UserInfo as UserInfoType } from "../../../data/UserInfoData";
import { editUserProfile, getUserProfile } from "../../../api/mypageApi";
// import { signoutUser } from "../../../api/authApi";

// 모의 API 응답 타입
interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}

const initialUserData: UserInfoType = {
    member_id: "",
    user_id: "",
    nickname: "",
    password: "",
    chk_password: "",
    birth_year: 0,
    mbti: "",
    gender: "",
    created_at: "",
};

// 모의 API 함수
const updateUserInfo = (
    userInfo: typeof initialUserData
): Promise<ApiResponse<typeof initialUserData>> => {
    return new Promise((resolve) => {
        // 800ms 지연 후 응답
        setTimeout(() => {
            // 80% 확률로 성공
            if (Math.random() < 1) {
                resolve({
                    success: true,
                    data: {
                        ...userInfo,
                        password: "", // 응답에서는 보안 상 비밀번호 필드를 비움
                        chk_password: "",
                    },
                    message: "사용자 정보가 성공적으로 업데이트 되었습니다.",
                });
            } else {
                resolve({
                    success: false,
                    message:
                        "사용자 정보 업데이트에 실패했습니다. 잠시 후 다시 시도해주세요.",
                });
            }
        }, 800);
    });
};

// 계정 삭제 모의 API 함수
const deleteUserAccount = (): Promise<ApiResponse<null>> => {
    return new Promise((resolve) => {
        // 800ms 지연 후 응답
        setTimeout(() => {
            // 90% 확률로 성공
            if (Math.random() < 1) {
                resolve({
                    success: true,
                    message: "계정이 성공적으로 삭제되었습니다.",
                });
            } else {
                resolve({
                    success: false,
                    message:
                        "계정 삭제에 실패했습니다. 관리자에게 문의해주세요.",
                });
            }
        }, 800);
    });
};

const UserInfo = () => {
    const [edited, setEdited] = useState<boolean>(false);
    // 초기 상태에서는 비밀번호가 유효하지 않은 것으로 설정
    const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);
    // 로딩 상태
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    // 로딩 상태 (사용자 정보 로딩)
    const [isLoading, setIsLoading] = useState<boolean>(true);
    // 에러 상태
    const [error, setError] = useState<string | null>(null);
    // 사용자 정보 데이터
    const [userData, setUserData] = useState<UserInfoType | null>(null);
    // 사용자 정보 저장
    const [userInfoToSubmit, setUserInfoToSubmit] =
        useState<UserInfoType>(initialUserData);

    // 사용자 정보 불러오는 함수
    const loadUserInfo = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await getUserProfile();

            if (response) {
                setUserData(response);
                // 초기 데이터를 저장 (제출용)
                setUserInfoToSubmit(response);
            } else {
                setError("사용자 정보를 불러오는데 실패했습니다.");
                // 오류 발생 시 기본 데이터 설정
                setUserData(initialUserData);
                setUserInfoToSubmit(initialUserData);
            }
        } catch (err) {
            setError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
            // 오류 발생 시 기본 데이터 설정
            setUserData(initialUserData);
            setUserInfoToSubmit(initialUserData);
        } finally {
            setIsLoading(false);
        }
    };

    // 컴포넌트 마운트 시 사용자 정보 불러오기
    useEffect(() => {
        loadUserInfo();
    }, []);

    const handleEditToggle = () => {
        setEdited(!edited);
        // 수정 모드로 전환할 때 비밀번호 유효성 상태 초기화
        setIsPasswordValid(false);
    };

    // 비밀번호 유효성 상태 변경 핸들러
    const handlePasswordValidationChange = (isValid: boolean) => {
        setIsPasswordValid(isValid);
        console.log("비밀번호 유효성 상태 변경:", isValid); // 디버깅용 로그 추가
    };

    // 사용자 정보 저장을 위한 함수
    const handleUserInfoSubmit = (userInfo: UserInfoType) => {
        // 폼 제출 시 저장할 사용자 정보 설정
        setUserInfoToSubmit(userInfo);
    };

    // 계정 정보 수정, 이게 왜 여기에있냐??
    const handleComplete = async () => {
        // 비밀번호가 유효하지 않으면 저장을 막음
        if (!isPasswordValid) {
            alert("비밀번호를 올바르게 입력해주세요.");
            return;
        }

        // 로딩 상태 활성화
        setIsSubmitting(true);

        try {
            // 실제 API 호출로 변경
            const response = await editUserProfile(userInfoToSubmit);

            // API 응답 구조에 따라 처리 로직 수정
            if (response) {
                // 성공 메시지 표시
                alert(
                    response.message || "회원 정보가 성공적으로 수정되었습니다."
                );
                // 보기 모드로 전환
                setEdited(false);
                // 사용자 정보 다시 로드
                loadUserInfo();
            } else {
                // 실패 메시지 표시
                alert(response.message || "회원 정보 수정에 실패했습니다.");
            }
        } catch (error) {
            // 오류 메시지 표시
            alert("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
            console.error("API 오류:", error);
        } finally {
            // 로딩 상태 비활성화
            setIsSubmitting(false);
        }
    };

    // 계정 삭제 핸들러
    const handleDeleteAccount = async () => {
        if (
            window.confirm(
                "정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
            )
        ) {
            // 로딩 상태 활성화
            setIsSubmitting(true);

            try {
                // 계정 삭제 API 호출, 일단 계정삭제가 안되므로 더미로 처리
                const response = await deleteUserAccount();

                // 실제 호출해야하는 API, 별다른 params 없음
                // const response = await signoutUser(13);

                if (response.success) {
                    // 성공 메시지 표시
                    alert(
                        response.message || "계정이 성공적으로 삭제되었습니다."
                    );
                    // 여기서 로그아웃 또는 다른 페이지로 리다이렉트 로직을 추가할 수 있습니다.
                } else {
                    // 실패 메시지 표시
                    alert(response.message || "계정 삭제에 실패했습니다.");
                }
            } catch (error) {
                // 오류 메시지 표시
                alert("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
                console.error("API 오류:", error);
            } finally {
                // 로딩 상태 비활성화
                setIsSubmitting(false);
            }
        }
    };

    // 로딩 스켈레톤
    if (isLoading) {
        return (
            <div className="bg-white rounded-lg p-2 md:p-4">
                <div className="animate-pulse flex flex-col items-center w-full">
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="text-gray-500 text-sm">
                        사용자 정보를 불러오는 중...
                    </div>
                </div>
            </div>
        );
    }

    // 에러 표시
    if (error) {
        return (
            <div className="bg-white rounded-lg p-2 md:p-4">
                <div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                    role="alert"
                >
                    <strong className="font-bold">오류 발생! </strong>
                    <span className="block sm:inline">{error}</span>
                    <button
                        className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs"
                        onClick={loadUserInfo}
                    >
                        다시 시도
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg p-2 md:p-4">
            {!edited ? (
                <UserInfoShow userInfo={userData || initialUserData} />
            ) : (
                <UserInfoEdit
                    userInfo={userData || initialUserData}
                    onPasswordValidationChange={handlePasswordValidationChange}
                    onUserInfoSubmit={handleUserInfoSubmit}
                />
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 md:mt-6 gap-2 sm:gap-0">
                {edited ? (
                    <>
                        <button
                            className={`w-full sm:w-auto bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors mt-2 sm:mt-0 ${
                                isSubmitting
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                            }`}
                            onClick={handleEditToggle}
                            disabled={isSubmitting}
                        >
                            취소
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            className={`w-full sm:w-auto bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 transition-colors ${
                                isSubmitting
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                            }`}
                            onClick={handleEditToggle}
                            disabled={isSubmitting}
                        >
                            수정하기
                        </button>
                        <button
                            className={`w-full sm:w-auto bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors mt-2 sm:mt-0 ${
                                isSubmitting
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                            }`}
                            onClick={handleDeleteAccount}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center">
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    처리 중...
                                </span>
                            ) : (
                                "계정 삭제"
                            )}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default UserInfo;
