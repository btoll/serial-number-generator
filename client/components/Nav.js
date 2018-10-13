// @flow
import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Nav() {
    return (
        <nav>
            <ul>
                <li>
                    <NavLink exact activeClassName='active' to='/'>
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink activeClassName='active' to='/create-experiment'>
                        Create Experiment
                    </NavLink>
                </li>
                <li>
                    <NavLink activeClassName='active' to='/list-experiments'>
                        List Experiments
                    </NavLink>
                </li>
                <li>
                    <NavLink activeClassName='active' to='/login'>
                        Login
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}

