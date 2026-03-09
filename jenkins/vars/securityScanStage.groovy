def call() {
    echo "=== Security Scan Stage ==="
    // Dependency vulnerability scan
    sh 'npm audit --audit-level=critical'
    // Static analysis via Trivy filesystem scan
    sh '''
        docker run --rm \
            -v $(pwd):/workspace \
            aquasec/trivy fs \
            --severity CRITICAL \
            --exit-code 1 \
            /workspace
    '''
}
