import React, { useEffect, useState, Suspense } from 'react';

// Components
import ConversationSearch from '../ConversationSearch';
import Loader from '../Loader';
import Toolbar from '../Toolbar';
import ToolbarButton from '../ToolbarButton';

// Modules
import { database } from '../../Firebase';
import { keys, last } from 'lodash';

// Redux
import { connect } from 'react-redux';

// Actions
import { getConversationsReq, getConversationsRec } from '../../redux/actions/chat-actions';
import { setLoaderNav } from '../../redux/actions/chat-env-actions';

// Styles
import './ConversationList.css';

const ConversationListItem = React.lazy(() => import('../ConversationListItem'))


const ConversationList = (props) => {
  const { loader, isAuth, getConversationsReq, chats, getConversationsRec } = props;

  const [sortedChats, setSortedChats] = useState([]);

  useEffect(() => {
    if (chats.length === 0) {
      getConversationsReq(isAuth)
    }
  }, [chats.length, getConversationsReq, isAuth])

  const len = keys(chats).length;

  useEffect(() => {
    if (keys(chats).length) {
      const chatsRef = database.ref(`chats/`);
      chatsRef.on('value', snapshot => {
        const allChats = snapshot.val();
        const chatStructure = { ...chats }
        keys(chatStructure).map((chat) => {
          return chatStructure[chat]["messages"] = allChats[chat]
        })
        setSortedChats(keys(chatStructure).sort((chat1, chat2) => {
          const message1 = last(keys(chatStructure[chat1]['messages']));
          const message2 = last(keys(chatStructure[chat2]['messages']));
          if (!!message1 && !!message2) {
            return chatStructure[chat2]['messages'][message2].date - chatStructure[chat1]['messages'][message1].date
          }
          return null
        }))
        getConversationsRec(chatStructure)
      })
    }
  }, [len])


  return (
    <div className="conversation-list">
      <Toolbar
        title="Messenger"
        leftItems={[
          <ToolbarButton key="cog" icon="ion-ios-cog" />
        ]}
        rightItems={[
          <ToolbarButton key="add" icon="ion-ios-add-circle-outline" />
        ]}
      />
      <ConversationSearch />
      <div style={{ color: 'transparent' }}>
        {
          loader ? <Loader /> :
            sortedChats.map((chat) =>
              keys(chats[chat]['messages']).length &&
              <Suspense key={performance.now()} fallback={<div>Loading...</div>}><ConversationListItem
                key={performance.now()}
                chat={chats[chat]}
              /></Suspense>
            )
        }
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  loader: state.chatEnvReducer.navLoader,
  isAuth: state.userReducer.isAuth,
  chats: state.chatReducer.chats
})


export default connect(mapStateToProps, { setLoaderNav, getConversationsReq, getConversationsRec })(ConversationList)
