import React, {useEffect} from 'react';
import BoilersList from '../BoilersList/BoilersList';
import {useDispatch, useSelector} from 'react-redux';
import {fetchBoilers} from "../../../store/slices/boilersSlice";
import styles from "../BoilersList/BoilersList.module.css";

export default function BoilersContainer() {
   const bearerToken = useSelector(state => state.auth.bearerToken);
   const { boilers, status, error } = useSelector(state => state.boilers);
   const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchBoilers(bearerToken));
	}, [dispatch, bearerToken]);

	const columns = [
		{ Header: 'ID', accessor: 'id' },
		{ Header: 'Номер', accessor: 'number' },
		{ Header: 'Штрих-код', accessor: 'barcode' }
	];

	// Если токен отсутствует
	if (!bearerToken) {
		console.error('Bearer token is missing!');
		return <div>Error: Missing authentication token.</div>;
	}

	return (
		<div className='container'>
			<div>
				<h2>Характеристики продукции</h2>

				<div className={styles.table_container}>
					<table className={styles.boiler_table}>
						<thead>
						<tr>
							{columns.map(column => (
								<th key={column.accessor}>{column.Header}</th>
							))}
						</tr>
						</thead>
							<tbody>
								{status === 'loading' &&
									<tr>
										<td colSpan={columns.length}>Загрузка...</td>
									</tr>
								}
								{status === 'error' &&
									<tr>
										<td colSpan={columns.length}>Ошибка: {error}</td>
									</tr>
								}
								{status === 'succeeded' && boilers.length === 0 &&
									<tr>
										<td colSpan={columns.length}>Продукция отсутствует</td>
									</tr>
								}
								{status === 'succeeded' &&
									<BoilersList boilers={boilers} columns={columns} />
								}
							</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
