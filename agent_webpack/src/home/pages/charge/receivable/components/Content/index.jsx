import React, { useRef } from 'react';
import { useMeasure } from 'react-use';
import { get } from '@utils';
import MainContent from '../MainContent';
import DataGride from '../DataGride';
import Footer from '../Footer';

const Content = () => {
  const [ref, { height: totalHeight }] = useMeasure();
  const [mainContentRef, { height: mainContentHeight }] = useMeasure();
  const [footerRef, { height: footerHeight }] = useMeasure();

  return (
    <div style={{ height: '100%' }} ref={ref}>
      <div ref={mainContentRef}>
        <MainContent />
        <div style={{ paddingBottom: 1 }}>
          <div className="title-mark">服务项目</div>
        </div>
      </div>
      <div style={{ height: (totalHeight || 0) - (mainContentHeight || 0) - (footerHeight || 0) }}>
        <DataGride scroll={{ y: true }} />
      </div>
      <div ref={footerRef}>
        <Footer />
      </div>
    </div>
  );
};

export default Content;
