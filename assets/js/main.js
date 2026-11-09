/**
 * ARENALMA - "Reconecta con tu esencia"
 * JavaScript Principal: Interactividad, Carrito, Agendamiento & Mística
 * Ubicación: La Serena & Coquimbo, Chile
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initStarCanvas();
  initAmuletFilters();
  initCart();
  initFAQ();
  initMysticAudio();
});

/* ==========================================================================
   1. Navegación & Header Scrolled
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.main-header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    // ScrollSpy para nav-links
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  mobileToggle?.addEventListener('click', () => {
    navMenu?.classList.toggle('active');
    const icon = mobileToggle.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-times');
    }
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu?.classList.remove('active');
      const icon = mobileToggle?.querySelector('i');
      if (icon) {
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
      }
    });
  });
}

/* ==========================================================================
   2. Canvas de Polvo de Estrellas (Cielo místico de La Serena / Elqui)
   ========================================================================== */
function initStarCanvas() {
  const canvas = document.getElementById('stars-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let stars = [];

  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
    createStars();
  }

  function createStars() {
    stars = [];
    const count = Math.floor((width * height) / 9000);
    for (let i = 0; i < count; i++) {
      const colorRoll = Math.random();
      let starColor = '#FFFFFF';
      if (colorRoll < 0.35) {
        starColor = '#E4C88E'; // Oro Sagrado
      } else if (colorRoll < 0.65) {
        starColor = '#F4CAD6'; // Rosa Cuarzo
      } else if (colorRoll < 0.85) {
        starColor = '#8DC4CF'; // Aqua Celestial
      }
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.6 + 0.3,
        alpha: Math.random() * 0.7 + 0.2,
        speed: Math.random() * 0.02 + 0.005,
        color: starColor
      });
    }
  }

  window.addEventListener('resize', resize);
  resize();

  function animate() {
    ctx.clearRect(0, 0, width, height);

    stars.forEach(star => {
      star.alpha += star.speed;
      if (star.alpha > 0.95 || star.alpha < 0.15) {
        star.speed = -star.speed;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, star.alpha));
      ctx.fillStyle = star.color;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();

      // Sutil resplandor en estrellas más grandes
      if (star.radius > 1.2) {
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#ECC8AF';
        ctx.fill();
      }
      ctx.restore();
    });

    requestAnimationFrame(animate);
  }

  animate();
}



/* ==========================================================================
   4. Filtro de Catálogo de Amuletos Hechos a Mano
   ========================================================================== */
function initAmuletFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const amuletCards = document.querySelectorAll('.amulet-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      amuletCards.forEach(card => {
        const category = card.dataset.category;
        const intention = card.dataset.intention;

        if (filter === 'all' || category === filter || intention === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   5. Sistema de Carrito de Amuletos & Encargo a WhatsApp
   ========================================================================== */
let cart = [];

function initCart() {
  const cartToggleBtn = document.querySelector('.cart-toggle-btn');
  const closeCartBtn = document.querySelector('.close-cart-btn');
  const cartDrawer = document.querySelector('.cart-drawer');
  const cartOverlay = document.querySelector('.cart-overlay');
  const addButtons = document.querySelectorAll('.amulet-btn-add');
  const checkoutBtn = document.getElementById('checkout-whatsapp-btn');

  function openCart() {
    cartDrawer?.classList.add('active');
    cartOverlay?.classList.add('active');
  }

  function closeCart() {
    cartDrawer?.classList.remove('active');
    cartOverlay?.classList.remove('active');
  }

  cartToggleBtn?.addEventListener('click', openCart);
  closeCartBtn?.addEventListener('click', closeCart);
  cartOverlay?.addEventListener('click', closeCart);

  addButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = btn.closest('.amulet-card');
      if (!card) return;

      const id = card.dataset.id;
      const name = card.querySelector('.amulet-name')?.textContent || 'Amuleto Arenalma';
      const priceText = card.querySelector('.amulet-price')?.textContent || '$0';
      const price = parseInt(priceText.replace(/[^0-9]/g, ''), 10) || 0;
      const stone = card.querySelector('.amulet-stone-type')?.textContent || 'Cristal Natural';

      addToCart({ id, name, price, stone });
      showToast(`✨ "${name}" añadido a tu pedido`);
      playMysticChime();
    });
  });

  checkoutBtn?.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Tu carrito está vacío. Agrega algún amuleto hecho con amor para continuar.');
      return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let message = `¡Hola Arenalma! 🌸 Deseo encargar los siguientes amuletos hechos a mano desde la página web:\n\n`;

    cart.forEach(item => {
      message += `• *${item.name}* (${item.stone}) x${item.quantity} = $${(item.price * item.quantity).toLocaleString('es-CL')}\n`;
    });

    message += `\n*Total:* $${total.toLocaleString('es-CL')} CLP`;
    message += `\n📍 Ubicación de entrega/envío: La Serena / Coquimbo o Envío a regiones.`;
    message += `\n¿Cómo coordinamos el pago y la entrega/consagración? Muchas gracias ✨`;

    const encoded = encodeURIComponent(message);
    const phone = "56912345678"; // Número de WhatsApp de Arenalma (reemplazable)
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
  });
}

function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCartUI();
}

function updateCartUI() {
  const cartBadge = document.querySelector('.cart-badge');
  const cartBody = document.querySelector('.cart-body');
  const cartSubtotalEl = document.getElementById('cart-subtotal-val');

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartBadge) {
    cartBadge.textContent = totalItems;
  }

  if (!cartBody) return;

  if (cart.length === 0) {
    cartBody.innerHTML = `
      <div class="cart-empty-message">
        <i class="fa-solid fa-gem"></i>
        <p>Tu canasto de amuletos está vacío.</p>
        <span style="font-size:0.85rem; color:#A8948C;">Explora nuestras pulseras y collares tejidos a mano con hilo encerado y piedras naturales.</span>
      </div>
    `;
    if (cartSubtotalEl) cartSubtotalEl.textContent = '$0';
    return;
  }

  let html = '';
  let subtotal = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    html += `
      <div class="cart-item">
        <div class="cart-item-img">
          <i class="fa-solid fa-gem" style="color:var(--rg-primary); font-size:1.4rem;"></i>
        </div>
        <div class="cart-item-info">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">$${itemTotal.toLocaleString('es-CL')}</div>
          <div class="cart-qty-ctrl">
            <button class="qty-btn" onclick="changeQty('${item.id}', -1)">-</button>
            <span style="font-size:0.85rem; font-weight:600;">${item.quantity}</span>
            <button class="qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
            <button onclick="removeFromCart('${item.id}')" style="background:none; margin-left:auto; color:#C25454; cursor:pointer; font-size:0.8rem;">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  });

  cartBody.innerHTML = html;
  if (cartSubtotalEl) {
    cartSubtotalEl.textContent = `$${subtotal.toLocaleString('es-CL')}`;
  }
}

window.changeQty = function(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== id);
  }
  updateCartUI();
};

window.removeFromCart = function(id) {
  cart = cart.filter(i => i.id !== id);
  updateCartUI();
};



/* ==========================================================================
   7. Preguntas Frecuentes (Acordeón)
   ========================================================================== */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(i => {
        i.classList.remove('active');
        const ans = i.querySelector('.faq-answer');
        if (ans) ans.style.maxHeight = null;
      });

      if (!isActive && answer) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* ==========================================================================
   8. Audio Relajante Místico (Web Audio API a 432Hz - Cuenco Tibetano)
   ========================================================================== */
let audioCtx = null;
let isAudioPlaying = false;
let ambientGain = null;
let ambientOsc = null;

function initMysticAudio() {
  const audioToggleBtn = document.querySelector('.audio-toggle-btn');
  if (!audioToggleBtn) return;

  audioToggleBtn.addEventListener('click', () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (!isAudioPlaying) {
      startAmbientSound();
      audioToggleBtn.classList.add('playing');
      audioToggleBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
      showToast('🎵 Música holística de fondo activada (432Hz)');
      isAudioPlaying = true;
    } else {
      stopAmbientSound();
      audioToggleBtn.classList.remove('playing');
      audioToggleBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
      isAudioPlaying = false;
    }
  });
}

function startAmbientSound() {
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  // Tono base de 432Hz (afinación de sanación universal)
  ambientOsc = audioCtx.createOscillator();
  ambientGain = audioCtx.createGain();

  ambientOsc.type = 'sine';
  ambientOsc.frequency.setValueAtTime(216, audioCtx.currentTime); // Armónico suave

  // LFO para efecto oleaje místico / respiración
  const lfo = audioCtx.createOscillator();
  const lfoGain = audioCtx.createGain();
  lfo.frequency.setValueAtTime(0.12, audioCtx.currentTime); // Ciclo lento de 8 segundos
  lfoGain.gain.setValueAtTime(0.04, audioCtx.currentTime);

  ambientGain.gain.setValueAtTime(0.05, audioCtx.currentTime);

  lfo.connect(ambientGain.gain);
  ambientOsc.connect(ambientGain);
  ambientGain.connect(audioCtx.destination);

  ambientOsc.start();
  lfo.start();
}

function stopAmbientSound() {
  if (ambientGain && audioCtx) {
    ambientGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.5);
    setTimeout(() => {
      try {
        ambientOsc?.stop();
      } catch (e) {}
    }, 600);
  }
}

function playMysticChime() {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    // Arpegio de campanitas
    osc.frequency.setValueAtTime(880, audioCtx.currentTime); // La5
    osc.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 1.2);
  } catch (err) {
    // Audio no soportado o bloqueado por navegador
  }
}

/* ==========================================================================
   9. Notificaciones Toast Elegantes
   ========================================================================== */
function showToast(message) {
  let toast = document.querySelector('.mystic-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'mystic-toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fa-solid fa-sparkles"></i> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
