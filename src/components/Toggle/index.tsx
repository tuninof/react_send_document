import React, { useState } from "react";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai"; 
import styles from "./styles.module.css"

const Toggle: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleContent = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={styles.toggleContainer}>
            {!isOpen && ( // Renderiza a div toggleHeader apenas quando isOpen for false
                <div className={styles.toggleHeader} onClick={toggleContent}>
                    <span>Saiba mais</span>
                    <AiOutlineDown />
                </div>
            )}
            {isOpen && (
                <div className={styles.toggleContent}>
                    <p>De acordo com os critérios da certificação Fairtrade, é essencial que você siga as seguintes normas ao usar defensivos agrícolas:</p>

                    <p><span className={styles.highlightCriteria}>Critério 3.2.15:</span> Você deve manter uma lista atualizada dos pesticidas usados na produção, indicando quais substâncias estão na Lista Vermelha (proibidos), Lista Laranja (restrito) e Lista Amarela (monitoramento).</p>

                    <p><span className={styles.highlightCriteria}>Critério 3.2.16:</span> Materiais da Lista Vermelha não podem ser usados em cultivos Fairtrade. Apenas substâncias registradas e permitidas para seu tipo de cultivo são autorizadas.</p>

                    <p><span className={styles.highlightCriteria}>Critério 3.2.17:</span> Substâncias da Lista Laranja podem ser usadas em situações específicas, como parte do Manejo Integrado de Pragas (MIP), e você deve ter um plano para reduzir ou eliminar o uso desses materiais.</p>

                    <p><span className={styles.highlightCriteria}>Critério 3.2.18:</span> Sua organização precisa garantir que nem você nem os outros membros usem materiais proibidos da Lista Vermelha, e todos devem conhecer essas regras.</p>

                    <p><strong>Importante:</strong> Ao baixar estas listas, você estará cumprindo esses critérios e garantindo o uso seguro e responsável dos pesticidas na sua produção.</p>

                    <div className={styles.ToogleClose} onClick={toggleContent}>
                        <span>Ver menos</span>
                        <AiOutlineUp />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Toggle;


