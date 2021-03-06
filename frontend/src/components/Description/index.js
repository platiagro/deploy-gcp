import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const Description = () => (
  <div className='description'>
    <Title className='white'>Implantar na GCP</Title>

    <p>
      Para implantar a PlatIAgro na Google Cloud Platform:
    </p>

    <ul>
      <li>Informe o projeto da GCP que você deseja utilizar</li>
      <li>Escolha a zona na qual deseja implantar a PlatIAgro</li>
      <li>Escolha o tipo de máquina</li>
      <li>Escolha uma quantidade de máquinas (nós do cluster)</li>
      <li>Escolha um modelo de GPU</li>
      <li>Escolha a versão da PlatIAgro</li>
      <li>Clique em Implantar</li>
      <li>Você será redirecionado assim que a implantação estiver pronta (leva aproximadamente 10 minutos)</li>
    </ul>
  </div>
);

export default Description;