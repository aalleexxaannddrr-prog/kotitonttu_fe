import React, {useEffect, useRef} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styles from './PendingVerificationTable.module.css';
import { fetchUsers } from '../../../../store/slices/usersSlice';
import { fetchPendingPassVerificationData } from '../../../../store/slices/pendingPassVerificationSlice';
import {fetchRejectedPassVerificationData} from "../../../../store/slices/rejectedPassVerificationData";
import {fetchUsersPag} from "../../../../store/slices/usersPaginatedSlice";

export default function PendingVerificationTable({ bearerToken }) {
	const dispatch = useDispatch();
	const {
		data: verificationData,
		status: verificationStatus,
		error: verificationError,
	} = useSelector(state => state.pendingPassVerificationData);
	const { users, status, error, currentPage, totalPages } = useSelector(state => state.usersPag);
	const hasLoaded = useRef(false);

	// Загружаем пользователей и данные верификаций
	useEffect(() => {
		if (!hasLoaded.current) {
			loadMoreUsers(0);
			hasLoaded.current = true;
		}
		if (verificationStatus === 'idle') {
			dispatch(fetchPendingPassVerificationData());
		}
	}, [dispatch, status, verificationStatus, bearerToken]);

	useEffect(() => {
		if (currentPage < totalPages - 1) {
			loadMoreUsers(currentPage + 1); // Загружаем следующую страницу
		}
	}, [currentPage, totalPages]);

	const loadMoreUsers = async (page) => {
		try {
			await dispatch(fetchUsersPag(page)); // Загружаем текущую страницу
		} catch (error) {
			console.error("Ошибка при загрузке пользователей:", error);
		}
	};

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

	if (verificationStatus === 'loading' || status === 'loading') {
		return <div>Загрузка...</div>;
	}

	if (verificationStatus === 'error' || status === 'error') {
		return (
			<div>
				Ошибка загрузки данных:
				<p>{verificationError || 'Verification Error'}</p>
				<p>{status || 'User Error'}</p>
			</div>
		);
	}

	// Фильтруем данные для отображения
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
					status: verification.status === 'PENDING' ? 'Ожидание' : 'Нет данных',
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
									<td>{row.email}</td>
									<td>{row.status}</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={columns.length} style={{ textAlign: 'center' }}>
									Запросов на рассмотрение нет
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
