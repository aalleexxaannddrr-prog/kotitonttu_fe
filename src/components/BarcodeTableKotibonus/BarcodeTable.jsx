import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBarcodeTypes } from '../../store/slices/barcodeDataSlice';
import styles from './BarcodeTable.module.css'; // Import your CSS module here

export default function BarcodeTable() {
	const dispatch = useDispatch();
	const { data, status, error } = useSelector(state => state.barcodeData);

	useEffect(() => {
		dispatch(fetchBarcodeTypes());
	}, [dispatch]);

	const columns = [
		{ Header: 'Очки', accessor: 'points' },
		{ Header: 'Тип', accessor: 'type' },
		{ Header: 'Подтип', accessor: 'subtype' },
	];

	return (
		<div className={styles.table_container}>
			<table className={styles.table}>
				<thead>
					<tr>
						{columns.map(column => (
							<th key={column.accessor}>{column.Header}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{status === 'loading' && (
						<tr>
							<td colSpan={columns.length}>Загрузка...</td>
						</tr>
					)}
					{status === 'error' && (
						<tr>
							<td colSpan={columns.length}>Ошибка: {error}</td>
						</tr>
					)}
					{status === 'ready' &&
						data.map(row => (
							<tr key={row.id}>
								{columns.map(column => (
									<td key={`${row.id}-${column.accessor}`}>
										{row[column.accessor]}
									</td>
								))}
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
}
