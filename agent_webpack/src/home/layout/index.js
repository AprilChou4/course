import React from 'react';
import Layout from './components/Layout';

export default {
  id: 'agentAccount',
  state: {},
  effects: {},
  render() {
    return <Layout>{this.children}</Layout>;
  },
};
