import React from 'react';
import SparePartsForm from '../../components/SparePartsForm/SparePartsForm';
import SparePartsTable from '../../components/SparePartsTable/SparePartsTable';

export default function SparePartsPage() {
	return (
		<div className='container'>
			<SparePartsForm />

      <h2>Список запчастей по серии</h2>
			<SparePartsTable />
		</div>
	);
}
