def call(String imageName, String imageTag, String envTag) {
    echo "=== Container Build Stage ==="
    echo "Primary tag : ${imageName}:${imageTag}"
    echo "Env alias   : ${imageName}:${envTag}"
    sh "docker build -t ${imageName}:${imageTag} -t ${imageName}:${envTag} ."
}
