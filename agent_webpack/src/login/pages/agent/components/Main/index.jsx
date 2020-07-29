import React from 'react';
import Banner from '@login/layout/components/Banner';
import System from '../System';
import Platform from '../Platform';

const Main = () => {
  return (
    <>
      <Banner type={1} />
      <System />
      <Platform />
    </>
  );
};

export default Main;
