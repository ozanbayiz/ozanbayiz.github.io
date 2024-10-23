import React from "react";
import { isMobile } from 'react-device-detect';
import { Link } from 'react-router-dom';

function About() {
    const fontSize = isMobile ? '12px' : '16px';
    return (
        <div style={{ fontSize }}>
            <nav>
                <Link to="/">home</Link>
                <Link to="/about">about</Link>
                <Link to="/projects">projects</Link>
                <Link to="/publications">publications</Link>
                <Link to="/resume">resume</Link>
            </nav>

            <div className="header-line"></div>

            <div className="content">
                <div className="top-content">
                    <pre className="ascii-item"> XXX XXX{"    "}XXX XXX{"        "}XXX{"      "}XXX XXX{"              "}{"\n"}XXX{"   "}XXX{"        "}XXX{"     "}XXX XXX{"    "}XXX{"   "}XXX{"            "}{"\n"}XXX{"   "}XXX{"       "}XXX{"     "}XXX{"   "}XXX{"   "}XXX{"   "}XXX{"            "}{"\n"}XXX{"   "}XXX{"    "}XXX XXX{"     "}XXX XXX{"    "}XXX{"   "}XXX{"            "}{"\n"}XXX{"   "}XXX{"     "}XXX{"       "}XXX{"   "}XXX{"   "}XXX{"   "}XXX{"            "}{"\n"}XXX{"   "}XXX{"    "}XXX{"        "}XXX{"   "}XXX{"   "}XXX{"   "}XXX{"            "}{"\n"} XXX XXX{"      "}XXX XXX{"   "}XXX{"   "}XXX{"   "}XXX{"   "}XXX{"            "}{"\n"}{"\n"} XXX XXX{"       "}XXX{"      "}XXX{"   "}XXX{"    "}XXX XXX{"    "}XXX XXX{"  "}{"\n"}XXX{"   "}XXX{"    "}XXX XXX{"    "}XXX{"   "}XXX{"      "}XXX{"           "}XXX {"\n"}XXX{"   "}XXX{"   "}XXX{"   "}XXX{"    "}XXX XXX{"       "}XXX{"          "}XXX{"  "}{"\n"} XXX XXX{"     "}XXX XXX{"       "}XXX{"         "}XXX{"       "}XXX XXX {"\n"}XXX{"   "}XXX{"   "}XXX{"   "}XXX{"      "}XXX{"         "}XXX{"        "}XXX{"    "}{"\n"}XXX{"   "}XXX{"   "}XXX{"   "}XXX{"      "}XXX{"         "}XXX{"       "}XXX{"     "}{"\n"} XXX XXX{"    "}XXX{"   "}XXX{"      "}XXX{"       "}XXX XXX{"      "}XXX XXX{"\n"}</pre>
                    <img style={{padding: "var(--padding-desktop)", height: "19rem", width: "auto"}} src="/ozan_ascended.png"></img>
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
                        Ozan Bayiz is a junior Regents' Scholar at UC Berkeley studying Computer Science.
                    </p>
                    <p>
                        He is interested exploring the applications of deep learning in the intersection of technology and human-centered design.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default About;
