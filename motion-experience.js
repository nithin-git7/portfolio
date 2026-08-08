import {
    animate,
    inView,
    scroll,
    stagger
} from 'https://cdn.jsdelivr.net/npm/motion@12.42.2/+esm';

const ready = document.readyState === 'loading'
    ? new Promise((resolve) => document.addEventListener('DOMContentLoaded', resolve, { once: true }))
    : Promise.resolve();

ready.then(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const desktopMotion = window.matchMedia('(min-width: 901px)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const cleanup = [];
    const root = document.documentElement;
    const sections = Array.from(document.querySelectorAll('#main-content > section'));
    const journeyLinks = Array.from(document.querySelectorAll('[data-scene-link]'));
    const progressBar = document.getElementById('journeyProgressBar');

    const destroyMotionExperience = () => {
        cleanup.forEach((stop) => {
            if (typeof stop === 'function') stop();
        });
    };
    window.addEventListener('pagehide', destroyMotionExperience, { once: true });

    root.classList.add('motion-enhanced');
    sections.forEach((section) => section.classList.add('story-scene'));

    const initialSceneId = decodeURIComponent(window.location.hash.slice(1));
    const initialScene = initialSceneId ? document.getElementById(initialSceneId) : null;
    if (initialScene) {
        window.requestAnimationFrame(() => {
            initialScene.scrollIntoView({ behavior: 'auto', block: 'start' });
        });
    }

    const sceneGroups = [
        { railId: 'home', sectionIds: ['home'] },
        { railId: 'projects', sectionIds: ['projects'] },
        { railId: 'about', sectionIds: ['about', 'skills'] },
        { railId: 'timeline', sectionIds: ['timeline', 'prompts'] },
        { railId: 'resume', sectionIds: ['resume', 'achievements'] },
        { railId: 'contact', sectionIds: ['contact'] }
    ];

    const railIdForSection = (sectionId) => (
        sceneGroups.find((group) => group.sectionIds.includes(sectionId))?.railId || sectionId
    );

    const setActiveJourneyLink = (sectionId) => {
        const activeRailId = railIdForSection(sectionId);

        journeyLinks.forEach((link) => {
            const isActive = link.dataset.sceneLink === activeRailId;
            link.classList.toggle('active', isActive);
            if (isActive) {
                link.setAttribute('aria-current', 'location');
            } else {
                link.removeAttribute('aria-current');
            }
        });

        if (!reducedMotion) {
            const activeLink = journeyLinks.find((link) => link.dataset.sceneLink === activeRailId);
            if (activeLink) {
                animate(activeLink, { x: [-5, 0] }, { type: 'spring', stiffness: 420, damping: 30 });
            }
        }
    };

    journeyLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            const targetId = link.dataset.sceneLink;
            const target = document.getElementById(targetId);
            if (!target) return;

            event.preventDefault();
            target.scrollIntoView({
                behavior: reducedMotion ? 'auto' : 'smooth',
                block: 'start'
            });
            window.history.replaceState(null, '', `#${targetId}`);
        });
    });

    cleanup.push(inView(
        sections,
        (section) => {
            setActiveJourneyLink(section.id);
            return () => {};
        },
        { amount: 'some', margin: '-34% 0px -56% 0px' }
    ));

    if (reducedMotion) {
        setupArchiveRail({ reducedMotion, cleanup });
        return;
    }

    const heroTargets = document.querySelectorAll([
        '.hero-badge',
        '.hero-name',
        '.hero-title',
        '.hero-desc',
        '.hero-actions'
    ].join(','));

    if (heroTargets.length) {
        animate(
            heroTargets,
            { opacity: [0, 1], y: [28, 0] },
            {
                duration: 0.82,
                delay: stagger(0.075),
                ease: [0.22, 1, 0.36, 1]
            }
        );
    }

    const profile = document.querySelector('.profile-container');
    if (profile) {
        animate(
            profile,
            { opacity: [0, 1], x: [36, 0], scale: [0.96, 1] },
            { duration: 1, delay: 0.14, ease: [0.22, 1, 0.36, 1] }
        );
    }

    const uiMotionHandlers = {
        'portfolio:mobile-nav': (event) => {
            const { menu, isOpen } = event.detail;
            if (menu && isOpen) {
                animate(menu, { opacity: [0, 1], y: [-14, 0] }, {
                    duration: 0.3,
                    ease: [0.22, 1, 0.36, 1]
                });
            }
        },
        'portfolio:details': (event) => {
            const { panel, isOpen } = event.detail;
            if (panel && isOpen) {
                animate(panel, { opacity: [0, 1], y: [-8, 0] }, {
                    duration: 0.34,
                    ease: [0.22, 1, 0.36, 1]
                });
            }
        },
        'portfolio:resume-tab': (event) => {
            const { panel } = event.detail;
            if (panel) {
                animate(panel, { opacity: [0, 1], y: [12, 0] }, {
                    duration: 0.36,
                    ease: [0.22, 1, 0.36, 1]
                });
            }
        },
        'portfolio:playground': (event) => {
            const { panel, isOpen } = event.detail;
            if (panel && isOpen) {
                animate(panel, { opacity: [0, 1], y: [16, 0], scale: [0.985, 1] }, {
                    duration: 0.42,
                    ease: [0.22, 1, 0.36, 1]
                });
            }
        },
        'portfolio:modal-open': (event) => {
            const { modal, card } = event.detail;
            if (modal) animate(modal, { opacity: [0, 1] }, { duration: 0.22 });
            if (card) {
                animate(card, { opacity: [0, 1], y: [22, 0], scale: [0.96, 1] }, {
                    type: 'spring',
                    stiffness: 360,
                    damping: 30
                });
            }
        },
        'portfolio:prompt-change': (event) => {
            const { panel } = event.detail;
            if (panel) {
                animate(panel, { opacity: [0.35, 1], y: [8, 0] }, {
                    duration: 0.28,
                    ease: 'easeOut'
                });
            }
        }
    };

    Object.entries(uiMotionHandlers).forEach(([eventName, handler]) => {
        document.addEventListener(eventName, handler);
        cleanup.push(() => document.removeEventListener(eventName, handler));
    });

    const revealedSections = new WeakSet();
    cleanup.push(inView(
        sections.filter((section) => section.id !== 'home'),
        (section) => {
            if (!revealedSections.has(section)) {
                revealedSections.add(section);
                const container = section.querySelector(':scope > .container');
                const targets = container ? Array.from(container.children) : [];

                if (targets.length) {
                    animate(
                        targets,
                        { opacity: [0, 1], y: [34, 0] },
                        {
                            duration: 0.72,
                            delay: stagger(0.065),
                            ease: [0.22, 1, 0.36, 1]
                        }
                    );
                }
            }

            return () => {};
        },
        { amount: 'some', margin: '0px 0px -16% 0px' }
    ));

    if (progressBar) {
        const pageProgress = animate(
            progressBar,
            { transform: ['scaleX(0)', 'scaleX(1)'] },
            { ease: 'linear' }
        );
        cleanup.push(scroll(pageProgress, { trackContentSize: true }));
    }

    if (desktopMotion) {
        const heroSection = document.getElementById('home');
        const heroContent = heroSection?.querySelector('.hero-content');
        const profileLayer = heroSection?.querySelector('.profile-motion-layer');

        if (heroSection && heroContent) {
            const heroExit = animate(
                heroContent,
                {
                    opacity: [1, 0.38],
                    transform: ['translateY(0px)', 'translateY(-72px)']
                },
                { ease: 'linear' }
            );

            cleanup.push(scroll(heroExit, {
                target: heroSection,
                offset: ['start start', 'end start'],
                trackContentSize: true
            }));
        }

        if (heroSection && profileLayer) {
            const profileExit = animate(
                profileLayer,
                {
                    opacity: [1, 0.48],
                    transform: [
                        'translateY(0px) scale(1)',
                        'translateY(-28px) scale(0.88)'
                    ]
                },
                { ease: 'linear' }
            );

            cleanup.push(scroll(profileExit, {
                target: heroSection,
                offset: ['start start', 'end start'],
                trackContentSize: true
            }));
        }

        sections.forEach((section) => {
            const container = section.querySelector(':scope > .container');
            if (!container) return;

            const sceneDepth = animate(
                container,
                {
                    opacity: [0.72, 1, 1, 0.76],
                    transform: [
                        'translateY(34px) scale(0.985)',
                        'translateY(0px) scale(1)',
                        'translateY(0px) scale(1)',
                        'translateY(-26px) scale(0.99)'
                    ]
                },
                { ease: 'linear' }
            );

            cleanup.push(scroll(sceneDepth, {
                target: section,
                offset: ['start end', 'start 44%', 'end 56%', 'end start'],
                trackContentSize: true
            }));
        });
    }

    if (finePointer) {
        document.querySelectorAll('.current-build-card, .projects-gallery .project-card').forEach((card) => {
            const enter = () => animate(
                card,
                { y: -7 },
                { type: 'spring', stiffness: 420, damping: 32 }
            );
            const leave = () => animate(
                card,
                { y: 0 },
                { type: 'spring', stiffness: 420, damping: 34 }
            );

            card.addEventListener('pointerenter', enter);
            card.addEventListener('pointerleave', leave);
            cleanup.push(() => {
                card.removeEventListener('pointerenter', enter);
                card.removeEventListener('pointerleave', leave);
            });
        });
    }

    setupArchiveRail({ reducedMotion, cleanup });

});

function setupArchiveRail({ reducedMotion, cleanup }) {
    const rail = document.getElementById('projectArchiveRail');
    const previous = document.getElementById('archivePrevious');
    const next = document.getElementById('archiveNext');
    const progress = document.getElementById('archiveProgressBar');

    if (!rail || !previous || !next) return;

    const cards = Array.from(rail.querySelectorAll('.project-card'));
    let activeIndex = 0;

    const updateControls = () => {
        previous.disabled = activeIndex <= 0;
        next.disabled = activeIndex >= cards.length - 1;
    };

    const nearestCardIndex = () => {
        const railLeft = rail.getBoundingClientRect().left;
        return cards.reduce((nearest, card, index) => {
            const currentDistance = Math.abs(card.getBoundingClientRect().left - railLeft);
            const nearestDistance = Math.abs(cards[nearest].getBoundingClientRect().left - railLeft);
            return currentDistance < nearestDistance ? index : nearest;
        }, 0);
    };

    const moveToCard = (index, trigger) => {
        activeIndex = Math.max(0, Math.min(cards.length - 1, index));
        const card = cards[activeIndex];
        const left = card.offsetLeft - rail.offsetLeft;

        rail.scrollTo({
            left,
            behavior: reducedMotion ? 'auto' : 'smooth'
        });
        updateControls();

        if (!reducedMotion && trigger) {
            animate(
                trigger,
                { scale: [1, 0.92, 1] },
                { type: 'spring', stiffness: 520, damping: 28 }
            );
        }
    };

    const handlePrevious = () => moveToCard(activeIndex - 1, previous);
    const handleNext = () => moveToCard(activeIndex + 1, next);
    const handleRailKeydown = (event) => {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            moveToCard(activeIndex - 1, previous);
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            moveToCard(activeIndex + 1, next);
        }
    };

    previous.addEventListener('click', handlePrevious);
    next.addEventListener('click', handleNext);
    rail.addEventListener('keydown', handleRailKeydown);
    cleanup.push(() => {
        previous.removeEventListener('click', handlePrevious);
        next.removeEventListener('click', handleNext);
        rail.removeEventListener('keydown', handleRailKeydown);
    });

    cleanup.push(scroll((value) => {
        activeIndex = nearestCardIndex();
        updateControls();
        if (progress) progress.style.transform = `scaleX(${value})`;
    }, {
        container: rail,
        axis: 'x',
        trackContentSize: true
    }));

    if (!reducedMotion) {
        cleanup.push(inView(
            cards,
            (card) => {
                animate(
                    card,
                    { opacity: 1, scale: 1 },
                    { type: 'spring', stiffness: 320, damping: 32 }
                );

                return () => animate(
                    card,
                    { opacity: 0.68, scale: 0.985 },
                    { duration: 0.28, ease: 'easeOut' }
                );
            },
            { root: rail, amount: 0.62 }
        ));
    }

    updateControls();
}
