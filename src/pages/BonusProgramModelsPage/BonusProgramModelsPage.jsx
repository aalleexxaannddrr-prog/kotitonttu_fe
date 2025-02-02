import React from 'react';
import BarcodeTypeForm from '../../components/Kotibonus/BarcodeType/BarcodeTypeForm/BarcodeTypeForm';
import BarcodeTypeTableKotibonus from '../../components/Kotibonus/BarcodeType/BarcodeTypeTableKotibonus/BarcodeTypeTableKotibonus';

export default function BonusProgramModelsPage() {
	return (
		<div className='container'>
			<BarcodeTypeForm />
			<BarcodeTypeTableKotibonus/>
		</div>
	);
}
