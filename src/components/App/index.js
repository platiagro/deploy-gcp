import React from 'react';
import { Layout, Row, Col } from 'antd';

import logo from '../../assets/logo.png';
import './App.css';
import Description from '../Description';
import Form from '../Form';

const { Header } = Layout;

const AppHeader = () => (
  <Header>
    <div className='logo'>
      <img src={logo} alt='PlatIAgro Logo' />
    </div>
  </Header>
);

const AppBody = () => (
  <Layout className='rootPage'>
    <Row className='rootPageBody'>
      <Col span={12}>
        <Description />
      </Col>
      <Col span={12}>
        <Form />
      </Col>
    </Row>
  </Layout>
);

const App = () => (
  <Layout>
    <AppHeader />
    <AppBody />
  </Layout>
);

export default App;
