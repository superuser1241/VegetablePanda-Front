import React, { useState } from "react";
import axios from "axios";
import "./UserRegister.css";
import { useNavigate } from "react-router-dom";

function UserRegister() {
  const [id, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pw, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  const navigate = useNavigate();
  const handleImageReset = () => {
    setImage(null);
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
    setMessage("");

    if (!email.includes("@")) {
      setMessage("올바른 이메일 형식을 입력하세요.");
      return;
    }

    if (pw !== confirmPassword) {
      setMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);

    const formattedPhone = phone.replace(/[^0-9]/g, "");
    const formattedPhoneWithHyphen =
      formattedPhone.length === 11
        ? `${formattedPhone.slice(0, 3)}-${formattedPhone.slice(
            3,
            7
          )}-${formattedPhone.slice(7)}`
        : formattedPhone;

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
        ...userData,
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
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="이름을 입력하세요"
            className="name-input"
          />
        </div>

        <div className="input-group">
          <input
            type="text"
            value={id}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="아이디를 입력하세요"
            className="username-input"
          />
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
        </div>

        <div className="input-group">
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="비밀번호를 다시 입력하세요"
            className="password-input"
          />
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
