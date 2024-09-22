import styles from "./styles.module.css"

interface ConfirmButtonsProps {
    onConfirm: () => void;
    onReset: () => void;
}

const ConfirmButtons: React.FC<ConfirmButtonsProps> = ({ onConfirm, onReset }) => {
    return (
        <div className={styles.container}>
            <button onClick={onConfirm}>Sim</button>
            <button onClick={onReset}>Não</button>
        </div>
    );
};

export default ConfirmButtons;
