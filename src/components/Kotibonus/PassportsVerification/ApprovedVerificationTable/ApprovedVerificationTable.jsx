import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './ApprovedVerificationTable.module.css';
import { fetchUsers } from '../../../../store/slices/usersSlice';

export default function ApprovedVerificationTable() {
	const dispatch = useDispatch();
	const { data: approvedData, status: approvedStatus } = useSelector(
		state => state.approvedPassVerificationData
	);
	const { users, status: userStatus } = useSelector(state => state.users);

	useEffect(() => {
		dispatch(fetchUsers()); // Загружаем пользователей
	}, [dispatch]);

	// Получить пользователя по email
	const getUserByEmail = email => {
		return users?.find(
			user => user.email.trim().toLowerCase() === email.trim().toLowerCase()
		);
	};

	const columns = [
		{ Header: 'Имя', accessor: 'firstName' },
		{ Header: 'Фамилия', accessor: 'lastName' },
		{ Header: 'Почта', accessor: 'email' },
		{ Header: 'Статус', accessor: 'status' },
	];

	if (approvedStatus === 'loading' || userStatus === 'loading') {
		return <div>Loading...</div>;
	}

	if (approvedStatus === 'error' || userStatus === 'error') {
		return <div>Error loading data</div>;
	}

	const combinedData = approvedData
		.filter(
			item =>
				item.documentVerifications.some(
					verification => verification.status === 'APPROVED'
				) // Фильтруем только те записи, где есть APPROVED
		)
		.map(item => {
			const user = getUserByEmail(item.email);
			return item.documentVerifications
				.filter(verification => verification.status === 'APPROVED') // Фильтруем только APPROVED
				.map(verification => ({
					firstName: user?.firstname || 'Unknown',
					lastName: user?.lastname || 'Unknown',
					email: item.email,
					status: 'Принято', // Устанавливаем статус Принято
				}));
		})
		.flat();

	return (
		<div>
			<div className={styles.verification_card}>
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
								<td>{row.email}</td>
								<td>{row.status}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
