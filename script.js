const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupCaseStudy();
    setupMemoryLab();
    setupContactForm();
});

function setupNavigation() {
    const header = document.getElementById('siteHeader');
    const toggle = document.getElementById('menuToggle');
    const links = document.getElementById('navLinks');
    const hero = document.getElementById('home');

    const closeMenu = () => {
        const wasOpen = links.classList.contains('is-open');
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
        if (wasOpen) {
            document.dispatchEvent(new CustomEvent('portfolio:menu', {
                detail: { menu: links, open: false }
            }));
        }
    };

    toggle.addEventListener('click', () => {
        const open = !links.classList.contains('is-open');
        links.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        document.body.classList.toggle('menu-open', open);
        document.dispatchEvent(new CustomEvent('portfolio:menu', {
            detail: { menu: links, open }
        }));
    });

    links.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeMenu();
    });

    const headerObserver = new IntersectionObserver(([entry]) => {
        header.classList.toggle('is-scrolled', entry.intersectionRatio < 0.95);
    }, { threshold: [0.95] });
    headerObserver.observe(hero);

    const sectionLinks = [...links.querySelectorAll('a[href^="#"]')];
    const sections = sectionLinks
        .map((link) => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            sectionLinks.forEach((link) => {
                const active = entry.target !== hero && link.getAttribute('href') === `#${entry.target.id}`;
                link.classList.toggle('is-active', active);
                if (active) link.setAttribute('aria-current', 'location');
                else link.removeAttribute('aria-current');
            });
        });
    }, { rootMargin: '-34% 0px -56% 0px', threshold: 0 });

    sectionObserver.observe(hero);
    sections.forEach((section) => sectionObserver.observe(section));
}

function setupCaseStudy() {
    const steps = [...document.querySelectorAll('.case-step')];
    const screens = [...document.querySelectorAll('[data-screen-image]')];
    const caption = document.getElementById('screenCaption');
    const captions = {
        home: 'The product frames a complicated journey around the next best action.',
        roadmap: 'The roadmap collects the right inputs before it recommends a stage, weekly focus, and official links.'
    };

    const activate = (step) => {
        const screen = step.dataset.screen;
        const previous = screens.find((image) => image.classList.contains('is-visible'));
        const active = screens.find((image) => image.dataset.screenImage === screen);
        steps.forEach((item) => item.classList.toggle('is-active', item === step));
        screens.forEach((image) => image.classList.toggle('is-visible', image.dataset.screenImage === screen));
        caption.textContent = captions[screen] || captions.home;
        document.dispatchEvent(new CustomEvent('portfolio:case-screen', {
            detail: { active, previous, caption }
        }));
    };

    if (reducedMotion || window.matchMedia('(max-width: 800px)').matches) {
        steps.forEach((step) => step.classList.add('is-active'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        const activeEntry = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (activeEntry) activate(activeEntry.target);
    }, { rootMargin: '-28% 0px -38% 0px', threshold: [0.2, 0.45, 0.7] });

    steps.forEach((step) => observer.observe(step));
}

function setupMemoryLab() {
    const canvas = document.getElementById('memoryCanvas');
    const verb = document.getElementById('memoryVerb');
    const output = document.getElementById('memoryOutput');
    const controls = [...document.querySelectorAll('[data-memory-mode]')];
    const states = {
        retain: {
            verb: 'Retain',
            output: 'Useful context stays available'
        },
        retrieve: {
            verb: 'Retrieve',
            output: 'Relevant context returns on demand'
        },
        forget: {
            verb: 'Let go',
            output: 'Low-value context leaves the system'
        }
    };

    controls.forEach((control) => {
        control.addEventListener('click', () => {
            const mode = control.dataset.memoryMode;
            canvas.dataset.mode = mode;
            verb.textContent = states[mode].verb;
            output.textContent = states[mode].output;
            controls.forEach((item) => {
                const active = item === control;
                item.classList.toggle('is-active', active);
                item.setAttribute('aria-pressed', String(active));
            });
            document.dispatchEvent(new CustomEvent('portfolio:memory-change', {
                detail: { canvas, mode }
            }));
        });
    });
}

function setupContactForm() {
    const form = document.getElementById('contactForm');
    const toast = document.getElementById('toast');
    let toastTimer;

    const showToast = (message) => {
        toast.textContent = message;
        toast.classList.add('is-visible');
        document.dispatchEvent(new CustomEvent('portfolio:toast', {
            detail: { toast }
        }));
        window.clearTimeout(toastTimer);
        toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2800);
    };

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!form.reportValidity()) return;

        const data = new FormData(form);
        const subject = data.get('subject');
        const body = [
            `Name: ${data.get('name')}`,
            `Email: ${data.get('email')}`,
            '',
            String(data.get('message'))
        ].join('\n');

        showToast('Opening your email app. Your message is not stored here.');
        window.location.href = `mailto:nithinpolavarapu@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
}
