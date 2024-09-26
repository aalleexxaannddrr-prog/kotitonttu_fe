import React from "react";
import ReactDOM from "react-dom";
import styles from "./ModalFormForServices.module.css";
import { IoClose } from "react-icons/io5";

const modalRoot = document.getElementById("modal-root"); // Убедитесь, что у вас в index.html есть элемент с id="modal-root"

const ModalFormForServices = ({ children, onClose }) => {
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

export default ModalFormForServices;
