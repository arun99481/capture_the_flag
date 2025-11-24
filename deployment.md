# Deployment Guide

## Prerequisites
1.  **AWS EC2 Instance**: A running instance (Ubuntu recommended) with Docker and Docker Compose installed.
2.  **Domain (Optional)**: A domain name pointing to your EC2 Public IP.

## AWS Configuration

### 1. Security Groups
Ensure your EC2 instance's Security Group allows the following inbound traffic:
-   **SSH (Port 22)**: Allow from your IP address (for management).
-   **HTTP (Port 80)**: Allow from Anywhere (0.0.0.0/0) - Required for ACME challenges and initial redirect.
-   **HTTPS (Port 443)**: Allow from Anywhere (0.0.0.0/0) - Required for secure traffic.

### 2. DNS Configuration
Go to your domain registrar (e.g., GoDaddy, Namecheap, Route53) and manage DNS records for `tartanctf.com`:
-   **A Record**: Host `@` points to your EC2 Public IP.
-   **CNAME Record**: Host `www` points to `tartanctf.com` (or create another A record pointing to the IP).

Wait for DNS propagation (can take minutes to hours) before running Certbot.

### 3. ECR Repositories
You need to create the ECR repositories to store your Docker images. Run these commands locally (if you have AWS CLI configured) or use the AWS CloudShell/Console:

```bash
aws ecr create-repository --repository-name tartan-ctf-api --region us-east-2
aws ecr create-repository --repository-name tartan-ctf-web --region us-east-2
```

## Setup Steps

### 1. Server Setup
SSH into your EC2 instance and install Docker:
```bash
# Install Docker & Docker Compose
sudo apt-get update
sudo apt-get install -y docker.io docker-compose
sudo usermod -aG docker $USER
# Log out and log back in for group changes to take effect
```

Clone the repository:
```bash
git clone <your-repo-url> capture_the_flag
cd capture_the_flag
```

### 2. GitHub Secrets
Go to your repository on GitHub -> Settings -> Secrets and Variables -> Actions -> New Repository Secret.
Add the following secrets:

| Secret Name | Description |
|---|---|
| `HOST` | Public IP address or DNS of your EC2 instance |
| `USERNAME` | SSH username (usually `ubuntu` for AWS Ubuntu images) |
| `SSH_KEY` | The private key (`.pem` content) used to access the instance |

### 3. Environment Variables
On the server, create a `.env` file in the `capture_the_flag` directory with your production secrets:

```bash
POSTGRES_USER=postgres
POSTGRES_PASSWORD=very_secure_password_here
POSTGRES_DB=tartan_ctf
JWT_SECRET=another_secure_secret_here
# Add other keys as needed
```

### 4. First Deployment
You can trigger the deployment by pushing to the `main` branch, or manually running the "Deploy to EC2" workflow in the GitHub Actions tab.

## Nginx & SSL
To enable HTTPS for `tartanctf.com`:

1.  **Install Certbot** on your EC2 instance (host machine):
    ```bash
    sudo apt-get update
    sudo apt-get install -y certbot
    ```

2.  **Generate Certificates**:
    Stop any running containers on port 80 first (if Nginx is already running):
    ```bash
    docker-compose -f docker-compose.prod.yml down
    ```
    Run Certbot in standalone mode:
    ```bash
    sudo certbot certonly --standalone -d tartanctf.com -d www.tartanctf.com
    ```
    Follow the prompts. This will save certificates to `/etc/letsencrypt/live/tartanctf.com/`.

3.  **Deploy**:
    Start the containers again. The `nginx` service is configured to mount the certificates from the host.
    ```bash
    docker-compose -f docker-compose.prod.yml up -d
    ```

4.  **Renewal**:
    To renew certificates in the future:
    ```bash
    # Stop nginx temporarily
    docker stop tartan_ctf_nginx
    # Renew
    sudo certbot renew
    # Start nginx
    docker start tartan_ctf_nginx
    ```
