import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBarcodeTypes } from '../../store/slices/barcodeDataSlice';
import { updateBarcodeType } from '../../store/slices/updateBarcodeTypeSlice'; // Импортируем экшен для обновления
import styles from './BarcodeTable.module.css'; // Импорт вашего CSS модуля

export default function BarcodeTable() {
	const dispatch = useDispatch();
	const { data, status, error } = useSelector(state => state.barcodeData);
	const [editMode, setEditMode] = useState(null); // ID строки, которая сейчас редактируется
	const [newPoints, setNewPoints] = useState(''); // Новое значение для очков

	useEffect(() => {
		dispatch(fetchBarcodeTypes());
	}, [dispatch]);

	// Обработчик обновления очков
	const handleUpdatePoints = (id, points, type, subtype) => {
		dispatch(updateBarcodeType({ id, points, type, subtype }))
		
		setEditMode(null); // После обновления закрываем режим редактирования

		// Перезагрузка страницы после успешного обновления
		window.location.reload();
	};

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
										{column.accessor === 'points' ? (
											editMode === row.id ? (
												// Инпут для редактирования значения "Очки"
												<input
													type='number'
													value={newPoints}
													onChange={e => setNewPoints(e.target.value)} // Обязательно передаем событие e
													onBlur={() =>
														handleUpdatePoints(
															row.id,
															newPoints,
															row.type,
															row.subtype
														)
													} // Обновление при потере фокуса
													onKeyPress={e => {
														if (e.key === 'Enter') {
															handleUpdatePoints(
																row.id,
																newPoints,
																row.type,
																row.subtype
															); // Обновление при нажатии Enter
														}
													}}
													autoFocus
												/>
											) : (
												// Двойной клик для включения режима редактирования
												<span
													onDoubleClick={() => {
														setEditMode(row.id);
														setNewPoints(row.points);
													}}
												>
													{row.points}
												</span>
											)
										) : (
											row[column.accessor]
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
