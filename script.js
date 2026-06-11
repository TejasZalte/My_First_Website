document.addEventListener('DOMContentLoaded', () => {

  /* 1. CUSTOM CURSOR */
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });
  (function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  })();
  document.addEventListener('mouseleave', () => { cursor.style.opacity='0'; follower.style.opacity='0'; });
  document.addEventListener('mouseenter', () => { cursor.style.opacity='1'; follower.style.opacity='0.7'; });

  /* 2. NAV SCROLL */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 50));

  /* 3. HAMBURGER */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  let menuOpen = false;

  hamburger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    const spans = hamburger.querySelectorAll('span');
    if (menuOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
    } else {
      spans.forEach(s => { s.style.transform=''; s.style.opacity=''; });
    }
  });
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      menuOpen = false;
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform=''; s.style.opacity=''; });
    });
  });

  /* 4. TYPING EFFECT */
  const phrases = ['Full-Stack Developer','UI/UX Designer','Problem Solver','Open-Source Contributor'];
  let phraseIdx=0, charIdx=0, deleting=false;
  const typedEl = document.getElementById('typedText');
  function type() {
    const cur = phrases[phraseIdx];
    typedEl.textContent = deleting ? cur.substring(0, charIdx-1) : cur.substring(0, charIdx+1);
    deleting ? charIdx-- : charIdx++;
    let delay = deleting ? 60 : 100;
    if (!deleting && charIdx === cur.length) { delay=1800; deleting=true; }
    else if (deleting && charIdx === 0) { deleting=false; phraseIdx=(phraseIdx+1)%phrases.length; delay=400; }
    setTimeout(type, delay);
  }
  type();

  /* 5. COUNTERS */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    let current = 0;
    const step = Math.ceil(target / 40);
    const iv = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(iv);
    }, 40);
  }
  let countersStarted = false;
  function tryCounters() {
    if (countersStarted) return;
    const hero = document.querySelector('.hero-visual');
    if (hero && hero.getBoundingClientRect().top < window.innerHeight * 0.9) {
      countersStarted = true;
      document.querySelectorAll('.stat-num').forEach(animateCounter);
    }
  }

  /* 6. SCROLL REVEAL */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* 7. SKILL BARS */
  const skillObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        setTimeout(() => { e.target.style.width = e.target.dataset.width + '%'; }, 200);
        skillObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.skill-fill').forEach(el => skillObs.observe(el));

  /* 8. SCROLL LISTENER */
  window.addEventListener('scroll', tryCounters, { passive: true });
  tryCounters();

  /* 9. CONTACT FORM */
  const form = document.getElementById('contactForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn');
    btn.disabled = true;
    btn.querySelector('.btn-text').textContent = 'Sending…';
    setTimeout(() => {
      form.reset();
      document.getElementById('formSuccess').style.display = 'block';
      btn.querySelector('.btn-text').textContent = 'Send Message';
      btn.disabled = false;
      setTimeout(() => { document.getElementById('formSuccess').style.display = 'none'; }, 5000);
    }, 1500);
  });

  /* 10. ACTIVE NAV */
  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        document.querySelectorAll('.nav-links a').forEach(link => {
          link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--white)' : '';
        });
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('section[id]').forEach(s => sectionObs.observe(s));

  /* 11. SMOOTH SCROLL */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior:'smooth', block:'start' }); }
    });
  });

  /* 12. CARD TILT */
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 12;
      const y = ((e.clientY - r.top) / r.height - 0.5) * -12;
      card.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${y}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

});