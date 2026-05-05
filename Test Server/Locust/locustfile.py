from locust import HttpUser, task, between

class CinemaLoadTestUser(HttpUser):
    wait_time = between(1, 3)

    def on_start(self):
        auth_token = process.env.REACT_APP_TOKEN_BACKEND
        self.client.headers.update({
            "Authorization": f"Bearer {auth_token}"
        })

    @task
    def get_cinema_chain_info(self):
        self.client.get(
            "/cinema/get-cinema-chain-info?CinemaChainId=1",
            name="/cinema/get-cinema-chain-info"
        )