// src/screens/Main/Mapa.tsx

import React from 'react';
import styled from 'styled-components/native';
import { theme } from '../../theme';

export default function Mapa() {
  return (
    <Container>
      <Title>📍 Ver mapa de máquinas</Title>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${theme.COLORS.PRETO};
`;

const Title = styled.Text`
  color: ${theme.COLORS.WHITE};
  font-size: ${theme.FONT_SIZE.XL}px;
  font-family: ${theme.FONT_FAMILY.BEBASNEUE};
`;
