import React from 'react';
import { Link } from 'react-router-dom';
import { isMobile } from 'react-device-detect';

function CV() {
    const fontSize = isMobile ? '12px' : '16px';
    return (
        <div style={{ fontSize }}>
            <nav>
                <Link to="/">home</Link>
                <Link to="/#/about">about</Link>
                <Link to="/#/projects">projects</Link>
                <Link to="/#/publications">publications</Link>
                <Link to="/#/cv">CV</Link>
            </nav>
            <div className="header-line"></div>
            <div className="container">
                <img src="/nyan_cat.gif"/>
            </div>
        </div>
    );
}

export default CV;