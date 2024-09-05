import React from 'react'
import styles from './DetailedInfoUsersContainer.module.css'
import DetailedInfoUserCard from '../DetailedInfoUserCard/DetailedInfoUserCard'

export default function DetailedInfoUsersContainer() {
  return (
		<div className={styles.card}>
			<DetailedInfoUserCard />
		</div>
	);
}
