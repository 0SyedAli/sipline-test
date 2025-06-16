import styles from "./AuthBtn.module.css";
const loadingSvg = "/images/tube-spinner.svg";
export const AuthBtn = ({ disabled, title, type, onClick, location_btn }) => {
  return (
    <button
      className={`${styles.btntheme1} ${location_btn ? location_btn : ""}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {disabled ? <><img src={loadingSvg} /></> : title}
    </button>
  );
};
