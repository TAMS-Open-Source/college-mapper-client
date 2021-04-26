import React from 'react';
import styled from 'styled-components';

const About = ({ toggleAbout }) => (
  <>
  <Wrapper>
    <InvisibleBg onClick={toggleAbout}></InvisibleBg>
    <View>
      <h1>About</h1>
      <p>
        College Mapper was made to help prospective college students explore American colleges in an explorative geographic manner. By using this tool, you can learn
        which top colleges are in which area of America. Fruthermore, this app allows one to store a list of one's favorite colleges, as well as keep a calendar of
        important college deadlines.
      </p>
      <h2>How to Use</h2>
      <p>
        By toggling values on the <b>Filter</b> on the top left, you can choose between various categories of colleges. The default, <b>All Colleges</b>, will
        show you the top 10 colleges in your browser's viewport. 
      </p>
      <p>
        By signing in after clicking your <b>Profile Icon</b>, you can add colleges to a <b>List</b>, as well as gain the ability to add events to the <b>Calendar</b>.
        You can adjust your profile information on the component that shows up after you sign in.
      </p>
      <h2>Credits</h2>
      <p>
        College Mapper was worked on by a team of TAMS students in the 2020-2021 school year.
      </p>
      <TwoColumns>
        <div>
          <b>Back-End:</b>
          <ul>
            <li>Kapil Yadav</li>
            <li>Pranay Gosar</li>
            <li>Andrew Zheng</li>
            <li>Ajay Jayanth</li>
            <li>Satwik Chalasani</li>
            <li>Sarvesh Sathish</li>
            <li>Zhuoli Xie</li>
            <li>Neil Agrawal</li>
            <li>Aaron Mathews</li>
          </ul>
        </div>
        <div>
          <b>Front-End:</b>
          <ul>
            <li>Leo Lu</li>
            <li>Shweta Kumaran</li>
            <li>Stephanie You</li>
            <li>Brianna Chan</li>
            <li>Jennifer Ai</li>
            <li>Sarvesh Sathish</li>
            <li>Lisa Li</li>
            <li>Joanne Liu</li>
          </ul>
        </div>
      </TwoColumns>
      <p>
        College Mapper is open-sourced under the MIT License. You can find its code on <a href="https://github.com/TAMS-Open-Source">GitHub</a>.
      </p>
    </View>
  </Wrapper>
  </>
);

const InvisibleBg = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  &:hover {
    cursor: pointer;
  }
`

const TwoColumns = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
 
`

const View = styled.div`
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 30px;
  width: 50%;
  box-sizing: border-box;
  padding: 15px;
  z-index: 1;

  max-height: 90vh;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #00000080;

  display: flex;
  align-items: center;
  justify-content: center;
`

export default About;