## VList

My brother wrote a simple app a couple of years ago, so, i decided to deploy it using k8s (statefulsets, pv, pvc and etc.), ansible roles, mongodb, and other staff in ci/cd pipeline. 

The app was deployed on bare metal using kubernetes cluster that was configured via ansible on home server. The requests is forwarded via NAT on mikrotik.

**The architecture:**
- 5 Ubuntu live server VM's (1 master node, 2 worker nodes, 1 nginx proxy server, 1 NFS server)
- containerized using Docker
- architecture configured using Ansible roles
- Deployd to k8s cluster
- MongoDb database data persisted to seperate NFS server.

**CI/CD Pipeline**
- GitHub Actions
  - build.yml: build and push app code.
  - deploy.yml: install kubectl and then restart deployments in k8s cluster using KUBECONFIG.

**K8S files**

This is far the most comperhensive k8s experience I had. I used Deployment component to scale front and back to 3 replicas, then I used StateFulSet for horizontal scaling of MongoDb. 

I worked with replicasets in MongoDb and found it as a really amazing tool. Also I learned about headless services and more about horizontal scaling. 

Also I did dynamic provisioning for every replicaset and created some pv's.

**Ansible roles**

This is my first time using ansible roles, it makes ansible more clean and efficient for working with.


## P.S.

This app does not exist now as I practice a lot on the server and I need physical memory, RAM and CPU. That's why CD and Ansible can be failed.
