import React, { useState } from "react";
import axios from "axios";
import "./UserRegister.css";
import { useNavigate } from "react-router-dom";
import logo from "../../image/기본이미지.png";

function UserRegister() {
  const [id, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(logo);
  const [image, setImage] = useState(null);
  const [pw, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwMessage, setPwMessage] = useState("");
  const [message, setMessage] = useState("");
  const [idCheckResult, setIdCheckResult] = useState("");
  const [isCheckResult, setIsCheckResult] = useState(false); //true이면 중복, false이면 사용가능
  const serverIp = process.env.REACT_APP_SERVER_IP;

  const navigate = useNavigate();
  const handleImageReset = () => {
    setImagePreview(logo);
    setImage(null);
  };

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
    setUsername(value);

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
        url: `${serverIp}/members/${value}`,
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

  const handlePhoneEmailChange = (e, setter, type) => {
    let value = e.target.value;
    if (type === "email") {
      setEmail(value);
    } else if (type === "phone") {
      value = value.replace(/[^0-9]/g, "");
      setPhone(value);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.includes("@")) {
      setMessage("올바른 이메일 형식을 입력하세요.");

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

    // 전화번호 포맷팅
    const formattedPhone = phone.replace(/[^0-9]/g, "");

    const formattedPhoneWithHyphen =
      formattedPhone.length === 11
        ? `${formattedPhone.slice(0, 3)}-${formattedPhone.slice(
            3,
            7
          )}-${formattedPhone.slice(7)}`
        : formattedPhone;

    // 유저 데이터 구성
    const userData = {
      id,
      name,
      email,
      phone: formattedPhoneWithHyphen,
      address,
      pw,
      gender,
      content: "user",
    };

    try {
      const formData = new FormData();
      formData.append(
        "userData",
        new Blob([JSON.stringify(userData)], { type: "application/json" })
      );

      if (image) {
        formData.append("image", image);
      }

      const response = await axios.post(
        `${serverIp}/members`,
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

  return (
    <div className="register-form-container">
      <h2 className="register-form-header">일반 회원가입</h2>
      <form onSubmit={handleSubmit} className="register-form">
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
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            onClick={changeValue}
            placeholder="이름을 입력하세요"
            className="name-input"
          />
        </div>

        <div className="input-group">
          <input
            type="text"
            value={id}
            name="id"
            onChange={(e) => {
              setUsername(e.target.value);
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
            type="email"
            value={email}
            onChange={(e) => handlePhoneEmailChange(e, setEmail, "email")}
            required
            placeholder="이메일을 입력하세요"
            className="email-phone-input"
          />
        </div>

        <div className="input-group">
          <input
            type="text"
            value={phone}
            onChange={(e) => handlePhoneEmailChange(e, setPhone, "phone")}
            required
            placeholder="전화번호를 입력하세요"
            maxLength={11}
            className="email-phone-input"
          />
        </div>

        <div className="input-group">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            placeholder="주소를 입력하세요"
            className="address-input"
          />
        </div>

        <div className="input-group">
          <div className="user-gender">
            <input
              type="radio"
              id="male"
              name="gender"
              value="남자"
              checked={gender === "남자"}
              onChange={() => setGender("남자")}
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
              checked={gender === "여자"}
              onChange={() => setGender("여자")}
              className="user-gender-radio"
            />
            <label htmlFor="female" className="gender-label">
              여성
            </label>
          </div>
        </div>

        <button type="submit" disabled={loading} className="register-button">
          {loading ? "가입 중..." : "회원가입"}
        </button>
      </form>

      {message && <p className="error-message">{message}</p>}
    </div>
  );
}

export default UserRegister;
