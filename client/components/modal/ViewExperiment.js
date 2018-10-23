// @flow
import React from 'react';
import Griddle, { plugins, RowDefinition, ColumnDefinition } from 'griddle-react';

export default function ViewExperiment(props) {
    return (
        <>
            <h3>{props.experiment.name}</h3>

            <Griddle
                data={props.experiment.plates}
                plugins={[plugins.LocalPlugin]}
                pageProperties={{
                    currentPage: 1,
                    pageSize: 10
                }}
            >
                <RowDefinition>
                    <ColumnDefinition id="name" title="Name" width={200} />
                    <ColumnDefinition id="stage" title="Stage" width={100} />
                    <ColumnDefinition id="notes" title="Notes" width={500} />
                    <ColumnDefinition
                        id="edit_notes"
                        title=" "
                        customComponent={
                            () =>
                                <button>Edit Notes</button>
                        }
                    />
                    <ColumnDefinition
                        id="change_stage"
                        title=" "
                        customComponent={
                            () =>
                                <button>Change Stage</button>
                        }
                    />
                    <ColumnDefinition
                        id="replace"
                        title=" "
                        customComponent={
                            () =>
                                <button>Replace</button>
                        }
                    />
                </RowDefinition>
            </Griddle>

            <div>
                <button onClick={props.onCloseModal}>Close</button>
            </div>
        </>
    );
}

