import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBarcodeTypes } from '../../../store/slices/barcodeDataSlice';
import { updateBarcodeType } from '../../../store/slices/updateBarcodeTypeSlice';
import styles from './BarcodeTable.module.css';
import { deleteBarcodeType } from '../../../store/slices/deleteBarcodeTypeSlice';
import { IoClose } from 'react-icons/io5';

export default function BarcodeTable() {
	const dispatch = useDispatch();
	const { data, status, error } = useSelector(state => state.barcodeData);

	// Состояния для редактирования полей
	const [editMode, setEditMode] = useState(null);
	const [editedData, setEditedData] = useState({});
	const [originalData, setOriginalData] = useState({});

	useEffect(() => {
		dispatch(fetchBarcodeTypes());
	}, [dispatch]);

	// Обработчик обновления данных
	const handleUpdateField = (id, field) => {
		const updatedData = editedData[id][field];

		if (updatedData !== originalData[id][field]) {
			const updateData = {
				id,
				points:
					field === 'points'
						? updatedData
						: data.find(item => item.id === id).points,
				type:
					field === 'type'
						? updatedData
						: data.find(item => item.id === id).type,
				subtype:
					field === 'subtype'
						? updatedData
						: data.find(item => item.id === id).subtype,
			};

			dispatch(updateBarcodeType(updateData));
			window.location.reload();
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

	// Обработчик удаления
	const handleDelete = id => {
		dispatch(deleteBarcodeType(id));
		window.location.reload();
	};

	const columns = [
		{ Header: 'Балы', accessor: 'points' },
		{ Header: 'Тип', accessor: 'type' },
		{ Header: 'Подтип', accessor: 'subtype' },
		{ Header: '', accessor: 'delete' }, // Добавляем столбец для удаления
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
												type={column.accessor === 'points' ? 'number' : 'text'}
												value={
													editedData[row.id]?.[column.accessor] !== undefined
														? editedData[row.id][column.accessor]
														: row[column.accessor]
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
