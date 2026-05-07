const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const yearElement = document.getElementById('year');
const footerNav = document.getElementById('footer-nav');

const pathname = window.location.pathname;
const isPostPage = pathname.includes('/posts/');
const isBlogPage = pathname.endsWith('/blog.html');
const isIndexPage = pathname.endsWith('/index.html') || pathname.endsWith('/');

const navVariant = isPostPage ? 'post' : (isBlogPage ? 'blog' : (isIndexPage ? 'index' : 'root'));
const navFragmentsPath = isPostPage ? '../nav-fragments.html' : 'nav-fragments.html';

const bindMenuBehavior = () => {
  if (!menuToggle || !siteNav) {
    return;
  }

  menuToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
};

const loadNavFromFragments = async () => {
  if (!siteNav || !footerNav) {
    return;
  }

  try {
    const response = await fetch(navFragmentsPath);
    if (!response.ok) {
      throw new Error(`Failed to fetch nav fragments: ${response.status}`);
    }

    const fragmentHtml = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(fragmentHtml, 'text/html');
    const headerTemplate = doc.getElementById(`header-nav-links-${navVariant}`);
    const footerTemplate = doc.getElementById(`footer-nav-links-${navVariant}`);

    if (headerTemplate) {
      siteNav.innerHTML = headerTemplate.innerHTML;
    }

    if (footerTemplate) {
      footerNav.innerHTML = footerTemplate.innerHTML;
    }
  } catch (error) {
    console.error(error);
  } finally {
    bindMenuBehavior();
  }
};

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

loadNavFromFragments();