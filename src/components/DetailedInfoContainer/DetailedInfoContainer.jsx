import React from 'react'
import styles from './DetailedInfoContainer.module.css'
import DetailedInfoUsersContainer from '../DetailedInfoUsersContainer/DetailedInfoUsersContainer'
import ConfirmationCode from '../ConfirmationCode/ConfirmationCode';
import PhotosOfCompletedWork from '../PhotosOfCompletedWork/PhotosOfCompletedWork';

export default function DetailedInfoContainer() {
  return (
		<div className='container'>
			<DetailedInfoUsersContainer />
			<div className={styles.amount_info}>
				<PhotosOfCompletedWork />
				<ConfirmationCode />
			</div>
		</div>
	);
}
