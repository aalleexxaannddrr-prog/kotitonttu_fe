import React, { useEffect, useState } from 'react';
import styles from './ErrorsFilterSelectors.module.css';
import { RiArrowDropDownLine } from 'react-icons/ri'; // Иконка для дропдауна

export default function ErrorsFilterSelectors({
	data,
	selectedType,
	setSelectedType,
	selectedCategory,
	setSelectedCategory,
	selectedSeries,
	setSelectedSeries,
}) {
	const [categories, setCategories] = useState([]);
	const [seriesList, setSeriesList] = useState([]);
	const [isTypeOpen, setIsTypeOpen] = useState(false); // Для дропдауна типов
	const [isCategoryOpen, setIsCategoryOpen] = useState(false); // Для дропдауна категорий
	const [isSeriesOpen, setIsSeriesOpen] = useState(false); // Для дропдауна серий

	// Обновляем список категорий при изменении типа
	useEffect(() => {
		if (selectedType) {
			const filteredCategories = data.filter(
				item => item.categoryName === selectedType
			);
			setCategories(filteredCategories);
		} else {
			setCategories([]);
		}
	}, [selectedType, data]);

	// Обновляем список серий при изменении категории
	useEffect(() => {
		if (selectedCategory) {
			const selectedCategoryData = categories.find(
				item => item.ruCategoryName === selectedCategory
			);
			if (selectedCategoryData) {
				setSeriesList(selectedCategoryData.seriesTitleDTOS || []);
			} else {
				setSeriesList([]);
			}
		} else {
			setSeriesList([]);
		}
	}, [selectedCategory, categories]);

	// Функции для переключения дропдаунов
	const toggleTypeDropdown = () => setIsTypeOpen(!isTypeOpen);
	const toggleCategoryDropdown = () => setIsCategoryOpen(!isCategoryOpen);
	const toggleSeriesDropdown = () => setIsSeriesOpen(!isSeriesOpen);

	// Обработчики выбора
	const handleTypeSelect = type => {
		setSelectedType(type);
		setSelectedCategory(''); // Сбрасываем последующие селекторы при изменении типа
		setSelectedSeries('');
		setIsTypeOpen(false); // Закрываем дропдаун
	};

	const handleCategorySelect = category => {
		setSelectedCategory(category);
		setSelectedSeries(''); // Сбрасываем серию при изменении категории
		setIsCategoryOpen(false); // Закрываем дропдаун
	};

	const handleSeriesSelect = series => {
		setSelectedSeries(series);
		setIsSeriesOpen(false); // Закрываем дропдаун
	};

	return (
		<div className={styles.filters}>
			{/* Кастомный селектор для типа */}
			<div className={styles.errors_select_block}>
				<div
					className={styles.errors_custom_select}
					onClick={toggleTypeDropdown}
				>
					{selectedType ? selectedType : 'Выберите тип'}
					<RiArrowDropDownLine size={24} />
				</div>
				{isTypeOpen && (
					<ul className={styles.errors_dropdown_menu}>
						{data.map((item, index) => (
							<li
								key={index}
								onClick={() => handleTypeSelect(item.categoryName)}
							>
								{item.categoryName}
							</li>
						))}
					</ul>
				)}
			</div>

			{/* Кастомный селектор для категории */}
			<div className={styles.errors_select_block}>
				<div
					className={`${styles.errors_custom_select} ${
						!selectedType ? styles.disabled : ''
					}`}
					onClick={selectedType ? toggleCategoryDropdown : null}
				>
					{selectedCategory ? selectedCategory : 'Выберите название'}
					<RiArrowDropDownLine size={24} />
				</div>
				{isCategoryOpen && selectedType && (
					<ul className={styles.errors_dropdown_menu}>
						{categories.map((item, index) => (
							<li
								key={index}
								onClick={() => handleCategorySelect(item.ruCategoryName)}
							>
								{item.ruCategoryName}
							</li>
						))}
					</ul>
				)}
			</div>

			{/* Кастомный селектор для серии */}
			<div className={styles.errors_select_block}>
				<div
					className={`${styles.errors_custom_select} ${
						!selectedCategory ? styles.disabled : ''
					}`}
					onClick={selectedCategory ? toggleSeriesDropdown : null}
				>
					{selectedSeries ? selectedSeries : 'Выберите серию'}
					<RiArrowDropDownLine size={24} />
				</div>
				{isSeriesOpen && selectedCategory && (
					<ul className={styles.errors_dropdown_menu}>
						{seriesList.map((series, index) => (
							<li
								key={index}
								onClick={() => handleSeriesSelect(series.seriesTitle)}
							>
								{series.seriesTitle}
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}
