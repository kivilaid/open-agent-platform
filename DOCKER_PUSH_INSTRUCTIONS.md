# Docker Push Instructions

To push the Docker image to GitHub Container Registry, follow these steps:

## 1. Create a Personal Access Token (PAT)

1. Go to GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)
2. Click "Generate new token"
3. Give it a name like "Docker Registry"
4. Select scopes:
   - `write:packages` (to push images)
   - `read:packages` (to pull images)
   - `delete:packages` (optional, to delete images)
5. Click "Generate token" and copy it

## 2. Login to GitHub Container Registry

```bash
# Replace YOUR_PAT with your actual token
export CR_PAT=YOUR_PAT

# Login to ghcr.io
echo $CR_PAT | docker login ghcr.io -u kivilaid --password-stdin
```

## 3. Push the Docker Image

```bash
# The image is already tagged, just push it
docker push ghcr.io/kivilaid/open-agent-platform:latest
docker push ghcr.io/kivilaid/open-agent-platform:$(git rev-parse --short HEAD)
```

## 4. Make the Image Public (Optional)

By default, the image will be private. To make it public:

1. Go to https://github.com/kivilaid?tab=packages
2. Click on the `open-agent-platform` package
3. Click "Package settings"
4. Scroll down to "Danger Zone" and click "Change visibility"
5. Select "Public"

## 5. Verify the Image

After pushing, the image will be available at:
- https://github.com/kivilaid/open-agent-platform/pkgs/container/open-agent-platform

## Automated Builds

Once you push to the main branch, GitHub Actions will automatically:
1. Build the Docker image
2. Push it to GitHub Container Registry
3. Tag it appropriately

You can monitor the builds at:
https://github.com/kivilaid/open-agent-platform/actions