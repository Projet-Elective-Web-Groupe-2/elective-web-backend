module.exports = {
    branches: ['main', 'feat/NewDeploySemanticRelease'], // Ajoutez la branche de fonctionnalité à surveiller pour les nouvelles versions
    plugins: [
      '@semantic-release/commit-analyzer', // Analyse les messages de commit pour déterminer le type de version
      '@semantic-release/release-notes-generator', // Génère automatiquement les notes de publication
      '@semantic-release/changelog', // Génère automatiquement le journal des modifications
      ['@semantic-release/git', {
        assets: ['package.json', 'CHANGELOG.md'], // Fichiers à inclure dans les commits de version
      }],
    ],
  };
  