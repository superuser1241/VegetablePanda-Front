import axios from 'axios';

export const handlePayment = async (userId, userBuyDetailDTOs, totalAmount, serverIp, navigate) => {

  try {
      const token = localStorage.getItem('token');

      let orderData = {
          userSeq: userId,
          state:5,
          totalPrice: totalAmount, //+ 3000,
          userBuyDetailDTOs: userBuyDetailDTOs
      };

      console.log(orderData.userBuyDetailDTOs);
  
      // 주문 API 호출
      // 주문정보 등록
      const response = await axios.post(`${serverIp}/shop/purchase`, orderData, {
          headers: {
              'Authorization': `Bearer ${token}`
          }
      });

      console.log("주문번호");
      console.log(response.data);

      // 주문번호 받아오기

      const response2 = await axios.get(`${serverIp}/api/payment/` + response.data + '?status=2', {

          headers: { 
              Authorization: `Bearer ${token}`,
          }
      });

      console.log("response2");
      console.log(response2);
      console.log(response2.data.orderUid);

      if(response2.success === false) {
          console("주문실패 : 주문을 삭제합니다.");
          const deleteResult = await axios.delete(`${serverIp}/shop/cancel?id=` + response.data, {
              headers: { 
                  Authorization: `Bearer ${token}`,
              }
          });
      }

      // 결제창 호출
      let IMP = window.IMP;
      IMP.init("imp68111618");
      //const response4 = PortOne.requestPay(response2, token, IMP);

      ////
      const requestPay = async () => {

          IMP.request_pay(
            {
              pg: "html5_inicis.INIpayTest", //테스트 시 html5_inicis.INIpayTest 기재
              pay_method: "card",
              merchant_uid: response2.data.orderUid, 
              name: response2.data.itemName,
              amount: response2.data.paymentPrice,
              buyer_email: response2.data.buyerEmail,
              buyer_name: response2.data.buyerName,
              buyer_tel: "", //필수 파라미터
              buyer_addr: response2.data.buyerAddr,
              buyer_postcode: "",
              m_redirect_url: "{모바일에서 결제 완료 후 리디렉션 될 URL}",
              escrow: true, //에스크로 결제인 경우 설정
              vbank_due: "YYYYMMDD",
            },
            function (rsp) {
              // callback 로직
              if (rsp.success) {
                console.log("결제성공")
                console.log(rsp);
                
                const sendValidateData = async () => {
                  try {
                      const response3 = await axios.post(`${serverIp}/api/payment/validate?status=2`, {
                              orderUid: rsp.merchant_uid, 
                              paymentUid: rsp.imp_uid
                      },
                        {
                            headers: { 
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                      });
                      console.log("response3");
                      console.log(response3);
                      
                      alert('결제가 완료되었습니다.');
                      console.log(response3.data.response.merchantUid);
                      // navigate('/payment-success', { state : { orderUid: response3.data.response.merchantUid }});
                      navigate('/payment-success/'+response3.data.response.merchantUid);
      
                  } catch(err) {
                      console.log(err);
                  }
                }
              
                sendValidateData();
              
              } else {
                console.log('결제실패')
                console.log(rsp);
                const removeOrder = async () => {
                  try {
                      const deleteResult2 = await axios.delete(`${serverIp}/shop/afterPayment?orderUid=` + response.data, {
                          headers: { 
                              Authorization: `Bearer ${token}`,
                          }
                      });
      
                  } catch(err) {
                      console.log(err);
                  }
                }
                  
                removeOrder();
                
                alert("상품 결제 실패");
                
              }
            }
          );
        }

      requestPay();
      
  } catch (error) {
      console.error('결제 처리 실패:', error);
      alert('결제 처리 중 오류가 발생했습니다.');
  }
};