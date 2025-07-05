
variables {
  image_sha     = "place_image_sha"
  image_docs  = "ghcr.io/waffle-id/docs"
  ghcr_username = "reiyanyan"
  ghcr_password = "ghcr_password"
  build_number  = "run_number"
  mode          = "mode_env"
}

job "job-waffle-docs-prod" {
  datacenters = ["dc1"]

  group "group-waffle-docs-prod" {
    count = 1
    network {
      port "http" {
        to = -1
      }
    }

    restart {
      attempts = 2
      interval = "1m"
      delay    = "5s"
      mode     = "delay"
    }

    service {
      name = "service-waffle-docs-prod"
      port = "http"
      check {
        type     = "http"          # Health check type
        path     = "/"       # Endpoint to check
        interval = "5s"           # How often to check
        timeout  = "3s"            # Timeout for the check
      }
    }

    task "task-waffle-docs-prod" {
      env {
        PORT    = "${NOMAD_PORT_http}"
        NODE_IP = "${NOMAD_IP_http}"
        MODE    = "${var.mode}"
        BUILD_NUMBER = "${var.build_number}"
      }

      driver = "docker"

      config {
        image = "${var.image_docs}:${var.image_sha}"
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
