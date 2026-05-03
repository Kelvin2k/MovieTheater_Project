pipeline {
    agent any

    environment {
        DEPLOY_PATH = '/root/MovieTheater_Project'
        VPS_IP = '134.209.126.127'
        BACKEND_PATH = 'Cinema-Project-Backend'
        FRONTEND_PATH = 'Cinema-Project-FrontEnd'
    }

    stages {

        /*
        TEST BUILD ON JENKINS
        stage('test build backend') {
            steps {
                withCredentials([
                    string(credentialsId:'DATABASE_URL', variable:'DB_URL'),
                    string(credentialsId:'VPS_IP', variable:'VPS_IP_SECRET')
                    ])
                    {
                        sh """
                            # Access into backend folder that git just pulled to Jenkins' workplace
                            cd ${BACKEND_PATH}

                            # set environment variables for build
                            export DATABASE_URL=${DB_URL}
                            export VPS_IP=${VPS_IP_SECRET}

                            # build
                            yarn install
                            yarn prisma generate
                            yarn run build
                        """
                    }
            }
        }

        stage('test build frontend') {
            steps {
                withCredentials([
                    string(credentialsId:'REACT_APP_API_URL', variable:'API_URL')
                    ])
                    {
                        sh """
                            # Access into frontend folder that git just pulled to Jenkins' workplace
                            cd ${FRONTEND_PATH}

                            # set environment variables for build
                            export REACT_APP_API_URL=${API_URL}

                            # build
                            yarn install
                            yarn run build
                        """
                    }
            }
        }
        */


        stage('deploy') {
            steps {
                withCredentials([
                    sshUserPrivateKey(credentialsId: 'SSH_KEY', keyFileVariable: 'KEY', usernameVariable: 'SSH_USER')
                    ])
                    {
                        sh """
                            ssh -o StrictHostKeyChecking=no -i \${KEY} \${SSH_USER}@${VPS_IP} << EOF
                                cd ${DEPLOY_PATH} && git pull
                                docker-compose down
                                docker-compose build
                                docker-compose up -d
EOF
                        """
                    }
            }
        }
    }
}
