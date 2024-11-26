import React from 'react'
import styles from './ClientPassportPage.module.css'
import UsersPass from '../../components/Passports/UsersPass/UsersPass';

export default function ClientPassportPage() {
  return (
		<div className='container'>
			<h2 className={styles.title}>Паспорт Клиента</h2>
			<UsersPass/>
		</div>
	);
}
