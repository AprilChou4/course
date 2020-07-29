import React, { useCallback } from 'react';
import { connect } from 'nuomi';
import { Button } from 'antd';
import Qs from 'qs';
import classnames from 'classnames';
import pubData from 'data';
import { If } from '@components';
import { omitBy, isNil } from '@utils';
import styles from './style.less';

const userAuth = pubData.get('authority');

const Export = ({ children, className, dispatch, params = {}, ...restProps }) => {
  const handleClick = useCallback(() => {
    const { url, roleIds, ...restParams } = params;
    if (!url) {
      return;
    }

    const payload = omitBy(
      { ...restParams, roleIds: roleIds ? roleIds.join(',') || null : null },
      isNil,
    );
    window.open(`${basePath}${url}.do?${Qs.stringify(payload)}`);
  }, [params]);

  return (
    <If condition={userAuth[42]}>
      <Button
        id="andy"
        onClick={handleClick}
        {...restProps}
        className={classnames(styles.button, className)}
      >
        {children}
      </Button>
    </If>
  );
};

export default connect()(Export);
