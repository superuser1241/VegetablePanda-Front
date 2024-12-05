import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CompanyMyPage.css";
import { useNavigate } from "react-router-dom";
import logo from "../../image/기본이미지.png";

const CompanyMyPage = () => {
  const [chargeAmount, setChargeAmount] = useState("");
  const [companyInfo, setCompanyInfo] = useState(null);
  const token = localStorage.getItem("token");
  const [userId, setUserId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedCompany, setEditedCompany] = useState({
    comName: "",
    ownerName: "",
    regName: "",
    email: "",
    code: "",
    path: "",
    address: "",
    phone: "",
    pw: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(logo);
  const [point, setPoint] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loading1, setLoading1] = useState(false);
  const [buyList, setBuyList] = useState([]);
  const [codePart1, setCodePart1] = useState("");
  const [codePart2, setCodePart2] = useState("");
  const [codePart3, setCodePart3] = useState("");
  const [auctions, setAuctions] = useState([]);
  const [review, setReview] = useState([]);
  const [activeTab, setActiveTab] = useState("info");
  const navigate = useNavigate();
  const [pw, setPassword] = useState("");
  const [pwConfirm, setConfirmPassword] = useState("");
  const [pwMessage, setPwMessage] = useState("");
  const serverIp = process.env.REACT_APP_SERVER_IP;
  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserId(payload.user_seq);
        fetchCompanyInfo(payload.user_seq);
      } catch (error) {
        console.error("토큰 파싱 실패:", error);
      }
    }
  }, [token]);

  const handleConfirmPasswordChange = (e) => {
    const pwConfirm = e.target.value;
    setConfirmPassword(pwConfirm);

    // 비밀번호와 비밀번호 확인이 일치하는지 확인
    if (editedCompany.pw === "" || pwConfirm === "") {
      setPwMessage("");
      return;
    }

    if (editedCompany.pw === pwConfirm) {
      setPwMessage("비밀번호가 일치합니다.");
    } else {
      setPwMessage("비밀번호가 일치하지 않습니다.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedCompany((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (companyInfo) {
      setEditedCompany({
        email: companyInfo.email || "",
        id: companyInfo.companyId || "",
        phone: companyInfo.phone || "",
        comName: companyInfo.comName || "",
        ownerName: companyInfo.ownerName || "",
        address: companyInfo.address || "",
        code: companyInfo.code || "",
        pw: companyInfo.pw || "",
        regName: companyInfo.regName || "",
        regDate: companyInfo.regDate || "",
        path: companyInfo.path || "",
      });
    }
  }, [companyInfo]);

  useEffect(() => {
    if (userId) {
      fetchCompanyInfo(userId);
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
      const serverIp = process.env.REACT_APP_SERVER_IP;
      const response = await axios.get(`${serverIp}/myPage/buyList/${userId}`);
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
      const response = await axios.get(`${serverIp}/myPage/auction/${userId}`); // API 엔드포인트
      setAuctions(response.data); // 데이터 저장
    } catch (err) {
      setError("데이터를 불러오는 중 오류가 발생했습니다.");
      console.error(err);
    } finally {
      setLoading1(false); // 로딩 종료
    }
  };

  const fetchCompanyInfo = async (userId) => {
    try {
      const response = await axios.get(`${serverIp}/myPage/company/list/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompanyInfo(response.data);
    } catch (error) {
      console.error("회사 정보 조회 실패:", error);
    }
  };

  const fetchPoint = async (userId) => {
    try {
      const response = await axios.get(`${serverIp}/myPage/point/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPoint(response.data);
    } catch (error) {
      console.error("포인트 조회 실패:", error);
    }
  };

  const fetchreview = async (userId) => {
    try {
      const response = await axios.get(`${serverIp}/myPage/review/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReview(response.data);
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

      const response = await axios.post(`${serverIp}/charge`, {
        managementUserSeq: parseInt(userId),
        price: parseInt(chargeAmount),
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data) {
        setChargeAmount("");
        window.location.href = response.data;
      }
    } catch (error) {
      console.error("포인트 충전 실패:", error);
      alert("포인트 충전에 실패했습니다.");
    }
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
    setCompanyInfo((prevState) => ({
      ...prevState,
      path: null,
    }));
    setImagePreview(null);
    setImage(null);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 11);

    setEditedCompany((prev) => ({ ...prev, phone: value }));
  };
  const validateInput = (value, maxLength) => {
    return value.replace(/[^0-9]/g, "").slice(0, maxLength);
  };

  const handleUpdateCompanyInfo = async (e) => {
    const confirmUpdate = window.confirm("수정 하시겠습니까?");

    if (!confirmUpdate) {
      return;
    }

    e.preventDefault();

    if (
      codePart1.length !== 3 ||
      codePart2.length !== 2 ||
      codePart3.length !== 5
    ) {
      alert("사업자 등록번호를 다시 입력해주세요.");
      return;
    }

    if (editedCompany.pw !== pwConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const phoneWithoutHyphen = editedCompany.phone.replace(/-/g, "");
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
    const code = `${codePart1}-${codePart2}-${codePart3}`;
    const id = companyInfo.companyId;
    setImage(companyInfo.path);
    const formData = new FormData();
    formData.append(
      "companyData",
      new Blob(
        [
          JSON.stringify({
            id,
            comName: editedCompany.comName,
            ownerName: editedCompany.ownerName,
            regName: editedCompany.regName,
            email: editedCompany.email,
            code: code,
            address: editedCompany.address,
            phone: formattedPhone,
            pw: editedCompany.pw,
            path: companyInfo.path,
          }),
        ],
        { type: "application/json" }
      )
    );

    // 이미지 처리: 새로운 이미지가 없으면 기존 이미지 경로를 보내기
    if (image) {
      formData.append("image", image); // 새로운 이미지
    } else if (image === null || imagePreview === null) {
      // 이미지가 null일 경우 기존 경로를 보내기 (userInfo.path)
      formData.append("image", companyInfo.path); // 기존 이미지 경로
    }

    try {
      const response = await axios.put(
        `${serverIp}/myPage/company/update/${userId}`, 
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
          await fetchCompanyInfo(companyInfo.id);
          setImage(companyInfo.path); // 기존 이미지 경로로 설정
          setActiveTab("info");
      }
    } catch (error) {
      console.error("회원정보 수정 실패:", error);
      alert("정보 수정에 실패했습니다.");
    }
  };

  //회원탈퇴
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "정말로 회원 탈퇴를 진행하시겠습니까?"
    );

    if (confirmDelete) {
      try {
        const response = await axios.put(`${serverIp}/myPage/company/delete/${userId}`, { userId }, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.data === 1) {
          alert("회원 탈퇴가 완료되었습니다.");
          localStorage.removeItem("token");
          localStorage.setItem("token", null);
          navigate("/"); // 홈 페이지로 이동
        }
      } catch (error) {
        console.error("회원 탈퇴 실패:", error);
        alert("회원 탈퇴에 실패했습니다.");
      }
    }
  };

  const handleDeleteReview = async (reviewSeq) => {
    try {
      await axios.delete(`${serverIp}/myPage/review/${userId}/${reviewSeq}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
              구매 내역
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
              onClick={() => setActiveTab("point")}
              className={activeTab === "point" ? "active" : ""}
            >
              포인트 충전
            </li>
          </ul>
        </div>

        <div className="main-content">
          {activeTab === "info" && companyInfo && (
            <div className="user-info-section">
              <h3>회원 정보</h3>
              <div className="user-info-details">
                <strong>프로필 사진</strong>
                <div className="image-preview-container">
                  <img
                    src={companyInfo.path || logo }
                    alt={companyInfo.path}
                  />
                </div>
                <p>
                  <strong>아이디 :</strong> {companyInfo.companyId}
                </p>
                <p>
                  <strong>기업명 :</strong> {companyInfo.comName}
                </p>
                <p>
                  <strong>대표자 :</strong> {companyInfo.ownerName}
                </p>
                <p>
                  <strong>가입자 :</strong> {companyInfo.regName}
                </p>
                <p>
                  <strong>이메일 :</strong> {companyInfo.email}
                </p>
                <p>
                  <strong>사업자 등록번호 :</strong> {companyInfo.code}
                </p>
                <p>
                  <strong>기업주소 :</strong> {companyInfo.address}
                </p>
                <p>
                  <strong>전화번호 :</strong> {companyInfo.phone}
                </p>
                <p>
                  <strong>가입일자 :</strong>{" "}
                  {new Date(companyInfo.regDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>보유 포인트:</strong> {point.toLocaleString()}P
                </p>
              </div>
            </div>
          )}

          {activeTab === "update" && (
            <div className="user-info-edit-section">
              <h3>업체 정보 수정</h3>
              <form onSubmit={handleUpdateCompanyInfo}>
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
                    {companyInfo.path ?
                      <img
                        src={companyInfo.path}
                        alt="companyInfo.path"
                        className="image-preview"
                        />
                        : 
                      <img
                        src={imagePreview}
                        alt="imagePreview"
                        className="image-preview"
                      />
                    }
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

                  {(image !== null || companyInfo.path !== null) && (
                    <button
                      type="button"
                      className="image-reset-btn"
                      onClick={handleImageReset}
                    >
                      삭제
                    </button>
                  )}
                </div>
                <label>업체명</label>
                <input
                  type="text"
                  name="comName"
                  value={editedCompany.comName}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="owner">대표자명</label>
                <input
                  type="text"
                  name="ownerName"
                  value={editedCompany.ownerName}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="registrant">가입자명</label>
                <input
                  type="text"
                  name="regName"
                  value={editedCompany.regName}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="email">이메일</label>
                <input
                  type="email"
                  name="email"
                  value={editedCompany.email}
                  onChange={handleChange}
                  required
                />
                <label className="business-number-label">사업자 등록번호</label>
                <div className="business-number-input-wrapper">
                  <input
                    type="text"
                    value={codePart1}
                    onChange={(e) =>
                      setCodePart1(validateInput(e.target.value, 3))
                    }
                    placeholder="000"
                    maxLength="3"
                    className="business-number-input"
                  />
                  <span className="hyphen">-</span>
                  <input
                    type="text"
                    value={codePart2}
                    onChange={(e) =>
                      setCodePart2(validateInput(e.target.value, 2))
                    }
                    placeholder="00"
                    maxLength="2"
                    className="business-number-input"
                  />
                  <span className="hyphen">-</span>
                  <input
                    type="text"
                    value={codePart3}
                    onChange={(e) =>
                      setCodePart3(validateInput(e.target.value, 5))
                    }
                    placeholder="00000"
                    maxLength="5"
                    className="business-number-input"
                  />
                </div>

                <label htmlFor="address">업체 주소</label>
                <input
                  type="text"
                  name="address"
                  value={editedCompany.address}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="phone">전화번호</label>
                <input
                  type="tel"
                  name="phone"
                  value={editedCompany.phone.replace(/-/g, "")}
                  onChange={handlePhoneChange}
                  required
                />
                <label>비밀번호</label>
                <input
                  type="password"
                  name="pw"
                  value={editedCompany.pw}
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
                      <button
                        onClick={() =>
                          handleDeleteReview(review.reviewCommentSeq)
                        }
                        className="delete-button"
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

          {activeTab === "buyList" && (
            <div className="yun-order-history-display">
              <h3>주문 내역</h3>
              {loading ? (
                <div>로딩 중...</div>
              ) : error ? (
                <div className="error-message">{error}</div>
              ) : orders.length > 0 ? (
                <table>
                  <thead>
                    <tr className="yun-company-mypage-tr">
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
                      <tr key={order.orderId} className="yun-company-mypage-tr">
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
                <div className="yun-no-data-notification">
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
                    <tr className="company-mypage-tr">
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
                      <tr key={auction.bidSeq} className="company-mypage-tr">
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

export default CompanyMyPage;
