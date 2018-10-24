// @flow
import React from 'react';
import axios from 'axios';

import { NOTES_ENDPOINT } from '../config';

export default class Notes extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: props.plate.active_stage,
            notes: props.notes ?
                props.notes.concat() :
                    [
                        { note: '' },
                        { note: '' },
                        { note: '' },
                        { note: '' },
                        { note: '' }
                    ]
        };

        this.onRadioChange = this.onRadioChange.bind(this);
        this.onSave = this.onSave.bind(this);
    }

    onRadioChange(stageID, e) {
        this.setState({
            selected: stageID
        });
    }

    onSave(e) {
        axios({
            method: 'put',
            url: `${NOTES_ENDPOINT}/${this.props.plate.plate_id}`,
            data: this.state
        })
        .then(res => {
            this.setState({
                modal: {
                    show: false,
                    type: 'notes'
                }
            });

            this.props.onCloseModal(this.state.selected);
        })
        .catch(console.error);
    }

    onTextAreaChange(stageID, e) {
        let notes = this.state.notes.concat();
        notes[stageID - 1].note = e.currentTarget.value;

        this.setState({
            notes
        });
    }

    render() {
        return (
            <>
                <div>
                    <button onClick={this.props.onCloseModal.bind(this, this.props.plate.active_stage)}>Close</button>
                    <button onClick={this.onSave}>Save</button>
                </div>

                <h3>{this.props.plateName}</h3>

                <div id="stages">
                    {
                        this.props.stages.map(stage => (
                            <div key={stage.stage_id} className={stage.stage_id === this.state.selected ? 'selected' : ''}>
                                <div>
                                    <input
                                        type="radio"
                                        name="stage"
                                        value={stage.name}
                                        checked={stage.stage_id === this.state.selected ? true : false}
                                        onChange={this.onRadioChange.bind(this, stage.stage_id)}
                                    />
                                    <label htmlFor={stage.name}>{stage.name}</label>
                                </div>
                                <textarea
                                    cols="40"
                                    rows="5"
                                    onChange={this.onTextAreaChange.bind(this, stage.stage_id)}
                                    value={this.state.notes[stage.stage_id - 1].note}
                                ></textarea>
                            </div>
                        ))
                    }
                </div>
            </>
        );
    }
}

