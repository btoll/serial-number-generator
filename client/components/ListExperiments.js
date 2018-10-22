// @flow
import React from 'react';
import axios from 'axios';
import Griddle, { plugins, RowDefinition, ColumnDefinition } from 'griddle-react';

import Error from './Error';
import { LIST_EXPERIMENTS_ENDPOINT } from './config';

type State = {
    experiments: Array<string>,
    errors: Array<string>
};

export default class ListExperiments extends React.Component<{}, {}> {
    constructor() {
        super();

        this.state = {
            experiments: [],

            modal: {
                show: false,
                type: null
            },

            errors: []
        };
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
                            id="experiment_id"
                            title="Experiment ID"
                            customComponent={
                                ({value}) =>
                                    <a href={`#`}>{value}</a>
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

