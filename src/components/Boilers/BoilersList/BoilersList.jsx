import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBoilers } from '../../../store/slices/boilersSlice';

export default function BoilersList({ bearerToken }) {
	const dispatch = useDispatch();
	const { boilers, status, error } = useSelector(state => state.boilers);

	useEffect(() => {
		dispatch(fetchBoilers(bearerToken));
	}, [dispatch, bearerToken]);

	return (
		<div>
			{status === 'loading' && <p>Загрузка...</p>}
			{status === 'failed' && <p>Ошибка: {error}</p>}
			{status === 'succeeded' && (
				<ul>
					{boilers.map(boiler => (
						<li key={boiler.id}>
							ID: {boiler.id}, Номер: {boiler.number}, Штрих-код:{' '}
							{boiler.barcode}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
