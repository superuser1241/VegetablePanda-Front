import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faCircleInfo } from "@fortawesome/free-solid-svg-icons"
import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={styles.footer}>
            <div className='footer-right'>
                <p>CONTACT US </p><p><FontAwesomeIcon icon={faEnvelope}/> vegetablePanda@gmail.com</p>
                {/* <p><Link to = '/team'><FontAwesomeIcon icon={faCircleInfo} /> Info</Link></p> */}
            </div>
            <div className='footer-left'>
                <p>© 2024 농산물 판다. All rights reserved.</p>
                <p>
                    <a href="/privacy" style={styles.link}>Privacy Policy</a> |{' '}
                    <a href="/terms" style={styles.link}>Terms of Service</a>
                </p>
            </div>
            
        </footer>
    );
};

const styles = {
    footer: {
        backgroundColor: '#333',
        color: '#fff',
        textAlign: 'center',
        padding: '10px 0',
        marginTop: '20px', 
        // display: 'flex',
        // gap: '100px',
        // justifyContent: 'center',
    },
    link: {
        color: '#fff',
        textDecoration: 'none',
    },
};

export default Footer;
