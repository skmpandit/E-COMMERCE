import './App.css';
import Header from "./component/layout/Header/Header";
import Footer from "./component/layout/Footer/Footer";
import {BrowserRouter as Router, Route} from "react-router-dom";
import WebFont from "webfontloader";
import React from 'react';
import Home from "./component/Home/Home";
import LoginSignUp from './component/User/LoginSignUp';
import ProductDetails from "./component/Product/ProductDetails";
import Products from './component/Product/Products'
import Search from "./component/Product/Search"
import store from "./store"
import { loadUser } from './actions/userAction';
import UserOptions from "./component/layout/Header/UserOptions"
import { useSelector } from 'react-redux';
import Profile from "./component/User/Profile"
import ProtectedRoute from './component/Route/ProtectedRoute';
import UpdateProfile from "./component/User/UpdateProfile"
import UpdatePassword from "./component/User/UpdatePassword"
import ForgotPassword from "./component/User/ForgotPassword"

function App() {
  const { isAuthenticated, user} = useSelector((state) => state.user);
  React.useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto","Droid Sans","Chilanka"],
      }
    })
    store.dispatch(loadUser());
  },[]);
  return (
     <Router>
        <Header/>
        { isAuthenticated && <UserOptions user={user} /> }
        <Route exact path="/" component={Home}/>
        <Route exact path="/product/:id" component={ProductDetails}/>
        <Route exact path="/products" component={Products} />
        <Route path="/products/:keyword" component={Products} />
        <Route exact path="/search" component={Search} />
        <Route exact path="/login" component={LoginSignUp} />
        <ProtectedRoute exact path="/account" component={Profile} />
        <ProtectedRoute exact path="/me/update" component={UpdateProfile} />
        <ProtectedRoute exact path="/password/update" component={UpdatePassword} />
        <ProtectedRoute exact path="/password/forgot" component={ForgotPassword} />
        <Footer/>
     </Router>
  );
}

export default App;
