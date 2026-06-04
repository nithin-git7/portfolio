
// --- ELITE PRELOADER ---
document.body.style.overflow = 'hidden';
let counterElement = document.querySelector('.counter');
let preloaderObj = { value: 0 };

gsap.to(preloaderObj, {
    value: 100,
    duration: 2.5,
    ease: "power2.inOut",
    onUpdate: () => {
        counterElement.innerText = Math.round(preloaderObj.value) + '%';
    },
    onComplete: () => {
        gsap.to('.elite-preloader', {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
            duration: 1.2,
            ease: "expo.inOut",
            onComplete: () => {
                document.querySelector('.elite-preloader').remove();
                document.body.style.overflow = '';
                // Restart Hero Animations here
                if(window.heroNameSplitChars) {
                    gsap.fromTo(window.heroNameSplitChars, 
                        { opacity: 0, y: 100, rotateZ: () => Math.random() * 30 - 15 },
                        { opacity: 1, y: 0, rotateZ: 0, stagger: 0.03, duration: 1, ease: "power4.out" }
                    );
                }
            }
        });
    }
});


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
            
            // 1. Ambient Glow Tracking Mouse
            const mouseGlow = document.getElementById('mouseGlow');
            document.addEventListener('mousemove', (e) => {
                mouseGlow.style.left = e.clientX + 'px';
                mouseGlow.style.top = e.clientY + 'px';
            });

            // 2. Typing animation for Hero Title
            const titles = [
                "Machine Learning Intern",
                "Computer Science Undergraduate",
                "Artificial Intelligence Specialization",
                "Deep Learning Enthusiast"
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
            typeText();

            // 3. Floating Navbar Scroll Adjustments & Back To Top visibility
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
                            if (link.getAttribute('href') === `#${currentId}`) {
                                link.classList.add('active');
                            }
                        });
                    }
                });
            }, { threshold: 0.2, rootMargin: "-100px 0px -100px 0px" });
            sections.forEach(sec => sectionObserver.observe(sec));

            // Hardware-accelerated Scroll for Navbar/BackToTop
            let isScrolling = false;
            window.addEventListener('scroll', () => {
                if (!isScrolling) {
                    window.requestAnimationFrame(() => {
                        if (window.scrollY > 50) {
                            navbar.classList.add('scrolled');
                        } else {
                            navbar.classList.remove('scrolled');
                        }

                        if (window.scrollY > 500) {
                            backToTop.classList.add('show');
                        } else {
                            backToTop.classList.remove('show');
                        }
                        isScrolling = false;
                    });
                    isScrolling = true;
                }
            }, { passive: true });

            // 4. Mobile Menu Toggle
            const mobileToggle = document.getElementById('mobileToggle');
            const navMenu = document.getElementById('navMenu');
            
            mobileToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                const icon = mobileToggle.querySelector('i');
                if (navMenu.classList.contains('active')) {
                    icon.className = 'fa-solid fa-xmark';
                } else {
                    icon.className = 'fa-solid fa-bars-staggered';
                }
            });

            // Close mobile menu when nav item clicked
            document.querySelectorAll('.nav-item a').forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    mobileToggle.querySelector('i').className = 'fa-solid fa-bars-staggered';
                });
            });

            // 5. Skills Grid Filter & Bar Animation trigger
            const filterBtns = document.querySelectorAll('.filter-btn');
            const skillItems = document.querySelectorAll('.skill-item');
            
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
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
        }

        // 9. Scroll to Top function
        function scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // 10. Contact Form Submission Upgraded Handler
        let lastMailtoData = null;

        function handleFormSubmit(e) {
            e.preventDefault();
            const name = document.getElementById('formName').value;
            const email = document.getElementById('formEmail').value;
            const subject = document.getElementById('formSubject').value;
            const message = document.getElementById('formMessage').value;
            
            const submitBtn = e.target.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Encrypting Message...';
            
            // Simulate secure backend transfer
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Message <i class="fa-regular fa-paper-plane"></i>';
                
                const transactionId = `ML-${Math.floor(Math.random() * 90000 + 10000)}`;
                
                // Store mailto info for fallback
                lastMailtoData = { name, email, subject, message };
                
                const detailsEl = document.getElementById('contactModalDetails');
                detailsEl.innerHTML = `
                    <strong>Sender Name:</strong> ${name}<br>
                    <strong>Reply-to Contact:</strong> ${email}<br>
                    <strong>Security Status:</strong> SSL Encrypted (256-bit)<br>
                    <strong>Secure Transaction ID:</strong> ${transactionId}<br>
                    <strong>Status Code:</strong> 200 OK / SUCCESS
                `;
                
                // Setup fallback mailto action
                document.getElementById('fallbackMailtoBtn').onclick = () => {
                    const mailtoUrl = `mailto:nithinpolavarapu@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("Name: " + name + "\nEmail: " + email + "\n\nMessage:\n" + message)}`;
                    window.location.href = mailtoUrl;
                };

                // Setup copy payload action
                document.getElementById('copyPayloadBtn').onclick = () => {
                    const payload = `INQUIRY DETAILS:\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}\n[Transaction logged under ID: ${transactionId}]`;
                    navigator.clipboard.writeText(payload)
                        .then(() => showToast("Message copied to clipboard!"))
                        .catch(() => showToast("Failed to copy message."));
                };

                // Open Success Modal
                document.getElementById('contactModal').classList.add('active');
                
                e.target.reset();

            }, 1500);
        }

        function closeContactModal() {
            document.getElementById('contactModal').classList.remove('active');
            showToast("Inquiry logged successfully!");
        }

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
            if (panel.classList.contains('active')) {
                icon.className = 'fa-solid fa-square-minus';
                text.textContent = 'Close Demo';
                panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                icon.className = 'fa-solid fa-play';
                text.textContent = 'Simulation';
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
            progContainer.style.display = 'block';
            progressBar.style.width = '0%';
            resultEl.classList.remove('active');
            btn.disabled = true;
            btn.style.opacity = '0.5';

            const selectedSource = select.options[select.selectedIndex].text;
            
            const logs = [
                { text: `[INFO] Initializing enterprise connection...`, type: 'info', delay: 200 },
                { text: `[INFO] Ingesting source: "${selectedSource}"`, type: 'info', delay: 600 },
                { text: `[SUCCESS] Established secure read-only DB connection pipeline.`, type: 'success', delay: 1000 },
                { text: `[INFO] Executing ETL preprocess modules (imputing Nulls, normalizing scales)...`, type: 'info', delay: 1500 },
                { text: `[INFO] Feeding tabular dimensions to gradient boosted ensemble...`, type: 'info', delay: 2200 },
                { text: `[SUCCESS] Feature weights evaluated. Target vector predicted.`, type: 'success', delay: 2800 },
                { text: `[SUCCESS] Pipeline executed successfully in 2.89s.`, type: 'success', delay: 3000 }
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
                        <div class="playground-metric"><span>RÂ² Regression Score:</span><strong>0.942</strong></div>
                        <div class="playground-metric"><span>Predicted Sales Trend (Next Qtr):</span><strong>+12.4%</strong></div>
                        <div class="playground-metric"><span>Anomalous Transaction Flags:</span><strong>0 detected</strong></div>
                    `;
                } else if (select.value === 'churn') {
                    metricsHTML = `
                        <div class="playground-metric"><span>Customer Churn Risk Level:</span><strong style="color:var(--primary)">LOW (11.8%)</strong></div>
                        <div class="playground-metric"><span>Classifier Accuracy:</span><strong>89.6%</strong></div>
                        <div class="playground-metric"><span>Top Churn Vector:</span><strong>Support Response Latency</strong></div>
                    `;
                } else {
                    metricsHTML = `
                        <div class="playground-metric"><span>Inbound Campaign Click Prediction:</span><strong>+8.7% CTR</strong></div>
                        <div class="playground-metric"><span>Ad spend optimization advice:</span><strong>Reallocate budget to Social channels</strong></div>
                        <div class="playground-metric"><span>Confidence Interval:</span><strong>95%</strong></div>
                    `;
                }
                metricsEl.innerHTML = metricsHTML;
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
            progContainer.style.display = 'block';
            progressBar.style.width = '0%';
            resultEl.classList.remove('active');
            btn.disabled = true;
            btn.style.opacity = '0.5';

            const logs = [
                { text: `[INFO] Diagnostic pipeline initialized...`, type: 'info', delay: 200 },
                { text: `[INFO] Checking input vectors: [Age: ${age}, RestHR: ${hr}, BP: ${bp}]`, type: 'info', delay: 500 },
                { text: `[INFO] Aligning features with training data structure...`, type: 'info', delay: 1000 },
                { text: `[INFO] Feeding input vector to diagnostic classifiers (Random Forest & XGBoost)...`, type: 'info', delay: 1600 },
                { text: `[SUCCESS] Output probabilities generated. Writing audit logs.`, type: 'success', delay: 2200 },
                { text: `[SUCCESS] Audit transaction logged to MongoDB (Record #DX-${Math.floor(Math.random() * 900000 + 100000)}).`, type: 'success', delay: 2600 }
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
                
                let risk = 12.5;
                if (bp > 140) risk += 25.5;
                if (hr > 90) risk += 18.2;
                if (age > 60) risk += 15.0;
                
                let status = risk > 50 ? "ELEVATED RISK" : "NORMAL / STABLE";
                let statusColor = risk > 50 ? "var(--accent)" : "var(--primary)";
                
                metricsEl.innerHTML = `
                    <div class="playground-metric"><span>Disease Probability Vector:</span><strong style="color:${statusColor}">${risk.toFixed(1)}% (${status})</strong></div>
                    <div class="playground-metric"><span>Classifier Confidence Level:</span><strong>96.4%</strong></div>
                    <div class="playground-metric"><span>XGBoost Classification output:</span><strong>Class 0 (Negative)</strong></div>
                    <div class="playground-metric"><span>MongoDB Audit State:</span><strong style="color:var(--primary)">COMMITTED</strong></div>
                `;
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
            progContainer.style.display = 'block';
            progressBar.style.width = '0%';
            resultEl.classList.remove('active');
            btn.disabled = true;
            btn.style.opacity = '0.5';

            const logs = [
                { text: `[INFO] Tokenizer initialized. Encoding prompt input...`, type: 'info', delay: 100 },
                { text: `[INFO] Seed encoded to token array ID: [${Array.from({length: 4}, () => Math.floor(Math.random() * 8000)).join(', ')}]`, type: 'info', delay: 400 },
                { text: `[INFO] PyTorch inference loaded. Allocating GPU memory tensors...`, type: 'info', delay: 800 },
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
                        p.textContent = `[INFERENCE] Pred Token #${idx+1}: "${token.trim()}" (prob: ${(Math.random() * 0.2 + 0.78).toFixed(3)})`;
                        consoleEl.appendChild(p);
                        consoleEl.scrollTop = consoleEl.scrollHeight;

                        if (idx === tokens.length - 1) {
                            btn.disabled = false;
                            btn.style.opacity = '1';
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
const lenis = new Lenis({
    autoRaf: true,
});

// Sync Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger, SplitText);

// 1. Cinematic Scroll Reveals (GSAP)
document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    // We just remove the class since GSAP will handle it
    el.classList.remove('reveal-on-scroll');
});

// Section Headers Stagger
gsap.utils.toArray('.section-header').forEach(header => {
    const title = header.querySelector('.section-title');
    const subtitle = header.querySelector('.section-subtitle');
    
    if(title) {
        const splitTitle = new SplitText(title, {type: "words,chars"});
        gsap.from(splitTitle.chars, {
            scrollTrigger: {
                trigger: header,
                start: "top 85%",
                toggleActions: "play none none none"
            },
            opacity: 0,
            y: 50,
            rotateX: -90,
            stagger: 0.05,
            duration: 0.8,
            ease: "back.out(1.7)"
        });
    }
    
    if(subtitle) {
        gsap.from(subtitle, {
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

// 2. Hero Name SplitText
const heroName = document.querySelector('.hero-name');
if(heroName) {
    const splitHero = new SplitText(heroName, {type: "chars"});
    window.heroNameSplitChars = splitHero.chars;
    // Hero animation moved to preloader complete
}

// 3. Vanilla Tilt for Glass Cards
if (window.VanillaTilt) {
    VanillaTilt.init(document.querySelectorAll(".glass-card"), {
        max: 10,
        speed: 400,
        glare: true,
        "max-glare": 0.2,
        perspective: 1000,
        gyroscope: true
    });
}

// 4. Custom Cursor Follower
const cursor = document.createElement('div');
cursor.classList.add('custom-cursor');
document.body.appendChild(cursor);

let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// 5. Magnetic Buttons
document.querySelectorAll('.btn, .social-circle-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    btn.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        gsap.to(btn, {x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)"});
    });
    
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, {x: x * 0.3, y: y * 0.3, duration: 0.1});
    });
});

// Elite Hover states for cursor
document.querySelectorAll('a, .btn, .skill-item').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

document.querySelectorAll('[data-cursor]').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('text-mode');
        cursor.innerText = el.getAttribute('data-cursor');
    });
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('text-mode');
        cursor.innerText = '';
    });
});

// Custom cursor loop
function cursorLoop() {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    requestAnimationFrame(cursorLoop);
}
cursorLoop();

// 6. Horizontal Scroll Project Gallery
const gallery = document.querySelector('.projects-gallery');
const wrapper = document.querySelector('.projects-gallery-wrapper');
if (gallery && wrapper && window.innerWidth > 768) {
    let scrollTween = gsap.to(gallery, {
        x: () => -(gallery.scrollWidth - window.innerWidth + 100) + "px",
        ease: "none",
        scrollTrigger: {
            trigger: wrapper,
            pin: true,
            scrub: 1,
            start: "center center",
            end: () => "+=" + gallery.scrollWidth
        }
    });
}

// 7. Page Visibility API & Performance Fixes
// Pause everything when tab is hidden
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        gsap.globalTimeline.pause();
    } else {
        gsap.globalTimeline.play();
    }
});
