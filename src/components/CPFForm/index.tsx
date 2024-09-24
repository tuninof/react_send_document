import React, { useState } from 'react';
import { verifyCPF, confirmUser, savePhone } from '../../services/apiService'; // Importa as funções do serviço
import ConfirmButtons from '../ConfirmButtons'
import styles from './styles.module.css'
import logoCoopfam from '../../assets/LogoCoopfamC.png'
import Footer from '../Footer'
import Toogle from '../Toggle'



const CPFForm: React.FC = () => {
    const [cpf, setCpf] = useState('');
    const [name, setName] = useState('');
    const [confirmed, setConfirmed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [downloadsCompleted, setDownloadsCompleted] = useState(false);
    const [phone, setPhone] = useState('');
    const [phoneSubmitted, setPhoneSubmitted] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const showMessage = (msg: string, type: 'success' | 'error') => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => {
            setMessage('');
        }, 5000); // A mensagem desaparecerá após 5 segundos
    };

    //atualização
    const removeCpfFormatting = (cpf: string) => cpf.replace(/\D/g, '');

    // Formata o CPF para exibição
    const formatCpf = (value: string) => {
        const cpfNumbers = value.replace(/\D/g, ''); // Remove caracteres não numéricos
        if (cpfNumbers.length <= 3) return cpfNumbers;
        if (cpfNumbers.length <= 6) return `${cpfNumbers.slice(0, 3)}.${cpfNumbers.slice(3)}`;
        if (cpfNumbers.length <= 9) return `${cpfNumbers.slice(0, 3)}.${cpfNumbers.slice(3, 6)}.${cpfNumbers.slice(6)}`;
        return `${cpfNumbers.slice(0, 3)}.${cpfNumbers.slice(3, 6)}.${cpfNumbers.slice(6, 9)}-${cpfNumbers.slice(9, 11)}`;
    };

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedCpf = formatCpf(e.target.value);
        setCpf(formattedCpf);
    };

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
        const cleanedCpf = removeCpfFormatting(cpf); // Remove a formatação antes de validar
        const cpfPattern = /^\d{11}$/;
        return cpfPattern.test(cleanedCpf);
    };

    const validatePhone = (phone: string) => {
        const phonePattern = /^\(\d{2}\) \d{5}-\d{4}$|^\(\d{2}\) \d{4}-\d{4}$/; // Permite (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
        return phonePattern.test(phone);
    };

   
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const cleanedCpf = removeCpfFormatting(cpf); // Remove a formatação antes de enviar
    
        if (!validateCPF(cleanedCpf)) {
            showMessage('Por favor, digite um CPF válido com 11 dígitos.', 'error');
            return;
        }
    
        try {
            setLoading(true); // Mostra o estado de carregamento
            const data = await verifyCPF(cleanedCpf); // Certifique-se de enviar o CPF sem formatação
            if (data && data.name) {
                setName(data.name); // Exibe o nome encontrado
            } else {
                showMessage('CPF não encontrado.', 'error');
            }
        } catch (error) {
            showMessage('CPF não encontrado.', 'error');
        } finally {
            setLoading(false); // Finaliza o estado de carregamento
        }
    };
    
    const handleConfirm = async () => {
        const cleanedCpf = removeCpfFormatting(cpf); // Remove a formatação antes de enviar
        try {
            const { response1, response2 } = await confirmUser(cleanedCpf); // Certifique-se de enviar o CPF sem formatação
    
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
            console.error(error); // Para investigar o erro
        }
    };
    

    const handlePhoneSubmit = async () => {
        if (!validatePhone(phone)) {
            showMessage('Por favor, digite um número de telefone válido no formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX.', 'error');
            return;
        }
    
    
        try {
            await savePhone(removeCpfFormatting(cpf), phone); // Envia o CPF sem formatação
            setPhoneSubmitted(true);
            showMessage('Telefone enviado com sucesso!', 'success');
        } catch (error) {
            showMessage('Erro ao enviar o número de telefone.', 'error');
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
                                <h1 className={styles.title}>Cumprindo as Normas do Fairtrade: Baixe as Listas de Materiais Perigosos</h1>
                                <p>Olá, seja bem-vindo(a) à nossa plataforma digital!</p>
                                <p>
                                Aqui você pode baixar duas listas importantes para seguir as normas da certificação Fairtrade: a Lista Vermelha (materiais proibidos) e a lista de materiais permitidos e restritos. Seguir essas orientações é fundamental para proteger sua saúde, o meio ambiente e manter sua certificação.</p>
                                <Toogle/>
                                <p>Por favor, digite seu CPF.</p>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className={styles.formContainer}>
                                    <input
                                        type="text"
                                        name="cpf"
                                        value={cpf}
                                        onChange={handleCpfChange}
                                        placeholder="Digite o CPF"
                                        required
                                    />
                                    <button type="submit" disabled={loading}>
                                        {loading ? 'Verificando...' : 'Verificar CPF'}
                                    </button>
                                </div>
                                {message && (
                                    <div className={`${styles.message} ${messageType === 'error' ? styles.error : styles.success}`}>
                                        {message}
                                    </div>
                                )}
                            </form>
                        </div>
                    )}
                    {name && !confirmed && (
                        <div>
                            <div className={styles.texto}>
                                <p><span className={styles.spanName}>{name}</span>. </p>
                                <p>Este é o seu nome?</p>
                            </div>
                            <ConfirmButtons onConfirm={() => setConfirmed(true)} onReset={handleReset} />
                        </div>
                    )}
                    {confirmed && !downloadsCompleted && (
                        <div>
                            <div className={styles.texto}>
                                <p>Ao clicar no botão abaixo, você receberá em seu dispositivo:</p>
                                <p>A Lista de Agrotóxicos e Materiais Perigosos e a Lista Vermelha de Produtos Proibidos pelo Fair Trade.</p>
                            </div>
                            <button className={styles.buttonDowloading} onClick={handleConfirm}>Baixar Listas</button>
                        </div>
                    )}
                    {downloadsCompleted && (
                        <div>
                            <div className={styles.texto}>
                                <p>Os arquivos foram baixados com sucesso e estão disponíveis na pasta de downloads do seu dispositivo.</p>
                                <p>Em alguns dias, os arquivos também serão enviados para o seu WhatsApp.</p>
                                <p>Por favor, digite o número do seu telefone no campo abaixo, para que possamos enviá-los.</p>
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
                                {message && (
                                    <div className={`${styles.message} ${messageType === 'error' ? styles.error : styles.success}`}>
                                        {message}
                                    </div>
                                )}
                            </form>
                        </div>
                    )}
                </>
            ) : (
                <div className={styles.texto}>
                    <p>Sua participação foi concluída com sucesso!</p>
                    <p>Agradecemos por utilizar nossos serviços!</p>
                    <div>
                        <Footer />
                    </div>
                </div>


            )}
        </div>
    );
};

export default CPFForm;




