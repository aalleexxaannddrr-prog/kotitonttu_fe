import React, { useState } from 'react';
import styles from './BarcodeTypeForm.module.css';
import { useDispatch } from 'react-redux';
import { addBarcodeType } from '../../store/slices/barcodeTypeSlice';

function BarcodeTypeForm() {
	const [points, setPoints] = useState('');
	const [type, setType] = useState('');
	const [subtype, setSubtype] = useState('');
	const dispatch = useDispatch();

	const handleSubmit = event => {
		event.preventDefault();
		dispatch(addBarcodeType({ points, type, subtype }));

		// Очищаем форму
		setPoints('');
		setType('');
		setSubtype('');

		// Обновляем страницу
		window.location.reload();
	};

	return (
		<form className={styles.form_block} onSubmit={handleSubmit}>
			<label htmlFor='points'>Балы:</label>
			<input
				type='number'
				id='points'
				value={points}
				onChange={e => setPoints(e.target.value)}
				required
			/>
			<label htmlFor='type'>Тип:</label>
			<input
				type='text'
				id='type'
				value={type}
				onChange={e => setType(e.target.value)}
				required
			/>
			<label htmlFor='subtype'>Подтип:</label>
			<input
				type='text'
				id='subtype'
				value={subtype}
				onChange={e => setSubtype(e.target.value)}
				required
			/>
			<button className={styles.form_btn} type='submit'>
				Добавить Тип Штрих-кода
			</button>
		</form>
	);
}

export default BarcodeTypeForm;
