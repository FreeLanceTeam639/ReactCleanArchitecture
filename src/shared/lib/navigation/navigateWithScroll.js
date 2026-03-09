export function navigateWithScroll(event, pathname, navigate) {
  event.preventDefault();
  navigate(pathname);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
