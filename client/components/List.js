// @flow
import React from 'react';

export default function List(props) {
    return (
        <select
            name={props.name}
            onChange={props.onChange}
            value={props.value}
        >
            <option value="">Select an option</option>

            {/* Render options. */}
            {
                props.options && props.options.map((opt, i) =>
                    <option key={i}>{opt.name}</option>
                )
            }
        </select>
    );
}

