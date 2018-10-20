import React from 'react';
import ReactModal from 'react-modal';

export default function Modal(props) {
    return (
        <ReactModal
            ariaHideApp={true}
            className={props.className}
            closeTimeoutMS={150}
            contentLabel='Serial Number Generator'
            isOpen={props.showModal}
            onRequestClose={props.onCloseModal} // For closing using ESC key.
            shouldCloseOnEsc={true}
        >
            {props.children}
        </ReactModal>
    );
}

