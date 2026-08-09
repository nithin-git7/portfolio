import {
    animate,
    hover,
    inView,
    press,
    scroll,
    stagger
} from 'https://cdn.jsdelivr.net/npm/motion@12.42.2/+esm';

const ready = document.readyState === 'loading'
    ? new Promise((resolve) => document.addEventListener('DOMContentLoaded', resolve, { once: true }))
    : Promise.resolve();

ready.then(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const desktopMotion = window.matchMedia('(min-width: 801px)').matches;
    const cleanup = [];
    const animatedReveals = new WeakSet();
    let menuAnimation;

    const remember = (stop) => {
        if (typeof stop === 'function') cleanup.push(stop);
        return stop;
    };

    const showStaticFallback = () => {
        document.querySelectorAll('.reveal').forEach((element) => {
            element.style.opacity = '1';
            element.style.transform = 'none';
        });
    };

    const on = (name, handler) => {
        document.addEventListener(name, handler);
        cleanup.push(() => document.removeEventListener(name, handler));
    };

    const destroyMotion = () => cleanup.splice(0).forEach((stop) => stop());
    cleanup.push(() => menuAnimation?.stop());
    window.addEventListener('pagehide', destroyMotion, { once: true });

    try {
        root.classList.add('motion-ready');
        root.dataset.motion = reducedMotion ? 'reduced' : 'ready';

        const progressBar = document.getElementById('pageProgress');
        if (progressBar) {
            const progress = animate(
                progressBar,
                { transform: ['scaleX(0)', 'scaleX(1)'] },
                { ease: 'linear' }
            );
            remember(scroll(progress, { trackContentSize: true }));
        }

        if (reducedMotion) {
            showStaticFallback();
            return;
        }

        const heroSupportingItems = document.querySelectorAll([
            '.hero-copy .eyebrow',
            '.hero-copy .hero-intro',
            '.hero-copy .hero-actions'
        ].join(','));

        if (heroSupportingItems.length) {
            animate(
                heroSupportingItems,
                {
                    opacity: [0, 1],
                    transform: ['translateY(18px)', 'translateY(0px)']
                },
                {
                    duration: 0.64,
                    delay: stagger(0.07),
                    ease: [0.16, 1, 0.3, 1]
                }
            );
        }

        const heroTitle = document.querySelector('.hero-copy h1');
        if (heroTitle) {
            animate(
                heroTitle,
                { transform: ['translateY(22px)', 'translateY(0px)'] },
                { duration: 0.72, delay: 0.04, ease: [0.16, 1, 0.3, 1] }
            );
        }

        const portrait = document.querySelector('.portrait-stage');
        if (portrait && desktopMotion) {
            animate(
                portrait,
                {
                    transform: ['translateX(24px) scale(0.98)', 'translateX(0px) scale(1)']
                },
                { duration: 0.82, delay: 0.08, ease: [0.16, 1, 0.3, 1] }
            );
        }

        const revealTargets = [...document.querySelectorAll('.reveal')];
        revealTargets.forEach((element) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(28px)';
        });

        remember(inView(
            revealTargets,
            (element) => {
                if (animatedReveals.has(element)) return;
                animatedReveals.add(element);
                animate(
                    element,
                    {
                        opacity: [0, 1],
                        transform: ['translateY(28px)', 'translateY(0px)']
                    },
                    { duration: 0.72, ease: [0.16, 1, 0.3, 1] }
                );
            },
            { amount: 0.12, margin: '0px 0px -12% 0px' }
        ));

        const experience = document.querySelector('.experience-list');
        if (experience) {
            remember(inView(
                experience,
                () => {
                    animate(
                        experience.querySelectorAll('article'),
                        {
                            opacity: [0, 1],
                            transform: ['translateX(20px)', 'translateX(0px)']
                        },
                        {
                            duration: 0.55,
                            delay: stagger(0.055),
                            ease: [0.16, 1, 0.3, 1]
                        }
                    );
                },
                { amount: 0.2 }
            ));
        }

        if (desktopMotion) {
            const hero = document.getElementById('home');
            const heroCopy = document.querySelector('.hero-copy');
            const portraitImage = document.querySelector('.portrait-stage img');
            const portraitBackdrop = document.querySelector('.portrait-backdrop');

            if (hero && heroCopy) {
                remember(scroll(
                    animate(
                        heroCopy,
                        {
                            opacity: [1, 0.32],
                            transform: ['translateY(0px)', 'translateY(-58px)']
                        },
                        { ease: 'linear' }
                    ),
                    {
                        target: hero,
                        offset: ['start start', 'end start'],
                        trackContentSize: true
                    }
                ));
            }

            if (hero && portraitImage) {
                remember(scroll(
                    animate(
                        portraitImage,
                        { transform: ['scale(1)', 'scale(0.965)'] },
                        { ease: 'linear' }
                    ),
                    {
                        target: hero,
                        offset: ['start start', 'end start'],
                        trackContentSize: true
                    }
                ));
            }

            if (hero && portraitBackdrop) {
                remember(scroll(
                    animate(
                        portraitBackdrop,
                        {
                            transform: [
                                'translateY(0px) rotate(2.5deg)',
                                'translateY(-24px) rotate(0deg)'
                            ]
                        },
                        { ease: 'linear' }
                    ),
                    {
                        target: hero,
                        offset: ['start start', 'end start'],
                        trackContentSize: true
                    }
                ));
            }

            const caseLayout = document.querySelector('.case-layout');
            const browserFrame = document.querySelector('.browser-frame');
            if (caseLayout && browserFrame) {
                remember(scroll(
                    animate(
                        browserFrame,
                        {
                            opacity: [0.72, 1],
                            transform: [
                                'translateY(22px) scale(0.97)',
                                'translateY(0px) scale(1)'
                            ]
                        },
                        { ease: 'linear' }
                    ),
                    {
                        target: caseLayout,
                        offset: ['start end', 'start 32%'],
                        trackContentSize: true
                    }
                ));
            }
        }

        remember(hover('.button, .text-link, .nav-resume, .memory-control', (element) => {
            animate(
                element,
                { y: -3 },
                { type: 'spring', stiffness: 440, damping: 31 }
            );
            return () => animate(
                element,
                { y: 0 },
                { type: 'spring', stiffness: 390, damping: 30 }
            );
        }));

        remember(press('.button, .nav-resume, .memory-control, .menu-toggle', (element) => {
            animate(
                element,
                { scale: 0.97 },
                { type: 'spring', stiffness: 520, damping: 30 }
            );
            return () => animate(
                element,
                { scale: 1 },
                { type: 'spring', stiffness: 460, damping: 28 }
            );
        }));

        on('portfolio:menu', ({ detail }) => {
            if (!detail?.menu) return;
            menuAnimation?.stop();
            menuAnimation = animate(
                detail.menu,
                detail.open
                    ? { opacity: [0, 1], transform: ['translateY(-12px)', 'translateY(0px)'] }
                    : { opacity: [1, 0], transform: ['translateY(0px)', 'translateY(-10px)'] },
                { duration: detail.open ? 0.28 : 0.18, ease: [0.16, 1, 0.3, 1] }
            );
        });

        on('portfolio:case-screen', ({ detail }) => {
            if (!detail?.active) return;
            if (detail.previous && detail.previous !== detail.active) {
                animate(
                    detail.previous,
                    { opacity: [1, 0], scale: [1, 1.015] },
                    { duration: 0.28, ease: 'easeOut' }
                );
            }
            animate(
                detail.active,
                { opacity: [0, 1], scale: [1.02, 1] },
                { duration: 0.52, ease: [0.16, 1, 0.3, 1] }
            );
            if (detail.caption) {
                animate(
                    detail.caption,
                    {
                        opacity: [0.35, 1],
                        transform: ['translateY(6px)', 'translateY(0px)']
                    },
                    { duration: 0.38, ease: 'easeOut' }
                );
            }
        });

        on('portfolio:memory-change', ({ detail }) => {
            const core = detail?.canvas?.querySelector('.memory-core');
            const output = detail?.canvas?.querySelector('.memory-output span');
            if (!core || !output) return;
            const scale = detail.mode === 'retrieve' ? 1.06 : 1;
            animate(
                core,
                { scale: [0.92, scale], rotate: detail.mode === 'forget' ? [3, 0] : [-3, 0] },
                { type: 'spring', stiffness: 360, damping: 24 }
            );
            animate(
                output,
                { opacity: [0, 1], transform: ['translateY(8px)', 'translateY(0px)'] },
                { duration: 0.36, ease: [0.16, 1, 0.3, 1] }
            );
        });

        on('portfolio:toast', ({ detail }) => {
            if (!detail?.toast) return;
            animate(
                detail.toast,
                {
                    opacity: [0, 1],
                    transform: ['translate(-50%, 12px)', 'translate(-50%, 0px)']
                },
                { duration: 0.34, ease: [0.16, 1, 0.3, 1] }
            );
        });

    } catch {
        root.dataset.motion = 'fallback';
        showStaticFallback();
        destroyMotion();
    }
});
