import React from 'react';
import BarcodeTypeForm from '../../components/Kotibonus/BarcodeTypeForm/BarcodeTypeForm';
import BarcodeTable from '../../components/Kotibonus/BarcodeTableKotibonus/BarcodeTable';

export default function BonusProgramModelsPage() {
	return (
		<div className='container'>
			<BarcodeTypeForm />
			<BarcodeTable />
		</div>
	);
}
