import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBoilers } from '../../../store/slices/boilersSlice';
import styles from "./BoilersList.module.css";

export default function BoilersList({ boilers, columns }) {
	return (
		<>
			{boilers.map(boiler => (
				<tr key={boiler.id}>
					{columns.map(column => (
						<td key={column.accessor}>
							{boiler[column.accessor]}
						</td>
					))}
				</tr>
			))}
		</>
	);
}
