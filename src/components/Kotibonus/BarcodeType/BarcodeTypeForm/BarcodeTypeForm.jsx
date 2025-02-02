import React, { useState } from 'react';
import styles from './BarcodeTypeForm.module.css';
import { useDispatch } from 'react-redux';
import { addBarcodeType } from '../../../../store/slices/addBarcodeTypeSlice';

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
			<label htmlFor='points'>Баллы:</label>
			<input
				type='number'
				id='points'
				value={points}
				onKeyPress={(event) => {
					if (!/[0-9]/.test(event.key)){
						event.preventDefault();
					}
				}}
				onChange={e => {
					if (Number(e.target.value) < 2_147_483_648) setPoints(e.target.value) // Проверяем, не больше ли значение чем int 32
				}}
				required
			/>
			<label htmlFor='type'>Тип:</label>
			<input
				type='text'
				id='type'
				value={type}
				onChange={e => {
					if (e.target.value.length < 256) setType(e.target.value) // Проверяем, не больше ли длина строки максимально возможного значения
				}}
				required
			/>
			<label htmlFor='subtype'>Подтип:</label>
			<input
				type='text'
				id='subtype'
				value={subtype}
				onChange={e => {
					if (e.target.value.length < 256) setSubtype(e.target.value) // Проверяем, не больше ли длина строки максимально возможного значения
				}}
				required
			/>
			<button className={styles.form_btn} type='submit'>
				Добавить Тип Штрих-кода
			</button>
		</form>
	);
}

export default BarcodeTypeForm;
