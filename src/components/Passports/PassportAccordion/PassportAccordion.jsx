import React, { useEffect, useState } from 'react';
import styles from './PassportAccordion.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBoilerSeriesPassports } from '../../../store/slices/boilerSeriesPassportsSlice';
import { IoMdArrowDropdown } from 'react-icons/io';
import { IoMdArrowDropup } from 'react-icons/io';


const PassportAccordion = () => {
	const dispatch = useDispatch();
	const { data, loading, error } = useSelector(state => state.errorscode);
	const [activeCategory, setActiveCategory] = useState(null);
	const [activeTitle, setActiveTitle] = useState(null);

	useEffect(() => {
		dispatch(fetchBoilerSeriesPassports());
	}, [dispatch]);

	const toggleCategory = index => {
		setActiveCategory(activeCategory === index ? null : index);
		setActiveTitle(null); // Сбрасываем активное состояние внутреннего аккордеона при переключении категории
	};

	const toggleTitle = index => {
		setActiveTitle(activeTitle === index ? null : index);
	};

	if (loading) return <div>Загрузка...</div>;
	if (error) return <div>Ошибка: {error}</div>;
	if (!data) return null;

	let parsedData;
	try {
		parsedData = JSON.parse(data);
	} catch (e) {
		console.error('Ошибка парсинга данных:', e);
		return <div>Ошибка обработки данных</div>;
	}

	return (
		<div className={styles.accordion}>
			{parsedData.map((category, index) => (
				<div className={styles.accordion_item} key={index}>
					<div
						className={`${styles.accordion_header} ${
							activeCategory === index ? styles.active : ''
						}`}
						onClick={() => toggleCategory(index)}
					>
						<div>
							<h3>{category.categoryName}</h3>
							<p className={styles.accordion_description}>
								{category.ruCategoryName}
							</p>
						</div>
						{activeCategory === index ? (
							<IoMdArrowDropup
								size={28}
								className={`${styles.accordion_icon} ${
									activeCategory === index ? styles.active : ''
								}`}
							/>
						) : (
							<IoMdArrowDropdown size={28} className={styles.accordion_icon} />
						)}
					</div>
					{activeCategory === index && (
						<div className={styles.accordion_body}>
							{category.titles.map((title, titleIndex) => (
								<div className={styles.accordion_sub_item} key={titleIndex}>
									<div
										className={`${styles.accordion_sub_header} ${
											activeTitle === titleIndex ? styles.active : ''
										}`}
										onClick={() => toggleTitle(titleIndex)}
									>
										<div>
											<h3>{title.titleName}</h3>
											<p className={styles.accordion_description}>
												{title.ruTitleName}
											</p>
										</div>
										{activeTitle === titleIndex ? (
											<IoMdArrowDropup
												size={28}
												className={`${styles.accordion_icon} ${
													activeCategory === index ? styles.active : ''
												}`}
											/>
										) : (
											<IoMdArrowDropdown
												size={28}
												className={styles.accordion_icon}
											/>
										)}
									</div>
									{activeTitle === titleIndex && (
										<div className={styles.accordion_sub_body}>
											<ul>
												{/* Обрабатываем одиночное поле file */}
												{title.file && (
													<li key={title.file}>
														<a
															href={title.file}
															target='_blank'
															rel='noopener noreferrer'
														>
															{title.file.split('/').pop()}{' '}
															{/* Отображаем имя файла */}
														</a>
													</li>
												)}
											</ul>
										</div>
									)}
								</div>
							))}
						</div>
					)}
				</div>
			))}
		</div>
	);
};

export default PassportAccordion;
