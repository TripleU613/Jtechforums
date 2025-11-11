const normalizeBase = (value, fallback) => {
  const trimmed = (value || '').replace(/\/$/, '');
  return trimmed || fallback;
};

const forumApiBase = normalizeBase(import.meta.env.VITE_FORUM_API_BASE_URL, '/api');
const forumWebBase = normalizeBase(import.meta.env.VITE_FORUM_URL, 'https://forums.jtechforums.org');

export const getForumWebBase = () => forumWebBase;

export const fetchForumApi = (path, init) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return fetch(`${forumApiBase}${normalizedPath}`, init);
};
