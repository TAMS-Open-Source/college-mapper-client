import React from 'react';
import styled from 'styled-components';
import { MdAdd } from 'react-icons/md';

import COLORS from 'util/colors';

const XButton = ({ onClick }) => (
  <ButtonDiv onClick={onClick}>
    <MdAdd />
  </ButtonDiv>
)

const BUTTON_WIDTH = 100;
const ButtonDiv = styled.div`
  position: absolute;
  top: 30px;
  right: 30px;
  color: ${COLORS.RED};
  transform: rotate(45deg);
  background-color: white;
  width: ${BUTTON_WIDTH}px;
  height: ${BUTTON_WIDTH}px;
  border-radius: ${BUTTON_WIDTH}px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 100px;
  border: 4px solid ${COLORS.RED};
  &:hover {
    cursor: pointer;
  }
`

export default XButton;