# Kubernetes Deployment Strategy

## Overview

This project uses **Rolling Update** as the primary deployment strategy across all services. The strategy is applied consistently to frontend-service, product-service, and order-service.

---

## Rolling Update Strategy

### Configuration

Each service Deployment is configured with:

```yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 1        # Allow 1 extra pod during update
    maxUnavailable: 0  # Never reduce below desired replica count
```

### How It Works

1. Jenkins builds and pushes a new image (e.g., `zhehaochen/product-service:build.12-git.abc1234`)
2. `kubectl apply` updates the Deployment with the new image tag
3. Kubernetes spins up **1 new pod** with the new version (maxSurge: 1)
4. Only after the new pod passes its readiness check does Kubernetes terminate 1 old pod
5. This repeats until all pods are running the new version
6. `kubectl rollout status` in Jenkins waits and confirms completion (timeout: 3 min)

### Why Rolling Update

| Criteria | Rolling Update | Blue-Green | Canary |
|----------|---------------|------------|--------|
| Downtime | Zero | Zero | Zero |
| Resource usage | Low (+1 pod) | High (2x pods) | Medium |
| Rollback speed | Moderate | Instant | Gradual |
| Complexity | Low | Medium | High |
| Use case | Standard updates | Critical services | Gradual traffic shift |

Rolling Update is the right choice for this project because:
- **Zero downtime**: `maxUnavailable: 0` ensures service is always available
- **Low overhead**: Only 1 extra pod needed during transition
- **Simple to operate**: No additional tooling (Argo Rollouts, Istio, etc.) required
- **Built-in rollback**: `kubectl rollout undo` instantly reverts to the previous version

---

## Namespace Separation

Three isolated environments using Kubernetes namespaces:

| Namespace | Branch | Purpose |
|-----------|--------|---------|
| `dev` | `develop` | Development and integration testing |
| `staging` | `release/*` | Pre-production validation |
| `prod` | `main` | Production (requires manual approval in Jenkins) |

Each namespace has a **ResourceQuota** to prevent resource exhaustion:

```yaml
hard:
  requests.cpu: "1"
  requests.memory: 2Gi
  limits.cpu: "2"
  limits.memory: 4Gi
  pods: "20"
```

---

## Service Topology

```
Internet
    │
    ▼
NodePort Services (Minikube access)
    ├── frontend-service-nodeport  :30000 → Pod :3000
    ├── product-service-nodeport   :30001 → Pod :5001
    └── order-service-nodeport     :30002 → Pod :5002

Internal ClusterIP (service-to-service)
    ├── frontend-service   → product-service:5001
    │                      → order-service:5002
    ├── product-service    → postgres:5432
    ├── order-service      → postgres:5432
    │                      → product-service:5001
    └── postgres           (no external access)
```

---

## Rollback Procedure

### Automatic (Jenkins failure)

If `kubectl rollout status` times out, the Jenkins stage fails and no further stages run. The previous pods remain running.

### Manual rollback

```bash
# Undo last deployment
kubectl rollout undo deployment/product-service -n dev

# Rollback to a specific revision
kubectl rollout history deployment/product-service -n dev
kubectl rollout undo deployment/product-service -n dev --to-revision=2
```

---

## Image Tagging Strategy

| Tag format | Example | Usage |
|-----------|---------|-------|
| `build.{N}-git.{sha}` | `build.12-git.abc1234` | Unique per Jenkins build (immutable) |
| `dev-latest` | `dev-latest` | Always points to latest develop build |
| `staging-latest` | `staging-latest` | Always points to latest release build |
| `prod-latest` | `prod-latest` | Always points to latest production build |

Jenkins deploys using the immutable `build.N-git.sha` tag to ensure reproducibility.
