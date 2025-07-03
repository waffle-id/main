variables {
  image_sha     = "place_image_sha"
  image_web     = "ghcr.io/waffle-id/web"
  ghcr_username = "reiyanyan"
  ghcr_password = "ghcr_password"
  build_number  = "run_number"
  mode          = "mode_env"
  client_id     = "place_client_id"
  client_secret = "place_client_secret"
}

job "job-waffle-web-prod" {
  datacenters = ["dc1"]

  group "group-waffle-web-prod" {
    count = 2
    network {
      port "http" {
        to = -1
      }
    }

    service {
      name = "service-waffle-web-prod"
      port = "http"
    }

    task "task-waffle-web-prod" {
      env {
        PORT    = "${NOMAD_PORT_http}"
        NODE_IP = "${NOMAD_IP_http}"
        MODE    = "${var.mode}"
        BUILD_NUMBER = "${var.build_number}"
        CLIENT_ID = "${var.client_id}"
        CLIENT_SECRET = "${var.client_secret}"
      }

      driver = "docker"

      config {
        image = "${var.image_web}:${var.image_sha}"
        ports = ["http"]
        auth {
          username       = "${var.ghcr_username}"
          password       = "${var.ghcr_password}"
          server_address = "ghcr.io"
        }
      }
    }
  }
}