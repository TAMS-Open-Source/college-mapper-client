import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiPlus, FiSearch, FiCheck } from 'react-icons/fi';
import { IoLocationSharp, IoPeopleSharp } from 'react-icons/io5';
import Loader from 'react-loader-spinner';

import { signInWithGoogle } from 'util/firebase';
import COLORS from 'util/colors';
import roundPop from 'util/roundPop';
import { getShortCollegeById } from 'util/api';
import ControlContext from 'util/controlContext';


function Popup(props) {
  // onMore is a callback to let the map zoom when 'more' is clicked
  const { id, onMore, marker } = props;
  // this information is used to control things that affect the whole application
  const { setCurrentId, addToList, setShowList, list, user } = React.useContext(ControlContext);

  // logic for whether or not the college has already been added to user's list
  const [isAdded, setIsAdded] = useState(false);

  // information-type data
  const [name, setName] = useState();
  const [location, setLocation] = useState();
  const [population, setPopulation] = useState();

  // watches to see if id is in list; if so, then the button should say "added"
  useEffect(() => {
    checkAndSetIfAdded();
  }, [list, user])
  function checkAndSetIfAdded() {
    if (list && list.includes(id) && user) {
      setIsAdded(true);
    } else {
      setIsAdded(false);
    }
  }

  // watch for changes in id and update relevant information correspondingly
  useEffect(() => {
    updatePopupInfoBasedOnId();
  }, [id])
  function updatePopupInfoBasedOnId() {
    getShortCollegeById(id).then(info => {
      setName(info.name);
      setLocation(info.location);
      setPopulation(info.population);
    })
  }

  // when add is clicked, add the college id to list, and show the user's new list
  function onClickAdd() {
    if (user) {
      addToList(id);
      setShowList(true);
    } else {
      signInWithGoogle();
    }
  }

  function onClickMore() {
    onMore();
    if (id) {
      setCurrentId(id);
    }
  }

  useEffect(() => {
    if (name && location && population && marker && marker.target && marker.target.getPopup()) {
      marker.target.getPopup().update()
    }
  }, [name, location, population])

  if (!name || !location || !population) {
    return (
      <Wrapper>
        <Loader 
          type="Oval"
          color={COLORS.BLUE}
          width={50}
        />  
      </Wrapper>
    )
  }

  return (
    <Wrapper>

      <Name>{name}</Name>
      <Location>
        <LocationMarker/>
        {location}
      </Location>
      <Population>
        <PopulationMarker/> 
        {roundPop(population)}
      </Population>

      <Buttons>
        <AddButton onClick={onClickAdd}>
          {!isAdded ? <PlusIcon /> : <Check/>}
          {isAdded ? 'Added' : 'Add'}
        </AddButton>
        <MoreButton onClick={onClickMore}>
          <SearchIcon/>
          More
        </MoreButton>
      </Buttons>

    </Wrapper>
  )
}

// REACT ICONS
const SearchIcon = styled(FiSearch)`
  font-size: 28px;
  margin-right: 5px;
`
const Check = styled(FiCheck)`
  font-size: 28px;
  margin-right: 5px;
`
const PlusIcon = styled(FiPlus)`
  font-size: 28px;
  margin-right: 5px;
`
const PopulationMarker = styled(IoPeopleSharp)`
  font-size: 34px;
  margin-right: 8px;
`
const LocationMarker = styled(IoLocationSharp)`
  font-size: 34px;
  margin-right: 8px;
`
// BUTTON CONTAINER
const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-top: 30px;
  margin-bottom: 25px;
`
// BUTTON DIVS
const MoreButton = styled.div`
  color: ${COLORS.RED};
  font-weight: 500;
  border: 2px solid ${COLORS.RED};
  padding: 10px;
  display: flex;
  align-items: center;
  font-size: 20px;
  border-radius: 15px;
  background-color: ${COLORS.RED}25;
  &:hover {
    cursor: pointer;
  }
`
const AddButton = styled.div`
  color: ${COLORS.TEAL};
  font-weight: 600;
  border: 2px solid ${COLORS.TEAL};
  padding: 10px;
  display: flex;
  align-items: center;
  font-size: 20px;
  border-radius: 15px;
  background-color: ${COLORS.TEAL}25;
  &:hover {
    cursor: pointer;
  }
  margin-right: 10px;
`
// INFO DIVS
const Population = styled.div`
  font-size: 24px;
  font-weight: 600;
  display: flex;
  align-items: center;
  margin-top: 10px;
`
const Location = styled.div`
  font-size: 24px;
  font-weight: 600;
  display: flex;
  align-items: center;
  margin-top: 25px;
`
// COLLEGE NAME
const Name = styled.div`
  font-weight: 700;
  font-size: 30px;
  line-height: 35px;
`
// GENERAL WRAPPER
const Wrapper = styled.div`
  color: ${COLORS.BLUE};
`

export default Popup;