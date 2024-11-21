import React, { useState, useEffect } from "react";
import axios from "axios";
import Avatars from "./Avatars";

const SignIn = ({ handleSignIn }) => {
    const [username, setUsername] = useState("");
    const [moderator, setModerator] = useState(false);
    const [avatar, setAvatar] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUserData = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("No token found. Please login again.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get("http://localhost:9001/api/user", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data && response.data.name) {
                setUsername(response.data.name);
                setModerator(response.data.role === "ROLE_FARMER");
                setError(null);
            } else {
                setError("Failed to retrieve user data.");
            }
        } catch (err) {
            console.error("Failed to fetch user data:", err);
            setError("Failed to fetch user data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    if (loading) {
        return (
            <div className="modal pos-absolute top-0 bottom-0">
                <div className="modal__el">
                    <h1>Loading...</h1>
                </div>
                <div className="modal__overlay"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="modal pos-absolute top-0 bottom-0">
                <div className="modal__el">
                    <h1>Error</h1>
                    <p>{error}</p>
                    <button
                        onClick={() => {
                            localStorage.removeItem("token");
                            window.location.reload();
                        }}
                        className="btn btn--primary rounded mg-t-1"
                    >
                        Retry Login
                    </button>
                </div>
                <div className="modal__overlay"></div>
            </div>
        );
    }

    return (
        <div className="modal pos-absolute top-0 bottom-0">
            <div className="modal__el">
                <h1 className="mg-b-2">Join the chat room</h1>
                <form onSubmit={(e) => e.preventDefault()}>
                    <fieldset>
                        <label htmlFor="name" className="mg-b-05">
                            Username
                        </label>
                        <input
                            name="name"
                            id="name"
                            type="text"
                            className="radius"
                            value={username}
                            readOnly
                        />
                        <hr />
                        <div className="mg-b-05 label">Select Avatar</div>
                        <div className="item-select-container pd-1 mg-b-1">
                            <div className="avatars pos-relative item-select-grid">
                                <Avatars
                                    currentAvatar={avatar?.name}
                                    handleAvatarClick={(avatar) => setAvatar(avatar)}
                                />
                            </div>
                        </div>
                        <hr />
                        <button
                            onClick={() => handleSignIn(username, moderator, avatar)}
                            className="btn btn--primary rounded mg-t-1"
                            disabled={!username}
                        >
                            Start chatting
                        </button>
                    </fieldset>
                </form>
            </div>
            <div className="modal__overlay"></div>
        </div>
    );
};

export default SignIn;
