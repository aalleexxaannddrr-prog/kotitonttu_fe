import React, {useEffect, useRef} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styles from './ApprovedBonusTable.module.css';
import { fetchUsers } from '../../../store/slices/usersSlice';
import { fetchApprovedBonusRequests } from '../../../store/slices/approvedBonusDataSlice';
import {fetchRejectedBonusRequests} from "../../../store/slices/rejectedBonusDataSlice";
import {fetchUsersPag} from "../../../store/slices/usersPaginatedSlice";

export default function ApprovedBonusTable({ bearerToken }) {
	const dispatch = useDispatch();

	// Redux selectors
	const { data: approvedBonusData, status: approvedStatus } = useSelector(
		state => state.approvedBonusData
	);
	const { users, status, error, currentPage, totalPages } = useSelector(state => state.usersPag);
	const hasLoaded = useRef(false);

	useEffect(() => {
		if (!hasLoaded.current) {
			loadMoreUsers(0);
			hasLoaded.current = true;
		}
		dispatch(fetchApprovedBonusRequests());
	}, [dispatch]);

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

	const columns = [
		{ Header: 'Имя', accessor: 'firstName' },
		{ Header: 'Фамилия', accessor: 'lastName' },
		{ Header: 'Модель', accessor: 'model' },
		{ Header: 'Стоимость', accessor: 'cost' },
		{ Header: 'Статус', accessor: 'status' },
	];

	// Обработка состояний загрузки и ошибок
	if (approvedStatus === 'loading' || status === 'loading') {
		return <div>Loading...</div>;
	}

	if (approvedStatus === 'error' || status === 'error') {
		return <div>Error loading data</div>;
	}

	return (
		<div>
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
