import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaChevronUp } from 'react-icons/fa';

import COLORS from 'util/colors';
import CONSTANTS from 'util/constants';
import ControlContext from 'util/controlContext';

import { ALL_COLLEGES, TOP_CS, TOP_PREMED, TOP_50, TOP_STATE } from 'util/filterChoices';
const FILTER_CHOICES = [ ALL_COLLEGES, TOP_CS, TOP_PREMED, TOP_50, TOP_STATE ];


function Filter() {

  const [folded, setFolded] = useState(false);
  const { filter, setFilter } = React.useContext(ControlContext);

  return (
    <FilterDiv>
      {!folded ?
      FILTER_CHOICES.map(choice => (
        <FilterOption name={choice} active={choice == filter} onClick={() => {
          setFilter(choice)
        }}/>
      )) : <FilterOption name={filter} active />
      }
      <ChevronDiv onClick={() => {
        setFolded(!folded);
      }}>
        <Chevron folded={folded} />
      </ChevronDiv>
    </FilterDiv>
  )
} 


const FilterDiv = styled.div`
  width: 270px;
  background-color: white;
  position: absolute;
  top: 20px;
  left: 20px;
  border-radius: 25px;
  padding: 20px 20px 10px 20px;
  position: relative;

  box-shadow: ${CONSTANTS.STANDARD_SHADOW};
`

const ChevronDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  &:hover {
    cursor: pointer;
  }
`

const Chevron = styled(FaChevronUp)`
  font-size: 30px;
  color: ${COLORS.BLUE};
  ${props => props.folded && `transform: rotate(180deg);`}
`

const TOOLTIP_TEXTS = {
  [ALL_COLLEGES]: 'Shows the top 10 Colleges in the area.',
  [TOP_CS]: 'Shows the top 10 schools for CS in the nation.',
  [TOP_PREMED]: 'Shows the top 10 schools for Premed in the nation.',
  [TOP_STATE]: 'Shows the top 25 state schools in the nation.',
  [TOP_50]: 'Shows the top 50 universities in the nation.'
}

function FilterOption({ name, active, onClick }){
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <FilterOptionDiv onClick={onClick}>
      {showTooltip && <Tooltip>
        {TOOLTIP_TEXTS[name]}
      </Tooltip>}
      <Circle>
        {active && <FilledCircle/>}
      </Circle>
      <FilterName
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {name}
      </FilterName>
    </FilterOptionDiv>
  )
}

const Tooltip = styled.div`
  background-color: #333333;
  position: absolute;
  color: white;
  padding: 3px 6px;
  left: 40px;
  z-index: 1;
  border-radius: 3px;
  top: 100%;
`

const FilterOptionDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 5px;
  position: relative;
  &:hover {
    cursor: pointer;
  }
`

const CIRCLE_WIDTH = 30;
const Circle = styled.div`
  border: 2px solid ${COLORS.BLUE};
  width: ${CIRCLE_WIDTH}px;
  height: ${CIRCLE_WIDTH}px;
  border-radius: ${CIRCLE_WIDTH}px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const FILL_WIDTH = CIRCLE_WIDTH - 10;
const FilledCircle = styled.div`
  background-color: ${COLORS.TEAL};
  width: ${FILL_WIDTH}px;
  height: ${FILL_WIDTH}px;
  border-radius: ${FILL_WIDTH}px;
`

const FilterName = styled.div`
  color: ${COLORS.BLUE};
  font-size: 22px;
  font-weight: 600;
  margin-left: 8px;
`

export default Filter;