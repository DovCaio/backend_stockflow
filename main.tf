terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "5.0.0"
    }
    docker = {
      source = "kreuzwerker/docker"
    }
  }


  cloud { 
    
    organization = "stockflow-backend" 

    workspaces { 
      name = "stockflow-workspace" 
    } 
  } 
}

provider "google" {
  project     = var.gcp_project
  region      = var.gcp_region
    credentials = var.gcp_credentials_json
}


resource "google_compute_firewall" "allow_http" {
  name    = "allow-http"
  network = "default"

  direction     = "INGRESS"
  source_ranges = ["0.0.0.0/0"]  # qualquer IP externo

  allow {
    protocol = "tcp"
    ports    = ["80"]
  }

  target_tags = ["nginx-server"]  # tag associada à VM
}

resource "google_compute_instance" "vm" {
  name         = "stockflow-vm"
  machine_type = "e2-medium"
  zone         = var.gcp_zone

  boot_disk {
    initialize_params {
      image = "ubuntu-os-cloud/ubuntu-2204-lts"
    }
  }

  network_interface {
    network       = "default"
    access_config {}
  }

  metadata = {
    ssh-keys = "${var.vm_user}:${var.vm_ssh_key}"
  }
  tags = ["nginx-server"]

}

provider "docker" {
  host = "ssh://ubuntu@34.122.133.99"
  ssh_key = var.vm_ssh_private_key
}

resource "docker_network" "stock_network" {
  name = "stock_network"
}

resource "docker_image" "postgres" {
  name = "postgres:15"
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
    external = 5432
  }
}

resource "docker_image" "backend" {
  name = var.backend_image
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
}

resource "docker_container" "nginx" {
  image = docker_image.nginx.image_id
  name  = "nginx_proxy"

  ports {
    internal = 80
    external = 80
  }

  volumes {
    host_path      = var.nginx_conf_host_path
    container_path = "/etc/nginx/conf.d/default.conf"
  }

  networks_advanced {
    name = docker_network.stock_network.name
  }
}
