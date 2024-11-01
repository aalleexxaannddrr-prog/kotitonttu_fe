import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import styles from './PasswordInput.module.css';

const PasswordInput = ({ value, onChange }) => {
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);

	const togglePasswordVisibility = () => {
		setIsPasswordVisible(prevVisibility => !prevVisibility);
	};

	return (
		<div className={styles.password_input_wrapper}>
			<input
				type={isPasswordVisible ? 'text' : 'password'}
				name='password'
				placeholder='Введите ваш пароль'
				value={value}
				onChange={onChange}
				required
				className={styles.password_input}
			/>
			<button
				type='button'
				onClick={togglePasswordVisibility}
				className={styles.password_toggle_btn}
				aria-label='Toggle password visibility'
			>
				{isPasswordVisible ? <FaRegEye /> : <FaRegEyeSlash />}
			</button>
		</div>
	);
};

export default PasswordInput;
