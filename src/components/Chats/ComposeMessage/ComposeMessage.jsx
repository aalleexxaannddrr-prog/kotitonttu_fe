import React, { useState } from 'react';
import styles from './ComposeMessage.module.css';
import { IoClose } from 'react-icons/io5';

export default function ComposeMessage({ isOpen, onClose, onSend }) {
	const [to, setTo] = useState('');
	const [subject, setSubject] = useState('');
	const [message, setMessage] = useState('');

	if (!isOpen) {
		return null;
	}

	const handleSend = () => {
		const newMessage = {
			to,
			subject,
			message,
		};
		onSend(newMessage);
		onClose(); // Закрываем модальное окно после отправки
	};

	return (
		<div className={styles.modal_backdrop}>
			<div className={styles.modal_content}>
				<div className={styles.modal_header}>
					<h2>Новое сообщение</h2>
					<button className={styles.close_btn} onClick={onClose}>
						<IoClose size={24} />
					</button>
				</div>
				<div className={styles.modal_body}>
					<div className={styles.input_group}>
						<label>Кому:</label>
						<input
							type='text'
							value={to}
							onChange={e => setTo(e.target.value)}
						/>
					</div>
					<div className={styles.input_group}>
						<label>Тема:</label>
						<input
							type='text'
							value={subject}
							onChange={e => setSubject(e.target.value)}
						/>
					</div>
					<div className={styles.input_group}>
						<label>Сообщение:</label>
						<textarea
							value={message}
							onChange={e => setMessage(e.target.value)}
						/>
					</div>
				</div>
				<div className={styles.modal_footer}>
					<button className={styles.send_btn} onClick={handleSend}>
						Отправить
					</button>
				</div>
			</div>
		</div>
	);
}
