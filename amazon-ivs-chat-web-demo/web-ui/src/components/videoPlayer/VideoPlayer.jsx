// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useEffect } from 'react';

// Styles
import './VideoPlayer.css';

const VideoPlayer = ({ playbackUrl }) => {
    useEffect(() => {
        if (!playbackUrl) {
            console.warn('No playbackUrl provided.');
            return;
        }

        const MediaPlayerPackage = window.IVSPlayer;
        if (!MediaPlayerPackage?.isPlayerSupported) {
            console.warn('The current browser does not support the Amazon IVS player.');
            return;
        }

        const PlayerState = MediaPlayerPackage.PlayerState;
        const PlayerEventType = MediaPlayerPackage.PlayerEventType;

        // Initialize player
        const player = MediaPlayerPackage.create();
        const videoEl = document.getElementById('video-player');
        
        if (videoEl) {
            player.attachHTMLVideoElement(videoEl);

            // Event listeners
            const onPlaying = () => {
                console.info('Player State - PLAYING');
            };
            const onEnded = () => {
                console.info('Player State - ENDED');
            };
            const onReady = () => {
                console.info('Player State - READY');
            };
            const onError = (err) => {
                console.error('Player Event - ERROR:', err);
            };

            // Attach listeners
            player.addEventListener(PlayerState.PLAYING, onPlaying);
            player.addEventListener(PlayerState.ENDED, onEnded);
            player.addEventListener(PlayerState.READY, onReady);
            player.addEventListener(PlayerEventType.ERROR, onError);

            // Setup stream
            player.setAutoplay(true);
            player.load(playbackUrl);
            player.setVolume(0.5);

            // Cleanup function
            return () => {
                try {
                    player.removeEventListener(PlayerState.PLAYING, onPlaying);
                    player.removeEventListener(PlayerState.ENDED, onEnded);
                    player.removeEventListener(PlayerState.READY, onReady);
                    player.removeEventListener(PlayerEventType.ERROR, onError);
                    player.pause();
                    player.delete();
                } catch (error) {
                    console.error('Player cleanup error:', error);
                }
            };
        }
    }, [playbackUrl]);

    return (
        <div className='player-wrapper'>
            <div className='aspect-169 pos-relative full-width full-height'>
                <video
                    id='video-player'
                    className='video-elem pos-absolute full-width'
                    playsInline
                    muted
                />
                {/* ... 나머지 JSX ... */}
            </div>
        </div>
    );
};

export default VideoPlayer;
