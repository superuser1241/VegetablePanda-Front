import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./FarmerMyPage.css";
import RegisterStock from "./RegisterStock";

const FarmerMyPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [userId, setUserId] = useState("");
  const [image, setImage] = useState(null);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [error1, setError1] = useState(null);
  const [codePart1, setCodePart1] = useState("");
  const [codePart2, setCodePart2] = useState("");
  const [codePart3, setCodePart3] = useState("");
  const [review, setReview] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]); // 체크박스를 선택한 항목을 저장

  const [settlements, setSettlements] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [farmerInfo, setFarmerInfo] = useState(null);
  const [editedFarmer, setEditedFarmer] = useState({
    email: "",
    phone: "",
    code: "",
    name: "",
    pw: "",
    address: "",
  });

  const [activeTab, setActiveTab] = useState("info"); // 기본 탭을 info로 변경
  const [newProduct, setNewProduct] = useState({
    color: "",
    count: "",
    status: 2,
    content: "",
    productSeq: "",
    stockGradeSeq: "",
    stockOrganicSeq: "",
  });
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserId(payload.user_seq);
        fetchFarmerInfo(payload.user_seq); // 회원정보 조회 주석
      } catch (error) {
        console.error("토큰 파싱 실패:", error);
      }
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedFarmer((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (farmerInfo) {
      setEditedFarmer({
        email: farmerInfo.email || "",
        farmerId: farmerInfo.farmerId || "",
        phone: farmerInfo.phone || "",
        name: farmerInfo.name || "",
        address: farmerInfo.address || "",
        code: farmerInfo.code || "",
        grade: farmerInfo.grade || "",
        pw: farmerInfo.pw || "",
        regDate: farmerInfo.regDate || "",
        profileImage: farmerInfo.profileImage || null,
      });
      setImagePreview(farmerInfo.profileImage);
    }
  }, [farmerInfo]);

  useEffect(() => {
    if (userId) {
      fetchFarmerInfo(userId);
      fetchReview(userId);
      fetchSettlementHistory(userId);
      fetchSalesHistory(userId);
    }
  }, [userId]);

  useEffect(() => {
    if (token) {
      fetchProducts();
    }
  }, [token]);

  const fetchSettlementHistory = async (userId) => {
    try {
      setLoading(true);

      const response = await axios.get(
        `http://localhost:9001/myPage/farmer/point/calc/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSettlements(response.data);
    } catch (err) {
      setError1("정산 내역을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSalesHistory = async (userId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:9001/myPage/farmer/saleList/${userId}`
      ); // 판매 내역 가져오는 API
      setSales(response.data);
    } catch (err) {
      setError("판매 내역을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 체크박스를 클릭할 때마다 선택된 항목을 업데이트하는 함수
  const handleCheckboxChange = (saleSeq) => {
    setSelectedItems((prevState) => {
      if (prevState.includes(saleSeq)) {
        // 이미 선택된 항목이라면 제거
        return prevState.filter((item) => item !== saleSeq);
      } else {
        // 선택되지 않은 항목이라면 추가
        return [...prevState, saleSeq];
      }
    });
  };

 // 정산 신청 버튼 클릭 시 선택된 항목의 데이터를 서버로 전송하는 함수
const handleSettlementRequest = async () => {
  const currentDate = new Date().toISOString().split("T")[0]; // 오늘 날짜 (YYYY-MM-DD)

  // 선택된 항목에 대한 데이터 처리
  const settlementData = sales
    .filter((sale) => selectedItems.includes(sale.buySeq))
    .map((sale) => ({
      totalPoint: sale.price,
      insertDate: currentDate,
    }));

  if (settlementData.length > 0) {
    try {
      // SettlementRequestDTO 형태로 감싸서 전송
      const settlementRequest = { settlements: settlementData };

      // 선택된 데이터를 백엔드로 전송
      await axios.post(
        `http://localhost:9001/myPage/farmer/settle/${userId}`,
        settlementRequest
      );
      alert("정산 신청이 완료되었습니다.");
    } catch (err) {
      setError("정산 신청 실패");
    }
  } else {
    alert("정산 신청할 항목을 체크하세요.");
  }
};


  const fetchFarmerInfo = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:9001/myPage/farmer/list/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const farmerData = response.data;

      // 필요한 데이터만 남기기
      const simplifiedData = {
        farmerId: farmerData.farmerId,
        name: farmerData.name,
        code: farmerData.code,
        address: farmerData.address,
        phone: farmerData.phone,
        grade: farmerData.grade,
        regDate: farmerData.regDate,
        email: farmerData.email,
      };

      setFarmerInfo(simplifiedData);
    } catch (error) {
      console.error("회원 정보 조회 실패:", error);
    }
  };

  const fetchReview = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:9001/myPage/farmer/review/List/${userId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setReview(response.data);
    } catch (error) {
      console.error("리뷰 조회 실패:", error);
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

    setEditedFarmer((prev) => ({ ...prev, phone: value }));
  };
  const validateInput = (value, maxLength) => {
    return value.replace(/[^0-9]/g, "").slice(0, maxLength);
  };

  const handleUpdateFarmerInfo = async (e) => {
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
    if (editedFarmer.pw !== editedFarmer.pwConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const phoneWithoutHyphen = editedFarmer.phone.replace(/-/g, "");
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
    formData.append("name", editedFarmer.name);
    formData.append("email", editedFarmer.email);
    formData.append("code", code);
    formData.append("address", editedFarmer.address);
    formData.append("phone", editedFarmer.phone);
    formData.append("pw", editedFarmer.pw);

    // 이미지가 있으면 이미지 추가
    if (image) {
      formData.append("profileImage", image);
    }

    try {
      const response = await axios.put(
        `http://localhost:9001/myPage/farmer/update/${userId}`,
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
        setFarmerInfo({
          ...farmerInfo,
          name: editedFarmer.name,
          pw: editedFarmer.pw,
          email: editedFarmer.email,
          phone: formattedPhone,
          address: editedFarmer.address,
          code: code,
          profileImage: imagePreview || farmerInfo.profileImage,
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
        const response = await axios.post(
          `http://localhost:9001/myPage/farmer/delete/${userId}`,
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
  const handleDeleteReview = async (revieweq) => {
    try {
      await axios.delete(
        `http://localhost:9001/myPage/review/${userId}/${revieweq}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("리뷰가 삭제되었습니다.");
      fetchReview(userId);
    } catch (error) {
      console.error("리뷰 삭제 실패:", error);
      alert("리뷰 삭제에 실패했습니다.");
    }
  };
  const filteredProducts = selectedCategory
    ? products.filter(
        (product) => product.productCategorySeq === parseInt(selectedCategory)
      )
    : products;

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:9001/product", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setProducts(response.data);
      console.log("상품 목록:", response.data);
    } catch (error) {
      console.error("상품 목록 조회 실패:", error);
    }
  };

  const handleProductSubmit = async () => {
    try {
      // URL에 쿼리 파라미터 추가
      const url = `http://localhost:9001/stock?productSeq=${newProduct.productSeq}&stockGradeSeq=${newProduct.stockGradeSeq}&stockOrganicSeq=${newProduct.stockOrganicSeq}&farmerSeq=${userId}`;

      // body 데이터
      const stockData = {
        color: parseInt(newProduct.color),
        count: parseInt(newProduct.count),
        content: newProduct.content,
        status: 2,
      };

      console.log("요청 URL:", url);
      console.log("요청 데이터:", stockData);

      const response = await axios.post(url, stockData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        alert("상품이 등록되었습니다. 관리자 승인 후 판매가 시작됩니다.");
        setNewProduct({
          color: "",
          count: "",
          status: 2,
          content: "",
          productSeq: "",
          stockGradeSeq: "",
          stockOrganicSeq: "",
        });
        setSelectedCategory("");
      }
    } catch (error) {
      console.error("상품 등록 실패:", error);
      console.error("요청 URL:", error.config?.url);
      console.error("요청 데이터:", error.config?.data);
    }
  };

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="farmer-mypage">
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
              onClick={() => setActiveTab("sale")}
              className={activeTab === "sale" ? "active" : ""}
            >
              판매 내역
            </li>

            <li
              onClick={() => setActiveTab("calculate")}
              className={activeTab === "calculate" ? "active" : ""}
            >
              정산 내역
            </li>
            <li
              onClick={() => setActiveTab("review")}
              className={activeTab === "review" ? "active" : ""}
            >
              나의 리뷰
            </li>
            <li
              onClick={() => setActiveTab("streaming")}
              className={activeTab === "streaming" ? "active" : ""}
            >
              스트리밍 관리
            </li>
            <li
              onClick={() => setActiveTab("product")}
              className={activeTab === "product" ? "active" : ""}
            >
              상품 등록
            </li>
            <li
              onClick={() => setActiveTab("stoke")}
              className={activeTab === "stoke" ? "active" : ""}
            >
              내 상품 목록
            </li>
          </ul>
        </div>

        <div className="main-content">
          {activeTab === "info" && farmerInfo && (
            <div className="user-info-section">
              <h3>회원 정보</h3>
              <div className="user-info-details">
                <p>
                  <strong>프로필사진</strong> {farmerInfo.file}
                </p>
                <p>
                  <strong>아이디 :</strong> {farmerInfo.farmerId}
                </p>
                <p>
                  <strong>대표자 :</strong> {farmerInfo.name}
                </p>
                <p>
                  <strong>이메일 :</strong> {farmerInfo.email}
                </p>
                <p>
                  <strong>사업자 등록번호 :</strong> {farmerInfo.code}
                </p>
                <p>
                  <strong>주소 :</strong> {farmerInfo.address}
                </p>
                <p>
                  <strong>전화번호 :</strong> {farmerInfo.phone}
                </p>
                <p>
                  <strong>등급 :</strong> {farmerInfo.grade}
                </p>
                <p>
                  <strong>가입일자 :</strong>
                  {new Date(farmerInfo.regDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}

          {activeTab === "update" && (
            <div className="user-info-edit-section">
              <h3>업체 정보 수정</h3>
              <form onSubmit={handleUpdateFarmerInfo}>
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
                      <div className="image-placeholder">사진</div> // 이미지 미리보기 텍스트
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
                <label htmlFor="owner">판매자명</label>
                <input
                  type="text"
                  name="ownerName"
                  value={editedFarmer.name}
                  onChange={handleChange}
                  required
                />

                <label htmlFor="email">이메일</label>
                <input
                  type="email"
                  name="email"
                  value={editedFarmer.email}
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

                <label htmlFor="address">주소</label>
                <input
                  type="text"
                  name="address"
                  value={editedFarmer.address}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="phone">전화번호</label>
                <input
                  type="tel"
                  name="phone"
                  value={editedFarmer.phone.replace(/-/g, "")}
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
              <h3>나에게 작성된 리뷰</h3>
              {review.length > 0 ? (
                <table className="review-table">
                  <thead>
                    <tr>
                      <th>리뷰번호</th>
                      <th>사진</th>
                      <th>내용</th>
                      <th>점수</th>
                      <th>작성 날짜</th>
                      <th>작성자</th>
                      <th>삭제</th>
                    </tr>
                  </thead>
                  <tbody>
                    {review.map((review, index) => (
                      <tr key={review.reviewCommentSeq}>
                        <td>{index + 1}</td>
                        <td>
                          {review.filePath ? (
                            <div className="review-image">
                              <img src={review.filePath} alt="리뷰 이미지" />
                            </div>
                          ) : (
                            <p>이미지가 없습니다.</p>
                          )}
                        </td>
                        <td>{review.content}</td>
                        <td>{review.score}</td>
                        <td>{new Date(review.date).toLocaleDateString()}</td>
                        <td>{review.name}</td>
                        <td>
                          <button
                            className=""
                            onClick={() =>
                              handleDeleteReview(review.reviewCommentSeq)
                            }
                          >
                            삭제
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-data-notification">
                  작성된 리뷰가 없습니다.
                </div>
              )}
            </div>
          )}

          {activeTab === "stoke" && (
            <div className="reviews-section">
              <h3>내가 등록한 상품 목록</h3>
            </div>
          )}

          {activeTab === "sale" && (
            <div className="sales-history-display">
              <h3>내가 판매한 내역</h3>
              {loading ? (
                <div>로딩 중...</div>
              ) : error ? (
                <div className="error-message">{error}</div>
              ) : sales.length > 0 ? (
                <>
                  <table>
                    <thead>
                      <tr>
                        <th></th>
                        <th>판매 번호</th>
                        <th>상품명</th>
                        <th>수량</th>
                        <th>금액</th>
                        <th>판매일자</th>
                        <th>판매 상태</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sales.map((sale, index) => (
                        <tr key={sale.buySeq}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(sale.buySeq)}
                              onChange={() => handleCheckboxChange(sale.buySeq)} // 체크박스 클릭 시 선택 상태 업데이트
                            />
                          </td>
                          <td>{sale.userBuySeq}</td>
                          <td>{sale.content}</td>
                          <td>{sale.count}</td>
                          <td>{sale.price}원</td>
                          <td>{new Date(sale.buyDate).toLocaleDateString()}</td>

                          <td>
                            {sale.state === 0
                              ? "값 뭐넣어야해여?"
                              : sale.state === 1
                              ? "값 뭐넣어야해여?"
                              : sale.state === 2
                              ? "값 뭐넣어야해여?"
                              : sale.state === 3
                              ? "값 뭐넣어야해여?"
                              : "값 뭐넣어야해여?"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button onClick={handleSettlementRequest}>정산 신청</button>{" "}
                </>
              ) : (
                <div className="no-data-notification">
                  판매 내역이 없습니다.
                </div>
              )}
            </div>
          )}

          {activeTab === "calculate" && (
            <div className="settlement-history-display">
              <h3>정산 내역</h3>
              {loading ? (
                <div>로딩 중...</div>
              ) : error ? (
                <div className="error-message">{error}</div>
              ) : settlements.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>번호</th>
                      <th>판매 금액</th>
                      <th>세후 금액</th>
                      <th>신청 날짜</th>
                      <th>완료 날짜</th>
                      <th>상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {settlements.map((settlement, index) => (
                      <tr key={settlement.calcPointSeq}>
                        <td>{index + 1}</td>
                        <td>{settlement.totalPoint}원</td>
                        <td>{settlement.pointToCash}원</td>
                        <td>
                          {new Date(
                            settlement.insertDate
                          ).toLocaleDateString() || "검토중"}
                        </td>
                        <td>
                          {new Date(
                            settlement.tradeDate
                          ).toLocaleDateString() || "검토중"}
                        </td>
                        <td>
                          {settlement.state === 0
                            ? "정산 전"
                            : settlement.state === 1
                            ? "정산 중"
                            : "정산 완료"}
                        </td>{" "}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-data-notification">
                  정산 내역이 없습니다.
                </div>
              )}
            </div>
          )}

          {activeTab === "streaming" && (
            <div className="streaming-section">
              <h3>스트리밍 관리</h3>
              <div className="streaming-buttons">
                <button
                  className="streaming-btn"
                  onClick={() => navigate("/streaming")}
                >
                  채팅방 선택하기
                </button>
              </div>
            </div>
          )}

          {activeTab === "product" && (
            <div>
              {/* <h3>상품 등록</h3>
                            <div className="product-form">
                                <div className="form-group">
                                    <label>상품 카테고리</label>
                                    <select 
                                        name="category"
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                    >
                                        <option value="">카테고리 선택</option>
                                        <option value="1">채소류</option>
                                        <option value="2">과일류</option>
                                        <option value="3">곡물류</option>
                                        <option value="4">버섯류</option>
                                        <option value="5">뿌리채소</option>
                                        <option value="6">잎채소</option>
                                        <option value="7">쌈채소</option>
                                        <option value="8">산나물</option>
                                        <option value="9">건농산물</option>
                                        <option value="10">견과류</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>상품 종류</label>
                                    <select 
                                        name="productSeq" 
                                        value={newProduct.productSeq}
                                        onChange={handleProductChange}
                                        disabled={!selectedCategory}
                                    >
                                        <option value="">선택하세요</option>
                                        {filteredProducts.map(product => (
                                            <option key={product.productSeq} value={product.productSeq}>
                                                {product.productName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>등급</label>
                                    <select 
                                        name="stockGradeSeq" 
                                        value={newProduct.stockGradeSeq}
                                        onChange={handleProductChange}
                                    >
                                        <option value="">선택하세요</option>
                                        <option value="1">특품</option>
                                        <option value="2">상품</option>
                                        <option value="3">보통</option>
                                        <option value="4">저품</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>재배 방식</label>
                                    <select 
                                        name="stockOrganicSeq" 
                                        value={newProduct.stockOrganicSeq}
                                        onChange={handleProductChange}
                                    >
                                        <option value="">선택하세요</option>
                                        <option value="1">유기농</option>
                                        <option value="2">무농약</option>
                                        <option value="3">일반재배</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>색상 코드</label>
                                    <input
                                        type="number"
                                        name="color"
                                        value={newProduct.color}
                                        onChange={handleProductChange}
                                        placeholder="색상 코드 입력"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>수량</label>
                                    <input
                                        type="number"
                                        name="count"
                                        value={newProduct.count}
                                        onChange={handleProductChange}
                                        placeholder="수량 입력"
                                    />
                                </div>
                                <div className="product-description">
                                    <label>상품 설명</label>
                                    <textarea
                                        name="content"
                                        value={newProduct.content}
                                        onChange={handleProductChange}
                                        placeholder="상품 설명 입력"
                                    />
                                </div>
                                <div className="button-group">
                                    <button onClick={handleProductSubmit} className="save-button">
                                        상품 등록
                                    </button>
                                </div>
                            </div> */}
              <RegisterStock />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerMyPage;
