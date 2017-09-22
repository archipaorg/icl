take definitions

app "mywebapp" as webapp from core.memory {
    name = "webapp",

    //tags = ["frontend", "app"]

    configuration "environment" table "init_on_start" = true,
                                      "commit_tx"     = true
}

/**
 inherit from an alias*/

job "db_backup" from image @"https://github.com" {

}
/**
 table of key, value elements*/

app "mywebapp" "dns" table "localhost" = "127.0.0.1",
                           "local"     = "127.0.0.1"

// dns table definition
network "dns" "alias" table "alias-service-cassandra" = "cassandra",
                            "alias-service-solr"      = "solr-bly",
                            "nalias-service-geo"       = "bly-geo"


_ "tags" ["frontend"]

_ "apiKey" 'abcde'
/*::app "hello-world" as HelloWorld {
   apiKey = "abcde"
}*/

//HelloWorld "_" {}

/*::app "hello-world" as HelloWorld {
   apiKey = "abcde"
}

//HelloWorld "_" {}*/

//_ "_" apply HelloWorld @@apiKey="abcde"
