import React from 'react'
import styles from './MainContent.module.css'

export default function MainContent() {
  return (
		<div className={styles.wrapper}>
			<div className={styles.main_content}>
				<div className={styles.main_title_block}>
					<h3 className={styles.main_brand}>Kotitonttu</h3>
					<h1 className={styles.main_title}>
						Тепло и горячая вода - <span>моя забота</span>
					</h1>
					<p className={styles.main_text}>
						Продажа сертифицированного газового оборудования - основная
						специализация нашего интернет-магазина. Мы доставим ваш заказ
						бесплатно в любой город РФ осуществим подробную консультацию по
						товарам и поможем с выбором.
					</p>
				</div>
			</div>
		</div>
	);
}
