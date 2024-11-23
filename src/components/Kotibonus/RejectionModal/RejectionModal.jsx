import React, { useState } from 'react';
import styles from './RejectionModal.module.css';

export default function RejectionModal({ isOpen, onClose, onSubmit }) {
	const rejectionOptions = [
		'Неверный шильд со штрихкодом',
		'Плохое качество фото, не видно штрихкод',
		'Штрихкод не действительный',
		'Данный штрихкод не участвует в бонусной программе',
		'Другое',
	];

	const [rejectionReasons, setRejectionReasons] = useState([]);
	const [customComment, setCustomComment] = useState('');
	const [errorMessage, setErrorMessage] = useState(null);

	const toggleRejectionReason = reason => {
		if (rejectionReasons.includes(reason)) {
			setRejectionReasons(rejectionReasons.filter(r => r !== reason));
		} else {
			setRejectionReasons([...rejectionReasons, reason]);
		}
	};

	const handleSubmit = () => {
		if (
			rejectionReasons.length === 0 ||
			(rejectionReasons.includes('Другое') && !customComment)
		) {
			setErrorMessage(
				'Выберите хотя бы одну причину или добавьте комментарий.'
			);
			return;
		}

		const rejectionMessage =
			rejectionReasons.includes('Другое') && customComment
				? `${rejectionReasons.join(', ')}. Комментарий: ${customComment}`
				: rejectionReasons.join(', ');

		onSubmit(rejectionMessage);
		setErrorMessage(null);
	};

	if (!isOpen) return null;

	return (
		<div className={styles.modal}>
			<div className={styles.modal_content}>
				<h3>Причина отклонения заявки</h3>
				<div className={styles.rejection_options}>
					{rejectionOptions.map(option => (
						<label key={option} className={styles.checkbox_label}>
							<input
								type='checkbox'
								checked={rejectionReasons.includes(option)}
								onChange={() => toggleRejectionReason(option)}
							/>
							{option}
						</label>
					))}
				</div>
				{rejectionReasons.includes('Другое') && (
					<textarea
						className={styles.textarea}
						placeholder='Введите комментарий'
						value={customComment}
						onChange={e => setCustomComment(e.target.value)}
					/>
				)}
				{errorMessage && <p className={styles.error}>{errorMessage}</p>}
				<div className={styles.modal_actions}>
					<button className={styles.btn} onClick={handleSubmit}>
						Отправить
					</button>
					<button className={styles.btn} onClick={onClose}>
						Отмена
					</button>
				</div>
			</div>
		</div>
	);
}
