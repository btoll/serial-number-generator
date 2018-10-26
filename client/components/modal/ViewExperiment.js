// @flow
import React from 'react';
import Griddle, { plugins, RowDefinition, ColumnDefinition } from 'griddle-react';
import axios from 'axios';

import Modal from '../Modal';
import Notes from './Notes';
import {
    NOTES_ENDPOINT,
    REPLACE_PLATE_ENDPOINT,
    STAGES_ENDPOINT
} from '../config';

export default class ViewExperiment extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            plates: props.experiment.plates.concat(),
            selectedPlate: {},
            stages: [],
            notes: [],
            modal: {
                show: false,
                type: null
            }
        };

        this.closeModal = this.closeModal.bind(this);
        this.closeModal2 = this.closeModal2.bind(this);
        this.replace = this.replace.bind(this);
        this.replacePlate = this.replacePlate.bind(this);
        this.showNotes = this.showNotes.bind(this);
    }

    closeModal(selected) {
        let plates = this.state.plates.concat();

        plates = plates.map(plate => {
            if (this.state.selectedPlate.plate_id === plate.plate_id) {
                plate.active_stage = selected;
                plate.stage = this.state.stages[selected - 1].name;
            }

            return plate
        });

        this.setState({
            modal: {
                show: false
            },
            plates
        });
    }

    closeModal2(selected) {
        this.setState({
            modal: {
                show: false
            }
        });
    }

    openModal(type, e) {
        this.setState({
            modal: {
                show: true,
                type
            }
        });
    }

    replace() {
        axios.post(`${REPLACE_PLATE_ENDPOINT}/${this.props.experiment.id}/${this.state.selectedPlate.plate_id}`)
        .then(res => {
            const plates = this.state.plates.map(plate => {
                if (this.state.selectedPlate.plate_id === plate.plate_id) {
                    plate.active_stage = 1;
                    plate.stage = 'Echo';
                    plate.name = res.data;
                }

                return plate;
            });

            this.setState({
                plates,
                modal: {
                    show: false
                }
            })
        })
        .catch(console.error);
    }

    queryModal() {
        this.setState({
            selectedPlate: Object.assign(this.props.experiment.plates[rowID]),
            modal: {
                show: true,
                type: 'query'
            }
        });
    }

    replacePlate(rowID) {
        this.setState({
            selectedPlate: Object.assign({griddleKey: rowID}, this.props.experiment.plates[rowID]),
            modal: {
                show: true,
                type: 'replacePlate'
            }
        });
    }

    showModal() {
        switch (this.state.modal.type) {
            case 'notes':
                return (
                    <Modal
                        className={`${this.state.modal.type} ReactModal__Content__base`}
                        onCloseModal={this.closeModal2}
                        showModal={this.state.modal.show}
                        portalClassName={this.state.modal.type}
                    >
                        <Notes
                            plate={this.state.selectedPlate}
                            stages={this.state.stages}
                            notes={this.state.notes}
                            onCloseModal={this.closeModal}
                        />
                    </Modal>
                );

            case 'replacePlate':
                return (
                    <Modal
                        className={`${this.state.modal.type} ReactModal__Content__base`}
                        onCloseModal={this.closeModal2}
                        showModal={this.state.modal.show}
                        portalClassName={this.state.modal.type}
                    >
                        <>
                            <p>This operation will <b>archive</b> the current plate and generate a new one.</p>
                            <p>Are you sure you want to proceed?</p>
                        </>
                        <div>
                            <button onClick={this.replace}>Yes</button>
                            <button onClick={this.closeModal2}>No</button>
                        </div>
                    </Modal>
                );
        }
    }

    showNotes(plateName, e) {
        e.preventDefault();

        const selectedPlate = this.state.plates.filter(p => p.name === plateName)[0];

        axios.get(`${NOTES_ENDPOINT}/${selectedPlate.plate_id}`)
        .then(res => {
            this.setState({
                selectedPlate: selectedPlate,
                modal: {
                    show: true,
                    type: 'notes'
                },
                notes: res.data && res.data.recordset
            })
        })
        .catch(console.error);
    }

    render() {
        return (
            <>
                <h3>{this.props.experiment.name}</h3>

                <Griddle
                    data={this.state.plates}
                    plugins={[plugins.LocalPlugin]}
                    pageProperties={{
                        currentPage: 1,
                        pageSize: 10
                    }}
                >
                    <RowDefinition>
                        <ColumnDefinition
                            id="name"
                            title="Plate Name"
                            width={200}
                            customComponent={
                                ({value}) =>
                                    <a href={`#`} onClick={this.showNotes.bind(this, value)}>{value}</a>
                            }
                        />
                        <ColumnDefinition id="rep" title="Rep" width={50} />
                        <ColumnDefinition id="stage" title="Stage" width={100} />
                        <ColumnDefinition
                            id="replace"
                            title=" "
                            customComponent={
                                (o) =>
                                    <button onClick={this.replacePlate.bind(this, o.griddleKey)}>Replace</button>
                            }
                        />
                    </RowDefinition>
                </Griddle>

                {this.state.modal.show ?
                    this.showModal(this.state.modal.type) :
                    null
                }

                <div>
                    <button onClick={this.props.onCloseModal}>Close</button>
                </div>
            </>
        );
    }

    componentDidMount() {
        axios.get(STAGES_ENDPOINT)
        .then(res => {
            this.setState({
                stages: res.data.recordset
            })
        })
        .catch(console.error);
    }
}

