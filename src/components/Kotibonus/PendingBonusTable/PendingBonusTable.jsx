import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styles from './PendingBonusTable.module.css';
import { fetchUsers } from '../../../store/slices/usersSlice';
import { fetchPendingBonusRequests } from '../../../store/slices/pendingBonusDataSlice';
import { fetchBarcodeTypes } from '../../../store/slices/barcodeDataSlice';
import { fetchBarcodes } from '../../../store/slices/allBarcodeDataSlice';

export default function PendingBonusTable({ bearerToken }) {
	const dispatch = useDispatch();
	const { data: pendingBonusData, status: pendingStatus } = useSelector(
		state => state.pendingBonusData
	);
	const { users, status: userStatus } = useSelector(state => state.users);
	const { data: barcodeTypes, status: barcodeTypesStatus } = useSelector(
		state => state.barcodeData
	);
	const { status: barcodesStatus } = useSelector(state => state.allBarcodeData);

	useEffect(() => {
		dispatch(fetchPendingBonusRequests());
		dispatch(fetchUsers());
		dispatch(fetchBarcodeTypes())
			.unwrap()
			.catch(err => {
				console.error('Ошибка загрузки barcodeTypes:', err);
			});
		if (bearerToken) {
			dispatch(fetchBarcodes(bearerToken));
		}
	}, [dispatch, bearerToken]);


	const getUserByEmail = email => {
		return users.find(
			user => user.email.trim().toLowerCase() === email.trim().toLowerCase()
		);
	};

	const getModelAndCost = bonusRequestId => {
		const barcodeType = barcodeTypes.find(item => item.id === bonusRequestId);

		// Логируем, если данные отсутствуют
		// if (!barcodeType) {
		// 	console.warn(
		// 		`Не найдена информация для bonusRequestId: ${bonusRequestId}`
		// 	);
		// }

		return {
			model: barcodeType?.type || 'Нет данных',
			cost: barcodeType?.points ? `${barcodeType.points} руб.` : 'Нет данных',
		};
	};


	const columns = [
		{ Header: 'Имя', accessor: 'firstName' },
		{ Header: 'Фамилия', accessor: 'lastName' },
		{ Header: 'Модель', accessor: 'model' },
		{ Header: 'Стоимость', accessor: 'cost' },
		{ Header: 'Статус', accessor: 'status' },
	];

	const combinedData = pendingBonusData.flatMap(user => {
		const userInfo = getUserByEmail(user.email);

		return user.bonusRequests.map(request => {
			// Обрабатываем данные заявки
			const { model, cost } = getModelAndCost(request.bonusRequestId);

			// Логируем, если модель или стоимость не найдены
			// if (model === 'Нет данных' || cost === 'Нет данных') {
			// 	console.warn(
			// 		`Для заявки ${request.bonusRequestId} у пользователя ${user.email} отсутствуют данные модели или стоимости.`
			// 	);
			// }

			return {
				firstName: userInfo?.firstname || 'Unknown',
				lastName: userInfo?.lastname || 'Unknown',
				email: user.email,
				model,
				cost,
				status: 'Ожидание',
				bonusRequestId: request.bonusRequestId, // Добавляем bonusRequestId для каждой записи
			};
		});
	});


	const filteredData = combinedData.filter(row => row.status === 'Ожидание');

	if (
		pendingStatus === 'loading' ||
		userStatus === 'loading' ||
		barcodeTypesStatus === 'loading' ||
		barcodesStatus === 'loading'
	) {
		return <div>Loading...</div>;
	}

	if (
		pendingStatus === 'error' ||
		userStatus === 'error' ||
		barcodeTypesStatus === 'error' ||
		barcodesStatus === 'error'
	) {
		return <div>Error loading data</div>;
	}

	return (
		<div>
			<div className={styles.application_card}>
				<table className={styles.table}>
					<thead>
						<tr>
							{columns.map(column => (
								<th key={column.accessor}>{column.Header}</th>
							))}
						</tr>
					</thead>
					<tbody>
						{filteredData.map((row, index) => (
							<tr key={index}>
								<td>
									<Link
										to={`/detailed-info/${row.bonusRequestId}`}
										className={styles.detailed_link}
									>
										{row.firstName}
									</Link>
								</td>
								<td>{row.lastName}</td>
								<td>{row.model}</td>
								<td>{row.cost}</td>
								<td>{row.status}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
