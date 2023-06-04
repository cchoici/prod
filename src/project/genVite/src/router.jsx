import * as R from 'ramda';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';

import Init from './Init';

const router = createBrowserRouter(
  createRoutesFromElements(<Route path="*" element={<Init />} />),
  { basename: import.meta.env.BASE_URL },
);

const navi = router.navigate.bind(router);

const listeners = [];

router.navigate = async (...args) => {
  const params = args; // [{ pathname, search, hash }, { state, preventScrollReset }]
  /* replace BASE_URL to '/' */
  params[0].pathname = R.pipe(
    R.path([0, 'pathname']),
    R.replace(import.meta.env.BASE_URL, '/'),
  )(params);
  /* have two ways to implement block */
  if (R.pathOr(false, [1, 'state', 'isForce'])(params)) return navi(...params);

  // console.log('nav listeners:', listeners);
  /* another way */
  if (listeners.length > 0) {
    const promises = listeners.map(listener => listener());
    const values = await Promise.all(promises);
    const allowed = values.every(Boolean);

    if (!allowed) return;
  }

  return navi(...params);
};

const beforeUnload = e => {
  // Cancel the event.
  e.preventDefault();
  // Chrome (and legacy IE) requires returnValue to be set.
  e.returnValue = '';
};

export const blockNavigation = listener => {
  if (listeners.length === 0) {
    window.addEventListener('beforeunload', beforeUnload, {
      capture: true,
    });
  }
  listeners.push(listener);
  // console.log(listeners);

  return () => {
    const idx = listeners.indexOf(listener);
    listeners.splice(idx, 1);
    if (listeners.length === 0) {
      window.removeEventListener('beforeunload', beforeUnload, {
        capture: true,
      });
    }
  };
};

export default router;
