def call(String imageName, String imageTag, String envTag) {
    echo "=== Container Push Stage ==="
    withCredentials([usernamePassword(
        credentialsId: 'dockerhub-credentials',
        usernameVariable: 'DOCKER_USER',
        passwordVariable: 'DOCKER_PASS'
    )]) {
        sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
        sh "docker push ${imageName}:${imageTag}"
        sh "docker push ${imageName}:${envTag}"
    }
}
