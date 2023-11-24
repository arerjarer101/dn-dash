import { useLayout } from '@/layout/composables/layout';

const { changeThemeSettings } = useLayout();

function changeTheme (theme, mode) {
  const elementId = 'theme-css';
  const linkElement = document.getElementById(elementId);
  const cloneLinkElement = linkElement.cloneNode(true);
  const newThemeUrl = `/themes/${theme}/theme.css`

  cloneLinkElement.setAttribute('id', elementId + '-clone');
  cloneLinkElement.setAttribute('href', newThemeUrl);
  cloneLinkElement.addEventListener('load', () => {
      linkElement.remove();
      cloneLinkElement.setAttribute('id', elementId);
      changeThemeSettings(theme, mode === 'dark');
  });
  linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);

  localStorage.mode = mode
  localStorage.theme = theme
};

export {changeTheme}