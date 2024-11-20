import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styles from './ApprovedBonusTable.module.css';
import { fetchUsers } from '../../../store/slices/usersSlice';
import { fetchApprovedBonusRequests } from '../../../store/slices/approvedBonusDataSlice';
import { fetchBarcodeTypes } from '../../../store/slices/barcodeDataSlice';
import { fetchBarcodes } from '../../../store/slices/allBarcodeDataSlice';

export default function ApprovedBonusTable({ bearerToken }) {
	const dispatch = useDispatch();

	const { data: approvedBonusData, status: approvedStatus } = useSelector(
		state => state.approvedBonusData
	);
	const { users, status: userStatus } = useSelector(state => state.users);
	const { data: barcodeTypes, status: barcodeTypesStatus } = useSelector(
		state => state.barcodeData
	);
	const { status: barcodesStatus } = useSelector(state => state.allBarcodeData);

	useEffect(() => {
		dispatch(fetchApprovedBonusRequests());
		dispatch(fetchUsers());
		dispatch(fetchBarcodeTypes());
		if (bearerToken) {
			dispatch(fetchBarcodes(bearerToken));
		}
	}, [dispatch, bearerToken]);

	const getUserByEmail = email => {
		return users.find(
			user => user.email.trim().toLowerCase() === email.trim().toLowerCase()
		);
	};

	const columns = [
		{ Header: 'Имя', accessor: 'firstName' },
		{ Header: 'Фамилия', accessor: 'lastName' },
		{ Header: 'Модель', accessor: 'model' },
		{ Header: 'Стоимость', accessor: 'cost' },
		{ Header: 'Статус', accessor: 'status' },
	];

	const getModelAndCost = bonusRequestId => {
		// Ищем соответствие bonusRequestId с id в barcodeTypes
		const barcodeType = barcodeTypes.find(item => item.id === bonusRequestId);

		return {
			model: barcodeType ? barcodeType.type : 'Нет данных',
			cost: barcodeType ? `${barcodeType.points} руб.` : 'Нет данных',
		};
	};

	const combinedData = approvedBonusData.flatMap(user => {
		const userInfo = getUserByEmail(user.email);

		return user.bonusRequests.map(request => {
			// Используем bonusRequestId, как указано в обновленном слайсе
			const { model, cost } = getModelAndCost(request.bonusRequestId);
			return {
				firstName: userInfo ? userInfo.firstname : 'Unknown',
				lastName: userInfo ? userInfo.lastname : 'Unknown',
				email: user.email,
				model,
				cost,
				status: request.status === 'APPROVED' ? 'Принято' : request.status,
				bonusRequestId: request.bonusRequestId, // Используем bonusRequestId
			};
		});
	});

	const filteredData = combinedData.filter(row => row.status === 'Принято');

	if (
		approvedStatus === 'loading' ||
		userStatus === 'loading' ||
		barcodeTypesStatus === 'loading' ||
		barcodesStatus === 'loading'
	) {
		return <div>Loading...</div>;
	}

	if (
		approvedStatus === 'error' ||
		userStatus === 'error' ||
		barcodeTypesStatus === 'error' ||
		barcodesStatus === 'error'
	) {
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
						{filteredData.map((row, index) => (
							<tr key={index}>
								<td>
									<Link
										to={`/detailed-info/${row.bonusRequestId}`} // Передаем bonusRequestId вместо email
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
