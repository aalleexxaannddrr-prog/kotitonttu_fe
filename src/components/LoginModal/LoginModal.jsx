import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './LoginModal.module.css';
import { IoClose } from 'react-icons/io5';
import { loginUser } from '../../store/slices/authSlice';
import PasswordInput from '../PasswordInput/PasswordInput';

const LoginModal = ({ closeModal }) => {
	const dispatch = useDispatch();
	const { user, isAuthenticated, status } = useSelector(state => state.auth);
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});
	const [error, setError] = useState(null);

	const handleChange = event => {
		const { name, value } = event.target;
		setFormData(prevState => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSubmit = event => {
		event.preventDefault();
		setError(null); // Очистка ошибок перед попыткой логина
		dispatch(
			loginUser({
				email: formData.email,
				password: formData.password,
			})
		)
			.unwrap()
			.then(() => {
				// console.log('Login succeeded');
				setFormData({ email: '', password: '' });
				closeModal();
			})
			.catch(error => {
				console.error('Login error:', error);
				setError('Ошибка авторизации. Пожалуйста, проверьте ваши данные.');
			});
	};

	return (
		<div className={styles.overlay}>
			<div className={styles.modal_content}>
				<button className={styles.close_btn} onClick={closeModal}>
					<IoClose size={24} />
				</button>
				{!isAuthenticated ? (
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
						</label>
						<label>
							Пароль
							<PasswordInput
								value={formData.password}
								onChange={handleChange}
							/>
						</label>
						<button className={styles.form_btn} type='submit'>
							Войти
						</button>
						{status === 'loading' && <p>Загрузка...</p>}
						{error && <span className={styles.error}>{error}</span>}
					</form>
				) : (
					<div>
						<p>Добро пожаловать, {user?.firstname || 'Гость'}!</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default LoginModal;
