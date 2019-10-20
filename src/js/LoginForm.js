import React from 'react';
import ReactDOM from 'react-dom';
import firebase from './firebase-config';

class LoginForm extends React.Component {
   constructor(props) {
      super(props);
      this.authorization = this.authorization.bind(this);
      this.state = {errors: ""}
   }

   componentDidMount() {

   }

   authorization() {
      let success = this.props.success;
      const login = document.querySelector('#chat-login').value;
      const nickname = '123';

      if (login.length < 3) {
         this.setState({errors: "Имя содержит менее 3 символов"}); 
         return;
      }

      if (/\$|\#|\[|\]|\.|\/|[\x00-\x1F]|\x7F|\|sep\|/i.test(login+nickname) || (login+nickname).indexOf(" ") != -1) {
         this.setState({errors: "Некорректные данные"}); 
         return;
      } 

      firebase.database().ref('users/' + `${login}|sep|${nickname}`).once('value').then(function (snapshot) {
        if (snapshot.val()) {
         console.log('user exist. hello :)');
        } else {
         console.log('user dont exist. Create');
         firebase.database().ref('users/' + `${login}|sep|${nickname}`).set({
            id: Date.now(),
         });
        }
        success(`${login}|sep|${nickname}`);
      });
   }

   render() {
      return (
         <div className="login-form">
            <h1>Вход в чат</h1>
            <div className="controls">
               <div className="input">
                  <input type="text" id="chat-login" placeholder="Ваше Имя/Никнейм"></input>
               </div>
               <div className="error-message">{this.state.errors}</div>
               <div className="input">
                  <button onClick={this.authorization} style={{cursor: 'pointer'}}>Присоединиться</button>
               </div>
            </div>
         </div>
      );
   }
}

export default LoginForm;