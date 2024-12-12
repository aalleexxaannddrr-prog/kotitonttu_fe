import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styles from './PendingBonusTable.module.css';
import { fetchUsers } from '../../../store/slices/usersSlice';
import { fetchPendingBonusRequests } from '../../../store/slices/pendingBonusDataSlice';

export default function PendingBonusTable({ bearerToken }) {
	const dispatch = useDispatch();

	// Redux selectors
	const { data: pendingBonusData, status: pendingStatus } = useSelector(
		state => state.pendingBonusData
	);
	const { users, status: userStatus } = useSelector(state => state.users);

	// Fetch data from backend
	useEffect(() => {
		dispatch(fetchPendingBonusRequests());
		dispatch(fetchUsers());
	}, [dispatch, bearerToken]);

	// Helper function: get user by email
	const getUserByEmail = email => {
		return users.find(
			user => user.email.trim().toLowerCase() === email.trim().toLowerCase()
		);
	};

	// Prepare data for the table
	const combinedData = pendingBonusData.flatMap(user => {
		const userInfo = getUserByEmail(user.email);

		return user.bonusRequests.map(request => {
			return {
				firstName: userInfo?.firstname || 'Unknown',
				lastName: userInfo?.lastname || 'Unknown',
				email: user.email,
				model: request.type || 'Нет данных', // Используем поле type для модели
				cost: request.points ? `${request.points} руб.` : 'Нет данных', // Используем поле points для стоимости
				status: request.status === 'PENDING' ? 'Ожидание' : 'Неизвестно',
				bonusRequestId: request.bonusRequestId,
			};
		});
	});

	const filteredData = combinedData.filter(row => row.status === 'Ожидание');

	const columns = [
		{ Header: 'Имя', accessor: 'firstName' },
		{ Header: 'Фамилия', accessor: 'lastName' },
		{ Header: 'Модель', accessor: 'model' },
		{ Header: 'Стоимость', accessor: 'cost' },
		{ Header: 'Статус', accessor: 'status' },
	];

	//  Обработка состояний загрузки и ошибок
	if (pendingStatus === 'loading' || userStatus === 'loading') {
		return <div>Loading...</div>;
	}

	if (pendingStatus === 'error' || userStatus === 'error') {
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
						{filteredData.length > 0 ? (
							filteredData.map((row, index) => (
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
							))
						) : (
							<tr>
								<td colSpan={columns.length} style={{ textAlign: 'center' }}>
									Ожидающих заявок нет
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
