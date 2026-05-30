/* ═══════════════════════════════════════════════════════════════
   Trà Lá Ổi Landing Page — JavaScript
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initFAQAccordion();
    initVideoPlayer();
    initFloatingCTA();
    initSmoothScroll();
    initOutboundLinkEnhancements();
    initConversionTracking();
    initEngagementTimers();
});

function pushEvent(eventName, payload = {}) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        event: eventName,
        ...payload,
    });
}

/* ─── Scroll Animations (Intersection Observer) ────────────── */
function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');

    if (!elements.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger delay for sibling elements
                    const parent = entry.target.parentElement;
                    const siblings = parent.querySelectorAll('.animate-on-scroll');
                    let delay = 0;

                    siblings.forEach((sibling, i) => {
                        if (sibling === entry.target) {
                            delay = i * 100; // 100ms stagger
                        }
                    });

                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, Math.min(delay, 400)); // Cap at 400ms

                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px',
        }
    );

    elements.forEach((el) => observer.observe(el));
}

/* ─── FAQ Accordion ────────────────────────────────────────── */
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach((item) => {
        const question = item.querySelector('.faq-item__question');

        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('is-open');

            // Close all other items
            faqItems.forEach((other) => {
                if (other !== item) {
                    other.classList.remove('is-open');
                    other.querySelector('.faq-item__question').setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current
            item.classList.toggle('is-open');
            question.setAttribute('aria-expanded', !isOpen);

            if (!isOpen) {
                pushEvent('faq_open', {
                    faq_id: item.id || 'unknown',
                });
            }
        });
    });
}

/* ─── Video Player ─────────────────────────────────────────── */
function initVideoPlayer() {
    const video = document.getElementById('productVideo');
    const playBtn = document.getElementById('videoPlayBtn');

    if (!video || !playBtn) return;

    playBtn.addEventListener('click', () => {
        video.play();
        playBtn.classList.add('hidden');
        pushEvent('video_play_click', { location: 'video_section' });
    });

    video.addEventListener('pause', () => {
        playBtn.classList.remove('hidden');
        pushEvent('video_pause', { current_time: Math.floor(video.currentTime) });
    });

    video.addEventListener('play', () => {
        playBtn.classList.add('hidden');
        pushEvent('video_play', { current_time: Math.floor(video.currentTime) });
    });

    video.addEventListener('ended', () => {
        playBtn.classList.remove('hidden');
        pushEvent('video_complete', { duration: Math.floor(video.duration || 0) });
    });
}

/* ─── Floating CTA (Mobile) ───────────────────────────────── */
function initFloatingCTA() {
    const floatingCta = document.getElementById('floatingCta');
    const hero = document.getElementById('hero');

    if (!floatingCta || !hero) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    floatingCta.classList.add('is-visible');
                } else {
                    floatingCta.classList.remove('is-visible');
                }
            });
        },
        { threshold: 0.1 }
    );

    observer.observe(hero);
}

/* ─── Smooth Scroll for Anchor Links ──────────────────────── */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        });
    });
}

function initConversionTracking() {
    const ctaLinks = document.querySelectorAll('[data-cta]');
    ctaLinks.forEach((link) => {
        link.addEventListener('click', () => {
            pushEvent('cta_click', {
                cta_id: link.getAttribute('data-cta'),
                href: link.getAttribute('href') || '',
            });
        });
    });

    const thresholds = [25, 50, 75, 90];
    const fired = new Set();

    const onScroll = () => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        if (max <= 0) return;
        const pct = Math.round((window.scrollY / max) * 100);

        thresholds.forEach((t) => {
            if (pct >= t && !fired.has(t)) {
                fired.add(t);
                pushEvent('scroll_depth', { percent: t });
            }
        });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
}

function initOutboundLinkEnhancements() {
    const params = new URLSearchParams({
        utm_source: 'tralaoi_online',
        utm_medium: 'landing_page',
        utm_campaign: 'tra_bup_oi',
    });

    document.querySelectorAll('a[href*="s.shopee.vn"]').forEach((link) => {
        try {
            const url = new URL(link.href);
            params.forEach((value, key) => {
                if (!url.searchParams.has(key)) {
                    url.searchParams.set(key, value);
                }
            });
            link.href = url.toString();
        } catch (error) {
            // Ignore invalid URL values in legacy browsers.
        }
    });
}

function initEngagementTimers() {
    const marks = [30, 90];
    marks.forEach((seconds) => {
        setTimeout(() => {
            pushEvent('engagement_time', { seconds });
        }, seconds * 1000);
    });
}

/* ─── Parallax-like Counter Animation (Optional Enhancement) ─ */
function animateCounters() {
    const counters = document.querySelectorAll('[data-counter]');

    counters.forEach((counter) => {
        const target = parseInt(counter.getAttribute('data-counter'), 10);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const update = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString('vi-VN');
                requestAnimationFrame(update);
            } else {
                counter.textContent = target.toLocaleString('vi-VN');
            }
        };

        update();
    });
}
