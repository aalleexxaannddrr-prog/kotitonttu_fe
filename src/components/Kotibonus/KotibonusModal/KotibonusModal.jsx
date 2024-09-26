import React from 'react';
import styles from './KotibonusModal.module.css';
import { IoClose } from 'react-icons/io5';

const KotibonusModal = ({ isOpen, close, children }) => {
	if (!isOpen) return null;

	return (
		<div className={styles.overlay}>
			<div className={styles.modal_content}>
				<button className={styles.close_btn} onClick={close}>
					<IoClose size={24} />
				</button>
				{children}
			</div>
		</div>
	);
};

export default KotibonusModal;
