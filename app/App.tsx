import { FormEvent, type ReactNode, useEffect, useState } from 'react';
import {
  AnimatePresence,
  MotionConfig,
  motion,
} from 'motion/react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  Download,
  Menu,
  X,
} from 'lucide-react';
import { AnimatedGroup } from '@/components/motion-primitives/animated-group';
import { Magnetic } from '@/components/motion-primitives/magnetic';
import {
  MorphingDialog,
  MorphingDialogClose,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogDescription,
  MorphingDialogImage,
  MorphingDialogSubtitle,
  MorphingDialogTitle,
  MorphingDialogTrigger,
} from '@/components/motion-primitives/morphing-dialog';
import { ScrollProgress } from '@/components/motion-primitives/scroll-progress';
import { Spotlight } from '@/components/motion-primitives/spotlight';
import { TextEffect } from '@/components/motion-primitives/text-effect';
import { TransitionPanel } from '@/components/motion-primitives/transition-panel';

const BASE = '/Portfolio';

const projectPanels = [
  {
    index: '01',
    label: 'Control room',
    title: 'Turn uncertainty into a plan.',
    body: 'Programs, APS, uni-assist, documents, finance, visa preparation, and arrival become one navigable workflow.',
    image: `${BASE}/assets/clearpath-home.jpg`,
    alt: 'ClearPath Germany landing page and application control room',
    caption: 'The product frames a complicated journey around the next best action.',
  },
  {
    index: '02',
    label: 'Roadmap builder',
    title: 'Put proof beside every decision.',
    body: 'Critical facts stay connected to official sources so students can verify requirements before they commit time or money.',
    image: `${BASE}/assets/clearpath-roadmap.jpg`,
    alt: 'ClearPath Germany roadmap builder with application stages',
    caption: 'Source-aware planning keeps the roadmap useful when requirements change.',
  },
];

const memoryModes = [
  {
    key: 'retain',
    control: 'Retain',
    verb: 'Keep',
    title: 'Useful context stays available.',
    description: 'Preserve facts that change future decisions or prevent repeated work.',
    signal: 'durable signal',
  },
  {
    key: 'retrieve',
    control: 'Retrieve',
    verb: 'Recall',
    title: 'Relevant context returns on demand.',
    description: 'Bring back only what the current task can use, at the moment it is needed.',
    signal: 'task match',
  },
  {
    key: 'forget',
    control: 'Let go',
    verb: 'Release',
    title: 'Noise leaves the working set.',
    description: 'Drop stale, duplicated, or low-value context before it obscures the decision.',
    signal: 'low utility',
  },
] as const;

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function ExternalArrow() {
  return <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.8} />;
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    document.body.classList.add('menu-open');
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.classList.remove('menu-open');
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <nav className="site-nav shell" aria-label="Primary navigation">
        <a className="wordmark" href="#home" aria-label="nithin.ai, Nithin Polavarapu home" onClick={closeMenu}>
          nithin<span>.ai</span>
        </a>

        <div className="desktop-nav">
          <a href="#work">Work</a>
          <a href="#research">Research</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <a className="resume-link" href={`${BASE}/Nithin_Polavarapu_JobResume.pdf`} download>
            Resume <Download aria-hidden="true" size={14} />
          </a>
        </div>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span>{menuOpen ? 'Close' : 'Menu'}</span>
          {menuOpen ? <X aria-hidden="true" size={18} /> : <Menu aria-hidden="true" size={18} />}
        </button>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              id="mobile-navigation"
              className="mobile-nav"
              initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0 round 18px)' }}
              animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0 round 18px)' }}
              exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0 round 18px)' }}
              transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            >
              {['Work', 'Research', 'About', 'Contact'].map((label, index) => (
                <motion.a
                  key={label}
                  href={`#${label.toLowerCase()}`}
                  onClick={closeMenu}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 + index * 0.04 }}
                >
                  <span>0{index + 1}</span>{label}
                </motion.a>
              ))}
              <a className="mobile-resume" href={`${BASE}/Nithin_Polavarapu_JobResume.pdf`} download onClick={closeMenu}>
                Download resume <Download aria-hidden="true" size={16} />
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero shell" id="home" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="hero-kicker"><span aria-hidden="true" /> Nithin Polavarapu / AI product builder</p>
        <h1 id="hero-title" className="hero-title">Useful AI,<br />shaped for action.</h1>
        <TextEffect as="p" className="hero-intro" per="word" preset="fade" speedReveal={1.5}>
          I turn uncertain workflows into clear products, useful models, and verifiable next steps.
        </TextEffect>

        <AnimatedGroup className="hero-actions" preset="blur-slide">
          <Magnetic intensity={0.22} range={90}>
            <a className="button button-primary" href="#work">
              Explore selected work <ArrowDownRight aria-hidden="true" size={17} />
            </a>
          </Magnetic>
          <a className="text-action" href={`${BASE}/Nithin_Polavarapu_JobResume.pdf`} download>
            Download resume <Download aria-hidden="true" size={15} />
          </a>
        </AnimatedGroup>

        <AnimatedGroup className="hero-proof" preset="fade">
          <span>Product systems</span>
          <span>ML workflows</span>
          <span>Information design</span>
        </AnimatedGroup>
      </div>

      <motion.figure
        className="portrait-stage"
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      >
        <Spotlight className="portrait-spotlight" size={420} />
        <div className="portrait-grid" aria-hidden="true" />
        <div className="portrait-number" aria-hidden="true">NP</div>
        <img
          src={`${BASE}/profile.webp`}
          alt="Nithin Polavarapu"
          width="950"
          height="1024"
          fetchPriority="high"
          decoding="async"
        />
        <figcaption>
          <span>Vijayawada, India</span>
          <span>Open to product and ML roles</span>
        </figcaption>
      </motion.figure>
    </section>
  );
}

function ProjectMedia({ activeIndex }: { activeIndex: number }) {
  return (
    <TransitionPanel
      className="project-transition"
      activeIndex={activeIndex}
      variants={{
        enter: { opacity: 0, y: 16, filter: 'blur(8px)' },
        center: { opacity: 1, y: 0, filter: 'blur(0px)' },
        exit: { opacity: 0, y: -12, filter: 'blur(6px)' },
      }}
      transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
    >
      {projectPanels.map((panel) => (
        <MorphingDialog key={panel.label} transition={{ type: 'spring', stiffness: 220, damping: 26 }}>
          <MorphingDialogTrigger className="media-trigger" aria-label={`Expand view: ${panel.label}`}>
            <div className="browser-frame">
              <div className="browser-bar" aria-hidden="true">
                <div className="browser-dots"><span /><span /><span /></div>
                <div className="browser-address">clearpath-gilt.vercel.app</div>
                <span className="browser-secure">Live</span>
              </div>
              <MorphingDialogImage src={panel.image} alt={panel.alt} className="project-image" loading="lazy" decoding="async" />
              <div className="media-open"><span>Expand view</span><ExternalArrow /></div>
            </div>
          </MorphingDialogTrigger>

          <MorphingDialogContainer>
            <MorphingDialogContent className="project-dialog">
              <MorphingDialogClose className="dialog-close" />
              <MorphingDialogTitle className="dialog-heading">
                <span>{panel.label}</span>
                <h3>{panel.title}</h3>
              </MorphingDialogTitle>
              <MorphingDialogSubtitle className="dialog-subtitle">ClearPath Germany</MorphingDialogSubtitle>
              <MorphingDialogDescription className="dialog-description" disableLayoutAnimation>
                <MorphingDialogImage src={panel.image} alt={panel.alt} className="dialog-image" loading="lazy" decoding="async" />
                <p>{panel.caption}</p>
              </MorphingDialogDescription>
            </MorphingDialogContent>
          </MorphingDialogContainer>
        </MorphingDialog>
      ))}
    </TransitionPanel>
  );
}

function SourceboundProject() {
  return (
    <article className="sourcebound-project" id="sourcebound" aria-labelledby="sourcebound-title">
      <Reveal className="sourcebound-copy">
        <p className="section-index">Project 02 / Research infrastructure</p>
        <h3 id="sourcebound-title">Research that leaves a trail.</h3>
        <p>
          Sourcebound searches independent providers, preserves source-specific evidence,
          and verifies claim support before it presents a cited report. Version 0.2 adds
          asynchronous jobs, run telemetry, optional semantic review, and live public retrieval.
        </p>

        <div className="sourcebound-actions">
          <a className="button button-primary" href={`${BASE}/sourcebound/`}>
            Explore the trace <ArrowUpRight aria-hidden="true" size={17} />
          </a>
          <a
            className="inline-link"
            href="https://github.com/nithin-git7/sourcebound-research-agent"
            target="_blank"
            rel="noopener noreferrer"
          >
            View the repository <ExternalArrow />
          </a>
        </div>

        <dl className="sourcebound-evidence" aria-label="Verified release evidence">
          <div><dt>Tests</dt><dd>77 passing</dd></div>
          <div><dt>Benchmark</dt><dd>25 cases</dd></div>
          <div><dt>Live demo</dt><dd>2 public providers</dd></div>
        </dl>
      </Reveal>

      <Reveal className="sourcebound-media" delay={0.1}>
        <a className="browser-frame sourcebound-frame" href={`${BASE}/sourcebound/`} aria-label="Open the Sourcebound research trace viewer">
          <div className="browser-bar" aria-hidden="true">
            <div className="browser-dots"><span /><span /><span /></div>
            <div className="browser-address">nithin-git7.github.io/Portfolio/sourcebound</div>
            <span className="browser-secure">Trace</span>
          </div>
          <img
            className="sourcebound-image"
            src={`${BASE}/assets/sourcebound-trace.png`}
            alt="Sourcebound evidence lab showing a six-stage, citation-grounded research trace"
            width="1440"
            height="2875"
            loading="lazy"
            decoding="async"
          />
          <div className="media-open"><span>Open case study</span><ExternalArrow /></div>
        </a>
        <p className="sourcebound-caption">
          Run a question against Wikipedia and OpenAlex in the browser, then inspect the
          evidence trail. A deterministic sample remains available for reproducible review.
        </p>
      </Reveal>

      <Reveal className="sourcebound-proof" delay={0.12}>
        <div className="sourcebound-proof-intro">
          <h4>Watch the evidence trail.</h4>
          <p>A computer-controlled walkthrough of the real interface, from bounded query planning to visible support gaps. The case study now also supports live public retrieval.</p>
        </div>

        <video
          className="sourcebound-video"
          controls
          muted
          loop
          playsInline
          preload="metadata"
          poster={`${BASE}/assets/sourcebound-demo-frames/08-verification.png`}
          aria-label="Automated walkthrough of the Sourcebound research trace"
        >
          <source src={`${BASE}/assets/sourcebound-walkthrough.webm`} type="video/webm" />
          Your browser does not support the Sourcebound walkthrough video.
        </video>

        <div className="sourcebound-proof-grid" aria-label="Sourcebound proof-of-work screenshots">
          <figure>
            <img src={`${BASE}/assets/sourcebound-demo-frames/04-providers.png`} alt="Sourcebound provider health stage with four successful research providers" width="1536" height="864" loading="lazy" decoding="async" />
            <figcaption>Provider health and independent perspectives</figcaption>
          </figure>
          <figure>
            <img src={`${BASE}/assets/sourcebound-demo-frames/05-evidence.png`} alt="Sourcebound evidence stage with source-specific passages and provenance" width="1536" height="864" loading="lazy" decoding="async" />
            <figcaption>Source-owned passages with offsets and provenance</figcaption>
          </figure>
          <figure>
            <img src={`${BASE}/assets/sourcebound-demo-frames/06-claims.png`} alt="Sourcebound claims stage mapping conclusions to citation identifiers" width="1536" height="864" loading="lazy" decoding="async" />
            <figcaption>Claims mapped to clickable citation sets</figcaption>
          </figure>
          <figure>
            <img src={`${BASE}/assets/sourcebound-demo-frames/08-verification.png`} alt="Sourcebound verification stage exposing support coverage and partial claims" width="1536" height="864" loading="lazy" decoding="async" />
            <figcaption>Final support report with partial coverage visible</figcaption>
          </figure>
        </div>
      </Reveal>
    </article>
  );
}

function Work() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="work section-space" id="work" aria-labelledby="work-title">
      <div className="shell">
        <Reveal className="section-heading work-heading">
          <div>
            <p className="section-index">01 / Selected work</p>
            <h2 id="work-title">Two systems.<br />Built for decisions.</h2>
          </div>
          <div className="section-summary">
            <p>ClearPath organizes a high-stakes application journey. Sourcebound makes multi-source AI research inspectable and citation-grounded.</p>
            <a className="inline-link" href="https://clearpath-gilt.vercel.app/" target="_blank" rel="noopener noreferrer">
              Open the live product <ExternalArrow />
            </a>
          </div>
        </Reveal>

        <div className="project-layout">
          <Reveal className="project-controls" delay={0.05}>
            <div className="project-heading">
              <span>Project 01 / Student decision system</span>
              <h3>ClearPath Germany</h3>
            </div>
            <div className="project-meta">
              <span>Role</span><p>Product, interface, implementation</p>
              <span>Stack</span><p>Next.js, FastAPI, Python</p>
            </div>

            <div className="project-tabs" role="tablist" aria-label="ClearPath product views">
              {projectPanels.map((panel, index) => (
                <button
                  key={panel.label}
                  type="button"
                  role="tab"
                  aria-selected={activeIndex === index}
                  aria-controls="project-panel"
                  className={activeIndex === index ? 'is-active' : ''}
                  onClick={() => setActiveIndex(index)}
                >
                  <span className="tab-index">{panel.index}</span>
                  <span className="tab-copy">
                    <strong>{panel.title}</strong>
                    <small>{panel.body}</small>
                  </span>
                  <motion.span
                    className="tab-indicator"
                    animate={{ scaleX: activeIndex === index ? 1 : 0 }}
                    transition={{ duration: 0.35 }}
                  />
                </button>
              ))}
            </div>

            <div className="project-outcome">
              <Check aria-hidden="true" size={16} />
              <p><strong>Make the next action obvious.</strong> Weekly priorities, saved programs, applications, and finance stay in one working view.</p>
            </div>
          </Reveal>

          <Reveal className="project-media" delay={0.12}>
            <div id="project-panel" role="tabpanel" aria-live="polite">
              <ProjectMedia activeIndex={activeIndex} />
              <p className="project-caption">
                <span>{projectPanels[activeIndex].label}</span>
                {projectPanels[activeIndex].caption}
              </p>
            </div>
          </Reveal>
        </div>

        <SourceboundProject />
      </div>
    </section>
  );
}

function MemoryVisual({ mode }: { mode: typeof memoryModes[number]['key'] }) {
  const nodeCount = mode === 'retain' ? 4 : mode === 'retrieve' ? 3 : 2;

  return (
    <div className={`memory-visual mode-${mode}`} aria-hidden="true">
      <div className="memory-input">
        <span>Current task</span>
        {[0, 1, 2, 3, 4].map((node) => <i key={node} />)}
      </div>
      <motion.div
        className="memory-core"
        layout
        transition={{ type: 'spring', stiffness: 220, damping: 24 }}
      >
        <span>{memoryModes.find((item) => item.key === mode)?.verb}</span>
        <small>decision layer</small>
      </motion.div>
      <div className="memory-path">
        <motion.span
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <div className="memory-output">
        {Array.from({ length: nodeCount }).map((_, node) => (
          <motion.i
            key={node}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: node * 0.07 }}
          />
        ))}
      </div>
    </div>
  );
}

function Research() {
  const [activeMode, setActiveMode] = useState(0);

  return (
    <section className="research section-space" id="research" aria-labelledby="research-title">
      <div className="shell research-layout">
        <Reveal className="research-copy">
          <p className="section-index">02 / Private research build</p>
          <h2 id="research-title">Context should earn its place.</h2>
          <p className="research-lead">An anti-memory experiment for deciding what an AI agent should retain, retrieve, or let go of as work moves across tasks.</p>
          <p className="research-note">This is a concept model, not a claimed production result.</p>
        </Reveal>

        <Reveal className="memory-lab" delay={0.1}>
          <Spotlight className="lab-spotlight" size={360} />
          <div className="lab-head">
            <div><span>Selective memory model</span><small>Interactive concept</small></div>
            <span className="lab-status"><i aria-hidden="true" /> Explore</span>
          </div>

          <div id="memory-panel" role="tabpanel">
            <TransitionPanel
              className="memory-transition"
              activeIndex={activeMode}
              variants={{
                enter: { opacity: 0, y: 12, filter: 'blur(6px)' },
                center: { opacity: 1, y: 0, filter: 'blur(0px)' },
                exit: { opacity: 0, y: -8, filter: 'blur(4px)' },
              }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              {memoryModes.map((mode) => (
                <div className="memory-panel" key={mode.key}>
                  <MemoryVisual mode={mode.key} />
                  <div className="memory-result">
                    <span>{mode.signal}</span>
                    <h3>{mode.title}</h3>
                    <p>{mode.description}</p>
                  </div>
                </div>
              ))}
            </TransitionPanel>
          </div>

          <div className="memory-controls" role="tablist" aria-label="Explore memory decisions">
            {memoryModes.map((mode, index) => (
              <button
                key={mode.key}
                type="button"
                role="tab"
                aria-selected={activeMode === index}
                aria-controls="memory-panel"
                className={activeMode === index ? 'is-active' : ''}
                onClick={() => setActiveMode(index)}
              >
                {mode.control}
              </button>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Capabilities() {
  return (
    <section className="capabilities section-space" aria-labelledby="capabilities-title">
      <div className="shell">
        <Reveal className="section-heading capability-heading">
          <div>
            <p className="section-index">03 / Working range</p>
            <h2 id="capabilities-title">Capability, tied to evidence.</h2>
          </div>
          <p>No percentage bars. Each capability points to the kind of work where it is being used.</p>
        </Reveal>

        <div className="capability-grid">
          <Reveal className="capability-main">
            <Spotlight className="capability-spotlight" size={440} />
            <div className="capability-top"><span>01</span><span>Product systems</span></div>
            <h3>Make complex work feel navigable.</h3>
            <p>Roadmaps, deadlines, comparisons, source quality, and decision-oriented interfaces in ClearPath Germany.</p>
            <div className="capability-stack"><span>Next.js</span><span>FastAPI</span><span>Python</span></div>
            <div className="system-lines" aria-hidden="true"><i /><i /><i /><i /></div>
          </Reveal>

          <Reveal className="capability-side capability-ml" delay={0.06}>
            <div className="capability-top"><span>02</span><span>ML workflows</span></div>
            <h3>Build the model around the decision.</h3>
            <p>Preprocessing, supervised learning, evaluation, neural networks, and inference prototypes.</p>
            <div className="capability-stack"><span>PyTorch</span><span>TensorFlow</span><span>scikit-learn</span></div>
          </Reveal>

          <Reveal className="capability-side capability-data" delay={0.12}>
            <div className="capability-top"><span>03</span><span>Data and delivery</span></div>
            <h3>Carry the idea into a usable product.</h3>
            <p>Structured data, MongoDB and SQL concepts, Git workflows, and deployable web products.</p>
            <div className="capability-stack"><span>MongoDB</span><span>MySQL</span><span>Git</span></div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="about section-space" id="about" aria-labelledby="about-title">
      <div className="shell about-layout">
        <Reveal className="about-statement">
          <p className="section-index">04 / Approach</p>
          <h2 id="about-title">I build around the decision.</h2>
          <p>My work sits between machine learning, product thinking, and careful information design. I start with what a person or agent needs to decide, then shape the model and interface around that moment.</p>
          <div className="about-links">
            <a className="inline-link" href="https://github.com/nithin-git7" target="_blank" rel="noopener noreferrer">GitHub <ExternalArrow /></a>
            <a className="inline-link" href="https://in.linkedin.com/in/nithin-polavarapu-2291832a2" target="_blank" rel="noopener noreferrer">LinkedIn <ExternalArrow /></a>
          </div>
        </Reveal>

        <Reveal className="experience-list" delay={0.08}>
          <article>
            <time dateTime="2026-01">Jan 2026 - Apr 2026</time>
            <div><h3>Machine Learning Intern</h3><p>CodTech IT Solutions</p></div>
          </article>
          <article>
            <time dateTime="2025-05">May 2025 - Jun 2025</time>
            <div><h3>Machine Learning Intern</h3><p>Micro Information Technology Services</p></div>
          </article>
          <article>
            <time dateTime="2022">2022 - 2026</time>
            <div><h3>B.Tech, Computer Science (AI and ML)</h3><p>Parul University / 7.76 CGPA</p></div>
          </article>
          <article>
            <time dateTime="2025">2025</time>
            <div><h3>Machine Learning Specialization</h3><p>Andrew Ng / Coursera</p></div>
          </article>
          <article>
            <time dateTime="2025">2025</time>
            <div><h3>Google Prompting Essentials</h3><p>Coursera</p></div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}

function Contact() {
  const [composed, setComposed] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') ?? '').trim();
    const email = String(form.get('email') ?? '').trim();
    const subject = String(form.get('subject') ?? '').trim();
    const message = String(form.get('message') ?? '').trim();
    const body = `Hi Nithin,\n\n${message}\n\nFrom: ${name} (${email})`;

    setComposed(true);
    window.location.href = `mailto:nithinpolavarapu@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section className="contact section-space" id="contact" aria-labelledby="contact-title">
      <div className="shell contact-layout">
        <Reveal className="contact-copy">
          <p className="section-index">05 / Contact</p>
          <h2 id="contact-title">Bring the difficult problem.</h2>
          <p>Share the context, what you have tried, and the decision you want to make clearer.</p>
          <a className="contact-email" href="mailto:nithinpolavarapu@gmail.com">nithinpolavarapu@gmail.com</a>
          <p className="contact-meta">Vijayawada, India / English, Telugu, beginner German</p>
        </Reveal>

        <Reveal className="contact-form-wrap" delay={0.08}>
          <form className="contact-form" onSubmit={onSubmit}>
            <div className="field-row">
              <label htmlFor="form-name">Name<input id="form-name" name="name" type="text" autoComplete="name" required /></label>
              <label htmlFor="form-email">Email<input id="form-email" name="email" type="email" autoComplete="email" required /></label>
            </div>
            <label htmlFor="form-subject">Subject<input id="form-subject" name="subject" type="text" required /></label>
            <label htmlFor="form-message">Message<textarea id="form-message" name="message" rows={5} required /></label>
            <div className="form-footer">
              <Magnetic intensity={0.16} range={80}>
                <button className="button button-contact" type="submit">Compose email <ExternalArrow /></button>
              </Magnetic>
              <p>This opens your email app. Nothing is stored here.</p>
            </div>
          </form>
        </Reveal>
      </div>

      <AnimatePresence>
        {composed && (
          <motion.div
            className="toast"
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
          >
            <Check aria-hidden="true" size={16} /> Email draft prepared
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <a className="wordmark" href="#home">nithin<span>.ai</span></a>
        <p>Practical AI systems, designed for action.</p>
        <p>© 2026 Nithin Polavarapu</p>
      </div>
    </footer>
  );
}

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <ScrollProgress className="scroll-progress" />
      <Header />
      <main id="main-content">
        <Hero />
        <Work />
        <Research />
        <Capabilities />
        <About />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  );
}
