import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchErrorscode } from '../../../store/slices/errorscodeSlice';
import { IoClose } from 'react-icons/io5';
import styles from './ErrorsCodeTable.module.css';
import ErrorsFilterSelectors from '../ErrorsFilterSelectors/ErrorsFilterSelectors';

export default function ErrorsCodeTable() {
	const dispatch = useDispatch();
	const { data } = useSelector(state => state.errorscode);

	const [selectedType, setSelectedType] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('');
	const [selectedSeries, setSelectedSeries] = useState('');
	const [filteredErrors, setFilteredErrors] = useState([]);

	const [editMode, setEditMode] = useState(null); // Состояние для отслеживания редактируемой ячейки
	const [editedData, setEditedData] = useState({});
	const [originalData, setOriginalData] = useState({});

	useEffect(() => {
		dispatch(fetchErrorscode());
	}, [dispatch]);

	useEffect(() => {
		if (data) {
			const parsedData = JSON.parse(data); // Парсим данные, если это необходимо
			const filteredSeries = parsedData
				.filter(
					item =>
						(selectedType ? item.categoryName === selectedType : true) &&
						(selectedCategory ? item.ruCategoryName === selectedCategory : true)
				)
				.flatMap(item => item.seriesTitleDTOS || [])
				.filter(series =>
					selectedSeries ? series.seriesTitle === selectedSeries : true
				)
				.flatMap(series => series.errors || []);

			setFilteredErrors(filteredSeries);
		}
	}, [data, selectedType, selectedCategory, selectedSeries]);

	// Обработчик для удаления строки
	const handleDelete = code => {
		const updatedErrors = filteredErrors.filter(error => error.code !== code);
		setFilteredErrors(updatedErrors);
		// В этом месте нужно также вызвать action для удаления ошибки из состояния Redux!!!
	};

	// Обработчик обновления данных
	const handleUpdateField = (index, field) => {
		const updatedData = editedData[index][field];

		if (updatedData !== originalData[index][field]) {
			const updatedError = {
				...filteredErrors[index],
				[field]: updatedData,
			};

			const newFilteredErrors = [...filteredErrors];
			newFilteredErrors[index] = updatedError;

			setFilteredErrors(newFilteredErrors);
			// В этом месте можно также вызвать action для обновления данных в Redux
		}

		setEditMode(null);
	};

	const handleCellClick = (index, field, value) => {
		setEditMode({ index, field });

		setOriginalData(prev => ({
			...prev,
			[index]: {
				...prev[index],
				[field]: value !== undefined ? value : '',
			},
		}));

		setEditedData(prev => ({
			...prev,
			[index]: {
				...prev[index],
				[field]: value !== undefined ? value : '',
			},
		}));
	};

	// Столбцы для таблицы
	const columns = [
		{ Header: 'Номер', accessor: 'code' },
		{ Header: 'Название', accessor: 'cause' },
		{ Header: 'Описание', accessor: 'description' },
		{ Header: '', accessor: 'delete' }, // Столбец для удаления
	];

	return (
		<div className={styles.table_container}>
			{data && (
				<ErrorsFilterSelectors
					data={JSON.parse(data)}
					selectedType={selectedType}
					setSelectedType={setSelectedType}
					selectedCategory={selectedCategory}
					setSelectedCategory={setSelectedCategory}
					selectedSeries={selectedSeries}
					setSelectedSeries={setSelectedSeries}
				/>
			)}

			{/* Таблица с результатами. Отображается только если выбран тип, категория или серия */}
			{selectedType && selectedCategory && selectedSeries && (
				<table className={styles.errors_table}>
					<thead>
						<tr>
							{columns.map((column, index) => (
								<th className={styles.errors_th} key={index}>
									{column.Header}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{filteredErrors.length > 0 ? (
							filteredErrors.map((error, index) => (
								<tr key={index}>
									{columns.map(column => (
										<td
											key={`${error.code}-${column.accessor}`}
											className={styles.errors_td}
											onClick={() =>
												column.accessor !== 'delete' &&
												handleCellClick(
													index,
													column.accessor,
													error[column.accessor]
												)
											}
										>
											{editMode?.index === index &&
											editMode.field === column.accessor ? (
												<input
													type='text'
													value={
														editedData[index]?.[column.accessor] !== undefined
															? editedData[index][column.accessor]
															: error[column.accessor]
													}
													onChange={e =>
														setEditedData(prev => ({
															...prev,
															[index]: {
																...prev[index],
																[column.accessor]: e.target.value,
															},
														}))
													}
													onBlur={() =>
														handleUpdateField(index, column.accessor)
													}
													onKeyPress={e => {
														if (e.key === 'Enter') {
															handleUpdateField(index, column.accessor);
														}
													}}
													autoFocus
												/>
											) : column.accessor === 'delete' ? (
												<button
													className={styles.delete_btn}
													onClick={() => handleDelete(error.code)}
													title='Удалить строку?'
												>
													<IoClose size={20} />
												</button>
											) : (
												<span>{error[column.accessor]}</span>
											)}
										</td>
									))}
								</tr>
							))
						) : (
							<tr>
								<td className={styles.errors_td} colSpan={columns.length}>
									Ошибки не найдены
								</td>
							</tr>
						)}
					</tbody>
				</table>
			)}
		</div>
	);
}
