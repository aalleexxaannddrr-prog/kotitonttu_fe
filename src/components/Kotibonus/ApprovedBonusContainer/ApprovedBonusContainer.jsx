import React from 'react'
import { useSelector } from 'react-redux';
import ApprovedBonusTable from '../ApprovedBonusTable/ApprovedBonusTable'



export default function ApprovedBonusContainer() {
  const bearerToken = useSelector(state => state.auth.bearerToken);

	// Если токен отсутствует
	if (!bearerToken) {
		console.error('Bearer token is missing!');
		return <div>Error: Missing authentication token.</div>;
	}

  return (
		<div className='container'>
			<h1>Принятые заявки</h1>
			<ApprovedBonusTable bearerToken={bearerToken} />
			
		</div>
	);
}
