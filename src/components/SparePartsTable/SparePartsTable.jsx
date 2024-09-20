import React from 'react'
import styles from './SparePartsTable.module.css'

export default function SparePartsTable() {
//   const dispatch = useDispatch();
	// const { data, status, error } = useSelector(state => state.barcodeData);

	// Состояния для редактирования полей
	// const [editMode, setEditMode] = useState(null);
	// const [editedData, setEditedData] = useState({});
	// const [originalData, setOriginalData] = useState({});

	// useEffect(() => {
	// 	dispatch(fetchBarcodeTypes());
	// }, [dispatch]);

	const columns = [
		{ Header: 'Артикул', accessor: 'articleNumber' },
		{ Header: 'Название', accessor: 'spareName' },
		{ Header: 'Фотография', accessor: 'photo' },
		{ Header: 'Серия', accessor: 'series' }, 
	];

	return (
		<div className={styles.table_container}>
			<table className={styles.user_table}>
				<thead>
					<tr>
						{columns.map(column => (
							<th key={column.accessor}>{column.Header}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{/* {spares.map(spare => (
						<tr key={spare.id}>
							{columns.map(column => (
								<td key={column.accessor}>
									{column.accessor === 'photo' && spare[column.accessor] ? (
										<img
											src={spare[column.accessor]}
											alt={`${spare.lastname}, ${spare.firstname}`}
											className={styles.photo}
										/>
									) : (
										user[column.accessor]
									)}
								</td>
							))}
						</tr>
					))} */}
				</tbody>
			</table>
		</div>
	);
}
