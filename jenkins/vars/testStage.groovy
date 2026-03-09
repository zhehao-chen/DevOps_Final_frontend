def call() {
    echo "=== Test Stage ==="
    // Unit tests (CI=true prevents watch mode)
    sh 'CI=true npm test -- --coverage --watchAll=false'
}
