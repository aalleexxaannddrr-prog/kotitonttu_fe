import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchErrorscode } from '../../store/slices/errorscodeSlice';
import styles from './ErrorsCodeTable.module.css';
import ErrorsFilterSelectors from '../ErrorsFilterSelectors/ErrorsFilterSelectors';

export default function ErrorsCodeTable() {
	const dispatch = useDispatch();
	const { data } = useSelector(state => state.errorscode);

	const [selectedType, setSelectedType] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('');
	const [selectedSeries, setSelectedSeries] = useState('');
	const [filteredErrors, setFilteredErrors] = useState([]);

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

	// Столбцы для таблицы
	const columns = [
		{ Header: 'Номер', accessor: 'code' },
		{ Header: 'Название', accessor: 'cause' },
		{ Header: 'Описание', accessor: 'description' },
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
									<td className={styles.errors_td}>{error.code}</td>
									<td className={styles.errors_td}>{error.cause}</td>
									<td className={styles.errors_td}>{error.description}</td>
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
