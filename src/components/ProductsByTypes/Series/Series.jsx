import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

// Стили для таблицы
const useStyles = makeStyles({
	table: {
		minWidth: 650,
	},
});

const formatValue = value => {
	if (value === null || value === undefined) {
		return ""; // возвращаем пустую строку для null или undefined
	}
	if (typeof value === "number" && value === 0) {
		return "0"; // специально обрабатываем случай, когда значение 0
	}
	return value;
};

export default function Series({ series }) {
	const classes = useStyles();

	// console.log("Series boilers:", series.boilers);

	// Перебираем все бойлеры и их значения для логирования
	series.boilers.forEach(boiler => {
		boiler.values.forEach(value => {
			// Логируем заголовок характеристики
			// console.log("Value characteristic title:", value.characteristic?.title);
			// Логируем значение характеристики
			// console.log("dvalue:", value.dvalue);
		});
	});

	const columns = [
		{ Header: "Технические характеристики", accessor: "characteristic" }, // Заголовок и аксессор для характеристики
		{ Header: "Единицы измерения", accessor: "unit" }, // Заголовок и аксессор для единицы измерения
		...series.boilers.map(boiler => ({
			Header: boiler.title, // Заголовок для каждого бойлера
			accessor: boiler.title, // Аксессор для каждого бойлера
		})),
	];

	// Создаем карту характеристик для удаления дубликатов
	const characteristicsMap = new Map();
	series.boilers.forEach(boiler => {
		boiler.values.forEach(value => {
			const key = value.characteristic?.title; // Ключ - заголовок характеристики
			// Если ключ существует и не добавлен в карту
			if (key && !characteristicsMap.has(key)) {
				characteristicsMap.set(key, {
					characteristic: value.characteristic?.title, // Добавляем заголовок характеристики
					unit: value.characteristic?.unit?.shortName, // Добавляем единицу измерения
				});
			}
		});
	});

	// Преобразуем карту в массив
	const characteristics = Array.from(characteristicsMap.values());

	// console.log("Characteristics:", characteristics);

	const rows = characteristics.map(charac => ({
		characteristic: charac.characteristic, // Устанавливаем характеристику
		unit: charac.unit, // Устанавливаем единицу измерения
		...series.boilers.reduce((acc, boiler) => {
			const value = boiler.values.find(
				val => val.characteristic?.title === charac.characteristic // Находим значение для данной характеристики
			);

			if (value) {
				if (value.minValue !== null && value.maxValue !== null) {
					acc[boiler.title] = formatValue(
						`${value.minValue}${value.maxValue ? "/" + value.maxValue : ""}`
					);
				} else if (value.svalue) {
					acc[boiler.title] = formatValue(value.svalue);
				} else if (value.dvalue !== null && value.dvalue !== undefined) {
					acc[boiler.title] = formatValue(value.dvalue);
				} else {
					acc[boiler.title] = ""; // Пустая строка для значений, которые равны null или undefined
				}
			} else {
				acc[boiler.title] = ""; // Пустая строка для значений, которые равны null или undefined
			}

			return acc; // Возвращаем накопленный объект
		}, {}),
	}));

	// console.log("Rows:", rows);

	return (
		<div>
			<h3>{series.title}</h3>
			<p>{series.description}</p>
			<TableContainer component={Paper}>
				<Table
					className={classes.table}
					size='small'
					aria-label='a dense table'
				>
					<TableHead>
						<TableRow>
							{columns.map(column => (
								<TableCell key={column.accessor}>{column.Header}</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{rows.map((row, rowIndex) => (
							<TableRow key={rowIndex}>
								{columns.map(column => (
									<TableCell key={column.accessor}>
										{formatValue(row[column.accessor])}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
}
