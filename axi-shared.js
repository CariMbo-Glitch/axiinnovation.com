/* Axi Navigation â shared JS for navbar, fade-up, contact modal, Formspree submission */

document.addEventListener('DOMContentLoaded', function () {
    // Mobile nav toggle
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    }

    // Fade-up intersection observer
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.12 });
        document.querySelectorAll('.fade-up').forEach((el) => io.observe(el));
    } else {
        document.querySelectorAll('.fade-up').forEach((el) => el.classList.add('visible'));
    }

    // Contact modal
    const modal = document.getElementById('contactModal');
    const openBtns = document.querySelectorAll('.open-contact');
    const closeBtn = document.getElementById('modalClose');
    const interestSelect = document.getElementById('cf-interest');

    openBtns.forEach((b) =>
        b.addEventListener('click', (e) => {
            e.preventDefault();
            if (modal) modal.classList.add('open');
            const interest = b.getAttribute('data-interest');
            if (interest && interestSelect) {
                for (const opt of interestSelect.options) {
                    if (opt.value === interest) { interestSelect.value = interest; break; }
                }
            }
        })
    );
    if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('open'));
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('open'); });

    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/FORMSPREE_ENDPOINT_HERE';
    const form = document.getElementById('contactFormEl');
    const successEl = document.getElementById('contactSuccess');
    const formContainer = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('cf-submit');
            submitBtn.disabled = true; submitBtn.textContent = 'Sendingâ¦';
            const formData = new FormData(form);
            try {
                const resp = await fetch(FORMSPREE_ENDPOINT, { method: 'POST', body: formData, headers: { Accept: 'application/json' } });
                if (resp.ok) { formContainer.style.display = 'none'; successEl.style.display = 'block'; }
                else { throw new Error('Failed'); }
            } catch (err) {
                const n = formData.get('name')||''; const c = formData.get('company')||'';
                const em = formData.get('email')||''; const r = formData.get('role')||'';
                const int = formData.get('interest')||''; const msg = formData.get('message')||'';
                const body = encodeURIComponent('Name: '+n+'\nCompany: '+c+'\nEmail: '+em+'\nRole: '+r('\nInterest: '+int+'\n\nMessage:\n'+msg);
                window.location.href = 'mailto:contact@axinavigation.com?subject='+encodeURIComponent('Website enquiry â '+int)+'&body='+body;
            } finally { submitBtn.disabled=false; submitBtn.textContent='Send Message'; }
        });
    }
});
