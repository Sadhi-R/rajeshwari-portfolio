(function () {
  'use strict';

  var canvas = document.getElementById('bgCanvas');
  if (!canvas) return;

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ctx = canvas.getContext('2d');
  var particles = [];
  var mouse = { x: 0, y: 0 };
  var animationId = null;
  var PARTICLE_COUNT = reducedMotion ? 0 : 80;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  }

  function initParticles() {
    particles = [];
    for (var i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.5
      });
    }
  }

  function getAccentColor() {
    var style = getComputedStyle(document.documentElement);
    return style.getPropertyValue('--accent').trim() || '#7c3aed';
  }

  function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
      : { r: 124, g: 58, b: 237 };
  }

  function draw() {
    if (reducedMotion || PARTICLE_COUNT === 0) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var rgb = hexToRgb(getAccentColor());
    var connectDist = 140;

    particles.forEach(function (p) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      var dx = mouse.x - p.x;
      var dy = mouse.y - p.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        p.x -= dx * 0.008;
        p.y -= dy * 0.008;
      }
    });

    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var a = particles[i];
        var b = particles[j];
        var d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < connectDist) {
          var alpha = (1 - d / connectDist) * 0.18;
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + alpha + ')';
          ctx.lineWidth = 0.6;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    particles.forEach(function (p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',0.55)';
      ctx.fill();
    });

    animationId = requestAnimationFrame(draw);
  }

  window.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    var xPct = (e.clientX / window.innerWidth) * 100;
    var yPct = (e.clientY / window.innerHeight) * 100;
    var px = (e.clientX / window.innerWidth - 0.5) * 2;
    var py = (e.clientY / window.innerHeight - 0.5) * 2;

    document.documentElement.style.setProperty('--mouse-x-pct', xPct + '%');
    document.documentElement.style.setProperty('--mouse-y-pct', yPct + '%');
    document.documentElement.style.setProperty('--mouse-parallax-x', px.toFixed(3));
    document.documentElement.style.setProperty('--mouse-parallax-y', py.toFixed(3));
  }, { passive: true });

  window.addEventListener('resize', resize);
  resize();
  if (!reducedMotion) draw();

  window.restartBackground = function () {
    if (animationId) cancelAnimationFrame(animationId);
    if (!reducedMotion) draw();
  };
})();
