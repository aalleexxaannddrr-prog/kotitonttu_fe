import React from 'react';
import BoilersList from '../BoilersList/BoilersList';
import { useSelector } from 'react-redux';

export default function BoilersContainer() {
   const bearerToken = useSelector(state => state.auth.bearerToken);

		// Если токен отсутствует
		if (!bearerToken) {
			console.error('Bearer token is missing!');
			return <div>Error: Missing authentication token.</div>;
		}

	return (
		<div>
			<h1>Список Котлов</h1>
			<BoilersList bearerToken={bearerToken} />
		</div>
	);
}
