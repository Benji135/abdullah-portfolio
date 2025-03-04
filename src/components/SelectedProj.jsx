import React, { useEffect, useRef, useState } from 'react';
import './style/SelectedProj.css';
import Popup from './popup';
import ProjectScreen from './projectScreen';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function SelectedProj() {
  const [isScreenVisible, setScreenVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false); // State to track screen size
  const projectScreenRef = useRef(null);

  const popupRef = useRef(null);
  const projectContRef = useRef(null);
  const imgRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const projectRefs = useRef([]);
  const mousePos = useRef({ x: 900, y: 500 });
  const speed = 0.1;

  // Function to check screen size
  const checkScreenSize = () => {
    setIsSmallScreen(window.innerWidth <= 768); // Set to true if screen width is <= 768px
  };

  useEffect(() => {
    checkScreenSize(); // Check screen size on initial render
    window.addEventListener('resize', checkScreenSize); // Update on resize

    return () => {
      window.removeEventListener('resize', checkScreenSize); // Cleanup
    };
  }, []);

  const showProjectScreen = (title, event) => {
    setSelectedProject(title);
    setScreenVisible(true);

    const clickX = event.clientX;
    const clickY = event.clientY;

    gsap.fromTo(
      projectScreenRef.current,
      { clipPath: `circle(0% at ${clickX}px ${clickY}px)` },
      { clipPath: 'circle(150% at 50% 50%)', duration: 3, ease: 'power3.out' }
    );
  };

  const hideProjectScreen = () => {
    gsap.to(projectScreenRef.current, {
      clipPath: 'circle(0% at 50% 50%)',
      duration: 0.5,
      ease: 'power3.out',
      onComplete: () => setScreenVisible(false),
    });
  };

  useEffect(() => {
    if (isSmallScreen) return; // Skip GSAP hover effect for small screens

    const projectCont = projectContRef.current;
    const popup = popupRef.current;

    const showPopup = () => {
      popup.style.display = 'flex';
      setTimeout(() => {
        popup.style.transform = 'scale(1)';
      }, 300);
    };

    const hidePopup = () => {
      popup.style.transform = 'scale(0)';
      setTimeout(() => {
        popup.style.display = 'none';
      }, 300);
    };

    const updateMousePosition = (e) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
    };

    const animatePopup = () => {
      const targetX = mousePos.current.x - popup.offsetWidth / 2;
      const targetY = mousePos.current.y - popup.offsetHeight / 2;

      const currentX = parseFloat(popup.style.left) || 0;
      const currentY = parseFloat(popup.style.top) || 0;

      popup.style.left = `${currentX + (targetX - currentX) * speed}px`;
      popup.style.top = `${currentY + (targetY - currentY) * speed}px`;

      requestAnimationFrame(animatePopup);
    };

    animatePopup();

    projectCont.addEventListener('mousemove', updateMousePosition);

    const handleMouseEnter = (index) => {
      imgRefs.forEach((imgRef, idx) => {
        imgRef.current.style.transform = `translateY(${(idx - index) * 100}%)`;
      });
    };

    projectRefs.current.forEach((project, index) => {
      if (project) {
        project.addEventListener('mouseenter', () => handleMouseEnter(index));
      }
    });

    projectCont.addEventListener('mouseenter', showPopup);
    projectCont.addEventListener('mouseleave', hidePopup);

    return () => {
      projectCont.removeEventListener('mousemove', updateMousePosition);
      projectCont.removeEventListener('mouseenter', showPopup);
      projectCont.removeEventListener('mouseleave', hidePopup);
      projectRefs.current.forEach((project, index) => {
        if (project) {
          project.removeEventListener('mouseenter', () => handleMouseEnter(index));
        }
      });
    };
  }, [isSmallScreen]); // Re-run effect when isSmallScreen changes

  return (
    <div className='project-bg' id='projects'>
      {isScreenVisible && (
        <ProjectScreen
          ref={projectScreenRef}
          selectedProject={selectedProject}
          onClose={hideProjectScreen}
        />
      )}

      {!isSmallScreen && <Popup ref={popupRef} imgRefs={imgRefs} />}

      <h2>Selected Projects</h2>

      <div className='project-cont' ref={projectContRef}>
        {['Maze Escape', 'Machine Learning', 'Online Store App', 'Portfolio'].map((title, index) => (
          <div className='proj69' ref={(el) => (projectRefs.current[index] = el)} key={index}>
            {isSmallScreen && (
              <img src="./assets/game.png" alt={title} className="project-image" />
            )}
            <div className='project' onClick={(e) => showProjectScreen(title, e)}>
              <div className='project-name'>
                <p className='nump'>{`0${index + 1}`}</p>
                <h1>{title}</h1>
              </div>
              <div className='categories'>
                <p className='descp'>{getCategory(title)}</p>
              </div>
            </div>
            <hr className='line' />
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper function to determine category based on project title
function getCategory(title) {
  switch (title) {
    case 'Maze Escape':
      return 'Python Development';
    case 'Machine Learning':
      return 'Python Development / Data Science';
    case 'Online Store App':
      return 'Python Development / Design';
    case 'Portfolio':
      return 'Frontend Development';
    default:
      return '';
  }
}

export default SelectedProj;
