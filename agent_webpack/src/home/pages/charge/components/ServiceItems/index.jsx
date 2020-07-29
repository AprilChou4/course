import React, { forwardRef, useCallback } from 'react';
import { Divider, Icon } from 'antd';
import { AntdSelect, LinkButton } from '@components';
import postMessageRouter from '@utils/postMessage';

const ServiceItems = forwardRef(({ ...restProps }, ref) => {
  const handleClick = useCallback(() => {
    postMessageRouter({
      type: 'agentAccount/routerLocation',
      payload: {
        url: '/clientServing/3',
      },
    });
  }, []);

  return (
    <AntdSelect
      placeholder="请选择服务项目"
      dropdownStyle={{ maxWidth: 500 }}
      dropdownMatchSelectWidth={false}
      dropdownRender={(menu) => (
        <div>
          {menu}
          <Divider style={{ margin: 0 }} />
          <LinkButton
            onClick={handleClick}
            onMouseDown={(e) => e.preventDefault()}
            style={{ width: '100%', padding: 12 }}
          >
            没有你要找的服务项目？去添加
            <Icon type="double-right" />
          </LinkButton>
        </div>
      )}
      {...restProps}
      ref={ref}
    />
  );
});

export default ServiceItems;
