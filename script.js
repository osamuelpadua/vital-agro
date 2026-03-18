const header = document.querySelector('.site-header');
const hero = document.querySelector('.hero');

if (header && hero) {
  const setSolidState = (isSolid) => {
    header.classList.toggle('is-solid', isSolid);
  };

  const observer = new IntersectionObserver(
    ([entry]) => {
      setSolidState(!entry.isIntersecting);
    },
    {
      threshold: 0,
      rootMargin: '-72px 0px 0px 0px',
    }
  );

  observer.observe(hero);
} else if (header) {
  header.classList.add('is-solid');
}
