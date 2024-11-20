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
import { fetchBarcodeTypes } from '../../../store/slices/barcodeDataSlice';
import { fetchBarcodes } from '../../../store/slices/allBarcodeDataSlice';

export default function DetailedInfoContainer() {
	const { requestId } = useParams();
	const dispatch = useDispatch();

	const pendingBonusData = useSelector(state => state.pendingBonusData.data);
	const approvedBonusData = useSelector(state => state.approvedBonusData.data);
	const barcodeTypes = useSelector(state => state.barcodeData.data);
	const barcodes = useSelector(state => state.allBarcodeData.data);
	const bearerToken = useSelector(state => state.auth.bearerToken);

	const [isLoading, setIsLoading] = useState(true); // Индикатор загрузки данных

	useEffect(() => {
		// Загружаем данные
		Promise.all([
			dispatch(fetchPendingBonusRequests()).unwrap(),
			dispatch(fetchApprovedBonusRequests()).unwrap(),
			dispatch(fetchBarcodeTypes()).unwrap(),
			dispatch(fetchBarcodes()).unwrap(),
		])
			.then(() => setIsLoading(false)) // Убираем индикатор загрузки
			.catch(error => {
				console.error('Ошибка при загрузке данных:', error);
				setIsLoading(false);
			});
	}, [dispatch]);

	// Поиск пользователя по requestId
	const userBonusData =
		pendingBonusData.find(user =>
			user.bonusRequests.some(
				request =>
					String(request.bonusRequestId || request.id) === String(requestId)
			)
		) ||
		approvedBonusData.find(user =>
			user.bonusRequests.some(
				request =>
					String(request.bonusRequestId || request.id) === String(requestId)
			)
		);

	const email = userBonusData?.email;

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
	const status = userBonusData?.bonusRequests.find(
		request =>
			String(request.bonusRequestId || request.id) === String(requestId)
	)?.status;

	// Проверка загрузки данных
	if (isLoading) {
		return <p>Загрузка данных...</p>;
	}

	if (!email) {
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
