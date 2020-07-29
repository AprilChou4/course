import React, { useMemo, useRef } from 'react';
import { isElement } from 'react-is';
import useComponentSize from '@rehooks/component-size';
import Layout from '../Layout';

const { Title, Header, Left, Right, Content } = Layout;

const ContentWrapper = ({ isPageHeader, title, header, content, headerStyle, contentStyle }) => {
  const containerRef = useRef(null);
  const containerSize = useComponentSize(containerRef);
  const titleRef = useRef(null);
  const titleSize = useComponentSize(titleRef);
  const headerRef = useRef(null);
  const headerSize = useComponentSize(headerRef);

  const isElementHeader = useMemo(() => isElement(header), [header]);

  const contentHeight = useMemo(
    () => (containerSize.height || 0) - (titleSize.height || 0) - (headerSize.height || 0),
    [containerSize.height, headerSize.height, titleSize.height],
  );

  return (
    <Layout ref={containerRef}>
      <Title ref={titleRef}>{title}</Title>
      <Header ref={headerRef} style={{ ...(isPageHeader ? {} : { padding: 0 }), ...headerStyle }}>
        {isElementHeader ? (
          header
        ) : (
          <>
            <Left>{header.left}</Left>
            <Right>{header.right}</Right>
          </>
        )}
      </Header>
      <Content style={{ ...contentStyle, height: contentHeight }}>{content}</Content>
    </Layout>
  );
};

export default ContentWrapper;
