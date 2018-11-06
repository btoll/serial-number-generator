// @flow
import React from 'react';
import axios from 'axios';

export default class PrintExperiment extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <div>
                    <button onClick={this.props.onCloseModal}>Close</button>
                </div>

                <div id="plates">
                    <h4>Printed the following active plates:</h4>

                    <ul>
                    {
                        this.props.plates.map(plate =>
                            <li key={plate.plate_id}>{plate.name}</li>
                        )
                    }
                    </ul>
                </div>
            </>
        );
    }
}

