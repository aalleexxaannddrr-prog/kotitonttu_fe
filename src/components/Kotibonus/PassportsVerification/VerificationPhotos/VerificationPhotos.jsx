import React from 'react';
import styles from './VerificationPhotos.module.css';
import { useSelector } from 'react-redux';

export default function VerificationPhotos({ targetEmail, verificationId }) {
	const pendingData = useSelector(
		state => state.pendingPassVerificationData.data
	);
	const approvedData = useSelector(
		state => state.approvedPassVerificationData.data
	);
	const rejectedData = useSelector(
		state => state.rejectedPassVerificationData.data
	);

	// Найти данные пользователя в PENDING, APPROVED или REJECTED
	const userPendingData = pendingData.find(user => user.email === targetEmail);
	const userApprovedData = approvedData.find(
		user => user.email === targetEmail
	);
	const userRejectedData = rejectedData.find(
		user => user.email === targetEmail
	);

	let verification = null;
	let status = null;

	// Перебираем все возможные данные для поиска нужной верификации
	const datasets = [
		{ data: userPendingData, status: 'PENDING' },
		{ data: userApprovedData, status: 'APPROVED' },
		{ data: userRejectedData, status: 'REJECTED' },
	];

	for (const dataset of datasets) {
		if (dataset.data) {
			verification = dataset.data.documentVerifications.find(
				v => String(v.documentVerificationId) === String(verificationId)
			);
			if (verification) {
				status = dataset.status;
				break;
			}
		}
	}

	// Если верификация не найдена
	if (!verification) {
		console.error('Нет данных о верификации:', verificationId);
		return <p>Нет данных о верификации</p>;
	}

	// Получение фотографий
	const photos = verification.photos || [];

	if (photos.length === 0) {
		return <p>Нет фотографий для отображения</p>;
	}

	return (
		<div className={styles.photosContainer}>
			{photos.map((photo, index) => (
				<div key={index} className={styles.photoWrapper}>
					<img
						className={styles.images}
						src={photo}
						alt={`Фото документа ${index + 1}`}
						onError={e => {
							console.error('Ошибка загрузки фотографии:', e.target.src);
							e.target.src = '/default_image.png'; // Заменяем на изображение по умолчанию
						}}
					/>
				</div>
			))}
		</div>
	);
}
