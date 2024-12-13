import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addSparePart } from '../../../store/slices/addSparePartSlice';
import styles from './AddSpareParts.module.css';

const AddSpareParts = ({ bearerToken, onClose }) => {
	const [articleNumber, setArticleNumber] = useState('');
	const [name, setName] = useState('');
	const [ascPriceYuan, setAscPriceYuan] = useState('');
	const [wholesalePriceYuan, setWholesalePriceYuan] = useState('');
	const [retailPriceYuan, setRetailPriceYuan] = useState('');
	const [ascPriceRub, setAscPriceRub] = useState('');
	const [wholesalePriceRub, setWholesalePriceRub] = useState('');
	const [retailPriceRub, setRetailPriceRub] = useState('');
	const [explosionDiagramId, setExplosionDiagramId] = useState('');
	const [image, setImage] = useState(null);

	const dispatch = useDispatch();

	const handleSubmit = async event => {
		event.preventDefault();

		const dto = {
			articleNumber,
			name,
			ascPriceYuan: parseFloat(ascPriceYuan),
			wholesalePriceYuan: parseFloat(wholesalePriceYuan),
			retailPriceYuan: parseFloat(retailPriceYuan),
			ascPriceRub: parseFloat(ascPriceRub),
			wholesalePriceRub: parseFloat(wholesalePriceRub),
			retailPriceRub: parseFloat(retailPriceRub),
			explosionDiagramId: explosionDiagramId
				? parseInt(explosionDiagramId, 10)
				: null,
		};

		try {
			await dispatch(addSparePart({ dto, image, bearerToken })).unwrap();
			onClose(); // Закрыть модальное окно после успешного добавления
		} catch (error) {
			console.error('Error adding spare part:', error);
		}
	};

	return (
		<form className={styles.form} onSubmit={handleSubmit}>
			<label htmlFor='articleNumber'>Артикул:</label>
			<input
				type='text'
				id='articleNumber'
				value={articleNumber}
				onChange={e => setArticleNumber(e.target.value)}
				required
			/>

			<label htmlFor='name'>Название:</label>
			<input
				type='text'
				id='name'
				value={name}
				onChange={e => setName(e.target.value)}
				required
			/>

			<label htmlFor='ascPriceYuan'>ASC Цена (Юань):</label>
			<input
				type='number'
				id='ascPriceYuan'
				value={ascPriceYuan}
				onChange={e => setAscPriceYuan(e.target.value)}
				required
			/>

			<label htmlFor='wholesalePriceYuan'>Оптовая Цена (Юань):</label>
			<input
				type='number'
				id='wholesalePriceYuan'
				value={wholesalePriceYuan}
				onChange={e => setWholesalePriceYuan(e.target.value)}
				required
			/>

			<label htmlFor='retailPriceYuan'>Розничная Цена (Юань):</label>
			<input
				type='number'
				id='retailPriceYuan'
				value={retailPriceYuan}
				onChange={e => setRetailPriceYuan(e.target.value)}
				required
			/>

			<label htmlFor='ascPriceRub'>ASC Цена (Руб):</label>
			<input
				type='number'
				id='ascPriceRub'
				value={ascPriceRub}
				onChange={e => setAscPriceRub(e.target.value)}
				required
			/>

			<label htmlFor='wholesalePriceRub'>Оптовая Цена (Руб):</label>
			<input
				type='number'
				id='wholesalePriceRub'
				value={wholesalePriceRub}
				onChange={e => setWholesalePriceRub(e.target.value)}
				required
			/>

			<label htmlFor='retailPriceRub'>Розничная Цена (Руб):</label>
			<input
				type='number'
				id='retailPriceRub'
				value={retailPriceRub}
				onChange={e => setRetailPriceRub(e.target.value)}
				required
			/>

			<label htmlFor='explosionDiagramId'>ID Схемы:</label>
			<input
				type='text'
				id='explosionDiagramId'
				value={explosionDiagramId}
				onChange={e => setExplosionDiagramId(e.target.value)}
			/>

			<label htmlFor='image'>Фотография:</label>
			<input
				type='file'
				id='image'
				onChange={e => setImage(e.target.files[0])}
			/>

			<button className={styles.form_btn} type='submit'>
				Добавить Запчасть
			</button>
		</form>
	);
};

export default AddSpareParts;
