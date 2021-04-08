import React, { useState, useEffect } from 'react';
import person from 'assets/person.svg';
import { IoCalendarOutline } from 'react-icons/io5';
import styled from 'styled-components';
import GoogleButton from 'react-google-button'

import COLORS from 'util/colors';
import CONSTANTS from 'util/constants';
import ControlContext from 'util/controlContext';
import { signInWithGoogle, signOut, db } from 'util/firebase';
import generateName from 'util/randomName';

function Buttons() {
  return (
    <ButtonsDiv>
      <CalendarButton />
      <PersonButton />
    </ButtonsDiv>
  )
}

const ButtonsDiv = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  padding: 30px 30px 15px 30px;
`

function PersonButton() {
  const [showDropdown, setShowDropdown] = useState(false);

  function toggleDropdown() {
    setShowDropdown(!showDropdown);
  }

  return (
    <>
    <Base style={{
      marginLeft: 20
    }} onClick={toggleDropdown}>
      <img src={person} />
    </Base>
    {showDropdown && <>
    <Card setShowDropdown={setShowDropdown}/>
    </>}
    </>
  )
}

const EMOJIS = ['😀', '🥸', '😎', '🤑']
function Card({ setShowDropdown }) {
  
  const [changeEmoji, setChangeEmoji] = useState(false);
  const [emojiChoice, setEmojiChoice] = useState(null);
  const [username, setUsername] = useState(null);
  const { user, setShowList } = React.useContext(ControlContext);
  
  const notSignedIn = !user;

  useEffect(() => {
    if (user && user.uid) {
      db.ref(`user/${user.uid}/emoji`).once('value', res => {
        const data = res.val();
        if (data !== null) {
          setEmojiChoice(data);
        } else {
          setEmojiChoice(0);
        }
      })
    }
  }, [user]);

  useEffect(() => {
    if (user && (emojiChoice !== null)) {
      db.ref(`user/${user.uid}/emoji`).set(emojiChoice);
    }
  }, [user, emojiChoice]);

  useEffect(() => {
    if (user && user.uid) {
      db.ref(`user/${user.uid}/username`).once('value', res => {
        const data = res.val();
        if (data !== null) {
          setUsername(data);
        } else {
          setUsername(generateName());
        }
      })
    }
  }, [user]);

  useEffect(() => {
    if (user && (username !== null)) {
      db.ref(`user/${user.uid}/username`).set(username);
    }
  }, [user, username]);

  if (notSignedIn) {
    return (
      <CardDiv>
        <SignInText>Sign In</SignInText>
        <GoogleButton onClick={signInWithGoogle} />
        <SignInDescription>
          Sign in with Google to save your own college list, set important dates, and customize your profile!
        </SignInDescription>
      </CardDiv>
    )
  }
  return (
    <CardDiv>
      <ImageDiv>
        <EmojiView>
          {EMOJIS[emojiChoice]}
        </EmojiView>
        <EmojiDiv onClick={() => setChangeEmoji(!changeEmoji)}>
          {EMOJIS[emojiChoice]}
        </EmojiDiv>
        {changeEmoji && (
          <EmojisDiv>
            {EMOJIS.map((emoji, ind) => (
              <EmojiChoice onClick={() => {
                setEmojiChoice(ind);
                setChangeEmoji(false);
              }}>{emoji}</EmojiChoice>
            ))}
          </EmojisDiv>
        )}
      </ImageDiv>
      <Name>{user.name && user.name.split(" ")[0]}</Name>
      <UserName>@{username}</UserName>
      <MyList onClick={() => {
        setShowList(true);
        setShowDropdown(false);
      }}>My List</MyList>
      <Settings onClick={signOut}>Log Out</Settings>
    </CardDiv>
  )
}
const SignInDescription = styled.div`
  text-align: center;
  margin-top 20px;
  color: #444444;
`
const SignInText = styled.div`
  font-weight: 700;
  font-size: 35px;
  color: ${COLORS.BLUE};
  margin-bottom: 20px;
`
const EmojiView = styled.div`
  font-size: 85px;
`
const EmojisDiv = styled.div`
  position: absolute;
  left: -5px;
`
const EmojiChoice = styled.div`
  cursor: pointer;
`

const CardDiv = styled.div`
  background-color: white;
  padding: 30px;
  position: absolute;
  right: 40px;
  width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 20px;
  box-shadow: ${CONSTANTS.STANDARD_SHADOW};
  bottom: 0;
  transform: translateY(100%);
`

const IMAGE_WIDTH = 120;
const ImageDiv = styled.div`
  background-color: #C4C4C4;
  border: 6px solid ${COLORS.TEAL};
  height: ${IMAGE_WIDTH}px;
  width: ${IMAGE_WIDTH}px;
  border-radius: ${IMAGE_WIDTH}px;
  margin-bottom: 10px;
  margin-top: 15px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`
const EMOJI_WIDTH = 25;
const EmojiDiv = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: white;
  box-shadow: ${CONSTANTS.STANDARD_SHADOW};
  padding 3px;
  height: ${EMOJI_WIDTH}px;
  width: ${EMOJI_WIDTH}px;
  border-radius: ${EMOJI_WIDTH}px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    cursor: pointer;
  }
`

const Name = styled.div`
  font-size: 30px;
  text-align: center;
`
const UserName = styled.div`
  font-size: 16px;
`
const MyList = styled.div`
  background-color: ${COLORS.TEAL};
  width: 100%;
  padding: 4px;
  border-radius: 20px;
  text-align: center;
  color: white;
  font-weight: 600;
  box-sizing: border-box;
  cursor: pointer;
  margin-top: 25px;
` 
const Settings = styled.div`
  width: 100%;
  text-align: center;
  border: 3px solid black;
  border-radius: 20px;
  padding: 4px;
  box-sizing: border-box;
  cursor: pointer;
  margin-top: 10px;
  margin-bottom: 15px;
`


function CalendarButton() {
  const { toggleCalendar } = React.useContext(ControlContext);

  return (
    <Base onClick={toggleCalendar}>
      <IoCalendarOutline/>
    </Base>
  )
}

const BUTTON_SIZE = 130;
const Base = styled.div`
  width: ${BUTTON_SIZE}px;
  height: ${BUTTON_SIZE}px;
  border-radius: ${BUTTON_SIZE}px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${CONSTANTS.STANDARD_SHADOW};

  img {
    width: 70%;
  }
  svg {
    width: 70%;
    height: 70%;
    color: ${COLORS.RED};
  }
  &:hover {
    cursor: pointer;
  }
`

export default Buttons;
export { CalendarButton, PersonButton };