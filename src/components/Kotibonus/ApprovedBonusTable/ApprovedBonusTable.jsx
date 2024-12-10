import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styles from './ApprovedBonusTable.module.css';
import { fetchUsers } from '../../../store/slices/usersSlice';
import { fetchApprovedBonusRequests } from '../../../store/slices/approvedBonusDataSlice';

export default function ApprovedBonusTable({ bearerToken }) {
	const dispatch = useDispatch();

	// Redux selectors
	const { data: approvedBonusData, status: approvedStatus } = useSelector(
		state => state.approvedBonusData
	);
	const { users, status: userStatus } = useSelector(state => state.users);

	// Fetching required data
	useEffect(() => {
		dispatch(fetchApprovedBonusRequests());
		dispatch(fetchUsers());
	}, [dispatch]);

	// Helper function: get user by email
	const getUserByEmail = email => {
		return users.find(
			user => user.email.trim().toLowerCase() === email.trim().toLowerCase()
		);
	};

	// Preparing data for the table
	const combinedData = approvedBonusData.flatMap(user => {
		const userInfo = getUserByEmail(user.email);

		return user.bonusRequests.map(request => {
			return {
				firstName: userInfo?.firstname || user.firstName || 'Нет данных',
				lastName: userInfo?.lastname || user.lastName || 'Нет данных',
				email: user.email,
				model: request.type || 'Нет данных', // Используем поле type для модели
				cost: request.points ? `${request.points} руб.` : 'Нет данных', // Используем поле points для стоимости
				status: request.status === 'APPROVED' ? 'Принято' : 'Нет данных',
				bonusRequestId: request.bonusRequestId, // Используем bonusRequestId
			};
		});
	});

	// Фильтрация принятых заявок
	const filteredData = combinedData.filter(row => row.status === 'Принято');

	// Обработка состояний загрузки и ошибок
	if (approvedStatus === 'loading' || userStatus === 'loading') {
		return <div>Loading...</div>;
	}

	if (approvedStatus === 'error' || userStatus === 'error') {
		return <div>Error loading data</div>;
	}

	return (
		<div>
			<div className={styles.approved_bonus_table}>
				<table className={styles.table}>
					<thead>
						<tr>
							<th>Имя</th>
							<th>Фамилия</th>
							<th>Модель</th>
							<th>Стоимость</th>
							<th>Статус</th>
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
