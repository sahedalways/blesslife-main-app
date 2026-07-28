'use client';

import React, { useState, useEffect, useCallback } from 'react';

const slides = [
  {
    image: '/hero_blesslife_main.png',
    badge: 'ALIGNED WITH SAUDI VISION 2030',
    title: 'Empowering Business',
    titleLine2: 'Growth in KSA',
    subtitle: 'Blesslife Limited delivers integrated business solutions — from construction and HR supply to facility management and commercial services — all from the heart of Riyadh.',
  },
  {
    image: '/hero_slide_2.png',
    badge: 'CONSTRUCTION & CONTRACTING',
    title: 'Building the Future',
    titleLine2: 'of Saudi Arabia',
    subtitle: 'From infrastructure development to building construction, renovation and project management — we deliver excellence at every phase.',
  },
  {
    image: '/hero_slide_3.png',
    badge: 'OPERATIONS & MAINTENANCE',
    title: 'Reliable Solutions',
    titleLine2: 'for Every Industry',
    subtitle: 'Facility management, equipment maintenance, and preventive strategies that optimize performance and minimize downtime across your operations.',
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === current) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [current, isTransitioning]);

  const nextSlide = useCallback(() => {
    goToSlide((current + 1) % slides.length);
  }, [current, goToSlide]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="hero" id="hero">
      {/* Background images — all stacked, only active one is visible */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`hero-slide-bg ${i === current ? 'active' : ''}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        />
      ))}

      {/* Dark gradient overlay */}
      <div className="hero-overlay" />

      {/* Animated particles / floating elements */}
      <div className="hero-particles">
        <div className="particle p1" />
        <div className="particle p2" />
        <div className="particle p3" />
        <div className="particle p4" />
        <div className="particle p5" />
      </div>

      {/* Content */}
      <div className="container hero-container">
        <div className="hero-content">
          {slides.map((slide, i) => (
            <div
              key={i}
              className={`hero-slide-content ${i === current ? 'active' : ''}`}
            >
              <div className="hero-badge">{slide.badge}</div>
              <h1 className="hero-title">
                {slide.title}
                <br />
                <span className="hero-title-highlight">{slide.titleLine2}</span>
              </h1>
              <p className="hero-subtitle">{slide.subtitle}</p>
              <div className="hero-cta-row">
                <a href="#services" className="btn btn-primary hero-btn">
                  Explore Our Services
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7" /><path d="M7 7h10v10" />
                  </svg>
                </a>
                <a href="#about" className="btn btn-outline-light hero-btn">
                  Learn More
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>



        {/* Vertical dot navigation */}
        <div className="hero-slider-nav">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`slider-dot ${i === current ? 'active' : ''}`}
              onClick={() => goToSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Progress bar at bottom of hero */}
      <div className="hero-progress">
        <div
          className="hero-progress-fill"
          key={current}
        />
      </div>
    </section>
  );
}
