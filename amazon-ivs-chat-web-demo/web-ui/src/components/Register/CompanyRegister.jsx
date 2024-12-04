import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CompanyRegister.css";
import { useNavigate } from "react-router-dom";
import logo from "../../image/기본이미지.png";

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
  const [pwMessage, setPwMessage] = useState("");
  const [idCheckResult, setIdCheckResult] = useState("");
  const [isCheckResult, setIsCheckResult] = useState(false); //true이면 중복, false이면 사용가능

  const navigate = useNavigate();

  const mounted = React.useRef(true);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const handleConfirmPasswordChange = (e) => {
    const confirmPwd = e.target.value;
    setConfirmPassword(confirmPwd);

    // 비밀번호와 비밀번호 확인이 일치하는지 확인
    if (pw === "" || confirmPwd === "") {
      setPwMessage("");
      return;
    }

    if (pw === confirmPwd) {
      setPwMessage("비밀번호가 일치합니다.");
    } else {
      setPwMessage("비밀번호가 일치하지 않습니다.");
    }
  };
  const changeValue = (e) => {
    const { name, value } = e.target;
    setCompanyId(value);

    if (name === "id") {
      if (!value.trim()) {
        // 입력 값이 없을 경우
        setIdCheckResult(""); // 메시지 초기화
        return;
      }
    }

    if (name === "id" && value !== "") {
      axios({
        method: "GET",
        url: `http://localhost:9001/members/${value}`,
      })
        .then((res) => {
          console.log(res);
          setIdCheckResult(res.data);
          if (res.data === "아이디가 존재합니다.") {
            setIsCheckResult(true); // 중복된 경우
          } else {
            setIsCheckResult(false); // 중복되지 않은 경우
          }
        })
        .catch((err) => {
          let errMessage = err.response?.data?.type || "알 수 없는 오류";
          alert(errMessage);
        });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
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
      formattedPhone = `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(
        3,
        7
      )}-${phoneNumber.slice(7, 11)}`;
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
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (isCheckResult) {
      alert("아이디가 존재합니다. 다른 아이디를 입력해주세요.");
      return;
    }

    setLoading(true);

    const formattedPhone = formatPhoneNumber(phone);

    const code = `${codePart1}-${codePart2}-${codePart3}`;

    const userData = {
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
      formData.append(
        "userData",
        new Blob([JSON.stringify(userData)], { type: "application/json" })
      );

      if (image) {
        formData.append("image", image); // 이미지 추가
      }

      // Axios 요청
      const response = await axios.post(
        "http://localhost:9001/members",
        formData
      );

      if (response.status === 200) {
        setMessage("회원가입 성공!");
        alert("회원가입 성공!");
        navigate("/");
      } else {
        setMessage("회원가입 실패. 다시 시도해주세요.");
        console.error("Response status:", response.status);
      }
    } catch (error) {
      // 서버 또는 네트워크 오류 처리
      if (error.response) {
        console.error("Server Error:", error.response.data);
        setMessage(
          "서버 오류: " + (error.response.data.message || "다시 시도해주세요.")
        );
      } else {
        console.error("Network Error:", error.message);
        setMessage("네트워크 오류: 다시 시도해주세요.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (mounted.current) {
      if (name === "id") setCompanyId(value);
      else if (name === "pw") setPassword(value);
      else if (name === "confirmPassword") setConfirmPassword(value);
      else if (name === "email") setEmail(value);
      else if (name === "phone") setPhone(value);
      else if (name === "address") setAddress(value);
      else if (name === "comName") setCompanyName(value);
      else if (name === "ownerName") setOwnerName(value);
      else if (name === "codePart1") setCodePart1(value);
      else if (name === "codePart2") setCodePart2(value);
      else if (name === "codePart3") setCodePart3(value);
      else if (name === "regName") setRegistrantName(value);
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
            {image === null ? (
              <img src={logo} alt="Preview" className="image-preview" />
            ) : (
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
            사진 등록
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
            name="id"
            onChange={(e) => {
              setCompanyId(e.target.value);
              changeValue(e);
            }}
            required
            placeholder="아이디를 입력하세요"
            className="username-input"
          />
          <div
            className="idText"
            style={{
              color: isCheckResult ? "red" : "blue",
            }}
          >
            {idCheckResult}
          </div>
        </div>

        <div className="input-group">
          <input
            type="password"
            value={pw}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="비밀번호를 입력하세요"
            className="password-input"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
            placeholder="비밀번호를 다시 입력하세요"
            className="password-input"
          />

          <p
            className="pw-match-message"
            style={{
              color: pwMessage === "비밀번호가 일치합니다." ? "green" : "red",
            }}
          >
            {pwMessage}
          </p>
        </div>

        <div className="input-group">
          <input
            type="text"
            name="comName"
            value={comName}
            onChange={handleChange}
            required
            placeholder="업체명을 입력하세요"
            className="company-input"
          />
        </div>

        <div className="input-group">
          <input
            type="text"
            name="ownerName"
            value={ownerName}
            onChange={handleChange}
            required
            placeholder="대표자명을 입력하세요"
            className="company-input"
          />
        </div>

        <div className="input-group">
          <input
            type="text"
            name="regName"
            value={regName}
            onChange={handleChange}
            required
            placeholder="가입자명을 입력하세요"
            className="company-input"
          />
        </div>

        <div className="input-group">
          <input
            type="text"
            name="phone"
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
            name="email"
            value={email}
            onChange={handleChange}
            required
            placeholder="이메일을 입력하세요"
            className="email-input company-input"
          />
        </div>
        <div className="input-group">
          <input
            type="text"
            name="address"
            value={address}
            onChange={handleChange}
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
              name="codePart1"
              value={codePart1}
              onChange={handleChange}
              placeholder="000"
              maxLength="3"
              className="business-number-input"
            />
            -
            <input
              type="text"
              name="codePart2"
              value={codePart2}
              onChange={handleChange}
              placeholder="00"
              maxLength="2"
              className="business-number-input"
            />
            -
            <input
              type="text"
              name="codePart3"
              value={codePart3}
              onChange={handleChange}
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
