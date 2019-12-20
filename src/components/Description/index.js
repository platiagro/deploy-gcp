import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const Description = () => (
  <div className='description'>
    <Title className='white'>Implantar na GCP</Title>

    <p>
      Para implantar PlatIAgro na Google Cloud Platform:
    </p>

    <ul>
      <li>Informe o projeto GCP que você deseja utilizar</li>
      <li>Escolha a zona na qual deseja implantar a PlatIAgro</li>
      <li>Escolha a versão da PlatIAgro</li>
      <li>Clique em Criar Implantação</li>
      <li>Você será redirecionado assim que a implantação estiver pronta</li>
    </ul>
  </div>
);

export default Description;