import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './ApprovedBonusTable.module.css';
import { fetchUsers } from '../../../store/slices/usersSlice';
import { fetchApprovedBonusRequests } from '../../../store/slices/approvedBonusDataSlice';

export default function ApprovedBonusTable() {
	const dispatch = useDispatch();
	const { data: approvedBonusData, status: bonusStatus } = useSelector(
		state => state.approvedBonusData
	);
	const { users, status: userStatus } = useSelector(state => state.users);

	useEffect(() => {
		dispatch(fetchApprovedBonusRequests()); // Запрашиваем одобренные заявки
		dispatch(fetchUsers()); // Запрашиваем пользователей
	}, [dispatch]);

	// Функция для поиска пользователя по email
	const getUserByEmail = email => {
		return users.find(
			user => user.email.trim().toLowerCase() === email.trim().toLowerCase()
		);
	};

	const columns = [
		{ Header: 'Имя', accessor: 'firstName' },
		{ Header: 'Фамилия', accessor: 'lastName' },
		{ Header: 'Статус', accessor: 'status' },
	];

	// Объединяем данные из пользователей и заявок
	const combinedData = approvedBonusData.flatMap(user =>
		user.bonusRequests.map(request => {
			const userInfo = getUserByEmail(user.email);
			return {
				firstName: userInfo ? userInfo.firstname : 'Unknown',
				lastName: userInfo ? userInfo.lastname : 'Unknown',
				status: request.status === 'APPROVED' ? 'Принят' : request.status,
			};
		})
	);

	if (bonusStatus === 'loading' || userStatus === 'loading') {
		return <div>Loading...</div>;
	}

	if (bonusStatus === 'error' || userStatus === 'error') {
		return <div>Error loading data</div>;
	}

	return (
		<div className={styles.approved_bonus_table}>
			<table className={styles.table}>
				<thead>
					<tr>
						{columns.map(column => (
							<th key={column.accessor}>{column.Header}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{combinedData.map((row, index) => (
						<tr key={index}>
							<td>{row.firstName}</td>
							<td>{row.lastName}</td>
							<td>{row.status}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
