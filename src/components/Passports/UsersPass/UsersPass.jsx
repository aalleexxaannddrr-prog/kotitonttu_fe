import React from 'react';
import styles from './UsersPass.module.css';

export default function UsersPass() {
	return (
		<div className={styles.userpass_content}>
			<div className={styles.userpass_info}>
				<h3>Lastname</h3>
				<h3>Firstname</h3>
				<p>XX.XX.XXXX</p>
				<p>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates
					quibusdam sequi sunt! Nihil porro sit velit beatae. Amet, accusamus
					distinctio corrupti animi quidem nihil tenetur nulla eos ut, aperiam
					minima!
				</p>
			</div>
			<div className={styles.img_content}>
				<img
					src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2IymN_RcfAp5hDI5abdcIYZbfAB8XlbppqA&s'
					alt='userpass'
					className={styles.pass_img}
				/>
				<img
					src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyZ_CzXj2wGTt1FYafI6QNcdabVrKA89yX-w&s'
					alt='userpass'
					className={styles.pass_img}
				/>
				<img
					src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNMVVVowuUHCz8XJeQyTNsPBZRl9Bwj55_3w&s'
					alt='userpass'
					className={styles.pass_img}
				/>
			</div>

			<div className={styles.btn_block}>
				<button className={`${styles.userpass_btn} ${styles.btn_accept}`}>
					Accept
				</button>
				<button className={`${styles.userpass_btn} ${styles.btn_reject}`}>
					Reject
				</button>
			</div>
		</div>
	);
}
