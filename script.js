
// --- ELITE PRELOADER ---
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const gsapApi = window.gsap;
const scrollTriggerApi = window.ScrollTrigger;
const lenisConstructor = window.Lenis;
const preloader = document.querySelector('.elite-preloader');
const counterElement = document.querySelector('.counter');
const preloaderObj = { value: 0 };

function releasePreloader() {
    preloader?.remove();
    document.body.style.overflow = '';
}

if (prefersReducedMotion || !gsapApi || !preloader) {
    releasePreloader();
} else {
    gsapApi.to(preloaderObj, {
    value: 100,
    duration: 2.5,
    ease: "power2.inOut",
    onUpdate: () => {
        counterElement.innerText = Math.round(preloaderObj.value) + '%';
    },
    onComplete: () => {
        gsapApi.to('.elite-preloader', {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
            duration: 1.2,
            ease: "expo.inOut",
            onComplete: () => {
                releasePreloader();
                // Restart Hero Animations here
                if(window.heroNameElement) {
                    gsapApi.fromTo(window.heroNameElement,
                        { opacity: 0, y: 24 },
                        { opacity: 1, y: 0, duration: 0.8, ease: "power4.out" }
                    );
                }
            }
        });
    }
    });
}


// Cache primary color
let cachedPrimaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-rgb').trim() || '255, 0, 85';

// Update cache when theme changes
const originalSetTheme = window.setTheme;
if (typeof originalSetTheme === 'function') {
    window.setTheme = function(theme) {
        originalSetTheme(theme);
        setTimeout(() => {
            cachedPrimaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-rgb').trim();
        }, 50);
    };
}

document.addEventListener('DOMContentLoaded', () => {
            // Keep the source markup readable while presenting the founder-led order visually.
            const mainContent = document.getElementById('main-content');
            const initialHashId = window.location.hash ? window.location.hash.slice(1) : '';
            const sectionOrder = ['home', 'projects', 'about', 'skills', 'timeline', 'prompts', 'resume', 'achievements', 'contact'];
            if (mainContent) {
                sectionOrder.forEach((sectionId) => {
                    const section = document.getElementById(sectionId);
                    if (section && section.parentElement === mainContent) mainContent.appendChild(section);
                });
                if (initialHashId) {
                    requestAnimationFrame(() => {
                        document.getElementById(initialHashId)?.scrollIntoView({ behavior: 'auto', block: 'start' });
                    });
                }
            }
            
            // 1. Typing animation for Hero Title
            const titles = [
                "AI Product Builder",
                "Machine Learning Engineer",
                "Builder of Agent Tools",
                "Computer Science Undergraduate"
            ];
            let titleIndex = 0;
            let charIndex = 0;
            let currentText = "";
            let isDeleting = false;
            const heroTitleEl = document.getElementById('heroTitle');
            
            function typeText() {
                const fullText = titles[titleIndex];
                if (isDeleting) {
                    currentText = fullText.substring(0, charIndex - 1);
                    charIndex--;
                } else {
                    currentText = fullText.substring(0, charIndex + 1);
                    charIndex++;
                }
                
                heroTitleEl.innerHTML = currentText + '<span class="typed-cursor">|</span>';
                
                let typingSpeed = 100;
                if (isDeleting) typingSpeed /= 2.5;
                
                if (!isDeleting && charIndex === fullText.length) {
                    typingSpeed = 2000; // Hold full text
                    isDeleting = true;
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    titleIndex = (titleIndex + 1) % titles.length;
                    typingSpeed = 500; // Delay before typing next
                }
                
                if (!document.hidden) { setTimeout(typeText, typingSpeed); } else { document.addEventListener("visibilitychange", function resumeTyping() { if(!document.hidden) { document.removeEventListener("visibilitychange", resumeTyping); setTimeout(typeText, typingSpeed); } }); }
            }
            if (prefersReducedMotion) {
                heroTitleEl.textContent = titles[0];
            } else {
                typeText();
            }

            // 2. Floating Navbar Scroll Adjustments & Back To Top visibility
            const navbar = document.getElementById('navbar');
            const backToTop = document.getElementById('backToTop');
            const sections = document.querySelectorAll('section');
            const navLinks = document.querySelectorAll('.nav-menu li a');
            
            // Intersection Observer for Sections (Active Nav Links)
            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const currentId = entry.target.getAttribute('id');
                            navLinks.forEach(link => {
                            link.classList.remove('active');
                            link.removeAttribute('aria-current');
                            if (link.getAttribute('href') === `#${currentId}`) {
                                link.classList.add('active');
                                link.setAttribute('aria-current', 'location');
                            }
                        });
                    }
                });
            }, { threshold: 0.2, rootMargin: "-100px 0px -100px 0px" });
            sections.forEach(sec => sectionObserver.observe(sec));

            // Scroll state uses observers instead of a per-frame scroll listener.
            const createScrollMarker = (top) => {
                const marker = document.createElement('div');
                marker.setAttribute('aria-hidden', 'true');
                marker.style.cssText = `position: absolute; top: ${top}px; left: 0; width: 1px; height: 1px; pointer-events: none; opacity: 0;`;
                document.body.appendChild(marker);
                return marker;
            };

            const navMarker = createScrollMarker(50);
            const backToTopMarker = createScrollMarker(500);
            const navStateObserver = new IntersectionObserver(([entry]) => {
                navbar.classList.toggle('scrolled', !entry.isIntersecting);
            });
            const backToTopObserver = new IntersectionObserver(([entry]) => {
                backToTop.classList.toggle('show', !entry.isIntersecting);
            });
            navStateObserver.observe(navMarker);
            backToTopObserver.observe(backToTopMarker);

            // 3. Mobile Menu Toggle
            const mobileToggle = document.getElementById('mobileToggle');
            const navMenu = document.getElementById('navMenu');

            const syncMobileNavState = () => {
                const isMobile = window.matchMedia('(max-width: 900px)').matches;
                const isOpen = navMenu.classList.contains('active');
                navMenu.inert = isMobile && !isOpen;
                navMenu.setAttribute('aria-hidden', String(isMobile && !isOpen));
            };
            syncMobileNavState();
            window.addEventListener('resize', syncMobileNavState, { passive: true });
            
            mobileToggle.addEventListener('click', () => {
                const isOpen = navMenu.classList.toggle('active');
                mobileToggle.setAttribute('aria-expanded', String(isOpen));
                syncMobileNavState();
                const icon = mobileToggle.querySelector('i');
                if (isOpen) {
                    icon.className = 'fa-solid fa-xmark';
                } else {
                    icon.className = 'fa-solid fa-bars-staggered';
                }
            });

            // Close mobile menu when nav item clicked
            document.querySelectorAll('.nav-item a').forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    mobileToggle.setAttribute('aria-expanded', 'false');
                    syncMobileNavState();
                    mobileToggle.querySelector('i').className = 'fa-solid fa-bars-staggered';
                });
            });

            // 4. Skills Grid Filter & Bar Animation trigger
            const filterBtns = document.querySelectorAll('.filter-btn');
            const skillItems = document.querySelectorAll('.skill-item');
            
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    filterBtns.forEach(b => {
                        b.classList.remove('active');
                        b.setAttribute('aria-pressed', 'false');
                    });
                    btn.classList.add('active');
                    btn.setAttribute('aria-pressed', 'true');
                    
                    const filterValue = btn.getAttribute('data-filter');
                    
                    skillItems.forEach(item => {
                        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                            item.style.display = 'flex';
                            setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 10);
                        } else {
                            item.style.opacity = '0';
                            item.style.transform = 'scale(0.85)';
                            setTimeout(() => { item.style.display = 'none'; }, 300);
                        }
                    });
                });
            });

            // Trigger progress bar widths using Intersection Observer
            const skillBars = document.querySelectorAll('.skill-progress-bar');
            const skillsObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const bar = entry.target;
                        bar.style.width = bar.getAttribute('data-width');
                        skillsObserver.unobserve(bar);
                    }
                });
            }, { threshold: 0.1 });
            skillBars.forEach(bar => skillsObserver.observe(bar));

            // 6. Reveal Elements on Scroll
            const reveals = document.querySelectorAll('.reveal-on-scroll');
            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        revealObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
            reveals.forEach(el => revealObserver.observe(el));
        });

        // 7. Toggle Project Details Drawer
        function toggleDetails(btn) {
            const cardBody = btn.closest('.project-body');
            const detailsContent = cardBody.querySelector('.project-details-content');
            const icon = btn.querySelector('i');
            const label = btn.querySelector('span');
            
            detailsContent.classList.toggle('expanded');
            const isExpanded = detailsContent.classList.contains('expanded');
            btn.setAttribute('aria-expanded', String(isExpanded));
            detailsContent.setAttribute('aria-hidden', String(!isExpanded));
            
            if (detailsContent.classList.contains('expanded')) {
                icon.className = 'fa-solid fa-chevron-up';
                label.textContent = 'Hide Details';
            } else {
                icon.className = 'fa-solid fa-chevron-down';
                label.textContent = 'Show Pipeline Details';
            }
        }

        // 8. Switch Resume Tabs
        function switchResumeTab(tabName) {
            const btnPdf = document.querySelectorAll('.resume-tab-btn')[1];
            const btnInteractive = document.querySelectorAll('.resume-tab-btn')[0];
            
            const tabPdf = document.getElementById('pdfResumeTab');
            const tabInteractive = document.getElementById('interactiveResumeTab');
            
            if (tabName === 'pdf') {
                btnPdf.classList.add('active');
                btnInteractive.classList.remove('active');
                tabPdf.classList.add('active');
                tabInteractive.classList.remove('active');
            } else {
                btnInteractive.classList.add('active');
                btnPdf.classList.remove('active');
                tabInteractive.classList.add('active');
                tabPdf.classList.remove('active');
            }

            [btnInteractive, btnPdf].forEach(btn => {
                btn.setAttribute('aria-pressed', String(btn.classList.contains('active')));
            });
            [tabInteractive, tabPdf].forEach(panel => {
                panel.setAttribute('aria-hidden', String(!panel.classList.contains('active')));
            });
        }

        // 9. Scroll to Top function
        function scrollToTop() {
            window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        }

        // 10. Contact Form Submission Upgraded Handler
        const contactModal = document.getElementById('contactModal');
        const contactCloseButton = contactModal?.querySelector('button');
        let contactReturnFocus = null;

        function handleFormSubmit(e) {
            e.preventDefault();
            const name = document.getElementById('formName').value;
            const email = document.getElementById('formEmail').value;
            const subject = document.getElementById('formSubject').value;
            const message = document.getElementById('formMessage').value;
            
            const submitBtn = e.target.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Preparing Message...';

            // This is a static site, so prepare an email draft instead of claiming a backend send.
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Prepare Email <i class="fa-regular fa-paper-plane"></i>';

            const detailsEl = document.getElementById('contactModalDetails');
            detailsEl.textContent = `Name: ${name}\nReply-to: ${email}\nSubject: ${subject}\n\nYour message is ready to send.`;

            // Setup email draft action
            document.getElementById('fallbackMailtoBtn').onclick = () => {
                const mailtoUrl = `mailto:nithinpolavarapu@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("Name: " + name + "\nEmail: " + email + "\n\nMessage:\n" + message)}`;
                window.location.href = mailtoUrl;
            };

            // Setup copy payload action
            document.getElementById('copyPayloadBtn').onclick = () => {
                const payload = `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`;
                if (!navigator.clipboard) {
                    showToast("Clipboard access is unavailable here.");
                    return;
                }
                navigator.clipboard.writeText(payload)
                    .then(() => showToast("Message copied to clipboard!"))
                    .catch(() => showToast("Failed to copy message."));
            };

            contactReturnFocus = document.activeElement;
            contactModal.inert = false;
            contactModal.classList.add('active');
            contactCloseButton?.focus();
            e.target.reset();
        }

        function closeContactModal() {
            contactModal.classList.remove('active');
            contactModal.inert = true;
            contactReturnFocus?.focus();
            showToast("Message prepared. Choose an email option to send it.");
        }

        function getModalFocusableElements() {
            return Array.from(contactModal.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'))
                .filter(element => !element.hasAttribute('hidden'));
        }

        document.addEventListener('keydown', (event) => {
            if (!contactModal.classList.contains('active')) return;

            if (event.key === 'Escape') {
                closeContactModal();
                return;
            }

            if (event.key === 'Tab') {
                const focusableElements = getModalFocusableElements();
                if (!focusableElements.length) {
                    event.preventDefault();
                    return;
                }

                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (!contactModal.contains(document.activeElement)) {
                    event.preventDefault();
                    (event.shiftKey ? lastElement : firstElement).focus();
                } else if (event.shiftKey && document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                } else if (!event.shiftKey && document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        });

        function showToast(msg) {
            const toast = document.getElementById('toastBox');
            const toastMsg = document.getElementById('toastMsg');
            toastMsg.textContent = msg;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 4000);
        }

        // 11. Simulated ML Playgrounds Interactions
        function togglePlayground(num, btn) {
            const panel = document.getElementById(`playground-${num}`);
            const icon = btn.querySelector('i');
            const text = btn.querySelector('span');
            
            panel.classList.toggle('active');
            const isOpen = panel.classList.contains('active');
            btn.setAttribute('aria-expanded', String(isOpen));
            panel.setAttribute('aria-hidden', String(!isOpen));
            if (isOpen) {
                icon.className = 'fa-solid fa-square-minus';
                text.textContent = 'Close prototype';
                panel.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'nearest' });
            } else {
                icon.className = 'fa-solid fa-play';
                text.textContent = 'Prototype demo';
            }
        }

        // Project 1: Enterprise Analytics Simulation
        function runSimulation1(btn) {
            const select = document.getElementById('ds-1');
            const consoleEl = document.getElementById('console-1');
            const progContainer = document.getElementById('progress-container-1');
            const progressBar = document.getElementById('progress-bar-1');
            const resultEl = document.getElementById('result-1');
            const metricsEl = document.getElementById('metrics-1');
            
            consoleEl.innerHTML = '';
            consoleEl.classList.add('active');
            consoleEl.setAttribute('aria-busy', 'true');
            progContainer.style.display = 'block';
            progressBar.style.width = '0%';
            resultEl.classList.remove('active');
            resultEl.setAttribute('aria-busy', 'true');
            btn.disabled = true;
            btn.style.opacity = '0.5';

            const selectedSource = select.options[select.selectedIndex].text;
            
            const logs = [
                { text: `[INFO] Initializing example data source...`, type: 'info', delay: 200 },
                { text: `[INFO] Reading sample source: "${selectedSource}"`, type: 'info', delay: 600 },
                { text: `[SUCCESS] Simulated read-only connection step complete.`, type: 'success', delay: 1000 },
                { text: `[INFO] Running sample preprocessing modules...`, type: 'info', delay: 1500 },
                { text: `[INFO] Preparing sample features for the prototype flow...`, type: 'info', delay: 2200 },
                { text: `[SUCCESS] Prototype decision view prepared.`, type: 'success', delay: 2800 },
                { text: `[SUCCESS] Example output is ready for review.`, type: 'success', delay: 3000 }
            ];

            logs.forEach(log => {
                setTimeout(() => {
                    const p = document.createElement('p');
                    p.className = `playground-console-line ${log.type}`;
                    p.textContent = log.text;
                    consoleEl.appendChild(p);
                    consoleEl.scrollTop = consoleEl.scrollHeight;
                }, log.delay);
            });

            let pct = 0;
            const interval = setInterval(() => {
                pct += 2;
                progressBar.style.width = `${pct}%`;
                if (pct >= 100) {
                    clearInterval(interval);
                }
            }, 60);

            setTimeout(() => {
                btn.disabled = false;
                btn.style.opacity = '1';
                progContainer.style.display = 'none';
                
                let metricsHTML = '';
                if (select.value === 'sales') {
                    metricsHTML = `
                        <div class="playground-metric"><span>Model fit (sample):</span><strong>Strong</strong></div>
                        <div class="playground-metric"><span>Trend direction:</span><strong>Positive</strong></div>
                        <div class="playground-metric"><span>Outlier scan:</span><strong>Clear</strong></div>
                    `;
                } else if (select.value === 'churn') {
                    metricsHTML = `
                        <div class="playground-metric"><span>Risk signal (sample):</span><strong style="color:var(--primary)">Low</strong></div>
                        <div class="playground-metric"><span>Classifier signal:</span><strong>Stable</strong></div>
                        <div class="playground-metric"><span>Top signal:</span><strong>Support response latency</strong></div>
                    `;
                } else {
                    metricsHTML = `
                        <div class="playground-metric"><span>Click signal (sample):</span><strong>Positive</strong></div>
                        <div class="playground-metric"><span>Recommendation:</span><strong>Review social channels</strong></div>
                        <div class="playground-metric"><span>Review cue:</span><strong>Positive</strong></div>
                    `;
                }
                metricsEl.innerHTML = metricsHTML;
                consoleEl.setAttribute('aria-busy', 'false');
                resultEl.setAttribute('aria-busy', 'false');
                resultEl.classList.add('active');
            }, 3100);
        }

        // Project 2: Diagnostics Classifier Simulation
        function runSimulation2(btn) {
            const age = parseInt(document.getElementById('age-2').value) || 45;
            const hr = parseInt(document.getElementById('hr-2').value) || 72;
            const bp = parseInt(document.getElementById('bp-2').value) || 128;
            
            const consoleEl = document.getElementById('console-2');
            const progContainer = document.getElementById('progress-container-2');
            const progressBar = document.getElementById('progress-bar-2');
            const resultEl = document.getElementById('result-2');
            const metricsEl = document.getElementById('metrics-2');
            
            consoleEl.innerHTML = '';
            consoleEl.classList.add('active');
            consoleEl.setAttribute('aria-busy', 'true');
            progContainer.style.display = 'block';
            progressBar.style.width = '0%';
            resultEl.classList.remove('active');
            resultEl.setAttribute('aria-busy', 'true');
            btn.disabled = true;
            btn.style.opacity = '0.5';

            const logs = [
                { text: `[INFO] Prototype classifier initialized...`, type: 'info', delay: 200 },
                { text: `[INFO] Checking input vectors: [Age: ${age}, RestHR: ${hr}, BP: ${bp}]`, type: 'info', delay: 500 },
                { text: `[INFO] Aligning sample inputs with the feature schema...`, type: 'info', delay: 1000 },
                { text: `[INFO] Running the illustrative classifier flow...`, type: 'info', delay: 1600 },
                { text: `[SUCCESS] Illustrative output generated. Preparing review state.`, type: 'success', delay: 2200 },
                { text: `[SUCCESS] Prototype output prepared for review.`, type: 'success', delay: 2600 }
            ];

            logs.forEach(log => {
                setTimeout(() => {
                    const p = document.createElement('p');
                    p.className = `playground-console-line ${log.type}`;
                    p.textContent = log.text;
                    consoleEl.appendChild(p);
                    consoleEl.scrollTop = consoleEl.scrollHeight;
                }, log.delay);
            });

            let pct = 0;
            const interval = setInterval(() => {
                pct += 2.5;
                progressBar.style.width = `${pct}%`;
                if (pct >= 100) {
                    clearInterval(interval);
                }
            }, 65);

            setTimeout(() => {
                btn.disabled = false;
                btn.style.opacity = '1';
                progContainer.style.display = 'none';
                
                const reviewSignal = bp > 140 || hr > 90 || age > 60;
                const status = reviewSignal ? "Review signal" : "No review signal";
                
                metricsEl.innerHTML = `
                    <div class="playground-metric"><span>Prototype screen:</span><strong style="color:var(--primary)">${status}</strong></div>
                    <div class="playground-metric"><span>Input handling:</span><strong>Preprocessed</strong></div>
                    <div class="playground-metric"><span>Output type:</span><strong>Illustrative classification</strong></div>
                    <div class="playground-metric"><span>Safety note:</span><strong style="color:var(--primary)">Not a diagnosis</strong></div>
                `;
                consoleEl.setAttribute('aria-busy', 'false');
                resultEl.setAttribute('aria-busy', 'false');
                resultEl.classList.add('active');
            }, 2750);
        }

        // Project 3: Next Word Text Prediction Simulation
        function runSimulation3(btn) {
            const seed = document.getElementById('seed-3');
            const temp = document.getElementById('temp-3').value;
            const consoleEl = document.getElementById('console-3');
            const progContainer = document.getElementById('progress-container-3');
            const progressBar = document.getElementById('progress-bar-3');
            const resultEl = document.getElementById('result-3');
            const metricsEl = document.getElementById('metrics-3');
            
            consoleEl.innerHTML = '';
            consoleEl.classList.add('active');
            consoleEl.setAttribute('aria-busy', 'true');
            progContainer.style.display = 'block';
            progressBar.style.width = '0%';
            resultEl.classList.remove('active');
            resultEl.setAttribute('aria-busy', 'true');
            btn.disabled = true;
            btn.style.opacity = '0.5';

            const logs = [
                { text: `[INFO] Tokenizer initialized. Encoding prompt input...`, type: 'info', delay: 100 },
                { text: `[INFO] Seed prepared for prototype inference.`, type: 'info', delay: 400 },
                { text: `[INFO] Loading the PyTorch inference graph...`, type: 'info', delay: 800 },
                { text: `[INFO] Generating sequential tokens (Temperature: ${temp})...`, type: 'info', delay: 1300 }
            ];

            logs.forEach(log => {
                setTimeout(() => {
                    const p = document.createElement('p');
                    p.className = `playground-console-line ${log.type}`;
                    p.textContent = log.text;
                    consoleEl.appendChild(p);
                    consoleEl.scrollTop = consoleEl.scrollHeight;
                }, log.delay);
            });

            let pct = 0;
            const interval = setInterval(() => {
                pct += 3.3;
                progressBar.style.width = `${pct}%`;
                if (pct >= 100) {
                    clearInterval(interval);
                }
            }, 50);

            let tokens = [];
            let seedText = seed.options[seed.selectedIndex].text;
            
            if (seed.value === 'model') {
                tokens = ["trained", " on", " PyTorch", " to", " optimize", " computational", " graphs", " and", " predict", " sequential", " data", " values."];
            } else if (seed.value === 'net') {
                tokens = ["discover", " complex,", " hidden", " mathematical", " patterns", " across", " massive", " scale", " high-dimensional", " enterprise", " systems."];
            } else {
                tokens = ["automate", " manual", " business", " pipelines", " while", " maintaining", " ethical", " compliance", " and", " human", " agency."];
            }

            setTimeout(() => {
                progContainer.style.display = 'none';
                metricsEl.innerHTML = `<span style="font-family:'Fira Code', monospace; font-size:0.9rem; line-height:1.6; display:inline-block;"><strong style="color:var(--primary)">${seedText}</strong> </span>`;
                resultEl.classList.add('active');
                
                let delay = 0;
                tokens.forEach((token, idx) => {
                    setTimeout(() => {
                        const span = document.createElement('span');
                        span.textContent = token;
                        span.style.opacity = '0';
                        span.style.transition = 'opacity 0.2s';
                        metricsEl.querySelector('span').appendChild(span);
                        setTimeout(() => span.style.opacity = '1', 20);
                        
                        const p = document.createElement('p');
                        p.className = 'playground-console-line success';
                        p.textContent = `[INFERENCE] Predicted token #${idx+1}: "${token.trim()}"`;
                        consoleEl.appendChild(p);
                        consoleEl.scrollTop = consoleEl.scrollHeight;

                        if (idx === tokens.length - 1) {
                            btn.disabled = false;
                            btn.style.opacity = '1';
                            consoleEl.setAttribute('aria-busy', 'false');
                            resultEl.setAttribute('aria-busy', 'false');
                        }
                    }, delay);
                    delay += 180;
                });
            }, 1600);
        }

        // 12. Theme Customizer Logic
        function setTheme(themeName) {
            const root = document.documentElement;
            const buttons = document.querySelectorAll('.theme-btn');
            buttons.forEach(btn => btn.classList.remove('active'));
            
            if (themeName === 'cyan') {
                root.style.setProperty('--primary', '#00f5d4');
                root.style.setProperty('--primary-rgb', '0, 245, 212');
                root.style.setProperty('--primary-hover', '#00e0c2');
                root.style.setProperty('--secondary', '#7209b7');
                root.style.setProperty('--accent', '#f72585');
                root.style.setProperty('--glow-color', 'rgba(0, 245, 212, 0.35)');
                document.querySelector('.theme-btn[title="Cyber Cyan"]').classList.add('active');
                showToast("Accent theme set to Cyber Cyan");
            } else if (themeName === 'purple') {
                root.style.setProperty('--primary', '#8338ec');
                root.style.setProperty('--primary-rgb', '131, 56, 236');
                root.style.setProperty('--primary-hover', '#7028d4');
                root.style.setProperty('--secondary', '#3a86c8');
                root.style.setProperty('--accent', '#ff006e');
                root.style.setProperty('--glow-color', 'rgba(131, 56, 236, 0.35)');
                document.querySelector('.theme-btn[title="Electric Purple"]').classList.add('active');
                showToast("Accent theme set to Electric Purple");
            } else if (themeName === 'crimson') {
                root.style.setProperty('--primary', '#ff0055');
                root.style.setProperty('--primary-rgb', '255, 0, 85');
                root.style.setProperty('--primary-hover', '#e6004d');
                root.style.setProperty('--secondary', '#8000ff');
                root.style.setProperty('--accent', '#ffaa00');
                root.style.setProperty('--glow-color', 'rgba(255, 0, 85, 0.35)');
                document.querySelector('.theme-btn[title="Crimson Matrix"]').classList.add('active');
                showToast("Accent theme set to Crimson Matrix");
            }
        }

        // 13. Neural Network Particle Background Canvas
        (function() {
            const canvas = document.getElementById('neuralCanvas');
            const saveData = navigator.connection?.saveData === true;
            if (prefersReducedMotion || saveData) {
                canvas.style.display = 'none';
                return;
            }
            const ctx = canvas.getContext('2d');
            
            let width = canvas.width = window.innerWidth;
            let height = canvas.height = window.innerHeight;
            
            let particles = [];
            let maxParticles = width < 768 ? 25 : 65;
            let connectionDist = width < 768 ? 85 : 115;
            
            const mouse = { x: null, y: null };
            document.addEventListener('mousemove', (e) => {
                mouse.x = e.clientX;
                mouse.y = e.clientY;
            }, { passive: true });
            document.addEventListener('mouseleave', () => {
                mouse.x = null;
                mouse.y = null;
            });
            
            let resizeTimeout;
            window.addEventListener('resize', () => {
                if (resizeTimeout) clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    width = canvas.width = window.innerWidth;
                    height = canvas.height = window.innerHeight;
                    const newMax = width < 768 ? 25 : 65;
                    connectionDist = width < 768 ? 85 : 115;
                    if (newMax !== maxParticles) {
                        maxParticles = newMax;
                        initParticles();
                    }
                }, 200);
            }, { passive: true });
            
            class Particle {
                constructor() {
                    this.x = Math.random() * width;
                    this.y = Math.random() * height;
                    this.vx = (Math.random() - 0.5) * 0.4;
                    this.vy = (Math.random() - 0.5) * 0.4;
                    this.r = Math.random() * 2 + 1;
                }
                
                update() {
                    this.x += this.vx;
                    this.y += this.vy;
                    
                    if (this.x < 0 || this.x > width) this.vx *= -1;
                    if (this.y < 0 || this.y > height) this.vy *= -1;
                }
                
                draw() {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                    const primaryColor = `rgb(${cachedPrimaryColor})`.trim();
                    ctx.fillStyle = primaryColor + '50';
                    ctx.fill();
                }
            }
            
            function initParticles() {
                particles = [];
                for (let i = 0; i < maxParticles; i++) {
                    particles.push(new Particle());
                }
            }
            initParticles();
            function animateParticles() {
                ctx.clearRect(0, 0, width, height);
                const primaryColor = `rgb(${cachedPrimaryColor})`.trim();
                
                particles.forEach(p => {
                    p.update();
                    p.draw();
                });
                
                for (let i = 0; i < particles.length; i++) {
                    const p1 = particles[i];
                    
                    if (mouse.x !== null && mouse.y !== null) {
                        const dx = p1.x - mouse.x;
                        const dy = p1.y - mouse.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < connectionDist + 30) {
                            ctx.beginPath();
                            ctx.moveTo(p1.x, p1.y);
                            ctx.lineTo(mouse.x, mouse.y);
                            ctx.strokeStyle = primaryColor + '12';
                            ctx.lineWidth = 0.8;
                            ctx.stroke();
                        }
                    }
                    
                    for (let j = i + 1; j < particles.length; j++) {
                        const p2 = particles[j];
                        const dx = p1.x - p2.x;
                        const dy = p1.y - p2.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        
                        if (dist < connectionDist) {
                            ctx.beginPath();
                            ctx.moveTo(p1.x, p1.y);
                            ctx.lineTo(p2.x, p2.y);
                            ctx.strokeStyle = primaryColor + '08';
                            ctx.lineWidth = 0.5;
                            ctx.stroke();
                        }
                    }
                }
                if (!document.hidden) { requestAnimationFrame(animateParticles); } else { document.addEventListener("visibilitychange", function resumeParticles() { if(!document.hidden) { document.removeEventListener("visibilitychange", resumeParticles); requestAnimationFrame(animateParticles); } }); }
            }
            animateParticles();
        })();
// --- NEW CREATIVE FEATURES & FIXES ---

// Lenis Smooth Scrolling
// Keep one animation owner. Lenis is manually driven by GSAP when both are available.
const lenis = !prefersReducedMotion && lenisConstructor && gsapApi && scrollTriggerApi
    ? new lenisConstructor({ autoRaf: false })
    : null;

if (lenis) {
    lenis.on('scroll', scrollTriggerApi.update);
    gsapApi.ticker.add((time) => lenis.raf(time * 1000));
    gsapApi.ticker.lagSmoothing(0);
}

const canRevealSections = Boolean(!prefersReducedMotion && gsapApi && scrollTriggerApi);

if (gsapApi && scrollTriggerApi) {
    gsapApi.registerPlugin(scrollTriggerApi);
}

if (canRevealSections) {
    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        el.classList.remove('reveal-on-scroll');
    });

    gsapApi.utils.toArray('.section-header').forEach(header => {
        const title = header.querySelector('.section-title');
        const subtitle = header.querySelector('.section-subtitle');

        if(title) {
            gsapApi.from(title, {
                scrollTrigger: {
                    trigger: header,
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                opacity: 0,
                y: 50,
                duration: 0.8,
                ease: "power3.out"
            });
        }

        if(subtitle) {
            gsapApi.from(subtitle, {
                scrollTrigger: {
                    trigger: header,
                    start: "top 85%",
                },
                opacity: 0,
                x: -50,
                duration: 0.6,
                delay: 0.2
            });
        }
    });
} else {
    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        el.classList.add('active');
    });
}

// Hero name animation
const heroName = document.querySelector('.hero-name');
if(heroName) {
    window.heroNameElement = heroName;
}

// Page Visibility API & Performance Fixes
document.addEventListener("visibilitychange", () => {
    if (!gsapApi) return;
    if (document.hidden) {
        gsapApi.globalTimeline.pause();
    } else {
        gsapApi.globalTimeline.play();
    }
});

// 8. Prompt Engineering Lab Logic
document.addEventListener('DOMContentLoaded', () => {
    const promptTabs = document.querySelectorAll('.prompt-tab');
    const promptCodeDisplay = document.getElementById('promptCodeDisplay');
    const copyPromptBtn = document.getElementById('copyPromptBtn');
    const copyPromptText = document.getElementById('copyPromptText');

    const promptsData = {
        data: '"Act as a Senior Data Architect. I will provide you with unstructured JSON logs. Your task is to extract all nested features, handle missing data points by imputing the median where logical, and output a flattened, normalized CSV-compatible format suitable for XGBoost training. Provide only the resulting structure, no explanations."',
        analyze: '"Analyze the following time-series dataset. Identify any seasonal anomalies, trend shifts, or cyclic patterns. Generate a Python script using pandas and statsmodels to visualize the decomposition of these components. Focus on robust detection of outliers over 3 standard deviations."',
        optimize: '"You are an expert Machine Learning Engineer. Review the provided PyTorch neural network architecture. Optimize the model for inference latency without sacrificing more than 1% accuracy. Suggest quantization strategies, operator fusion techniques, and provide the updated forward pass code."'
    };

    if (promptTabs.length > 0) {
        promptTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                promptTabs.forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-pressed', 'false');
                });
                tab.classList.add('active');
                tab.setAttribute('aria-pressed', 'true');

                const promptKey = tab.getAttribute('data-prompt');
                promptCodeDisplay.style.animation = 'none';
                promptCodeDisplay.offsetHeight; /* trigger reflow */
                promptCodeDisplay.style.animation = null;
                promptCodeDisplay.textContent = promptsData[promptKey];
            });
        });

        copyPromptBtn.addEventListener('click', () => {
            const textToCopy = promptCodeDisplay.textContent;
            navigator.clipboard.writeText(textToCopy).then(() => {
                copyPromptBtn.classList.add('success');
                if (copyPromptText) copyPromptText.textContent = 'Copied!';
                const icon = copyPromptBtn.querySelector('i');
                if (icon) icon.className = 'fa-solid fa-check';

                setTimeout(() => {
                    copyPromptBtn.classList.remove('success');
                    if (copyPromptText) copyPromptText.textContent = 'Copy';
                    if (icon) icon.className = 'fa-regular fa-copy';
                }, 2000);
            }).catch(err => {
                console.error("Clipboard copy failed", err);
            });
        });
    }
});
