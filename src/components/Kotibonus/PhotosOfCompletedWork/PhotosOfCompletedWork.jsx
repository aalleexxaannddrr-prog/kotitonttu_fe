import React from 'react';
import styles from './PhotosOfCompletedWork.module.css';
import { useSelector } from 'react-redux';

export default function PhotosOfCompletedWork({ targetEmail, bonusRequestId }) {
	const pendingBonusData = useSelector(state => state.pendingBonusData.data);
	const approvedBonusData = useSelector(state => state.approvedBonusData.data);

	// console.log('Pending Bonus Data:', pendingBonusData);
	// console.log('Approved Bonus Data:', approvedBonusData);
	// console.log('Target Email:', targetEmail);
	// console.log('Bonus Request ID:', bonusRequestId);

	// Найти пользователя по email в pendingBonusData или approvedBonusData
	const userPendingData = pendingBonusData.find(
		user => user.email === targetEmail
	);
	const userApprovedData = approvedBonusData.find(
		user => user.email === targetEmail
	);

	let bonusRequest = null;
	let status = null;

	// Проверка в PENDING
	if (userPendingData) {
		bonusRequest = userPendingData.bonusRequests.find(
			request =>
				String(request.bonusRequestId || request.id) === String(bonusRequestId)
		);
		if (bonusRequest) status = 'PENDING';
	}

	// Если не нашли в PENDING, проверяем APPROVED
	if (!bonusRequest && userApprovedData) {
		bonusRequest = userApprovedData.bonusRequests.find(
			request =>
				String(request.bonusRequestId || request.id) === String(bonusRequestId)
		);
		if (bonusRequest) status = 'APPROVED';
	}

	// Если заявка не найдена ни в одной категории
	if (!bonusRequest) {
		console.error('Нет данных о заявке:', bonusRequestId);
		return <p>Нет данных о заявке</p>;
	}

	// console.log('Bonus Request:', bonusRequest);
	// console.log('Status:', status);

	// Получить URL фотографии
	const photo = bonusRequest.photos?.[0];

	// console.log('URL фотографии:', photo);

	if (!photo) {
		return <p>Нет фотографии для отображения</p>;
	}

	return (
		<div className={styles.wrapper}>
			<img
				className={styles.images}
				src={photo}
				alt='Фото завершенной работы'
				onError={e => {
					console.error('Ошибка загрузки фотографии:', e.target.src);
					e.target.src = '/path/to/placeholder/image.jpg'; // Заглушка
				}}
			/>
		</div>
	);
}
