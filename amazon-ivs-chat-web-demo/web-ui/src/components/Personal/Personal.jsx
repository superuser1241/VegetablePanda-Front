import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Personal.css";
import '../MainPage/MainPage.css';
import logo from "../../image/기본이미지.png";
import liveImg from '../../image/라이브.png';
import DOMPurify from 'dompurify';


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
  const [isSubscribed, setIsSubscribed] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();
  
  const { farmerSeq } = location.state || {};
  
  const serverIp = process.env.REACT_APP_SERVER_IP;

  useEffect(() => {
    try {
      const userSeq = localStorage.getItem('userSeq');
      if (userSeq) {
        setUserId(userSeq);
      } else {
        // 로컬스토리지에 userSeq가 없는 경우 토큰에서 추출 시도
        if (token) {
          const payload = JSON.parse(atob(token.split(".")[1]));
          const seq = payload.user_seq;
          if (seq) {
            localStorage.setItem('userSeq', seq); // 로컬스토리지에 저장
            setUserId(seq);
          } else {
            console.error("사용자 시퀀스를 찾을 수 없습니다.");
          }
        }
      }
    } catch (error) {
      console.error("사용자 정보 가져오기 실패:", error);
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
        const response = await axios.post(`${serverIp}/api/shop/${farmerSeq === undefined || null ? seq : farmerSeq}`);
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
      if (!seq || !farmerSeq) return;

      try {
        const response = await axios.post(`${serverIp}/likeState`, {
          userSeq: seq,
          farmerSeq: farmerSeq
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.data !== null && response.data !== undefined) {
          setState(response.data);
          setIsSubscribed(response.data);
        }
      } catch (error) {
      }
    };

    fetchState();
  }, [seq, farmerSeq, token, serverIp]);

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
      setIsSubscribed(!isSubscribed);
    } catch (error) {
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
      console.log('Fetched review data:', response.data);
      setReview(response.data);
    } catch (error) {
      console.error('리뷰 조회 실패:', error);
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
                <h1 className="yun-seller-name">{farmerInfo.name}</h1>
                <p className="yun-seller-description">{farmerInfo.intro}</p>
                {farmerSeq === undefined || farmerSeq === seq || null ? (
                  ""
                ) : (
                  <button
                    className={`yun-like-button1 ${isSubscribed ? 'yun-subscribed' : 'yun-not-subscribed'}`}
                    onClick={() => fetchLike(farmerSeq)}
                  >
                    {isSubscribed ? '구독중' : '구독하기'}
                  </button>
                )}
              </>
            )}
            
          </div>
        </div>
      </div>

      {/* 하단 3칸 컨테이너 */}
      <div className="yun-bottom-container">
        <div className="yun-item-container1">
          <h2 className="yun-item-title">판매자 리뷰</h2>
          {review.length === 0 ? (
        <p className="no-reviews">작성한 리뷰가 없습니다.</p>
      ) : (
        <div className="review-grid">
          {review.map((review) => (
            <div 
              key={review.reviewCommentSeq} 
              className="review-item"
              style={{ cursor: 'pointer' }}
            >
              <div className="review-header">
                <h3>{review.productName}</h3>
                <div className="star-rating">
                  {'★'.repeat(review.score)}{'☆'.repeat(5-review.score)}
                </div>
              </div>
              <div 
                className="review-content"
                dangerouslySetInnerHTML={{ 
                  __html: DOMPurify.sanitize(review.content) 
                }} 
              />
            </div>
          ))}
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
                                <div className="yun-shop-info">
                                    <div>#{item.productName}</div>
                                    <div><span>#등급:</span> {item.stockGrade}</div>
                                    <div><span>#인증:</span> {item.stockOrganic}</div>

                                </div>
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
                    <img src={room.filePath || 'https://placehold.co/200x200?text=NoImage'} 
                                        alt={room.productName} className="yun-live-image"
                                    />
                                    <img src={liveImg} alt="LIVE" className="yun-live-badge" />
                                    <div className="room-info">
                                    <h3 className='product-name-mainPage'>{room.productName || '상품명 없음'}</h3>
                                    <p className="farmer-name">판매자: {room.farmerName || '판매자 정보 없음'}</p>
                                    <button
                                        className="join-button"
                                        onClick={() => onJoinRoom(room)}
                                    >
                                        방송 입장하기
                                    </button>
                                </div>
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