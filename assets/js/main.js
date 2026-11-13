/**
 * ARENALMA - "Reconecta con tu esencia"
 * JavaScript Principal: Interactividad, Carrito, Agendamiento & Mística
 * Ubicación: La Serena & Coquimbo, Chile
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initStarCanvas();
  initServicesCarousel();
  initAmuletFilters();
  initCart();
  initFAQ();
  initMysticAudio();
  initLegalModals();
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
   3. Sección de Servicios Holísticos (Cartas Apiladas)
   ========================================================================== */
function initServicesCarousel() {
  // Las cartas apiladas funcionan de forma nativa y fluida mediante CSS Sticky Stacking.
  // No requiere forzar eventos de scroll horizontal ni bloquear la página.
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
      audioToggleBtn.setAttribute('title', 'Pausar cuenco tibetano (432Hz)');
      showToast('🥣 Cuenco tibetano activado (432Hz)');
      isAudioPlaying = true;
    } else {
      stopAmbientSound();
      audioToggleBtn.classList.remove('playing');
      audioToggleBtn.setAttribute('title', 'Activar cuenco tibetano (432Hz)');
      showToast('🔇 Cuenco tibetano en pausa');
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

/* ==========================================================================
   10. Modales de Información Legal (Marco Legal Chile: Ley 19.628, Ley 19.496, Dec. 42 MINSAL)
   ========================================================================== */
function initLegalModals() {
  const overlay = document.getElementById('legal-modal-overlay');
  const modalTitle = document.getElementById('legal-modal-title');
  const modalBody = document.getElementById('legal-modal-body');
  const closeBtn = document.getElementById('close-legal-modal');
  const understandBtn = document.getElementById('btn-modal-understand');
  const legalTriggers = document.querySelectorAll('.open-legal-modal');

  const legalContent = {
    'aviso-legal': {
      title: 'Aviso Legal & Términos del Servicio',
      body: `
        <h4>1. Identificación de la Titular y Actividad</h4>
        <p>En cumplimiento con la legislación chilena (Ley N° 19.496 de Protección de los Derechos de los Consumidores y el Reglamento de Comercio Electrónico, Decreto 31 del Ministerio de Economía), se informa que este sitio web es administrado bajo la marca <strong>Arenalma — "Reconecta con tu esencia"</strong>, con operaciones en la conurbación de <strong>La Serena y Coquimbo, Región de Coquimbo, Chile</strong>.</p>
        <p>Canal oficial de contacto y atención directa: <strong>WhatsApp (+56 9 1234 5678)</strong> y canales vinculados en este sitio.</p>

        <h4>2. Naturaleza de los Servicios Holísticos</h4>
        <p>Arenalma ofrece servicios de bienestar complementario y holístico: <em>Reiki Usui Tradicional, Lectura Terapéutica de Oráculos, Angeloterapia</em> y confección artesanal de <em>Amuletos en Hilo Encerado con Cristales Naturales</em>.</p>
        
        <div class="legal-alert-box">
          <strong>Aviso de Salud (Decreto Supremo N° 42 del MINSAL):</strong><br>
          Las terapias y sesiones energéticas ofrecidas son de carácter holístico, espiritual y complementario. En ningún caso constituyen diagnóstico, consulta, tratamiento médico formal, farmacológico ni psiquiátrico. La persona consultante es libre y responsable en todo momento de su proceso de salud integral.
        </div>

        <h4>3. Propiedad Intelectual</h4>
        <p>Todos los elementos de este sitio web, incluidos el logotipo de Arenalma, mandalas, diseños de amuletos tejidos a mano, textos, fotografías y código fuente, están protegidos por la Ley N° 17.336 de Propiedad Intelectual de Chile. Queda prohibida su reproducción o uso no autorizado.</p>

        <h4>4. Agendamiento de Sesiones y Envíos de Amuletos</h4>
        <p>Las reservas de sesiones se coordinan de forma personalizada por WhatsApp. Los amuletos se tejen a mano por la creadora con hilo encerado resistente y piedras naturales seleccionadas; las entregas presenciales se realizan en La Serena / Coquimbo y los envíos a todo Chile se efectúan mediante empresas de encomienda previamente coordinadas con la persona compradora.</p>
      `
    },

    'politica-privacidad': {
      title: 'Política de Privacidad y Protección de Datos',
      body: `
        <h4>1. Compromiso de Privacidad (Ley N° 19.628 de Chile)</h4>
        <p>En Arenalma respetamos profundamente tu intimidad y protegemos tus datos personales conforme a la <strong>Ley N° 19.628 sobre Protección de la Vida Privada</strong> y los estándares de seguridad de datos en Chile.</p>

        <h4>2. Datos que Recopilamos y Finalidad</h4>
        <p>Recopilamos únicamente los datos necesarios y entregados voluntariamente por ti a través de WhatsApp o formularios de contacto:</p>
        <ul>
          <li><strong>Nombre y teléfono de WhatsApp:</strong> para coordinar la fecha, hora y modalidad de tus terapias (presencial o a distancia).</li>
          <li><strong>Dirección de entrega (si aplica):</strong> exclusivamente para el despacho de amuletos a domicilio o sucursal de encomiendas.</li>
          <li><strong>Fecha de nacimiento o intención:</strong> únicamente cuando solicitas un amuleto personalizado co-creado con tu energía.</li>
        </ul>

        <h4>3. Confidencialidad Absoluta</h4>
        <p>Toda conversación, canalización, lectura de oráculo o motivo de consulta terapéutica se mantiene bajo estricto secreto y confidencialidad ética. <strong>Jamás vendemos, compartimos ni cedemos tus datos a terceros ni a empresas de publicidad.</strong></p>

        <h4>4. Derechos ARCO (Acceso, Rectificación, Cancelación y Oposición)</h4>
        <p>En cualquier momento puedes solicitar la actualización o eliminación definitiva de tu información de contacto escribiéndonos directamente a nuestro canal de WhatsApp.</p>
      `
    },

    'politica-cookies': {
      title: 'Política de Cookies y Almacenamiento Local',
      body: `
        <h4>1. ¿Qué son las Cookies y Almacenamiento Web?</h4>
        <p>Las cookies y el almacenamiento local (<em>localStorage</em>) son pequeños ficheros que los sitios web guardan en tu navegador para permitir funciones técnicas y mejorar tu experiencia de navegación.</p>

        <h4>2. Tecnologías Empleadas en Arenalma</h4>
        <p>En Arenalma mantenemos un sitio web consciente, ligero y respetuoso de tu tranquilidad digital. <strong>No utilizamos cookies invasivas de seguimiento publicitario ni vendemos perfiles de usuario.</strong></p>
        <p>Únicamente empleamos tecnologías estrictamente técnicas y funcionales:</p>
        <ul>
          <li><strong>Almacenamiento funcional de audio:</strong> recuerda si activaste o pausaste la música ambiental del cuenco tibetano a 432Hz para mantener tu preferencia durante la visita.</li>
          <li><strong>Almacenamiento de sesión:</strong> permite que los filtros del catálogo de amuletos y el menú responsivo operen de forma fluida.</li>
        </ul>

        <h4>3. Cómo Desactivar o Gestionar tus Preferencias</h4>
        <p>Puedes configurar o borrar las cookies y datos locales en cualquier momento desde las opciones de configuración y privacidad de tu navegador web (Google Chrome, Safari, Firefox, Edge, etc.).</p>
      `
    },

    'descargo-medico': {
      title: 'Descargo de Responsabilidad Terapéutica (MINSAL)',
      body: `
        <h4>Marco Regulatorio de Salud en Chile</h4>
        <p>En conformidad con las directrices de salud pública de la República de Chile y el <strong>Decreto Supremo N° 42 del Ministerio de Salud (MINSAL)</strong> sobre terapias médicas complementarias:</p>

        <div class="legal-alert-box">
          <strong>Declaración de Transparencia y Conciencia:</strong><br>
          1. El <strong>Reiki Usui Tradicional</strong>, la <strong>Angeloterapia</strong> y la <strong>Lectura de Oráculos Terapéuticos</strong> son prácticas complementarias orientadas a la armonización energética, reducción del estrés, bienestar emocional y crecimiento personal.<br><br>
          2. Estas sesiones <strong>NO sustituyen</strong> la consulta médica, el diagnóstico clínico, los tratamientos farmacológicos ni el acompañamiento psiquiátrico o psicológico impartido por profesionales de la salud debidamente acreditados por la Superintendencia de Salud.<br><br>
          3. En Arenalma promovemos siempre la consulta y continuidad de los tratamientos médicos tradicionales prescritos para cada persona.
        </div>

        <h4>Acompañamiento Amoroso y Ético</h4>
        <p>Nuestra labor se fundamenta en la calidez, la empatía y la conexión espiritual para ayudarte a reconectar con tu paz interior y sabiduría innata, complementando armónicamente tu cuidado de salud integral.</p>
      `
    },

    'faq': {
      title: 'Preguntas Frecuentes (FAQ)',
      body: `
        <div style="display:flex; flex-direction:column; gap:1.25rem;">
          <div>
            <h4 style="color:var(--gold-sacred); margin-bottom:0.4rem; font-size:1.05rem;"><i class="fa-solid fa-sparkles" style="font-size:0.85rem; margin-right:6px;"></i> ¿Cómo funciona una sesión de Reiki a distancia?</h4>
            <p>La energía no está sujeta al tiempo ni al espacio físico. En las sesiones a distancia nos conectamos a la hora acordada mediante videollamada para una breve conversación inicial. Luego te recuestas en un espacio tranquilo mientras canalizamos el Reiki hacia tu campo áurico y chakras. Al finalizar, compartimos las sensaciones y mensajes percibidos.</p>
          </div>

          <div>
            <h4 style="color:var(--gold-sacred); margin-bottom:0.4rem; font-size:1.05rem;"><i class="fa-solid fa-location-dot" style="font-size:0.85rem; margin-right:6px;"></i> ¿En qué lugares de La Serena y Coquimbo se realizan las sesiones presenciales?</h4>
            <p>Contamos con un espacio acogedor, íntimo y armonizado especialmente acondicionado en la conurbación La Serena - Coquimbo. Una vez que agendas tu sesión por WhatsApp, te compartimos la ubicación exacta e indicaciones para tu llegada.</p>
          </div>

          <div>
            <h4 style="color:var(--gold-sacred); margin-bottom:0.4rem; font-size:1.05rem;"><i class="fa-solid fa-water" style="font-size:0.85rem; margin-right:6px;"></i> ¿Puedo mojar mi amuleto de hilo encerado?</h4>
            <p>¡Sí, con total tranquilidad! Utilizamos hilo encerado brasileño de primera calidad (Linhasita), el cual repele el agua, no se deshilacha, no retiene humedad ni malos olores y conserva su tonalidad original. Puedes ducharte o ir a la playa con él puesto.</p>
          </div>

          <div>
            <h4 style="color:var(--gold-sacred); margin-bottom:0.4rem; font-size:1.05rem;"><i class="fa-solid fa-gem" style="font-size:0.85rem; margin-right:6px;"></i> ¿Cómo se limpian energéticamente los cristales del amuleto?</h4>
            <p>Cada pieza se entrega purificada y consagrada con Reiki. Con el tiempo y uso, cuando sientas que ha absorbido energías densas, puedes sahumarla suavemente con humo de palo santo o salvia blanca, o colocarla sobre una drusa de cuarzo o a la luz serena de la Luna Llena.</p>
          </div>

          <div>
            <h4 style="color:var(--gold-sacred); margin-bottom:0.4rem; font-size:1.05rem;"><i class="fa-solid fa-hands-holding-heart" style="font-size:0.85rem; margin-right:6px;"></i> ¿Puedo encargar un amuleto con un cristal que no está en la web?</h4>
            <p>Por supuesto. Si resuenas con un cristal específico o requieres un amuleto personalizado según tu intención o fecha de nacimiento, escríbenos directamente por WhatsApp y la artesana lo co-creará contigo.</p>
          </div>
        </div>
      `
    }
  };

  function openModal(type) {
    const data = legalContent[type] || legalContent['aviso-legal'];
    modalTitle.textContent = data.title;
    modalBody.innerHTML = data.body;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  legalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const type = trigger.dataset.modal || 'aviso-legal';
      openModal(type);
    });
  });

  closeBtn?.addEventListener('click', closeModal);
  understandBtn?.addEventListener('click', closeModal);

  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay?.classList.contains('active')) {
      closeModal();
    }
  });
}
