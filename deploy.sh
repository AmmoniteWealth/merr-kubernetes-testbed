docker build -t melanieammonite/k8s-client:latest -t melanie/ammonite/k8s-client:$SHA -f ./client/Dockerfile ./client
docker build -t melanie/ammonite/k8s-server:latest -t melanie/ammonite/k8s-server:$SHA -f ./server/Dockerfile ./server
docker build -t melanie/ammonite/k8s-redis:latest -t melanie/ammonite/k8s-redis:$SHA -f ./worker/Dockerfile ./worker

docker push melanieammonite/k8s-client:latest
docker push melanie/ammonite/k8s-server:latest
docker push melanie/ammonite/k8s-redis:latest

docker push melanieammonite/k8s-client:$SHA
docker push melanie/ammonite/k8s-server:$SHA
docker push melanie/ammonite/k8s-redis:$SHA

kubectl apply -f \
https://raw.githubusercontent.com/mongodb/mongodb-atlas-kubernetes/main/deploy/all-in-one.yaml

kubectl apply -f - mongo-k8s/mongo-atlas-project.yaml
kubectl apply -f - mongo-k8s/mongo-atlas-cluster.yaml

kubectl get atlasclusters my-atlas-cluster -o=jsonpath='{.status.conditions[?(@.type=="Ready")].status}'  

True

kubectl apply -f - mongo-k8s/mongo-atlas-user.yaml

kubectl apply -f k8s
kubectl set image deployments/server-deployment server=melanie/ammonite/k8s-server:$SHA
kubectl set image deployments/client-deployment client=melanieammonite/k8s-client:$SHA
kubectl set image deployments/redis-deployment worker=melanie/ammonite/k8s-redis:$SHA