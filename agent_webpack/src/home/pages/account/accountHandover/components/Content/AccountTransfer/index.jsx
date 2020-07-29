import React, { useMemo, useRef } from 'react';
import useComponentSize from '@rehooks/component-size';
import Header from './Header';
import Transfering from './Transfering';
import HistoricalTransfer from './HistoricalTransfer';
import '../style.less';

const AccountTransfer = () => {
  // flex有兼容性问题，就用js监听header高度动态变化了
  const mainRef = useRef(null);
  const mainSize = useComponentSize(mainRef);
  const headerRef = useRef(null);
  const headerSize = useComponentSize(headerRef);

  // header高度自适应，然后计算content高度
  const contentHeight = useMemo(() => (mainSize.height || 0) - (headerSize.height || 0) - 12, [
    headerSize.height,
    mainSize.height,
  ]);

  return (
    <div styleName="main" ref={mainRef}>
      <div styleName="header" ref={headerRef}>
        <Header />
      </div>
      <div style={{ height: contentHeight }}>
        <div styleName="item">
          <Transfering />
        </div>
        <div styleName="item">
          <HistoricalTransfer />
        </div>
      </div>
    </div>
  );
};

export default AccountTransfer;
