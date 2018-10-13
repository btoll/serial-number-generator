// @flow
import React from 'react';
import Error from './Error';
import axios from 'axios';
import { LOGIN_ENDPOINT } from './config';

type Props = {
    onLogIn: Function;
};

type State = {
    username: string,
    password: string,
    errors: Array<string>
};

export default class Login extends React.Component<Props, State> {
    onChange: Function;
    onSubmit: Function;

    constructor(props: Props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            errors: []
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(e: SyntheticInputEvent<HTMLInputElement>) {
        this.setState({
            [e.currentTarget.name]: e.currentTarget.value
        });
    }

    onSubmit(e: SyntheticMouseEvent<HTMLFormElement>) {
        e.preventDefault();

        /*
        const errors = Object.keys(this.state)
            .filter(key => !['errors'].includes(key) && !this.state[key]);

        if (!errors.length) {
            axios.post(LOGIN_ENDPOINT, this.state)
            .then(data => (
                this.props.onLogIn(data.data[0])
            ))
            .catch(() => console.log('error'));
        } else {
            this.setState({
                errors: errors
            });
        }
        */
    }

    render() {
        return (
            <section id="login">
                <form className='login' onSubmit={this.onSubmit}>
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
                            <label></label>
                            <input
                                disabled={!this.state.username || !this.state.password ? 'disable' : ''}
                                type="submit"
                            />
                        </div>
                    </fieldset>
                </form>

                { !!this.state.errors.length && <Error fields={this.state.errors} /> }
            </section>
        );
    }
}

