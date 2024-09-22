import React, { useState } from 'react';
import { verifyCPF, confirmUser, savePhone } from '../../services/apiService'; // Importa as funções do serviço
import ConfirmButtons from '../ConfirmButtons';
import styles from './styles.module.css'
import logoCoopfam from '../../assets/LogoCoopfamC.png'
import Footer from '../Footer';


const CPFForm: React.FC = () => {
    const [cpf, setCpf] = useState('');
    const [name, setName] = useState('');
    const [confirmed, setConfirmed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [downloadsCompleted, setDownloadsCompleted] = useState(false);
    const [phone, setPhone] = useState('');
    const [phoneSubmitted, setPhoneSubmitted] = useState(false);

    const formatPhone = (value: string) => {
        // Remove todos os caracteres não numéricos
        const onlyDigits = value.replace(/\D/g, '');

        // Formata o telefone
        if (onlyDigits.length <= 2) {
            return `(${onlyDigits}`;
        } else if (onlyDigits.length <= 7) {
            return `(${onlyDigits.slice(0, 2)}) ${onlyDigits.slice(2)}`;
        } else if (onlyDigits.length <= 11) {
            return `(${onlyDigits.slice(0, 2)}) ${onlyDigits.slice(2, 7)}-${onlyDigits.slice(7, 11)}`;
        }
        return onlyDigits; // Retorna o valor como está se for maior que 11
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedValue = formatPhone(e.target.value);
        setPhone(formattedValue);
    };

    const validateCPF = (cpf: string) => {
        const cpfPattern = /^\d{11}$/; // Verifica se o CPF tem 11 dígitos
        return cpfPattern.test(cpf);
    };

    const validatePhone = (phone: string) => {
        const phonePattern = /^\(\d{2}\) \d{5}-\d{4}$|^\(\d{2}\) \d{4}-\d{4}$/; // Permite (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
        return phonePattern.test(phone);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateCPF(cpf)) {
            alert('Por favor, digite um CPF válido com 11 dígitos.');
            return;
        }
        try {
            setLoading(true);
            const data = await verifyCPF(cpf); // Chama a função do serviço
            setName(data.name);
        } catch (error) {
            alert('CPF não encontrado.');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async () => {
        try {
            const { response1, response2 } = await confirmUser(cpf); // Chama a função do serviço

            // Gera o link para o primeiro PDF
            const url1 = window.URL.createObjectURL(new Blob([response1.data]));
            const link1 = document.createElement('a');
            link1.href = url1;
            link1.setAttribute('download', 'lista_vermelha-2024.pdf');
            document.body.appendChild(link1);
            link1.click();

            // Gera o link para o segundo PDF
            const url2 = window.URL.createObjectURL(new Blob([response2.data]));
            const link2 = document.createElement('a');
            link2.href = url2;
            link2.setAttribute('download', 'lista_defensivos-2024.pdf');
            document.body.appendChild(link2);
            link2.click();

            setDownloadsCompleted(true);
        } catch (error) {
            alert('Erro ao gerar os PDFs.');
        }
    };

    const handlePhoneSubmit = async () => {
        if (!validatePhone(phone)) {
            alert('Por favor, digite um número de telefone válido no formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX.');
            return;
        }
        try {
            await savePhone(cpf, phone); // Chama a função do serviço
            setPhoneSubmitted(true);
        } catch (error) {
            alert('Erro ao enviar o número de telefone.');
        }
    };

    const handleReset = () => {
        setCpf(''); // Limpa o CPF
        setName(''); // Limpa o nome
        setConfirmed(false); // Reseta a confirmação
    };

    return (
        <div>
            {!phoneSubmitted ? (
                <>
                    {!name && (
                        <div>
                            <div className={styles.texto}>
                                <img className={styles.logo} src={logoCoopfam} />
                                <p>Olá, seja bem-vindo a nossa plataforma digital!</p>
                                <p>Por favor, digite seu CPF.</p>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className={styles.formContainer}>
                                    <input
                                        type="text"
                                        name='cpf'
                                        value={cpf}
                                        onChange={(e) => setCpf(e.target.value)}
                                        placeholder="Digite o CPF"
                                        required
                                    />
                                    <button type="submit" disabled={loading}>Verificar CPF</button>
                                </div>
                            </form>
                        </div>
                    )}
                    {name && !confirmed && (
                        <div>
                            <div className={styles.texto}>
                                <p>O nome é {name}. Este é você?</p>
                            </div>
                            <ConfirmButtons onConfirm={() => setConfirmed(true)} onReset={handleReset} />
                        </div>
                    )}
                    {confirmed && !downloadsCompleted && (
                        <div>
                            <div className={styles.texto}>
                                <p>Você receberá no seu dispositivo:</p>
                                <p>A lista de produtos permitidos pelo Fair Trade e</p>
                                <p>A lista vermelha de produtos proíbidos pelo Fair Trade</p>
                                <p>Clique no botão abaixo para baixar o PDF.</p>
                            </div>
                            <button className={styles.buttonDowloading} onClick={handleConfirm}>Baixar PDF</button>
                        </div>
                    )}
                    {downloadsCompleted && (
                        <div>
                            <div className={styles.texto}>
                                <p>Os arquivos foram baixados com sucesso e já se encontram na pasta de download do seu dispositivo.</p>
                                <p>Em breve, os arquivos também serão enviados pelo WhatsApp.</p>
                                <p>Por favor, digite o número do seu telefone no campo abaixo.</p>
                            </div>
                            <form onSubmit={(e) => { e.preventDefault(); handlePhoneSubmit(); }}>
                                <div className={styles.formContainer}>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={phone}
                                        onChange={handlePhoneChange}
                                        placeholder="Digite seu número de telefone"
                                        required
                                    />
                                    <button type="submit">Enviar número</button>
                                </div>
                            </form>
                        </div>
                    )}
                </>
            ) : (
                <div className={styles.texto}>
                    <p>Sua participação foi concluída com sucesso!</p>
                    <p>Obrigado por utilizar nossos serviços!</p>
                    <div>
                    <Footer />
                    </div>
                </div>


            )}
        </div>
    );
};

export default CPFForm;




