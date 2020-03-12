import React, { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import Compose from '../Compose';
import Toolbar from '../Toolbar';
import { keys } from 'lodash'
import { database } from '../../Firebase';
import ToolbarButton from '../ToolbarButton';

// Redux
import { connect } from 'react-redux';

//Redux actions
import { setMessages } from '../../redux/actions/actions';

// Styles
import './MessageList.css';

//Functions
import renderMessages from './renderMessage';

const MessageList = props => {
  const { message, messages, user, chat, chats, setMessages } = props;

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "auto" })
  }

  useEffect(() => {
    debugger
    if (!!message.content) {
      const chatRef = database.ref(`chats/${chat}`)
      chatRef.push(message)
    }
  }, [message])

  useEffect(() => {
    if (chat) {
      const messages = chats[chat]['messages'];
      console.log(messages)
      const keysOfMessages = keys(messages);
      const unreadMessages = keysOfMessages.reverse().filter(key => !messages[key].isSeen && messages[key].user !== user);
      unreadMessages.map(unreadMessage => {
        messages[unreadMessage].isSeen = true;
        database.ref(`chats/${chat}/${unreadMessage}`).update(messages[unreadMessage]);
      })
      setMessages(messages)
    }
  }, [chat, message])



  useEffect(scrollToBottom, [messages]);

  return (
    <div className="message-list">
      <Toolbar
        title="Conversation Title"
        rightItems={[
          <ToolbarButton key="info" icon="ion-ios-information-circle-outline" />,
          <ToolbarButton key="video" icon="ion-ios-videocam" />,
          <ToolbarButton key="phone" icon="ion-ios-call" />
        ]}
      />
      {
        renderMessages(messages, user)
      }
      {/* {
        !!audios.length && audios.map(audio => <audio controls="controls" src={audio} />)

      } */}
      <div className="messages-bottom" ref={messagesEndRef} style={{ marginBottom: '40px' }} />

      <>
        {
          <Compose rightItems={[
            <ToolbarButton key="photo" icon="ion-ios-camera" />,
            <ToolbarButton key="image" icon="ion-ios-image" />,
            <ToolbarButton key="audio" icon="ion-ios-mic" />,
            <ToolbarButton key="money" icon="ion-ios-card" />,
            <ToolbarButton key="games" icon="ion-logo-game-controller-b" />,
            <ToolbarButton key="emoji" icon="ion-ios-happy" />
          ]} />
        }
      </>
    </div >
  );
}

const mapStateToProps = state => {
  return {
    message: state.chatReducer.message,
    messages: state.chatReducer.messages,
    user: state.userReducer.user,
    chat: state.chatReducer.chat,
    isAuth: state.userReducer.isAuth,
    chats: state.chatReducer.chats,
    isAvailableToWrite: state.chatEnvReducer.isAvailableToWrite
  }
}

export default connect(
  mapStateToProps,
  {
    setMessages
  }
)(MessageList)  
