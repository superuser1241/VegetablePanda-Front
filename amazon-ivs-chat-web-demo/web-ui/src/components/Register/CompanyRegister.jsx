import React, { useState } from "react";
import axios from "axios";
import "./CompanyRegister.css";
import { useNavigate } from "react-router-dom";

function CompanyRegister() {
  const [id, setCompanyId] = useState("");
  const [pw, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [comName, setCompanyName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [codePart1, setCodePart1] = useState("");
  const [codePart2, setCodePart2] = useState("");
  const [codePart3, setCodePart3] = useState("");
  const [regName, setRegistrantName] = useState("");
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
    setImage(null);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 11);
    setPhone(value);
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

    const formattedPhone = formatPhoneNumber(phone);

    const code = `${codePart1}-${codePart2}-${codePart3}`;

    const companyData = {
      id,
      email,
      phone: formattedPhone,
      address,
      comName,
      ownerName,
      code,
      regName,
      pw,
      content: "company",
    };

    try {
      const formData = new FormData();
      if (image) {
        formData.append("image", image);
      }

      const imageResponse = image
        ? await axios.post("http://localhost:9001/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
        : { status: 200, data: { imageUrl: "" } };

      const imageUrl = imageResponse.data.imageUrl || "";

      const response = await axios.post("http://localhost:9001/members", {
        ...companyData,
        imageUrl,
      });

      if (response.status === 200) {
        setMessage("회원가입 성공!");
        alert("회원가입 성공!");
        navigate("/");
      } else {
        setMessage("회원가입 실패. 다시 시도해주세요.");
      }
    } catch (error) {
      setMessage("서버 오류. 잠시 후 다시 시도해주세요.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-form-container company-register">
      <h2 className="register-form-header company-register-header">
        업체 회원가입
      </h2>
      <form onSubmit={handleSubmit} className="register-company-form">
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
        <div className="input-group">
          <input
            type="text"
            value={id}
            onChange={(e) => setCompanyId(e.target.value)}
            required
            placeholder="아이디를 입력하세요"
            className="username-input company-input"
          />
        </div>

        <div className="input-group">
          <input
            type="password"
            value={pw}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="비밀번호를 입력하세요"
            className="password-input company-input"
          />
        </div>

        <div className="input-group">
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="비밀번호를 다시 입력하세요"
            className="password-input company-input"
          />
        </div>

        <div className="input-group">
          <input
            type="text"
            value={comName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
            placeholder="업체명을 입력하세요"
            className="company-input"
          />
        </div>

        <div className="input-group">
          <input
            type="text"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            required
            placeholder="대표자명을 입력하세요"
            className="company-input"
          />
        </div>

        <div className="input-group">
          <input
            type="text"
            value={regName}
            onChange={(e) => setRegistrantName(e.target.value)}
            required
            placeholder="가입자명을 입력하세요"
            className="company-input"
          />
        </div>

        <div className="input-group">
          <input
            type="text"
            value={phone}
            onChange={handlePhoneChange}
            required
            placeholder="전화번호를 입력하세요"
            maxLength={11}
            className="phone-input company-input"
          />
        </div>

        <div className="input-group">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="이메일을 입력하세요"
            className="email-input company-input"
          />
        </div>
        <div className="input-group">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            placeholder="업체주소를 입력하세요"
            className="address-input company-input"
          />
        </div>

        <div className="input-group business-number-group">
          <label className="business-number-label1">사업자 등록번호</label>
          <div className="business-number-input-wrapper">
            <input
              type="text"
              value={codePart1}
              onChange={(e) => setCodePart1(e.target.value)}
              placeholder="000"
              maxLength="3"
              className="business-number-input"
            />
            - 
            <input
              type="text"
              value={codePart2}
              onChange={(e) => setCodePart2(e.target.value)}
              placeholder="00"
              maxLength="2"
              className="business-number-input"
            />
            - 
            <input
              type="text"
              value={codePart3}
              onChange={(e) => setCodePart3(e.target.value)}
              placeholder="00000"
              maxLength="5"
              className="business-number-input"
            />
          </div>
        </div>

        <button type="submit" className="register-button" disabled={loading}>
          {loading ? "가입 중..." : "회원가입"}
        </button>
        {message && <p className="error-message">{message}</p>}
      </form>
    </div>
  );
}

export default CompanyRegister;