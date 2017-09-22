::app "webapp" as WebApp {
    parentKey = 2
}

WebApp "http-port"  {
    key = app.webapp.parentKey,
    testKey = {
        test = app.webapp.parentKey
    }
}