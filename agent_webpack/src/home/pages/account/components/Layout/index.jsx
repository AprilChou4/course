import React from 'react';
import { connect } from 'nuomi';
import { Authority, Content } from '@components';
import Search from '../Search';
import Table from '../Table';
import DateMonth from '../DateMonth';
import ReviewButton from '../ReviewBtn';
import CheckoutBtn from '../CheckoutBtn';
import More from '../More';
import { role } from '../../utils';

const { Head, Left, Right, Body } = Content;

const App = (props) => {
  const { enabledReview } = props;
  return (
    <Content>
      <Head>
        <Left>
          <DateMonth />
          <Authority code="56">
            <Search />
          </Authority>
        </Left>
        <Right>
          {enabledReview && role !== 3 && <ReviewButton />}
          {role !== 3 && <CheckoutBtn />}
          <More />
        </Right>
      </Head>
      <Body>
        <Table />
      </Body>
    </Content>
  );
};

export default connect(({ key, enabledReview }) => ({
  key,
  enabledReview,
}))(App);
