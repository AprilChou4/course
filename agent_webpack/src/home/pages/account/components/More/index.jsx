/* eslint-disable import/no-cycle */
import React, { createContext, useState } from 'react';
import { DropDown, Authority } from '@components';
import AccountHandover from './AccountHandover';
import RecycleBin from './RecycleBin';
import CustomColumns from './CustomColumns';
import Unlock from './Unlock';

export const VisibleContext = createContext(false);
const style = {
  marginLeft: 12,
};

const More = () => {
  const [visible, setVisible] = useState(false);
  const handleVisibleChange = (status) => {
    setVisible(status);
  };
  return (
    <VisibleContext.Provider value={visible}>
      <DropDown style={style} onVisibleChange={handleVisibleChange}>
        <Authority code="57">
          <AccountHandover />
        </Authority>
        <RecycleBin />
        <CustomColumns />
        <Authority code="495">
          <Unlock />
        </Authority>
      </DropDown>
    </VisibleContext.Provider>
  );
};

export default More;
