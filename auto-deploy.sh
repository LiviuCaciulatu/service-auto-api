#!/usr/bin/env bash
set -euo pipefail

die() { echo "ERROR: $*" >&2; exit 1; }
have() { command -v "$1" >/dev/null 2>&1; }
require_env() { local name="$1"; [[ -n "${!name:-}" ]] || die "Missing required env var: ${name} (set it in .env)"; }

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR" && pwd)"
ENV_FILE="$PROJECT_ROOT/.env"

[[ -f "$ENV_FILE" ]] || die "Missing .env in project root: $ENV_FILE (create it or copy from .env.example)."

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

require_env "AUTO_DEPLOYMENT_AWS_REGION"
require_env "AUTO_DEPLOYMENT_AWS_ACCOUNT_ID"
require_env "AUTO_DEPLOYMENT_ECR_REPO"
require_env "AUTO_DEPLOYMENT_IMAGE_TAG"
require_env "AUTO_DEPLOYMENT_PLATFORMS"
require_env "AUTO_DEPLOYMENT_BUILDER_NAME"

AWS_REGION="${AUTO_DEPLOYMENT_AWS_REGION}"
AWS_ACCOUNT_ID="${AUTO_DEPLOYMENT_AWS_ACCOUNT_ID}"
ECR_REPO="${AUTO_DEPLOYMENT_ECR_REPO}"
IMAGE_TAG="${AUTO_DEPLOYMENT_IMAGE_TAG}"
PLATFORMS="${AUTO_DEPLOYMENT_PLATFORMS}"
BUILDER_NAME="${AUTO_DEPLOYMENT_BUILDER_NAME}"

[[ "$AWS_ACCOUNT_ID" =~ ^[0-9]{12}$ ]] || die "AUTO_DEPLOYMENT_AWS_ACCOUNT_ID must be a 12-digit AWS account id."
[[ -n "$AWS_REGION" ]] || die "AUTO_DEPLOYMENT_AWS_REGION is empty."
[[ -n "$ECR_REPO" ]] || die "AUTO_DEPLOYMENT_ECR_REPO is empty."
[[ -n "$IMAGE_TAG" ]] || die "AUTO_DEPLOYMENT_IMAGE_TAG is empty."

ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
IMAGE_URI="${ECR_REGISTRY}/${ECR_REPO}:${IMAGE_TAG}"

have aws    || die "AWS CLI not found. Install AWS CLI v2 and try again."
have docker || die "Docker not found. Install Docker Desktop (Mac/Windows) or Docker Engine (Linux)."

docker info >/dev/null 2>&1 || die "Docker daemon is not running. Start Docker Desktop / Docker service, then retry."
docker buildx version >/dev/null 2>&1 || die "docker buildx is not available. Update Docker (Docker Desktop includes buildx)."

CALLER_ACCOUNT="$(aws sts get-caller-identity --region "$AWS_REGION" --query Account --output text 2>/dev/null || true)"
[[ -n "$CALLER_ACCOUNT" ]] || die "AWS credentials are not available or have expired. Run 'aws sso login' or set AWS_PROFILE."
[[ "$CALLER_ACCOUNT" == "$AWS_ACCOUNT_ID" ]] || die "AWS account mismatch. Expected $AWS_ACCOUNT_ID but your CLI is authenticated to $CALLER_ACCOUNT."

aws ecr describe-repositories --region "$AWS_REGION" --repository-names "$ECR_REPO" >/dev/null 2>&1 \
  || die "ECR repo '${ECR_REPO}' not found in region '${AWS_REGION}' (or you lack permissions)."

echo "Deploy push configuration:"
echo "  Project root: ${PROJECT_ROOT}"
echo "  Region:       ${AWS_REGION}"
echo "  Registry:     ${ECR_REGISTRY}"
echo "  Repo:         ${ECR_REPO}"
echo "  Tag:          ${IMAGE_TAG}"
echo "  Image:        ${IMAGE_URI}"
echo "  Platforms:    ${PLATFORMS}"
echo "  Builder:      ${BUILDER_NAME}"
echo

aws ecr get-login-password --region "${AWS_REGION}" \
  | docker login --username AWS --password-stdin "${ECR_REGISTRY}" \
  || die "Docker login to ECR failed. Check AWS permissions for ECR and retry."

docker buildx create --use --name "${BUILDER_NAME}" 2>/dev/null || docker buildx use "${BUILDER_NAME}"
docker buildx inspect --bootstrap >/dev/null

docker buildx build --platform "${PLATFORMS}" -t "${IMAGE_URI}" --push "${PROJECT_ROOT}" \
  || die "Build/push failed. Review output above for details."

echo
echo "SUCCESS: pushed ${IMAGE_URI}"
