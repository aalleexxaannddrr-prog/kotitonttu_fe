import React from 'react';
import BarcodeTable from '../BarcodeTable/BarcodeTable';
import { useSelector } from 'react-redux';

export default function BarcodeTableContainer() {
	 const bearerToken = useSelector(state => state.auth.bearerToken);

		// Если токен отсутствует
		if (!bearerToken) {
			console.error('Bearer token is missing!');
			return <div>Error: Missing authentication token.</div>;
		}
		
	return (
		<div className='container'>
			<BarcodeTable bearerToken={bearerToken} />
		</div>
	);
}
