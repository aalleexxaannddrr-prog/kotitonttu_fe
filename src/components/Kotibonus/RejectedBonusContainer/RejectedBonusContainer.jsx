import React from 'react'
import { useSelector } from 'react-redux';
import RejectedBonusTable from '../RejectedBonusTable/RejectedBonusTable'

export default function RejectedBonusContainer() {
  const bearerToken = useSelector(state => state.auth.bearerToken);

	// Если токен отсутствует
	if (!bearerToken) {
		console.error('Bearer token is missing!');
		return <div>Error: Missing authentication token.</div>;
	}
  return (
		<div className='container'>
			<RejectedBonusTable bearerToken={bearerToken} />
		</div>
	);
}
