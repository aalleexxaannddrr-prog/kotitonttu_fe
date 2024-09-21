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
			<table className={styles.spare_table}>
				<thead>
					<tr>
						{columns.map(column => (
							<th key={column.accessor}>{column.Header}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{/* {spares.map(spare => ( */}
						<tr>
							{columns.map(column => (
								<td key={column.accessor}>
									{column.accessor === 'photo' && [column.accessor] ? (
										<img
											src={[column.accessor]}
											alt={`sparePhoto`}
											className={styles.photo}
										/>
									) : (
										[column.accessor]
									)}
								</td>
							))}
						</tr>
					{/* ))} */}
				</tbody>
			</table>
		</div>
	);
}
