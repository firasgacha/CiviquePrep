import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ThemeNote {
    title: string;
    points: string[];
}

const themeNotes: { [key: number]: ThemeNote; } = {
    1: {
        title: 'principles',
        points: [
            '14 juillet : Fête nationale française (prise de la Bastille en 1789)',
            'Drapeau tricolore : bleu, blanc, rouge (symbole officiel de la République)',
            'Marianne : symbole féminin de la République française',
            'Devise : "Liberté, égalité, fraternité" (sur les mairies et écoles publiques)',
            'Égalité : la loi est la même pour tous, avec les mêmes droits et devoirs',
            'Laïcité : liberté de religion, séparation religion-État (loi de 1905)',
            'Constitution de la Ve République : 1958',
            'Régime politique : République démocratique',
            'Égalité professionnelle : femmes et hommes ont les mêmes droits au travail',
            'Insulte publique : délit puni par la loi (discrimination interdite)',
        ],
    },
    2: {
        title: 'institutions',
        points: [
            'Président de la République : chef de l\'État, élu au suffrage universel',
            'Premier ministre : nommé par le Président, dirige le gouvernement',
            'Parlement : composé de l\'Assemblée nationale et du Sénat',
            'Pouvoir exécutif : applique les lois et dirige l\'État',
            'Pouvoir législatif : vote les lois (Parlement)',
            'Pouvoir judiciaire : juge les infractions (tribunaux)',
            'Démocratie : les dirigeants sont élus par les citoyens',
            'Partis politiques : expriment différentes opinions',
            'Lois : doivent être respectées par tous (nul n\'est censé ignorer la loi)',
            'Élections : votez pour choisir vos représentants',
        ],
    },
    3: {
        title: 'rights',
        points: [
            'Droit de vote : essentiel pour participer à la démocratie (obligatoire en France)',
            'Liberté d\'expression : s\'exprimer librement dans le cadre de la loi',
            'Droit à la santé : protection de la santé pour tous',
            'Droit à l\'éducation : école gratuite et obligatoire jusqu\'à 16 ans',
            'Droit au travail : droit de chercher et d\'avoir un emploi',
            'Devis de payer des impôts : contribution au fonctionnement des services publics',
            'Devis de respecter les lois : tout le monde doit respecter la loi',
            'Protection sociale : aide en cas de maladie, chômage, retraite',
            'Droit d\'asile : protection internationale pour les réfugiés',
            'Égalité des droits : homme et femme ont les mêmes droits',
        ],
    },
    4: {
        title: 'history',
        points: [
            '1789 : Révolution française, prise de la Bastille, Déclaration des droits',
            '14 juillet 1789 : symboles de la liberté et de la République',
            '1945-1946 : Quatrième République, droit de vote des femmes',
            '1958 : Constitution de la Ve République',
            'France métropolitaine : 13 régions, 96 départements',
            'DOM-TOM : Guadeloupe, Martinique, Guyane, Réunion, Mayotte, Nouvelle-Calédonie',
            'Capitale : Paris',
            'Langues régionales : breton, alsacien, Corse, occitan, etc.',
            'Hymne national : La Marseillaise',
            'Fête nationale : 14 juillet',
        ],
    },
    5: {
        title: 'social',
        points: [
            'Services publics : école, hôpital, transports, sécurité',
            'Sécurité sociale : remboursement des soins médicaux',
            'Allocations familiales : aide aux familles',
            'École obligatoire : de 6 à 16 ans, gratuite et laïque',
            'Intégration : apprendre le français, connaître les valeurs de la République',
            'Handicap : reconnaissance et droits (loi de 2005)',
            'Logement : droit au logement (DALO)',
            'Travail : contrat de travail, droits et devoirs',
            'Retraite : pension de vieillesse après une carrière',
            'Citoyenneté : voter, s\'engager, respecter les règles communes',
        ],
    },
};

export function Notes() {
    const { t } = useTranslation();
    const [selectedTheme, setSelectedTheme] = useState<number>(1);

    return (
        <div className="notes-container">
            <h2>{t('notesTitle')}</h2>
            <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                {t('notesDescription')}
            </p>

            <div className="notes-themes">
                {[1, 2, 3, 4, 5].map((themeNum) => (
                    <button
                        key={themeNum}
                        className={`notes-theme-btn ${selectedTheme === themeNum ? 'active' : ''}`}
                        onClick={() => setSelectedTheme(themeNum)}
                    >
                        {t('theme')} {themeNum}: {t(themeNotes[themeNum].title)}
                    </button>
                ))}
            </div>

            <div className="notes-content">
                <h3>{t('theme')} {selectedTheme}: {t(themeNotes[selectedTheme].title)}</h3>
                <ul className="notes-list">
                    {themeNotes[selectedTheme].points.map((point, index) => (
                        <li key={index}>{point}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
