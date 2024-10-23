import React from "react";
import { isMobile } from 'react-device-detect';
import { Link } from 'react-router-dom';

function About() {
    const fontSize = isMobile ? '12px' : '16px';
    const asciiSize = isMobile ? '7.8px' : '16px';
    const OzanSize = isMobile ? '9rem' : '19rem';
    const OzanPadding = isMobile ? '0px' : 'var(--padding-desktop)';
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
            <div className="content">
                <br></br>
                <div className="top-content">
                    <pre style={{fontSize: asciiSize}} className="ascii-item"> XXX XXX{"    "}XXX XXX{"        "}XXX{"      "}XXX XXX{"              "}{"\n"}XXX{"   "}XXX{"        "}XXX{"     "}XXX XXX{"    "}XXX{"   "}XXX{"            "}{"\n"}XXX{"   "}XXX{"       "}XXX{"     "}XXX{"   "}XXX{"   "}XXX{"   "}XXX{"            "}{"\n"}XXX{"   "}XXX{"    "}XXX XXX{"     "}XXX XXX{"    "}XXX{"   "}XXX{"            "}{"\n"}XXX{"   "}XXX{"     "}XXX{"       "}XXX{"   "}XXX{"   "}XXX{"   "}XXX{"            "}{"\n"}XXX{"   "}XXX{"    "}XXX{"        "}XXX{"   "}XXX{"   "}XXX{"   "}XXX{"            "}{"\n"} XXX XXX{"      "}XXX XXX{"   "}XXX{"   "}XXX{"   "}XXX{"   "}XXX{"            "}{"\n"}{"\n"} XXX XXX{"       "}XXX{"      "}XXX{"   "}XXX{"    "}XXX XXX{"    "}XXX XXX{"  "}{"\n"}XXX{"   "}XXX{"    "}XXX XXX{"    "}XXX{"   "}XXX{"      "}XXX{"           "}XXX {"\n"}XXX{"   "}XXX{"   "}XXX{"   "}XXX{"    "}XXX XXX{"       "}XXX{"          "}XXX{"  "}{"\n"} XXX XXX{"     "}XXX XXX{"       "}XXX{"         "}XXX{"       "}XXX XXX {"\n"}XXX{"   "}XXX{"   "}XXX{"   "}XXX{"      "}XXX{"         "}XXX{"        "}XXX{"    "}{"\n"}XXX{"   "}XXX{"   "}XXX{"   "}XXX{"      "}XXX{"         "}XXX{"       "}XXX{"     "}{"\n"} XXX XXX{"    "}XXX{"   "}XXX{"      "}XXX{"       "}XXX XXX{"      "}XXX XXX{"\n"}</pre>
                    <img style={{padding: OzanPadding, height: OzanSize, width: "auto"}} src="/ozan_ascended.png"></img>
                </div>
                <div className="multi-container">
                    <div className="text-container">
                        <p> ozanbayiz (at) berkeley (dot) edu </p>
                        <p> +1 (424) 325-8971 </p>
                    </div>
                    <div className="social-links">
                        <a href="https://www.linkedin.com/in/ozanbayiz" target="_blank" rel="noopener noreferrer">
                            <img src="/icons/linkedin.png" alt="LinkedIn" />
                        </a>
                        <a href="https://github.com/ozanbayiz" target="_blank" rel="noopener noreferrer">
                            <img src="/icons/github.png" alt="GitHub" />
                        </a>
                        <a href="https://www.instagram.com/ozanbayiz" target="_blank" rel="noopener noreferrer">
                            <img src="/icons/instagram.png" alt="Instagram" />
                        </a>
                    </div>
                </div>
            </div>
            <div className="header-line"></div>
            <div className="content">
                <div className="text-container">
                    <p>
                        Junior Regents' Scholar at UC Berkeley studying Computer Science.
                    </p>
                    <p>
                        Interested in deep learning and human-centered design. Likes pretty pictures.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default About;
