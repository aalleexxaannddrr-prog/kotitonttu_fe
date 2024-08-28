import React from 'react';
import styles from './UserCard.module.css';

// Вспомогательная функция для форматирования потенциально пустых или неопределенных значений
const formatValue = value => {
    return value || ''; // Упрощено, возвращает пустую строку, если значение ложно
};

export default function UserTable({ users }) {
	const columns = [
		// { Header: 'Фото', accessor: 'photo' },
		{ Header: 'Имя', accessor: 'firstname' },
		{ Header: 'Фамилия', accessor: 'lastname' },
		{ Header: 'Email', accessor: 'email' },
		{ Header: 'Телефон', accessor: 'phoneNumber' },
		{ Header: 'Должность', accessor: 'workerRole' },
		{ Header: 'Дата рождения', accessor: 'dateOfBirth' },
	];

	return (
		<div className={styles.table_container}>
			<table className={styles.table}>
				<thead>
					<tr>
						{columns.map(column => (
							<th key={column.accessor}>{column.Header}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{users.map(user => (
						<tr key={user.id}>
							{columns.map(column => (
								<td key={column.accessor}>
									{column.accessor === 'photo' && user[column.accessor] ? (
										<img
											src={user[column.accessor]}
											alt={`${user.lastname}, ${user.firstname}`}
											className={styles.photo}
										/>
									) : (
										user[column.accessor]
									)}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
