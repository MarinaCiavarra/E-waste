import React, {Component} from 'react';
import {BrowserRouter, Route, Switch, } from 'react-router-dom';
import Home from './components/Home.js';
import Championship from './components/Championship.js';
import Sign from './components/Signin.js';
import UserClass from './components/UserClass.js';
import Error from './components/Error.js';
import './App.css';


class App extends Component {
    render() {
        return (
            <div className="App">
                <BrowserRouter >
                    <Switch>
                        <Route
                            path="/"
                            component={Home}
                            exact
                        />
                        <Route
                            path="/championship"
                            component={Championship}
                         />
                        <Route
                            path="/sign"
                            component={Sign}
                        />
                        <Route
                            path="/userPage"
                            component={UserClass}
                        />
                         <Route
                             component={Error}
                         />
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;
