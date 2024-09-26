import React from 'react'
import styles from './ConfirmationCode.module.css'

export default function ConfirmationCode() {
  return (
		<div className={styles.confirmation_card}>
			<div className={styles.descr_info}>
				<div className={styles.amount}>
					<h4 className={styles.descr_title}>Код</h4>
					<p className={styles.descr}>???</p>
				</div>
				<div>
					<h4 className={styles.descr_title}>Сумма бонусов</h4>
					<p className={styles.descr}>???</p>
				</div>
			</div>
			<div className={styles.btn_card}>
				<button className={styles.btn}>Подтвердить</button>
				<button className={styles.btn}>Отклонить</button>
			</div>
		</div>
	);
}
