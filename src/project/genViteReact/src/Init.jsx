import { Routes, Route } from 'react-router-dom';

import Default from './Default';

const Init = () => {
  return (
    <Routes>
      <Route path="/*" element={<Default />} />
    </Routes>
  );
};

export default Init;
