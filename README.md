# aws-lambda-workplace
different api calls for aws lambda to work with Perceptive Workplace

## installation

1. git clone
2. npm install
3. echo $GIT_COMMIT_HASH
4. zip -r insights-pusher-$GIT_COMMIT_HASH.zip *
5. upload zip to amazon aws lambda
6. configure the lambda Handler (companies-loader.handler)

## issues
- if aws lambda tells you that superagent couldn't be found then you haven't read the installation instructions ;) (npm install)
