/* ==========================================================================
   ID FLORIST - INTERACTIVE USER EXPERIENCE LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. Navigation Scroll Effect & Active Highlighting
  // ==========================================
  const header = document.querySelector('header');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links a');
  
  const handleScroll = () => {
    // Header background change
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Active link highlighting on scroll
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120; // offset for navbar height
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  };
  
  window.addEventListener('scroll', handleScroll);
  
  // ==========================================
  // 2. Mobile Menu Toggle
  // ==========================================
  const burger = document.querySelector('.burger');
  const navMenu = document.querySelector('.nav-links');
  
  if (burger && navMenu) {
    burger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      // Hamburger animation effect
      burger.classList.toggle('toggle');
      const spans = burger.querySelectorAll('span');
      if (burger.classList.contains('toggle')) {
        spans[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });
    
    // Close menu when clicking link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        burger.classList.remove('toggle');
        const spans = burger.querySelectorAll('span');
        spans.forEach(span => span.style.transform = 'none');
        spans[1].style.opacity = '1';
      });
    });
  }
  
  // ==========================================
  // 3. Category Filter for Product Gallery
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active button class
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filterValue = btn.getAttribute('data-filter');
      
      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.classList.remove('hide');
          // Simple visual pop animation
          item.style.transform = 'scale(0.85)';
          item.style.opacity = '0';
          setTimeout(() => {
            item.style.transform = 'scale(1)';
            item.style.opacity = '1';
          }, 50);
        } else {
          item.classList.add('hide');
        }
      });
      
      // Reset active lightbox lists based on visible items
      updateLightboxList();
    });
  });
  
  // ==========================================
  // 4. Lightbox Modal (For Gallery & Price Catalog)
  // ==========================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  const lightboxPrev = lightbox.querySelector('.lightbox-prev');
  const lightboxNext = lightbox.querySelector('.lightbox-next');
  
  let currentImageIndex = 0;
  let activeImageList = []; // List of image nodes currently viewable in the gallery
  
  const updateLightboxList = () => {
    activeImageList = Array.from(galleryItems).filter(item => !item.classList.contains('hide'));
  };
  
  // Initialize image list
  updateLightboxList();
  
  const openLightbox = (imgSrc, imgAlt, isCatalog = false) => {
    lightboxImg.src = imgSrc;
    lightboxCaption.textContent = imgAlt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Disable page scrolling
    
    if (isCatalog) {
      lightboxPrev.style.display = 'none';
      lightboxNext.style.display = 'none';
    } else {
      lightboxPrev.style.display = 'flex';
      lightboxNext.style.display = 'flex';
    }
  };
  
  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto'; // Enable page scrolling
  };
  
  const navigateLightbox = (direction) => {
    if (activeImageList.length <= 1) return;
    
    currentImageIndex += direction;
    if (currentImageIndex >= activeImageList.length) currentImageIndex = 0;
    if (currentImageIndex < 0) currentImageIndex = activeImageList.length - 1;
    
    const nextItem = activeImageList[currentImageIndex];
    const imgNode = nextItem.querySelector('img');
    const title = nextItem.querySelector('.gallery-title').textContent;
    
    // Smooth transition between slides
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
      lightboxImg.src = imgNode.src;
      lightboxCaption.textContent = title;
      lightboxImg.style.opacity = '1';
    }, 150);
  };
  
  // Attach click listeners to gallery items
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      const imgNode = item.querySelector('img');
      const title = item.querySelector('.gallery-title').textContent;
      
      // Find exact index of clicked item in the active (filtered) list
      currentImageIndex = activeImageList.indexOf(item);
      openLightbox(imgNode.src, title, false);
    });
  });
  
  // Attach click listener to pricing banner catalog
  const catalogBanner = document.querySelector('.pricing-banner-img');
  if (catalogBanner) {
    catalogBanner.addEventListener('click', () => {
      const imgNode = catalogBanner.querySelector('img');
      openLightbox(imgNode.src, "Katalog Lengkap Bunga Buket & Dekorasi ID Florist", true);
    });
  }
  
  // Close triggers
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
      closeLightbox();
    }
  });
  
  // Navigation triggers
  if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    navigateLightbox(-1);
  });
  if (lightboxNext) lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    navigateLightbox(1);
  });
  
  // Keyboard triggers
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeLightbox();
    
    // Only navigate if it's not the single catalog view
    const isCatalog = lightboxPrev.style.display === 'none';
    if (!isCatalog) {
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    }
  });
  
  // ==========================================
  // 5. Scroll Animations (Timeline and Sections)
  // ==========================================
  const scrollAnimItems = document.querySelectorAll('.timeline-item, .service-card, .about-img-item');
  
  const checkScrollReveal = () => {
    const triggerBottom = window.innerHeight * 0.85;
    
    scrollAnimItems.forEach(item => {
      const itemTop = item.getBoundingClientRect().top;
      if (itemTop < triggerBottom) {
        item.classList.add('show');
      }
    });
  };
  
  // Initial check and link to scroll listener
  checkScrollReveal();
  window.addEventListener('scroll', checkScrollReveal);
});
