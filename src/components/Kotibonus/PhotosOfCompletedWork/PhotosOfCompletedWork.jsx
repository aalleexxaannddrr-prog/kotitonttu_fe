import React, { useEffect } from 'react';
import styles from './PhotosOfCompletedWork.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../../store/slices/usersSlice';
import { fetchPendingBonusRequests } from '../../../store/slices/pendingBonusDataSlice';

export default function PhotosOfCompletedWork() {
	const dispatch = useDispatch();

	// Получаем данные пользователей и бонусных заявок из Redux
	const users = useSelector(state => state.users.users);
	const bonusRequests = useSelector(state => state.pendingBonusData.data);
	const userStatus = useSelector(state => state.users.status);
	const bonusStatus = useSelector(state => state.pendingBonusData.status);

	// Вызов обоих запросов при монтировании компонента
	useEffect(() => {
		if (userStatus === '') dispatch(fetchUsers());
		if (bonusStatus === 'idle') dispatch(fetchPendingBonusRequests());
	}, [dispatch, userStatus, bonusStatus]);

	// Получаем фотографии из заявок на бонусы, если они имеются
	const photos = bonusRequests
		.flatMap(bonusRequest =>
			bonusRequest.bonusRequests.flatMap(request => request.photos)
		)
		.filter(photo => photo); // Убираем null значения, если фото не найдено

	// Отображение в зависимости от статуса загрузки
	if (userStatus === 'loading' || bonusStatus === 'loading')
		return <p>Загрузка...</p>;
	if (userStatus === 'error' || bonusStatus === 'error')
		return <p>Ошибка при загрузке данных</p>;

	return (
		<div>
			{photos.map((photo, index) => (
				<img
					key={index}
					className={styles.images}
					src={photo}
					alt='Фото завершенной работы'
				/>
			))}
		</div>
	);
}
