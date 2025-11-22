# AWS Deployment Guide for TartanCTF

## Prerequisites
- AWS CLI installed and configured.
- Docker installed.
- GitHub Repository set up.

## 1. Infrastructure Setup (AWS Console or Terraform)

### Networking
- Create a VPC with 2 Public Subnets and 2 Private Subnets.
- Create an Internet Gateway and NAT Gateway.

### Database (RDS)
- Launch an **Amazon RDS for PostgreSQL** instance.
- **Subnet Group**: Use Private Subnets.
- **Security Group**: Allow inbound on port 5432 from the ECS Security Group.
- **Credentials**: Store username/password in AWS Secrets Manager.

### Container Registry (ECR)
- Create two repositories:
    - `tartan-ctf-api`
    - `tartan-ctf-web`

### Compute (ECS Fargate)
- Create a Cluster: `tartan-ctf-cluster`.
- **Task Definitions**:
    - Create `tartan-ctf-api-task`:
        - Image: `<AWS_ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/tartan-ctf-api:latest`
        - CPU: 512, Memory: 1024
        - Env Vars:
            - `DATABASE_URL`: `postgresql://...` (Use Secrets Manager valueFrom)
            - `CLERK_SECRET_KEY`: `...`
            - `OPENAI_API_KEY`: `...`
        - Port Mappings: 3001
    - Create `tartan-ctf-web-task`:
        - Image: `<AWS_ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/tartan-ctf-web:latest`
        - CPU: 512, Memory: 1024
        - Env Vars:
            - `NEXT_PUBLIC_API_URL`: Load Balancer DNS for API
            - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: `...`
        - Port Mappings: 3000

### Load Balancing (ALB)
- Create an Application Load Balancer (Internet Facing).
- **Target Groups**:
    - `tg-api`: Port 3001 (HTTP), Health check `/api/health` (or `/`)
    - `tg-web`: Port 3000 (HTTP), Health check `/`
- **Listeners**:
    - Port 80/443:
        - Rule 1: If path pattern `/api/*` -> Forward to `tg-api`
        - Default: Forward to `tg-web`

## 2. GitHub Actions Setup
1. Go to GitHub Repo -> Settings -> Secrets.
2. Add:
    - `AWS_ACCESS_KEY_ID`
    - `AWS_SECRET_ACCESS_KEY`
3. Ensure `.aws/task-definition-api.json` and `.aws/task-definition-web.json` exist in the repo (export them from AWS Console after creating the initial task defs).

## 3. Secrets Management
Use **AWS Secrets Manager** to store sensitive config.
- Secret Name: `prod/tartan-ctf`
- Keys: `DATABASE_URL`, `CLERK_SECRET_KEY`, `OPENAI_API_KEY`.
- In ECS Task Definition, reference these using `valueFrom`.

## 4. Static Assets (Optional Optimization)
For better performance, upload `.next/static` to S3 and serve via CloudFront.
- Update `next.config.js` with `assetPrefix`.
- Add a step in CI/CD to sync `apps/web/.next/static` to S3.
