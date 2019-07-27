#!/bin/sh
set -e

export docker_registry="10.150.3.163:5001"
export docker_tag="${docker_registry}/sb-ui-grunt"

images() {
    docker_images="node:4.2.4-wheezy ruby:2.1 selenium/hub:2.48.2 selenium/node-chrome:2.48.2 selenium/node-firefox:2.48.2"

    for  i in ${docker_images}; do
        docker pull ${i}
    done
}

network() {
    docker network inspect ${1} 1> /dev/null 2> /dev/null || docker network create ${1}
    echo "Docker Network: \"${1}\" created"
}

buildArgs() {
    echo "${docker_build_args} --build-arg ${1}=${2}"
}

build() {
    if [ -n "${http_proxy}" ]; then
        docker_build_args=$(buildArgs "http_proxy" ${http_proxy})
        docker_build_args=$(buildArgs "https_proxy" ${http_proxy})
    fi

    if [ -n "${no_proxy}" ]; then
        docker_build_args=$(buildArgs "no_proxy" ${no_proxy})
    fi

    docker build --force-rm ${docker_build_args} -t ${docker_tag} .
}

clean() {
    rm -rf target/
    rm -rf reports/
    rm -rf distri/
}

startGrid() {
    network ${docker_network}
    firefox_nodes=${1:-"1"}
    chrome_nodes=${2:-"1"}

    docker-compose -f grid.yml scale hub=1 firefox=${firefox_nodes} chrome=${chrome_nodes}
}

stopGrid() {
    docker-compose -f grid.yml down
}

grid() {
    case ${1} in
        'up')
        startGrid ${2} ${3}
        ;;
        'down')
        stopGrid
        ;;
    esac
}

startAcceptanceEnv() {
    mkdir -p target/main

    network ${docker_network}
    docker-compose -f acceptance.yml up -d
}

stopAcceptanceEnv() {
    docker-compose -f acceptance.yml down
}

acceptanceEnv() {
    case ${1} in
        'up')
        startAcceptanceEnv
        ;;
        'down')
        stopAcceptanceEnv
        ;;
    esac
}

startNginx() {
    docker run --rm -ti --name=contracts --net=sbtest -v ${project_dir}/nginx.conf:/etc/nginx/nginx.conf -v /var/www/cache -p 9100:9100 nginx
}

run() {
    network ${docker_network}
    project_dir=$(pwd)

    docker run --rm \
    --name=sb-ui \
    --net=${docker_network} \
    -p 8080:8080 \
    -v ${project_dir}/Gruntfile.js:/sb-ui/Gruntfile.js \
    -v ${project_dir}/bower.json:/sb-ui/bower.json \
    -v ${project_dir}/.bowerrc:/sb-ui/.bowerrc \
    -v ${project_dir}/.jshintrc:/sb-ui/.jshintrc \
    -v ${project_dir}/src:/sb-ui/src \
    -v ${project_dir}/grunt-tasks:/sb-ui/grunt-tasks \
    -v ${project_dir}/grunt-config:/sb-ui/grunt-config \
    -v ${project_dir}/target:/sb-ui/target \
    -v ${project_dir}/distri:/sb-ui/distri \
    -v ${project_dir}/reports:/sb-ui/reports \
    ${docker_tag} \
    ${@}
}

if [ -z "${docker_network}" ]; then
    export docker_network="sbtest"
fi

case "${1}" in
    'build')
    build ${2}
    ;;
    'grid')
    grid ${2} ${3} ${4}
    ;;
    'acceptance')
    acceptanceEnv ${2}
    ;;
    'clean')
    clean
    ;;
    'images')
    images
    ;;
    *)
    run ${@}
    ;;
esac
