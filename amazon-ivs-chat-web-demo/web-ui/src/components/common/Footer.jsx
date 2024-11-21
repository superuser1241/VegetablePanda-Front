import React from 'react';

const Footer = () => {
    return (
        <footer style={styles.footer}>
            <p>© 2024 농산물 판다. All rights reserved.</p>
            <p>
                <a href="/privacy" style={styles.link}>Privacy Policy</a> |{' '}
                <a href="/terms" style={styles.link}>Terms of Service</a>
            </p>
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
    },
    link: {
        color: '#fff',
        textDecoration: 'none',
    },
};

export default Footer;
