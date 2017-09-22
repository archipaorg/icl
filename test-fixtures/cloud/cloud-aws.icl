take cloud-generic

aws "generic" from cloud.generic.instance,
                   cloud.generic.sshConnection
{
    sshUsername = "awsUsername",
    sshPassword = "awsPassword"
}