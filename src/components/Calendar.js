import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Moment from 'moment';
import { BsTriangleFill } from 'react-icons/bs';
import { MdAdd } from 'react-icons/md';

import XButton from 'components/XButton';

import { db, signInWithGoogle } from 'util/firebase';
import COLORS from 'util/colors';
import MONTH_ABRVS, { fullMonthNames } from 'util/monthAbrvs';
import ControlContext from 'util/controlContext';
import defaultDates from 'util/defaultDates';

function Calendar() {

  const { toggleCalendar, user } = React.useContext(ControlContext);
  const [importantDates, setImportantDates] = useState(defaultDates);
  const [currentDates, setCurrentDates] = useState(null);
  const [dateInput, setDateInput]= useState("");
  const [datesLoaded, setDatesLoaded] = useState(false);

  const [date, setDate] = useState(new Moment());
  const startOfMonth = date.clone().startOf('month');
  const endOfMonth = date.clone().endOf('month');
  const endOfMonthDay = endOfMonth.day();
  const startOfMonthDay = startOfMonth.day();
  const daysInMonth = date.daysInMonth();
  const monthNumber = date.month();
  const monthName = date.format('MMMM');
  const currentDayNum = date.date();

  function subtractMonth() {
    setDate(date.clone().add(-1, 'months').startOf('month'));
  }
  function addMonth() {
    setDate(date.clone().add(1, 'months').startOf('month'))
  }

  useEffect(() => {
    if (user && user.uid) {
      db.ref(`user/${user.uid}/dates`).once('value', res => {
        const data = res.val();
        if (data !== null) {
          setImportantDates([...importantDates, ...data]);
        }
        setDatesLoaded(true);
      })
    }
  }, [user])

  useEffect(() => {
    if (user && user.uid && datesLoaded) {
      const originalDates = importantDates.filter(date => {
        for (let ddate of defaultDates) {
          if (ddate.name == date.name) {
            return false;
          } 
        }
        return true;
      });
      db.ref(`user/${user.uid}/dates`).set(originalDates);
    }
  }, [importantDates])

  useEffect(() => {
    const relevantDates = importantDates.filter(date => {
      const isMonth = (date.month == monthNumber); 
      const isDay = (date.day == currentDayNum);
      return isMonth && isDay;
    });
    if (relevantDates.length > 0) {
      setCurrentDates(relevantDates);
    } else {
      setCurrentDates(null);
    }
  }, [date, importantDates])

  function isSpecial(index) {
    const valid = importantDates.filter(date => ((date.month == monthNumber) && (date.day == (index + 1))));
    if (valid.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  function onAddClick() {
    if (dateInput.length != 0) {
      const newDate = {
        name: dateInput,
        month: monthNumber,
        day: currentDayNum
      }
      setImportantDates([...importantDates, newDate]);
      setDateInput("");
    }
  }

  return (
    <GrayBg>
      <XButton onClick={toggleCalendar} />
      <Title>My Calendar</Title>
      <TopDiv></TopDiv>
      <CalendarDiv>
        <LeftView>
          <CalView>
            <MonthDiv>
              <Triangle left onClick={subtractMonth} />
                <MonthText>
                  {MONTH_ABRVS[monthNumber]}
                </MonthText>
              <Triangle right onClick={addMonth} />
            </MonthDiv>
            <DateGrid>
              {[...Array(startOfMonthDay)].map((e, i) => <EmptyElement key={i}></EmptyElement>)}
              {[...Array(daysInMonth)].map((e, i) => {
                const special = isSpecial(i);
                return (
                  <DateElement 
                    key={i} 
                    selected={(i + 1) == currentDayNum} 
                    special={special} 
                    onClick={() => {
                      setDate(date.clone().set('date', i + 1));
                    }}>{i + 1}
                  </DateElement>
                )})}
              {[...Array(6 - endOfMonthDay)].map((e, i) => <EmptyElement key={i}></EmptyElement>)}
            </DateGrid>
          </CalView>
          <BottomView>
            <DateSpecification>
              <MonthName>{monthName}</MonthName>
              <MonthDay>{currentDayNum}</MonthDay>
            </DateSpecification>
            <ImportantDates>
              {user ? (
                <>
                {!currentDates ? 'Add Important Dates:' : (
                <ul>              
                  {currentDates.map((date, i) => {
                    return <li key={i} >{date.name}{!date.default && <DeleteText onClick={() => {
                      const valid = importantDates.filter((oldDate, index) => {
                        if ((oldDate.name == date.name) && (oldDate.month == date.month) && (oldDate.day == date.day)) {
                          return false;
                        } else {
                          return true;
                        }
                      })
                      setImportantDates(valid);
                    }}>Delete</DeleteText>}</li>
                  })}
                </ul>
                )}
                <AddWrapper>
                  <DateInput type="text" value={dateInput} onChange={e => setDateInput(e.target.value)} maxlength={10}/>
                  <AddButton onClick={onAddClick}/>
                </AddWrapper>
                </>
              ) : (
                <span>
                  <SignInText onClick={signInWithGoogle}>Sign In</SignInText> to add to your calendar!
                </span>
              )}
            </ImportantDates>
          </BottomView>
        </LeftView>
        <RightView>
          <UpcomingTitle>
            Upcoming Dates
          </UpcomingTitle>
          <UpcomingElements dates={importantDates} />
        </RightView>
      </CalendarDiv>
    </GrayBg>
  )
}
const SignInText = styled.span`
  font-weight: 600;
  color: ${COLORS.BLUE};
  text-decoration: underline;
  &:hover {
    cursor: pointer;
  }
`
const AddButton = styled(MdAdd)`
  background-color: ${COLORS.RED};
  padding: 3px;
  border-radius: 20px;
  color: white;
  font-size: 25px;
  &:hover {
    cursor: pointer;
  }
  margin-left: 10px;
`
const AddWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
` 
const DateInput = styled.input`
  background-color: #EEEEEE;
  border: 0;
  padding: 3px;
  font-size: 18px;
  outline-color: ${COLORS.RED};
`

function UpcomingElements({ dates }) {
  const currentMonth = (new Date()).getMonth();

  function generateMonthArr() {
    let arr = []
    for (let i = currentMonth; i < 12; ++i) {
      arr.push(i);
    }
    for (let i = 0; i < currentMonth; ++i) {
      arr.push(i);
    }
    return arr;
  }
  const monthArr = generateMonthArr();

  return (
    monthArr.map((month, i) => {
      const relevant = dates.filter(date => date.month == month);
      if (relevant.length == 0) {
        return null;
      }
      return (
        <Month key={i}>
          <MonthName2>{fullMonthNames[month]}</MonthName2>
          <MonthDivider></MonthDivider>
          {relevant.map((date, i) => (
            <MonthElement key={i}>
              <MonthElementDate>{date.day} -</MonthElementDate>
              <MonthElementName>{date.name}</MonthElementName>
            </MonthElement>
          ))}
        </Month>
      )})
  )
}

const DeleteText = styled.span`
  color: red;
  text-decoration: underline;
  margin-left: 10px;
  &:hover {
    cursor: pointer;
  }
`
const MonthDivider = styled.div`
  height: 2px;
  border-radius: 20px;
  margin-right: 10px;
  background-color: black;
  margin-top: 4px;
  margin-bottom: 4px;
`
const MonthElementDate = styled.div`
  white-space: nowrap;
  margin-right: 10px;
  width: 25px;
`
const MonthElementName = styled.div`
  font-weight: 300;
  font-size: 14px;
`
const MonthElement = styled.div`
  display: flex;
  flex-direction: row;
  font-weight: 600;
`
const MonthName2 = styled.div`
  font-size: 20px;
  font-weight: 300;
`
const Month = styled.div`
  margin-bottom: 30px;
`
const UpcomingTitle = styled.div`
  font-weight: 600;
  font-size: 24px;
  margin-top: 12px;
  margin-bottom: 28px;
`
const RightView = styled.div`
  width: 30%;
  border-left: 2px dashed black;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 12px;
  padding-right: 8px;
  box-sizing: border-box;
  overflow-y: scroll;
  -ms-overflow-style: none; 
  scrollbar-width: none; 
  &::-webkit-scrollbar {
    display: none;
  }
`
const LeftView = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 70%;
`
const ImportantDates = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 70%;
  font-size: 18px;
  overflow-y: scroll;
  -ms-overflow-style: none; 
  scrollbar-width: none; 
  &::-webkit-scrollbar {
    display: none;
  }
`
const MonthDay = styled.div`
  font-size: 50px;
`
const MonthName = styled.div`
  font-size: 18px;
`
const DateSpecification = styled.div`
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-right: 2px solid black;
`
const BottomView = styled.div`
  border-top: 2px solid black;
  display: flex;
  flex-direction: row;
  width: 100%;
  align-self: flex-end;
  height: 110px;
`
const CalView = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 30px;
`
const MonthDiv = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`
const TXT_MARGIN = 10;
const MonthText = styled.div`
  margin-left: ${TXT_MARGIN}px;
  margin-right: ${TXT_MARGIN}px;
  font-weight: 700;
  font-size: 35px;
`
const Triangle = styled(BsTriangleFill)`
  color: ${COLORS.BLUE};
  font-size: 30px;
  user-select: none;
  ${props => props.left && `transform: rotate(-90deg);`}
  ${props => props.right && `transform: rotate(90deg);`}
  &:hover {
    cursor: pointer;
  }
`
const EL_WIDTH = 45;
const EL_RAD = 15;
const DateElement = styled.div`
  height: ${EL_WIDTH}px;
  width: ${EL_WIDTH}px;
  border-radius: ${EL_RAD}px;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  border: 1px solid black;
  box-sizing: border-box;
  ${props => props.selected && `border: 4px solid ${COLORS.BLUE};`}
  font-size: 20px;
  ${props => props.special && `
    background-color: ${COLORS.RED};
    color: white;
    font-weight: 700;  
  `}
  &:hover {
    cursor: pointer;
  }
`
const EmptyElement = styled.div`
  height: ${EL_WIDTH}px;
  width: ${EL_WIDTH}px;
  border-radius: ${EL_RAD}px;
  background-color: #DDDDDD;
`
const DateGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  height: 100%;
`
const TopDiv = styled.div`
  background-color: ${COLORS.RED};
  height: 12px;
  border-top: 3px solid black;
  border-left: 3px solid black;
  border-right: 3px solid black;
  width: 800px;
`
const CALENDAR_RADIUS = 70;
const CalendarDiv = styled.div`
  height: 550px;
  width: 800px;
  background-color: white;
  border: 3px solid black;
  border-bottom-left-radius: ${CALENDAR_RADIUS}px;
  border-bottom-right-radius: ${CALENDAR_RADIUS}px;
  display: flex;
  flex-direction: row;
`
const Title = styled.div`
  color: white;
  font-weight: 600;
  font-size: 80px;
  margin-bottom: 10px;
`
const GrayBg = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #00000080;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

export default Calendar;