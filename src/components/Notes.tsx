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
            // Symbols and National Identity
            '14 juillet : Fête nationale française (prise de la Bastille en 1789 et fête de la Fédération)',
            'Drapeau tricolore : bleu, blanc, rouge (symbole officiel de la République française)',
            'Marianne : symbole féminin de la République française (visage sur les timbres, pièces, mairies)',
            'Le coq gaulois : animal symbole de la France',
            'Devise : "Liberté, égalité, fraternité" (inscrite sur le fronton des mairies et écoles publiques)',
            'Hymne national : La Marseillaise (créée en 1792, paroles de Rouget de Lisle)',
            'La Marseillaise commence par : "Allons enfants de la Patrie, le jour de gloire est arrivé"',

            // Republican Values
            'Liberté : droit de faire tout ce qui ne nuit pas aux autres, dans le respect des lois',
            'Égalité : la loi est la même pour tous, avec les mêmes droits et devoirs',
            'Fraternité : solidarité et entraide entre les citoyens',
            'Laïcité : liberté de religion, séparation religion-État (loi de 1905)',
            'Égalité professionnelle : femmes et hommes ont les mêmes droits au travail',
            'La France est une République indivisible, laïque, démocratique et sociale (article 1er Constitution)',

            // Legal Framework
            'Constitution de la Ve République : 1958 (actuelle)',
            'Langue officielle : le français (inscrit dans la Constitution)',
            'Insulte publique (discrimination) : délit puni par la loi',
            'Liberté d\'expression : s\'exprimer librement dans le cadre de la loi (sans diffamation ni incitation à la haine)',
            'Liberté de circulation : se déplacer et s\'installer librement en France',
            'Liberté de conscience : droit de croire ou ne pas croire (athéisme protégé)',
            'Changement de religion : libre grâce à la liberté de conscience',
            'Droit d\'asile : protection internationale pour les réfugiés',

            // Key Historical Dates
            '1789 : Révolution française, prise de la Bastille, Déclaration des droits de l\'homme',
            '1792 : Création de La Marseillaise',
            '1848 : Abolition définitive de l\'esclavage en France',
            '1905 : Loi de séparation des Églises et de l\'État',
            '1945-1946 : Quatrième République, droit de vote des femmes',
            '1958 : Constitution de la Ve République (fondée par Charles de Gaulle)',
            '1981 : Abolition de la peine de mort',

            // Symbols on documents
            'Marianne apparaît sur les pièces de monnaie et les timbres postaux',
            'Le drapeau tricolore sur les bâtiments publics et écoles',
            'La devise sur les frontons des mairies',
        ],
    },
    2: {
        title: 'institutions',
        points: [
            // Executive Power
            'Président de la République : chef de l\'État, élu au suffrage universel direct pour 5 ans',
            'Réside au palais de l\'Élysée à Paris',
            'Premier ministre : nommé par le Président, dirige le gouvernement',
            'Gouvernement : applique les lois et dirige l\'action de l\'État',
            'Le pouvoir exécutif : applique les lois et dirige l\'État',

            // Legislative Power
            'Parlement : composé de l\'Assemblée nationale et du Sénat',
            'L\'Assemblée nationale : 577 député·es élu·es pour 5 ans au suffrage universel direct',
            'Sénat : sénateur·rices élu·es pour 6 ans (renouvelables par moitié) au suffrage universel indirect',
            'Le pouvoir législatif : vote les lois (Parlement)',
            'Le Parlement vote les lois et contrôle le gouvernement',

            // Judicial Power
            'Pouvoir judiciaire : jugement des infractions par les magistrats (juges et procureurs)',
            'La justice est indépendante du pouvoir politique',
            'Les tribunaux jugent les auteurs d\'infractions (vol, escroquerie, meurtre, etc.)',
            'Le détenu doit être jugé et ne peut être puni sans jugement',

            // Separation of Powers
            'Séparation des pouvoirs : exécutif, législatif, judiciaire',
            'Ce principe évite la tyrannie et garantit la démocratie',

            // Democratic Elections
            'Démocratie : les dirigeants sont élus par les citoyens',
            'Suffrage universel : droit de vote pour tous les citoyens majeurs sans distinction',
            'Élections présidentielles : tous les 5 ans, vote pour le Président',
            'Élections législatives : tous les 5 ans, vote pour les député·es',
            'Élections municipales : tous les 6 ans, vote pour les conseillers municipaux et le maire',
            'Élections européennes : tous les 5 ans, vote pour les député·es européens',
            'Pour voter : être inscrit sur les listes électorales',
            'Âge du vote : 18 ans',
            'Le vote est obligatoire en France',
            'Citoyen européen peut voter aux municipales et européennes',

            // Local Government
            'Maire : dirige la commune (élu par le conseil municipal)',
            'Préfet : représente l\'État dans le département ou la région (nommé par le Président)',
            'Commune, département, région : trois niveaux de collectivités territoriales',
            '101 départements en France (96 métropole + 5 outre-mer)',
            '13 régions en France métropolitaine (depuis 2016)',

            // Political Participation
            'Partis politiques : expriment différentes opinions, se forment librement',
            'Les partis concourent à l\'expression du suffrage',
            'Associations : participent à la vie sociale, culturelle ou sportive, créent du lien',
            'Tout le monde doit respecter la loi (nul n\'est censé ignorer la loi)',
            'Lois : doivent être respectées par tous (citoyens, étrangers, élus, État)',

            // European Union
            'Union européenne : 27 États membres (depuis 2020 après le Brexit)',
            'Pays fondateurs : France, Allemagne, Italie, Belgique, Pays-Bas, Luxembourg (traité de Rome 1957)',
            'Monnaie utilisée en France : l\'Euro',
            'Journée de l\'Europe : 9 mai (commémoration de la déclaration Schuman de 1950)',
            'Élections européennes : tous les 5 ans, peuvent voter les citoyens européens',
            'Députés européens : élus par les citoyens des États membres',
        ],
    },
    3: {
        title: 'rights',
        points: [
            // Fundamental Rights
            'Droit de vote : essentiel pour participer à la démocratie',
            'Liberté d\'expression : s\'exprimer librement dans le cadre de la loi',
            'Liberté de conscience : droit de croire ou ne pas croire',
            'Liberté de religion : pratiquer une religion dans le respect de la loi',
            'Droit à la santé : protection de la santé pour tous',
            'Droit à l\'éducation : école gratuite et obligatoire jusqu\'à 16 ans',
            'Droit au travail : droit de chercher et d\'avoir un emploi',
            'Égalité des droits : homme et femme ont les mêmes droits',
            'Droit à un procès équitable : être assisté par un avocat',
            'Droit d\'asile : protection pour les réfugiés',

            // Legal Documents
            'Déclaration des droits de l\'homme et du citoyen : 1789 (texte fondateur)',
            'Constitution de la Ve République : 1958 (garantit les droits et libertés)',
            'Charte des droits et devoirs du citoyen français : énonce les droits et devoirs',

            // Civil Rights
            'IVG (Interruption Volontaire de Grossesse) : droit garanti par la loi',
            'Divorce : droit en France, avec ou sans accord des époux',
            'Polygamie : strictement interdite par la loi française',
            'Mariage : reconnu s\'il est célébré civilement à la mairie par un officiel d\'état civil',

            // Limits of Rights
            'Libertés individuelles peuvent être limitées pour protéger l\'ordre public et les droits des autres',
            'La liberté s\'arrête où commence celle des autres',
            'Infraction : comportement interdit par la loi et passible d\'une sanction pénale',
            'Contravention : infraction la moins grave (ex: mauvais stationnement)',
            'Délit : infraction moyenne (ex: vol, escroquerie)',
            'Crime : infraction la plus grave (ex: meurtre, assassinat, viol)',

            // Duties
            'Devoir de payer des impôts : contribution au fonctionnement des services publics',
            'Devoir de respecter les lois : tout le monde doit respecter la loi',
            'Devoir de réduction des déchets : protection de l\'environnement',
            'Devoir de déclarer son enfant à la mairie : dans les 5 jours suivant la naissance',
            'Citoyenneté : voter, s\'engager, respecter les règles communes',

            // Security Forces
            'Police : veille à la sécurité en zone urbaine, prévient la délinquance',
            'Gendarmerie : veille à la sécurité en zone rurale et périurbaine',
            'En cas d\'accident : alerter les secours (15, 17, 18, 112) et protéger les victimes',
            'Victime de violences : alerter les autorités, porter plainte, contacter le 17, 114, 3919',

            // Crimes
            'Traite des êtres humains : recruter, transporter ou héberger des personnes pour les exploiter (crime grave)',
            'Travail non déclaré ("travail au noir") : illégal et puni par la loi',
            'Dépôt sauvage : abandon de déchets (machine à laver, détritus) = infraction passible d\'amende',

            // Environmental Duties
            'Réduire ses déchets : devoir civique pour protéger l\'environnement',
            'Tri sélectif : trier, recycler, composter et éviter le gaspillage',
            'Jeter une bouteille dans la rue : infraction passible d\'amende pour abandon de déchets',

            // Penalties
            'Sanctions possibles : amendes, peines de prison, travaux d\'intérêt général',
            'Ministre qui ne respecte pas la loi : peut être jugé et condamné comme tout citoyen',
        ],
    },
    4: {
        title: 'history',
        points: [
            // French Revolution
            '1789 : Révolution française, prise de la Bastille (14 juillet)',
            'Déclaration des droits de l\'homme et du citoyen : 1789',
            'Louis XVI : roi de France au moment de la Révolution (exécuté en 1793)',
            '14 juillet 1789 : symboles de la liberté et de la République',

            // Key Historical Figures
            'Jeanne d\'Arc : héroïne nationale française (guerre de Cent Ans)',
            'Napoléon Ier : général devenu Empereur des Français en 1804',
            'Jules Ferry : a rendu l\'école gratuite, laïque et obligatoire (lois de 1881-1882)',
            'Charles de Gaulle : fondateur de la Ve République en 1958, premier Président élu en 1959',
            'Jean Moulin : figure de la Résistance pendant la guerre',

            // Historical Periods
            '5 républiques en France : Ier (1792-1804), IIe (1848-1852), IIIe (1870-1940), IVe (1946-1958), Ve (1958-à aujourd\'hui)',
            'Nous vivons sous la Ve République (depuis 1958)',
            'Premier Président de la Ve République : Charles de Gaulle',

            // World Wars
            'Première Guerre mondiale : 1914-1918',
            'Seconde Guerre mondiale : 1939-1945',
            'Armistice du 11 novembre 1918 : fin de la Première Guerre mondiale (jour férié)',
            '8 mai 1945 : capitulation de l\'Alemania nazie, fin de la Seconde Guerre mondiale',
            'Shoah : extermination systématique des Juifs par l\'Allemagne nazie pendant la Seconde Guerre mondiale',

            // Colonization and Slavery
            'Colonisation : l\'Algérie a été colonisée par la France',
            '1848 : abolition définitive de l\'esclavage en France (par Victor Schœlcher)',

            // European Construction
            '1957 : création de la Communauté Économique Européenne (CEE) par le traité de Rome',
            'Brexit : le Royaume-Uni a quitté l\'Union européenne en 2020',

            // Geography
            'Capitale : Paris',
            'France métropolitaine : située en Europe',
            'Fleuve : la Seine coule à Paris',
            'Océan à l\'ouest : océan Atlantique',
            'Mer au sud : mer Méditerranée',
            'Chaîne de montagnes entre France et Italie : les Alpes',
            'Chaîne de montagnes entre France et Espagne : les Pyrénées',

            // Major Cities
            'Paris : capitale de la France',
            'Marseille : grand port maritime sur la Méditerranée',
            'Lyon, Bordeaux, Toulouse, Lille : grandes villes françaises',

            // DOM-TOM
            'La Réunion : département d\'outre-mer français (dans l\'océan Indien)',
            'La Corse : île française en Méditerranée',
            'Guadeloupe, Martinique, Guyane, Mayotte : autres départements d\'outre-mer',

            // Famous French Cultural Figures
            'Victor Hugo : grand écrivain français (Les Misérables, Notre-Dame de Paris)',
            'Molière : dramaturge et comédien du 17e siècle',
            'Jean de la Fontaine : poète du 17e siècle, auteur des Fables (ex: Le Corbeau et le Renard)',
            'Charles Baudelaire : poète du 19e siècle (Les Fleurs du Mal)',
            'George Sand : femme de lettres et romancière du 19e siècle',
            'Simone de Beauvoir : philosophe et romancière, figure du féminisme (Le Deuxième Sexe)',
            'Albert Camus : écrivain, philosophe et journaliste, Prix Nobel de littérature',
            'Paul Cézanne : peintre français (précurseur du cubisme)',
            'Marc Chagall : peintre d\'origine russe naturalisé français',
            'Joséphine Baker : chanteuse, danseuse, résistance et militante antiraciste franco-américaine (entrée au Panthéon)',
            'Édith Piaf : célèbre chanteuse française',

            // Cultural Heritage
            'Louvre : l\'un des plus grands musées d\'art et d\'antiquités du monde (Paris)',
            'Tour Eiffel : symbole de Paris (construite pour l\'Exposition universelle de 1889)',
            'Noël : célébré le 25 décembre (fête chrétienne)',
            'Fête nationale : 14 juillet',

            // Languages
            'Langue officielle : le français',
            'Langues régionales : breton, alsacien, corse, occitan, etc.',
            'Langues de l\'UE : le français est une des langues officielles de l\'Union européenne',
        ],
    },
    5: {
        title: 'social',
        points: [
            // Emergency Numbers
            '15 : SAMU (urgences médicales)',
            '17 : Police (urgences police)',
            '18 : Pompiers (urgences incendies et secours)',
            '112 : numéro d\'urgence européen',
            '114 : numéro d\'urgence par SMS pour les personnes sourdes ou malentendantes',
            '3919 : violences conjugales',
            'Numéros d\'urgence : gratuits, joignables 24h/24 et 7j/7',

            // Healthcare System
            'Protection Universelle Maladie (PUMa) : droit à la prise en charge des frais de santé pour tous',
            'CPAM : Caisse Primaire d\'Assurance Maladie (remboursement des frais de santé)',
            'Carte Vitale : justifie les droits à l\'Assurance Maladie pour être remboursé',
            'Mutuelle santé : complète les remboursements de l\'Assurance Maladie',
            'Médecin traitant : assure le suivi médical global et oriente vers les spécialistes',
            'Urgences de l\'hôpital : pour situation médicale grave ou urgence vitale',
            'Vaccinations obligatoires : protègent la santé et empêchent la propagation des maladies',

            // Employment
            'France Travail (ex-Pôle emploi) : aide les demandeurs d\'emploi',
            'SMIC : Salaire Minimum Interprofessionnel de Croissance (salaire minimum légal)',
            'Temps de travail légal : 35 heures par semaine (à temps plein)',
            'Âge minimum pour travailler : 16 ans (avec accord des parents, hors apprentissage)',
            'Travail au noir : illegal, puni par la loi',
            'Salaire minimum : l\'employeur doit respecter le SMIC',
            ' Femme a les mêmes droits que l\'homme pour créer une entreprise',
            'Étranger en situation régulière peut créer une entreprise sous conditions',

            // Social Benefits
            'Sécurité sociale : remboursement des soins médicaux',
            'Allocations familiales : aide aux familles',
            'Protection sociale : aide en cas de maladie, chômage, retraite',
            'Droit au logement (DALO) : loi permettant de faire reconnaître le droit au logement',

            // Education
            'École obligatoire : de 3 à 16 ans (instruction obligatoire)',
            'Loi de Jules Ferry (1881-1882) : école gratuite, laïque et obligatoire',
            'École gratuite : depuis 1881',
            'École laïque : neutre, sans religion, protège de tout prosélytisme',
            'Collège : après l\'école élémentaire (primaire), de 11 à 15 ans environ',
            'Lycée : après le collège, prépare au Baccalauréat',
            'Baccalauréat : diplôme obtenu à la fin du lycée',
            'Université : études supérieures après le lycée',
            'Enfants ne parlant pas français : bénéficient d\'un enseignement adapté (classes UPE2A)',
            'Obligation d\'assiduité : l\'élève doit être présent à tous les cours',

            // Family
            'Autorité parentale : obligation de protéger l\'enfant, assurer son éducation et subvenir à ses besoins',
            'Déclaration de naissance : dans les 5 jours qui suivent la naissance, au service d\'état civil de la mairie',
            'Mariage civil : célébré à la mairie par le maire ou son adjoint (reconnu juridiquement)',

            // Insurance
            'Assurance automobile : obligatoire pour conduire',

            // Citizenship
            'Apprendre le français : essentielle pour l\'intégration',
            'Connaître les valeurs de la République : liberté, égalité, fraternité, laïcité',
            'Handicap : reconnaissance et droits (loi de 2005)',
            'Retraite : pension de vieillesse après une carrière professionnelle',

            // Public Services
            'Services publics : école, hôpital, transports, sécurité',
            'Impôts : servent à financer les services publics',
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
