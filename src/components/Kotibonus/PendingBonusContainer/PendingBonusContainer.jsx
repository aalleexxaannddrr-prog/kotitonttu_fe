import React from 'react';
import { useSelector } from 'react-redux';
import PendingBonusTable from '../PendingBonusTable/PendingBonusTable';

export default function PendingBonusContainer() {
	const bearerToken = useSelector(state => state.auth.bearerToken);

	// Если токен отсутствует
	if (!bearerToken) {
		console.error('Bearer token is missing!');
		return <div>Error: Missing authentication token.</div>;
	}

	return (
		<div className='container'>
			<h1>Ожидающие заявки</h1>
			<PendingBonusTable bearerToken={bearerToken} />
		</div>
	);
}
