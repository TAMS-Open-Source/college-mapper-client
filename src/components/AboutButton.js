import React from 'react';
import styled from 'styled-components';

import COLORS from 'util/colors';

const AboutButton = (props) => (
  <ButtonBase title="About/Help" {...props}>
    ?
  </ButtonBase>
);

const WIDTH = 50;
const ButtonBase = styled.div`
  position: absolute;
  right: 10px;
  bottom: 20px;

  background-color: #FFFFFF70;
  font-size: 35px;
  font-weight: bold;
  height: ${WIDTH}px;
  width: ${WIDTH}px;
  border-radius: ${WIDTH}px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${COLORS.BLUE};
  &:hover {
    cursor: pointer;
  }
`

export default AboutButton;