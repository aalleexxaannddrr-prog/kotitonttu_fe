import React from 'react'
import styles from './ProductPassportPage.module.css'
import PassportAccordion from '../../components/PassportAccordion/PassportAccordion';

export default function ProductPassportPage() {
  return (
		<div>
			<h2 className={styles.pass_title}>Паспорт Продукции</h2>
			<button className={styles.pass_btn}>Загрузить pdf-файл</button>
			<PassportAccordion/>
		</div>
	);
}
