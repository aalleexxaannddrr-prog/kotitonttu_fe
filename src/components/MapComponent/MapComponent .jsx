import React from "react";
import styles from './MapComponent.module.css'
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "../../assets/icons/marker.svg";

const MapComponent = ({ servisesCenters }) => {
	const position = [55.751244, 37.618423];
	// console.log(servisesCenters);

	const RemoveAttribution = () => {
		const map = useMap();
		React.useEffect(() => {
			map.removeControl(map.attributionControl);
		}, [map]);
		return null;
	};

	const MarkerMemo = React.memo(({ center, icon }) => (
		<Marker position={[center.latitude, center.longitude]} icon={icon}>
			<Popup>
				<p className={styles.popup_desc}>{center.title}</p>
				<p>{center.city}</p>
				<p>{center.address}</p>
				<p>{center.phone}</p>
				<p>{center.servicedEquipment}</p>
			</Popup>
		</Marker>
	));

	//mapcontainer style
	const style = {
		height: "70vh",
		width: "100%",
	};

	//marker style
	const myIcon = new L.Icon({
		iconUrl: markerIcon,
		iconRetinaUrl: markerIcon,
		popupAnchor: [1, -34],
		iconAnchor: [12, 41],
		iconSize: [25, 41],
	});

	return (
		<div className={styles.map_content}>
			<MapContainer
				center={position}
				zoom={6}
				scrollWheelZoom={false}
				style={style}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
				/>
				{servisesCenters &&
					servisesCenters.map(center => (
						<MarkerMemo key={center.id} center={center} icon={myIcon} />
					))}
				<RemoveAttribution />
			</MapContainer>
		</div>
	);
};
export default MapComponent;
