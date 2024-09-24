import styles from './styles.module.css'
import logoQS from '../../assets/logoQS.png'

const Footer: React.FC = () => {
    return (
        <footer className={styles.container}>
            <div>
            <img className={styles.logoQS} src={logoQS} alt='logo da Q&s agro' />
                <p>&copy; {new Date().getFullYear()} Q&S Agronegócio. Todos os direitos reservados.</p>
            </div>
            <div>
                <p>Contato: qesagronegocio@gmail.com</p>
            </div>
        </footer>
    );
};

export default Footer;
