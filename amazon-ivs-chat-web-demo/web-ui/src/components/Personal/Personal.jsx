import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Personal.css";
import '../MainPage/MainPage.css';
import logo from "../../image/기본이미지.png";

const Personal = ({ onJoinRoom }) => {
  const token = localStorage.getItem("token");
  const [error, setError] = useState("");
  const [visibleShops, setVisibleShops] = useState(4);
  const [shopItems, setShopItems] = useState([]);
  const [seq, setUserId] = useState(null);
  const [state, setState] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [visibleRooms, setVisibleRooms] = useState(4);
  const [review, setReview] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [farmerInfo, setFarmerInfo] = useState(null);
  const [like, setLike] = useState(null);
  const navigate = useNavigate();

  const location = useLocation();
  
  const { farmerSeq } = location.state || {};
  
  const serverIp = process.env.REACT_APP_SERVER_IP;

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserId(payload.user_seq);
      } catch (error) {
        console.error("토큰 파싱 실패:", error);
      }
    }
  }, [token]);

  useEffect(() => {
    const fetchActiveRooms = async (farmerSeq) => {
      try {
        const response = await axios.get(
          `${serverIp}/api/streaming/active-rooms/${farmerSeq===undefined || null ? seq : farmerSeq}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRooms(response.data);
      } catch (err) {
        setError("Failed to fetch active rooms. Please try again.");
        console.error(err);
      }
    };

    const fetchShopItems = async (farmerSeq) => {
      try {
        const response = await axios.post(`${serverIp}/api/shop/${farmerSeq===undefined || null ? seq : farmerSeq}`);
        setShopItems(response.data);
      } catch (err) {
        console.error("상품 목록을 불러오는데 실패했습니다:", err);
      }
    };
    fetchActiveRooms(farmerSeq);
    fetchShopItems(farmerSeq);
  }, []);

  useEffect(() => {
    if (seq) {
      fetchFarmerInfo(farmerSeq);
      fetchReview(farmerSeq);
    }
  }, [seq]);

  useEffect(() => {
    const fetchState = async () => {
      try {
        const response = await axios.get(`${serverIp}/likeState`, {
          params: {
            userSeq: seq,
            farmerSeq
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setState(response.data);
        console.log("상태값 받음:", response.data);
      } catch (error) {
        console.error("상태값 못받음:", error);
      }
    };
  }, []);

  const fetchFarmerInfo = async (farmerSeq) => {
    try {
      const response = await axios.get(
        `${serverIp}/myPage/farmer/list/${farmerSeq===undefined || null ? seq : farmerSeq}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFarmerInfo(response.data);
    } catch (error) {
      console.error("회원 정보 조회 실패:", error);
    }
  };

  const fetchLike = async () => {
    try {
      const response = await axios.post(
        `${serverIp}/likeAction`,
        {
          userSeq: seq,
          farmerSeq: farmerSeq,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLike(response.data);
      console.log("구독 요청 성공:", response.data);
    } catch (error) {
      console.error("구독 요청 실패:", error);
    }
  };

  const fetchReview = async (farmerSeq) => {
    try {
      const response = await axios.get(
        `${serverIp}/myPage/farmer/review/List/${farmerSeq===undefined || null ? seq : farmerSeq}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setReview(response.data);
    } catch (error) {
      console.error("리뷰 조회 실패:", error);
    }
  };

  return (
    <div className="yun-personal-page">
      <div className="yun-top-container">
        <div className="yun-profile-container">
          <div className="yun-profile-image">
            <div className="yun-image-preview-container1">
              {farmerInfo && (
                <img
                  src={farmerInfo.path || logo}
                  alt="Profile"
                  className="yun-profile-image"
                />
              )}
            </div>
          </div>
          <div className="yun-profile-details">
            {farmerInfo && (
              <>
                {farmerSeq + "= 판매자 시퀀스"} , {seq + " = 로그인한 시퀀스"}
                <h1 className="yun-seller-name">{farmerInfo.name}</h1>
                <p className="yun-seller-description">{farmerInfo.intro}</p>
              </>
            )}
          </div>
        </div>
        {farmerSeq === undefined || farmerSeq === seq || null ? (
          ""
        ) : (
          <button
            className="yun-like-button1"
            onClick={() => fetchLike(farmerSeq)}
          >
            구독
          </button>
        )}
      </div>

      {/* 하단 3칸 컨테이너 */}
      <div className="yun-bottom-container">
        <div className="yun-item-container1">
          <h2 className="yun-item-title">판매자 리뷰</h2>
          {review.length > 0 ? (
            <div className="yun-review-list">
              {review.map((review) => (
                <div key={review.reviewCommentSeq} className="yun-review-item">
                  <div className="yun-review-header">
                    <span className="yun-review-score">
                      평점: {review.score}점
                    </span>
                    <span className="yun-review-date">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="yun-review-content">{review.content}</div>
                  <div className="yun-review-image">
                    {review.file && review.file.path && (
                      <img src={review.file.path} alt="리뷰 이미지" />
                    )}
                  </div>
                  <span className="yun-review-date">
                    작성날짜 : {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="yun-no-data-notification">
              작성한 리뷰가 없습니다.
            </div>
          )}
        </div>

        <div className="yun-item-container1">
            <h2 className="yun-item-title">
              <Link to={"/shop"} className="yun-item-title">
                판매중인 상품
              </Link>
            </h2>
            {shopItems.length > 0 ? (
            <section className="shop-section">
              <div className="yun-shop-list">
                        {shopItems.slice(0, visibleShops).map((item) => (
                            <div key={item.shopSeq} className="yun-shop-card">
                            <Link to = {`/product/${item.stockSeq}`} state={{ product:item }} className='default-link product-name'>
                                <div className="yun-shop-image">
                                    <img src={item.file ? item.file : 'https://placehold.co/200x200?text=vegetable'} alt={item.productName} />
                                </div>
                                <h3>{item.content}</h3>
                                <div className="yun-shop-info">
                                    <p><span>가격:</span> {item.price.toLocaleString()}원</p>
                                    <p><span>수량:</span> {item.count}개</p>
                                    <p><span>상품:</span> {item.productName}</p>
                                    <p><span>등급:</span> {item.stockGrade}</p>
                                    <p><span>인증:</span> {item.stockOrganic}</p>
                                </div>
                                <button 
                                    className="buy-button" 
                                    onClick={() => navigate('/purchase', { state: { item } })}
                                    >
                                    구매하기
                                </button>
                                </Link>
                            </div>
                        ))}
                    </div>
            </section>
            ) : (
              <div className="yun-no-data-notification">
                판매중인 상품이 없습니다.
              </div>
            )}
        </div>

        <div className="yun-item-container1">
          <h2 className="yun-item-title">진행중인 방송</h2>
          {rooms.length > 0 ? (
              <div className="yun-room-list">
                {rooms.slice(0, visibleRooms).map((room) => (
                  <div key={room.streamingSeq} className="room-card">
                    <h3>Room ID: {room.chatRoomId}</h3>
                    <button
                      className="join-button"
                      onClick={() => onJoinRoom(room)}
                    >
                      방송 입장하기
                    </button>
                  </div>
                  
                ))}
              </div>
          ) : (
            <div className="yun-no-data-notification">
              진행중인 방송이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Personal;