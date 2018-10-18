// @flow
import React from 'react';
import axios from 'axios';

import Error from './Error';
import List from './List';
import { CREATE_EXPERIMENT_ENDPOINT } from './config';

type State = {
    code: string,
    disease: string,
    organism: string,
    plateCount: number,
    repCount: number,
    wellCount: number,
    errors: Array<string>
};

export default class CreateExperiment extends React.Component<{}, State> {
    onChange: Function;
    onSubmit: Function;

    constructor() {
        super();

        this.state = {
            code: '',

            diseases: [],
            organisms: [],

            disease: 0,
            organism: 0,
            plateCount: 0,
            repCount: 0,
            wellCount: 0,

            errors: []
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    isDisabled() {
        const state = this.state;

        return !state.disease ||
            !state.organism ||
            !Number(state.plateCount) ||
            !Number(state.repCount) ||
            !Number(state.wellCount);
    }

    onChange(e: SyntheticInputEvent<HTMLInputElement>) {
        this.setState({
            [e.currentTarget.name]: e.currentTarget.value
        });
    }

    onSubmit(e: SyntheticMouseEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const postData = {};

        for (let [key, value] of formData.entries()) {
            postData[key] = value;
        }

        axios({
            url: CREATE_EXPERIMENT_ENDPOINT,
            method: 'post',
            data: postData
        })
        .then(res => (
            this.setState({
                code: res.data
            })
        ))
        .catch(console.log);
    }

    setName() {
        const state = this.state;
        return `PL-{${state.organism}}-{${state.disease}}-{${state.plateCount}}-{${state.repCount}}-{${state.wellCount}}-xxxxxxx-1`;
    }

    render() {
        return (
            <section id="createExperiment">
                <h2>Experiment name: {this.setName()}</h2>
                <form onSubmit={this.onSubmit}>
                    <fieldset>
                        <legend>Create Experiment</legend>
                        <div>
                            <label htmlFor="organism">Organism: </label>
                            <List
                                name="organism"
                                onChange={this.onChange}
                                options={this.state.organisms.recordset}
                                value={this.state.organism}
                            />
                        </div>
                        <div>
                            <label htmlFor="disease">Disease: </label>
                            <List
                                name="disease"
                                onChange={this.onChange}
                                options={this.state.diseases.recordset}
                                value={this.state.disease}
                            />
                        </div>
                        <div>
                            <label htmlFor="plateCount">Plate Count: </label>
                            <input
                                type="number"
                                name="plateCount"
                                step="1"
                                min="0"
                                value={this.state.plateCount}
                                onChange={this.onChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="repCount">Rep Count: </label>
                            <input
                                type="number"
                                name="repCount"
                                step="1"
                                min="0"
                                value={this.state.repCount}
                                onChange={this.onChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="wellCount">Well Count: </label>
                            <input
                                type="number"
                                name="wellCount"
                                step="1"
                                min="0"
                                value={this.state.wellCount}
                                onChange={this.onChange}
                            />
                        </div>
                        <div>
                            <label></label>
                            <input
                                disabled={this.isDisabled() ? 'disable' : ''}
                                type="submit"
                            />
                        </div>
                    </fieldset>
                </form>

                { !!this.state.code.length && <h2>{this.state.code}</h2> }
                { !!this.state.errors.length && <Error fields={this.state.errors} /> }
            </section>
        );
    }

    componentDidMount() {
        axios.get(CREATE_EXPERIMENT_ENDPOINT)
        .then(res => {
            this.setState({
                diseases: res.data.diseases,
                organisms: res.data.organisms
            })
        })
        .catch(console.error);
    }
}

