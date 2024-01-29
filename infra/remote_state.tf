terraform {
  backend "s3" {
    bucket = "demos3bucket"
    key    = "tfstate/terraform.tfstate"
    region = "eu-west-1"
  }
}
