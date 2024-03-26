module.exports = {
  branches: ['main', 'develop', 'feat/SemanticReleaseTesting'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    '@semantic-release/npm',
    '@semantic-release/github', // Ajout du plugin GitHub
    ['@semantic-release/git', {
      assets: ['package.json', 'CHANGELOG.md'],
    }],
  ],
  preset: 'conventionalcommits',
  release: {
    branches: [
      { name: 'main', prerelease: false },
      { name: 'develop', prerelease: false },
      { name: 'feat/SemanticReleaseTesting', prerelease: false },
    ],
  },
}
