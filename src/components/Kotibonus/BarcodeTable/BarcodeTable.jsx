import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBarcodes } from '../../../store/slices/allBarcodeDataSlice';
import { updateBarcode } from '../../../store/slices/updateBarcodeSlice';
import { deleteBarcode } from '../../../store/slices/deleteBarcodeSlice';
import { IoClose } from 'react-icons/io5';
import styles from './BarcodeTable.module.css';

export default function BarcodeTable() {
	const dispatch = useDispatch();
	const { data, status, error } = useSelector(state => state.allBarcodeData);

	const [editMode, setEditMode] = useState(null);
	const [editedData, setEditedData] = useState({});
	const [originalData, setOriginalData] = useState({});

	useEffect(() => {
		dispatch(fetchBarcodes());
	}, [dispatch]);

	const handleUpdateField = (id, field) => {
		const updatedValue = editedData[id]?.[field];

		if (
			updatedValue !== undefined &&
			updatedValue !== originalData[id]?.[field]
		) {
			const updateData = {
				id,
				code:
					field === 'code'
						? updatedValue
						: data.find(item => item.id === id).code,
				used:
					field === 'used'
						? updatedValue
						: data.find(item => item.id === id).used,
				bearerToken: 'yourBearerToken', // Replace with actual bearer token
			};

			dispatch(updateBarcode(updateData)).then(() => {
				window.location.reload(); // Перезагрузка страницы после обновления
			});
		}

		setEditMode(null);
	};

	const handleCellClick = (id, field, value) => {
		setEditMode({ id, field });

		setOriginalData(prev => ({
			...prev,
			[id]: {
				...prev[id],
				[field]: value !== undefined ? value : '',
			},
		}));

		setEditedData(prev => ({
			...prev,
			[id]: {
				...prev[id],
				[field]: value !== undefined ? value : '',
			},
		}));
	};

	const handleDelete = id => {
		dispatch(deleteBarcode({ id, bearerToken: 'yourBearerToken' })).then(() => {
			window.location.reload(); // Перезагрузка страницы после удаления
		});
	};

	const columns = [
		{ Header: 'Код', accessor: 'code' },
		{ Header: 'Статус', accessor: 'used' },
		{ Header: '', accessor: 'delete' },
	];

	return (
		<div className={styles.table_container}>
			<table className={styles.barcode_table}>
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
									<td
										key={`${row.id}-${column.accessor}`}
										onClick={() =>
											column.accessor !== 'delete' &&
											handleCellClick(
												row.id,
												column.accessor,
												row[column.accessor]
											)
										}
									>
										{editMode?.id === row.id &&
										editMode.field === column.accessor ? (
											<input
												type={column.accessor === 'code' ? 'text' : 'checkbox'}
												value={
													column.accessor === 'used'
														? editedData[row.id]?.[column.accessor]
														: editedData[row.id]?.[column.accessor] ||
														  row[column.accessor]
												}
												onChange={e =>
													setEditedData(prev => ({
														...prev,
														[row.id]: {
															...prev[row.id],
															[column.accessor]: e.target.value,
														},
													}))
												}
												onBlur={() =>
													handleUpdateField(row.id, column.accessor)
												}
												onKeyPress={e => {
													if (e.key === 'Enter') {
														handleUpdateField(row.id, column.accessor);
													}
												}}
												autoFocus
											/>
										) : column.accessor === 'delete' ? (
											<button
												className={styles.delete_btn}
												onClick={() => handleDelete(row.id)}
												title='Удалить строку?'
											>
												<IoClose size={24} />
											</button>
										) : column.accessor === 'used' ? (
											<span>
												{row[column.accessor]
													? 'Используется'
													: 'Не используется'}
											</span>
										) : (
											<span>{row[column.accessor]}</span>
										)}
									</td>
								))}
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
}
