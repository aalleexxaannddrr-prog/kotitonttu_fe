import React, { useState } from 'react'
import styles from './ApplicationCard.module.css'
import { Link } from 'react-router-dom';

export default function ApplicationCard() {

	const [isHovered, setIsHovered] = useState(false);

   const columns = [
			{ Header: 'Имя пользователя', accessor: 'username' },
			{ Header: 'Модель', accessor: 'model' },
			{ Header: 'Стоимость', accessor: 'cost' },
			{ Header: 'Статус', accessor: 'status' },
		];
  return (
		<div>
			<div className={styles.application_card}>
				<table className={styles.table}>
					<thead>
						<tr>
							{columns.map(column => (
								<th key={column.accessor}>{column.Header}</th>
							))}
						</tr>
					</thead>
					<tbody>
						<tr>
							<td
								onMouseEnter={() => setIsHovered(true)}
								onMouseLeave={() => setIsHovered(false)}
							>
								Ivanov Ivan
								{isHovered && (
									<div className={styles.detailed_info}>
										<Link to='/detailed-info' className={styles.detailed_link}>
											Посмотреть детально
										</Link>
									</div>
								)}
							</td>
							<td>Toivo</td>
							<td>30000</td>
							<td>На рассмотрении</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
}
