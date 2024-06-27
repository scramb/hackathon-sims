provider "google" {
  project = var.project
  region  = var.region
}

resource "google_sql_database_instance" "instance" {
  name             = var.instance_name
  database_version = "POSTGRES_13" # Use "MYSQL_8_0" for MySQL or other versions as needed
  region           = var.region

  settings {
    tier = "db-f1-micro" # Change as needed

    ip_configuration {
      ipv4_enabled = true
      authorized_networks {
        name  = "public-network"
        value = "0.0.0.0/0"
      }
    }
  }
}

resource "google_sql_database" "database" {
  name     = var.database_name
  instance = google_sql_database_instance.instance.name
}

resource "google_sql_user" "user" {
  name     = var.database_user
  instance = google_sql_database_instance.instance.name
  password = var.database_password
}
