import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './RejectedBonusTable.module.css';
import { fetchUsers } from '../../../store/slices/usersSlice';
import { fetchRejectedBonusRequests } from '../../../store/slices/rejectedBonusDataSlice';

export default function RejectedBonusTable() {
	const dispatch = useDispatch();
	const { data: rejectedBonusData, status: bonusStatus } = useSelector(
		state => state.rejectedBonusData
	);
	const { users, status: userStatus } = useSelector(state => state.users);

	useEffect(() => {
		dispatch(fetchRejectedBonusRequests()); // Запрашиваем отклоненные заявки
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
		{ Header: 'Сообщение об отклонении', accessor: 'rejectionMessage' },
	];

	// Объединяем данные из пользователей и отклоненных заявок
	const combinedData = rejectedBonusData.flatMap(user =>
		user.bonusRequests.map(request => {
			const userInfo = getUserByEmail(user.email);
			return {
				firstName: userInfo ? userInfo.firstname : 'Unknown',
				lastName: userInfo ? userInfo.lastname : 'Unknown',
				status: request.status === 'REJECTED' ? 'Отклонен' : request.status,
				rejectionMessage: request.rejectionMessage || 'Причина не указана',
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
		<div className={styles.rejected_bonus_table}>
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
							<td>{row.rejectionMessage}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
