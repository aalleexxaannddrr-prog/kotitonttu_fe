import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';// Таблица для отображения данных
import { fetchPendingPassVerificationData } from '../../../../store/slices/pendingPassVerificationSlice';
import PendingVerificationTable from '../PendingVerificationTable/PendingVerificationTable';

export default function PendingVerificationContainer() {
	const dispatch = useDispatch();
	const { data, status, error } = useSelector(
		state => state.pendingPassVerificationData
	);

	useEffect(() => {
		dispatch(fetchPendingPassVerificationData()); // Запускаем запрос при загрузке компонента
	}, [dispatch]);

	if (status === 'loading') {
		return <div>Загрузка...</div>;
	}

	if (status === 'error') {
		return <div>Ошибка: {error}</div>;
	}

	return (
		<div className='container'>
			<h1>Верификация документов (ожидание)</h1>
			{data.length > 0 ? (
				<PendingVerificationTable data={data} />
			) : (
				<div>Нет данных для отображения</div>
			)}
		</div>
	);
}
