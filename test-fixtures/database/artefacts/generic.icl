
database "generic" {
    version = 2
}

database "generic2" {
    config = "ok"
}

database "connection" @username, @password, @port, @host from database.generic,
                                                              database.generic2 {
       username = @username,
       password = @password,
       port = @port,
       host = @host,
       extra = {
            description = "username is @username and password is @password"
       }
}
