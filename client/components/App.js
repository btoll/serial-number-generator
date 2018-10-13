// @flow
import React from 'react';

import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Nav from './Nav';
import Home from './Home';
import CreateExperiment from './CreateExperiment';
import ListExperiments from './ListExperiments';
import Login from './Login';

const App = () =>
    (
        <BrowserRouter>
            <main>
                <Nav />

                <Switch>
                    <Route exact path='/' component={Home} />
                    <Route path='/create-experiment' component={CreateExperiment} />
                    <Route path='/list-experiments' component={ListExperiments} />
                    <Route path='/login' component={Login} />
                    <Route render={() => <p>404 Not Found</p>} />
                </Switch>
            </main>
        </BrowserRouter>
    );

export default App;

