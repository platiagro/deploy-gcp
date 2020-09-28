import React from 'react';
import { connect } from 'react-redux';
import {
  Layout, Typography, Form, Button, Select, Divider, Spin, Alert
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import {
  updateSigninStatus, fetchProjects, setProjectId,
  setZone, setVersion, startDeployment, signOut, verifyDeploymentStatus
} from '../../redux/actions';

const { Title } = Typography;
const { Option } = Select;

class SignInForm extends React.Component {
  componentDidMount() {
    window.gapi.load('auth2', async () => {
      await window.gapi.auth2.init({
        client_id: '282396092836-4tml5iokfcrl02erkdoa6il3d1opna7r.apps.googleusercontent.com'
      });

      // Handle the initial sign-in state.
      const GoogleAuth = window.gapi.auth2.getAuthInstance();
      const isSignedIn = GoogleAuth.isSignedIn.get();
      this.props.updateSigninStatus(isSignedIn);

      // Listen for sign-in state changes.
      GoogleAuth.isSignedIn.listen(this.props.updateSigninStatus);

      window.gapi.signin2.render('g-signin2', {
        'scope': 'https://www.googleapis.com/auth/cloud-platform',
        'longtitle': true,
        'theme': 'dark'
      });
    });
  }

  render() {
    return (
      <>
        <Title level={2} className='gray'>Faça o login para implantar PlatIAgro</Title>
        <p>
          Suas informações de usuário são necessárias para realizar ações na GCP.
        </p>
        <div id='g-signin2' />
      </>
    );
  }
};

class DeployForm extends React.Component {
  componentDidMount() {
    const { token, fetchProjects } = this.props;

    // calls Google API to list gcloud projects
    fetchProjects(token);

    this.interval = setInterval(() => {
      const {
        token, projectId, zone, clusterId, status, url, isPolling,
        verifyDeploymentStatus
      } = this.props;
      verifyDeploymentStatus(projectId, zone, clusterId, token, status, isPolling);
      if (url !== '') {
        window.location.href = url;
      }
    }, 3000);
  }

  componentWillUnmount() {
    if (this.interval != null) {
      clearInterval(this.interval);
    }
  }

  renderSwitch(status) {
    const {
      token, projectList, zoneList, versionList, projectId, setProjectId,
      zone, setZone, version, setVersion, startDeployment, signOut,
    } = this.props;

    const projectIdProps = {};
    if (status === 'PROJECT_UNDEFINED') {
      projectIdProps.validateStatus = 'error';
      projectIdProps.help = 'Selecione um projeto do GCP';
    }

    const zoneProps = {};
    if (zoneList.length > 0) {
      zoneProps.defaultValue = zoneList[0];
    }

    const versionProps = {};
    if (versionList.length > 0) {
      versionProps.defaultValue = versionList[0].value;
    }

    switch (status) {
      case 'PROVISIONING':
        return <WaitingForm />;
      default:
        const formItemLayout = {
          labelCol: { span: 7 },
          wrapperCol: { span: 12 },
        };
        return (
          <Form>
            {status === 'ERROR' && (
              <Form.Item>
                <Alert
                  message='Algo de errado aconteceu enquanto a implantação era realizada na GCP. Tente novamente mais tarde.'
                  closeText='Fechar'
                  type='error' />
              </Form.Item>
            )}
            <Form.Item
              {...formItemLayout}
              {...projectIdProps}
              label='Projeto GCP'>
              <Select
                onChange={setProjectId}
                placeholder='Selecione um projeto'
                dropdownRender={menu => (
                  <div>
                    {menu}
                    <Divider style={{ margin: '4px 0' }} />
                    <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                      <Button
                        type='link'
                        style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
                        onMouseDown={e => e.preventDefault()}
                        onClick={e => window.open('https://console.cloud.google.com/projectcreate?project=&folder=&organizationId=0')}
                      >
                        <PlusOutlined /> Criar um novo projeto
                      </Button>
                    </div>
                  </div>
                )}>
                {projectList.map((p) => (
                  <Option key={p.projectId} value={p.projectId}>{p.projectId}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              label='Zona do GKE'>
              <Select
                {...zoneProps}
                onChange={setZone}>
                {zoneList.map((z) => (
                  <Option key={z} value={z}>{z}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              label='Versão'>
              <Select
                {...versionProps}
                onChange={setVersion}>
                {versionList.map((v) => (
                  <Option key={v.value} value={v.value}>{v.text}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button
                type='primary'
                htmlType='button'
                className='login-form-button'
                onClick={() => startDeployment(projectId, zone, version, token)}>
                Implantar
              </Button>
              <Button
                htmlType='button'
                className='signout-form-button'
                onClick={() => signOut()}>
                Sair da conta Google
              </Button>
            </Form.Item>
          </Form>
        );
    }
  }

  render() {
    const { status } = this.props;
    return (
      <>
        <Title level={2} className='gray'>Implantar PlatIAgro</Title>
        {this.renderSwitch(status)}
      </>
    );
  }
}

const WaitingForm = () => (
  <>
    <Spin />
    <p style={{ textAlign: 'center' }}>Aguarde alguns minutos enquanto a infraestrutura é criada na Google Cloud.</p>
  </>
);

const CustomForm = ({
  isAuthorized, token, updateSigninStatus, fetchProjects,
  createProject, projectList, zoneList, versionList, projectId, setProjectId,
  zone, setZone, version, setVersion,
  clusterId, startDeployment, signOut, status, url, isPolling, verifyDeploymentStatus
}) => (
    <Layout className='deployForm'>

      {isAuthorized ? (
        <DeployForm
          token={token}
          fetchProjects={fetchProjects}
          createProject={createProject}
          projectList={projectList}
          zoneList={zoneList}
          versionList={versionList}
          projectId={projectId}
          setProjectId={setProjectId}
          zone={zone}
          setZone={setZone}
          version={version}
          setVersion={setVersion}
          clusterId={clusterId}
          startDeployment={startDeployment}
          signOut={signOut}
          status={status}
          url={url}
          isPolling={isPolling}
          verifyDeploymentStatus={verifyDeploymentStatus} />
      ) : (
          <SignInForm
            updateSigninStatus={updateSigninStatus} />
        )}

    </Layout>
  );

const mapStateToProps = (state) => {
  return {
    // google auth props
    isAuthorized: state.isAuthorized,
    token: state.token,

    // deployment props
    projectList: state.projectList,
    zoneList: state.zoneList,
    versionList: state.versionList,
    isCreatingProject: state.isCreatingProject,
    projectId: state.projectId,
    projectName: state.projectName,
    zone: state.zone,
    version: state.version,
    clusterId: state.clusterId,
    status: state.status,
    url: state.url,
    isPolling: state.isPolling,
  };
};

const mapDispatchToProps = {
  // google auth functions
  updateSigninStatus,

  // deployment functions
  fetchProjects,
  setProjectId,
  setZone,
  setVersion,
  startDeployment,
  signOut,
  verifyDeploymentStatus,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomForm);
