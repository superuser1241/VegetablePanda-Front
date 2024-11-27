import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CompanyMyPage.css";
import { useNavigate } from "react-router-dom";

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
    address: "",
    phone: "",
    pw: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [point, setPoint] = useState(0);
  const [buyList, setBuyList] = useState([]);
  const [codePart1, setCodePart1] = useState("");
  const [codePart2, setCodePart2] = useState("");
  const [codePart3, setCodePart3] = useState("");
  const [auctions, setAuctions] = useState([]);
  const [review, setReview] = useState([]);
  const [activeTab, setActiveTab] = useState("info"); // 'info', 'edit', 'review' 탭 관리
  const navigate = useNavigate();

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
        profileImage: companyInfo.profileImage || null,
      });
      setImagePreview(companyInfo.profileImage);
    }
  }, [companyInfo]);

  useEffect(() => {
    if (userId) {
      fetchCompanyInfo(userId);
      fetchPoint(userId);
      fetchreview(userId);
    }
  }, [userId]);

  const fetchCompanyInfo = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:9001/myPage/company/list/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCompanyInfo(response.data);
    } catch (error) {
      console.error("회사 정보 조회 실패:", error);
    }
  };

  const fetchPoint = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:9001/myPage/point/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
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

      if (response.data) {
        setChargeAmount("");
        window.location.href = response.data;
      }
    } catch (error) {
      console.error("포인트 충전 실패:", error);
      alert("포인트 충전에 실패했습니다.");
    }
  };

  // 이미지
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
    setImage(null);
    setImagePreview(null);
  };

  // 사업자 등록번호
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

    // 비밀번호 일치 여부 확인
    if (editedCompany.pw !== editedCompany.pwConfirm) {
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
    const formData = new FormData();
    formData.append("comName", editedCompany.comName);
    formData.append("ownerName", editedCompany.ownerName);
    formData.append("regName", editedCompany.regName);
    formData.append("email", editedCompany.email);
    formData.append("code", code);
    formData.append("address", editedCompany.address);
    formData.append("phone", editedCompany.phone);
    formData.append("pw", editedCompany.pw);

    // 이미지가 있으면 이미지 추가
    if (image) {
      formData.append("profileImage", image);
    }

    try {
      const response = await axios.put(
        `http://localhost:9001/myPage/company/update/${userId}`,
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
        setCompanyInfo({
          ...companyInfo,
          comName: editedCompany.comName,
          ownerName: editedCompany.ownerName,
          regName: editedCompany.regName,
          pw: editedCompany.pw,
          email: editedCompany.email,
          phone: formattedPhone,
          address: editedCompany.address,
          code: code,
          profileImage: imagePreview || companyInfo.profileImage,
        });
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
        const response = await axios.put(
          `http://localhost:9001/myPage/company/delete/${userId}`,
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
      await axios.delete(
        `http://localhost:9001/myPage/review/${userId}/${reviewSeq}`,
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
                <p>
                  <strong>프로필사진 :</strong> {companyInfo.file}
                </p>
                
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

                  {/* 미리보기 네모 영역 */}
                  <div className="image-preview-container">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile Preview"
                        className="image-preview"
                      />
                    ) : (
                      <div className="image-placeholder">이미지 미리보기</div> // 이미지 미리보기 텍스트
                    )}
                  </div>

                  {/* 이미지 업로드 버튼 */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                    id="profileImageInput"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById("profileImageInput").click()
                    }
                  >
                    이미지 업로드
                  </button>

                  {/* 이미지 초기화 버튼 */}
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={handleImageReset}
                      className="reset-btn1"
                    >
                      이미지 초기화
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
                  onChange={handleChange}
                  required
                />
                <label>비밀번호 확인</label>
                <input
                  type="password"
                  name="pwConfirm"
                  onChange={handleChange}
                  required
                />
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
            <div className="user-buyList-history-display">
              <h3>주문 내역</h3>
              {buyList.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>주문 번호</th>
                      <th>상품명</th>
                      <th>수량</th>
                      <th>주문일</th>
                      <th>상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {buyList.map((buyList) => (
                      <tr key={buyList.id}>
                        <td>{buyList.id}</td>
                        <td>{buyList.productName}</td>
                        <td>{buyList.quantity}</td>
                        <td>{buyList.orderDate}</td>
                        <td>{buyList.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-buyList-data">주문내역이 없습니다.</div>
              )}
            </div>
          )}

          {activeTab === "auction" && (
            <div className="user-auction-history-display">
              <h3>경매 참여 내역</h3>
              {auctions.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>경매 번호</th>
                      <th>상품명</th>
                      <th>최고 입찰가</th>
                      <th>경매 종료일</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auctions.map((auction) => (
                      <tr key={auction.id}>
                        <td>{auction.id}</td>
                        <td>{auction.productName}</td>
                        <td>{auction.highestBid}</td>
                        <td>{auction.endDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-auction-data">경매내역이 없습니다.</div>
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
