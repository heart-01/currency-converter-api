 #!/bin/bash

while [ "$1" != "" ]
do
    PARAM=`echo $1 | awk -F= '{print $1}'`
    VALUE=`echo $1 | awk '{st = index($0, "="); print substr($0, st+1)}'`

    case $PARAM 
    in
        -e|--env-docker-compose)
            ENV_FILE="$VALUE"
            ;;
        up|--start-docker-compose)
            MODE="$VALUE -d --build"
            ;;
        down|--down-docker-compose)
            MODE="$VALUE"
            ;;
        *) 
            echo "Usage: $0 -e=[prod|dev]"
            exit 1
            ;;
    esac
    shift
done

if [ "$ENV_FILE" = "prod" ]; then
    docker compose --env-file=.env.production -p currency-converter-api -f docker-compose.prod.yml $MODE
elif [ "$ENV_FILE" = "dev" ]; then
    docker compose --env-file=.env.development -p currency-converter-api -f docker-compose.yml $MODE
else
    echo "Invalid environment specified: $ENV_FILE. Use 'prod' or 'dev' and specify up or down."
    exit 1
fi