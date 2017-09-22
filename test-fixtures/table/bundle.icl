take app

variable "container-ports" {

    titi "toto" apply core.app @arg=[1,2], @@arg2=variable.container-ports.titi.toto.key

}
//::variable "http-port" 80
//::variable "http-list" [1, [3], variable.httpport]
/*::variable "container-ports" as ContainerPort from app.core @"toto" {
       nginxport = 80
}*/
/*::variable "container-port" apply ContainerPort @@name="nginx", @@containerPort=80
::variable "container-ports" [variable.container-port]
::variable "container" apply Container @@image="nginx:1.13.0", @@name="nginx", @@ports=variable.container-ports
::variable "container-list" [variable.container]
::variable "pod-spec" apply PodSpec @@containers=variable.container-list
::variable "labels" table "app" = "nginx"
::variable "pod-metadata" apply ObjectMeta @@labels=variable.labels
::variable "template" apply PodTemplateSpec @@spec=variable.pod-spec, @@metadata=variable.pod-metadata
::variable "spec" apply DeploymentSpec @@replicas=5, @@template=variable.template
::variable "metadata" apply ObjectMeta @@name = "nginx"

Deployment "hello" apply Deployment @@metadata=variable.metadata, @@spec=variable.spec

// add option to include multiple folders
/*take definitions
::variable "port" apply Port @name="http", @port="80"
::variable "container" apply Container @image="mysql/mysql:v5.6",
                                       @name="mysql",
                                       @@port=variable.port
::variable "containers" [variable.container]
::variable "metadata" table "name" = "nginx"
::variable "deploymentTemplate" apply DeploymentTemplate @@metadata.labels=variable.metadata,
                                                         @@spec.containers=variable.containers
::variable "deploymentSpec" apply DeploymentSpec @@replicas=2,
                                                 @@template=variable.deploymentTemplate

::variable "config" as Config {
    api = 1.0
}

Config "hello-nginx" apply Deployment @@metadata=variable.metadata, @@spec=variable.deploymentSpec*/

/*Deployment "hello" {
    version  = 1,
    metadata = variable.metadata,
    spec     = variable.deploymentSpec
}*/
/*
// examples from https://github.com/kubernetes/kubernetes/blob/master/examples/storage/cassandra/cassandra-controller.yaml
https://cloud.google.com/container-engine/docs/tutorials/persistent-disk/
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 2
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.7.9
        ports:
        - containerPort: 80
*/
