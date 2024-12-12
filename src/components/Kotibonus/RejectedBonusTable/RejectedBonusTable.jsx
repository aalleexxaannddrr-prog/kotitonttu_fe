import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'; // Добавлено
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
		dispatch(fetchRejectedBonusRequests());
		dispatch(fetchUsers());
	}, [dispatch]);

	const getUserByEmail = email => {
		return users.find(
			user => user.email.trim().toLowerCase() === email.trim().toLowerCase()
		);
	};

	// Объединяем данные
	const combinedData = rejectedBonusData.flatMap(user =>
		user.bonusRequests.map(request => {
			const userInfo = getUserByEmail(user.email);
			return {
				firstName: userInfo ? userInfo.firstname : 'Unknown',
				lastName: userInfo ? userInfo.lastname : 'Unknown',
				status: request.status === 'REJECTED' ? 'Отклонен' : request.status,
				rejectionMessage: request.rejectionMessage || 'Причина не указана',
				bonusRequestId: request.bonusRequestId, // Добавлено для перехода по ссылке
			};
		})
	);

	const columns = [
		{ Header: 'Имя', accessor: 'firstName' },
		{ Header: 'Фамилия', accessor: 'lastName' },
		{ Header: 'Сообщение об отклонении', accessor: 'rejectionMessage' },
		{ Header: 'Статус', accessor: 'status' },
	];

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
					{combinedData.length > 0 ? (
						combinedData.map((row, index) => (
							<tr key={index}>
								<td>
									<Link
										to={`/detailed-info/${row.bonusRequestId}`} // Переход по bonusRequestId
										className={styles.detailed_link}
									>
										{row.firstName}
									</Link>
								</td>
								<td>{row.lastName}</td>
								<td>{row.rejectionMessage}</td>
								<td>{row.status}</td>
							</tr>
						))
					) : (
						<tr>
							<td colSpan={columns.length} style={{ textAlign: 'center' }}>
								Отклоненных заявок нет
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}
