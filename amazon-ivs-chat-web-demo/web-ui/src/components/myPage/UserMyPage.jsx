import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserMyPage.css";
import * as ChargePoint from "./ChargePoint.jsx";
import iamport from "https://cdn.iamport.kr/v1/iamport.js";
import { useNavigate } from "react-router-dom";
import "../../index.css";

const UserMyPage = () => {
  const [chargeAmount, setChargeAmount] = useState("");
  const token = localStorage.getItem("token");
  const [userId, setUserId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [image, setImage] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [buyList, setbuyList] = useState([]);
  const [gender, setGender] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading1, setLoading1] = useState(false);
  const [auctions, setAuctions] = useState([]);
  const [point, setPoint] = useState(0);
  const [review, setreview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editedUser, setEditedUser] = useState({
    pw: "",
    name: "",
    gender: "",
    regDate: "",
    path: "",
    id: "",
    address: "",
    phone: "",
    email: "",
  });

  const [activeTab, setActiveTab] = useState("info"); // 'info', 'edit', 'review' 탭 관리
  const navigate = useNavigate();
  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserId(payload.user_seq);
        fetchUserInfo(payload.user_seq);
      } catch (error) {
        console.error("토큰 파싱 실패:", error);
      }
    }
  }, [token]);

  useEffect(() => {
    if (userInfo) {
      setEditedUser({
        pw: "",
        path: userInfo.path,
        name: userInfo.name,
        address: userInfo.address,
        phone: userInfo.phone,
        email: userInfo.email,
      });
    }
  }, [userInfo]);

  useEffect(() => {
    if (userId) {
      fetchUserInfo(userId);
      fetchPoint(userId);
      fetchreview(userId);
      fetchOrderHistory(userId);
      fetchAuctionHistory(userId);
    }
  }, [userId]);

  // 주문 내역을 가져오는 함수
  const fetchOrderHistory = async (userId) => {
    try {
      setLoading(true); // 로딩 시작
      const response = await axios.get(
        `http://localhost:9001/myPage/buyList/${userId}`
      );
      setOrders(response.data); // 가져온 데이터를 상태에 저장
    } catch (err) {
      setError("주문 내역을 불러오는 중 오류가 발생했습니다.");
      console.error(err);
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  const fetchAuctionHistory = async (userId) => {
    try {
      setLoading1(true); // 로딩 시작
      const response = await axios.get(
        `http://localhost:9001/myPage/auction/${userId}`
      ); // API 엔드포인트
      setAuctions(response.data); // 데이터 저장
    } catch (err) {
      setError("데이터를 불러오는 중 오류가 발생했습니다.");
      console.error(err);
    } finally {
      setLoading1(false); // 로딩 종료
    }
  };

  const fetchUserInfo = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:9001/myPage/list/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserInfo(response.data);
    } catch (error) {
      console.error("회원 정보 조회 실패:", error);
    }
  };

  const fetchPoint = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:9001/myPage/point/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setPoint(response.data);
    } catch (error) {
      console.error("포인트 조회 실패:", error);
    }
  };

  const fetchreview = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:9001/myPage/review/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setreview(response.data);
    } catch (error) {
      console.error("리뷰 조회 실패:", error);
    }
  };

  const handleCharge = async () => {
    try {
      if (!userId || !chargeAmount) {
        alert("충전할 금액을 입력해주세요.");
        return;
      }

      // 충전금액 및 주문정보 등록
      const response = await axios.post(
        "http://localhost:9001/charge",
        {
          managementUserSeq: parseInt(userId),
          price: parseInt(chargeAmount),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // 주문번호 받아오기
      const response2 = await axios.get(
        "http://localhost:9001/buyList/" + response.data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // 결제창 호출
      let IMP = window.IMP;
      IMP.init("imp68111618");
      const response4 = ChargePoint.requestPay(response2, token, IMP);

      // .then((result)=>{
      //     console.log(result.data);

      //     axios({
      //         // 주문번호 받아오기
      //         url: "http://localhost:9001/payment/" + result.data + "?status=1",
      //         method: "GET",
      //         headers: {
      //             Authorization: `Bearer ${token}`,
      //             "Content-Type": "application/json",
      //         },
      //     })
      //     .then((result)=>{
      //         // 결제에 필요한 정보
      //         console.log(result.data);
      //         // 결제창 호출
      //         let IMP = window.IMP;
      //         IMP.init("imp68111618");
      //         ChargePoint.requestPay(result, token, IMP);
      //     })
      //     .catch((err)=>{
      //         console.log(err);
      //     })
      // });

      if (response) {
        console.log("if response 받는 구문");
        console.log(response4);
        setChargeAmount("");
        //window.location.href = response.data;
      }
    } catch (error) {
      console.error("포인트 충전 실패:", error);
      alert("포인트 충전에 실패했습니다.");
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 11);

    setEditedUser((prev) => ({ ...prev, phone: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageReset = () => {
    setUserInfo((prevState) => ({
      ...prevState,
      path: null,
    }));
    setImagePreview(null);
    setImage(null);
  };

  const handleUpdateUserInfo = async (e) => {
    const confirmUpdate = window.confirm("수정 하시겠습니까?");

    if (!confirmUpdate) {
      return; // 취소하면 아무 작업도 하지 않음
    }

    e.preventDefault();

    // 비밀번호 일치 여부 확인
    if (editedUser.pw !== editedUser.pwConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!editedUser.gender) {
      alert("성별을 선택해 주세요.");
      return;
    }
    const id = userInfo.id;
    // 전화번호 포맷팅
    const phoneWithoutHyphen = editedUser.phone.replace(/-/g, "");
    const formattedPhone =
      phoneWithoutHyphen.length === 10
        ? `${phoneWithoutHyphen.slice(0, 3)}-${phoneWithoutHyphen.slice(
            3,
            6
          )}-${phoneWithoutHyphen.slice(6)}`
        : `${phoneWithoutHyphen.slice(0, 3)}-${phoneWithoutHyphen.slice(
            3,
            7
          )}-${phoneWithoutHyphen.slice(7)}`;

    const formData = new FormData();
    formData.append(
      "userData",
      new Blob(
        [
          JSON.stringify({
            id,
            name: editedUser.name,
            pw: editedUser.pw,
            address: editedUser.address,
            phone: formattedPhone,
            email: editedUser.email,
            gender: editedUser.gender,
          }),
        ],
        { type: "application/json" }
      )
    );

    if (image !== null) {
      formData.append("image", image); // 새 이미지 추가
    } else if (image === null) {
      formData.append("image", null); // 이미지에 null값
    }

    try {
      // 서버로 PUT 요청
      const response = await axios.put(
        `http://localhost:9001/myPage/user/update/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        alert("정보 수정이 완료되었습니다.");
        // 수정된 유저 정보를 상태에 반영
        setUserInfo({
          ...userInfo,
          path: editedUser.path,
          name: editedUser.name,
          email: editedUser.email,
          phone: formattedPhone,
          pw: editedUser.pw,
          address: editedUser.address,
          gender: editedUser.gender,
        });
        setActiveTab("info");
      }
    } catch (error) {
      console.error("회원정보 수정 실패:", error);
      alert("정보 수정에 실패했습니다.");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "정말로 회원 탈퇴를 진행하시겠습니까?"
    );

    if (confirmDelete) {
      try {
        const response = await axios.put(
          `http://localhost:9001/myPage/delete/${userId}`,
          { userId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data === 1) {
          alert("회원 탈퇴가 완료되었습니다.");
          localStorage.removeItem("token");
          localStorage.setItem("token", null);
          navigate("/");
        }
      } catch (error) {
        console.error("회원 탈퇴 실패:", error);
        alert("회원 탈퇴에 실패했습니다.");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeletereview = async (revieweq) => {
    try {
      await axios.delete(
        `http://localhost:9001/myPage/review/${userId}/${revieweq}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("리뷰가 삭제되었습니다.");
      fetchreview(userId);
    } catch (error) {
      console.error("리뷰 삭제 실패:", error);
      alert("리뷰 삭제에 실패했습니다.");
    }
  };

  return (
    <div className="user-mypage">
      <div className="mypage-container">
        <div className="sidebar">
          <h3>마이페이지 메뉴</h3>
          <ul>
            <li
              onClick={() => setActiveTab("info")}
              className={activeTab === "info" ? "active" : ""}
            >
              회원 정보
            </li>
            <li
              onClick={() => setActiveTab("update")}
              className={activeTab === "update" ? "active" : ""}
            >
              회원 정보 수정
            </li>

            <li
              onClick={() => setActiveTab("buyList")}
              className={activeTab === "buyList" ? "active" : ""}
            >
              주문 내역
            </li>
            <li
              onClick={() => setActiveTab("auction")}
              className={activeTab === "auction" ? "active" : ""}
            >
              경매 내역
            </li>

            <li
              onClick={() => setActiveTab("review")}
              className={activeTab === "review" ? "active" : ""}
            >
              나의 리뷰
            </li>
            <li
              onClick={() => setActiveTab("point")}
              className={activeTab === "point" ? "active" : ""}
            >
              포인트 충전
            </li>
          </ul>
        </div>

        <div className="main-content">
          {activeTab === "info" && userInfo && (
            <div className="user-info-section">
              <h3>회원 정보</h3>
              <div className="user-info-details">
                <strong>프로필 사진</strong>
                <div className="image-preview-container">
                  <img
                    src={imagePreview || userInfo.path}
                    alt={userInfo.path}
                  />
                </div>
                <p>
                  <strong>아이디:</strong> {userInfo.id}
                </p>
                <p>
                  <strong>이름:</strong> {userInfo.name}
                </p>
                <p>
                  <strong>이메일:</strong> {userInfo.email}
                </p>
                <p>
                  <strong>전화번호:</strong> {userInfo.phone}
                </p>
                <p>
                  <strong>주소:</strong> {userInfo.address}
                </p>
                <p>
                  <strong>성별:</strong> {userInfo.gender}
                </p>
                <p>
                  <strong>가입일자:</strong>{" "}
                  {new Date(userInfo.regDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>보유 포인트:</strong> {point.toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {activeTab === "buyList" && (
            <div className="order-history-display">
              <h3>주문 내역</h3>
              {loading ? (
                <div>로딩 중...</div>
              ) : error ? (
                <div className="error-message">{error}</div>
              ) : orders.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>번호</th>
                      <th>주문 번호</th>
                      <th>상품명</th>
                      <th>수량</th>
                      <th>금액</th>
                      <th>주문일자</th>
                      <th>주문 상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, index) => (
                      <tr key={order.orderId}>
                        <td>{index + 1}</td> {/* 번호 */}
                        <td>{order.userBuySeq}</td> {/* 주문 번호 */}
                        <td>{order.content}</td> {/* 상품명 */}
                        <td>{order.count}</td> {/* 수량 */}
                        <td>{order.price}원</td> {/* 금액 */}
                        <td>
                          {new Date(order.buyDate).toLocaleDateString()}
                        </td>{" "}
                        {/* 주문일자 */}
                        <td>
                          {order.state === 0
                            ? "값 뭐넣어야해여?"
                            : order.state === 1
                            ? "값 뭐넣어야해여?"
                            : order.state === 2
                            ? "값 뭐넣어야해여?"
                            : order.state === 3
                            ? "값 뭐넣어야해여?"
                            : "값 뭐넣어야해여?"}
                        </td>
                        {/* 주문 상태 */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-data-notification">
                  주문 내역이 없습니다.
                </div>
              )}
            </div>
          )}

          {activeTab === "auction" && (
            <div className="auction-history-display">
              <h3>경매 참여 내역</h3>
              {loading1 ? (
                <div>로딩 중...</div>
              ) : error ? (
                <div className="error-message">{error}</div>
              ) : auctions.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>번호</th>
                      <th>상품명</th>
                      <th>수량</th>
                      <th>입찰 금액</th>
                      <th>참여 날짜</th>
                      <th>판매자명</th>
                      <th>현재 상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auctions.map((auction, index) => (
                      <tr key={auction.bidSeq}>
                        <td>{index + 1}</td> {/* 번호 */}
                        <td>{auction.content}</td> {/* 상품명 */}
                        <td>{auction.count}</td> {/* 수량*/}
                        <td>{auction.price}원</td> {/* 입찰할 금액 */}
                        <td>{auction.insertDate}</td> {/* 입찰한 날짜 */}
                        <td>{auction.name}</td> {/* 판매자명 */}
                        <td>
                          {auction.status === 0
                            ? "값 뭐넣어야해여?"
                            : auction.status === 1
                            ? "값 뭐넣어야해여?"
                            : auction.status === 2
                            ? "값 뭐넣어야해여?"
                            : auction.status === 3
                            ? "값 뭐넣어야해여?"
                            : "값 뭐넣어야해여?"}
                        </td>
                        {/* 현재 상태 */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-data-notification">
                  경매 참여 내역이 없습니다.
                </div>
              )}
            </div>
          )}

          {activeTab === "update" && (
            <div className="user-info-edit-section">
              <h3>회원 정보 수정</h3>
              <form onSubmit={handleUpdateUserInfo}>
                <div className="image-section">
                  <label>프로필 이미지</label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="image-upload-input"
                  />
                  <div className="image-preview-container">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="imagePreview"
                        className="image-preview"
                      />
                    ) : userInfo.path ? (
                      <img
                        src={userInfo.path}
                        alt="userInfo.path"
                        className="image-preview"
                      />
                    ) : null}
                  </div>
                  <button
                    type="button"
                    className="image-upload-btn"
                    onClick={() =>
                      document.getElementById("image-upload").click()
                    }
                  >
                    사진 등록
                  </button>

                  {(imagePreview || userInfo.path) && (
                    <button
                      type="button"
                      className="image-reset-btn"
                      onClick={handleImageReset}
                    >
                      삭제
                    </button>
                  )}
                </div>

                <label>이름</label>
                <input
                  type="text"
                  name="name"
                  value={editedUser.name}
                  onChange={handleChange}
                  required
                />
                <label>비밀번호</label>
                <input
                  type="password"
                  name="pw"
                  value={editedUser.pw}
                  onChange={handleChange}
                  required
                />

                <label>비밀번호 확인</label>
                <input
                  type="password"
                  name="pwConfirm"
                  value={editedUser.pwConfirm}
                  onChange={handleChange}
                  required
                />
                <label>주소</label>
                <input
                  type="text"
                  name="address"
                  value={editedUser.address}
                  onChange={handleChange}
                  required
                />
                <label>전화번호</label>
                <input
                  type="text"
                  name="phone"
                  value={editedUser.phone.replace(/-/g, "")} // 하이픈 없이 전화번호 표시
                  onChange={handlePhoneChange} // onChange 핸들러로 전화번호 처리
                  maxLength="11" // 최대 길이를 11로 제한
                  required
                />

                <label>이메일</label>
                <input
                  type="email"
                  name="email"
                  value={editedUser.email}
                  onChange={handleChange}
                  required
                />
                <div className="input-group">
                  <div className="user-gender">
                    <input
                      type="radio"
                      id="male"
                      name="gender"
                      value="남자"
                      checked={editedUser.gender === "남자"}
                      onChange={() =>
                        setEditedUser({ ...editedUser, gender: "남자" })
                      } // editedUser.gender 업데이트
                      className="user-gender-radio"
                    />
                    <label htmlFor="male" className="gender-label">
                      남성
                    </label>
                    <input
                      type="radio"
                      id="female"
                      name="gender"
                      value="여자"
                      checked={editedUser.gender === "여자"}
                      onChange={() =>
                        setEditedUser({ ...editedUser, gender: "여자" })
                      } // editedUser.gender 업데이트
                      className="user-gender-radio"
                    />
                    <label htmlFor="female" className="gender-label">
                      여성
                    </label>
                  </div>
                </div>

                <div className="button-container">
                  <button type="submit" className="update-button">
                    수정하기
                  </button>
                  <button
                    type="button"
                    className="delete-button"
                    onClick={handleDeleteAccount}
                  >
                    회원탈퇴
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "review" && (
            <div className="review-section">
              <h3>나의 리뷰 목록</h3>
              {review.length > 0 ? (
                <div className="review-list">
                  {review.map((review) => (
                    <div key={review.reviewCommentSeq} className="review-item">
                      <div className="review-header">
                        <span className="review-score">
                          평점: {review.score}점
                        </span>
                        <span className="review-date">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="review-content">{review.content}</div>
                      {review.file && (
                        <div className="review-image">
                          <img src={review.file.path} alt="리뷰 이미지" />
                        </div>
                      )}
                      <span className="review-date">
                        작성날짜 : {new Date(review.date).toLocaleDateString()}
                      </span>
                      <br />
                      <button
                        onClick={() =>
                          handleDeletereview(review.reviewCommentSeq)
                        }
                        className="review-delete-button"
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data-notification">
                  작성한 리뷰가 없습니다.
                </div>
              )}
            </div>
          )}

          {activeTab === "point" && (
            <div className="point-section">
              <h3>포인트 충전</h3>
              <div className="point-info">
                <p>현재 보유 포인트: {point.toLocaleString()}P</p>
              </div>
              <div className="charge-input-group">
                <input
                  type="number"
                  value={chargeAmount}
                  onChange={(e) => setChargeAmount(e.target.value)}
                  placeholder="충전할 금액을 입력하세요"
                  className="charge-input"
                />
                <button onClick={handleCharge} className="charge-button">
                  충전하기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserMyPage;
