# Vegetable Panda Project  
Kosta 286기 3차 Final Project  

---

## 📑 Project Overview
- **Project Name:** 농산물 판다 (Vegetable Panda)  
- **Team Members:** 이정우, 이성민, 강윤성, 이인영, 주영준, 김재영  
- **Project Description:**  
농산물 판다는 대량 구매를 원하는 기업과 소량 구매를 원하는 일반 사용자를 위한 라이브 스트리밍 경매 서비스입니다. 1차 생산자인 농부와 생산물을 구매하고자 하는 업체 및 일반 사용자가 참여할 수 있습니다. 농산물은 관리자의 인증을 받은 후 라이브 경매로 거래되며, 거래되지 않은 농산물은 일반 상점에서 구매할 수 있습니다. 이 서비스는 생산자와 구매자 모두 합리적인 가격으로 농산물을 거래할 수 있게 합니다.

---

## 💻 개발 환경

### Front-end:
- ![React](https://img.shields.io/badge/react-black?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![HTML5](https://img.shields.io/badge/html5-%23E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6?style=for-the-badge&logo=css3) ![JavaScript](https://img.shields.io/badge/javascript-black?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![IVS](https://img.shields.io/badge/IVS-%23ec7211?style=for-the-badge&logoColor=white)

### Back-end:
- ![Spring Boot](https://img.shields.io/badge/springboot-6DB33F?style=for-the-badge&logo=springboot&color=white) ![Java](https://img.shields.io/badge/java-%23e14a3a?style=for-the-badge) ![Flask](https://img.shields.io/badge/flask-%23000000?style=for-the-badge&logo=flask&logoColor=white) ![Python](https://img.shields.io/badge/python-%233776AB?style=for-the-badge&logo=python&logoColor=white)

### Database:
- ![MySQL](https://img.shields.io/badge/mysql-%234479A1?style=for-the-badge&logo=mysql&logoColor=white)
![AWS S3](https://img.shields.io/badge/s3-%23569A31?style=for-the-badge&logo=amazons3&logoColor=white)
![AWS RDS](https://img.shields.io/badge/rds-%23527FFF?style=for-the-badge&logo=amazonrds&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23d82a20?style=for-the-badge)

### Version Control:
- ![Git](https://img.shields.io/badge/git-%23F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/github-%23181717?style=for-the-badge&logo=github)

### Project Management:
- ![Jira](https://img.shields.io/badge/jira-%230052CC?style=for-the-badge&logo=jira)
![Notion](https://img.shields.io/badge/notion-%23000000?style=for-the-badge&logo=notion)

### OS:
- ![Windows 11](https://img.shields.io/badge/window11-blue?style=for-the-badge)

### Tools:
- ![IntelliJ IDEA](https://img.shields.io/badge/intellij-%23000000?style=for-the-badge&logo=intellijidea)
![VSCode](https://img.shields.io/badge/VSCode-%232F80ED?style=for-the-badge)
![Spyder](https://img.shields.io/badge/spyder-%238C0000?style=for-the-badge&logo=spyderide)

### Architect:
- ![ERDCLOUD](https://img.shields.io/badge/ERDCLOUD-black?style=for-the-badge&logo=icloud&logoColor=white)
![Draw.io](https://img.shields.io/badge/DrawIO-%23F08705?style=for-the-badge&logo=diagramsdotnet&logoColor=white)
![Figma](https://img.shields.io/badge/figma-%23F24E1E?style=for-the-badge&logo=figma&logoColor=white)

### Infrastructure:
- ![AWS](https://img.shields.io/badge/AWS-%23232F3E?style=for-the-badge&logo=amazonwebservices&logoColor=white)

### Testing:
- ![Postman](https://img.shields.io/badge/postman-%23FF6C37?style=for-the-badge&logo=postman&logoColor=white)
![JUnit5](https://img.shields.io/badge/junit5-%2325A162?style=for-the-badge&logo=junit5&logoColor=white)

---

## 🌐 AWS Infrastructure  
![aws최종](https://github.com/user-attachments/assets/74297328-f392-404e-9cce-0514579263c3)

---

## 📚 Reference Sites  
- [KAFB2B - 농수산물 온라인 도매시장](https://kafb2b.or.kr/client/mn/main/main.do)

---

## 🔌 API Used  
- [가락시장 데이터](https://data.seoul.go.kr/dataList/OA-2662/S/1/datasetView.do)
- [결제시스템 - 포트원](https://portone.io/)

---

## 🛠️ Service Overview  
![서비스](https://github.com/user-attachments/assets/1e8b55d3-b3ac-41fc-bab5-4e53e588c3db)  

---

## 🧑‍💻 Core Technologies  
### WebSocket + Redis  
![WebSocket + Redis](https://github.com/user-attachments/assets/e9f0e4c9-ffc7-4c5d-bb6c-e1c56312c6c2)  
![Redis속도](https://github.com/user-attachments/assets/31ba141e-951c-4021-9458-29156da89a25)  
 - 실시간 다중 사용자 환경에서의 발전된 경매 서비스를 제공하기 위해 사용  
 - Redis를 통한 캐시 기반의 빠른 경매 데이터 사용 및 공유
 - 안정적인 경매 환경제어를 위한 Redis Transaction기능 사용 
 - WebSocket과 Redis의 조합을 통한 다중 서버 환경에서의 알림 및 상태 공유 반영  
 - WebSocket과 Stomop라이브러리를 통한 구독 형태의 메세지 알림 구현 

### Recommendation Model + RestAPI Server  
![추천 기술](https://github.com/user-attachments/assets/18fa660d-a6de-4348-92cb-009f57b8db7c)
 - Python단에서 학습한 추천 모델을 사용하기 위해 Flask서버 기반의 응답용 내부 RestAPI서버 구축
 - Pandas, Numpy등을 활용한 데이터 전처리  
 - Scikit Learn라이브러리를 활용한 CosineSimilarity 모델과 TruncateSVD 모델 사용  
 - 사용자 구매와 리뷰를 통한 평가 데이터를 기반으로 추천 모델을 각각 적용   
### IVS (Broadcasting Technology)  
![IVS](https://github.com/user-attachments/assets/022cf312-6106-42ad-9892-05d0106a7048)

- AWS IVS는 트위치 방송 플랫폼의 라이브 스트리밍 서비스
- 사용자는 서버를 직접 관리할 필요없이 AWS에서 제공하는 Stream Key를 받아와서 OBS Studio 방송 프로그램에 입력하면 간편하게 사용 가능
- WebSocket 기반의 실시간 채팅기능 또한 ChatRoom_URL을 받아서 입장과 동시에 생성
- 사용자가 채팅 메세지 입력 시 API gateway로 HTTP 전송 후 Lambda를 통해 유저를 구분하여 메세지를 전달 및 출력

### API Application  
![가락시장](https://github.com/user-attachments/assets/f164e508-d3f1-4b06-b992-b06e0bd9affe)  
![portone](https://github.com/user-attachments/assets/18f429af-98c7-47af-8447-f45a573e168e)

---

## 📈 Project Results  

### Auction & Notification Features  
- **Auction Registration & Subscription Notifications**  
![경매등록알림](https://github.com/user-attachments/assets/52c63b58-22e9-477f-be7d-b4c44adf2489)

- **Real-Time Data Updates & Highest Bidder Notifications**  
![입찰및 알림](https://github.com/user-attachments/assets/dd79c8fd-68fd-4f62-a38a-8fdc54374eaa)

- **sale off and Winning Bid Notification**  
![낙찰및 알림](https://github.com/user-attachments/assets/af4c6291-399d-42b7-b2c2-fdfcf20c81bd)

- **Streaming off**  
![방송종료알림](https://github.com/user-attachments/assets/19b51d41-76ab-427f-880b-ab13c404edc6)
---

### Notification Features  
![알림1](https://github.com/user-attachments/assets/a8093ef5-dea1-4067-a145-46513b1152a5)

---

### Recommendation Features  
![추천화면](https://github.com/user-attachments/assets/edf4bdc3-a864-47d3-81b7-8d1cbd574abe)

---

### Payment Features  
![결제화면](https://github.com/user-attachments/assets/d7b38040-9cf5-47f0-bd6d-29413d93420f)

---

### Final Outcome  
![최종결과물](https://github.com/user-attachments/assets/04ea78c1-4722-4ea2-8ab4-242cce8cdc73)

---

## 📊 Project Artifacts

### ERD (Entity-Relationship Diagram)  
![ERD](https://github.com/user-attachments/assets/5fbab0ff-a8ad-4655-b5a2-a282f4eb2309)

### Use Case Diagrams  
![actor1](https://github.com/user-attachments/assets/60c5da99-bb22-4296-a23a-6fe5941bc852)  
![actor2](https://github.com/user-attachments/assets/02b8d4e6-9a48-494a-a5fd-475624278f49)

### Sequence & Flow Charts  
![경매 시퀀스 차트](https://github.com/user-attachments/assets/57d0f671-caa0-4a59-b4fe-d1ebb8580115)  
![경매 플로우차트](https://github.com/user-attachments/assets/1a7b5c26-9006-43b9-8091-bb8bec688f48)

### Layout Definition  
- [레이아웃 정의서](https://www.figma.com/design/VS3O9n5gdeCGlE01srZnjg/finalProject_%ED%94%BC%EA%B7%B8%EB%A7%88?node-id=0-1&t=Ne12ajC3fU63yYDc-1)

---
