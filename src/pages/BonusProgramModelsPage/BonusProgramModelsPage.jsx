import React from 'react';
import EditBarcodeForm from '../../components/EditBarcodeForm/EditBarcodeForm';
import BarcodeTypeForm from '../../components/BarcodeTypeForm/BarcodeTypeForm';
import BarcodeTable from '../../components/BarcodeTableKotibonus/BarcodeTable';

export default function BonusProgramModelsPage() {
	return (
		<div className='container'>
			<BarcodeTypeForm />
			{/* <EditBarcodeForm /> */}
			<BarcodeTable/>
		</div>
	);
}
