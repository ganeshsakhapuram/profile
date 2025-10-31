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
  let isScrolling = false;

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
    isScrolling = true;
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
    // Reset scrolling flag after a short delay
    setTimeout(() => {
      isScrolling = false;
    }, 100);
  });

  slider.addEventListener('touchmove', (e) => {
    if(!isDown) return;
    e.preventDefault();
    isScrolling = true;
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

  // NEW: Project card click/tap functionality
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', function(e) {
      // Only open project if user wasn't scrolling
      if (!isScrolling) {
        const modalId = this.getAttribute('data-modal');
        openProjectModal(modalId);
      }
    });
  });

  // Function to open project modal
  function openProjectModal(modalId) {
    // For now, we'll just open the GitHub link
    // In a real implementation, you might want to show a modal with more details
    const githubLink = document.querySelector(`[data-modal="${modalId}"] .project-links a`);
    if (githubLink) {
      window.open(githubLink.href, '_blank');
    }
  }

  // Reset scrolling flag on mouseup/touchend
  document.addEventListener('mouseup', () => {
    setTimeout(() => {
      isScrolling = false;
    }, 100);
  });
});