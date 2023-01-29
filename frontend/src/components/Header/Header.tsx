// HEADER OF WEB PAGE
import React from 'react';
import './Header.css';


const Header: React.FC = () => {
    const logo = require('../../assets/10AcademyHeader.png')
    return (
        <header>
            {/* LOGO AT THE TOP OF WEBPAGE */}
            <img src={logo} className={'header-logo'} alt="logo" />
            <h1 className={'header-title'}>Welcome</h1>
        </header>
    );
};

export default Header;