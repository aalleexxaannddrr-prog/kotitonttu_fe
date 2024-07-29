import React, { useState } from "react";
import styles from "./LoginModal.module.css";
import { IoClose } from "react-icons/io5";

const LoginModal = ({ closeModal }) => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [errors, setErrors] = useState({});

	const handleChange = event => {
		const { name, value } = event.target;
		setFormData(prevState => ({
			...prevState,
			[name]: value,
		}));
	};

	const validate = () => {
		const newErrors = {};
		if (!formData.email) {
			newErrors.email = "Email обязателен";
		} else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
			newErrors.email = "Неверный формат email";
		}
		if (!formData.password) {
			newErrors.password = "Пароль обязателен";
		} else if (formData.password.length < 8) {
			newErrors.password = "Пароль должен содержать минимум 8 символов";
		}
		return newErrors;
	};

	const handleSubmit = event => {
		event.preventDefault();
		const validationErrors = validate();
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
		} else {
			console.log("Submitting", formData);
			// Здесь можно добавить логику отправки данных на сервер
			setFormData({
				email: "",
				password: "",
			});
			setErrors({});
			closeModal(); // закрыть модальное окно после успешной отправки
		}
	};

	return (
		<div className={styles.overlay}>
			<div className={styles.modal_content}>
				<button className={styles.close_btn} onClick={closeModal}>
					<IoClose size={24} />
				</button>
				<form onSubmit={handleSubmit} className={styles.form_block}>
					<label>
						Email
						<input
							type='email'
							name='email'
							placeholder='Введите ваш email'
							value={formData.email}
							onChange={handleChange}
							required
						/>
						{errors.email && (
							<span className={styles.error}>{errors.email}</span>
						)}
					</label>
					<label>
						Пароль
						<input
							type='password'
							name='password'
							placeholder='Введите ваш пароль'
							value={formData.password}
							onChange={handleChange}
							required
						/>
						{errors.password && (
							<span className={styles.error}>{errors.password}</span>
						)}
					</label>
					<button className={styles.form_btn} type='submit'>
						Войти
					</button>
				</form>
			</div>
		</div>
	);
};

export default LoginModal;
