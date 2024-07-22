import React, { useState } from "react";
import styles from "./AddServiceCenterForm.module.css";

function AddServiceCenterForm({ onAdd }) {
	const [formData, setFormData] = useState({
		title: "",
		city: "",
		address: "",
		phone: "",
		servicedEquipment: "",
		latitude: "",
		longitude: "",
	});

	const [errors, setErrors] = useState({});

	const handleChange = event => {
		const { name, value } = event.target;
		setFormData(prev => ({
			...prev,
			[name]: value,
		}));
	};

	const validate = () => {
		const newErrors = {};
		if (!formData.title)
			newErrors.title = "Название сервисного центра обязательно";
		if (!formData.city) newErrors.city = "Город сервисного центра обязателен";
		if (!formData.address)
			newErrors.address = "Адрес сервисного центра обязателен";
		if (!formData.phone) {
			newErrors.phone = "Телефон сервисного центра обязателен";
		} else if (
			!/^\(\d{3}\) \d{2}-\d{2}-\d{2}$/.test(formData.phone) &&
			!/^\(\d{4}\) \d{2}-\d{2}-\d{2}$/.test(formData.phone) &&
			!/^\+7 \d{3}-\d{3}-\d{4}$/.test(formData.phone)
		) {
			newErrors.phone =
				"Телефон должен быть в формате (1234) 00-00-00 или +7 123-456-7890";
		}
		if (!formData.servicedEquipment)
			newErrors.servicedEquipment = "Обслуживаемое оборудование обязательно";
		if (formData.latitude < -90 || formData.latitude > 90) {
			newErrors.latitude = "Широта должна быть в диапазоне от -90 до 90";
		}
		if (formData.longitude < -180 || formData.longitude > 180) {
			newErrors.longitude = "Долгота должна быть в диапазоне от -180 до 180";
		}
		return newErrors;
	};

	const handleSubmit = event => {
		event.preventDefault();
		const validationErrors = validate();
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
		} else {
			onAdd(formData);
			setFormData({
				title: "",
				city: "",
				address: "",
				phone: "",
				servicedEquipment: "",
				latitude: 0,
				longitude: 0,
			});
			setErrors({});
		}
	};

	return (
		<form onSubmit={handleSubmit} className={styles.form_block}>
			<label>
				Название сервисного центра
				<input
					type='text'
					name='title'
					placeholder='ООО "Kotitonttu"'
					value={formData.title}
					onChange={handleChange}
					required
				/>
				{errors.title && <span className={styles.error}>{errors.title}</span>}
			</label>
			<label>
				Город сервисного центра
				<input
					type='text'
					name='city'
					placeholder='Москва'
					value={formData.city}
					onChange={handleChange}
					required
				/>
				{errors.city && <span className={styles.error}>{errors.city}</span>}
			</label>
			<label>
				Адрес сервисного центра
				<input
					type='text'
					name='address'
					placeholder='Москва'
					value={formData.address}
					onChange={handleChange}
					required
				/>
				{errors.address && (
					<span className={styles.error}>{errors.address}</span>
				)}
			</label>
			<label>
				Телефон сервисного центра
				<input
					type='text'
					name='phone'
					placeholder='(123) 00-00-00 или +7 123-456-7890'
					value={formData.phone}
					onChange={handleChange}
					required
				/>
				{errors.phone && <span className={styles.error}>{errors.phone}</span>}
			</label>
			<label>
				Обслуживаемое оборудование
				<input
					type='text'
					name='servicedEquipment'
					placeholder='Газовые котлы, колонки'
					value={formData.servicedEquipment}
					onChange={handleChange}
					required
				/>
				{errors.servicedEquipment && (
					<span className={styles.error}>{errors.servicedEquipment}</span>
				)}
			</label>
			<label>
				Широта (координаты на карте)
				<input
					type='number'
					name='latitude'
					value={formData.latitude}
					onChange={handleChange}
					required
				/>
				{errors.latitude && (
					<span className={styles.error}>{errors.latitude}</span>
				)}
			</label>
			<label>
				Долгота (координаты на карте)
				<input
					type='number'
					name='longitude'
					value={formData.longitude}
					onChange={handleChange}
					required
				/>
				{errors.longitude && (
					<span className={styles.error}>{errors.longitude}</span>
				)}
			</label>
			<button className={styles.form_btn} type='submit'>
				Добавить сервисный центр
			</button>
		</form>
	);
}

export default AddServiceCenterForm;
