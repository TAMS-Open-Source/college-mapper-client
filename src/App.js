import React, { useState, useEffect } from 'react';
import Map from 'components/Map';
import styled from 'styled-components';

import GlobalStyle from 'util/globalStyle';
import Buttons from 'components/Buttons';
import Filter from 'components/Filter';
import Calendar from 'components/Calendar';
import CollegeInformation from 'components/Information';
import BugFixMessage from 'components/BugFixMessage';
import CollegeList from 'components/List';

import ControlContext from 'util/controlContext';
import { auth, db } from 'util/firebase';
import { ALL_COLLEGES } from 'util/filterChoices';

function App() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [user, setUser] = useState(null);
  const [list, setList] = useState(null);
  const [showList, setShowList] = useState(false);
  const [filter, setFilter] = useState(ALL_COLLEGES);

  const toggleCalendar = () => setShowCalendar(!showCalendar);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(!user ? null : {
        uid: user.uid,
        name: user.displayName
      });
    })
    return unsubscribe;
  }, [])

  useEffect(() => {
    if (user && user.uid) {
      db.ref(`user/${user.uid}/list`).once('value', res => {
        const data = res.val();
        if (data !== null) {
          setList(data);
        } else {
          setList([]);
        }
      })
    }
  }, [user]);

  useEffect(() => {
    if (user && user.uid && (list !== null)) {
      db.ref(`user/${user.uid}/list`).set(list);
    }
  }, [user, list]);

  function addToList(item) {
    if (!list.includes(item)) {
      setList([...list, item]);
    }
  }

  function removeFromList(item) {
    setList(list.filter(thing => thing != item));
  }

  return (
    <>
    <GlobalStyle />
    <ControlContext.Provider value={{ toggleCalendar, setCurrentId, user, setUser, addToList, setShowList, list, setList, removeFromList, setFilter, filter }}>
      <Container>
        <Map />
        <Buttons />
        <Filter />
      </Container>
      {showList && <CollegeList list={list} />}
      <CollegeInformation id={currentId} />
      {showCalendar && <Calendar />}
      <BugFixMessage />
    </ControlContext.Provider>
    </>
  );
}

// Container used to allow for all the components to be positioned relative
// to the screen
const Container = styled.div`
  position: relative;
  height: 100vh;
  width: 100vw;
`

export default App;
