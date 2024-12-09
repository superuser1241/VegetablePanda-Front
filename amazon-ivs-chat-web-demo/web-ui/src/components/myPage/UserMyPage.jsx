import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserMyPage.css";
import * as ChargePoint from "./ChargePoint.jsx";
import iamport from "https://cdn.iamport.kr/v1/iamport.js";
import { useNavigate } from "react-router-dom";
import "../../index.css";
import logo from "../../image/기본이미지.png";
import ReviewCommentList from "../ReviewComment/ReviewCommentList.jsx";
import Point from "./Point.jsx";
import UserAuctionHistory from "./UserAuctionHistory.jsx";
import UserLikedShops from "./UserLikedShops.jsx";
const UserMyPage = () => {
  const token = localStorage.getItem("token");
  const [userId, setUserId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [image, setImage] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [buyList, setbuyList] = useState([]);
  const [userLike, setUserLike] = useState([]);
  const [gender, setGender] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading1, setLoading1] = useState(false);
  const [auctions, setAuctions] = useState([]);
  const [point, setPoint] = useState(0);
  const [review, setreview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pw, setPassword] = useState("");
  const [pwConfirm, setConfirmPassword] = useState("");
  const [pwMessage, setPwMessage] = useState("");


  const [buyInfo, setBuyInfo] = useState(null);

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

  const [activeTab, setActiveTab] = useState("info");
  const navigate = useNavigate();
  const serverIp = process.env.REACT_APP_SERVER_IP;

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));

        setUserId(payload.user_seq);
        fetchUserInfo(payload.user_seq);
      } catch (error) {
      }
    }
  }, [token]);

  const handleConfirmPasswordChange = (e) => {
    const pwConfirm = e.target.value;
    setConfirmPassword(pwConfirm);

    if (editedUser.pw === "" || pwConfirm === "") {
      setPwMessage("");
      return;
    }

    if (editedUser.pw === pwConfirm) {
      setPwMessage("비밀번호가 일치합니다.");
    } else {
      setPwMessage("비밀번호가 일치하지 않습니다.");
    }
  };

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
      fetchreview();
      fetchOrderHistory();
      fetchAuctionHistory(userId);
      fetchUserLikeHistory(userId);
    }
  }, [userId]);

  // 주문 내역을 가져오는 함수
  const fetchOrderHistory = async (userId) => {
    try {
// <<<<<<< HEAD
//       setLoading(true); // 로딩 시작
//       const response = await axios.get(`${serverIp}/myPage/buyList/${userId}`);
//       setOrders(response.data); // 가져온 데이터를 상태에 저장
// =======
      setLoading(true);
      const userSeq = localStorage.getItem("userSeq");
      const response = await axios.get(
        `${serverIp}/myPage/buyList/${userSeq}`,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
          }
        }
      );
      setBuyInfo(response.data);
    } catch (err) {
      console.error("주문 내역 조회 에러:", err);
      setError("주문 내역을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserLikeHistory = async (userId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${serverIp}/myPage/userLike/${userId}`);
      setUserLike(response.data);
    } catch (err) {
      setError("구독 내역을 불러오는 중 오류가 발생했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuctionHistory = async (userId) => {
    try {
      setLoading1(true); // 로딩 시작
      const response = await axios.get(
        `${serverIp}/myPage/auction/result/2`
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
      const response = await axios.get(`${serverIp}/myPage/list/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserInfo(response.data);
    } catch (error) {
      console.error("회원 정보 조회 실패:", error);
    }
  };


  const fetchPoint = async (userId) => {
    try {
      const response = await axios.get(`${serverIp}/myPage/point/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setPoint(response.data);
    } catch (error) {
      console.error("포인트 조회 실패:", error);
    }
  };

  const fetchreview = async () => {
    try {

      const userSeq = localStorage.getItem("userSeq");
      const response = await axios.get(
        `${serverIp}/myComments/${userSeq}`,
        {
          headers: {            
            'Authorization': `Bearer ${token}`
        },
        }
      );
      setreview(response.data);
    } catch (error) {
      console.error("회원 리뷰 조회 실패:", error);
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
      return;
    }
  
    e.preventDefault();
  
    if (editedUser.pw !== pwConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
  
    if (!editedUser.gender) {
      alert("성별을 선택해 주세요.");
      return;
    }
  
    const phoneWithoutHyphen = editedUser.phone.replace(/-/g, "");
    const formattedPhone =
      phoneWithoutHyphen.length === 10
        ? `${phoneWithoutHyphen.slice(0, 3)}-${phoneWithoutHyphen.slice(3, 6)}-${phoneWithoutHyphen.slice(6)}`
        : `${phoneWithoutHyphen.slice(0, 3)}-${phoneWithoutHyphen.slice(3, 7)}-${phoneWithoutHyphen.slice(7)}`;
  
      
    const formData = new FormData();
    formData.append(
      "userData",
      new Blob(
        [
          JSON.stringify({
            id: userInfo.id,
            name: editedUser.name,
            pw: editedUser.pw,
            address: editedUser.address,
            phone: formattedPhone,
            email: editedUser.email,
            gender: editedUser.gender,
            path: userInfo.path,
          }),
        ],
        { type: "application/json" }
      )
    );
  
    if (image) {
      formData.append("image", image);
    } else if (image === null || imagePreview === null) {
      formData.append("image", userInfo.path); 
    }
  
    try {
      const response = await axios.put(
        `${serverIp}/myPage/user/update/${userId}`,
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
        await fetchUserInfo(userId);
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
          `${serverIp}/myPage/delete/${userId}`,
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

  // const handleDeletereview = async (revieweq) => {
  //   try {
  //     await axios.delete(`${serverIp}/myPage/review/${userId}/${revieweq}`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     alert("리뷰가 삭제되었습니다.");
  //     fetchreview(userId);
  //   } catch (error) {
  //     console.error("리뷰 삭제 실패:", error);
  //     alert("리뷰 삭제에 실패했습니다.");
  //   }
  // };

  const handleReviewWrite = async (order) => {
    try {
      if (!order) {
        console.error('주문 정보가 없습니다:', order);
        alert('주문 정보를 찾을 수 없습니다.');
        return;
      }

      if (order.reviewStatus === 'COMPLETED') {
        alert('이미 리뷰를 작성한 상품입니다.');
        return;
      }

      const orderInfo = {
        userBuyDetailSeq: order.userBuyDetailSeq,
        content: order.productName || order.content,
        count: order.count,
        price: order.price,
        buyDate: order.buyDate,
        reviewSeq: order.reviewSeq
      };

      console.log("ReviewCommentWrite로 전달되는 데이터:", orderInfo);

      navigate('/reviewComment/write', {
        state: { orderInfo }
      });
    } catch (error) {
      console.error("리뷰 작성 준비 중 오류 발생:", error);
      alert("리뷰 작성 페이지로 이동 중 오류가 발생했습니다.");
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
              onClick={() => setActiveTab("saleLike")}
              className={activeTab === "saleLike" ? "active" : ""}
            >
              좋아요 누른 상품
            </li>
            <li
              onClick={() => setActiveTab("userLike")}
              className={activeTab === "userLike" ? "active" : ""}
            >
              구독 목록
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
              onClick={() => setActiveTab("cart")}
              className={activeTab === "cart" ? "active" : ""}
            >
              장바구니
            </li>
          </ul>
        </div>

        <div className="main-content">
          {activeTab === "userLike" && (
            <div className="main-content">
              <h3 className="userMyPage-title">구독한 판매자 목록</h3>
              {loading1 ? (
                <div className="userMyPage-loading">로딩 중...</div>
              ) : error ? (
                <div className="userMyPage-error-message">{error}</div>
              ) : userLike.length > 0 ? (
                <div className="userMyPage-card-container">
                  {userLike.map((userLike, index) => (
                    <div className="userMyPage-card" key={index}>
                      <img
                        src={userLike.imageUrl}
                        alt={userLike.name}
                        className="userMyPage-card-image"
                      />
                      <div className="userMyPage-card-name">
                        {userLike.name}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data-notification">
                  구독한 내역이 없습니다.
                </div>
              )}
            </div>
          )}

          {activeTab === "saleLike" && (
            <UserLikedShops />
          )}

          {activeTab === "info" && userInfo && (
            <div className="user-info-section">
              <h3>회원 정보</h3>
              <div className="user-info-details">
                <strong>프로필 사진</strong>
                <div className="image-and-point-container">
                  <div className="image-preview-container">
                    <img src={userInfo?.path || logo} />
                  </div>
                  <div className="point-container">
                    <Point userId={userId} point={point} fetchPoint={fetchPoint} />
                  </div>
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
                  <strong>보유 포인트:</strong> {point.toLocaleString() + "P"}
                </p>
              </div>
            </div>
          )}


          {activeTab === "buyList" && (
            <div className="order-history-display">
              <h3>주문 내역</h3>
              <table>
                <thead>
                  <tr>
                    <th>번호</th>
                    <th>주문번호</th>
                    <th>상품명</th>
                    <th>수량</th>
                    <th>가격</th>
                    <th>주문일자</th>
                    <th>주문상태</th>
                    <th>리뷰</th>
                  </tr>
                </thead>
                <tbody>
                  {buyInfo.map((order, index) => (
                    <tr key={`${index}`}>
                      <td>{index + 1}</td>
                      <td>{order.userBuyDetailSeq}</td>
                      <td>{order.content}</td>
                      <td>{order.count}개</td>
                      <td>{order.price}원</td>
                      <td>{new Date(order.buyDate).toLocaleDateString()}</td>
                      <td>{order.state}</td>
                      <td>
                        <button
                          onClick={() => handleReviewWrite(order)}
                          className={`review-button ${order.reviewStatus === 'COMPLETED' ? 'completed' : ''}`}
                          disabled={order.reviewStatus === 'COMPLETED'}
                        >
                          {order.reviewStatus === 'COMPLETED' ? '작성완료' : '리뷰작성'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "auction" && (
            // <div className="auction-history-display">
            //   <h3>경매 참여 내역</h3>
            //   {loading1 ? (
            //     <div>로딩 중...</div>
            //   ) : error ? (
            //     <div className="error-message">{error}</div>
            //   ) : auctions.length > 0 ? (
            //     <table className="auction-history-table-container">
            //       <thead>
            //         <tr>
            //           <th>번호</th>
            //           <th>상품명</th>
            //           <th>수량</th>
            //           <th>낙찰 금액</th>
            //           <th>참여 일자</th>
            //           <th>판매자명</th>
            //         </tr>
            //       </thead>
            //       <tbody>
            //         {auctions.map((auction, index) => {
            //           // 날짜 포맷 변경 함수
            //           const formatDate = (dateString) => {
            //             const date = new Date(dateString);
            //             const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            //             const formattedTime = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
            //             return `${formattedDate} ${formattedTime}`;
            //           };
            //           return (
            //           <tr key={auction.bidSeq}>
            //             <td>{auction.buySeq}</td> {/* 경매번호 */}
            //             <td>{auction.productName}</td> {/* 상품명 */}
            //             <td>{auction.count}</td> {/* 수량*/}
            //             <td>{auction.totalPrice}원</td> {/* 입찰할 금액 */}
            //             <td>{formatDate(auction.insertDate)}</td> {/* 입찰한 날짜 */}
            //             <td>{auction.name}</td> {/* 판매자명 */}

            //             {/* 현재 상태 */}
            //           </tr>
            //           )
            //           })}
            //       </tbody>
            //     </table>
            //   ) : (
            //     <div className="no-data-notification">
            //       경매 참여 내역이 없습니다.
            //     </div>
            //   )}
            // </div>
            <UserAuctionHistory  auctions = {auctions} loading1 = {loading1} error = {error}/>
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
                    {imagePreview !== null ? (
                      <img
                      src={imagePreview}
                      alt="imagePreview"
                      className="image-preview"
                    />
                      
                    ) : (
                      <img
                      src={userInfo.path}
                      alt="userInfo.path"
                      className="image-preview"
                    />
                    )}
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

                  {(image !== null || userInfo.path !== null) && (
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
                  value={pwConfirm}
                  onChange={handleConfirmPasswordChange}
                  required
                />
                <div
                  className="mypage-pw-match-message"
                  style={{
                    color:
                      pwMessage === "비밀번호가 일치합니다." ? "green" : "red",
                  }}
                >
                  {pwMessage}
                </div>
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
                  onChange={handlePhoneChange} // onChange 들러로 전화번호 처리
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
                      } // editedUser.gender 업데이���
                      className="user-gender-radio"
                    />
                    <label htmlFor="female" className="gender-label">
                      여성
                    </label>
                  </div>
                </div>

                <div className="mypage-button-container">
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
            <div className="review-history-display">
              <h3>나의 리뷰</h3>
              <ReviewCommentList userSeq={localStorage.getItem("userSeq")} />
            </div>
          )}

          {activeTab === "cart" && (
            <div
              className="cart-banner-section"
              onClick={() => navigate("/cart")}
            >
              <div className="cart-banner-content">
                <i className="fas fa-shopping-cart"></i>
                <h3>장바구니</h3>
                <p>장바구니에서 선택하신 상품을 확인하세요</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserMyPage;