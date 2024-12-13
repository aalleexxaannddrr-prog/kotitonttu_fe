import React from 'react';
import ReactDOM from 'react-dom';
import styles from './SparePartsModal.module.css';
import { IoClose } from 'react-icons/io5';

const modalRoot = document.getElementById('modal-root');

const SparePartsModal = ({ children, onClose }) => {
	const modalElement = (
		<div className={styles.modal_content}>
			<div className={styles.modal_block}>
				<button className={styles.modal_btn} onClick={onClose}>
					<IoClose size={24} />
				</button>
				{children}
			</div>
		</div>
	);

	return ReactDOM.createPortal(modalElement, modalRoot);
};

export default SparePartsModal;
