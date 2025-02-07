import React, {useEffect, useRef} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styles from './ApprovedVerificationTable.module.css';
import { fetchUsers } from '../../../../store/slices/usersSlice';
import {fetchApprovedPassVerificationData} from "../../../../store/slices/approvedPassVerificationDataSlice";
import {fetchUsersPag} from "../../../../store/slices/usersPaginatedSlice";

export default function ApprovedVerificationTable({ bearerToken }) {
	const dispatch = useDispatch();
	const { data: approvedData, status: approvedStatus } = useSelector(
		state => state.approvedPassVerificationData
	);
	const { users, userStatus, error, currentPage, totalPages } = useSelector(state => state.usersPag);
	const hasLoaded = useRef(false);

	// Загружаем пользователей и данные верификаций
	useEffect(() => {
		if (!hasLoaded.current) {
			loadMoreUsers(0);
			hasLoaded.current = true;
		}
		if (approvedStatus === 'idle') {
			dispatch(fetchApprovedPassVerificationData());
		}
	}, [dispatch, userStatus, approvedStatus, bearerToken]);

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
	// Получить пользователя по email
	const getUserByEmail = email => {
		return users?.find(
			user => user.email.trim().toLowerCase() === email.trim().toLowerCase()
		);
	};

	const combinedData = approvedData
		.filter(item =>
			item.documentVerifications.some(
				verification => verification.status === 'APPROVED'
			)
		)
		.map(item => {
			const user = getUserByEmail(item.email);
			return item.documentVerifications
				.filter(verification => verification.status === 'APPROVED')
				.map(verification => ({
					firstName: user?.firstname || 'Unknown',
					lastName: user?.lastname || 'Unknown',
					email: item.email,
					status: verification.status === 'APPROVED' ? 'Принято' : 'Нет данных',
					userId: user?.id || null,
					documentVerificationId: verification.documentVerificationId,
				}));
		})
		.flat();

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
									Принятых заявок нет
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
