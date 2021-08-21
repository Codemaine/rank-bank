import React, { useEffect, useState} from 'react';
import axios from 'axios'
import { Route, Redirect } from 'react-router-dom'
        
        const PrivateRoute = ({ component: Component, ...rest }) => {
          const [isAuthenticated, setIsAuthenticated] = useState(null)  
          useEffect(() => {
            let token = localStorage.getItem('userToken')
            if(token){
                axios({
                    method: "POST",
                    url: "http://localhost:4000/vertify-token",
                    data: {
                        accountToken: token
                    }
                }).then(data => {
                    if(data.data.isLegit){
                        setIsAuthenticated(true)
                    }else {
                        setIsAuthenticated(false)
                    }
                }).catch(err => console.log(err))
            }else {
                setIsAuthenticated(false)
            }
            // eslint-disable-next-line
          }, [])
        
          if(isAuthenticated === null){
            return <></>
          }
        
          return (
            <Route {...rest} render={props =>
              !isAuthenticated ? (
                <Redirect to='/login'/>
              ) : (
                <Component {...props} />
              )
            }
            />
          );
        };
        
        export default PrivateRoute;