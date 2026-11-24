(() => {
  const hero = document.getElementById('hero');
  const mega = document.querySelector('.mega');
  const burger = document.querySelector('.burger');
  const links = document.querySelector('.links');

  // Colour reveal that follows the cursor (or finger) over the title
  const moveMask = (x, y) => {
    const r = mega.getBoundingClientRect();
    mega.style.setProperty('--mx', (x - r.left) + 'px');
    mega.style.setProperty('--my', (y - r.top) + 'px');
  };
  hero.addEventListener('pointermove', e => moveMask(e.clientX, e.clientY));
  // Gentle auto-sweep so the effect is visible before anyone moves the mouse
  let t = 0, touched = false;
  hero.addEventListener('pointerdown', () => touched = true);
  const sweep = () => {
    if (!touched) {
      t += 0.012;
      const r = mega.getBoundingClientRect();
      mega.style.setProperty('--mx', (r.width * (0.5 + 0.38 * Math.sin(t))) + 'px');
      mega.style.setProperty('--my', (r.height * (0.5 + 0.3 * Math.cos(t * 1.3))) + 'px');
    }
    requestAnimationFrame(sweep);
  };
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) sweep();
  hero.addEventListener('pointerenter', () => touched = true);

  // Scroll reveal
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // 3D tilt on product cards
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('pointermove', e => {
      const b = card.getBoundingClientRect();
      const x = (e.clientX - b.left) / b.width - 0.5;
      const y = (e.clientY - b.top) / b.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
    });
    card.addEventListener('pointerleave', () => card.style.transform = '');
  });

  // Mobile menu
  const setMenu = open => {
    burger.setAttribute('aria-expanded', open);
    links.classList.toggle('open', open);
  };
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

  // Form validation (front-end only: it does not send the message anywhere)
  const form = document.getElementById('form');
  const note = document.getElementById('note');
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll('input, textarea').forEach(f => {
      const bad = !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value));
      f.classList.toggle('invalid', bad);
      if (bad) ok = false;
    });
    note.className = 'note ' + (ok ? 'ok' : 'err');
    note.textContent = ok ? 'Thanks! Your message is ready to send. (Demo form)' : 'Please fill in every field with a valid email.';
    if (ok) form.reset();
  });
  // If photo.jpg is missing, fall back to the initials in the credit badge
  const pic = document.querySelector('.avatar img');
  if (pic) pic.addEventListener('error', () => pic.remove());
})();
