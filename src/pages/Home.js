import React from "react";
import { isMobile } from 'react-device-detect';
import { Link } from 'react-router-dom';

function Home() {
    const fontSize = isMobile ? '12px' : '16px';
    const alignItems = isMobile ? 'none' : 'flex-start';

    return (
        <div className="container" style={{ fontSize, alignItems}}>
            <div className="top-content">
                <div class="ascii-container">
                    <pre className="ascii-item">{"                     "}XXXXXXX{"\n"}{"                     "}XXXXXXX{"\n"}{"                    "}XXXXXXXX{"\n"}{"                    "}XXXXXXXX{"\n"}{"                    "}XX{"      "}{"\n"}{"           "}XXX{"       "}X{"      "}{"\n"}{"          "}XX X{"       "}X{"      "}{"\n"}{"         "}XX{"  "}XX{"      "}XX{"     "}{"\n"}{"         "}X{"    "}XXXXXXX X{"     "}{"\n"}{"        "}XX{"          "}XXX{"     "}{"\n"}{"        "}x{"                   "}{"\n"}{"        "}x{"                   "}{"\n"}xxx{"     "}X{"                   "}{"\n"}XXX{"    "}XX{"                   "}{"\n"}XXX{"  "}XXX{"                    "}{"\n"}{"  "}XX X{"                      "}{"\n"}{"   "}XXX{"                      "}</pre>
                    {/* <pre className="ascii-item">XXXXXXX{"                     "}{"\n"}XXXXXXX{"                     "}{"\n"}XXXXXXXX{"                    "}{"\n"}XXXXXXXX{"                    "}{"\n"}{"      "}XX{"                    "}{"\n"}{"      "}X{"       "}XXX{"           "}{"\n"}{"      "}X{"       "}X XX{"          "}{"\n"}{"     "}XX{"      "}XX{"  "}XX{"         "}{"\n"}{"     "}X XXXXXXX{"    "}X{"         "}{"\n"}{"     "}XXX{"          "}XX{"        "}{"\n"}{"                   "}X{"        "}{"\n"}{"                   "}X{"        "}{"\n"}{"                   "}X{"     "}XXX{"\n"}{"                   "}XX{"    "}XXX{"\n"}{"                    "}XXX{"  "}XXX{"\n"}{"                       "}X XX {"\n"}{"                       "}XXX{"   "}</pre> */}
                    <pre className="ascii-item"> XXX XXX{"    "}XXX XXX{"        "}XXX{"      "}XXX XXX{"              "}{"\n"}XXX{"   "}XXX{"        "}XXX{"     "}XXX XXX{"    "}XXX{"   "}XXX{"            "}{"\n"}XXX{"   "}XXX{"       "}XXX{"     "}XXX{"   "}XXX{"   "}XXX{"   "}XXX{"            "}{"\n"}XXX{"   "}XXX{"    "}XXX XXX{"     "}XXX XXX{"    "}XXX{"   "}XXX{"            "}{"\n"}XXX{"   "}XXX{"     "}XXX{"       "}XXX{"   "}XXX{"   "}XXX{"   "}XXX{"            "}{"\n"}XXX{"   "}XXX{"    "}XXX{"        "}XXX{"   "}XXX{"   "}XXX{"   "}XXX{"            "}{"\n"} XXX XXX{"      "}XXX XXX{"   "}XXX{"   "}XXX{"   "}XXX{"   "}XXX{"            "}{"\n"}{"\n"} XXX XXX{"       "}XXX{"      "}XXX{"   "}XXX{"    "}XXX XXX{"    "}XXX XXX{"  "}{"\n"}XXX{"   "}XXX{"    "}XXX XXX{"    "}XXX{"   "}XXX{"      "}XXX{"           "}XXX {"\n"}XXX{"   "}XXX{"   "}XXX{"   "}XXX{"    "}XXX XXX{"       "}XXX{"          "}XXX{"  "}{"\n"} XXX XXX{"     "}XXX XXX{"       "}XXX{"         "}XXX{"       "}XXX XXX {"\n"}XXX{"   "}XXX{"   "}XXX{"   "}XXX{"      "}XXX{"         "}XXX{"        "}XXX{"    "}{"\n"}XXX{"   "}XXX{"   "}XXX{"   "}XXX{"      "}XXX{"         "}XXX{"       "}XXX{"     "}{"\n"} XXX XXX{"    "}XXX{"   "}XXX{"      "}XXX{"       "}XXX XXX{"      "}XXX XXX{"\n"}</pre>
                </div>
            </div>
            <div className="header-line" />
            <div className="bottom-content">

                <nav>
                    <Link to="/about">about</Link>
                    <Link to="/projects">projects</Link>
                    <Link to="/publications">publications</Link>
                    <Link to="/cv">CV</Link>
                </nav>
                
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
    )
}

export default Home;
