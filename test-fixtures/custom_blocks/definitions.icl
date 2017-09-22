::core "task" as app {
    name = "task",
    type = "web"
}

::core "memory" {
    min = 1024,
    max = 8096
}

::core "image" as image @url {
    url = @url
}

git "url" "https://github.com"
git "pull" true
git "retry" 2
