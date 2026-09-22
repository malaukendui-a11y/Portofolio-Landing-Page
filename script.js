/**
 * ANANDA KENNY â€” MODERN LUXURY & 3D DESIGN PORTFOLIO JAVASCRIPT
 * Features: Three.js 3D WebGL Centerpiece, Project Result Modals, Lightbox, Carousel, Clipboard Toast
 * Language: 100% English
 */

document.addEventListener('DOMContentLoaded', () => {
    initPageLoader();
    initThreeJsHero();
    initNavbarScroll();
    initCampusCarousel();
    initMobileMenu();
    initScrollAnimations();
    initLanguageSwitcher();
});

/* ==========================================================================
   0. 3D ENTRY LOADER (brushed-metal knob + gold LED ring)
   ========================================================================== */
function initPageLoader() {
    const overlay = document.getElementById('pageLoader');
    const canvas = document.getElementById('loader-3d-canvas');
    const percentEl = document.getElementById('loaderPercent');
    if (!overlay) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const minDisplayMs = reduceMotion ? 400 : 2200;
    const hardTimeoutMs = 8000;
    const startedAt = performance.now();

    let visualProgress = 0;
    let targetProgress = 8;
    let pageReady = document.readyState === 'complete';
    let finished = false;
    let progressRafId = 0;
    let sceneRafId = 0;
    let renderer = null;
    let ledMeshes = [];
    let knobGroup = null;
    let sceneDisposed = false;

    const images = Array.from(document.images);
    const imageTotal = Math.max(images.length, 1);
    let imagesLoaded = 0;

    function markImageDone() {
        imagesLoaded += 1;
        if (!pageReady) {
            targetProgress = Math.min(88, 12 + (imagesLoaded / imageTotal) * 70);
        }
    }

    images.forEach((img) => {
        if (img.complete) {
            markImageDone();
        } else {
            img.addEventListener('load', markImageDone, { once: true });
            img.addEventListener('error', markImageDone, { once: true });
        }
    });

    window.addEventListener('load', () => {
        pageReady = true;
        targetProgress = 100;
    }, { once: true });

    if (pageReady) {
        targetProgress = 100;
    }

    function createBrushedMetalTexture() {
        const size = 512;
        const c = document.createElement('canvas');
        c.width = size;
        c.height = size;
        const ctx = c.getContext('2d');

        const radial = ctx.createRadialGradient(size / 2, size / 2, 8, size / 2, size / 2, size / 2);
        radial.addColorStop(0, '#cfcfd6');
        radial.addColorStop(0.22, '#b4b4bc');
        radial.addColorStop(0.5, '#8e8e98');
        radial.addColorStop(0.78, '#6a6a74');
        radial.addColorStop(1, '#4c4c54');
        ctx.fillStyle = radial;
        ctx.fillRect(0, 0, size, size);

        ctx.save();
        ctx.translate(size / 2, size / 2);
        for (let i = 0; i < 240; i++) {
            const a = (i / 240) * Math.PI * 2;
            ctx.strokeStyle = i % 3 === 0 ? 'rgba(255,255,255,0.16)' : 'rgba(20,20,24,0.18)';
            ctx.lineWidth = i % 7 === 0 ? 1.4 : 0.6;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(a) * size, Math.sin(a) * size);
            ctx.stroke();
        }
        ctx.restore();

        const highlight = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, 42);
        highlight.addColorStop(0, 'rgba(255,255,255,0.42)');
        highlight.addColorStop(0.4, 'rgba(255,255,255,0.12)');
        highlight.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = highlight;
        ctx.fillRect(0, 0, size, size);

        const tex = new THREE.CanvasTexture(c);
        tex.needsUpdate = true;
        return tex;
    }

    function buildScene() {
        if (!canvas || typeof THREE === 'undefined' || reduceMotion) return false;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(38, overlay.clientWidth / overlay.clientHeight, 0.1, 100);
        camera.position.set(0, 0.08, 7.4);

        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance'
        });
        renderer.setSize(overlay.clientWidth, overlay.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);

        knobGroup = new THREE.Group();
        knobGroup.rotation.x = 0.22;
        knobGroup.scale.set(0.86, 0.86, 0.86);
        scene.add(knobGroup);

        const metalMap = createBrushedMetalTexture();
        const knobGeo = new THREE.CylinderGeometry(1.12, 1.18, 0.42, 72);
        const knobMat = new THREE.MeshStandardMaterial({
            map: metalMap,
            metalness: 0.42,
            roughness: 0.38,
            color: 0xd5d5dc
        });
        const knob = new THREE.Mesh(knobGeo, knobMat);
        knob.rotation.x = Math.PI / 2;
        knobGroup.add(knob);

        const capGeo = new THREE.CircleGeometry(1.08, 72);
        const capMat = new THREE.MeshStandardMaterial({
            map: metalMap,
            metalness: 0.38,
            roughness: 0.32,
            color: 0xe4e4ea
        });
        const cap = new THREE.Mesh(capGeo, capMat);
        cap.position.z = 0.22;
        knobGroup.add(cap);

        const bezelGeo = new THREE.TorusGeometry(1.78, 0.11, 18, 96);
        const bezelMat = new THREE.MeshStandardMaterial({
            color: 0x161410,
            metalness: 0.35,
            roughness: 0.55
        });
        const bezel = new THREE.Mesh(bezelGeo, bezelMat);
        bezel.position.z = 0.02;
        knobGroup.add(bezel);

        const trackGeo = new THREE.TorusGeometry(1.78, 0.055, 12, 96);
        const trackMat = new THREE.MeshStandardMaterial({
            color: 0x1c1912,
            metalness: 0.25,
            roughness: 0.7,
            emissive: 0x000000,
            emissiveIntensity: 0
        });
        const track = new THREE.Mesh(trackGeo, trackMat);
        track.position.z = 0.08;
        knobGroup.add(track);

        const ledCount = 40;
        const litMat = new THREE.MeshStandardMaterial({
            color: 0xffd45a,
            emissive: 0xd4af37,
            emissiveIntensity: 0.95,
            metalness: 0.15,
            roughness: 0.4
        });
        const dimMat = new THREE.MeshStandardMaterial({
            color: 0x2a281f,
            emissive: 0x000000,
            emissiveIntensity: 0,
            metalness: 0.25,
            roughness: 0.7
        });
        const ledGeo = new THREE.BoxGeometry(0.16, 0.09, 0.07);

        for (let i = 0; i < ledCount; i++) {
            const mesh = new THREE.Mesh(ledGeo, dimMat.clone());
            mesh.userData.litMat = litMat;
            mesh.userData.dimMat = mesh.material;
            const angle = -Math.PI / 2 + (i / ledCount) * Math.PI * 2;
            const radius = 1.78;
            mesh.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0.14);
            mesh.rotation.z = angle;
            knobGroup.add(mesh);
            ledMeshes.push(mesh);
        }

        const tickMat = new THREE.MeshStandardMaterial({
            color: 0x6a6458,
            metalness: 0.6,
            roughness: 0.4
        });
        const tickCount = 48;
        for (let i = 0; i < tickCount; i++) {
            const isMajor = i % 12 === 0;
            const isMid = i % 4 === 0;
            const len = isMajor ? 0.38 : isMid ? 0.22 : 0.12;
            const tickGeo = new THREE.BoxGeometry(isMajor ? 0.018 : 0.01, len, 0.01);
            const tick = new THREE.Mesh(tickGeo, tickMat);
            const angle = -Math.PI / 2 + (i / tickCount) * Math.PI * 2;
            const r = 2.18 + len / 2;
            tick.position.set(Math.cos(angle) * r, Math.sin(angle) * r, 0.05);
            tick.rotation.z = angle - Math.PI / 2;
            knobGroup.add(tick);
        }

        scene.add(new THREE.AmbientLight(0xf2efe6, 1.05));
        const keyLight = new THREE.DirectionalLight(0xffffff, 0.85);
        keyLight.position.set(1.2, 2.4, 6);
        scene.add(keyLight);
        const goldLight = new THREE.PointLight(0xf5e29f, 1.8, 40);
        goldLight.position.set(2.4, 2.8, 5);
        scene.add(goldLight);
        const rimLight = new THREE.PointLight(0x9bb4d4, 1.1, 30);
        rimLight.position.set(-4, -1.2, 4);
        scene.add(rimLight);

        const clock = new THREE.Clock();

        function onResize() {
            if (!renderer || sceneDisposed) return;
            camera.aspect = overlay.clientWidth / overlay.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(overlay.clientWidth, overlay.clientHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }
        window.addEventListener('resize', onResize);

        function animateScene() {
            if (sceneDisposed) return;
            sceneRafId = requestAnimationFrame(animateScene);
            const t = clock.getElapsedTime();
            knobGroup.rotation.y = Math.sin(t * 0.55) * 0.12;
            knobGroup.rotation.x = 0.22 + Math.cos(t * 0.4) * 0.05;
            renderer.render(scene, camera);
        }
        animateScene();

        overlay._disposeLoaderScene = () => {
            sceneDisposed = true;
            cancelAnimationFrame(sceneRafId);
            window.removeEventListener('resize', onResize);
            ledMeshes.forEach((m) => {
                m.geometry.dispose();
                if (m.material && m.material.dispose) m.material.dispose();
            });
            scene.traverse((obj) => {
                if (obj.geometry) obj.geometry.dispose();
                if (obj.material) {
                    if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
                    else obj.material.dispose();
                }
            });
            metalMap.dispose();
            renderer.dispose();
            renderer = null;
        };

        return true;
    }

    function updateLeds(progress) {
        if (!ledMeshes.length) return;
        const litCount = Math.round((progress / 100) * ledMeshes.length);
        ledMeshes.forEach((mesh, i) => {
            const shouldLit = i < litCount;
            const nextMat = shouldLit ? mesh.userData.litMat : mesh.userData.dimMat;
            if (mesh.material !== nextMat) mesh.material = nextMat;
        });
    }

    function revealPage() {
        if (finished) return;
        finished = true;
        visualProgress = 100;
        if (percentEl) percentEl.textContent = '100%';
        updateLeds(100);

        overlay.classList.add('is-done');
        overlay.setAttribute('aria-busy', 'false');
        document.body.classList.remove('is-loading');

        window.setTimeout(() => {
            if (typeof overlay._disposeLoaderScene === 'function') {
                overlay._disposeLoaderScene();
            }
            overlay.remove();
        }, 800);
    }

    function tick() {
        if (finished) return;
        progressRafId = requestAnimationFrame(tick);

        const ease = pageReady ? 0.085 : 0.045;
        visualProgress += (targetProgress - visualProgress) * ease;
        if (pageReady && visualProgress > 99.2) visualProgress = 100;

        const shown = Math.floor(visualProgress);
        if (percentEl) percentEl.textContent = shown + '%';
        updateLeds(visualProgress);

        const elapsed = performance.now() - startedAt;
        const minMet = elapsed >= minDisplayMs;
        if (pageReady && visualProgress >= 100 && minMet) {
            cancelAnimationFrame(progressRafId);
            revealPage();
            return;
        }
        if (elapsed >= hardTimeoutMs) {
            targetProgress = 100;
            pageReady = true;
            cancelAnimationFrame(progressRafId);
            revealPage();
        }
    }

    try {
        buildScene();
    } catch (err) {
        console.warn('3D loader scene unavailable, continuing with progress overlay.', err);
    }
    tick();
}

/* ==========================================================================
   1. THREE.JS 3D LUXURY WEBGL CENTERPIECE
   ========================================================================== */
function initThreeJsHero() {
    const container = document.getElementById('webglContainer');
    const canvas = document.getElementById('hero-3d-canvas');
    if (!container || !canvas || typeof THREE === 'undefined') return;

    // Scene Setup
    const scene = new THREE.Scene();
    
    // Camera Setup
    const camera = new THREE.PerspectiveCamera(
        45, 
        container.clientWidth / container.clientHeight, 
        0.1, 
        1000
    );
    camera.position.set(0, 0, 8.5);

    // Renderer Setup
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Master 3D Group
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // Position group slightly to the right on desktop, center on mobile
    if (window.innerWidth > 1024) {
        masterGroup.position.set(2.4, 0.2, 0);
    } else {
        masterGroup.position.set(0, 0, 0);
    }

    // 1. Faceted Obsidian-Gold Luxury Icosahedron Jewel
    const jewelGeometry = new THREE.IcosahedronGeometry(2.1, 0);
    const jewelMaterial = new THREE.MeshStandardMaterial({
        color: 0x0c101d,
        metalness: 0.95,
        roughness: 0.15,
        flatShading: true,
        emissive: 0xd4af37,
        emissiveIntensity: 0.09
    });
    const jewelMesh = new THREE.Mesh(jewelGeometry, jewelMaterial);
    masterGroup.add(jewelMesh);

    // 2. Inner Golden Geometric Cage (Wireframe Core)
    const innerGeometry = new THREE.IcosahedronGeometry(1.65, 0);
    const innerMaterial = new THREE.MeshBasicMaterial({
        color: 0xF5E29F,
        wireframe: true,
        transparent: true,
        opacity: 0.45
    });
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    masterGroup.add(innerMesh);

    // 3. Central Golden Diamond Core
    const coreGeometry = new THREE.OctahedronGeometry(0.85, 0);
    const coreMaterial = new THREE.MeshStandardMaterial({
        color: 0xD4AF37,
        metalness: 1.0,
        roughness: 0.1,
        emissive: 0xD4AF37,
        emissiveIntensity: 0.3
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    masterGroup.add(coreMesh);

    // 4. Floating Celestial Orbital Rings (Luxury Astrolabe Aesthetic)
    const ringMaterial1 = new THREE.MeshBasicMaterial({
        color: 0xD4AF37,
        transparent: true,
        opacity: 0.4,
        wireframe: true
    });
    const ringGeometry1 = new THREE.TorusGeometry(3.1, 0.025, 16, 100);
    const ringMesh1 = new THREE.Mesh(ringGeometry1, ringMaterial1);
    ringMesh1.rotation.x = Math.PI / 3;
    masterGroup.add(ringMesh1);

    const ringMaterial2 = new THREE.MeshBasicMaterial({
        color: 0xF5E29F,
        transparent: true,
        opacity: 0.25,
        wireframe: true
    });
    const ringGeometry2 = new THREE.TorusGeometry(3.6, 0.018, 16, 100);
    const ringMesh2 = new THREE.Mesh(ringGeometry2, ringMaterial2);
    ringMesh2.rotation.y = Math.PI / 4;
    ringMesh2.rotation.z = Math.PI / 6;
    masterGroup.add(ringMesh2);

    // 5. Floating Gold Stardust Particles
    const particleCount = 280;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 16;
        positions[i + 1] = (Math.random() - 0.5) * 16;
        positions[i + 2] = (Math.random() - 0.5) * 10;
        particleScales[i / 3] = Math.random();
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
        color: 0xF5E29F,
        size: 0.06,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
    });
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambientLight);

    // Warm Champagne Gold Key Light
    const goldLight = new THREE.PointLight(0xF5E29F, 3.5, 50);
    goldLight.position.set(6, 8, 8);
    scene.add(goldLight);

    // Cool Platinum/Cyan Rim Light
    const rimLight = new THREE.PointLight(0x60A5FA, 1.8, 40);
    rimLight.position.set(-8, -5, -4);
    scene.add(rimLight);

    // Soft Bottom Warm Fill
    const fillLight = new THREE.PointLight(0xD4AF37, 1.5, 30);
    fillLight.position.set(0, -6, 5);
    scene.add(fillLight);

    // Mouse Interaction Gyro
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;

    window.addEventListener('mousemove', (e) => {
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;
        mouseX = (e.clientX - windowHalfX) / windowHalfX;
        mouseY = (e.clientY - windowHalfY) / windowHalfY;
    });

    // Touch Support for Mobile
    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            const windowHalfX = window.innerWidth / 2;
            const windowHalfY = window.innerHeight / 2;
            mouseX = (touch.clientX - windowHalfX) / windowHalfX;
            mouseY = (touch.clientY - windowHalfY) / windowHalfY;
        }
    }, { passive: true });

    // Animation Loop
    let clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Constant luxurious slow rotation
        jewelMesh.rotation.y += 0.005;
        jewelMesh.rotation.x += 0.003;

        innerMesh.rotation.y -= 0.008;
        innerMesh.rotation.z += 0.004;

        coreMesh.rotation.y += 0.012;
        coreMesh.rotation.x -= 0.009;

        ringMesh1.rotation.z += 0.003;
        ringMesh2.rotation.x -= 0.0025;

        // Floating particle slow drift
        particleSystem.rotation.y = elapsedTime * 0.015;
        particleSystem.rotation.x = Math.sin(elapsedTime * 0.02) * 0.05;

        // Mouse Gyro Interpolation (smooth Lerp)
        targetRotY = mouseX * 0.6;
        targetRotX = -mouseY * 0.45;

        masterGroup.rotation.y += (targetRotY - masterGroup.rotation.y) * 0.05;
        masterGroup.rotation.x += (targetRotX - masterGroup.rotation.x) * 0.05;

        // Gentle floating bob
        masterGroup.position.y = (window.innerWidth > 1024 ? 0.2 : 0) + Math.sin(elapsedTime * 1.2) * 0.12;

        renderer.render(scene, camera);
    }

    animate();

    // Window Resize Handler
    window.addEventListener('resize', () => {
        if (!container) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        if (window.innerWidth > 1024) {
            masterGroup.position.set(2.4, 0.2, 0);
        } else {
            masterGroup.position.set(0, 0, 0);
        }
    });
}

/* ==========================================================================
   2. NAVBAR SCROLL & ACTIVE STATE
   ========================================================================== */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    const navItems = document.querySelectorAll('.nav-links .nav-item');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        // Navbar blur enhancement
        if (scrollY > 50) {
            navbar.style.boxShadow = '0 20px 45px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
        } else {
            navbar.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08)';
        }

        // Active link tracking
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 140;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    });

    // Smooth scroll offset handling for CTA buttons
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const offset = 90;
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = targetEl.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const navLinks = document.getElementById('navLinks');
                const mobileToggle = document.getElementById('mobileToggle');
                if (navLinks && navLinks.classList.contains('mobile-open')) {
                    navLinks.classList.remove('mobile-open');
                    if (mobileToggle) mobileToggle.classList.remove('active');
                }
            }
        });
    });
}

/* ==========================================================================
   3. CAMPUS 3-PHOTO CAROUSEL
   ========================================================================== */
function initCampusCarousel() {
    const slides = document.querySelectorAll('#eduCarouselTrack .carousel-slide');
    const dots = document.querySelectorAll('#eduIndicators .indicator-dot');
    const prevBtn = document.getElementById('eduPrevBtn');
    const nextBtn = document.getElementById('eduNextBtn');
    const container = document.querySelector('.campus-carousel-viewport');

    if (!slides.length) return;

    let currentIndex = 0;
    let autoPlayInterval = null;

    function goToSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        currentIndex = index;
    }

    function nextSlide() {
        const nextIdx = (currentIndex + 1) % slides.length;
        goToSlide(nextIdx);
    }

    function prevSlide() {
        const prevIdx = (currentIndex - 1 + slides.length) % slides.length;
        goToSlide(prevIdx);
    }

    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => goToSlide(idx));
    });

    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 4500);
    }

    function stopAutoPlay() {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
    }

    startAutoPlay();

    if (container) {
        container.addEventListener('mouseenter', stopAutoPlay);
        container.addEventListener('mouseleave', startAutoPlay);
    }
}

/* ==========================================================================
   4. MOBILE MENU
   ========================================================================== */
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');

    if (!mobileToggle || !navLinks) return;

    mobileToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('mobile-open');
        mobileToggle.classList.toggle('active', isOpen);
    });

    // Close on clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileToggle.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('mobile-open');
            mobileToggle.classList.remove('active');
        }
    });
}

/* ==========================================================================
   5. SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    const animatedElements = document.querySelectorAll('.glass-card, .section-header, .responsibility-box');
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${ (index % 4) * 0.1 }s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${ (index % 4) * 0.1 }s`;
        observer.observe(el);
    });
}

/* ==========================================================================
   6. BILINGUAL LANGUAGE SWITCHER (ID / ENG)
   ========================================================================== */
let currentLang = localStorage.getItem('portfolio_lang') || 'en';
let activeProjectId = null;

function setLanguage(lang) {
    currentLang = lang === 'id' ? 'id' : 'en';
    localStorage.setItem('portfolio_lang', currentLang);
    document.documentElement.setAttribute('lang', currentLang);

    const optEn = document.getElementById('langOptEn');
    const optId = document.getElementById('langOptId');
    if (optEn && optId) {
        if (currentLang === 'id') {
            optEn.classList.remove('active');
            optId.classList.add('active');
        } else {
            optEn.classList.add('active');
            optId.classList.remove('active');
        }
    }

    // Update all elements with data-en and data-id
    document.querySelectorAll('[data-en][data-id]').forEach(el => {
        const text = currentLang === 'id' ? el.getAttribute('data-id') : el.getAttribute('data-en');
        if (text !== null) {
            el.innerHTML = text;
        }
    });

    // If project modal is active, update modal content live
    if (activeProjectId) {
        openProjectModal(activeProjectId);
    }
}

function initLanguageSwitcher() {
    const toggleBtn = document.getElementById('langToggleBtn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const nextLang = currentLang === 'en' ? 'id' : 'en';
            setLanguage(nextLang);
        });
    }

    // Initialize to stored or default language
    setLanguage(currentLang);
}

/* ==========================================================================
   7. DEDICATED PROJECT RESULT MODAL SYSTEM (Preserves aspect ratios)
   ========================================================================== */
const projectDatabase = {
    'scientific-research': {
        en: {
            role: 'Scientific Research (Lead Thesis)',
            resultType: 'Official PDF Document (1.76 MB)',
            mainTitle: 'Big Data Mining Analysis to Detect Cryptocurrency Patterns and Price Movement Trends: A Case Study of the Altcoin Market',
            subTitle: 'Analyzing large-scale cryptocurrency market transaction data using machine learning algorithms and comprehensive trend visualizations to accurately detect recurring altcoin price cycles and market behaviors.',
            deliverables: [
                'Large-scale historical dataset extraction and processing across major cryptocurrency exchanges.',
                'Algorithmic pattern clustering and price momentum trend visualizations.',
                'Machine learning model evaluations for predicting market volatility and cycle turning points.',
                'Comprehensive 5-chapter thesis paper defended and verified by university examiners.'
            ],
            actionLabel: 'Download Complete PDF Paper',
            scopeTitle: 'Project Scope &amp; Key Deliverables',
            resultsTitle: 'Results Review &amp; Artifacts',
            openTabLabel: 'Open Document in New Tab &rarr;'
        },
        id: {
            role: 'Riset Ilmiah (Skripsi Utama)',
            resultType: 'Dokumen PDF Resmi (1.76 MB)',
            mainTitle: 'Analisis Big Data Mining untuk Mendeteksi Pola dan Tren Pergerakan Harga Cryptocurrency: Studi Kasus Pasar Altcoin',
            subTitle: 'Menganalisis data transaksi pasar cryptocurrency berskala besar menggunakan algoritma machine learning dan visualisasi tren komprehensif untuk mendeteksi siklus harga altcoin yang berulang dan perilaku pasar secara akurat.',
            deliverables: [
                'Ekstraksi dan pemrosesan dataset historis berskala besar di berbagai bursa cryptocurrency terkemuka.',
                'Clustering pola algoritmik dan visualisasi tren momentum pergerakan harga.',
                'Evaluasi model machine learning untuk memprediksi volatilitas pasar dan titik pembalikan siklus.',
                'Skripsi komprehensif 5 bab yang telah diuji dan diverifikasi oleh dewan penguji universitas.'
            ],
            actionLabel: 'Unduh Dokumen Lengkap PDF',
            scopeTitle: 'Ruang Lingkup Proyek &amp; Hasil Utama',
            resultsTitle: 'Tinjauan Hasil &amp; Artefak',
            openTabLabel: 'Buka Dokumen di Tab Baru &rarr;'
        },
        previewType: 'pdf',
        previewSource: 'PI Ananda Final.pdf',
        actionUrl: 'PI Ananda Final.pdf'
    },
    'website-malau': {
        en: {
            role: 'Project Manager (In Progress)',
            resultType: 'Community Website & Genealogy Platform',
            mainTitle: 'Batak Malau Clan & Boru Family Genealogy Website',
            subTitle: 'Directing the end-to-end development and management of a comprehensive family genealogy tree (Tarombo) and community portal for the Batak Malau lineage across the Greater Jakarta region.',
            deliverables: [
                'Authored Software Requirements Specification (SRS) & system architecture for family record management.',
                'Engineered an interactive digital genealogy tree (Tarombo) enabling intuitive ancestral line exploration.',
                'Centralized member registration directory for the Batak Malau clan community across Greater Jakarta.',
                'Integrated cultural agenda portal, community announcements, and historical archive repository.'
            ],
            actionLabel: 'Explore Website Prototype',
            scopeTitle: 'Project Scope &amp; Key Deliverables',
            resultsTitle: 'Results Review &amp; Artifacts',
            openTabLabel: 'View Full Screenshot &rarr;'
        },
        id: {
            role: 'Manajer Proyek (Dalam Proses)',
            resultType: 'Website Komunitas &amp; Platform Silsilah',
            mainTitle: 'Website Silsilah Keluarga Marga Batak Malau &amp; Boru',
            subTitle: 'Mengarahkan pengembangan dan pengelolaan end-to-end pohon silsilah keluarga (Tarombo) dan portal komunitas untuk keturunan Batak Malau di wilayah Jabodetabek.',
            deliverables: [
                'Menyusun Software Requirements Specification (SRS) &amp; arsitektur sistem untuk pengelolaan data keluarga.',
                'Merancang pohon silsilah digital interaktif (Tarombo) yang memudahkan eksplorasi garis keturunan leluhur.',
                'Direktori pendaftaran anggota terpusat untuk komunitas marga Batak Malau se-Jabodetabek.',
                'Portal agenda budaya terintegrasi, pengumuman komunitas, dan repositori arsip sejarah.'
            ],
            actionLabel: 'Jelajahi Prototipe Website',
            scopeTitle: 'Ruang Lingkup Proyek &amp; Hasil Utama',
            resultsTitle: 'Tinjauan Hasil &amp; Artefak',
            openTabLabel: 'Lihat Tangkapan Layar Penuh &rarr;'
        },
        previewType: 'image',
        previewSource: 'screen.png',
        actionUrl: 'screen.png'
    },
    'trading-journal': {
        en: {
            role: 'Full Stack Developer (Personal Project · In Progress)',
            resultType: 'FinTech Application & Trade Analytics',
            mainTitle: 'Trading Journal X1 — Comprehensive Trading Journal',
            subTitle: 'Architecting an advanced trading journal application designed to instill discipline throughout the trader\'s journey, track behavioral psychology, and analyze portfolio return on investment in real time.',
            deliverables: [
                'Automated calculation of vital performance metrics: Risk-to-Reward Ratio (RRR), Win-Rate, Maximum Drawdown, and Profit Factor.',
                'Dynamic interactive equity growth curve visualization over time.',
                'Execution psychology logs, strategy checklist verification, and before/after charting uploads.',
                'Comprehensive monthly analytics dashboard for trade discipline evaluation.'
            ],
            scopeTitle: 'Project Scope &amp; Key Deliverables',
            resultsTitle: 'Results Review &amp; Artifacts'
        },
        id: {
            role: 'Pengembang Full Stack (Proyek Pribadi · Dalam Proses)',
            resultType: 'Aplikasi FinTech &amp; Analitik Trading',
            mainTitle: 'Trading Journal X1 — Jurnal Trading Komprehensif',
            subTitle: 'Merancang arsitektur aplikasi jurnal trading canggih untuk menanamkan disiplin dalam trading, melacak psikologi perilaku, dan menganalisis return portofolio secara real time.',
            deliverables: [
                'Kalkulasi otomatis metrik performa penting: Rasio Risk-to-Reward (RRR), Win-Rate, Maximum Drawdown, dan Faktor Profit.',
                'Visualisasi dinamis kurva pertumbuhan ekuitas interaktif dari waktu ke waktu.',
                'Catatan psikologi eksekusi, verifikasi checklist strategi, dan unggahan grafik sebelum/sesudah.',
                'Dashboard analitik bulanan komprehensif untuk evaluasi kedisiplinan trading.'
            ],
            scopeTitle: 'Ruang Lingkup Proyek &amp; Hasil Utama',
            resultsTitle: 'Tinjauan Hasil &amp; Artefak'
        },
        previewType: 'trading_mockup',
        actionUrl: '#'
    },
    'kos-kosan': {
        en: {
            role: 'Full Stack Developer (In Progress)',
            resultType: 'Property & Rental Management Platform',
            mainTitle: 'Rental Housing & Boarding House Business Platform',
            subTitle: 'Enabling prospective tenants to seamlessly browse transparent pricing, amenities, precise locations, and instant live vacancy availability in real time.',
            deliverables: [
                'Real-time room vacancy tracking engine displaying Available or Occupied status.',
                'Interactive catalog with transparent pricing, facility filters (AC, Wi-Fi, Private Bath), and room photos.',
                'Smart search filter by budget and proximity to university campuses / business centers.',
                'Direct property manager messaging channel without intermediary commissions.'
            ],
            scopeTitle: 'Project Scope &amp; Key Deliverables',
            resultsTitle: 'Results Review &amp; Artifacts'
        },
        id: {
            role: 'Pengembang Full Stack (Dalam Proses)',
            resultType: 'Platform Manajemen Properti &amp; Sewa',
            mainTitle: 'Platform Bisnis Rumah Sewa &amp; Kos-Kosan',
            subTitle: 'Memungkinkan calon penyewa untuk menelusuri harga transparan, fasilitas, lokasi presisi, dan ketersediaan unit kosong secara langsung dan real time.',
            deliverables: [
                'Mesin pelacak ketersediaan kamar real-time yang menampilkan status Tersedia atau Terisi.',
                'Katalog interaktif dengan harga transparan, filter fasilitas (AC, Wi-Fi, Kamar Mandi Dalam), dan foto kamar.',
                'Filter pencarian pintar berdasarkan anggaran dan jarak ke kampus universitas / pusat bisnis.',
                'Saluran pesan langsung ke pengelola properti tanpa perantara komisi.'
            ],
            scopeTitle: 'Ruang Lingkup Proyek &amp; Hasil Utama',
            resultsTitle: 'Tinjauan Hasil &amp; Artefak'
        },
        previewType: 'property_mockup',
        actionUrl: '#'
    }
};

window.openProjectModal = function(projectId) {
    const project = projectDatabase[projectId];
    if (!project) return;
    activeProjectId = projectId;

    const data = project[currentLang] || project.en;

    const modal = document.getElementById('projectResultModal');
    const modalRole = document.getElementById('modalProjectRole');
    const modalType = document.getElementById('modalResultType');
    const modalBody = document.getElementById('modalWindowBody');

    modalRole.textContent = data.role;
    modalType.textContent = data.resultType;

    let previewHtml = '';

    if (project.previewType === 'pdf') {
        previewHtml = `
            <div class="modal-preview-box">
                <iframe src="${project.previewSource}#toolbar=1" class="modal-pdf-embed" title="Research Document Preview"></iframe>
            </div>
            <div class="modal-action-bar">
                <a href="${project.actionUrl}" target="_blank" download class="btn btn-luxury-primary">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    <span>${data.actionLabel}</span>
                </a>
                <a href="${project.previewSource}" target="_blank" class="btn btn-luxury-secondary">
                    <span>${data.openTabLabel}</span>
                </a>
            </div>
        `;
    } else if (project.previewType === 'image') {
        previewHtml = `
            <div class="modal-preview-box">
                <img src="${project.previewSource}" alt="${data.mainTitle}" class="modal-preview-img" onclick="openImageLightbox('${project.previewSource}', '${data.mainTitle}')">
            </div>
            <div class="modal-action-bar">
                <a href="${project.previewSource}" target="_blank" class="btn btn-luxury-primary">
                    <span>${data.openTabLabel}</span>
                </a>
            </div>
        `;
    } else if (project.previewType === 'trading_mockup') {
        const isId = currentLang === 'id';
        previewHtml = `
            <div class="modal-preview-box" style="padding: 24px; background: rgba(14, 18, 27, 0.9);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid rgba(212, 175, 55, 0.2); padding-bottom: 14px;">
                    <div>
                        <span style="font-size: 0.75rem; color: #D4AF37; font-weight: 700; letter-spacing: 0.1em;">${isId ? 'DASHBOARD JURNAL TRADING' : 'TRADE COMPASS DASHBOARD'}</span>
                        <h4 style="color: #FFFFFF; font-family: var(--font-serif); font-size: 1.2rem;">${isId ? 'Metrik Portofolio Real-Time' : 'Real-Time Portfolio Metrics'}</h4>
                    </div>
                    <span style="background: rgba(16, 185, 129, 0.15); color: #34D399; font-size: 0.75rem; font-weight: 700; padding: 4px 12px; border-radius: 9999px;">Win-Rate: 68.4%</span>
                </div>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 18px;">
                    <div style="background: rgba(255, 255, 255, 0.03); padding: 16px; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.06);">
                        <span style="font-size: 0.72rem; color: #A0A7B5;">${isId ? 'Total Eksekusi' : 'Total Executions'}</span>
                        <h5 style="color: #FFFFFF; font-size: 1.3rem; font-weight: 700;">142 ${isId ? 'Transaksi' : 'Trades'}</h5>
                    </div>
                    <div style="background: rgba(255, 255, 255, 0.03); padding: 16px; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.06);">
                        <span style="font-size: 0.72rem; color: #A0A7B5;">${isId ? 'Rata-rata Risk / Reward' : 'Avg Risk / Reward'}</span>
                        <h5 style="color: #D4AF37; font-size: 1.3rem; font-weight: 700;">1 : 2.85</h5>
                    </div>
                    <div style="background: rgba(255, 255, 255, 0.03); padding: 16px; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.06);">
                        <span style="font-size: 0.72rem; color: #A0A7B5;">${isId ? 'Faktor Profit' : 'Profit Factor'}</span>
                        <h5 style="color: #34D399; font-size: 1.3rem; font-weight: 700;">2.41</h5>
                    </div>
                </div>
                <div style="background: rgba(6, 7, 9, 0.7); border: 1px dashed rgba(212, 175, 55, 0.3); padding: 18px; border-radius: 10px; text-align: center;">
                    <p style="font-size: 0.85rem; color: #A0A7B5;">${isId ? 'Dilengkapi pencatatan emosi, jurnal visual grafik, dan pelacakan kepatuhan aturan trading.' : 'Equipped with emotional logging, charting visual journal, and trading rule compliance tracking.'}</p>
                </div>
            </div>
        `;
    } else if (project.previewType === 'property_mockup') {
        const isId = currentLang === 'id';
        previewHtml = `
            <div class="modal-preview-box" style="padding: 24px; background: rgba(14, 18, 27, 0.9);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid rgba(16, 185, 129, 0.2); padding-bottom: 14px;">
                    <div>
                        <span style="font-size: 0.75rem; color: #34D399; font-weight: 700; letter-spacing: 0.1em;">${isId ? 'MESIN KETERSEDIAAN PROPERTI' : 'PROPERTY AVAILABILITY ENGINE'}</span>
                        <h4 style="color: #FFFFFF; font-family: var(--font-serif); font-size: 1.2rem;">${isId ? 'Status Ketersediaan Unit Sewa' : 'Rental Unit Vacancy Status'}</h4>
                    </div>
                    <span style="background: rgba(16, 185, 129, 0.15); color: #34D399; font-size: 0.75rem; font-weight: 700; padding: 4px 12px; border-radius: 9999px;">${isId ? 'Sistem Aktif' : 'System Active'}</span>
                </div>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px;">
                    <div style="background: rgba(255, 255, 255, 0.03); padding: 16px; border-radius: 10px; border: 1px solid rgba(16, 185, 129, 0.3);">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span style="font-weight: 700; color: #FFFFFF;">${isId ? 'Kamar Kos VIP 01' : 'VIP Boarding Room 01'}</span>
                            <span style="background: #10B981; color: #000; font-size: 0.65rem; font-weight: 800; padding: 2px 8px; border-radius: 4px;">${isId ? 'TERSEDIA' : 'AVAILABLE'}</span>
                        </div>
                        <p style="font-size: 0.8rem; color: #A0A7B5; margin-bottom: 8px;">${isId ? 'Fasilitas: AC, Wi-Fi 50 Mbps, Kamar Mandi Dalam, Springbed.' : 'Amenities: AC, 50 Mbps Wi-Fi, Private En-Suite Bath, Springbed.'}</p>
                        <span style="color: #D4AF37; font-weight: 700; font-size: 0.95rem;">Rp 1,500,000 ${isId ? '/ bulan' : '/ month'}</span>
                    </div>
                    <div style="background: rgba(255, 255, 255, 0.03); padding: 16px; border-radius: 10px; border: 1px solid rgba(239, 68, 68, 0.3);">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span style="font-weight: 700; color: #FFFFFF;">${isId ? 'Rumah Sewa Unit B' : 'Rental House Unit B'}</span>
                            <span style="background: #EF4444; color: #FFF; font-size: 0.65rem; font-weight: 800; padding: 2px 8px; border-radius: 4px;">${isId ? 'TERISI' : 'OCCUPIED'}</span>
                        </div>
                        <p style="font-size: 0.8rem; color: #A0A7B5; margin-bottom: 8px;">${isId ? 'Fasilitas: 2 Kamar Tidur, Ruang Tamu, Dapur, Garasi Motor.' : 'Amenities: 2 Bedrooms, Living Room, Kitchen, Motorcycle Garage.'}</p>
                        <span style="color: #A0A7B5; font-size: 0.95rem;">${isId ? 'Disewa hingga Des 2026' : 'Leased through Dec 2026'}</span>
                    </div>
                </div>
            </div>
        `;
    }

    const deliverablesHtml = data.deliverables.map(item => `
        <li>
            <span class="bullet">&#10022;</span>
            <span>${item}</span>
        </li>
    `).join('');

    modalBody.innerHTML = `
        <h3 class="modal-project-title">${data.mainTitle}</h3>
        <p class="modal-project-subtitle">${data.subTitle}</p>

        <h4 class="modal-section-title">${data.scopeTitle}</h4>
        <ul class="modal-deliverables-list">
            ${deliverablesHtml}
        </ul>

        <h4 class="modal-section-title" style="margin-top: 24px;">${data.resultsTitle}</h4>
        ${previewHtml}
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

window.closeProjectModal = function() {
    const modal = document.getElementById('projectResultModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        activeProjectId = null;
    }
};

/* ==========================================================================
   7. IMAGE LIGHTBOX MODAL (Certifications & Work Photos)
   ========================================================================== */
window.openImageLightbox = function(imageSrc, caption) {
    const lightbox = document.getElementById('imageLightboxModal');
    const lightboxImg = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');

    if (!lightbox || !lightboxImg) return;

    lightboxImg.src = imageSrc;
    lightboxCaption.textContent = caption || 'Portfolio Documentation';

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
};

window.closeImageLightbox = function() {
    const lightbox = document.getElementById('imageLightboxModal');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
};

// Global Escape Key Listener for Modals
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeProjectModal();
        closeImageLightbox();
    }
});

/* ==========================================================================
   8. COPY TO CLIPBOARD WITH LUXURY TOAST
   ========================================================================== */
window.copyToClipboard = function(text, successMessage) {
    if (!text) return;

    let msg = successMessage;
    if (currentLang === 'id') {
        if (text.includes('@')) {
            msg = 'Alamat email berhasil disalin!';
        } else if (text.includes('+62') || text.includes('877')) {
            msg = 'Nomor WhatsApp berhasil disalin!';
        } else {
            msg = 'Teks berhasil disalin ke papan klip!';
        }
    }

    function showToast(message) {
        const toast = document.getElementById('luxuryToast');
        const toastMsg = document.getElementById('toastMessage');
        if (!toast || !toastMsg) return;

        toastMsg.textContent = message || (currentLang === 'id' ? 'Teks berhasil disalin!' : 'Text copied to clipboard successfully');
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3200);
    }

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(msg);
        }).catch(() => {
            fallbackCopyTextToClipboard(text, msg);
        });
    } else {
        fallbackCopyTextToClipboard(text, msg);
    }
};

function fallbackCopyTextToClipboard(text, successMessage) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        if (successful) {
            const toast = document.getElementById('luxuryToast');
            const toastMsg = document.getElementById('toastMessage');
            if (toast && toastMsg) {
                toastMsg.textContent = successMessage || 'Copied successfully';
                toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), 3200);
            }
        }
    } catch (err) {
        console.error('Fallback copy failed', err);
    }

    document.body.removeChild(textArea);
}