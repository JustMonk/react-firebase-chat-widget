import React from 'react';
import ReactDOM from 'react-dom';
import firebase from './firebase-config';

class ChatBoard extends React.Component {
   constructor(props) {
      super(props);
      this.state = { messages: null };
      this.sendMessage = this.sendMessage.bind(this);
      this.sendOnKey = this.sendOnKey.bind(this);
   }

   componentDidMount() {
      var chatRef = firebase.database().ref('chat');
      chatRef.on('value', (snapshot) => {
         this.setState({ messages: Object.values(snapshot.val()) });
      });
   }

   componentDidUpdate() {
      let messageList = document.querySelector('.message-list');
      messageList.scrollTo(0, messageList.scrollHeight);
   }

   sendOnKey(e) {
      if (e.key == 'Enter') this.sendMessage();
   }

   sendMessage() {
      if (!document.getElementById('send-message').value.trim().length) return;

      /*пушить так:*/
      let newPostKey = firebase.database().ref().child('posts').push().key;
      firebase.database().ref('chat/' + newPostKey).set({
         message: document.getElementById('send-message').value,
         name: this.props.userData.login + '|sep|' + this.props.userData.nickname,
         timestamp: Date.now()
      });
      document.getElementById('send-message').value = '';
   }

   parseMessageTags(message) {
      const tag = '[allowInnerHtmlMessageSetting=true]';

      if (message.includes(tag)) {
         return <div dangerouslySetInnerHTML={{ __html: message.replace(tag, '') }}></div> 
      } else {
         return <div>{message}</div>
      }
   }

   render() {
      return (
         <div className="chat-board">

            <div className="chat-wrapper">
               <h1>Global room ({this.props.userData.login})</h1>
               <div className="chat-window">
                  <div className="message-list">

                     {this.state.messages ? this.state.messages.map((val, i) => {

                        let repeat;
                        if (i == 0) repeat = false;
                        else repeat = (this.state.messages[i].name == this.state.messages[i - 1].name) ? true : false;

                        return (
                           <div key={i} className={this.props.userData.login + '|sep|' + this.props.userData.nickname == val.name ? "self-message" : "message"}>
                              <div className="message-content">
                                 {repeat ? "" : <div className="message-name">{val.name.split('|sep|')[0]}</div>}
                                 <div className="text-wrapper">
                                    <div className="text">
                                       {this.parseMessageTags(val.message)}
                                       <div className="message-date">{new Date(+val.timestamp).toLocaleDateString({ day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" })}</div>
                                    </div>
                                 </div>
                              </div>

                           </div>
                        )
                     }) : `false`}

                  </div>
                  <div className="message-input">
                     <input onFocus={e => { document.addEventListener('keydown', this.sendOnKey) }} onBlur={e => { document.removeEventListener('keydown', this.sendOnKey) }} type="text" id="send-message" placeholder="тут можно написать что угодно"></input>
                     <button id="send-button" onClick={this.sendMessage}><i className="fas fa-paper-plane"></i></button>
                  </div>
               </div>
            </div>

         </div>
      );
   }
}

export default ChatBoard;