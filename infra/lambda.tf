
data "archive_file" "zip" {
  type        = "zip"
  source_file = "../lambda/index.js"
  output_path = "../lambda/index.zip"
}

resource "aws_lambda_function" "demolambda" {
  filename         = data.archive_file.zip.output_path
  source_code_hash = filebase64sha256(data.archive_file.zip.output_path)

  function_name = var.project_name
  role          = aws_iam_role.lambda_role.arn
  handler       = "index.handler"
  runtime       = "nodejs18.x"
  timeout       = 10
  publish       = true

  depends_on = [aws_api_gateway_rest_api.api_gateway]
}

resource "aws_lambda_alias" "alias_dev" {
  name             = "dev"
  description      = "dev"
  function_name    = aws_lambda_function.demolambda.arn
  function_version = "$LATEST"
}

resource "aws_lambda_alias" "alias_prod" {
  name             = "prod"
  description      = "prod"
  function_name    = aws_lambda_function.demolambda.arn
  function_version = "$LATEST"
}

resource "aws_cloudwatch_log_group" "convert_log_group" {
  name = "/aws/lambda/${aws_lambda_function.demolambda.function_name}"
}
