document.addEventListener('DOMContentLoaded', function() {
  // Mobile navigation toggle
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  
  hamburger.addEventListener('click', function() {
    this.classList.toggle('active');
    navLinks.classList.toggle('active');
    this.setAttribute('aria-expanded', this.classList.contains('active'));
  });

  // Close mobile menu when clicking a link
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Scroll to top button
  const scrollTopBtn = document.querySelector('.scroll-top');
  
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      scrollTopBtn.classList.add('active');
    } else {
      scrollTopBtn.classList.remove('active');
    }
  });

  scrollTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Animation on scroll
  const animateElements = document.querySelectorAll('.animate');
  
  function checkScroll() {
    animateElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementTop < windowHeight - 100) {
        element.classList.add('visible');
      }
    });
  }
  
  // Initial check
  checkScroll();
  
  // Check on scroll
  window.addEventListener('scroll', checkScroll);

  // Touch support for project slider
  const slider = document.querySelector('.projects-slider');
  let isDown = false;
  let startX;
  let scrollLeft;

  slider.addEventListener('mousedown', (e) => {
    isDown = true;
    slider.style.cursor = 'grabbing';
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener('mouseleave', () => {
    isDown = false;
    slider.style.cursor = 'grab';
  });

  slider.addEventListener('mouseup', () => {
    isDown = false;
    slider.style.cursor = 'grab';
  });

  slider.addEventListener('mousemove', (e) => {
    if(!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed
    slider.scrollLeft = scrollLeft - walk;
  });

  // Touch events for mobile
  slider.addEventListener('touchstart', (e) => {
    isDown = true;
    startX = e.touches[0].pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener('touchend', () => {
    isDown = false;
  });

  slider.addEventListener('touchmove', (e) => {
    if(!isDown) return;
    e.preventDefault();
    const x = e.touches[0].pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;
    slider.scrollLeft = scrollLeft - walk;
  });

  // Pause animation when interacting with slider
  slider.addEventListener('mouseenter', () => {
    slider.style.animationPlayState = 'paused';
  });

  slider.addEventListener('mouseleave', () => {
    slider.style.animationPlayState = 'running';
  });

  slider.addEventListener('touchstart', () => {
    slider.style.animationPlayState = 'paused';
  });

  slider.addEventListener('touchend', () => {
    setTimeout(() => {
      slider.style.animationPlayState = 'running';
    }, 1000);
  });
});
// Add this to your existing script.js file
document.addEventListener('DOMContentLoaded', function() {
  // ... existing code ...
  
  // Enhanced Skills Carousel
  const skillsCarousel = document.querySelector('.skills-carousel');
  const skillsTrack = document.querySelector('.skills-track');
  const skillCards = document.querySelectorAll('.skill-card');
  const prevBtn = document.querySelector('.skill-nav-btn.prev');
  const nextBtn = document.querySelector('.skill-nav-btn.next');
  
  let isDragging = false;
  let startPos = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID = 0;
  let currentIndex = 0;
  
  // Add event listeners for navigation buttons
  prevBtn.addEventListener('click', () => {
    currentIndex--;
    if (currentIndex < 0) currentIndex = skillCards.length / 2 - 1;
    setPositionByIndex();
  });
  
  nextBtn.addEventListener('click', () => {
    currentIndex++;
    if (currentIndex >= skillCards.length / 2) currentIndex = 0;
    setPositionByIndex();
  });
  
  // Touch and mouse events for dragging
  skillCards.forEach((card, index) => {
    // Touch events
    card.addEventListener('touchstart', touchStart(index));
    card.addEventListener('touchend', touchEnd);
    card.addEventListener('touchmove', touchMove);
    
    // Mouse events
    card.addEventListener('mousedown', touchStart(index));
    card.addEventListener('mouseup', touchEnd);
    card.addEventListener('mouseleave', touchEnd);
    card.addEventListener('mousemove', touchMove);
  });
  
  // Prevent context menu on drag
  window.oncontextmenu = function(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };
  
  function touchStart(index) {
    return function(event) {
      currentIndex = index;
      startPos = getPositionX(event);
      isDragging = true;
      
      animationID = requestAnimationFrame(animation);
      skillsTrack.classList.add('grabbing');
      skillsTrack.style.animation = 'none';
    };
  }
  
  function touchEnd() {
    isDragging = false;
    cancelAnimationFrame(animationID);
    
    const movedBy = currentTranslate - prevTranslate;
    
    if (movedBy < -100 && currentIndex < skillCards.length - 1) {
      currentIndex++;
    }
    
    if (movedBy > 100 && currentIndex > 0) {
      currentIndex--;
    }
    
    setPositionByIndex();
    skillsTrack.classList.remove('grabbing');
    
    // Reset animation after a delay
    setTimeout(() => {
      skillsTrack.style.animation = 'scrollSkills 40s linear infinite';
    }, 1000);
  }
  
  function touchMove(event) {
    if (isDragging) {
      const currentPosition = getPositionX(event);
      currentTranslate = prevTranslate + currentPosition - startPos;
    }
  }
  
  function getPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
  }
  
  function animation() {
    setSliderPosition();
    if (isDragging) requestAnimationFrame(animation);
  }
  
  function setSliderPosition() {
    skillsTrack.style.transform = `translateX(${currentTranslate}px)`;
  }
  
  function setPositionByIndex() {
    currentTranslate = currentIndex * -skillCards[0].offsetWidth;
    prevTranslate = currentTranslate;
    setSliderPosition();
  }
  
  // Add hover animations
  skillCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-10px) scale(1.05)';
      card.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.15)';
      
      // Add pulse animation to icon
      const icon = card.querySelector('.skill-icon');
      icon.style.animation = 'pulse 1s ease infinite';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
      
      // Remove pulse animation
      const icon = card.querySelector('.skill-icon');
      icon.style.animation = '';
    });
  });
  
  // Add keyframe for pulse animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
  `;
  document.head.appendChild(style);
});
// Add this to your existing script.js file
document.addEventListener('DOMContentLoaded', function() {
  // ... existing code ...
  
  // Certification card animations
  const certificationCards = document.querySelectorAll('.certification-card');
  certificationCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      const icon = card.querySelector('.certification-icon');
      icon.style.transform = 'rotate(10deg) scale(1.1)';
      card.style.boxShadow = '0 10px 30px rgba(108, 99, 255, 0.2)';
    });
    
    card.addEventListener('mouseleave', () => {
      const icon = card.querySelector('.certification-icon');
      icon.style.transform = '';
      card.style.boxShadow = '';
    });
  });
  
  // Achievement card animations
  const achievementCards = document.querySelectorAll('.achievement-card');
  achievementCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      const badge = card.querySelector('.achievement-badge');
      badge.style.transform = 'scale(1.1) rotate(15deg)';
      card.style.boxShadow = '0 10px 30px rgba(108, 99, 255, 0.2)';
    });
    
    card.addEventListener('mouseleave', () => {
      const badge = card.querySelector('.achievement-badge');
      badge.style.transform = '';
      card.style.boxShadow = '';
    });
  });
  
  // Education card animation
  const educationCard = document.querySelector('.education-card');
  if (educationCard) {
    educationCard.addEventListener('mouseenter', () => {
      const icon = educationCard.querySelector('.education-icon');
      icon.style.transform = 'scale(1.1)';
      educationCard.style.boxShadow = '0 10px 30px rgba(108, 99, 255, 0.2)';
    });
    
    educationCard.addEventListener('mouseleave', () => {
      const icon = educationCard.querySelector('.education-icon');
      icon.style.transform = '';
      educationCard.style.boxShadow = '';
    });
  }
  
  // Add floating animation to all cards
  const allCards = document.querySelectorAll('.certification-card, .achievement-card, .education-card');
  allCards.forEach((card, index) => {
    card.style.animation = `floatCard 4s ease-in-out ${index * 0.1}s infinite`;
  });
  
  // Add keyframe for floating animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes floatCard {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
  `;
  document.head.appendChild(style);
});
// Project Modals Functionality
document.addEventListener('DOMContentLoaded', function() {
  const projectCards = document.querySelectorAll('.project-card');
  const modalOverlay = document.getElementById('modal-overlay');
  const modals = document.querySelectorAll('.modal');
  const closeButtons = document.querySelectorAll('.modal-close');
  
  // Open modal when project card is clicked
  projectCards.forEach(card => {
    card.addEventListener('click', function() {
      const projectId = this.getAttribute('data-modal');
      if (projectId) {
        const modal = document.getElementById(projectId);
        modalOverlay.classList.add('active');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });
  
  // Close modal when overlay is clicked
  modalOverlay.addEventListener('click', function() {
    closeAllModals();
  });
  
  // Close modal when close button is clicked
  closeButtons.forEach(button => {
    button.addEventListener('click', function() {
      closeAllModals();
    });
  });
  
  // Close modal when pressing Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });
  
  // Prevent modal from closing when clicking inside
  modals.forEach(modal => {
    modal.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  });
  
  function closeAllModals() {
    modalOverlay.classList.remove('active');
    modals.forEach(modal => {
      modal.classList.remove('active');
    });
    document.body.style.overflow = '';
  }
  
  // Add animation to modal content
  modals.forEach(modal => {
    modal.addEventListener('click', function() {
      const features = this.querySelectorAll('.feature');
      features.forEach((feature, index) => {
        feature.style.transitionDelay = `${index * 0.1}s`;
      });
    });
  });
});
