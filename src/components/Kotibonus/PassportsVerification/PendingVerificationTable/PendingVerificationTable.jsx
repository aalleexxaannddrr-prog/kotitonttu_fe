import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styles from './PendingVerificationTable.module.css';
import { fetchUsers } from '../../../../store/slices/usersSlice';

export default function PendingVerificationTable() {
	const dispatch = useDispatch();
	const { data: verificationData, status: verificationStatus } = useSelector(
		state => state.pendingPassVerificationData
	);
	const { users, status: userStatus } = useSelector(state => state.users);

	useEffect(() => {
		dispatch(fetchUsers());
	}, [dispatch]);

	// Функция для получения данных пользователя по email
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

	if (verificationStatus === 'loading' || userStatus === 'loading') {
		return <div>Loading...</div>;
	}

	if (verificationStatus === 'error' || userStatus === 'error') {
		return <div>Error loading data</div>;
	}

	const combinedData = verificationData
		.filter(item =>
			item.documentVerifications.some(
				verification => verification.status === 'PENDING'
			)
		)
		.map(item => {
			const user = getUserByEmail(item.email);
			return item.documentVerifications
				.filter(verification => verification.status === 'PENDING')
				.map(verification => ({
					firstName: user?.firstname || 'Unknown',
					lastName: user?.lastname || 'Unknown',
					email: item.email,
					status: verification.status,
					userId: user?.id || null,
					documentVerificationId: verification.documentVerificationId,
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
								<td>
									<Link
										to={`/verification-info/${row.userId}/${row.documentVerificationId}`}
										className={styles.detailed_link}
									>
										{row.firstName}
									</Link>
								</td>
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
