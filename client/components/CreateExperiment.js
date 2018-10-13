// @flow
import React from 'react';
//import Error from './Error';
import axios from 'axios';
//import {
//    PRODUCTS_URL,
//    RECEIPTS_URL,
//    STORES_URL,
//    incr
//} from '../config';

export default class CreateExperiment extends React.Component {
    constructor() {
        super();

        this.state = {
            errors: []
        };
    }

    render() {
        return (
            <section id="createExperiment">
                <form onSubmit={this.onSubmit}>
                    <fieldset>
                        <legend>Login</legend>

                        <div>
                            <label htmlFor='product'>Username:</label>

                            <input
                                autoFocus
                                id='username'
                                name='username'
                                type='text'
                                value={this.state.username}
                                onChange={this.onChange} />
                        </div>

                        <div>
                            <label htmlFor='brand'>Password:</label>

                            <input
                                id='password'
                                name='password'
                                type='password'
                                value={this.state.password}
                                onChange={this.onChange} />
                        </div>

                        <div>
                            <button
                                onClick={this.onSubmit}
                                className='submit'
                                disabled={this.state.username === '' || this.state.password === '' ? 'disabled' : ''}
                                type='submit'>
                                Submit
                            </button>

                            <button onClick={this.onCancel}>
                                Cancel
                            </button>
                        </div>
                    </fieldset>
                </form>

                { !!this.state.errors.length && <Error fields={this.state.errors} /> }
            </section>
        );
    }

    componentDidMount() {
    }
}

