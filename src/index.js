import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Spinner from "./Spinner";
import registerServiceWorker from "./registerServiceWorker";

// BrowserRouter, HTML5 tarayıcıları (LAN'a karşı) için yönlendirici uygulamasıdır.
// Link, bağlayıcı etiketlerin yerine geçer.
// Route, bir URL ile bir yolun eşleştirilmesine dayanan koşullu olarak gösterilen bileşendir.
// Switch, eşleşen tüm rotalardan ziyade yalnızca ilk eşleşen rotayı döndürür.


import firebase from "./firebase";

import "semantic-ui-css/semantic.min.css";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter
} from "react-router-dom";

import { createStore } from "redux"; //durum yönetim sistemi. 
import { Provider, connect } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension"; //console ekranında bize bir redux interface'i sağlayacaktır. global state'lerimi, action type'lerimi rahatça takip edebileceğim böylelikle. 
import rootReducer from "./reducers";
import { setUser, clearUser } from "./actions";

const store = createStore(rootReducer, composeWithDevTools());

class Root extends React.Component {
  componentDidMount() { //bu methodumuz için bir lifecycle işlevi görevecektir. http post görevi gibi düşünebiliriz. 
    firebase.auth().onAuthStateChanged(user => {
      if (user) { //firebase bir kullanıcı olduğunu algılarsa onu direkt bizim ana routemuza yönlendir.
        // console.log(user);
        this.props.setUser(user);
        this.props.history.push("/");
      } else { //aksi durumda login sayfasında kalsın.
        this.props.history.push("/login");
        this.props.clearUser();
      }
    });
  }

  render() {
    return this.props.isLoading ? ( //Route'larımızı render edip geri döndürme işlemini gerçekleştirdik.
      <Spinner />
    ) : (
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Switch>
    );
  }
}

const mapStateFromProps = state => ({
  isLoading: state.user.isLoading
});

const RootWithAuth = withRouter(
  connect(
    mapStateFromProps,
    { setUser, clearUser }
  )(Root)
);

ReactDOM.render( //Kısaca global araçlarımızın ve işlemlerimizin işlendiği yer.
  <Provider store={store}> 
    <Router>
      <RootWithAuth />
    </Router>
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
