document.addEventListener('DOMContentLoaded', function() {
  // 1. Initialize Lucide Icons
  lucide.createIcons();

  // 2. Mobile Menu Toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mainNav = document.querySelector('.main-nav');

  // Create overlay backdrop
  const navOverlay = document.createElement('div');
  navOverlay.className = 'nav-overlay';
  document.body.appendChild(navOverlay);

  function openMenu() {
    mainNav.classList.add('active');
    navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mainNav.classList.remove('active');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', function() {
      if (mainNav.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    navOverlay.addEventListener('click', closeMenu);

    // Close menu via the X button inside drawer
    const drawerCloseBtn = document.getElementById('drawer-close-btn');
    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener('click', closeMenu);
    }

    // Close menu when a nav link is clicked
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  // 3. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      // Close other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });
      // Toggle current item
      item.classList.toggle('active');
    });
  });

  // 4. Initialize Swiper for Testimonials
  if (typeof Swiper !== 'undefined') {
    const testimonialSwiper = new Swiper('.testimonial-swiper', {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        }
      },
      navigation: {
        nextEl: '.testimonial-next',
        prevEl: '.testimonial-prev',
      }
    });

    // Optional: Swiper for Attractions if needed on mobile
    if (window.innerWidth <= 768) {
      const attractionSwiper = new Swiper('.attraction-swiper', {
        slidesPerView: 1.2,
        spaceBetween: 20,
      });
    }
  }

  // 5. Initialize Fancybox for Gallery
  if (typeof Fancybox !== 'undefined') {
    Fancybox.bind('[data-fancybox="gallery"]', {
      // Custom options
      infinite: true
    });
  }

  // 6. Sticky Header optimization
  const headerMain = document.querySelector('.header-main');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      headerMain.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
    } else {
      headerMain.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
    }
  });

  // 7. Initialize Room Swipers
  if (typeof Swiper !== 'undefined') {
    const swiperOptions = {
      slidesPerView: 1.2,
      spaceBetween: 20,
      loop: true,
      breakpoints: {
        768: { slidesPerView: 2, spaceBetween: 20 },
        1024: { slidesPerView: 2, spaceBetween: 30 },
        1200: { slidesPerView: 3, spaceBetween: 30 }
      }
    };

    new Swiper('.standard-swiper', {
      ...swiperOptions,
      navigation: { nextEl: '.standard-next', prevEl: '.standard-prev' }
    });

    new Swiper('.family-swiper', {
      ...swiperOptions,
      navigation: { nextEl: '.family-next', prevEl: '.family-prev' }
    });

    new Swiper('.vip-swiper', {
      ...swiperOptions,
      navigation: { nextEl: '.vip-next', prevEl: '.vip-prev' }
    });

    new Swiper('.blog-swiper', {
      slidesPerView: 1.2,
      spaceBetween: 20,
      loop: true,
      breakpoints: {
        768: { slidesPerView: 2, spaceBetween: 20 },
        1024: { slidesPerView: 2, spaceBetween: 24 },
        1200: { slidesPerView: 3, spaceBetween: 30 }
      },
      navigation: { nextEl: '.blog-next', prevEl: '.blog-prev' }
    });

    new Swiper('.social-swiper', {
      slidesPerView: 1.5,
      spaceBetween: 15,
      loop: true,
      breakpoints: {
        576: { slidesPerView: 2.2, spaceBetween: 15 },
        768: { slidesPerView: 3.2, spaceBetween: 20 },
        992: { slidesPerView: 4.2, spaceBetween: 20 },
        1200: { slidesPerView: 5.2, spaceBetween: 20 }
      },
      navigation: { nextEl: '.social-next', prevEl: '.social-prev' }
    });
  }

  // 8. Price Dropdown Toggle
  const priceToggle = document.getElementById('price-dropdown-toggle');
  const priceDropdown = document.getElementById('price-dropdown');
  
  if (priceToggle && priceDropdown) {
    priceToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      priceDropdown.classList.toggle('active');
      priceToggle.classList.toggle('active'); // Changed from 'open' to 'active' for new styling
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!priceDropdown.contains(e.target) && !priceToggle.contains(e.target)) {
        priceDropdown.classList.remove('active');
        priceToggle.classList.remove('active'); // Changed from 'open'
      }
    });

    // Prevent closing when clicking inside slider
    priceDropdown.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // 9. Dual Range Slider Logic
  const priceMin = document.getElementById('price-min');
  const priceMax = document.getElementById('price-max');
  const priceProgress = document.getElementById('price-slider-progress');
  const priceMinDisplay = document.getElementById('price-min-display');
  const priceMaxDisplay = document.getElementById('price-max-display');
  const priceGap = 50000;

  function updateSlider(e) {
    if (!priceMin || !priceMax) return;
    let minVal = parseInt(priceMin.value);
    let maxVal = parseInt(priceMax.value);

    if (maxVal - minVal < priceGap) {
      if (e && e.target && e.target.id === 'price-min') {
        priceMin.value = maxVal - priceGap;
        minVal = maxVal - priceGap;
      } else if (e && e.target && e.target.id === 'price-max') {
        priceMax.value = minVal + priceGap;
        maxVal = minVal + priceGap;
      } else {
        priceMin.value = maxVal - priceGap;
        minVal = maxVal - priceGap;
      }
    }

    const minAttr = parseInt(priceMin.min);
    const maxAttr = parseInt(priceMin.max);
    const range = maxAttr - minAttr;
    
    // Calculate percentages
    const leftPercent = ((minVal - minAttr) / range) * 100;
    const rightPercent = 100 - ((maxVal - minAttr) / range) * 100;

    priceProgress.style.left = leftPercent + '%';
    priceProgress.style.right = rightPercent + '%';

    // Format display
    priceMinDisplay.innerHTML = new Intl.NumberFormat('vi-VN').format(minVal) + 'đ';
    priceMaxDisplay.innerHTML = new Intl.NumberFormat('vi-VN').format(maxVal) + 'đ';

    // Update the dropdown toggle text
    const priceLabel = document.getElementById('price-label');
    if (priceLabel) {
      if (minVal === minAttr && maxVal === maxAttr) {
        priceLabel.innerText = "Chọn giá";
      } else {
        // e.g. "200k - 900k"
        priceLabel.innerText = (minVal/1000) + "k - " + (maxVal/1000) + "k";
      }
    }
  }

  if (priceMin && priceMax) {
    priceMin.addEventListener('input', updateSlider);
    priceMax.addEventListener('input', updateSlider);
    updateSlider(); // Initial update
  }

  // 10. Amenities Highlights Image Changer
  const amenityItems = document.querySelectorAll('.amenity-highlight-item');
  const amenityImg = document.getElementById('amenity-highlight-img');

  if (amenityItems.length > 0 && amenityImg) {
    amenityItems.forEach(item => {
      item.addEventListener('click', function() {
        // Remove active class from all items
        amenityItems.forEach(el => el.classList.remove('active'));
        // Add active class to clicked item
        this.classList.add('active');
        
        // Update image source smoothly
        const newImgSrc = this.getAttribute('data-image');
        if (newImgSrc && amenityImg.src !== newImgSrc) {
            // Fade out
            amenityImg.style.opacity = '0';
            setTimeout(() => {
                amenityImg.src = newImgSrc;
                // Fade back in once src changes
                amenityImg.style.opacity = '1';
            }, 300);
        }
      });
    });
  }
  
  // 11. Customers Swiper (About Us Page)
  if (document.querySelector('.customers-swiper')) {
    new Swiper('.customers-swiper', {
      slidesPerView: 1,
      spaceBetween: 20,
      navigation: {
        nextEl: '.customer-next',
        prevEl: '.customer-prev',
      },
      breakpoints: {
        640: { slidesPerView: 2, spaceBetween: 20 },
        768: { slidesPerView: 3, spaceBetween: 30 },
        1024: { slidesPerView: 4, spaceBetween: 30 }
      }
    });
  }

  // 12. Explore Accordion — Removed (handled inline in gioi-thieu.html)

  // 13. Room Tabs Filtering (Rooms Page)
  const roomTabs = document.querySelectorAll('.room-tab-btn');
  const roomItems = document.querySelectorAll('.room-grid-item');
  
  if (roomTabs.length > 0 && roomItems.length > 0) {
    roomTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Remove active class from all tabs
        roomTabs.forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        tab.classList.add('active');
        
        const filterValue = tab.getAttribute('data-filter');
        
        roomItems.forEach(item => {
          if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
            item.classList.remove('hide');
          } else {
            item.classList.add('hide');
          }
        });
      });
    });
  }

  // 14. Price Slider Logic
  const roomsPriceMin = document.getElementById('rooms-price-min');
  const roomsPriceMax = document.getElementById('rooms-price-max');
  const roomsPriceProgress = document.getElementById('rooms-price-progress');
  const roomsPriceMinDisplay = document.getElementById('rooms-price-min-display');
  const roomsPriceMaxDisplay = document.getElementById('rooms-price-max-display');

  if (roomsPriceMin && roomsPriceMax && roomsPriceProgress) {
    const updateRoomsSlider = () => {
      let minVal = parseInt(roomsPriceMin.value);
      let maxVal = parseInt(roomsPriceMax.value);
      
      if (minVal > maxVal) {
        let tmp = minVal;
        minVal = maxVal;
        maxVal = tmp;
      }
      
      const minPercent = ((minVal - roomsPriceMin.min) / (roomsPriceMin.max - roomsPriceMin.min)) * 100;
      const maxPercent = ((maxVal - roomsPriceMax.min) / (roomsPriceMax.max - roomsPriceMin.min)) * 100;
      
      roomsPriceProgress.style.left = minPercent + '%';
      roomsPriceProgress.style.width = (maxPercent - minPercent) + '%';
      
      if (roomsPriceMinDisplay) roomsPriceMinDisplay.textContent = new Intl.NumberFormat('vi-VN').format(minVal) + ' VND';
      if (roomsPriceMaxDisplay) roomsPriceMaxDisplay.textContent = new Intl.NumberFormat('vi-VN').format(maxVal) + ' VND';
    };
    
    roomsPriceMin.addEventListener('input', updateRoomsSlider);
    roomsPriceMax.addEventListener('input', updateRoomsSlider);
    updateRoomsSlider(); // Init
  }
});

// Room Detail Page Swipers
document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on the room detail page
    if(document.querySelector('.room-main-swiper')) {
        const thumbSwiper = new Swiper('.room-thumb-swiper', {
            spaceBetween: 15,
            slidesPerView: 4,
            freeMode: true,
            watchSlidesProgress: true,
        });
        const mainSwiper = new Swiper('.room-main-swiper', {
            spaceBetween: 10,
            navigation: {
                nextEl: '.room-gallery-next',
                prevEl: '.room-gallery-prev',
            },
            thumbs: {
                swiper: thumbSwiper,
            },
            effect: 'fade',
            fadeEffect: { crossFade: true }
        });
        
        // Similar Rooms Swiper
        const similarSwiper = new Swiper('.similar-swiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            navigation: {
                nextEl: '.similar-next',
                prevEl: '.similar-prev',
            },
            breakpoints: {
                640: { slidesPerView: 2, spaceBetween: 20 },
                768: { slidesPerView: 3, spaceBetween: 30 },
                1024: { slidesPerView: 4, spaceBetween: 30 },
            }
        });
    }
});
