import React from 'react'
import styles from './DetailedInfoUserCard.module.css'

export default function DetailedInfoUserCard() {
  return (
		<div>
			<div className={styles.user_content}>
				<img
					className={styles.image}
					src='https://st3.depositphotos.com/3811801/18613/i/450/depositphotos_186133820-stock-photo-bearded-man-on-a-gray.jpg'
					alt='Ivanov Ivan'
				/>
				<div>
					<h3>Ivanov Ivan</h3>
					<p>Дальнейшая информация о пользователе...</p>
				</div>
			</div>
		</div>
	);
}
