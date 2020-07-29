import React from 'react';
import { useMeasure } from 'react-use';
import MainContent from '../MainContent';
import ServiceForm from '../ServiceForm';
import ReferenceModal from '../ReferenceModal';
import Footer from '../Footer';

const Content = ({ form }) => {
  const [ref, { height: totalHeight }] = useMeasure();
  const [mainContentRef, { height: mainContentHeight }] = useMeasure();
  const [footerRef, { height: footerContentHeight }] = useMeasure();

  const calcHeight = Math.max(
    220,
    (totalHeight || 0) - (mainContentHeight || 0) - (footerContentHeight || 0) - 30,
  );

  return (
    <div style={{ height: '100%' }} ref={ref}>
      <div ref={mainContentRef}>
        <MainContent form={form} />
      </div>
      <div className="title-mark">服务项目</div>
      <div
        style={{
          height: calcHeight,
        }}
      >
        <ServiceForm />
      </div>
      <div ref={footerRef}>
        <Footer />
      </div>
      <ReferenceModal />
    </div>
  );
};

export default Content;
