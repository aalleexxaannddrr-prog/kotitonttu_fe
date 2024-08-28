import React, { useState } from "react";
import styles from "./Series.module.css";
import { RiArrowDropDownLine } from "react-icons/ri";

// Функции обработки и форматирования данных
const formatValue = value => {
	if (value === null || value === undefined) {
		return "";
	}
	if (typeof value === "number" && value === 0) {
		return "0";
	}
	return value;
};

const getMagnitude = value => {
	return value.svalue !== "null"
		? value.svalue
		: value.dvalue !== 0.0
		? String(value.dvalue)
		: `${value.minValue}-${value.maxValue}`;
};

// Основной компонент
export default function Series({ series }) {
	const [selectedBoiler, setSelectedBoiler] = useState(null);
	const [isOpen, setIsOpen] = useState(false);

	const handleBoilerChange = boilerTitle => {
		const boiler = series.boilers.find(boiler => boiler.title === boilerTitle);
		setSelectedBoiler(boiler);
		setIsOpen(false); // Закрыть дропдаун после выбора
	};

	const toggleDropdown = () => setIsOpen(!isOpen);

	const columns = selectedBoiler
		? [
				{ Header: "Технические характеристики", accessor: "characteristic" },
				{ Header: "Единицы измерения", accessor: "unit" },
				{ Header: selectedBoiler.title, accessor: selectedBoiler.title },
		  ]
		: [];

	const rows = selectedBoiler
		? selectedBoiler.values.map(value => ({
				characteristic: value.characteristic?.title,
				unit: value.characteristic?.unit?.shortName,
				[selectedBoiler.title]: getMagnitude(value),
		  }))
		: [];

	return (
		<div>
			<h3 className={styles.series_title}>{series.title}</h3>
			<p className={styles.series_descr}>{series.description}</p>
			<div className={styles.select_block}>
				<div className={styles.custom_seelect} onClick={toggleDropdown}>
					{selectedBoiler ? selectedBoiler.title : "Выбрать модель"}
					<RiArrowDropDownLine size={24} />
				</div>

				<button className={styles.btn}>Добавить котёл</button>
			</div>

			{isOpen && (
				<ul className={styles.dropdown_menu}>
					{series.boilers.map(boiler => (
						<li
							key={boiler.title}
							onClick={() => handleBoilerChange(boiler.title)}
						>
							{boiler.title}
						</li>
					))}
				</ul>
			)}
			{selectedBoiler && (
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
							{rows.map((row, rowIndex) => (
								<tr key={rowIndex}>
									{columns.map(column => (
										<td key={column.accessor}>
											{formatValue(row[column.accessor])}
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
