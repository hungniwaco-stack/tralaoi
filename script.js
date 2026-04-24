/* ═══════════════════════════════════════════════════════════════
   Trà Lá Ổi Landing Page — JavaScript
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initFAQAccordion();
    initVideoPlayer();
    initFloatingCTA();
    initSmoothScroll();
});

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
    });

    video.addEventListener('pause', () => {
        playBtn.classList.remove('hidden');
    });

    video.addEventListener('play', () => {
        playBtn.classList.add('hidden');
    });

    video.addEventListener('ended', () => {
        playBtn.classList.remove('hidden');
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
