import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {addBarcode} from "../../../../store/slices/addBarcodeSlice";
import styles from "./BarcodeForm.module.css";
import {RiArrowDropDownLine} from "react-icons/ri";
import {fetchBarcodeTypes} from "../../../../store/slices/barcodeDataSlice";

function BarcodeForm() {
    const [code, setCode] = useState('');
    const [type, setType] = useState(null);
    const [isTypeOpen, setIsTypeOpen] = useState(false)
    const [isTypeSelected, setIsTypeSelected] = useState(true)
    const dispatch = useDispatch();
    const typesData = useSelector(state => state.barcodeTypeData)

    const handleSubmit = event => {
        event.preventDefault();
        if (!type){
            setIsTypeSelected(false)
            return;
        }
        dispatch(addBarcode({ code, type: type.id}));

        // Очищаем форму
        setCode('')
        setType(null)

        // Обновляем страницу
        window.location.reload();
    };

    useEffect(() => {
        dispatch(fetchBarcodeTypes());
    }, [dispatch]);

    const toggleTypeDropdown = () => setIsTypeOpen(!isTypeOpen);

    const handleTypeSelect = type => {
        setType(type);
        setIsTypeSelected(true);
        setIsTypeOpen(false);
    };
    console.log(typesData.data)
    return (
        <form className={styles.form_block} onSubmit={handleSubmit}>
            <label htmlFor='code'>Код:</label>
            <input
                type='number'
                id='code'
                value={code}
                onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)){
                        event.preventDefault();
                    }
                }}
                onChange={e => {
                    if (Number(e.target.value) < 2_147_483_648) setCode(e.target.value) // Проверяем, не больше ли значение чем int 32
                }}
                required
            />
            <label htmlFor='type' style={{color: `${isTypeSelected? '':'red'}`}}>Тип:</label>
            <div className={styles.select_block}>
                <div
                    className={styles.custom_select_outer}
                    onClick={toggleTypeDropdown}
                >
                    {type ? type.type : 'Выберите тип'}
                    <RiArrowDropDownLine size={24} />
                </div>
                {isTypeOpen && (
                    <ul className={styles.custom_select}>
                        {
                            typesData.data.map((item, index) => (
                            <li
                                key={index}
                                onClick={() => handleTypeSelect(item)}
                            >
                                {item.type}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <button className={styles.form_btn} type='submit'>
                Добавить Штрих-код
            </button>
        </form>
    );
}

export default BarcodeForm;
