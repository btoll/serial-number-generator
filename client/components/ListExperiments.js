// @flow
import React from 'react';
import axios from 'axios';
import Griddle, { plugins, RowDefinition, ColumnDefinition } from 'griddle-react';

import Error from './Error';
import { LIST_EXPERIMENTS_ENDPOINT } from './config';

export default class ListExperiments extends React.Component<{}, {}> {
    constructor() {
        super();

        this.state = {
            experiments: []
        };
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
                            id="serial_number"
                            title="Serial Number"
                            customComponent={
                                ({value}) =>
                                    <a href={`#`}>{value}</a>
                            }
                        />
                        <ColumnDefinition id="organism" title="Organism" />
                        <ColumnDefinition id="disease" title="Disease" />
                        <ColumnDefinition id="plate_count" title="Plate Count" />
                        <ColumnDefinition id="rep_count" title="Rep Count" />
                        <ColumnDefinition id="well_count" title="Well Count" />
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

