'use client';
import React, { useEffect, useState } from 'react';
import HeroSlider from './components/HeroSlider';
import Navbar from './components/Navbar';
import NoticeModal from './components/NoticeModal';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [activeProjectTab, setActiveProjectTab] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const projectData = [
    {
      title: "CIVIL WORK",
      desc: "We deliver comprehensive civil work services, managing every phase from excavation to foundation completion. We ensure precision and adherence to all specified measurements and drawings, guaranteeing high-quality results for every project.",
      images: [
        "/project_Images/p11_civil_work_cover.jpg",
        "/project_Images/p12_01_site_boundary_work.jpg",
        "/project_Images/p12_02_driveway_structure.jpg",
        "/project_Images/p12_03_rail_work_worker.jpg",
        "/project_Images/p12_04_interior_brickwork_small.jpg",
        "/project_Images/p12_05_interior_brickwork_large.jpg",
        "/project_Images/p12_06_drawing_measurement.jpg",
        "/project_Images/p12_07_hardhat_site_worker.jpg",
        "/project_Images/p12_08_rooftop_blockwork.jpg",
        "/project_Images/p13_01_site_supervisors.jpg",
        "/project_Images/p13_02_red_machine_installation.jpg",
        "/project_Images/p13_03_indoor_ladder_work.jpg",
        "/project_Images/p13_04_column_rebar_work.jpg",
        "/project_Images/p13_05_crane_construction_view.jpg",
        "/project_Images/p13_06_concrete_pouring.jpg",
        "/project_Images/p13_07_concrete_floor_machine.jpg"
      ]
    },
    {
      title: "EXPERT INSTALLATION",
      desc: "We specialize in installing aluminum, glass, louvers, gritting, cladding, and bullnose systems, including rooftop, wall, and ceiling cladding. Our skilled professionals ensure top-quality results and adhere to the highest industry standards.",
      images: [
        "/project_Images/p14_expert_installation_glass_facade_cover.jpg",
        "/project_Images/p15_01_glass_entrance_installation.jpg",
        "/project_Images/p15_02_rooftop_installation_workers.jpg",
        "/project_Images/p15_03_exterior_glass_building.jpg",
        "/project_Images/p15_04_rooftop_floor_installation.jpg",
        "/project_Images/p15_05_building_facade_glass.jpg"
      ]
    },
    {
      title: "MASONRY WORK",
      desc: "We specialize in comprehensive masonry work, including steel fixing, shuttering, carpentry, and concrete. Our projects are overseen by experienced and highly qualified supervisors. Additionally, our workforce consists of skilled professionals dedicated to delivering high-quality results.",
      images: [
        "/project_Images/p16_masonry_work_cover.jpg",
        "/project_Images/p17_01_masonry_mixer_team.jpg",
        "/project_Images/p17_02_scaffolding_and_rebar_left.jpg",
        "/project_Images/p17_03_scaffolding_worker.jpg",
        "/project_Images/p17_04_block_wall_structure.jpg",
        "/project_Images/p17_05_rebar_blockwork_right.jpg"
      ]
    },
    {
      title: "OPERATIONS & MAINTENANCE",
      desc: "Blesslife's Operations and Maintenance services ensure the efficient and reliable performance of our projects. We employ proactive strategies and industry-leading practices to optimize operations and minimize downtime.",
      images: [
        "/project_Images/p18_operations_maintenance_cover.jpg",
        "/project_Images/p19_01_hand_tools_maintenance.jpg",
        "/project_Images/p19_02_electrical_repair.jpg",
        "/project_Images/p19_03_tool_belt_worker.jpg",
        "/project_Images/p19_04_red_toolbox_maintenance.jpg",
        "/project_Images/p19_05_machine_maintenance_worker.jpg",
        "/project_Images/p19_06_safety_helmet_gloves.jpg",
        "/project_Images/p20_01_industrial_repair_worker.jpg",
        "/project_Images/p20_02_machine_repair_team.jpg",
        "/project_Images/p20_03_worker_on_phone.jpg",
        "/project_Images/p20_04_safety_meeting.jpg",
        "/project_Images/p20_05_factory_staff.jpg",
        "/project_Images/p20_06_equipment_at_night.jpg",
        "/project_Images/p20_07_handshake_safety.jpg"
      ]
    },
    {
      title: "EXPERT STONE & MARBLE INSTALLATION",
      desc: "We excel in stone and marble installation, delivering structural integrity with expert welding and precise measurements. Our services encompass both interior wall installations and exterior framing.",
      images: [
        "/project_Images/p21_stone_marble_installation_cover.jpg",
        "/project_Images/p22_01_exterior_panel_building.jpg",
        "/project_Images/p22_02_tall_building_facade.jpg",
        "/project_Images/p22_03_building_facade_crane.jpg",
        "/project_Images/p22_04_ceiling_marble_glass_corner.jpg"
      ]
    }
  ];

  const defaultPartnerLogos = [
    "p23_logo_01.png", "p23_logo_02.png", "p23_logo_03.png", "p23_logo_04.png", "p23_logo_05.png",
    "p23_logo_06.png", "p23_logo_07.png", "p23_logo_08.png", "p23_logo_09.png", "p23_logo_10.png",
    "p23_logo_11.png", "p23_logo_12.png", "p24_logo_01.png", "p24_logo_02.png", "p24_logo_03.png",
    "p24_logo_04.png", "p24_logo_05.png", "p24_logo_06.png", "p24_logo_07.png", "p24_logo_08.png",
    "p24_logo_09.png", "p24_logo_10.png", "p24_logo_11.png", "p24_logo_12.png", "p25_logo_01.png",
    "p25_logo_02.png", "p25_logo_03.png", "p25_logo_04.png", "p25_logo_05.png", "p25_logo_06.png",
    "p25_logo_07.png", "p25_logo_08.png", "p25_logo_09.png", "p25_logo_10.png", "p25_logo_11.png",
    "p25_logo_12.png", "p25_logo_13.png", "p25_logo_14.png", "p25_logo_15.png", "p25_logo_16.png",
    "p25_logo_17.png", "p25_logo_18.png"
  ].map((logo, i) => ({
    id: i,
    name: `Partner ${i + 1}`,
    logo_url: `/Partner_Client_Logos/${logo}`
  }));

  const [settings, setSettings] = useState<Record<string, string>>({
    company_name: 'Blesslife Limited',
    logo_url: '/main-logo.png',
    phone: '+966112242650',
    email: 'info@blesslife.com.sa',
    website: 'www.blesslife.com.sa',
    address: 'Flat: 09, Level: 03, Humaidia Building, Al Murabba, Riyadh, KSA',
    facebook_url: '#',
    linkedin_url: '#',
    twitter_url: '#',
    footer_text: 'Blesslife Limited is a multifaceted company providing comprehensive solutions in business consultation, trading, services, construction, HR supply, operations & maintenance. Aligned with Saudi Vision 2030.',
    reg_number: '7034220314',
    reg_date: '06/06/2023',
  });

  const [aboutData, setAboutData] = useState<{
    about: { title: string; description: string; image_url: string } | null;
    mission: { description: string; image_url: string } | null;
    vision: { description: string; image_url: string } | null;
    chairman: { name: string; title: string; message: string; image_url: string } | null;
  }>({
    about: {
      title: 'Blesslife Limited',
      description: 'Blesslife Limited is a multifaceted company providing comprehensive solutions in business consultation, trading, services, construction, HR supply, operations & maintenance. With an unwavering commitment to excellence and client satisfaction, we aim to be the strategic partner for ambitious businesses.',
      image_url: '/about_us.png',
    },
    mission: {
      description: 'At Blesslife Limited, our mission is to deliver tailored solutions that enhance growth, productivity, and efficiency, enabling businesses to achieve their full potential. We are committed to providing value-added services that help our clients meet and exceed their goals within the competitive business landscape.',
      image_url: '/mission.png',
    },
    vision: {
      description: 'To be the global leader in providing integrated business solutions, setting the standard for excellence, innovation, and client satisfaction across all industries we serve',
      image_url: '/Vission.png',
    },
    chairman: {
      name: 'Ruhul Amin',
      title: 'Chairman',
      message: 'Ruhul Amin, the esteemed Chairman of Blesslife, is renowned for his strategic acumen and extensive industry experience. With a distinguished background in strategic management, he has been instrumental in steering Blesslife towards significant growth and innovation.\n\nHis leadership is marked by a commitment to fostering collaboration, empowering teams, and cultivating a forward-thinking vision. Under his guidance, Blesslife has achieved numerous milestones, establishing itself as a leader in the industry.',
      image_url: '',
    },
  });

  const [projectsList, setProjectsList] = useState<Array<{
    title: string;
    desc: string;
    images: string[];
  }>>(projectData);

  const [partnersList, setPartnersList] = useState<Array<{
    id: number;
    name: string;
    logo_url: string;
  }>>(defaultPartnerLogos);

  // Load dynamic data on mount
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setSettings(prev => ({ ...prev, ...data })); })
      .catch(() => {});

    fetch('/api/about')
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setAboutData(data); })
      .catch(() => {});

    fetch('/api/projects')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          const formatted = data.map((p: any) => ({
            title: p.title,
            desc: p.description,
            images: p.images ? p.images.map((img: any) => img.image_url) : []
          }));
          setProjectsList(formatted);
        }
      })
      .catch(() => {});

    fetch('/api/partners')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          setPartnersList(data);
        }
      })
      .catch(() => {});
  }, []);

  // Initialize Lenis Smooth Scrolling
  useEffect(() => {
    const lenis = new Lenis();

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
    };
  }, []);

  useGSAP(() => {
    const sections = gsap.utils.toArray('.animate-section');
    sections.forEach((section: any) => {
      gsap.fromTo(
        section.children,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power2.out',
          stagger: 0.2,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
          }
        }
      );
    });
  });

  return (
    <>
      {/* ========== NOTICE POPUP ========== */}
      <NoticeModal />

      {/* ========== NAVBAR ========== */}
      <Navbar />

      {/* ========== HERO SLIDER ========== */}
      <HeroSlider />


      {/* ========== ABOUT / WHO WE ARE ========== */}
      <section className="about" id="about">
        <div className="container about-grid animate-section">
          <div className="about-panel">
            <div className="section-badge">ABOUT US</div>
            <h2>{aboutData.about?.title || 'Blesslife Limited'}</h2>
            <p className="about-copy">{aboutData.about?.description}</p>
          </div>

          <div className="about-image-wrap">
            <div className="about-image-frame">
              <img src={aboutData.about?.image_url || "/about_us.png"} className="about-image" alt="Modern city skyline with Blesslife infrastructure" />
            </div>
          </div>
        </div>
      </section>

      {/* ========== MISSION + VISION ========== */}
      <section className="mission-vision" id="mission-vision">
        <div className="container mission-vision-grid animate-section">
          <div className="mission-card">
            <div className="mission-card-content">
              <div className="section-badge">MISSION</div>

              <p>{aboutData.mission?.description}</p>
            </div>
            <div className="mission-card-image">
              <img src={aboutData.mission?.image_url || "/mission.png"} alt="Mission illustration" />
            </div>
          </div>

          <div className="vision-card">
            <div className="vision-card-image">
              <img src={aboutData.vision?.image_url || "/Vission.png"} alt="Vision illustration" />
            </div>
            <div className="vision-card-content">
              <div className="section-badge">VISION</div>

              <p>{aboutData.vision?.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== VALUES SECTION ========== */}
      <section className="values" id="values">
        <div className="container values-wrap animate-section">
          <div className="values-intro">
            <div className="section-badge">VALUES</div>

          </div>
          <div className="values-grid">
            {[
              { title: 'Service Excellence', icon: '/icons/service.png' },
              { title: 'Talent Development', icon: '/icons/professional-development.png' },
              { title: 'Ethical Practices', icon: '/icons/ethical.png' },
              { title: 'Operational Efficiency', icon: '/icons/efficacy.png' },
              { title: 'Technological Advancement', icon: '/icons/technology.png' }
            ].map((item, idx) => (
              <div className="value-card" key={idx}>
                <div className="value-icon">
                  <img src={item.icon} alt={item.title} />
                </div>
                <h3>{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ========== WHY CHOOSE US ========== */}
      <section className="why-choose" id="why-us">
        <div className="container why-choose-grid animate-section">
          <div className="why-choose-content">
            <div className="section-badge" style={{ color: 'var(--primary)', borderColor: 'rgba(0,0,0,0.08)' }}>WHY CHOOSE US</div>
            <h2 className="why-choose-title">WHY CHOOSE US</h2>
            <div className="why-choose-list">
              {[
                { title: 'RELIABILITY', desc: 'Our commitment to delivering dependable solutions ensures that we consistently meet the highest standards of quality and professionalism.' },
                { title: 'INNOVATION', desc: 'We foster a culture of innovation, continually seeking new methods to enhance processes, optimize efficiency, and add significant value to our clients’ businesses.' },
                { title: 'CLIENT-CENTRIC FOCUS', desc: 'We prioritize our clients’ success by actively listening, collaborating, and adapting to their unique needs, ensuring our solutions consistently exceed expectations.' },
                { title: 'INTEGRITY', desc: 'Integrity is the bedrock of our operations. We uphold honesty, transparency, and ethical conduct in all our interactions, ensuring trust and reliability in our services.' }
              ].map((item, i) => (
                <div className="why-choose-item" key={i}>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="why-choose-image">
            <img src="/why_choose.png" alt="Why Choose Us illustration" />
          </div>
        </div>
      </section>

      {/* ========== FULL SERVICES DETAIL GRID ========== */}
      <section className="services-detail" id="services">
        <div className="container">
          <div className="animate-section">
            <div className="section-badge">OUR CAPABILITY</div>
            <h2 className="section-heading">Our <span className="text-primary">Capability</span></h2>
          </div>
          <div className="services-detail-grid animate-section">
            {[
              { title: "Construction & Contracting", items: ["Infrastructure Development", "Building Construction", "Renovation & Restoration", "Project Management"], icon: <><path d="M2 22h20" /><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18" /><path d="M10 6h4" /><path d="M10 10h4" /><path d="M10 14h4" /></> },
              { title: "Commercial Services", items: ["General Trading", "Pharmacies", "Building Materials", "Grocery & Supermarkets"], icon: <><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></> },
              { title: "Operation & Maintenance", items: ["Facility Management", "Equipment Maintenance", "Asset Management", "Preventive Maintenance"], icon: <><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></> },
              { title: "HR Solutions & Staffing", items: ["Recruitment Services", "Staffing Solutions", "Training & Development", "Workforce Supply"], icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></> },
              { title: "Security & Communication", items: ["CCTV Systems Integration", "Access Control Systems", "Network Design", "Home Automation"], icon: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></> },
              { title: "Creative Branding", items: ["Event Design & Management", "Audiovisual Production", "Social Media Marketing", "Web & App Development"], icon: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></> }
            ].map((service, i) => (
              <div className="service-detail-card" key={i}>
                <div className="service-detail-icon-wrap">
                  <svg className="service-detail-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    {service.icon}
                  </svg>
                </div>
                <h3>{service.title}</h3>
                <ul>
                  {service.items.map((item, j) => (
                    <li key={j}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== Chairman Message  ========== */}
      <section className="chairman-message" id="chairman-message">
        <div className="container chairman-grid animate-section">
          <div className="chairman-content">
            <div className="section-badge" style={{ color: 'var(--light)', borderColor: 'rgba(255,255,255,0.3)' }}>LEADERSHIP</div>
            <h2 className="chairman-title">Message from {aboutData.chairman?.title || 'Chairman'}</h2>
            {aboutData.chairman?.message ? (
              aboutData.chairman.message.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))
            ) : (
              <>
                <p>
                  Ruhul Amin, the esteemed Chairman of Blesslife, is renowned for his strategic acumen and extensive industry experience. With a distinguished background in strategic management, he has been instrumental in steering Blesslife towards significant growth and innovation.
                </p>
                <p>
                  His leadership is marked by a commitment to fostering collaboration, empowering teams, and cultivating a forward-thinking vision. Under his guidance, Blesslife has achieved numerous milestones, establishing itself as a leader in the industry.
                </p>
              </>
            )}
          </div>

          <div className="chairman-image-wrap">
            {aboutData.chairman?.image_url ? (
              <img src={aboutData.chairman.image_url} alt={`Chairman ${aboutData.chairman.name}`} className="chairman-image" />
            ) : (
              <div className="chairman-image-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="placeholder-icon">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span>Chairman Image</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========== SISTER COMPANIES ========== */}
      <section className="sister-companies" id="sister-companies">
        <div className="container animate-section">
          <h2 className="sister-title">Our Sister Companies</h2>
          <div className="sister-logos-wrap">
            <img src="/sister_company_logos.png" alt="Our Sister Companies" className="sister-logos-img" />
          </div>
        </div>
      </section>

      {/* ========== OUR PROJECTS ========== */}
      <section className="projects-tab-section" id="projects">
        <div className="container">
          <div className="animate-section" style={{ textAlign: 'left', paddingBottom: '20px' }}>
            <h2 className="projects-section-title">OUR PROJECTS</h2>
          </div>

          <div className="projects-tab-container animate-section">
            <div className="projects-tabs">
              {projectsList.map((project, i) => (
                <button
                  key={i}
                  className={`project-tab-btn ${activeProjectTab === i ? 'active' : ''}`}
                  onClick={() => setActiveProjectTab(i)}
                >
                  {project.title}
                </button>
              ))}
            </div>

            {projectsList[activeProjectTab] && (
              <div className="project-tab-content">
                <div className="project-tab-desc">
                  <h3 className="project-tab-title">{projectsList[activeProjectTab].title}</h3>
                  <p>{projectsList[activeProjectTab].desc}</p>
                </div>
                <div className="project-tab-gallery-grid">
                  {projectsList[activeProjectTab].images && projectsList[activeProjectTab].images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      className="project-gallery-img"
                      alt={`${projectsList[activeProjectTab].title} Image ${idx + 1}`}
                      onClick={() => setSelectedImage(img)}
                      style={{ cursor: 'pointer' }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========== PARTNERS ========== */}
      <section className="partners-section">
        <div className="container">
          <div className="animate-section text-center">
            <div className="section-badge">Our Network</div>
            <h2 className="section-heading">Our <span className="text-primary">Partners & Clients</span></h2>
          </div>
          <div className="partners-grid animate-section">
            {partnersList.map((partner, i) => (
              <div className="partner-logo-box" key={partner.id || i}>
                <img src={partner.logo_url} alt={partner.name || `Partner ${i + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== COMPANY DOCUMENT ========== */}
      <section className="company-document-section" id="company-document">
        <div className="container">
          
          <div className="doc-card animate-section">
            {/* Background elements */}
            <div className="doc-bg-watermark">
               <svg viewBox="0 0 100 100" className="doc-watermark-svg" opacity="0.03">
                 <path d="M50 0 L55 40 L90 30 L60 50 L80 90 L50 60 L20 90 L40 50 L10 30 L45 40 Z" fill="currentColor"/>
               </svg>
            </div>
            
            {/* Header */}
            <div className="doc-header">
              <h3 className="doc-title">Company Document</h3>
              <div className="doc-logo-ksa">
                <div className="doc-logo-text">
                  <span className="ar">وزارة التجارة</span>
                  <span className="en">Ministry of Commerce</span>
                </div>
                <div className="doc-logo-emblem">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M12 2L15 8L21 6L16 12L19 19L12 15L5 19L8 12L3 6L9 8L12 2Z"/></svg>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="doc-body">
              {/* Left Side: QR Code Area */}
              <div className="doc-qr-area">
                <div className="doc-qr-shape"></div>
                <div className="doc-qr-box">
                  <p className="doc-qr-header-ar">البيانات الأساسية للسجل التجاري</p>
                  <div className="doc-real-qr-wrap">
                    <img src="/qr_code.png" alt="Ministry of Commerce QR Code" className="doc-real-qr" />
                  </div>
                  <p className="doc-qr-number">7034220314</p>
                </div>
              </div>

              {/* Right Side: Text Area */}
              <div className="doc-info-area" dir="rtl">
                <h2 className="doc-ar-title">شهادة السجل التجاري</h2>
                <h3 className="doc-ar-subtitle">شركة بليسلايف المحدودة</h3>
                
                <div className="doc-ar-list">
                  <div className="doc-ar-item">
                    <span className="doc-bullet"></span>
                    <div className="doc-item-text">
                      <span className="doc-label">الرقم الوطني الموحد:</span>
                      <span className="doc-value">7034220314</span>
                    </div>
                  </div>
                  <div className="doc-ar-item">
                    <span className="doc-bullet"></span>
                    <div className="doc-item-text">
                      <span className="doc-label">تاريخ الإصدار:</span>
                      <span className="doc-value">06/06/2023</span>
                    </div>
                  </div>
                  <div className="doc-ar-item">
                    <span className="doc-bullet"></span>
                    <div className="doc-item-text">
                      <span className="doc-label">نوع الكيان:</span>
                      <span className="doc-value">شركة ذات مسؤولية محدودة</span>
                    </div>
                  </div>
                  <div className="doc-ar-item">
                    <span className="doc-bullet"></span>
                    <div className="doc-item-text">
                      <span className="doc-label">صفات الشركة :</span>
                      <span className="doc-value">(شخص واحد)</span>
                    </div>
                  </div>
                  <div className="doc-ar-item">
                    <span className="doc-bullet"></span>
                    <div className="doc-item-text">
                      <span className="doc-label">حالة السجل:</span>
                      <span className="doc-value">نشط</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Bar */}
            <div className="doc-footer">
              <div className="doc-footer-curve"></div>
              <div className="doc-footer-content">
                <div className="doc-footer-left">
                  <div className="doc-socials">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm-1-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm5 7h-2v-3.5c0-.83-.67-1.5-1.5-1.5S10 12.67 10 13.5V17H8v-6h2v1.1c.47-.62 1.15-1.1 2-1.1 1.66 0 3 1.34 3 3V17z"/></svg>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg>
                  </div>
                  <span>mcgovsa</span>
                </div>
                <div className="doc-footer-right">
                  <div className="doc-phone">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    <span>1900</span>
                  </div>
                  <span>mc.gov.sa</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========== GET IN TOUCH / CONTACT ========== */}
      <section className="contact-section" id="get-in-touch">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info animate-section">
              <h2 className="contact-heading">GET IN TOUCH</h2>
              
              <ul className="contact-list">
                <li>
                  <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  <span>{settings.phone}</span>
                </li>
                <li>
                  <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  <span>{settings.email}</span>
                </li>
                <li>
                  <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                  <span>{settings.website}</span>
                </li>
                <li>
                  <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  <span>{settings.address}</span>
                </li>
              </ul>
            </div>
            <div className="contact-image-wrapper animate-section" style={{ backgroundImage: 'url(/contact_bg_image.png)' }}>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="footer" id="contact">
        <div className="container">
          <div className="footer-grid animate-section">
            <div className="footer-col">
              <div className="footer-logo">
                <span className="text-primary">Bless</span>Life
              </div>
              <p className="footer-text">{settings.footer_text}</p>
              <div className="social-icons">
                <a href={settings.linkedin_url || '#'} className="social-icon" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
                <a href={settings.facebook_url || '#'} className="social-icon" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                </a>
                <a href={settings.twitter_url || '#'} className="social-icon" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
              </div>
            </div>

            <div className="footer-col">
              <h4>Quick Links</h4>
              <div className="footer-links">
                <a href="#about">About Us</a>
                <a href="#services">Our Services</a>
                <a href="#projects">Our Projects</a>
                <a href="#why-us">Why Choose Us</a>
                <a href="#contact">Contact Us</a>
              </div>
            </div>

            <div className="footer-col">
              <h4>Our Services</h4>
              <div className="footer-links">
                <a href="#">Construction &amp; Contracting</a>
                <a href="#">Operation &amp; Maintenance</a>
                <a href="#">HR Solutions &amp; Staffing</a>
                <a href="#">Security Systems</a>
                <a href="#">Creative Branding</a>
              </div>
            </div>

            <div className="footer-col">
              <h4>Contact Details</h4>
              <div className="footer-links">
                <a href="#contact">{settings.address}</a>
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
                <a href={`tel:${settings.phone}`}>{settings.phone}</a>
                <a href={settings.website.startsWith('http') ? settings.website : `https://${settings.website}`} target="_blank" rel="noopener noreferrer">{settings.website}</a>
              </div>
              <p className="footer-reg" style={{ marginTop: 16, fontSize: 12, color: 'var(--gray-400)' }}>Reg. No: {settings.reg_number}<br />Registered: {settings.reg_date}</p>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Blesslife Limited. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* ========== IMAGE MODAL ========== */}
      {selectedImage && (
        <div className="image-modal-overlay" onClick={() => setSelectedImage(null)}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="image-modal-close" onClick={() => setSelectedImage(null)}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
            <img src={selectedImage} alt="Gallery Enlarge" className="image-modal-img" />
          </div>
        </div>
      )}
    </>
  );
}
