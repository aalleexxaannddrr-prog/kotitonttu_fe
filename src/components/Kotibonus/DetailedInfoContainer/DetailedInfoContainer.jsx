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

export default function DetailedInfoContainer() {
	const { requestId } = useParams(); // Получаем ID запроса из URL
	const dispatch = useDispatch();

	const pendingBonusData = useSelector(state => state.pendingBonusData.data);
	const approvedBonusData = useSelector(state => state.approvedBonusData.data);
	const rejectedBonusData = useSelector(state => state.rejectedBonusData.data);
	const bearerToken = useSelector(state => state.auth.bearerToken);

	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Загружаем данные
		Promise.all([
			dispatch(fetchPendingBonusRequests()).unwrap(),
			dispatch(fetchApprovedBonusRequests()).unwrap(),
			dispatch(fetchRejectedBonusRequests()).unwrap(),
		])
			.then(() => setIsLoading(false))
			.catch(error => {
				console.error('Ошибка при загрузке данных:', error);
				setIsLoading(false);
			});
	}, [dispatch, bearerToken]);

	// Поиск данных о пользователе и заявке
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

	const bonusRequest = userBonusData?.bonusRequests.find(
		request => request.bonusRequestId === Number(requestId)
	);

	// Извлечение данных для отображения
	const barcode = bonusRequest?.barcode || 'Нет данных'; // Используем barcode
	const points = bonusRequest?.points || 'Нет данных'; // Используем points
	const status = bonusRequest?.status || 'Неизвестно'; // Статус заявки

	if (isLoading) {
		return <p>Загрузка данных...</p>;
	}

	if (!userBonusData || !bonusRequest) {
		return <p>Данные пользователя или заявки не найдены</p>;
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
									requestId={bonusRequest.bonusRequestId} // Передаем bonusRequestId для функций
									barcode={barcode} // Передаем barcode для отображения
									points={points} // Передаем points для отображения
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
