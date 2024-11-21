function ConfirmationPage({ streamingRoom, onConfirm, onCancel }) {
    const { serverAddress, token, state } = streamingRoom;

    const handleConfirmClick = () => {
        console.log('ConfirmationPage - onConfirm 호출:', streamingRoom);
        onConfirm(streamingRoom);
    };

    return (
        <div>
            <h1>채팅방 정보 확인</h1>
            <p><strong>서버 주소:</strong> {serverAddress}</p>
            <p><strong>토큰:</strong> {token}</p>
            <p>
                <strong>상태:</strong>{' '}
                {state === 1 ? '사용 중' : '사용 가능'}
            </p>
            <div>
                {state !== 2 && (
                    <button onClick={handleConfirmClick}>입장하기</button>
                )}
                <button onClick={onCancel}>취소</button>
            </div>
        </div>
    );
}

export default ConfirmationPage;
