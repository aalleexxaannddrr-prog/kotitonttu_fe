import React, {useEffect, useState} from 'react';
import styles from './SparePartsContainer.module.css';
import {useDispatch, useSelector} from 'react-redux';
import SparePartsTable from '../SparePartsTable/SparePartsTable';
import SparePartsModal from '../SparePartsModal/SparePartsModal';
import AddSpareParts from '../AddSpareParts/AddSpareParts';
import {RiArrowDropDownLine, RiArrowDropUpLine} from "react-icons/ri";
import {fetchSpareParts} from "../../../store/slices/sparePartsSlice";

const generateMockPrice = (min, max) => {
	return (Math.random() * (max - min) + min).toFixed(2);
};

export default function SparePartsContainer() {
	const dispatch = useDispatch();
	const bearerToken = useSelector(state => state.auth.bearerToken);
	const [showModal, setShowModal] = useState(false);
	const [showDetails, setShowDetails] = useState(false);
	const [coefficient, setCoefficient] = useState('0.1')
	const [mockSpares, setMockSpares] = useState([]);
	const [displaySpares, setDisplaySpares] = useState([])
	const {
		data: spares,
		status,
		error,
	} = useSelector(state => state.spareParts);

	useEffect(() => {
		dispatch(fetchSpareParts({ bearerToken })).then((response) => {
			if (response.payload) {
				const generatedSpares = response.payload.map(spare => ({
					...spare,
					ascPriceRub: spare.ascPriceRub || generateMockPrice(10000, 15000),
					wholesalePriceRub: spare.wholesalePriceRub || generateMockPrice(15000, 20000),
					retailPriceRub: spare.retailPriceRub || generateMockPrice(20000, 25000),
				}));
				setMockSpares(generatedSpares); // Сохраняем исходные данные
				setDisplaySpares(generatedSpares); // Устанавливаем данные для отображения
			}
		});
	}, [dispatch, bearerToken]);


	// Если токен отсутствует
	if (!bearerToken) {
		console.error('Bearer token is missing!');
		return <div>Error: Missing authentication token.</div>;
	}

	const updatePrices = (coefficient) => {
		const floatCoefficient = parseFloat(coefficient)
		return mockSpares.map(spare => ({
			...spare,
			ascPriceRub: (spare.ascPriceRub * floatCoefficient.toFixed(2)),
			wholesalePriceRub: (spare.wholesalePriceRub * floatCoefficient.toFixed(2)),
			retailPriceRub: (spare.retailPriceRub * floatCoefficient.toFixed(2)),
		}));
	};


	const handleSubmit = (e) =>{
		e.preventDefault();
		setDisplaySpares(updatePrices(coefficient));
	}



	return (
		<>
			{showModal && (
				<SparePartsModal onClose={() => setShowModal(false)}>
					<AddSpareParts
						bearerToken={bearerToken}
						onClose={() => setShowModal(false)}
					/>
				</SparePartsModal>
			)}
			<form className={styles.form_block} onSubmit={handleSubmit}>
				<label htmlFor='coefficient'>Коэффициент:</label>
				<input
					type="range"
					min={0.1}
					max={5.0}
					step={0.01}
					value={coefficient}
					onChange={(e) => setCoefficient(parseFloat(e.target.value).toFixed(2))}
				/>
				<input
					type='number'
					id='coefficient'
					value={coefficient}
					onKeyPress={(event) => {
						const isNumber = /[0-9]/.test(event.key);
						const isComma = event.key === ',' && !coefficient.includes(',');
						const isNegative = event.key === '-' && coefficient.length === 0;
						if (!isNegative && !isNumber && !isComma){
							event.preventDefault();
						}
					}}
					onChange={e => {
						if (Number(e.target.value) <= 5) setCoefficient(e.target.value) // Проверяем, не больше ли значение чем range
					}}
					required
				/>
				<button className={styles.add_button} type='submit'>
					Обновить цены
				</button>
			</form>
			<button className={styles.add_button} onClick={() => setShowModal(true)}>
				Добавить Запчасть
			</button>
			<div>
				<h2 className={styles.title}>Список запчастей по серии</h2>
				<SparePartsTable bearerToken={bearerToken} spares={displaySpares} error={error} status={status} />


			</div>
		</>
	);
}
