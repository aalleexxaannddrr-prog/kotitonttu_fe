import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpareParts } from '../../../store/slices/sparePartsSlice';
import { updateSparePartById } from '../../../store/slices/updateSparePartSlice';
import styles from './SparePartsTable.module.css';

const generateMockPrice = (min, max) => {
	return (Math.random() * (max - min) + min).toFixed(2);
};

const SparePartsTable = React.memo(({bearerToken, spares, status, error }) => {
	const dispatch = useDispatch();

	const [editMode, setEditMode] = useState(null);
	const [editedData, setEditedData] = useState({});



	const handleUpdateField = (id, field) => {
		const updatedValue = editedData[field];
		if (updatedValue !== undefined) {
			const updatedDto = {
				...spares.find(spare => spare.id === id),
				[field]: updatedValue,
			};

			dispatch(
				updateSparePartById({
					id,
					dto: updatedDto,
					image: null,
					bearerToken,
				})
			).then(() => {
				dispatch(fetchSpareParts({ bearerToken }));
			});
		}
		setEditMode(null);
		setEditedData({});
	};

	const handleCellClick = (id, field, value) => {
		setEditMode({ id, field });
		setEditedData({ [field]: value });
	};

	const columns = [
		{ Header: 'Артикул', accessor: 'articleNumber' },
		{ Header: 'Название', accessor: 'name' },
		/*{ Header: 'ASC Цена (Юань)', accessor: 'ascPriceYuan' },
		{ Header: 'Оптовая Цена (Юань)', accessor: 'wholesalePriceYuan' },
		{ Header: 'Розничная Цена (Юань)', accessor: 'retailPriceYuan' },*/
		{ Header: 'ASC Цена', accessor: 'ascPriceRub', isPrice: true },
		{ Header: 'Оптовая Цена', accessor: 'wholesalePriceRub', isPrice: true },
		{ Header: 'Розничная Цена', accessor: 'retailPriceRub', isPrice: true },
	];

	return (
		<div className={styles.table_container}>
			<table className={styles.spare_table}>
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
					{status === 'succeeded' &&
						spares.map(spare => (
							<tr key={spare.id}>
								{columns.map(column => (
									<td
										key={column.accessor}
										onClick={() =>
											column.accessor !== 'id' &&
											handleCellClick(
												spare.id,
												column.accessor,
												spare[column.accessor]
											)
										}
									>
										{editMode?.id === spare.id &&
										editMode.field === column.accessor ? (
											<input
												type={
													typeof spare[column.accessor] === 'number'
														? 'number'
														: 'text'
												}
												value={editedData[column.accessor] || ''}
												onChange={e =>
													setEditedData({
														[column.accessor]: e.target.value,
													})
												}
												onBlur={() =>
													handleUpdateField(spare.id, column.accessor)
												}
												onKeyPress={e => {
													if (e.key === 'Enter') {
														handleUpdateField(spare.id, column.accessor);
													}
												}}
												autoFocus
											/>
										) : (
											column.isPrice && typeof spare[column.accessor] === 'number'
												? parseFloat(spare[column.accessor]).toFixed(2)
												: spare[column.accessor] || '—'
										)}
									</td>
								))}
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
})
export default SparePartsTable;
