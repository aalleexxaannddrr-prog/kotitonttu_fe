import React, { useState } from "react";
import styles from "./EquipmentSelector.module.css";

export default function EquipmentSelector({
	servisesCenters,
	onEquipmentSelect,
}) {
	const [selectedEquipment, setSelectedEquipment] = useState("");

	// Извлекаем уникальные категории оборудования
	const equipmentOptions = Array.from(
		new Set(servisesCenters.map(item => item.servicedEquipment))
	);

	// Обработчик изменения выбранного оборудования
	const handleChange = event => {
		setSelectedEquipment(event.target.value);
		onEquipmentSelect(event.target.value);
	};

	const handleSubmit = event => {
		event.preventDefault(); // Предотвращение обновления страницы
	};

	return (
		<form className={styles.form_select} onSubmit={handleSubmit}>
			<select
				className={styles.select_css}
				value={selectedEquipment}
				onChange={handleChange}
			>
				<option value=''>Все сервисные центры</option>

				{equipmentOptions.map((equipment, index) => (
					<option key={index} value={equipment}>
						{equipment}
					</option>
				))}
			</select>
			<button type='submit' className={styles.btn}>
				Search
			</button>
		</form>
	);
}
