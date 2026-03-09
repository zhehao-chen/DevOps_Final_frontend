def call(String state, String description) {
    // state: 'pending' | 'success' | 'failure' | 'error'
    withCredentials([string(credentialsId: 'github-token', variable: 'GH_TOKEN')]) {
        sh """
            curl -s -X POST \
                -H "Authorization: token ${GH_TOKEN}" \
                -H "Content-Type: application/json" \
                -d '{"state":"${state}","description":"${description}","context":"jenkins/pipeline"}' \
                https://api.github.com/repos/zhehao-chen/DevOps_Final_frontend/statuses/${env.GIT_COMMIT}
        """
    }
}
