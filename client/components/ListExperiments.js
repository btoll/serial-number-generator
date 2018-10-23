// @flow
import React from 'react';
import ReactModal from 'react-modal';
import axios from 'axios';
import Griddle, { plugins, RowDefinition, ColumnDefinition } from 'griddle-react';

import Error from './Error';
import Modal from './Modal';
import ViewExperiment from './modal/ViewExperiment';
import {
    LIST_EXPERIMENTS_ENDPOINT,
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
                show: false,
                type: null
            },

            errors: []
        };

        this.closeModal = this.closeModal.bind(this);
        this.viewExperiment = this.viewExperiment.bind(this);

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

    showModal() {
        switch (this.state.modal.type) {
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
                        <ColumnDefinition id="serial_number" title="Serial Number" width={250} />
                        <ColumnDefinition id="organism" title="Organism" width={200} />
                        <ColumnDefinition id="disease" title="Disease" width={200} />
                        <ColumnDefinition id="plate_count" title="Plate Count" width={100} />
                        <ColumnDefinition id="rep_count" title="Rep Count" width={100} />
                        <ColumnDefinition id="well_count" title="Well Count" width={100} />
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

