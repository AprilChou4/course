import React, { useMemo, useRef } from 'react';
import { Layout, ContentWrapper } from '@components';
import { connect } from 'nuomi';
import useComponentSize from '@rehooks/component-size';
import DateRange from '../DateRange';
import Title from '../Title';
import PlanTable from '../PlanTable';
import DetailTable from '../DetailTable';
import './style.less';
import ExportBtn from '../ExportBtn';

const Main = ({ tableType }) => {
  const containerRef = useRef(null);
  const containerSize = useComponentSize(containerRef);
  const contentHeight = useMemo(() => containerSize.height || 0, [containerSize.height]);
  return (
    <Layout.PageWrapper>
      <ContentWrapper
        isPageHeader
        title={<Title />}
        header={{
          left: (
            <>
              <DateRange />
            </>
          ),
          right: (
            <>
              <ExportBtn />
            </>
          ),
        }}
        content={
          <div ref={containerRef} style={{ height: '100%' }}>
            {tableType ? (
              <PlanTable tableHeight={contentHeight} />
            ) : (
              <DetailTable tableHeight={contentHeight} />
            )}
          </div>
        }
      />
    </Layout.PageWrapper>
  );
};

export default connect(({ key, tableType }) => ({ key, tableType }))(Main);
