import React from 'react';
import styles from './VerificationPhotos.module.css';
import { useSelector } from 'react-redux';

export default function VerificationPhotos({ targetEmail, verificationId }) {
	const verificationData = useSelector(
		state => state.pendingPassVerificationData.data
	);

	// Проверка на наличие `verificationId`
	if (!verificationId) {
		console.error('Отсутствует verificationId');
		return <p>Отсутствует ID верификации</p>;
	}

	// Найти пользователя по email в данных верификации
	const userVerificationData = verificationData.find(
		user => user.email === targetEmail
	);

	// Если данные не найдены
	if (!userVerificationData) {
		console.error('Нет данных о пользователе:', targetEmail);
		return <p>Нет данных о пользователе</p>;
	}

	// Найти верификацию по ID
	const verification = userVerificationData.documentVerifications.find(
		v => String(v.documentVerificationId) === String(verificationId)
	);

	// Если верификация не найдена
	if (!verification) {
		console.error('Нет данных о верификации:', verificationId);
		return <p>Нет данных о верификации</p>;
	}

	// Получить фотографии из `photos`
	const photos = verification.photos || [];

	// Если фотографии отсутствуют
	if (photos.length === 0) {
		return <p>Нет фотографий для отображения</p>;
	}

	return (
		<div className={styles.photosContainer}>
			{photos.map((photo, index) => (
				<div key={index} className={styles.photoWrapper}>
					<img
						className={styles.images}
						src={photo} // Используем предоставленный URL
						alt={`Фото документа ${index + 1}`}
						onError={e => {
							console.error('Ошибка загрузки фотографии:', e.target.src);
							e.target.src = '/default_image.png'; // Заглушка
						}}
					/>
				</div>
			))}
		</div>
	);
}
