import React from 'react';
import styled from 'styled-components';

import COLORS from 'util/colors';

const BugFixMessage = () => (
  <Container>
    Spot a bug? Have a request? Click <a target="_blank" href={process.env.REACT_APP_SUPPORT_LINK}>Here</a>.
  </Container>
)

const Container = styled.div`
  background-color: #FFFFFF80;
  color: ${COLORS.BLUE};
  position: absolute;
  z-index: 1;
  bottom: 0;
  left: 100px;
  font-size: 18px;
  padding: 8px;
  padding-bottom: 4px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  a {
    text-decoration: underline;
    color: #0629A9;
  }
`

export default BugFixMessage;