import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import DragSortableList from 'react-drag-sortable'
import { FaChevronRight } from 'react-icons/fa';
import { IoTrash } from 'react-icons/io5';

import ControlContext from 'util/controlContext';

import { getShortCollegeById } from 'util/api';
import COLORS from 'util/colors';
import grab from 'assets/grab.png';

function List() {
  const { list, setList, setShowList } = React.useContext(ControlContext);

  function onSort(thing) {
    const ids = thing.map(thing => thing.content.props.id);
    setList(ids);
  }

  const items = list && list.map((item, ind) => ({content: (<Element id={item} ind={ind} />)}))

  return (
    <Handler>
      <Container>
        <Title>My List</Title>
        {items && <DragSortableList 
          items={items}
          onSort={onSort} 
          type="vertical"
          />}
        <GrabButton />
      </Container>
      <Handle onClick={() => setShowList(false)}>
        <FaChevronRight 
          style={{
            color: 'white',
            fontSize: '40px'
          }}
        />
      </Handle>
    </Handler>
  )
}

const Handler = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  height: 100vh;
  width: 400px;
`

const Handle = styled.div`
  width: 70px;
  height: 200px;
  background-color: ${COLORS.BLUE};
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: -70px;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  &:hover {
    cursor: pointer;
  }
  top: calc(50vh);
`

const Title = styled.div`
  font-weight: 600;
  font-size: 50px;
  margin-top: 40px;
  margin-bottom: 30px;
`

const Container = styled.div`
  height: 100%;
  box-sizing: border-box;
  width: 100%;
  background-color: white;
  position: absolute;
  top: 0;
  right: 0;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  padding: 30px;
  padding-left: 20px;
  box-shadow: -4px 2px 6px 1px rgba(0,0,0,0.37);
  overflow-y: scroll;
`

// contacts api for information
function Element({ id, ind }) {

  const [text, setText] = useState();
  const { removeFromList, setCurrentId } = React.useContext(ControlContext);

  useEffect(() => {
    getShortCollegeById(id).then(info => {
      setText(info.name);
    })
  }, [])

  return (
    <ElementDiv ind={ind} onClick={() => setCurrentId(id)}>
      <Num>{ind + 1}</Num>
      <Name>{text}</Name>
      <Delete onClick={(e) => {
        e.stopPropagation();
        removeFromList(id);
      }}/>
    </ElementDiv>
  )
}

const Delete = styled(IoTrash)`
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 24px;
  color: #AF0019;

  &:hover {
    cursor: pointer;
  }
`

const Name = styled.div`
  margin-left: 10px;
  font-size: 24px;
  font-weight: 500;
`

const NUM_WIDTH = 50;
const Num = styled.div`
  color: ${COLORS.BLUE};
  font-size: 30px;
  font-weight: 700;
  width: ${NUM_WIDTH}px;
  height: ${NUM_WIDTH}px;
  border-radius: ${NUM_WIDTH}px;
  border: 5px solid ${COLORS.BLUE};
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`

const ElementDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 25px 0px;
  padding-left: 10px;
  ${props => (props.ind % 2 == 0) && `background-color: #EEEEEE;`}
  &:hover {
    cursor: grab;
  }
`

const GrabButton = () => (
  <GrabDiv>
    <img src={grab} />
    <div>Drag to Sort!</div>
  </GrabDiv>
)

const GrabDiv = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  border: 6px solid black;
  border-radius: 25px;
  position: fixed;
  bottom: 20px;
  right: 10px;
  padding: 5px;
  opacity: 0.5;
  right: 30px;
  max-width: 200px;
  line-height: 30px;
  user-select: none;
  div {
    font-weight: 700;
    font-size: 28px;
  }
  img {
    width: 50px;
    transform: rotate(-30deg);
    margin-right: 12px;
    margin-left: 8px;
  }
  z-index: 1;
`

export default List;