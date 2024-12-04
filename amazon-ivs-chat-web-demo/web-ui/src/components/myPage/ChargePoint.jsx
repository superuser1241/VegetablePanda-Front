import axios from 'axios';

export const requestPay = async (result, token, IMP) => {
    const serverIp = process.env.REACT_APP_SERVER_IP;

    IMP.request_pay(
      {
        pg: "html5_inicis.INIpayTest", //테스트 시 html5_inicis.INIpayTest 기재
        pay_method: "card",
        merchant_uid: result.data.orderUid, //상점에서 생성한 고유 주문번호
        name: result.data.itemName,
        amount: result.data.paymentPrice,
        buyer_email: result.data.buyerEmail,
        buyer_name: result.data.buyerName,
        buyer_tel: "", //필수 파라미터 입니다.
        buyer_addr: result.data.buyerAddr,
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
                const response3 = await axios.post(`${serverIp}/api/payment/validate?status=1`, {
                        orderUid: rsp.merchant_uid, 
                        paymentUid: rsp.imp_uid
                },
                  {
                      headers: { 
                          Authorization: `Bearer ${token}`,
                          'Content-Type': 'application/json'
                      }
                });
                console.log(response3);

            } catch(err) {
                console.log(err);
            }
          }
        
          sendValidateData();
        

        //   axios({
        //     url : 'http://localhost:9001/payment/charge',
        //     method : "post",
        //     headers : {Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'},
        //     data : {orderUid: rsp.merchant_uid, paymentUid: rsp.imp_uid}
        //   })
        //   .then((result)=>{
        //     console.log(result);
        //   })
        //   .catch((err)=>{
        //     console.log(err);
        //   });

        } else {
          console.log('결제실패')
          console.log(rsp);
          
          alert("포인트 결제 실패");
          
        }
      }
    );
  }