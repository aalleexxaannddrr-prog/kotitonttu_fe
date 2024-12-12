import React from 'react';
import BarcodeTypeForm from '../../components/Kotibonus/BarcodeTypeForm/BarcodeTypeForm';
import BarcodeTypeTableKotibonus from '../../components/Kotibonus/BarcodeTypeTableKotibonus/BarcodeTypeTableKotibonus';

export default function BonusProgramModelsPage() {
	return (
		<div className='container'>
			<BarcodeTypeForm />
			<BarcodeTypeTableKotibonus/>
		</div>
	);
}
