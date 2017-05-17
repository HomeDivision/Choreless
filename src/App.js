import React, { Component } from 'react';
import Login from './Login';
import Home from './Home';
import CreateRoom from './CreateRoom';
import Monthly from './Monthly';
import Weekly from './Weekly';
import Navigation from './Navigation';
import { Route, Switch, Link, Redirect } from 'react-router-dom';
import firebase from 'firebase';

/*This file handles the display of routes and navigation, as well as footer. */

class App extends Component {
  state = {
    isAuth: false
  }

  //Upon mounting component, initialize listener. Set state variables if user is authed.
  componentWillMount = () => {
    firebase.auth().onAuthStateChanged(user => {
     if(user) {
       this.setState({userID:user.uid});
       this.setState({userEmail:user.email});
       this.setState({isAuth: true});
       firebase.database().ref('users/' + user.uid).once('value').then(snapshot=> {
         if(snapshot.val()) {
           this.setState({
             userHandle: snapshot.val().handle,
            });
         }
       });
     }
     else{
       this.setState({userID: null}); //null out the saved state
       this.setState({userEmail: null})
       this.setState({userHandle: ''});
       this.setState({isAuth: false})
     }
   });
  }

  render() {
    return (
      <div>
        <header>
          <Navigation userHandle={this.state.userHandle} />
        </header>
        <main>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/:roomID/monthly" render={(props)=><Monthly {...props} isAuth={this.state.isAuth} userID={this.state.userID} userEmail={this.state.userEmail} userHandle={this.state.userHandle}/>}/>
            <Route path="/:roomID/weekly" render={(props)=><Weekly {...props} isAuth={this.state.isAuth} userID={this.state.userID} userEmail={this.state.userEmail} userHandle={this.state.userHandle}/>}/>
            <Route path="/login" component={Login}/>
            <Route path="/create" render={(props)=><CreateRoom {...props} isAuth={this.state.isAuth}/>}/>
          </Switch>
        </main>
        <footer>

        </footer>
      </div>
    );
  }
}

export default App;
