function initPageMotion() {
  const header = document.querySelector('.site-header');
  const hero = document.querySelector('.hero');
  const processRows = Array.prototype.slice.call(document.querySelectorAll('.process-row'));
  const revealGroups = [];
  const revealTargets = [];
  const supportsMatchMedia = typeof window.matchMedia === 'function';
  const prefersReducedMotion = supportsMatchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  const addRevealGroup = (targets) => {
    const group = targets.filter(Boolean);

    if (!group.length) {
      return;
    }

    revealGroups.push(group);

    group.forEach((target) => {
      if (!revealTargets.includes(target)) {
        revealTargets.push(target);
      }
    });
  };

  addRevealGroup(
    Array.prototype.slice.call(document.querySelectorAll('#prova .text-block, #prova .media-frame--proof'))
  );

  processRows.forEach((row) => {
    addRevealGroup(Array.prototype.slice.call(row.querySelectorAll('.step-card, .media-frame--step')));
  });

  addRevealGroup(Array.prototype.slice.call(document.querySelectorAll('#para-quem .audience-card')));
  addRevealGroup(
    Array.prototype.slice.call(
      document.querySelectorAll('#diferencial .diferencial-copy, #diferencial .media-frame--diferencial')
    )
  );
  addRevealGroup(Array.prototype.slice.call(document.querySelectorAll('#contato .cta-card')));

  if (header && hero && 'IntersectionObserver' in window) {
    const setSolidState = (isSolid) => {
      header.classList.toggle('is-solid', isSolid);
    };

    const heroObserver = new IntersectionObserver(
      (entries) => {
        if (!entries.length) {
          return;
        }

        setSolidState(!entries[0].isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: '-72px 0px 0px 0px',
      }
    );

    heroObserver.observe(hero);
  } else if (header) {
    header.classList.add('is-solid');
  }

  if (!revealTargets.length) {
    return;
  }

  const compareVisualPosition = (first, second) => {
    const firstBounds = first.getBoundingClientRect();
    const secondBounds = second.getBoundingClientRect();
    const topDifference = Math.abs(firstBounds.top - secondBounds.top);

    if (topDifference > 8) {
      return firstBounds.top - secondBounds.top;
    }

    return firstBounds.left - secondBounds.left;
  };

  const syncRevealDelays = () => {
    revealGroups.forEach((group) => {
      const visualOrder = group.slice().sort(compareVisualPosition);

      visualOrder.forEach((target, index) => {
        target.style.setProperty('--reveal-delay', `${index * 90}ms`);
      });
    });
  };

  revealTargets.forEach((target) => {
    target.classList.add('scroll-reveal', 'is-reveal-ready');

    if (prefersReducedMotion) {
      target.classList.add('scroll-reveal--soft');
    }
  });

  syncRevealDelays();

  if (!('IntersectionObserver' in window)) {
    revealTargets.forEach((target) => {
      target.classList.add('is-revealed');
    });
    return;
  }

  requestAnimationFrame(() => {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -8% 0px',
      }
    );

    revealTargets.forEach((target) => {
      revealObserver.observe(target);
    });
  });

  let resizeFrame = 0;

  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(syncRevealDelays);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPageMotion);
} else {
  initPageMotion();
}
