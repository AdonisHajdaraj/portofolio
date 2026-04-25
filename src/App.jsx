import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

// ============================================
// CV DATA
// ============================================
const cvData = {
  personal: {
    fullName: 'Adonis Hajdaraj',
    title: 'B.Sc. Computer Science and Engineering',
    email: 'hajdarajadonis24@gmail.com',
    phone: '+383 43 969 447',
    location: 'Drenas, Kosovo',
    linkedin: 'https://www.linkedin.com/in/adonis-hajdaraj-8859b32a0/',
    github: 'https://github.com/AdonisHajdaraj',
    about: 'I am a passionate developer focused on frontend, backend, and full-stack development. I have completed my Bachelor\'s degree in Computer Science at UBT and I am currently pursuing my Master\'s studies in the same field. Throughout my academic journey and practical projects, I have built functional and secure applications using technologies such as Node.js, Express, React.js, React Native, Next.js, MySQL, and MongoDB. In these projects, I have implemented JWT authentication, role management, well-structured APIs, correct database relationships, as well as online payment methods. I am highly committed, always eager to learn new technologies, and motivated to solve real-world problems through efficient software solutions. My goal is to contribute to a professional team where I can continue growing as a developer and deliver high-quality results.',
  },
  education: [
    {
      degree: 'Master in Computer Science',
      school: 'University for Business and Technology - UBT',
      period: '2024 - 2026',
      description: 'Current student pursuing advanced studies in software engineering and computer science.'
    },
    {
      degree: 'Bachelor Degree in Computer Science and Engineering',
      school: 'University for Business and Technology - UBT',
      period: '2021 - 2024',
      description: 'Foundation in computer science, algorithms, data structures, software engineering and web technologies.'
    }
  ],
  skills: {
    frontend: ['HTML', 'CSS', 'Bootstrap', 'JavaScript', 'React.js', 'Next.js'],
    backend: ['PHP', 'Node.js', 'Java'],
    database: ['MySQL', 'MongoDB'],
    cms: ['WordPress'],
    design: ['Photoshop', 'Illustrator', 'Figma', 'Canva']
  },
  experience: [
    {
      role: 'Full-Stack Internship',
      company: 'Tectigon Academy',
      period: '2024',
      description: 'Gained practical experience in full-stack web development, working with modern technologies and real-world projects.',
      achievements: []
    },
    {
      role: 'Freelance Developer',
      company: 'Self-Employed',
      period: '2022 - Present',
      description: 'Developed multiple web applications and systems including Hotel Management System, E-Commerce Platform, School Management System, and various other projects.',
      achievements: [
        'Hotel System Management Project',
        'Ecommerce System Management Project',
        'Fast Food Website Project',
        'Database Design Project',
        'Figma Website Project',
        'Job Portal Project',
        'Fast Food Mobile App Project'
      ]
    }
  ],
  certifications: [
    { title: 'Java & Spring Boot', org: 'Probit Academy' },
    { title: 'Full Stack Development', org: 'Arra Academy' },
    { title: 'React.js Development', org: 'Techtion Academy' }
  ],
  languages: [
    { language: 'Albanian', level: 'Native' },
    { language: 'English', level: 'Professional' },
    { language: 'German', level: 'Basic' }
  ]
};

// ============================================
// CV COMPONENT
// ============================================
function CvDocument() {
  return (
    <div className="cv-document" id="cv-print">
      <div className="cv-header">
        <h1 className="cv-name">{cvData.personal.fullName}</h1>
        <h2 className="cv-title">{cvData.personal.title}</h2>
      </div>

      <div className="cv-main-grid">
        <div className="cv-left-column">
          <div className="cv-section">
            <h3 className="cv-section-title">CONTACT</h3>
            <div className="cv-contact-info">
              <p>{cvData.personal.phone}</p>
              <p>{cvData.personal.email}</p>
              <p>{cvData.personal.location}</p>
            </div>
          </div>

          <div className="cv-section">
            <h3 className="cv-section-title">SKILLS</h3>
            {Object.entries(cvData.skills).map(([category, items]) => (
              <div key={category} className="cv-skill-line">
                <span className="cv-skill-cat">{category.charAt(0).toUpperCase() + category.slice(1)}:</span>
                <span className="cv-skill-items">{items.join(', ')}</span>
              </div>
            ))}
          </div>

          <div className="cv-section">
            <h3 className="cv-section-title">EDUCATION</h3>
            {cvData.education.map((edu, idx) => (
              <div key={idx} className="cv-edu-item">
                <p className="cv-edu-degree">{edu.degree}</p>
                <p className="cv-edu-school">{edu.school}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="cv-right-column">
          <div className="cv-section">
            <h3 className="cv-section-title">ABOUT ME</h3>
            <p className="cv-about-text">{cvData.personal.about}</p>
          </div>

          <div className="cv-section">
            <h3 className="cv-section-title">EXPERIENCE</h3>
            {cvData.experience.map((exp, idx) => (
              <div key={idx} className="cv-exp-item">
                <p className="cv-exp-title">{exp.role} - {exp.company}</p>
                <p className="cv-exp-desc">{exp.description}</p>
                {exp.achievements.length > 0 && (
                  <ul className="cv-exp-list">
                    {exp.achievements.map((ach, i) => (
                      <li key={i}>{ach}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <div className="cv-section">
            <h3 className="cv-section-title">TRAININGS</h3>
            {cvData.certifications.map((cert, idx) => (
              <p key={idx} className="cv-cert-line">
                {cert.org} - {cert.title}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// 3D COMPONENTS
// ============================================

function TechGlobe({ position, scale, color }) {
  const meshRef = useRef();
  const wireframeRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.2;
    meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.2;
    wireframeRef.current.rotation.y = t * 0.15;
    wireframeRef.current.rotation.x = Math.sin(t * 0.3) * 0.2;
  });
  
  return (
    <group position={position} scale={scale}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhysicalMaterial 
          color={color}
          metalness={0.1}
          roughness={0.2}
          clearcoat={0.5}
          clearcoatRoughness={0.1}
          envMapIntensity={1.5}
        />
      </mesh>
      <mesh ref={wireframeRef}>
        <sphereGeometry args={[1.05, 32, 32]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.15} />
      </mesh>
      <OrbitingRing radius={1.4} speed={0.8} color={color} />
      <OrbitingRing radius={1.6} speed={-0.5} color={color} rotation={[Math.PI / 2, 0, 0]} />
    </group>
  );
}

function OrbitingRing({ radius, speed, color, rotation = [0, 0, 0] }) {
  const ringRef = useRef();
  
  useFrame((state) => {
    ringRef.current.rotation.z += speed * 0.01;
    ringRef.current.rotation.x += speed * 0.005;
  });
  
  return (
    <mesh ref={ringRef} rotation={rotation}>
      <torusGeometry args={[radius, 0.02, 16, 100]} />
      <meshBasicMaterial color={color} transparent opacity={0.6} />
    </mesh>
  );
}

function Crystal({ position, color, speed }) {
  const meshRef = useRef();
  const geom = useMemo(() => new THREE.IcosahedronGeometry(0.4, 1), []);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = t * speed * 0.5;
    meshRef.current.rotation.y = t * speed * 0.7;
    meshRef.current.rotation.z = t * speed * 0.3;
    meshRef.current.position.y = position[1] + Math.sin(t * speed * 1.5) * 1.5;
    meshRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.1);
  });
  
  return (
    <mesh ref={meshRef} position={position} geometry={geom}>
      <meshPhysicalMaterial 
        color={color}
        metalness={0.1}
        roughness={0.1}
        clearcoat={1}
        clearcoatRoughness={0.1}
        envMapIntensity={2}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

function ParticleNetwork() {
  const count = 500;
  const pointsRef = useRef();
  
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const colorPalette = [
      new THREE.Color('#6366f1'),
      new THREE.Color('#06b6d4'),
      new THREE.Color('#8b5cf6'),
      new THREE.Color('#ec4899'),
    ];
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 15;
      pos[i3 + 1] = (Math.random() - 0.5) * 10;
      pos[i3 + 2] = (Math.random() - 0.5) * 15;
      
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      col[i3] = color.r;
      col[i3 + 1] = color.g;
      col[i3 + 2] = color.b;
    }
    return [pos, col];
  }, []);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime() * 0.1;
    pointsRef.current.rotation.y = t * 0.3;
    pointsRef.current.rotation.x = Math.sin(t) * 0.1;
  });
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} vertexColors sizeAttenuation transparent opacity={0.8} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function LightBeams() {
  const beamsRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    beamsRef.current.rotation.z = t * 0.1;
    beamsRef.current.position.y = Math.sin(t * 0.5) * 2;
  });
  
  return (
    <group ref={beamsRef}>
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} rotation={[0, (Math.PI * 2 * i) / 6, Math.PI / 4]} position={[0, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 8, 8]} />
          <meshBasicMaterial color={`hsl(${i * 60}, 80%, 60%)`} transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function DataStream({ position, color, length = 5 }) {
  const streamRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    streamRef.current.position.y = position[1] + Math.sin(t * 2 + position[0]) * 1;
    streamRef.current.rotation.z = t * 0.5;
  });
  
  return (
    <group ref={streamRef} position={position}>
      {Array.from({ length: length }).map((_, i) => (
        <mesh key={i} position={[0, i * 0.3, 0]}>
          <boxGeometry args={[0.3, 0.05, 0.02]} />
          <meshBasicMaterial color={color} transparent opacity={1 - i * 0.15} />
        </mesh>
      ))}
    </group>
  );
}

function Scene3D() {
  return (
    <div className="scene-3d-container">
      <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={60} />
        <ambientLight intensity={0.3} />
        <spotLight position={[10, 10, 10]} intensity={1} angle={0.3} penumbra={0.5} />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#6366f1" />
        <pointLight position={[5, 5, 5]} intensity={0.5} color="#06b6d4" />
        
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
        
        <TechGlobe position={[-4, 1.5, -3]} scale={0.8} color="#6366f1" />
        <TechGlobe position={[4, -1, -4]} scale={0.6} color="#06b6d4" />
        
        <Crystal position={[-2, -1.5, -2]} color="#8b5cf6" speed={0.7} />
        <Crystal position={[3, 2, -3]} color="#ec4899" speed={0.9} />
        <Crystal position={[0, 3, -4]} color="#f59e0b" speed={0.6} />
        
        <ParticleNetwork />
        <LightBeams />
        
        <DataStream position={[-5, 0, -2]} color="#6366f1" length={5} />
        <DataStream position={[5, 1, -3]} color="#06b6d4" length={4} />
        <DataStream position={[0, -2, -4]} color="#8b5cf6" length={3} />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.2}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  );
}

function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const handleMouse = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };
    
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);
    
    window.addEventListener('mousemove', handleMouse);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    
    const handleHoverStart = () => setIsHovering(true);
    const handleHoverEnd = () => setIsHovering(false);
    
    const observer = new MutationObserver(() => {
      document.querySelectorAll('a, button, .skill-tag, .mini-project-card, .channel-item, .project-image-container').forEach(el => {
        el.addEventListener('mouseenter', handleHoverStart);
        el.addEventListener('mouseleave', handleHoverEnd);
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    document.querySelectorAll('a, button, .skill-tag, .mini-project-card, .channel-item, .project-image-container').forEach(el => {
      el.addEventListener('mouseenter', handleHoverStart);
      el.addEventListener('mouseleave', handleHoverEnd);
    });
    
    return () => {
      window.removeEventListener('mousemove', handleMouse);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      observer.disconnect();
    };
  }, [isVisible]);
  
  return (
    <>
      <motion.div 
        className="cursor-dot"
        animate={{ 
          x: position.x - 4, 
          y: position.y - 4,
          opacity: isVisible ? 1 : 0,
          scale: isHovering ? 1.5 : 1
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.5 }}
      />
      <motion.div 
        className={`cursor-ring ${isHovering ? 'hover' : ''}`}
        animate={{ 
          x: position.x - 20, 
          y: position.y - 20,
          opacity: isVisible ? 1 : 0
        }}
        transition={{ type: 'spring', stiffness: 250, damping: 20, mass: 0.8 }}
      />
    </>
  );
}

function SmoothNav() {
  const [activeSection, setActiveSection] = useState('home');
  
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      let current = 'home';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 300;
        if (window.scrollY >= sectionTop) {
          current = section.getAttribute('id');
        }
      });
      
      setActiveSection(current);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollTo = (e, sectionId) => {
    e.preventDefault();
    const element = document.querySelector(`#${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  const sections = ['home', 'about', 'skills', 'projects', 'certificates', 'contact'];
  
  return (
    <nav className="smooth-nav">
      {sections.map(section => (
        <motion.a
          key={section}
          href={`#${section}`}
          className={`nav-dot ${activeSection === section ? 'active' : ''}`}
          onClick={(e) => scrollTo(e, section)}
          title={section.charAt(0).toUpperCase() + section.slice(1)}
          whileHover={{ scale: 1.3 }}
          whileTap={{ scale: 0.8 }}
        />
      ))}
    </nav>
  );
}

// ============================================
// MAIN APP COMPONENT
// ============================================

function App() {
  const [cvModal, setCvModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sectionNav, setSectionNav] = useState('home');
  const mainRef = useRef(null);
  
  const { scrollYProgress } = useScroll();
  const progressBar = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.reveal').forEach(el => {
        gsap.fromTo(el, 
          { opacity: 0, y: 100 },
          { 
            opacity: 1, y: 0, 
            duration: 1.2, 
            ease: 'power4.out',
            scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
          }
        );
      });

      gsap.utils.toArray('.reveal-left').forEach(el => {
        gsap.fromTo(el,
          { opacity: 0, x: -100 },
          { opacity: 1, x: 0, duration: 1.2, ease: 'power4.out',
            scrollTrigger: { trigger: el, start: 'top 85%' } }
        );
      });

      gsap.utils.toArray('.reveal-right').forEach(el => {
        gsap.fromTo(el,
          { opacity: 0, x: 100 },
          { opacity: 1, x: 0, duration: 1.2, ease: 'power4.out',
            scrollTrigger: { trigger: el, start: 'top 85%' } }
        );
      });
    }, mainRef);

    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      sections.forEach(section => {
        const top = section.offsetTop - 200;
        if (window.scrollY >= top) setSectionNav(section.id);
      });
    };
    window.addEventListener('scroll', handleScroll);

    const handleKey = (e) => {
      if (cvModal && e.key === 'Escape') {
        closeCvModal();
      }
    };
    document.addEventListener('keydown', handleKey);

    return () => {
      ctx.revert();
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('keydown', handleKey);
    };
  }, [cvModal]);

  const openCvModal = () => {
    setCvModal(true);
    document.body.style.overflow = 'hidden';
  };
  
  const closeCvModal = () => {
    setCvModal(false);
    document.body.style.overflow = '';
  };

  const handlePrintCV = () => {
    const printContent = document.getElementById('cv-print');
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Adonis Hajdaraj - CV</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; background: white; color: #1a1a2e; padding: 0; }
            .cv-document { max-width: 100%; }
            .cv-header { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 30px 40px; text-align: center; }
            .cv-name { font-size: 2.2rem; font-weight: 800; letter-spacing: 3px; }
            .cv-title { font-size: 1rem; font-weight: 400; opacity: 0.9; margin-top: 5px; }
            .cv-main-grid { display: grid; grid-template-columns: 1fr 2fr; }
            .cv-left-column { background: #f8fafc; padding: 30px 25px; border-right: 1px solid #e2e8f0; }
            .cv-right-column { padding: 30px 25px; }
            .cv-section { margin-bottom: 20px; }
            .cv-section-title { font-size: 0.85rem; text-transform: uppercase; letter-spacing: 2px; color: #6366f1; margin-bottom: 10px; font-weight: 700; border-bottom: 2px solid #6366f1; padding-bottom: 3px; }
            .cv-contact-info p { font-size: 0.8rem; color: #475569; margin-bottom: 3px; }
            .cv-skill-line { font-size: 0.78rem; margin-bottom: 4px; color: #334155; }
            .cv-skill-cat { font-weight: 600; }
            .cv-skill-items { color: #64748b; }
            .cv-edu-item { margin-bottom: 8px; }
            .cv-edu-degree { font-weight: 600; font-size: 0.82rem; color: #1e293b; }
            .cv-edu-school { font-size: 0.75rem; color: #64748b; }
            .cv-about-text { font-size: 0.82rem; color: #475569; line-height: 1.5; text-align: justify; }
            .cv-exp-item { margin-bottom: 12px; }
            .cv-exp-title { font-weight: 600; font-size: 0.85rem; color: #1e293b; margin-bottom: 4px; }
            .cv-exp-desc { font-size: 0.78rem; color: #475569; line-height: 1.4; }
            .cv-exp-list { list-style: disc; padding-left: 18px; margin-top: 5px; }
            .cv-exp-list li { font-size: 0.75rem; color: #64748b; margin-bottom: 2px; }
            .cv-cert-line { font-size: 0.8rem; color: #475569; margin-bottom: 3px; }
            @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } @page { margin: 0; } }
          </style>
        </head>
        <body>${printContent.outerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  };

  // Main projects - private
  const mainProjects = [
    {
      id: 'hotel', 
      icon: '🏨', 
      title: 'Hotel Management System',
      subtitle: 'Full-Stack Web Application',
      description: 'A comprehensive hotel management platform with role-based access, real-time booking system, employee scheduling, and integrated payment processing.',
      tech: ['React.js', 'Node.js', 'Express.js', 'MySQL', 'Bootstrap', 'JWT Auth', 'REST API'],
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
      features: ['Multi-role dashboard (Admin, Staff, Guest)', 'Real-time room booking & availability', 'Employee scheduling & payroll', 'Payment processing & invoicing', 'Advanced analytics & reporting']
    },
    {
      id: 'ecommerce', 
      icon: '🛒', 
      title: 'E-Commerce Platform',
      subtitle: 'Full-Stack Marketplace',
      description: 'Enterprise-grade e-commerce solution featuring payment integration, real-time inventory management, advanced search with filtering, and comprehensive admin dashboard.',
      tech: ['React.js', 'Node.js', 'MongoDB', 'MySQL', 'Express.js', 'Stripe API', 'Redux'],
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
      features: ['Payment integration', 'Real-time inventory tracking', 'Advanced search & filtering', 'Order management system', 'Sales analytics dashboard']
    },
    {
      id: 'smis', 
      icon: '🏫', 
      title: 'School Management System',
      subtitle: 'Educational Administration Platform',
      description: 'Complete school information management system handling student enrollment, grade management, attendance tracking, curriculum planning, and parent communication portal.',
      tech: ['React.js', 'Node.js', 'MySQL', 'Express.js', 'Chart.js', 'PDF Generation'],
      image: 'https://images.unsplash.com/photo-1523050854058-8df90910b683?w=800&q=80',
      features: ['Student enrollment & records', 'Grade & attendance tracking', 'Curriculum & class scheduling', 'Parent-teacher communication', 'Automated report generation']
    },
    {
      id: 'spital', 
      icon: '🏥', 
      title: 'Healthcare UX Design',
      subtitle: 'Figma UI/UX Project',
      description: 'Comprehensive healthcare platform design featuring patient portals, appointment scheduling interfaces, telemedicine screens, and medical records management.',
      tech: ['Figma', 'UI/UX Design', 'Prototyping', 'Design Systems', 'User Research'],
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
      features: ['Patient portal & appointment booking', 'Telemedicine consultation interface', 'Medical records management', 'Doctor & staff dashboards', 'Accessibility-first design']
    }
  ];

  // Deployed projects
  const deployedProjects = [
    {
      id: 'fustane',
      icon: '👗',
      title: 'E-Commerce System for Dresses',
      subtitle: 'Full-Stack E-Commerce with Admin Panel',
      description: 'A complete e-commerce platform specialized for dress/fashion retail with a powerful admin panel. Features product management, order processing, customer management, inventory tracking, and analytics dashboard.',
      tech: ['React.js', 'Node.js', 'MongoDB', 'Express.js', 'Admin Panel', 'Payment Integration'],
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80',
      features: ['Complete product management system', 'Advanced admin dashboard', 'Order processing & tracking', 'Customer management', 'Inventory & stock management'],
      liveUrl: 'https://thebrand-teo.vercel.app/'
    },
    {
      id: 'caffe',
      icon: '☕',
      title: 'Erta Coffee & Sweets',
      subtitle: 'Premium Coffee Shop Website',
      description: 'A beautiful, modern website for a premium coffee shop featuring product showcase, menu display, customer reviews, online ordering system, and a warm, inviting design that reflects the coffee house atmosphere.',
      tech: ['React.js', 'CSS3', 'JavaScript', 'Responsive Design', 'UI/UX', 'Vercel'],
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80',
      features: ['Beautiful product showcase', 'Online ordering system', 'Customer reviews section', 'Responsive mobile-first design', 'Coffee menu & pricing'],
      liveUrl: 'https://erta-caffe.vercel.app/'
    }
  ];

  const certificates = [
    { icon: '☕', title: 'Java & Spring Boot', org: 'Probit Academy' },
    { icon: '🎓', title: 'Full Stack Development', org: 'Arra Academy' },
    { icon: '⚛️', title: 'React.js Development', org: 'Techtion Academy' },
    { icon: '📱', title: 'WordPress & Digital Marketing', org: 'Arra Academy' },
    { icon: '🧩', title: 'Problem Solving', org: 'Techtion Academy' },
    { icon: '⚡', title: 'Software Engineering', org: 'UBT Certification' }
  ];

  const skills = [
    { category: 'Frontend', icon: '🎯', items: ['HTML', 'CSS', 'Bootstrap', 'JavaScript', 'React.js', 'Next.js'], color: '#6366f1' },
    { category: 'Backend', icon: '⚙️', items: ['PHP', 'Node.js', 'Java', 'Express.js', 'Spring Boot', 'REST API'], color: '#06b6d4' },
    { category: 'Database', icon: '🗄️', items: ['MySQL', 'MongoDB', 'PostgreSQL', 'Firebase', 'Redis', 'Prisma ORM'], color: '#8b5cf6' },
    { category: 'CMS & Tools', icon: '🛠️', items: ['WordPress', 'Git', 'Docker', 'AWS', 'Vercel', 'CI/CD', 'Linux'], color: '#ec4899' },
    { category: 'Design', icon: '🎨', items: ['Photoshop', 'Illustrator', 'Figma', 'Canva', 'Adobe XD', 'UI/UX'], color: '#f59e0b' },
    { category: 'Other', icon: '🚀', items: ['JWT Auth', 'Stripe API', 'Agile/Scrum', 'SEO', 'WebSocket', 'React Native'], color: '#10b981' }
  ];

  return (
    <div className="app-futuristic" ref={mainRef}>
      <CustomCursor />
      <SmoothNav />
      
      <motion.div className="progress-bar" style={{ scaleX: progressBar, transformOrigin: 'left' }} />

      {/* Navigation */}
      <motion.nav 
        className="nav-futuristic"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <div className="nav-inner">
          <motion.a href="#home" className="nav-logo" whileHover={{ scale: 1.1 }}>
            <span className="logo-icon">⚡</span>
            <span className="logo-text">ADONIS</span>
          </motion.a>
          
          <div className="nav-links-desktop">
            {['about', 'skills', 'projects', 'certificates', 'contact'].map(link => (
              <motion.a 
                key={link} 
                href={`#${link}`}
                className={`nav-link-future ${sectionNav === link ? 'active' : ''}`}
                whileHover={{ y: -2 }}
              >
                {link.charAt(0).toUpperCase() + link.slice(1)}
                {sectionNav === link && <motion.div className="nav-active-dot" layoutId="activeDot" />}
              </motion.a>
            ))}
          </div>

          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <div className={`hamburger ${menuOpen ? 'open' : ''}`}>
              <span></span><span></span><span></span>
            </div>
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            className="mobile-menu"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
          >
            {['home', 'about', 'skills', 'projects', 'certificates', 'contact'].map(link => (
              <motion.a 
                key={link} 
                href={`#${link}`} 
                onClick={() => setMenuOpen(false)}
                whileHover={{ x: 10, color: '#6366f1' }}
              >
                {link.toUpperCase()}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="home" className="hero-futuristic">
        <Scene3D />
        <div className="hero-overlay">
          <motion.div 
            className="hero-content-main"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <motion.div 
              className="hero-avatar-main"
              animate={{ 
                boxShadow: [
                  '0 0 50px rgba(99,102,241,0.3)', 
                  '0 0 100px rgba(6,182,212,0.5)', 
                  '0 0 50px rgba(99,102,241,0.3)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span>👨‍💻</span>
            </motion.div>
            
            <motion.p 
              className="hero-greeting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Hello, I'm
            </motion.p>
            
            <h1 className="hero-name-glow">
              <motion.span
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, type: 'spring' }}
              >
                ADONIS
              </motion.span>{' '}
              <motion.span
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4, type: 'spring' }}
              >
                HAJDARAJ
              </motion.span>
            </h1>
            
            <motion.div 
              className="hero-typing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
            >
              <span className="typing-text">Full-Stack Developer</span>
              <span className="typing-separator">|</span>
              <span className="typing-text">UI/UX Designer</span>
              <span className="typing-separator">|</span>
              <span className="typing-text">Computer Science Engineer</span>
            </motion.div>

            <motion.p 
              className="hero-tagline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              Crafting digital experiences that push boundaries
            </motion.p>

            <motion.div 
              className="hero-actions"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2 }}
            >
              <motion.button 
                className="btn-neon btn-neon-primary"
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(99,102,241,0.6)' }}
                whileTap={{ scale: 0.95 }}
                onClick={openCvModal}
              >
                <span>📄</span> View CV
              </motion.button>
              <motion.button 
                className="btn-neon btn-neon-outline"
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(6,182,212,0.4)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.querySelector('#projects').scrollIntoView({ behavior: 'smooth' })}
              >
                <span>🚀</span> My Work
              </motion.button>
            </motion.div>

            <motion.div 
              className="hero-scroll-indicator"
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span>Scroll to explore</span>
              <div className="scroll-line"></div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section-future about-section">
        <div className="container">
          <motion.h2 className="section-title-future reveal">
            <span className="title-accent">01.</span> About Me
          </motion.h2>
          
          <div className="about-grid">
            <motion.div className="about-visual reveal-left">
              <div className="about-3d-card">
                <div className="card-rotate">
                  <div className="card-face front">
                    <span className="card-emoji">💻</span>
                    <h3>Developer</h3>
                  </div>
                  <div className="card-face back">
                    <span className="card-emoji">🎓</span>
                    <h3>CS Engineer</h3>
                  </div>
                  <div className="card-face right">
                    <span className="card-emoji">🎨</span>
                    <h3>Designer</h3>
                  </div>
                  <div className="card-face left">
                    <span className="card-emoji">🚀</span>
                    <h3>Innovator</h3>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div className="about-content-future reveal-right">
              <div className="glass-panel">
                <p className="about-lead">
                  Passionate <span className="gradient-text">Full-Stack Developer</span> with a keen eye for design and a drive for innovation.
                </p>
                <p>
                  I am a passionate developer focused on frontend, backend, and full-stack development. 
                  I have completed my Bachelor's degree in Computer Science at UBT and I am currently 
                  pursuing my Master's studies in the same field.
                </p>
                <div className="about-stats">
                  <div className="stat-item">
                    <span className="stat-number gradient-text">10+</span>
                    <span className="stat-label">Projects</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number gradient-text">6</span>
                    <span className="stat-label">Certificates</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number gradient-text">3+</span>
                    <span className="stat-label">Years Coding</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="section-future skills-section">
        <div className="container">
          <motion.h2 className="section-title-future reveal">
            <span className="title-accent">02.</span> Skills & Arsenal
          </motion.h2>
          
          <div className="skills-grid">
            {skills.map((skill, idx) => (
              <motion.div 
                key={skill.category} 
                className="skill-cluster reveal"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="skill-header" style={{'--skill-color': skill.color}}>
                  <span className="skill-emoji">{skill.icon}</span>
                  <h3>{skill.category}</h3>
                </div>
                <div className="skill-tags">
                  {skill.items.map(item => (
                    <motion.span 
                      key={item} 
                      className="skill-tag"
                      whileHover={{ scale: 1.1, backgroundColor: skill.color, color: 'white', boxShadow: `0 0 20px ${skill.color}40` }}
                    >
                      {item}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="section-future projects-section">
        <div className="container">
          <motion.h2 className="section-title-future reveal">
            <span className="title-accent">03.</span> Featured Projects
          </motion.h2>
          
          {/* Deployed Projects - First */}
          {deployedProjects.map((project, idx) => (
            <motion.div 
              key={project.id} 
              className="project-showcase reveal"
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15 }}
              viewport={{ once: true }}
            >
              <div className="project-layout">
                <motion.div 
                  className="project-image-container"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="project-image"
                    loading="lazy"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80'; }}
                  />
                  <div className="project-image-overlay">
                    <div className="overlay-links">
                      <motion.a 
                        href={project.liveUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="overlay-link deployed"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <span>🚀</span> Live Demo
                      </motion.a>
                    </div>
                  </div>
                </motion.div>

                <div className="project-content">
                  <div className="showcase-header">
                    <span className="project-icon">{project.icon}</span>
                    <div>
                      <h3 className="project-title-glow">{project.title}</h3>
                      <p className="project-subtitle">{project.subtitle}</p>
                    </div>
                  </div>
                  
                  <div className="project-details">
                    <p className="project-description">{project.description}</p>
                    
                    <div className="project-features">
                      <h4>Key Features</h4>
                      <ul>
                        {project.features.map((feature, i) => (
                          <motion.li 
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <span className="feature-marker">▹</span> {feature}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="tech-stack">
                      {project.tech.map(t => (
                        <span key={t} className="tech-badge">{t}</span>
                      ))}
                    </div>
                    
                    <div className="project-actions">
                      <motion.a 
                        href={project.liveUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn-neon btn-neon-primary btn-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>🚀</span> View Live Demo
                      </motion.a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Private Projects */}
          {mainProjects.map((project, idx) => (
            <motion.div 
              key={project.id} 
              className="project-showcase reveal"
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: (idx + 2) * 0.15 }}
              viewport={{ once: true }}
            >
              <div className="project-layout">
                <motion.div 
                  className="project-image-container"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="project-image"
                    loading="lazy"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80'; }}
                  />
                  <div className="project-image-overlay">
                    <span className="overlay-text">Private Project</span>
                  </div>
                </motion.div>

                <div className="project-content">
                  <div className="showcase-header">
                    <span className="project-icon">{project.icon}</span>
                    <div>
                      <h3 className="project-title-glow">{project.title}</h3>
                      <p className="project-subtitle">{project.subtitle}</p>
                    </div>
                  </div>
                  
                  <div className="project-details">
                    <p className="project-description">{project.description}</p>
                    
                    <div className="project-features">
                      <h4>Key Features</h4>
                      <ul>
                        {project.features.map((feature, i) => (
                          <motion.li 
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <span className="feature-marker">▹</span> {feature}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="tech-stack">
                      {project.tech.map(t => (
                        <span key={t} className="tech-badge">{t}</span>
                      ))}
                    </div>
                    
                    <div className="project-status">
                      <span className="status-badge">🔒 Private Repository</span>
                      <span className="status-badge">💼 Personal Project</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Certificates Section */}
      <section id="certificates" className="section-future certs-section">
        <div className="container">
          <motion.h2 className="section-title-future reveal">
            <span className="title-accent">04.</span> Certifications & Trainings
          </motion.h2>
          
          <div className="certs-grid">
            {certificates.map((cert, idx) => (
              <motion.div 
                key={idx} 
                className="cert-card-future reveal"
                whileHover={{ rotateY: 10, scale: 1.05 }}
                transition={{ type: 'spring' }}
              >
                <span className="cert-icon">{cert.icon}</span>
                <h4>{cert.title}</h4>
                <p>{cert.org}</p>
                <div className="cert-shine"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-future contact-section">
        <div className="container">
          <motion.h2 className="section-title-future reveal">
            <span className="title-accent">05.</span> Get In Touch
          </motion.h2>
          
          <motion.div className="contact-wrapper reveal">
            <div className="contact-card-main">
              <h3>Let's Create Something Amazing</h3>
              <p>I'm always open to new opportunities and collaborations.</p>
              
              <div className="contact-channels">
                <motion.a href="tel:+38343969447" className="channel-item" whileHover={{ scale: 1.05 }}>
                  <span className="channel-icon">📞</span>
                  <div><strong>Phone</strong><p>+383 43 969 447</p></div>
                </motion.a>
                <motion.a href="mailto:hajdarajadonis24@gmail.com" className="channel-item" whileHover={{ scale: 1.05 }}>
                  <span className="channel-icon">✉️</span>
                  <div><strong>Email</strong><p>hajdarajadonis24@gmail.com</p></div>
                </motion.a>
                <motion.a href="https://github.com/AdonisHajdaraj" target="_blank" rel="noopener noreferrer" className="channel-item" whileHover={{ scale: 1.05 }}>
                  <span className="channel-icon">🐙</span>
                  <div><strong>GitHub</strong><p>AdonisHajdaraj</p></div>
                </motion.a>
                <motion.a href="https://www.linkedin.com/in/adonis-hajdaraj-8859b32a0/" target="_blank" rel="noopener noreferrer" className="channel-item" whileHover={{ scale: 1.05 }}>
                  <span className="channel-icon">💼</span>
                  <div><strong>LinkedIn</strong><p>Adonis Hajdaraj</p></div>
                </motion.a>
              </div>
              
              <div className="location-badge">
                <span>📍</span> Drenas, Kosovo
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-future">
        <div className="footer-content">
          <motion.div className="footer-logo" whileHover={{ scale: 1.1 }}>⚡ ADONIS</motion.div>
          <p>Designed & Built with ❤️</p>
          <p className="copyright">© {new Date().getFullYear()} All rights reserved</p>
        </div>
      </footer>

      {/* CV Modal */}
      <AnimatePresence>
        {cvModal && (
          <motion.div 
            className="modal-overlay cv-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCvModal}
          >
            <motion.div 
              className="cv-modal-content"
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="cv-modal-header">
                <button className="modal-close" onClick={closeCvModal}>✕</button>
                <motion.button 
                  className="btn-neon btn-neon-primary btn-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePrintCV}
                >
                  <span>📥</span> Download / Print CV
                </motion.button>
              </div>
              <div className="cv-modal-body">
                <CvDocument />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;