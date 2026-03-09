def call() {
    echo "=== Build Stage ==="
    sh 'npm ci'
    sh 'npm run build'
    // Lint (react-scripts includes eslint)
    sh 'npx eslint src/ --max-warnings=0 || true'
}
