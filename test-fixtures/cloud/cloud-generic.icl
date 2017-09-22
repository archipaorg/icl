

cloud "generic" "instance" {
    project = "",
    provider = "generic",
    region = "us-central-1",
    credentials = "...",
    network = "",
    mem = "4GB",
    cpu = "2"
}

cloud "generic" "sshConnection" {
     sshUsername = "genericUsername",
     sshPassword = "genericPassword"
}

cloud "generic" "policy" {
    restriction = "allowAllTraffic"
}