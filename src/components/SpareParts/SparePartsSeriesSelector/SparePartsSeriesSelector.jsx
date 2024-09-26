import React, { useState } from 'react'
import styles from './SparePartsSeriesSelector.module.css'
import { RiArrowDropDownLine } from 'react-icons/ri';

export default function SparePartsSeriesSelector({
	seriesList,
	selectedSeries,
	setSelectedSeries,
}) {
   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

		const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

		const handleSeriesSelect = series => {
			setSelectedSeries(series);
			setIsDropdownOpen(false);
		};

	return (
		<div className={styles.series_select_block}>
			<div className={styles.series_custom_select} onClick={toggleDropdown}>
				{selectedSeries ? selectedSeries : 'Серия'}
				<RiArrowDropDownLine size={24} />
			</div>
			{isDropdownOpen && (
				<ul className={styles.series_dropdown_menu}>
					{seriesList.map((series, index) => (
						<li key={index} onClick={() => handleSeriesSelect(series)}>
							{series}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
