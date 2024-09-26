import React, { useState } from 'react';
import styles from './MessageButton.module.css';
import ComposeMessage from '../ComposeMessage/ComposeMessage';

export default function MessageButton() {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleOpenModal = () => {
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	const handleSendMessage = message => {
		console.log('Отправленное сообщение:', message);
		// Здесь нужно добавить логику для отправки сообщения на сервер или сохранения
	};

	return (
		<div className={styles.app}>
			<button className={styles.compose_btn} onClick={handleOpenModal}>
				Написать сообщение
			</button>
			<ComposeMessage
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				onSend={handleSendMessage}
			/>
		</div>
	);
}
