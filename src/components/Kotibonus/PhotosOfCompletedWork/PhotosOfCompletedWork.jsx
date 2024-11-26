import React from 'react';
import styles from './PhotosOfCompletedWork.module.css';
import { useSelector } from 'react-redux';

export default function PhotosOfCompletedWork({ targetEmail, bonusRequestId }) {
	const pendingBonusData = useSelector(state => state.pendingBonusData.data);
	const approvedBonusData = useSelector(state => state.approvedBonusData.data);
	const rejectedBonusData = useSelector(state => state.rejectedBonusData.data);

	// Найти пользователя по email в данных PENDING, APPROVED или REJECTED
	const userPendingData = pendingBonusData.find(
		user => user.email === targetEmail
	);
	const userApprovedData = approvedBonusData.find(
		user => user.email === targetEmail
	);
	const userRejectedData = rejectedBonusData.find(
		user => user.email === targetEmail
	);

	let bonusRequest = null;
	let status = null;

	const datasets = [
		{ data: userPendingData, status: 'PENDING' },
		{ data: userApprovedData, status: 'APPROVED' },
		{ data: userRejectedData, status: 'REJECTED' },
	];

	for (const dataset of datasets) {
		if (dataset.data) {
			bonusRequest = dataset.data.bonusRequests.find(
				request =>
					String(request.bonusRequestId || request.id) ===
					String(bonusRequestId)
			);
			if (bonusRequest) {
				status = dataset.status;
				break;
			}
		}
	}

	// Если заявка не найдена ни в одной категории
	if (!bonusRequest) {
		console.error('Нет данных о заявке:', bonusRequestId);
		return <p>Нет данных о заявке</p>;
	}

	// Получить URL фотографии
	const photo = bonusRequest.photos?.[0];

	if (!photo) {
		return <p>Нет фотографии для отображения</p>;
	}

	return (
		<div>
			<img
				className={styles.images}
				src={photo}
				alt='Фото завершенной работы'
				onError={e => {
					console.error('Ошибка загрузки фотографии:', e.target.src);
				}}
			/>
		</div>
	);
}
