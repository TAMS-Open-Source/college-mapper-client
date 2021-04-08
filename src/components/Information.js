import React, { useState, useEffect } from 'react';
import 'assets/CollegeInformation.css'; // style kept in raw css file (default)
import { FaMapMarkerAlt, FaUserFriends, FaChevronRight } from "react-icons/fa";
import styled from 'styled-components';
import Loader from "react-loader-spinner";

import { signInWithGoogle } from 'util/firebase';
import { getCollegeById } from 'util/api';
import COLORS from 'util/colors';
import ControlContext from 'util/controlContext';
import { getSummary } from 'util/wiki';
import roundPop from 'util/roundPop';

function CollegeInformation({ id }) {
  const [info, setInfo] = useState();
  const [description, setDescription] = useState();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    getCollegeById(id).then(info => {
      setInfo(info);
    })
  }, [id]);

  const { setCurrentId, list, addToList, user } = React.useContext(ControlContext);

  function clearId() {
    setCurrentId(null);
  }

  useEffect(() => {
    if (info && info.name) {
      getSummary(info.name).then(summary => {
        if (summary) {
          setDescription(summary)
        }
      })
    }
  }, [info]);

  useEffect(() => {
    if (list) {
      const added = list.includes(id);
      setAdded(added);
    }
  }, [id, list]);

  useEffect(() => {
    setDescription(null);
  }, [id])

  function onAddPressed() {
    if (user) {
      addToList(id);
    } else {
      signInWithGoogle();
    }
  }

  if (!id) {
    return null;
  }
  
  return (
    <Handler>
      <Handle onClick={clearId}>
        <FaChevronRight 
          style={{
            color: 'white',
            fontSize: '40px'
          }}
        />
      </Handle>

      <div className="CollegeInformation">

        <div>
          <h1>{info && info.name}</h1>
        </div>

        <div>
          <p className="CollegeInformationPopAndLoc">
            <span>
              <i className="CollegeInformationPinIcon">
                <FaMapMarkerAlt/>
              </i>
              {info && info.location} 
            </span>

            <span className="CollegeInformationLoc">
              <i className="CollegeInformationPeopleIcon">
                <FaUserFriends/>
              </i>
              {info && roundPop(info.population)}
            </span>
          </p>
        </div>	

        <div>
          <h2 className="CollegeInformationBottomBorder">Test Scores</h2>

          <p className="CollegeInformationLeft">
            SAT 
            <span className="CollegeInformationRight">
            {info && info.sat}
            </span>
          </p>

          <p className="CollegeInformationLeft">
            ACT 
            <span className="CollegeInformationRight">
            {info && info.act}
            </span>
          </p>

        </div>

        <div>
          <h2 className="CollegeInformationBottomBorder">Description</h2>
          {!description && <div style={{
            display: 'flex',
            justifyContent: 'center'
          }}>
            <Loader 
              type="Oval"
              color={COLORS.BLUE}
              width={50}
            />  
          </div>}
          <div className="description">{description && description.summary} {description && <a target="_blank" href={description.url}>Wikipedia</a>} </div>
        </div>

        <div className="CollegeInformationButtonHelper">

          <button className="CollegeInformationButton" onClick={onAddPressed}>
            {added ? 'Added' : '+ Add'}
          </button>

        </div>
        </div>	
    </Handler>
  );
}

const Handler = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  height: 100vh;
  width: 400px;
  box-shadow: -4px 2px 6px 1px rgba(0,0,0,0.37);
  z-index: 1;
`

const Handle = styled.div`
  width: 70px;
  height: 200px;
  background-color: ${COLORS.TEAL};
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: -70px;
  bottom: calc(50vh + 10px);
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  &:hover {
    cursor: pointer;
  }
`


export const Example = () => <CollegeInformation
		college_name="tHe best college in the worldddd"
		location="Golden, CO"
		population="25,000"
		sat_score="9990"
		act_score="99"
		description="wow such an epic school I love it to bits play fire emblem 4 it's a good game i swear"
	/>;


export default CollegeInformation;
