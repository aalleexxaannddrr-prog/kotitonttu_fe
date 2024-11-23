import React, { useRef } from 'react';
import styles from './ProductPassportPage.module.css';
import PassportAccordion from '../../components/Passports/PassportAccordion/PassportAccordion';

export default function ProductPassportPage() {
	// Используем useRef для доступа к элементу input
	const fileInputRef = useRef(null);

	// Функция для вызова клика по скрытому input
	const handleFileSelect = () => {
		fileInputRef.current.click();
	};

	// Обработка выбранного файла
	const handleFileChange = event => {
		const file = event.target.files[0];
		if (file) {
			console.log('Выбранный файл:', file.name);
			// Здесь можно добавить дальнейшую обработку файла
		}
	};

	return (
		<div className='container'>
			<h2 className={styles.pass_title}>Паспорт Продукции</h2>
			{/* Скрытый input для выбора файла */}
			<input
				type='file'
				ref={fileInputRef}
				style={{ display: 'none' }}
				onChange={handleFileChange}
			/>
			{/* Кнопка для открытия проводника файлов */}
			<button className={styles.pass_btn} onClick={handleFileSelect}>
				Загрузить pdf-файл
			</button>
			<PassportAccordion />
		</div>
	);
}
