import React from 'react'
import {
    BrowserRouter,
    Switch,
    Route
} from "react-router-dom"
import Home from '../pages/Home'
import Login from '../pages/Login'
import SignUp from '../pages/SignUp'
import PrivateRoute from './PrivateRoute'


export default function Routes() {
    return (
       <BrowserRouter>
          <Switch>
              <Route path="/signup" component={SignUp} />
              <Route path="/login" component={Login} />
              <PrivateRoute path="/" component={Home} />
          </Switch>
       </BrowserRouter> 
    )
}
