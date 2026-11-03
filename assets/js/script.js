/**
 * THE H CORP - Official JavaScript
 * Brand Tagline: "You Imagine, We Deliver."
 * Theme: Executive Obsidian & Metallic Gold
 * Motion Engine: Powered by Motion (npm: motion)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- Initialize Motion Library ---
  const Motion = window.Motion || null;
  const { animate, scroll, inView, stagger, spring } = Motion || {};
  const hasMotion = !!(animate && scroll && inView && stagger);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Activate 3D Magazine Animation System if supported
  if (hasMotion && !prefersReducedMotion) {
    document.documentElement.classList.add('js-animate');
  }

  // --- Initialize Lenis Smooth Inertia Scroll Engine ---
  let lenis = null;
  if (typeof window.Lenis !== 'undefined' && !prefersReducedMotion) {
    lenis = new window.Lenis({
      duration: 1.25, // Silky luxury inertia glide
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential deceleration
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 1.2,
      smoothTouch: false,
      infinite: false,
    });

    function lenisRaf(time) {
      lenis.raf(time);
      requestAnimationFrame(lenisRaf);
    }
    requestAnimationFrame(lenisRaf);

    window.__lenis = lenis;
  }

  let heroMotionFired = false;

  // --- 0. Luxury Brand Preloader & Swift Logo Reveal ---
  const preloader = document.getElementById('brandPreloader');
  const progressBar = document.getElementById('preloaderProgressBar');
  const skipBtn = document.getElementById('preloaderSkipBtn');
  let preloaderDismissed = false;

  const dismissPreloader = (immediate = false) => {
    if (preloaderDismissed || !preloader) return;
    preloaderDismissed = true;

    // Immediately free up pointer events and remove loading state so scrolling is instant
    preloader.style.pointerEvents = 'none';
    document.body.classList.remove('is-loading');

    if (progressBar) {
      progressBar.style.width = '100%';
    }

    const fadeDuration = immediate ? 0.3 : 0.55;

    const handleDismissComplete = () => {
      preloader.style.display = 'none';
      triggerHeroMotion();
      if (typeof checkVisibleCards === 'function') checkVisibleCards();
      cacheSectionPositions();
      if (lenis) lenis.resize();
    };

    if (hasMotion && !prefersReducedMotion) {
      animate(preloader, {
        opacity: [1, 0],
        transform: ['scale(1)', 'scale(1.04)']
      }, {
        duration: fadeDuration,
        easing: [0.16, 1, 0.3, 1]
      });
      setTimeout(handleDismissComplete, fadeDuration * 1000);
    } else {
      preloader.classList.add('is-hidden');
      setTimeout(handleDismissComplete, 300);
    }
  };

  if (preloader) {
    const urlParams = new URLSearchParams(window.location.search);
    const isPreview = urlParams.get('preview') === 'preloader';
    const skipPreloader = urlParams.get('skip') === '1' || urlParams.get('nopreload') === '1';

    if (skipPreloader) {
      preloader.style.display = 'none';
      document.body.classList.remove('is-loading');
      triggerHeroMotion();
    } else if (prefersReducedMotion && !isPreview) {
      dismissPreloader(true);
    } else {
      // Elegant progress bar animation
      if (progressBar) {
        if (hasMotion && !isPreview) {
          animate(progressBar, 
            { width: ['0%', '45%', '85%', '100%'] }, 
            { duration: 1.0, times: [0, 0.2, 0.65, 1], easing: [0.16, 1, 0.3, 1] }
          );
        } else {
          setTimeout(() => { if (!preloaderDismissed) progressBar.style.width = '45%'; }, 100);
          setTimeout(() => { if (!preloaderDismissed) progressBar.style.width = '85%'; }, 450);
          setTimeout(() => { if (!preloaderDismissed) progressBar.style.width = '100%'; }, 900);
        }
      }

      // Elegant display timer: 1050ms (brief, impactful golden logo impression, then seamless dissolve)
      const duration = isPreview ? 8000 : 1050;
      setTimeout(() => dismissPreloader(false), duration);

      // Instant interactive skip on ANY interaction (wheel, touch scroll, click, key)
      const instantDismiss = () => {
        if (!preloaderDismissed) dismissPreloader(true);
      };

      window.addEventListener('wheel', instantDismiss, { passive: true, once: true });
      window.addEventListener('touchmove', instantDismiss, { passive: true, once: true });
      window.addEventListener('touchstart', instantDismiss, { passive: true, once: true });
      if (skipBtn) skipBtn.addEventListener('click', instantDismiss);
      preloader.addEventListener('click', instantDismiss);
      window.addEventListener('keydown', () => {
        if (!preloaderDismissed) dismissPreloader(true);
      }, { once: true });
    }

    // Auto-scroll helper if query param ?scroll=target is provided
    const scrollTargetParam = urlParams.get('scroll');
    if (scrollTargetParam) {
      setTimeout(() => {
        const targetSelector = scrollTargetParam.startsWith('#') ? scrollTargetParam : `#${scrollTargetParam}`;
        const targetEl = document.querySelector(targetSelector);
        if (targetEl) {
          if (lenis) {
            lenis.scrollTo(targetEl, { offset: -80, duration: 1.2 });
          } else {
            targetEl.scrollIntoView({ behavior: 'auto', block: 'start' });
          }
        }
      }, 150);
    }
  }

  // --- 1. Consolidated High-Performance Scroll Architecture (Lenis + 60/120fps RAF) ---
  const scrollProgressBar = document.getElementById('globalScrollProgress');
  const headerNav = document.querySelector('.header-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], header[id]');
  const glow1 = document.querySelector('.ambient-glow-1');
  const glow2 = document.querySelector('.ambient-glow-2');
  const backToTopBtn = document.querySelector('.back-to-top-btn');

  // Cache Section Dimensions to eliminate Layout Thrashing (zero getBoundingClientRect per scroll frame)
  let cachedSections = [];
  const cacheSectionPositions = () => {
    cachedSections = Array.from(sections).map(sec => {
      const top = sec.offsetTop;
      return {
        id: sec.getAttribute('id'),
        top: top,
        bottom: top + sec.offsetHeight
      };
    });
  };
  cacheSectionPositions();
  window.addEventListener('resize', cacheSectionPositions);

  const onScrollUpdate = (currentScroll, maxScroll) => {
    const scrollY = currentScroll ?? window.scrollY;
    const progress = maxScroll ? (scrollY / maxScroll) : (scrollY / ((document.documentElement.scrollHeight - window.innerHeight) || 1));

    // A. Global Gold Scroll Progress Bar
    if (scrollProgressBar) {
      scrollProgressBar.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
    }

    // B. Header Glass & Sticky State
    if (headerNav) {
      if (scrollY > 45) {
        headerNav.classList.add('scrolled');
      } else {
        headerNav.classList.remove('scrolled');
      }
    }

    // C. Active Navigation Tracking (Cached, zero DOM reflows)
    const probeY = scrollY + 140;
    let activeId = '';
    for (let i = 0; i < cachedSections.length; i++) {
      const s = cachedSections[i];
      if (probeY >= s.top && probeY < s.bottom) {
        activeId = s.id;
        break;
      }
    }
    if (activeId) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`);
      });
    }

    // D. Ambient Glow Subtle Parallax (GPU translate3d)
    if (glow1 && glow2) {
      glow1.style.transform = `translate3d(0, ${progress * 120}px, 0)`;
      glow2.style.transform = `translate3d(0, ${-progress * 100}px, 0)`;
    }

    // E. Back to Top Button Visibility
    if (backToTopBtn) {
      const shouldShow = scrollY > 500;
      const isShown = backToTopBtn.classList.contains('is-active');
      if (shouldShow && !isShown) {
        backToTopBtn.classList.add('is-active');
      } else if (!shouldShow && isShown) {
        backToTopBtn.classList.remove('is-active');
      }
    }
  };

  if (lenis) {
    lenis.on('scroll', (e) => {
      onScrollUpdate(e.scroll, e.limit);
    });
  } else {
    window.addEventListener('scroll', () => {
      onScrollUpdate(window.scrollY, null);
    }, { passive: true });
  }

  // Initial synchronization
  onScrollUpdate(window.scrollY, null);

  // --- 4. Hero Section Motion Orchestration & Harmonic Levitation ---
  function triggerHeroMotion() {
    if (heroMotionFired) return;
    heroMotionFired = true;

    // Reveal elements fallback class
    document.querySelectorAll('.hero-section .reveal-fade-up').forEach(el => {
      el.classList.add('is-visible');
    });

    if (!hasMotion || prefersReducedMotion) return;

    // 1. Badge Slide-Down
    const heroBadge = document.querySelector('.hero-badge');
    if (heroBadge) {
      animate(heroBadge, 
        { opacity: [0, 1], transform: ['translateY(-16px) scale(0.96)', 'translateY(0) scale(1)'] }, 
        { duration: 0.65, easing: [0.16, 1, 0.3, 1] }
      );
    }

    // 2. Headline Upward Reveal
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
      animate(heroTitle, 
        { opacity: [0, 1], transform: ['translateY(28px)', 'translateY(0)'] }, 
        { duration: 0.85, delay: 0.12, easing: [0.16, 1, 0.3, 1] }
      );
    }

    // 3. Supporting Description
    const heroDesc = document.querySelector('.hero-desc');
    if (heroDesc) {
      animate(heroDesc, 
        { opacity: [0, 1], transform: ['translateY(20px)', 'translateY(0)'] }, 
        { duration: 0.75, delay: 0.25, easing: [0.16, 1, 0.3, 1] }
      );
    }

    // 4. Chamfered CTA Buttons (Spring Pop)
    const heroButtons = document.querySelectorAll('.hero-actions > *');
    if (heroButtons.length > 0) {
      animate(heroButtons, 
        { opacity: [0, 1], transform: ['translateY(18px) scale(0.92)', 'translateY(0) scale(1)'] }, 
        { delay: stagger(0.12, { startDelay: 0.38 }), duration: 0.65, easing: [0.34, 1.56, 0.64, 1] }
      );
    }

    // 5. Strategic Pillars Strip
    const pillarItems = document.querySelectorAll('.hero-pillar-item');
    if (pillarItems.length > 0) {
      animate(pillarItems, 
        { opacity: [0, 1], transform: ['translateY(22px)', 'translateY(0)'] }, 
        { delay: stagger(0.1, { startDelay: 0.55 }), duration: 0.7, easing: [0.16, 1, 0.3, 1] }
      );
    }

    // 6. Right Column Floating THE H CORP Emblem (Harmonic Levitation via GPU CSS)
    const heroEmblem = document.querySelector('.emblem-image-holder');
    if (heroEmblem) {
      animate(heroEmblem, 
        { opacity: [0, 1], transform: ['translateY(25px) scale(0.92)', 'translateY(0) scale(1)'] }, 
        { duration: 0.9, delay: 0.15, easing: [0.16, 1, 0.3, 1] }
      );
    }
  }

  // Fallback trigger if preloader was dismissed early or skipped
  if (!preloader) {
    triggerHeroMotion();
  }

  // --- 5. Interactive Magnetic Dynamics on Executive Buttons ---
  const executiveButtons = document.querySelectorAll('.btn-chamfer, .btn-chamfer-secondary');
  if (executiveButtons.length > 0 && !prefersReducedMotion) {
    executiveButtons.forEach(btn => {
      // 3D Subtle Magnetic Cursor Tilt
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        btn.style.transform = `perspective(600px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-2px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });

      btn.addEventListener('mousedown', () => {
        btn.style.transform = 'translateY(1px) scale(0.98)';
      });

      btn.addEventListener('mouseup', () => {
        btn.style.transform = 'translateY(-2px)';
      });
    });
  }

  // --- 6. Luxury Magazine 3D Scroll Unfolding System (Motion inView & Scroll) ---
  const goldLines = document.querySelectorAll('.gold-rule-line');

  if (hasMotion && !prefersReducedMotion) {
    // 6.0 Golden Hairline Reveal on Scroll
    goldLines.forEach(line => {
      inView(line, () => {
        animate(line, { transform: ['scaleX(0)', 'scaleX(1)'] }, { duration: 1.1, easing: [0.16, 1, 0.3, 1] });
      }, { margin: '-40px 0px -40px 0px' });
    });

    // 6.1 Section Heading Reveal
    document.querySelectorAll('.section-heading-wrap').forEach(wrap => {
      inView(wrap, () => {
        const items = wrap.children;
        if (items.length > 0) {
          animate(items, 
            { opacity: [0, 1], transform: ['translateY(24px)', 'translateY(0)'] }, 
            { delay: stagger(0.08), duration: 0.75, easing: [0.16, 1, 0.3, 1] }
          );
        }
      }, { margin: '-60px 0px -60px 0px' });
    });

    // 6.2 Dual-Page Gatefold Spreads (Services Divisions & Contact Columns)
    inView('.magazine-gatefold-left, .magazine-gatefold-right', (gatefold) => {
      gatefold.classList.add('is-unfolded');
    }, { margin: '0px 0px -30px 0px', amount: 'some' });

    // 6.3 Staggered Editorial Magazine Card Groups (Sequential Page Unfolding)
    inView(
      '.service-card, .process-step-card, .why-card, .case-study-card, .testimonial-card, .faq-item',
      (card) => {
        const parent = card.parentElement;
        const siblings = parent ? Array.from(parent.children) : [];
        const idx = siblings.indexOf(card);
        const staggerDelay = (idx >= 0 ? (idx % 3) : 0) * 35;
        setTimeout(() => {
          card.classList.add('is-unfolded');
        }, staggerDelay);
      },
      { margin: '0px 0px -30px 0px', amount: 'some' }
    );

    // Initial viewport check for cards already in view
    const checkVisibleCards = () => {
      const vh = window.innerHeight || 800;
      document.querySelectorAll(
        '.service-card, .process-step-card, .why-card, .case-study-card, .testimonial-card, .faq-item, .magazine-gatefold-left, .magazine-gatefold-right'
      ).forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < vh - 20) {
          el.classList.add('is-unfolded');
        }
      });
    };

    checkVisibleCards();

    // 6.4 General fallback for remaining standalone .reveal-fade-up elements (excluding 3D magazine cards)
    document.querySelectorAll('.reveal-fade-up:not(.service-card):not(.process-step-card):not(.why-card):not(.case-study-card):not(.testimonial-card):not(.faq-item)').forEach(el => {
      inView(el, () => {
        animate(el, 
          { opacity: [0, 1], transform: ['translateY(20px)', 'translateY(0)'] }, 
          { duration: 0.6, easing: [0.16, 1, 0.3, 1] }
        );
      }, { margin: '-40px 0px -40px 0px' });
    });

  } else {
    // Fallback if motion is absent or user prefers reduced motion
    document.querySelectorAll('.reveal-fade-up').forEach(el => el.classList.add('is-visible'));
    goldLines.forEach(line => line.classList.add('is-revealed'));
    document.querySelectorAll(
      '.service-card, .process-step-card, .why-card, .case-study-card, .testimonial-card, .faq-item, .magazine-gatefold-left, .magazine-gatefold-right'
    ).forEach(el => el.classList.add('is-unfolded'));
  }

  // --- 7. Responsive Mobile Drawer Navigation ---
  const navHamburger = document.querySelector('.nav-hamburger');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const drawerBackdrop = document.querySelector('.drawer-backdrop');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-drawer .btn-chamfer');

  const openDrawer = () => {
    navHamburger.classList.add('is-active');
    mobileDrawer.classList.add('is-open');
    drawerBackdrop.classList.add('is-active');
    navHamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();

    if (hasMotion && !prefersReducedMotion) {
      const drawerLinks = mobileDrawer.querySelectorAll('.mobile-drawer-header, .mobile-nav-link, .drawer-contact-item, .mobile-drawer-footer');
      animate(drawerLinks, 
        { opacity: [0, 1], transform: ['translateX(20px)', 'translateX(0)'] }, 
        { delay: stagger(0.04, { startDelay: 0.1 }), duration: 0.35, easing: [0.16, 1, 0.3, 1] }
      );
    }
  };

  const closeDrawer = () => {
    navHamburger.classList.remove('is-active');
    mobileDrawer.classList.remove('is-open');
    drawerBackdrop.classList.remove('is-active');
    navHamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (lenis) lenis.start();
  };

  if (navHamburger && mobileDrawer && drawerBackdrop) {
    navHamburger.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('is-open');
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    const drawerCloseBtn = document.getElementById('mobileDrawerClose');
    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener('click', closeDrawer);
    }

    drawerBackdrop.addEventListener('click', closeDrawer);

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', closeDrawer);
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('is-open')) {
        closeDrawer();
      }
    });
  }

  // --- 8. Smooth Anchor Scrolling with Lenis & Header Offset ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = headerNav ? headerNav.offsetHeight : 80;

        if (mobileDrawer && mobileDrawer.classList.contains('is-open')) {
          closeDrawer();
        }

        if (lenis) {
          lenis.scrollTo(targetEl, {
            offset: -headerHeight,
            duration: 1.25,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
          });
        } else {
          const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          window.scrollTo({
            top: targetPosition,
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
          });
        }
      }
    });
  });

  // --- 9. Services Filter Tabs with Motion ---
  const serviceTabBtns = document.querySelectorAll('.service-tab-btn');
  const serviceDivisionSections = document.querySelectorAll('.services-division-group');

  if (serviceTabBtns.length > 0) {
    serviceTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetCategory = btn.getAttribute('data-service-filter');

        serviceTabBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        serviceDivisionSections.forEach(section => {
          const sectionCategory = section.getAttribute('data-category');
          const isMatch = (targetCategory === 'all' || sectionCategory === targetCategory);

          if (isMatch) {
            section.style.display = 'block';
            section.classList.add('is-unfolded');
            const cards = section.querySelectorAll('.service-card');
            cards.forEach((card, idx) => {
              card.classList.remove('is-unfolded');
              setTimeout(() => card.classList.add('is-unfolded'), idx * 45);
            });
            if (hasMotion && !prefersReducedMotion) {
              animate(cards, 
                { opacity: [0, 1] }, 
                { delay: stagger(0.04), duration: 0.45, easing: [0.16, 1, 0.3, 1] }
              );
            } else {
              section.style.opacity = '1';
            }
          } else {
            section.style.display = 'none';
          }
        });

        // Recalculate dimensions for Lenis and active section tracker
        if (lenis) {
          setTimeout(() => {
            lenis.resize();
            cacheSectionPositions();
          }, 120);
        } else {
          cacheSectionPositions();
        }
      });
    });
  }

  // --- 10. Auto-populate Contact Form on Service "Inquire" Click ---
  const serviceInquireLinks = document.querySelectorAll('.service-inquire-link');
  const serviceSelect = document.getElementById('consultationService');

  serviceInquireLinks.forEach(link => {
    link.addEventListener('click', () => {
      const selectedService = link.getAttribute('data-service-name');
      if (serviceSelect && selectedService) {
        serviceSelect.value = selectedService;
        if (hasMotion && !prefersReducedMotion) {
          animate(serviceSelect, 
            { transform: ['scale(1)', 'scale(1.025)', 'scale(1)'] }, 
            { duration: 0.4, easing: 'easeOut' }
          );
        }
      }
    });
  });

  // --- 11. Case Studies Filter Bar with Motion ---
  const portfolioFilterBtns = document.querySelectorAll('.portfolio-filter-btn');
  const caseStudyCards = document.querySelectorAll('.case-study-card');

  if (portfolioFilterBtns.length > 0) {
    portfolioFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filterValue = btn.getAttribute('data-filter');

        portfolioFilterBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        const matchedCards = [];
        caseStudyCards.forEach((card, idx) => {
          const cardCategory = card.getAttribute('data-category');
          if (filterValue === 'all' || cardCategory === filterValue) {
            card.style.display = 'flex';
            card.classList.remove('is-unfolded');
            setTimeout(() => card.classList.add('is-unfolded'), idx * 50);
            matchedCards.push(card);
          } else {
            card.style.display = 'none';
          }
        });

        if (hasMotion && !prefersReducedMotion && matchedCards.length > 0) {
          animate(matchedCards, 
            { opacity: [0, 1] }, 
            { delay: stagger(0.05), duration: 0.45, easing: [0.16, 1, 0.3, 1] }
          );
        }
      });
    });
  }

  // --- 12. FAQ Accordion Interaction with Motion Height Animation ---
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    const panel = item.querySelector('.faq-answer-panel');

    if (btn && panel) {
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');

        // Close other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('is-open')) {
            otherItem.classList.remove('is-open');
            otherItem.querySelector('.faq-question-btn').setAttribute('aria-expanded', 'false');
            const otherPanel = otherItem.querySelector('.faq-answer-panel');
            if (hasMotion && !prefersReducedMotion) {
              const a = animate(otherPanel, 
                { height: [otherPanel.offsetHeight + 'px', '0px'], opacity: [1, 0] }, 
                { duration: 0.25, easing: [0.16, 1, 0.3, 1] }
              );
              if (a && typeof a.then === 'function') {
                a.then(() => { otherPanel.style.maxHeight = null; });
              } else {
                setTimeout(() => { otherPanel.style.maxHeight = null; }, 260);
              }
            } else {
              otherPanel.style.maxHeight = null;
            }
          }
        });

        if (isOpen) {
          item.classList.remove('is-open');
          btn.setAttribute('aria-expanded', 'false');
          if (hasMotion && !prefersReducedMotion) {
            const a = animate(panel, 
              { height: [panel.offsetHeight + 'px', '0px'], opacity: [1, 0] }, 
              { duration: 0.25, easing: [0.16, 1, 0.3, 1] }
            );
            if (a && typeof a.then === 'function') {
              a.then(() => { panel.style.maxHeight = null; });
            } else {
              setTimeout(() => { panel.style.maxHeight = null; }, 260);
            }
          } else {
            panel.style.maxHeight = null;
          }
        } else {
          item.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
          const targetHeight = panel.scrollHeight;
          if (hasMotion && !prefersReducedMotion) {
            const a = animate(panel, 
              { height: ['0px', targetHeight + 'px'], opacity: [0, 1] }, 
              { duration: 0.35, easing: [0.16, 1, 0.3, 1] }
            );
            if (a && typeof a.then === 'function') {
              a.then(() => { panel.style.maxHeight = 'none'; });
            } else {
              setTimeout(() => { panel.style.maxHeight = 'none'; }, 360);
            }
          } else {
            panel.style.maxHeight = targetHeight + 'px';
          }
        }
      });
    }
  });

  // --- 13. Contact & Consultation Form Handling with Motion Spring Feedback ---
  const contactForm = document.getElementById('consultationForm');
  const feedbackMsg = document.getElementById('formFeedbackMessage');

  if (contactForm && feedbackMsg) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Processing Request...</span>`;

      setTimeout(() => {
        const clientName = document.getElementById('clientName')?.value || 'Client';
        const serviceChosen = document.getElementById('consultationService')?.value || 'General Inquiry';

        feedbackMsg.innerHTML = `
          <strong>Consultation Request Received.</strong><br>
          Thank you, ${clientName}. Your inquiry regarding <em>${serviceChosen}</em> has been securely registered. Our dedicated corporate team will review your specifications and contact you shortly.
        `;
        feedbackMsg.classList.add('is-visible');

        if (hasMotion && !prefersReducedMotion) {
          animate(feedbackMsg, 
            { opacity: [0, 1], transform: ['translateY(16px) scale(0.96)', 'translateY(0) scale(1)'] }, 
            { duration: 0.5, easing: [0.34, 1.56, 0.64, 1] }
          );
        }

        contactForm.reset();

        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Request Submitted Successfully</span>`;

        setTimeout(() => {
          submitBtn.innerHTML = originalBtnText;
        }, 4000);

        feedbackMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 1200);
    });
  }

  // --- 14. Back to Top Button ---
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      if (lenis) {
        lenis.scrollTo(0, {
          duration: 1.25,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      } else {
        window.scrollTo({
          top: 0,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
      }
    });
  }

  // --- 15. Privacy Policy & Terms Modal Logic with Motion Pop ---
  const modalOverlay = document.querySelector('.modal-overlay');
  const modalWindow = document.querySelector('.modal-window');
  const modalCloseBtn = document.querySelector('.modal-close-btn');
  const modalTriggers = document.querySelectorAll('.open-legal-modal');
  const modalTitle = document.querySelector('.modal-title');
  const modalBody = document.querySelector('.modal-body');

  const legalContent = {
    privacy: {
      title: 'Privacy Policy — THE H CORP',
      body: `
        <h4>1. Commitment to Data Confidentiality</h4>
        <p>THE H CORP respects client confidentiality as a paramount fiduciary duty. All project specifications, commercial architectures, source code, accounting ledgers, and proprietary trade workflows shared with us remain strictly confidential.</p>
        
        <h4>2. Collection of Corporate Information</h4>
        <p>We collect essential operational details (such as contact information, company registration parameters, and technical scope documents) solely for executing requested business, technology, accounting, and legal facilitation services.</p>
        
        <h4>3. Non-Disclosure & Security Safeguards</h4>
        <p>We deploy robust enterprise cybersecurity controls, multi-factor authentication, and encrypted data channels. We will never sell, lease, or monetize client data with external marketers or unvetted third parties.</p>

        <h4>4. Regulatory & Statutory Disclosures</h4>
        <p>Data transmitted for statutory compliance (such as GST returns, MCA filings, or trademark applications) is communicated strictly through authorized government portals in coordination with client consent and qualified professionals.</p>
      `
    },
    terms: {
      title: 'Terms of Engagement — THE H CORP',
      body: `
        <h4>1. Multi-Disciplinary Service Scope</h4>
        <p>THE H CORP provides integrated business facilitation services covering technology engineering, digital development, accounting coordination, and corporate legal support.</p>
        
        <h4>2. Professional Standards & Regulatory Integrity</h4>
        <p>All software engineering and cybersecurity services are delivered strictly within authorized, legitimate client scopes. In our Business, CA & Legal division, THE H CORP facilitates compliance workflows, documentation preparation, and operational support, coordinating directly with certified practicing Chartered Accountants and licensed advocates where statutory representation or formal certifications are required by Indian law.</p>

        <h4>3. Client Transparency & Honest Engagement</h4>
        <p>We do not make fictitious claims or guarantee uncontrollable outcomes, such as guaranteed top search engine rankings or absolute zero-day software invulnerability. We deliver verifiable, high-standard execution aligned with industry benchmarks.</p>

        <h4>4. Intellectual Property Rights</h4>
        <p>Upon receipt of agreed project milestones and full settlement, all custom source code, brand assets, and delivered documentation become the exclusive intellectual property of the client, unless otherwise stipulated in a signed Master Services Agreement (MSA).</p>
      `
    }
  };

  const openModal = (type) => {
    if (!modalOverlay || !modalTitle || !modalBody) return;
    const content = legalContent[type] || legalContent.privacy;
    modalTitle.textContent = content.title;
    modalBody.innerHTML = content.body;
    modalOverlay.classList.add('is-active');
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();

    if (modalWindow && hasMotion && !prefersReducedMotion) {
      animate(modalWindow, 
        { opacity: [0, 1], transform: ['scale(0.92) translateY(20px)', 'scale(1) translateY(0)'] }, 
        { duration: 0.4, easing: [0.34, 1.56, 0.64, 1] }
      );
    }
  };

  const closeModal = () => {
    if (!modalOverlay) return;
    if (lenis) lenis.start();

    if (modalWindow && hasMotion && !prefersReducedMotion) {
      const a = animate(modalWindow, 
        { opacity: [1, 0], transform: ['scale(1) translateY(0)', 'scale(0.92) translateY(16px)'] }, 
        { duration: 0.25, easing: [0.16, 1, 0.3, 1] }
      );
      const finishClose = () => {
        modalOverlay.classList.remove('is-active');
        document.body.style.overflow = '';
      };
      if (a && typeof a.then === 'function') {
        a.then(finishClose);
      } else {
        setTimeout(finishClose, 260);
      }
    } else {
      modalOverlay.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  };

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const type = trigger.getAttribute('data-modal-type') || 'privacy';
      openModal(type);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('is-active')) {
      closeModal();
    }
  });

});
