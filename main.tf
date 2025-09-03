terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "3.6.2"
    }
  }
}

variable "db_name" {
  type    = string
  default = "stockflow_db"
}

variable "db_user" {
  type    = string
  default = "stockflow"
}

variable "db_password" {
  type    = string
  default = "anhardpassword"
}

provider "docker" {}

resource "docker_network" "stock_network" {
  name = "stock_network"
}

resource "docker_image" "postgres" {
  name = "postgres:15"  # versão do Postgres
}

resource "docker_container" "postgres" {
  image = docker_image.postgres.image_id
  name  = "postgres_db"

  env = [
    "POSTGRES_DB=${var.db_name}",
    "POSTGRES_USER=${var.db_user}",
    "POSTGRES_PASSWORD=${var.db_password}"
  ]

  networks_advanced {
    name = docker_network.stock_network.name
  }

  ports {
    internal = 5432
  }

  volumes {
    container_path = "/var/lib/postgresql/data"
  }
}

resource "docker_image" "backend" {
  name = "meu_backend:latest"
  build {
    context    = "${path.module}"
    dockerfile = "Dockerfile"
    target = "prod"
  }
}


resource "docker_container" "backend" {
  image = docker_image.backend.image_id
  name  = "backend"

  networks_advanced {
    name = docker_network.stock_network.name
  }

  env = [
    "DATABASE_URL=postgresql://${var.db_user}:${var.db_password}@postgres_db:5432/${var.db_name}"
  ]

  ports {
    internal = 3000
  }
}

resource "docker_image" "nginx" {
    name = "nginx:latest"
    keep_locally = false
}

resource "docker_container" "nginx" {
  image = "nginx:latest"
  name  = "nginx_proxy"

  ports {
    internal = 80
    external = 80
  }

  volumes {
    host_path      = "/home/caiojhonatanalvespereira/devops/projetoDaDisciplina/stockflow/nginx.conf"
    container_path = "/etc/nginx/conf.d/default.conf"
  }

  networks_advanced {
    name = docker_network.stock_network.name
  }
}
