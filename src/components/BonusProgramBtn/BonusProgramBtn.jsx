import React from 'react';
import styles from './BonusProgramBtn.module.css'

const BonusProgramBtn = ({
	onAddBarcodeClick,
	onAddBarcodeTypeClick,
	onEditClick,
}) => {
	return (
		<div className='container'>
			<div className={styles.btn_content}>
				<button className={styles.btn} onClick={onAddBarcodeClick}>
					Добавить Штрих-код
				</button>
				<button className={styles.btn} onClick={onAddBarcodeTypeClick}>
					Добавить Тип Штрих-кода
				</button>
				<button className={styles.btn} onClick={onEditClick}>
					Редактировать
				</button>
			</div>
		</div>
	);
};

export default BonusProgramBtn;
