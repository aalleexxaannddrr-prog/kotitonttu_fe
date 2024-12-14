import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './ProductPassportContainer.module.css';
import PassportAccordion from '../PassportAccordion/PassportAccordion';
import { uploadProductPassPdf } from '../../../store/slices/productPassPdfSlice';

export default function ProductPassportContainer() {
	const dispatch = useDispatch();
	const fileInputRef = useRef(null);

	// Данные из слайса
	const { status, error } = useSelector(state => state.productPassPdf);
   const bearerToken = useSelector(state => state.auth.bearerToken);

		// Если токен отсутствует
		if (!bearerToken) {
			console.error('Bearer token is missing!');
			return <div>Error: Missing authentication token.</div>;
		}

	// Функция для вызова клика по скрытому input
	const handleFileSelect = () => {
		fileInputRef.current.click();
	};

	// Обработка выбранного файла и отправка на сервер
	const handleFileChange = event => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();

			reader.onload = () => {
				const binary = reader.result.split(',')[1]; // Извлекаем бинарные данные
				dispatch(
					uploadProductPassPdf({
						bearerToken: bearerToken,
						pdf: binary,
					})
				);
			};

			reader.readAsDataURL(file);
		}
	};

	return (
		<div className='container'>
			<h2 className={styles.pass_title}>Паспорт Продукции</h2>
			{/* Скрытый input для выбора файла */}
			<input
				type='file'
				accept='application/pdf' // Ограничиваем тип файлов
				ref={fileInputRef}
				style={{ display: 'none' }}
				onChange={handleFileChange}
			/>
			{/* Кнопка для открытия проводника файлов */}
			<button className={styles.pass_btn} onClick={handleFileSelect}>
				Загрузить pdf-файл
			</button>

			{/* Сообщения о статусе загрузки */}
			{status === 'loading' && <p>Загрузка файла...</p>}
			{status === 'succeeded' && <p>Файл успешно загружен!</p>}
			{status === 'failed' && <p>Ошибка загрузки: {error}</p>}

			<PassportAccordion bearerToken={bearerToken} />
		</div>
	);
}
