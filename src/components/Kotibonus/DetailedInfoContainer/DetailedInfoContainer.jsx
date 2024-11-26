import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styles from './DetailedInfoContainer.module.css';
import DetailedInfoUsersContainer from '../DetailedInfoUsersContainer/DetailedInfoUsersContainer';
import ConfirmationCode from '../ConfirmationCode/ConfirmationCode';
import PhotosOfCompletedWork from '../PhotosOfCompletedWork/PhotosOfCompletedWork';
import { UserProvider } from '../../../context/UserContext';
import { fetchPendingBonusRequests } from '../../../store/slices/pendingBonusDataSlice';
import { fetchApprovedBonusRequests } from '../../../store/slices/approvedBonusDataSlice';
import { fetchRejectedBonusRequests } from '../../../store/slices/rejectedBonusDataSlice';
import { fetchBarcodeTypes } from '../../../store/slices/barcodeDataSlice';
import { fetchBarcodes } from '../../../store/slices/allBarcodeDataSlice';

export default function DetailedInfoContainer() {
	const { requestId } = useParams(); // Получаем ID запроса из URL
	const dispatch = useDispatch();

	const pendingBonusData = useSelector(state => state.pendingBonusData.data);
	const approvedBonusData = useSelector(state => state.approvedBonusData.data);
	const rejectedBonusData = useSelector(state => state.rejectedBonusData.data); // Берем `data`
	const barcodeTypes = useSelector(state => state.barcodeData.data);
	const barcodes = useSelector(state => state.allBarcodeData.data);
	const bearerToken = useSelector(state => state.auth.bearerToken);

	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Загружаем данные
		Promise.all([
			dispatch(fetchPendingBonusRequests()).unwrap(),
			dispatch(fetchApprovedBonusRequests()).unwrap(),
			dispatch(fetchRejectedBonusRequests()).unwrap(), // Загружаем отклоненные заявки
			dispatch(fetchBarcodeTypes()).unwrap(),
			dispatch(fetchBarcodes(bearerToken)).unwrap(),
		])
			.then(() => setIsLoading(false))
			.catch(error => {
				console.error('Ошибка при загрузке данных:', error);
				setIsLoading(false);
			});
	}, [dispatch, bearerToken]);

	// Поиск пользователя по `requestId` в данных всех типов
	const userBonusData =
		pendingBonusData.find(user =>
			user.bonusRequests.some(
				request => request.bonusRequestId === Number(requestId)
			)
		) ||
		approvedBonusData.find(user =>
			user.bonusRequests.some(
				request => request.bonusRequestId === Number(requestId)
			)
		) ||
		rejectedBonusData.find(user =>
			user.bonusRequests.some(
				request => request.bonusRequestId === Number(requestId)
			)
		);

	const email = userBonusData?.email;

	// Поиск заявки по `requestId`
	const bonusRequest =
		userBonusData?.bonusRequests.find(
			request => request.bonusRequestId === Number(requestId)
		) || null;

	// Поиск данных для бонусов
	const bonusTypeData = barcodeTypes.find(
		item => item.id === Number(requestId)
	);
	const rejectionMessage = bonusTypeData
		? `${bonusTypeData.points} руб.`
		: 'Нет данных';

	// Поиск данных для штрих-кода
	const barcodeData = barcodes.find(item => item.id === Number(requestId));
	const code = barcodeData ? barcodeData.code : 'Нет данных';
	const barcodeId = barcodeData ? barcodeData.id : null;

	// Статус заявки
	const status = bonusRequest?.status || 'Неизвестно';

	// Проверка загрузки данных
	if (isLoading) {
		return <p>Загрузка данных...</p>;
	}

	// Проверка на наличие данных о пользователе
	if (!userBonusData) {
		return <p>Данные пользователя не найдены</p>;
	}

	return (
		<UserProvider email={email}>
			<div className='container'>
				<div className={styles.cardWrapper}>
					<div className={styles.content}>
						<DetailedInfoUsersContainer />
						<div className={styles.combinedCard}>
							<PhotosOfCompletedWork
								targetEmail={email}
								bonusRequestId={Number(requestId)}
							/>
							{bearerToken && requestId && (
								<ConfirmationCode
									requestId={code}
									barcodeId={barcodeId}
									rejectionMessage={rejectionMessage}
									bearerToken={bearerToken}
									status={status}
								/>
							)}
						</div>
					</div>
				</div>
			</div>
		</UserProvider>
	);
}
