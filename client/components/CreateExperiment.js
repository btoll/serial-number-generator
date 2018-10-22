// @flow
import React from 'react';
import ReactModal from 'react-modal';
import axios from 'axios';

import Error from './Error';
import List from './List';
import Modal from './Modal';
import {
    CREATE_EXPERIMENT_ENDPOINT,
    PRINT_EXPERIMENT_ENDPOINT,
} from './config';

type State = {
    serialNumber: string,

    diseases: Array<string>,
    organisms: Array<string>,

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
            serialNumber: '',

            diseases: [],
            organisms: [],

            disease: 0,
            organism: 0,
            plateCount: 0,
            repCount: 0,
            wellCount: 0,

            modal: {
                show: false,
                type: null
            },

            errors: []
        };

        this.onChange = this.onChange.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.print = this.print.bind(this);

        // For aria, should hide underyling dom elements when modal is shown.
        // (For screenreaders.)
        ReactModal.setAppElement('#root');
    }

    closeModal(e) {
        this.setState({
            modal: {
                show: false
            },

            disease: 0,
            organism: 0,
            plateCount: 0,
            repCount: 0,
            wellCount: 0
        });
    }

    openModal(type, e) {
        this.setState({
            modal: {
                show: true
            }
        });
    }

    getDiseaseName() {
        return (this.state.diseases.recordset && this.state.disease > 0) ?
            this.state.diseases.recordset[this.state.disease - 1].name :
            '';
    }

    getExperimentName() {
        return `{${this.getOrganismName()}}-{${this.getDiseaseName()}}-{${this.state.plateCount}}-{${this.state.repCount}}-{${this.state.wellCount}}`;
    }

    getOrganismName() {
        return (this.state.organisms.recordset && this.state.organism > 0) ?
            this.state.organisms.recordset[this.state.organism - 1].name :
            '';
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

        postData.experimentName = this.getExperimentName();

        axios({
            url: CREATE_EXPERIMENT_ENDPOINT,
            method: 'post',
            data: postData
        })
        .then(res => (
            this.setState({
                serialNumber: res.data,
                modal: {
                    show: true,
                    type: 'printExperiment'
                }
            })
        ))
        .catch(console.log);
    }

    print() {
        const state = this.state;

        axios({
            url: `${PRINT_EXPERIMENT_ENDPOINT}/${state.serialNumber}/${state.plateCount}/${state.repCount}`,
            method: 'get'
        })
        .then(res => {
            this.closeModal();
        })
        .catch(err => {
            console.log(err);
            this.closeModal()
        });
    }

    printDisplayName() {
        return `PL-${this.getExperimentName()}-xxxxxxx-1`;
    }

    showModal() {
        switch (this.state.modal.type) {
            case 'printExperiment':
                return (
                    <Modal
                        className={`${this.state.modal.type} ReactModal__Content__base`}
                        onCloseModal={this.closeModal}
                        showModal={this.state.modal.show}
                        portalClassName={this.state.modal.type}
                    >
                        <>
                            <h2>Your serial number is:</h2>
                            <h4>PL-{this.state.serialNumber}-x</h4>
                            <div>
                                <button onClick={this.print}>Print</button>
                                <button onClick={this.closeModal}>Close</button>
                            </div>
                        </>
                    </Modal>

                );
        }
    }

    render() {
        return (
            <section id="createExperiment">
                <form onSubmit={this.onSubmit}>
                    <div>
                        <label htmlFor="name">Name: </label>
                        <input
                            type="text"
                            readOnly={true}
                            value={this.printDisplayName()}
                            style={{
                                backgroundColor: "antiquewhite",
                                borderWidth: 0,
                                padding: 5,
                                width: 320
                            }}
                        />
                    </div>
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
                            style={{width: 70}}
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
                            style={{width: 70}}
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
                            style={{width: 70}}
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
                </form>

                {this.state.modal.show ?
                    this.showModal(this.state.modal.type) :
                    null
                }

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

