import React, { useEffect, useState } from "react";
import styles from "./ServiceCentersPage.module.css";
import MapComponent from "../../components/Services/MapComponent/MapComponent ";
import { useDispatch, useSelector } from "react-redux";
import EquipmentSelector from "../../components/Services/EquipmentSelector/EquipmentSelector";
import { addServiceCentre } from "../../store/slices/serviceCreationSlice";
import AddServiceCenterForm from "../../components/Services/AddServiceCenterForm/AddServiceCenterForm";
import ModalFormForServices from "../../components/Services/ModalFormForServices/ModalFormForServices";
import { fetchServiceCentres } from "../../store/slices/servicesSlice";

export default function ServiceCentersPage() {
	const dispatch = useDispatch();
	const [filteredCenters, setFilteredCenters] = useState([]);
	const [showModal, setShowModal] = useState(false);

	const servisesCenters = useSelector(state => state.services.services);
	// console.log("Services Centers from Redux:", servisesCenters);

	useEffect(() => {
		// Инициализация при загрузке данных
		setFilteredCenters(servisesCenters);
	}, [servisesCenters]);

	useEffect(() => {
		dispatch(fetchServiceCentres());
	}, [dispatch])

	// Функция фильтрации сервисных центров
	const handleEquipmentSelect = equipment => {
		if (equipment) {
			const filtered = servisesCenters.filter(
				center => center.servicedEquipment === equipment
			);
			setFilteredCenters(filtered);
		} else {
			setFilteredCenters(servisesCenters);
		}
	};

	const handleAddCenter = newCenter => {
		dispatch(addServiceCentre(newCenter));
	};

	return (
		<div className='container'>
			<h1>Сервисные центры</h1>
			<div className={styles.service_block}>
				<EquipmentSelector
					servisesCenters={servisesCenters}
					onEquipmentSelect={handleEquipmentSelect}
				/>
				<button
					className={styles.service_page_btn}
					onClick={() => setShowModal(true)}
				>
					Добавить новый сервисный центр
				</button>
			</div>

			{showModal && (
				<ModalFormForServices
					show={showModal}
					onClose={() => setShowModal(false)}
				>
					<AddServiceCenterForm onAdd={handleAddCenter} />
				</ModalFormForServices>
			)}
			<MapComponent servisesCenters={filteredCenters} />
			{/* <ServiceDetails /> */}
		</div>
	);
}
