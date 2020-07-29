import React, { useMemo, useRef } from 'react';
import { Layout, ContentWrapper, Authority } from '@components';
import { connect } from 'nuomi';
import useComponentSize from '@rehooks/component-size';
import DateRange from '../DateRange';
import Search from '../Search';
import CollectionTable from '../Table';
import './style.less';
import AddBtn from '../AddBtn';
import DeleteBtn from '../DeleteBtn';
import ExportBtn from '../ExportBtn';
// import DelFailModal from '../DelFailModal';
const Main = ({ delFailVisible }) => {
  const containerRef = useRef(null);
  const containerSize = useComponentSize(containerRef);
  const contentHeight = useMemo(() => containerSize.height || 0, [containerSize.height]);
  return (
    <Layout.PageWrapper>
      <ContentWrapper
        isPageHeader
        title="收款单列表"
        header={{
          left: (
            <>
              <DateRange />
              <Search />
            </>
          ),
          right: (
            <>
              <Authority code="581">
                <AddBtn />
              </Authority>
              <Authority code="586">
                <DeleteBtn />
              </Authority>
              <Authority code="587">
                <ExportBtn />
              </Authority>
            </>
          ),
        }}
        content={
          <div ref={containerRef} style={{ height: '100%' }}>
            <CollectionTable tableHeight={contentHeight} />
          </div>
        }
      />
      {/* {delFailVisible && <DelFailModal />} */}
    </Layout.PageWrapper>
  );
};

export default connect(({ key, delFailVisible }) => ({
  key,
  delFailVisible,
}))(Main);
