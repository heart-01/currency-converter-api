#!/bin/bash
display_help () {
    printf "======================================\n"
    printf "usages \n"
    printf "======================================\n"
    printf "This is a script to run docker compose\n"
    printf "\t-h --help \t\t\t Display help. \n"
    printf "\t-e --environment \t\t Select environment to run docker compose prod or docker compose \n"
    printf "\tup --start  \t\t\t Run start docker compose \n"
    printf "\tdown --stop  \t\t\t Stop docker compose \n"
    printf "\n======================================\n"
    printf "Examples \n"
    printf "======================================\n"
    printf "example#1 - use start service production:  ./start_service.sh -e=prod up \n"
    printf "example#2 - use start service dev:  ./start_service.sh -e=dev up \n"
    printf "example#3 - use stop service dev:  ./start_service.sh -e=dev down \n"
    exit 1
}

while [ "$1" != "" ]
do
    PARAM=`echo $1 | awk -F= '{print $1}'`
    VALUE=`echo $1 | awk '{st = index($0, "="); print substr($0, st+1)}'`

    case $PARAM 
    in
        -h|--help)
            display_help
            exit
            ;;
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