def call(String environment, String imageName, String imageTag) {
    echo "=== Deploy Stage: ${environment} | image: ${imageName}:${imageTag} ==="

    // Inject the actual image tag into the K8s manifest
    sh """
        sed 's|IMAGE_TAG_PLACEHOLDER|${imageTag}|g' k8s/deployment.yaml > k8s/deployment-${environment}.yaml
    """

    switch(environment) {
        case 'dev':
            sh "kubectl apply -f k8s/deployment-${environment}.yaml --namespace=dev"
            break
        case 'staging':
            sh "kubectl apply -f k8s/deployment-${environment}.yaml --namespace=staging"
            break
        case 'prod':
            sh "kubectl apply -f k8s/deployment-${environment}.yaml --namespace=prod"
            break
        default:
            error "Unknown environment: ${environment}"
    }

    echo "Deployed ${imageName}:${imageTag} to ${environment}"
}
