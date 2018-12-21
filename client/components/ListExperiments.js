// @flow
import React from 'react';
import ReactModal from 'react-modal';
import axios from 'axios';
import Griddle, { plugins, RowDefinition, ColumnDefinition } from 'griddle-react';

import Error from './Error';
import Modal from './Modal';
import PrintExperiment from './modal/PrintExperiment';
import ViewExperiment from './modal/ViewExperiment';
import {
    LIST_EXPERIMENTS_ENDPOINT,
    PRINT_EXPERIMENT_ENDPOINT,
    VIEW_EXPERIMENT_ENDPOINT
} from './config';

type State = {
    experiments: Array<object>,
    errors: Array<string>
};

export default class ListExperiments extends React.Component<{}, {}> {
    constructor() {
        super();

        this.state = {
            experiments: [],
            experiment: {},

            modal: {
                data: [],
                show: false,
                type: null
            },

            errors: []
        };

        this.closeModal = this.closeModal.bind(this);
        this.printExperiment = this.printExperiment.bind(this);
        this.viewExperiment = this.viewExperiment.bind(this);

        // For aria, should hide underyling dom elements when modal is shown.
        // (For screenreaders.)
        ReactModal.setAppElement('#root');
    }

    closeModal(e) {
        this.setState({
            modal: {
                data: [],
                show: false
            }
        });
    }

    openModal(type, e) {
        this.setState({
            modal: {
                show: true
            }
        });
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
                        <PrintExperiment
                            filename={this.state.modal.data.filename}
                            plates={this.state.modal.data.plates}
                            onCloseModal={this.closeModal}
                        />
                    </Modal>
                );

            case 'viewExperiment':
                return (
                    <Modal
                        className={`${this.state.modal.type} ReactModal__Content__base`}
                        onCloseModal={this.closeModal}
                        showModal={this.state.modal.show}
                        portalClassName={this.state.modal.type}
                    >
                        <ViewExperiment
                            experiment={this.state.experiment}
                            onCloseModal={this.closeModal}
                        />
                    </Modal>
                );
        }
    }

    printExperiment(experimentID, e) {
        axios({
            url: `${PRINT_EXPERIMENT_ENDPOINT}/${experimentID}`,
            method: 'get'
        })
        .then(res => {
            this.setState({
                modal: {
                    data: {
                        filename: res.data.filename,
                        plates: res.data.plates.recordset
                    },
                    show: true,
                    type: 'printExperiment'
                }
            });
        })
        .catch(err => {
            console.log(err);
            this.closeModal()
        });
    }

    viewExperiment(experimentName, e) {
        e.preventDefault();
        const experiment = this.state.experiments.filter(e => experimentName === e.experiment_name)[0];

        axios.get(`${VIEW_EXPERIMENT_ENDPOINT}/${experiment.experiment_id}`)
        .then(res => {
            this.setState({
                experiment: {
                    id: experiment.experiment_id,
                    name: experimentName,
                    plates: res.data.recordset
                },
                modal: {
                    show: true,
                    type: 'viewExperiment'
                }
            })
        })
        .catch(console.error);
    }

    render() {
        return (
            <section>
                <Griddle
                    data={this.state.experiments}
                    plugins={[plugins.LocalPlugin]}
                    pageProperties={{
                        currentPage: 1,
                        pageSize: 10
                    }}
                >
                    <RowDefinition>
                        <ColumnDefinition
                            id="experiment_name"
                            title="Experiment Name"
                            customComponent={
                                ({value}) =>
                                    <a href={`#`} onClick={this.viewExperiment.bind(this, value)}>{value}</a>
                            }
                        />
                        <ColumnDefinition
                            id="id"
                            title="Experiment ID"
                            width={250}
                            customComponent={
                                ({value}) =>
                                    `EXP${String(value).padStart(10, 0)}`
                            }
                        />
                        <ColumnDefinition id="organism" title="Organism" width={200} />
                        <ColumnDefinition id="disease" title="Disease" width={200} />
                        <ColumnDefinition id="plate_count" title="Plate Count" width={100} />
                        <ColumnDefinition id="rep_count" title="Rep Count" width={100} />
                        <ColumnDefinition id="well_count" title="Well Count" width={100} />
                        <ColumnDefinition
                            id="experiment_id"
                            title=" "
                            width={100}
                            customComponent={
                                ({value}) =>
                                    <button onClick={this.printExperiment.bind(null, value)}>Print</button>
                            }
                        />
                    </RowDefinition>
                </Griddle>

                {this.state.modal.show ?
                    this.showModal(this.state.modal.type) :
                    null
                }
            </section>
        );
    }

    componentDidMount() {
        axios.get(LIST_EXPERIMENTS_ENDPOINT)
        .then(res => {
            this.setState({
                experiments: res.data.recordset
            })
        })
        .catch(console.error);
    }
}

