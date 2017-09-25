/*variable "http-port" {
    key = {},
    key2 = []
}*/

//variable "http-port" 'titi

/*::app "webapp" as WebApp @port {
    listenOn = 80
}

port "http" apply WebApp @@port = app.webapp.listenOn*/

::app "webapp" as WebApp @parentKey {

}

port "test" apply WebApp @@parentKey = 80