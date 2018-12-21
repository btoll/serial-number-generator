// @flow
import React from 'react';
import ReactModal from 'react-modal';
import axios from 'axios';

import Error from './Error';
import List from './List';
import Modal from './Modal';
import {
    DOWNLOAD_PATH,
    CREATE_EXPERIMENT_ENDPOINT,
    PRINT_EXPERIMENT_ENDPOINT,
} from './config';

type State = {
    diseases: Array<string>,
    organisms: Array<string>,

    disease: string,
    organism: string,
    plateCount: number,
    repCount: number,
    wellCount: number,

    errors: Array<string>
};

const returnDownloadPath = filename =>
    `http://${DOWNLOAD_PATH}/experiments/${filename}`;

export default class CreateExperiment extends React.Component<{}, State> {
    onChange: Function;
    onSubmit: Function;

    constructor() {
        super();

        this.state = {
            diseases: [],
            organisms: [],

            disease: 0,
            organism: 0,
            plateCount: 0,
            repCount: 0,
            wellCount: 0,

            modal: {
                data: {},
                show: false,
                type: null
            },

            errors: []
        };

        this.onChange = this.onChange.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.printExperiment = this.printExperiment.bind(this);

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
                modal: {
                    data: res.data,
                    show: true,
                    type: 'printExperiment'
                }
            })
        ))
        .catch(console.log);
    }

    printExperiment() {
        axios({
            url: `${PRINT_EXPERIMENT_ENDPOINT}/${this.state.modal.data}`,
            method: 'get'
        })
        .then(res => {
            this.closeModal();

            this.setState({
                modal: {
                    data: {
                        filename: res.data.filename
                    },
                    show: true,
                    type: 'download'
                }
            });
        })
        .catch(err => {
            console.log(err);
            this.closeModal()
        });
    }

    showModal() {
        switch (this.state.modal.type) {
            case 'download':
                return (
                    <Modal
                        className={`${this.state.modal.type} ReactModal__Content__base`}
                        onCloseModal={this.closeModal}
                        showModal={this.state.modal.show}
                        portalClassName={this.state.modal.type}
                    >
                        <>
                            <a href={returnDownloadPath(this.state.modal.data.filename)} download={this.state.modal.data.filename}>Download {this.state.modal.data.filename}</a>
                            <button onClick={this.closeModal}>Close</button>
                        </>
                    </Modal>

                );

            case 'printExperiment':
                return (
                    <Modal
                        className={`${this.state.modal.type} ReactModal__Content__base`}
                        onCloseModal={this.closeModal}
                        showModal={this.state.modal.show}
                        portalClassName={this.state.modal.type}
                    >
                        <>
                            <h2>Your experiment has been created!</h2>
                            <div>
                                <button onClick={this.printExperiment}>Print</button>
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
                            value={this.getExperimentName()}
                            style={{
                                backgroundColor: "antiquewhite",
                                borderWidth: 0,
                                fontWeight: "bold",
                                padding: 5,
                                width: 750
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
                        <select
                            name="wellCount"
                            onChange={this.onChange}
                            value={this.state.wellCount}
                        >
                            <option value="">Select a Well Count</option>
                            <option value="96">96</option>
                            <option value="384">384</option>
                        </select>
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

