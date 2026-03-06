export function Info() {

    return (
        <div className="info-section">
            <div className="info-content">
                <h2>Mise en place de l'examen civique</h2>
                <p>
                    A partir du 1er janvier 2026, l'examen civique sera exigé pour les personnes
                    sollicitant une carte de séjour pluriannuelle (CSP) ou une carte de résident (CR).
                </p>

                <div className="info-block">
                    <h3>🇫🇷 Marianne</h3>
                    <p>
                        La loi du 26 janvier 2024 pour contrôler l'immigration, améliorer l'intégration
                        a renforcé les exigences en matière de maîtrise du français et d'intégration
                        républicaine des étrangers primo-arrivants souhaitant demeurer durablement en France.
                        Cette loi prévoit ainsi la création d'un examen civique qui vise à vérifier la
                        connaissance par le candidat des principes et des valeurs de la République,
                        le mode d'organisation de la République et le fonctionnement de la société française.
                    </p>
                </div>

                <div className="info-block">
                    <h3>Où passer l'examen civique et comment s'inscrire ?</h3>
                    <p>Deux organismes ont été agréés par le ministère de l'intérieur pour la mise en œuvre de l'examen civique :</p>

                    <div className="info-sub-block">
                        <h4>🏢 La Chambre de commerce et d'industrie de Paris (CCIP)</h4>
                        <p>
                            Trouvez les centres agréés et les procédures d'inscription au lien suivant :
                        </p>
                        <a
                            href="https://francais.cci-paris-idf.fr/candidat?produit=21"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="info-link"
                        >
                            Inscription CCIP - Examen civique ↗
                        </a>
                        <div className="iframe-container">
                            <iframe
                                src="https://francais.cci-paris-idf.fr/candidat?produit=21"
                                title="Inscription CCIP - Examen civique"
                                width="100%"
                                height="600"
                                style={{ border: 'none', borderRadius: '8px' }}
                            />
                        </div>
                    </div>

                    <div className="info-sub-block">
                        <h4>🎓 France Éducation International (FEI)</h4>
                        <p>
                            Trouvez les centres de passation :
                        </p>
                        <a
                            href="https://www.france-education-international.fr/centres-d-examen/carte?type-centre=examen_civique"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="info-link"
                        >
                            Centres de passation de l'examen civique - FEI ↗
                        </a>
                        <p style={{ marginTop: '1rem' }}>
                            Lien pour s'inscrire à l'examen :
                        </p>
                        <a
                            href="https://test-civique.fr/inscription"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="info-link"
                        >
                            Inscription à l'examen civique - FEI ↗
                        </a>
                    </div>

                    <div className="info-sub-block">
                        <h4>📚 Pour l'examen civique mention naturalisation</h4>
                        <p>
                            Trouvez toutes les informations et la liste officielle des questions de connaissance :
                        </p>
                        <a
                            href="https://www.immigration.interieur.gouv.fr/Integration-et-Acces-a-la-nationalite/La-nationalite-francaise/Les-procedures-d-acces-a-la-nationalite-francaise"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="info-link"
                        >
                            Informations officielles - Examen civique naturalisation ↗
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
