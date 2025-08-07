import React from 'react'
import Navbar from "./Navbar";

const HeroSection = () => {
    return (
        <section className='heroSection' id='heroSection'>
            <Navbar />
            <div className="container">
                <div className="banner">
                    <div className="largeBox">
                        <h1 className='title'>Pichuka</h1>
                    </div>
                    <div className="combined-boxes">
                        <div className="imageBox">
                            <img src='/hero1.png' alt='hero1' />
                        </div>
                        <div className="textAndLogo">
                            <div className="textWithSvg">
                                <h1 className='title'>Multi-Cuisine</h1>
                                <h1 className='title dishes_title'>Restaurant</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="banner">
                    <div className="imageBox">
                        <img src="/hero2.png" alt="hero2" />
                    </div>
                    <h1 className='title dishes_title'>Experience</h1>
                </div>
            </div>
        </section>
    )
}

export default HeroSection
