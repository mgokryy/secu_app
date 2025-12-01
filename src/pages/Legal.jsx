export default function Legal() {
  return (
    <div style={{ maxWidth: "800px", margin: "20px auto" }}>
      <h2>Mentions légales & Politique de confidentialité</h2>
      <p>
        Ce site est un projet pédagogique réalisé dans le cadre du module
        « Sécurité des Applications Web ».
      </p>

      <h3>Responsable du site</h3>
      <p>
        Nom du responsable pédagogique : Votre Nom<br />
        Contact : votre.email@example.com
      </p>

      <h3>Données collectées</h3>
      <p>
        Nous collectons uniquement les données strictement nécessaires
        au fonctionnement de l&apos;application :
      </p>
      <ul>
        <li>Adresse email (authentification et connexion au compte)</li>
        <li>Mot de passe (stocké de manière hachée avec bcrypt)</li>
        <li>Nom (affichage dans l&apos;interface et les classements)</li>
        <li>Consentement explicite au traitement des données</li>
      </ul>

      <h3>Finalité du traitement</h3>
      <p>
        Les données sont utilisées uniquement pour :
      </p>
      <ul>
        <li>Créer un compte utilisateur sécurisé</li>
        <li>Permettre l&apos;authentification et l&apos;accès aux grilles</li>
        <li>Afficher le nom dans les scores / classements</li>
      </ul>

      <h3>Durée de conservation</h3>
      <p>
        Les données sont conservées pendant la durée du projet pédagogique
        uniquement, puis peuvent être supprimées.
      </p>

      <h3>Vos droits</h3>
      <p>
        Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès,
        de rectification et de suppression de vos données. Pour toute demande,
        contactez le responsable du site.
      </p>
    </div>
  );
}


