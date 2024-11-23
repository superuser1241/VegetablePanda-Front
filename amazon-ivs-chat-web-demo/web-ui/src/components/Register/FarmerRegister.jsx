import React, { useState } from "react";
import axios from "axios";
import "./FarmerRegister.css";
import { useNavigate } from "react-router-dom";

function FarmerRegister() {
  const [id, setFarmerId] = useState("");
  const [pw, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState(""); // 'ownerName' -> 'name'
  const [codePart1, setCodePart1] = useState(""); // 사업자 등록번호
  const [codePart2, setCodePart2] = useState(""); // 사업자 등록번호
  const [codePart3, setCodePart3] = useState(""); // 사업자 등록번호
  const [intro, setIntro] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const uploadedImage = e.target.files[0];
    if (uploadedImage) {
      setImage(uploadedImage);
    }
  };

  const handleImageReset = () => {
    setImage(null); // 사진을 초기화
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 11);
    setPhone(value);
  };
  const handleCodeChange = (e, setCodePart, maxLength) => {
    let value = e.target.value.replace(/[^0-9]/g, ""); // 숫자만 허용
    if (value.length > maxLength) {
      value = value.slice(0, maxLength); // 자릿수 제한
    }
    setCodePart(value);
  };
  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return "";

    let formattedPhone = phoneNumber;
    if (phoneNumber.length <= 3) {
      formattedPhone = phoneNumber;
    } else if (phoneNumber.length <= 7) {
      formattedPhone = `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    } else {
      formattedPhone = `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
    }
    return formattedPhone;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!email.includes("@")) {
      setMessage("이메일 주소에 @를 포함시켜야 합니다.");
      return;
    }

    if (pw !== confirmPassword) {
      setMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);

    const formattedPhone = formatPhoneNumber(phone); // 수정된 부분

    const code = `${codePart1}-${codePart2}-${codePart3}`;

    const farmerData = {
      id,
      email,
      phone: formattedPhone, // 수정된 부분
      address,
      name,
      code,
      pw,
      intro,
      content: "farmer",
    };

   try {
      const formData = new FormData();
      if (image) {
        formData.append("image", image);
      }

      // 이미지 업로드 요청 (이미지가 없으면 빈 이미지 URL을 반환하도록 처리)
      const imageResponse = image
        ? await axios.post("http://localhost:9001/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
        : { status: 200, data: { imageUrl: "" } };

      const imageUrl = imageResponse.data.imageUrl || ""; // 이미지가 없으면 빈 문자열로 설정

      const response = await axios.post("http://localhost:9001/members", {
        ...farmerData,
        imageUrl,
      });

      if (response.status === 200) {
        setMessage("회원가입 성공!");
        alert("회원가입 성공!");
        navigate("/");
      } else {
        setMessage("정보를 다시 입력해 주세요.");
      }
    } catch (error) {
      setMessage("서버 오류");
      console.error(error);
    } finally {
      setLoading(false);
    } 
  };

  return (
    <div className="register-form-container farmer-register">
      <h2 className="register-form-header farmer-register-header">
        판매자 회원가입
      </h2>
      <form onSubmit={handleSubmit} className="register-form farmer-form">
        {/* 이미지 업로드 및 리셋 버튼 */}
        <div className="image-upload-container">
          <label>프로필 사진</label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="image-upload-input"
          />
          <div className="image-preview-container">
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="image-preview"
              />
            )}
          </div>
          <button
            type="button"
            className="image-upload-btn"
            onClick={() => document.getElementById("image-upload").click()}
          >
            사진 업로드
          </button>

          {image && (
            <button
              type="button"
              className="image-reset-btn"
              onClick={handleImageReset}
            >
              삭제
            </button>
          )}
        </div>

        {/* 아이디, 비밀번호, 전화번호 등 */}
        <div className="input-group farmer-input-group">
          <input
            type="text"
            value={id}
            onChange={(e) => setFarmerId(e.target.value)}
            required
            placeholder="아이디를 입력하세요"
            className="farmer-input"
          />
        </div>

        <div className="input-group farmer-input-group">
          <input
            type="password"
            value={pw}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="비밀번호를 입력하세요"
            className="farmer-input"
          />
        </div>

        <div className="input-group farmer-input-group">
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="비밀번호를 다시 입력하세요"
            className="farmer-input"
          />
        </div>

        <div className="input-group farmer-input-group">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="가입자명을 입력하세요"
            className="farmer-input"
          />
        </div>

        <div className="input-group farmer-input-group">
          <input
            type="text"
            value={phone}
            onChange={handlePhoneChange} // 수정된 부분
            required
            maxLength="11"
            placeholder="전화번호를 입력하세요"
            className="farmer-input"
          />
        </div>

        <div className="input-group">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="이메일을 입력하세요"
            className="farmer-input"
          />
        </div>

        <div className="input-group farmer-input-group">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            placeholder="주소를 입력하세요"
            className="farmer-input"
          />
        </div>

        <div className="input-group farmer-input-group">
          <textarea
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            placeholder="나의 소개글을 입력하세요"
            maxLength="300"
            className="farmer-input intro-input"
          />
          <div className="char-count">{intro.length} / 300</div>
        </div>

        <div className="input-group business-number-group">
    <label className="business-number-label1">사업자 등록번호</label>
    <div className="business-number-input-wrapper">
      <input
        type="text"
        value={codePart1}
        onChange={(e) => handleCodeChange(e, setCodePart1, 3)}
        maxLength="3"
        required
        className="business-number-input"
        placeholder="XXX"
      />
      -
      <input
        type="text"
        value={codePart2}
        onChange={(e) => handleCodeChange(e, setCodePart2, 2)}
        maxLength="2"
        required
        className="business-number-input"
        placeholder="XX"
      />
      -
      <input
        type="text"
        value={codePart3}
        onChange={(e) => handleCodeChange(e, setCodePart3, 5)}
        maxLength="5"
        required
        className="business-number-input"
        placeholder="XXXXX"
      />
    </div>
  </div>

          <button
            type="submit"
            disabled={loading}
            className="register-button"
          >
            {loading ? "회원가입 중..." : "회원가입"}
          </button>
          {message && <p className="error-message">{message}</p>}
      </form>
    </div>
  );
}

export default FarmerRegister;
