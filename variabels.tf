variable "gcp_project" {
  description = "ID do projeto no GCP"
}

variable "gcp_region" {
  default     = "us-central1"
  description = "Região do GCP"
}

variable "gcp_zone" {
  default     = "us-central1-a"
  description = "Zona da VM"
}

variable "vm_user" {
  default     = "ubuntu"
  description = "Usuário para SSH"
}

variable "ssh_private_key_path" {
  default     = "~/.ssh/id_rsa"
  description = "Caminho para a chave privada SSH"
}

variable "db_name" {
  default     = "stockflow_db"
  description = "Nome do banco de dados Postgres"
}

variable "db_user" {
  default     = "stockflow"
  description = "Usuário do banco de dados"
}

variable "db_password" {
  default     = "anhardpassword"
  description = "Senha do banco de dados"
  sensitive   = true
}

variable "nginx_conf_host_path" {
  default     = "/home/ubuntu/nginx.conf"
  description = "Caminho do arquivo de configuração do Nginx no host"
}

variable "gcp_credentials_json" {
  type      = string
  sensitive = true
}

variable "gcp_vm_ip" {
  type      = string
  sensitive = true
}

variable "backend_image" {
  type = string
}

variable "vm_ssh_key" {
  type = string
  sensitive = true

}

