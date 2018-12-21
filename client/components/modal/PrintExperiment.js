// @flow
import React from 'react';
import axios from 'axios';

import { DOWNLOAD_PATH } from '../config';

const returnDownloadPath = filename =>
    `http://${DOWNLOAD_PATH}/experiments/${filename}`;

export default function PrintExperiment(props) {
    return (
        <>
            <div>
                <button onClick={props.onCloseModal}>Close</button>
            </div>

            <div id="plates">
                <h4>Active plates:</h4>

                <ul>
                {
                    props.plates.map(plate =>
                        <li key={plate.plate_id}>{plate.name}</li>
                    )
                }
                </ul>
            </div>

            <a href={returnDownloadPath(props.filename)} download={props.filename}>Download {props.filename}</a>
        </>
    );
}

