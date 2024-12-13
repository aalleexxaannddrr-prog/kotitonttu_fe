import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styles from './RejectedVerificationTable.module.css';
import { fetchUsers } from '../../../../store/slices/usersSlice';
import { fetchRejectedPassVerificationData } from '../../../../store/slices/rejectedPassVerificationData';

export default function RejectedVerificationTable({ bearerToken }) {
	const dispatch = useDispatch();

	// Данные из Redux
	const {
		data: verificationData,
		status: verificationStatus,
		error: verificationError,
	} = useSelector(state => state.rejectedPassVerificationData);
	const {
		users,
		status: userStatus,
		error: userError,
	} = useSelector(state => state.users);

	// Загружаем пользователей и данные верификаций
	useEffect(() => {
		if (userStatus === 'idle') {
			dispatch(fetchUsers());
		}
		if (verificationStatus === 'idle') {
			dispatch(fetchRejectedPassVerificationData());
		}
	}, [dispatch, userStatus, verificationStatus, bearerToken]);

	// Функция для получения данных пользователя по email
	const getUserByEmail = email => {
		return users?.find(
			user => user.email.trim().toLowerCase() === email.trim().toLowerCase()
		);
	};

	// Колонки таблицы
	const columns = [
		{ Header: 'Имя', accessor: 'firstName' },
		{ Header: 'Фамилия', accessor: 'lastName' },
		{ Header: 'Сообщение об отклонении', accessor: 'rejectionReason' },
		{ Header: 'Статус', accessor: 'status' },
	];

	if (verificationStatus === 'loading' || userStatus === 'loading') {
		return <div>Загрузка...</div>;
	}

	if (verificationStatus === 'error' || userStatus === 'error') {
		return (
			<div>
				Ошибка загрузки данных:
				<p>{verificationError || 'Verification Error'}</p>
				<p>{userError || 'User Error'}</p>
			</div>
		);
	}

	// Фильтруем данные для отображения
	const combinedData = verificationData
		.filter(item =>
			item.documentVerifications.some(
				verification => verification.status === 'REJECTED'
			)
		)
		.map(item => {
			const user = getUserByEmail(item.email);
			return item.documentVerifications
				.filter(verification => verification.status === 'REJECTED')
				.map(verification => ({
					firstName: user?.firstname || 'Unknown',
					lastName: user?.lastname || 'Unknown',
					email: item.email,
					rejectionReason:
						verification.rejectionMessage || 'Причина не указана',
					status:
						verification.status === 'REJECTED' ? 'Отклонено' : 'Нет данных',
					documentVerificationId: verification.documentVerificationId,
				}));
		})
		.flat();

	return (
		<div>
			<div className={styles.rejected_table}>
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
											to={`/verification-info/${row.documentVerificationId}`}
											className={styles.detailed_link}
										>
											{row.firstName}
										</Link>
									</td>
									<td>{row.lastName}</td>
									<td>{row.rejectionReason}</td>
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
		</div>
	);
}
