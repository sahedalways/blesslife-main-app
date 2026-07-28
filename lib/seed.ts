import pool from './db';
import crypto from 'crypto';

export async function seedDatabase() {
  const conn = await pool.getConnection();
  try {
    // ────────────────────────────────────────────
    // CREATE TABLES
    // ────────────────────────────────────────────

    await conn.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(100) UNIQUE NOT NULL,
        setting_value TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS about (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        image_url VARCHAR(500),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS mission_vision (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type ENUM('mission', 'vision') NOT NULL,
        description TEXT NOT NULL,
        image_url VARCHAR(500),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS chairman (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        title VARCHAR(255),
        message TEXT NOT NULL,
        image_url VARCHAR(500),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS project_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        project_id INT NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        sort_order INT DEFAULT 0,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS partners (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        logo_url VARCHAR(500) NOT NULL,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS notices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        active BOOLEAN DEFAULT TRUE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // ────────────────────────────────────────────
    // SEED DEFAULT DATA (only if tables are empty)
    // ────────────────────────────────────────────

    // Settings
    const [settingsRows] = await conn.query('SELECT COUNT(*) as cnt FROM settings') as any;
    if (settingsRows[0].cnt === 0) {
      const defaultSettings = [
        ['company_name', 'Blesslife Limited'],
        ['logo_url', '/main-logo.png'],
        ['phone', '+966112242650'],
        ['email', 'info@blesslife.com.sa'],
        ['website', 'www.blesslife.com.sa'],
        ['address', 'Flat: 09, Level: 03, Humaidia Building, Al Murabba, Riyadh, KSA'],
        ['facebook_url', '#'],
        ['linkedin_url', '#'],
        ['twitter_url', '#'],
        ['footer_text', 'Blesslife Limited is a multifaceted company providing comprehensive solutions in business consultation, trading, services, construction, HR supply, operations & maintenance. Aligned with Saudi Vision 2030.'],
        ['reg_number', '7034220314'],
        ['reg_date', '06/06/2023'],
      ];
      for (const [key, value] of defaultSettings) {
        await conn.query('INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)', [key, value]);
      }
    }

    // Admin Users
    const [adminRows] = await conn.query('SELECT COUNT(*) as cnt FROM admin_users') as any;
    if (adminRows[0].cnt === 0) {
      const defaultPassword = 'bless@2030';
      const hash = crypto.createHash('sha256').update(defaultPassword).digest('hex');
      await conn.query(
        'INSERT INTO admin_users (username, password_hash) VALUES (?, ?)',
        ['admin', hash]
      );
    }

    // About
    const [aboutRows] = await conn.query('SELECT COUNT(*) as cnt FROM about') as any;
    if (aboutRows[0].cnt === 0) {
      await conn.query(
        'INSERT INTO about (title, description, image_url) VALUES (?, ?, ?)',
        [
          'Blesslife Limited',
          'Blesslife Limited is a multifaceted company providing comprehensive solutions in business consultation, trading, services, construction, HR supply, operations & maintenance. With an unwavering commitment to excellence and client satisfaction, we aim to be the strategic partner for ambitious businesses.',
          '/about_us.png'
        ]
      );
    }

    // Mission & Vision
    const [mvRows] = await conn.query('SELECT COUNT(*) as cnt FROM mission_vision') as any;
    if (mvRows[0].cnt === 0) {
      await conn.query(
        'INSERT INTO mission_vision (type, description, image_url) VALUES (?, ?, ?)',
        [
          'mission',
          'At Blesslife Limited, our mission is to deliver tailored solutions that enhance growth, productivity, and efficiency, enabling businesses to achieve their full potential. We are committed to providing value-added services that help our clients meet and exceed their goals within the competitive business landscape.',
          '/mission.png'
        ]
      );
      await conn.query(
        'INSERT INTO mission_vision (type, description, image_url) VALUES (?, ?, ?)',
        [
          'vision',
          'To be the global leader in providing integrated business solutions, setting the standard for excellence, innovation, and client satisfaction across all industries we serve',
          '/Vission.png'
        ]
      );
    }

    // Chairman
    const [chairmanRows] = await conn.query('SELECT COUNT(*) as cnt FROM chairman') as any;
    if (chairmanRows[0].cnt === 0) {
      await conn.query(
        'INSERT INTO chairman (name, title, message, image_url) VALUES (?, ?, ?, ?)',
        [
          'Ruhul Amin',
          'Chairman',
          'Ruhul Amin, the esteemed Chairman of Blesslife, is renowned for his strategic acumen and extensive industry experience. With a distinguished background in strategic management, he has been instrumental in steering Blesslife towards significant growth and innovation.\n\nHis leadership is marked by a commitment to fostering collaboration, empowering teams, and cultivating a forward-thinking vision. Under his guidance, Blesslife has achieved numerous milestones, establishing itself as a leader in the industry.',
          ''
        ]
      );
    }

    // Projects
    const [projectRows] = await conn.query('SELECT COUNT(*) as cnt FROM projects') as any;
    if (projectRows[0].cnt === 0) {
      const projectsData = [
        {
          title: 'CIVIL WORK',
          desc: 'We deliver comprehensive civil work services, managing every phase from excavation to foundation completion. We ensure precision and adherence to all specified measurements and drawings, guaranteeing high-quality results for every project.',
          images: [
            '/project_Images/p11_civil_work_cover.jpg',
            '/project_Images/p12_01_site_boundary_work.jpg',
            '/project_Images/p12_02_driveway_structure.jpg',
            '/project_Images/p12_03_rail_work_worker.jpg',
            '/project_Images/p12_04_interior_brickwork_small.jpg',
            '/project_Images/p12_05_interior_brickwork_large.jpg',
            '/project_Images/p12_06_drawing_measurement.jpg',
            '/project_Images/p12_07_hardhat_site_worker.jpg',
            '/project_Images/p12_08_rooftop_blockwork.jpg',
            '/project_Images/p13_01_site_supervisors.jpg',
            '/project_Images/p13_02_red_machine_installation.jpg',
            '/project_Images/p13_03_indoor_ladder_work.jpg',
            '/project_Images/p13_04_column_rebar_work.jpg',
            '/project_Images/p13_05_crane_construction_view.jpg',
            '/project_Images/p13_06_concrete_pouring.jpg',
            '/project_Images/p13_07_concrete_floor_machine.jpg',
          ]
        },
        {
          title: 'EXPERT INSTALLATION',
          desc: 'We specialize in installing aluminum, glass, louvers, gritting, cladding, and bullnose systems, including rooftop, wall, and ceiling cladding. Our skilled professionals ensure top-quality results and adhere to the highest industry standards.',
          images: [
            '/project_Images/p14_expert_installation_glass_facade_cover.jpg',
            '/project_Images/p15_01_glass_entrance_installation.jpg',
            '/project_Images/p15_02_rooftop_installation_workers.jpg',
            '/project_Images/p15_03_exterior_glass_building.jpg',
            '/project_Images/p15_04_rooftop_floor_installation.jpg',
            '/project_Images/p15_05_building_facade_glass.jpg',
          ]
        },
        {
          title: 'MASONRY WORK',
          desc: 'We specialize in comprehensive masonry work, including steel fixing, shuttering, carpentry, and concrete. Our projects are overseen by experienced and highly qualified supervisors. Additionally, our workforce consists of skilled professionals dedicated to delivering high-quality results.',
          images: [
            '/project_Images/p16_masonry_work_cover.jpg',
            '/project_Images/p17_01_masonry_mixer_team.jpg',
            '/project_Images/p17_02_scaffolding_and_rebar_left.jpg',
            '/project_Images/p17_03_scaffolding_worker.jpg',
            '/project_Images/p17_04_block_wall_structure.jpg',
            '/project_Images/p17_05_rebar_blockwork_right.jpg',
          ]
        },
        {
          title: 'OPERATIONS & MAINTENANCE',
          desc: "Blesslife's Operations and Maintenance services ensure the efficient and reliable performance of our projects. We employ proactive strategies and industry-leading practices to optimize operations and minimize downtime.",
          images: [
            '/project_Images/p18_operations_maintenance_cover.jpg',
            '/project_Images/p19_01_hand_tools_maintenance.jpg',
            '/project_Images/p19_02_electrical_repair.jpg',
            '/project_Images/p19_03_tool_belt_worker.jpg',
            '/project_Images/p19_04_red_toolbox_maintenance.jpg',
            '/project_Images/p19_05_machine_maintenance_worker.jpg',
            '/project_Images/p19_06_safety_helmet_gloves.jpg',
            '/project_Images/p20_01_industrial_repair_worker.jpg',
            '/project_Images/p20_02_machine_repair_team.jpg',
            '/project_Images/p20_03_worker_on_phone.jpg',
            '/project_Images/p20_04_safety_meeting.jpg',
            '/project_Images/p20_05_factory_staff.jpg',
            '/project_Images/p20_06_equipment_at_night.jpg',
            '/project_Images/p20_07_handshake_safety.jpg',
          ]
        },
        {
          title: 'EXPERT STONE & MARBLE INSTALLATION',
          desc: 'We excel in stone and marble installation, delivering structural integrity with expert welding and precise measurements. Our services encompass both interior wall installations and exterior framing.',
          images: [
            '/project_Images/p21_stone_marble_installation_cover.jpg',
            '/project_Images/p22_01_exterior_panel_building.jpg',
            '/project_Images/p22_02_tall_building_facade.jpg',
            '/project_Images/p22_03_building_facade_crane.jpg',
            '/project_Images/p22_04_ceiling_marble_glass_corner.jpg',
          ]
        },
      ];

      for (let i = 0; i < projectsData.length; i++) {
        const p = projectsData[i];
        const [result] = await conn.query(
          'INSERT INTO projects (title, description, sort_order) VALUES (?, ?, ?)',
          [p.title, p.desc, i]
        ) as any;
        const projectId = result.insertId;
        for (let j = 0; j < p.images.length; j++) {
          await conn.query(
            'INSERT INTO project_images (project_id, image_url, sort_order) VALUES (?, ?, ?)',
            [projectId, p.images[j], j]
          );
        }
      }
    }

    // Partners
    const [partnerRows] = await conn.query('SELECT COUNT(*) as cnt FROM partners') as any;
    if (partnerRows[0].cnt === 0) {
      const partnerLogos = [
        'p23_logo_01.png', 'p23_logo_02.png', 'p23_logo_03.png', 'p23_logo_04.png', 'p23_logo_05.png',
        'p23_logo_06.png', 'p23_logo_07.png', 'p23_logo_08.png', 'p23_logo_09.png', 'p23_logo_10.png',
        'p23_logo_11.png', 'p23_logo_12.png', 'p24_logo_01.png', 'p24_logo_02.png', 'p24_logo_03.png',
        'p24_logo_04.png', 'p24_logo_05.png', 'p24_logo_06.png', 'p24_logo_07.png', 'p24_logo_08.png',
        'p24_logo_09.png', 'p24_logo_10.png', 'p24_logo_11.png', 'p24_logo_12.png', 'p25_logo_01.png',
        'p25_logo_02.png', 'p25_logo_03.png', 'p25_logo_04.png', 'p25_logo_05.png', 'p25_logo_06.png',
        'p25_logo_07.png', 'p25_logo_08.png', 'p25_logo_09.png', 'p25_logo_10.png', 'p25_logo_11.png',
        'p25_logo_12.png', 'p25_logo_13.png', 'p25_logo_14.png', 'p25_logo_15.png', 'p25_logo_16.png',
        'p25_logo_17.png', 'p25_logo_18.png',
      ];
      for (let i = 0; i < partnerLogos.length; i++) {
        await conn.query(
          'INSERT INTO partners (name, logo_url, sort_order) VALUES (?, ?, ?)',
          [`Partner ${i + 1}`, `/Partner_Client_Logos/${partnerLogos[i]}`, i]
        );
      }
    }

    return { success: true, message: 'Database seeded successfully' };
  } catch (error: any) {
    console.error('Seed error:', error);
    return { success: false, message: error.message };
  } finally {
    conn.release();
  }
}
