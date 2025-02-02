import React from 'react';
import BarcodeTable from '../BarcodeTable/BarcodeTable';
import { useSelector } from 'react-redux';
import BarcodeForm from "../BarcodeForm/BarcodeForm";

export default function BarcodeTableContainer() {
	 const bearerToken = useSelector(state => state.auth.bearerToken);

		// Если токен отсутствует
		if (!bearerToken) {
			console.error('Bearer token is missing!');
			return <div>Error: Missing authentication token.</div>;
		}
		
	return (
		<div className='container'>
			<BarcodeForm/>
			<BarcodeTable bearerToken={bearerToken} />
		</div>
	);
}
