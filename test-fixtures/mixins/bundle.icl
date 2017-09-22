::mixins "port" as Port @name, @port {
    name = @name,
    port = @port,
    description = "",
    annotations = {
        description = "",
        protocol = "protocol is @protocol"
    }
}


::variable "description" "nginx http port"

variable "port" apply Port @name="http", @port=80,
                                         @protocol="http",
                                         @@description=variable.description,
                                         @@annotations.description="some annotations"