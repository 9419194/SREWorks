#!/bin/bash

SW_ROOT=$(cd `dirname $0`; pwd)

set -e

target_python27(){

    [ -n "$TAG" ] && tag=$TAG || tag="latest"

    if [ -n "$BUILD" ]; then
        echo "-- build sw-python27 --" >&2
        docker build -t sw-python27:$tag --pull --no-cache -f $SW_ROOT/paas/python27/Dockerfile $SW_ROOT/paas/python27  
        docker tag sw-python27:$tag sw-python27:latest
    fi
    if [ -n "$PUSH_REPO" ]; then
        echo "-- push sw-python27 --" >&2
        docker tag sw-python27:$tag $PUSH_REPO/sw-python27:$tag
        docker push $PUSH_REPO/sw-python27:$tag
    fi
}

target_maven(){
    [ -n "$TAG" ] && tag=$TAG || tag="latest"    
    if [ -n "$BUILD" ]; then
        echo "-- build sw-maven --" >&2
        docker build -t sw-maven:$tag --pull --no-cache -f $SW_ROOT/paas/maven/Dockerfile $SW_ROOT/paas/maven
        docker tag sw-maven:$tag sw-maven:latest
    fi
    if [ -n "$PUSH_REPO" ]; then
        echo "-- push sw-maven --" >&2
        docker tag sw-maven:$tag $PUSH_REPO/sw-maven:$tag
        docker push $PUSH_REPO/sw-maven:$tag
    fi
}

target_migrate(){
    [ -n "$TAG" ] && tag=$TAG || tag="latest"
    if [ -n "$BUILD" ]; then
        echo "-- build sw-migrate --" >&2
        docker build -t sw-migrate:$tag --pull --no-cache -f $SW_ROOT/paas/migrate/Dockerfile $SW_ROOT/paas/migrate
        docker tag sw-migrate:$tag sw-migrate:latest
    fi
    if [ -n "$PUSH_REPO" ]; then
        echo "-- push sw-migrate --" >&2
        docker tag sw-migrate:$tag $PUSH_REPO/sw-migrate:$tag
        docker push $PUSH_REPO/sw-migrate:$tag
    fi
}

target_openjdk8(){
    [ -n "$TAG" ] && tag=$TAG || tag="latest"
    if [ -n "$BUILD" ]; then
        echo "-- build sw-openjdk8-jre --" >&2
        docker build -t sw-openjdk8-jre:$tag --pull --no-cache -f $SW_ROOT/paas/openjdk8-jre/Dockerfile $SW_ROOT/paas/openjdk8-jre
        docker tag sw-openjdk8-jre:$tag sw-openjdk8-jre:latest
    fi
    if [ -n "$PUSH_REPO" ]; then
        echo "-- push sw-openjdk8-jre --" >&2
        docker tag sw-openjdk8-jre:$tag $PUSH_REPO/sw-openjdk8-jre:$tag
        docker push $PUSH_REPO/sw-openjdk8-jre:$tag
    fi
}

target_postrun(){
    [ -n "$TAG" ] && tag=$TAG || tag="latest"
    if [ -n "$BUILD" ]; then
        echo "-- build sw-postrun --" >&2
        docker build -t sw-postrun:$tag --pull --no-cache -f $SW_ROOT/paas/postrun/Dockerfile $SW_ROOT/paas/postrun
        docker tag sw-postrun:$tag sw-postrun:latest
    fi
    if [ -n "$PUSH_REPO" ]; then
        echo "-- push sw-postrun --" >&2
        docker tag sw-postrun:$tag $PUSH_REPO/sw-postrun:$tag
        docker push $PUSH_REPO/sw-postrun:$tag
    fi
}

target_appmanager_server(){
    [ -n "$TAG" ] && tag=$TAG || tag="develop"
    if [ -n "$BUILD" ]; then
        echo "-- build appmanager server --" >&2
        docker build -t sw-paas-appmanager:$tag --no-cache -f $SW_ROOT/paas/appmanager/Dockerfile_sreworks $SW_ROOT/paas/appmanager
        docker tag sw-paas-appmanager:$tag sw-paas-appmanager:latest
    fi
    if [ -n "$PUSH_REPO" ]; then
        echo "-- push appmanager server --" >&2
        docker tag sw-paas-appmanager:$tag $PUSH_REPO/sw-paas-appmanager:$tag
        docker push $PUSH_REPO/sw-paas-appmanager:$tag
    fi
}

target_appmanager_db_migration(){
    [ -n "$TAG" ] && tag=$TAG || tag="latest"
    if [ -n "$BUILD" ]; then
        echo "-- build appmanager db migration --" >&2
        docker build -t sw-paas-appmanager-db-migration:$tag -f $SW_ROOT/paas/appmanager/Dockerfile_db_migration $SW_ROOT/paas/appmanager
        docker tag sw-paas-appmanager-db-migration:$tag sw-paas-appmanager-db-migration:latest
    fi
    if [ -n "$PUSH_REPO" ]; then
        echo "-- push appmanager db migration --" >&2
        docker tag sw-paas-appmanager-db-migration:$tag $PUSH_REPO/sw-paas-appmanager-db-migration:$tag
        docker push $PUSH_REPO/sw-paas-appmanager-db-migration:$tag
    fi
}

target_appmanager_postrun(){
    [ -n "$TAG" ] && tag=$TAG || tag="latest"
    if [ -n "$BUILD" ]; then
        echo "-- build appmanager postrun --" >&2
        docker build -t sw-paas-appmanager-postrun:$tag -f $SW_ROOT/paas/appmanager/Dockerfile_postrun_sreworks $SW_ROOT/paas/appmanager
        docker tag sw-paas-appmanager-postrun:$tag sw-paas-appmanager-postrun:latest
    fi
    if [ -n "$PUSH_REPO" ]; then
        echo "-- push appmanager postrun --" >&2
        docker tag sw-paas-appmanager-postrun:$tag $PUSH_REPO/sw-paas-appmanager-postrun:$tag
        docker push $PUSH_REPO/sw-paas-appmanager-postrun:$tag
    fi
}

target_minio_init(){
    [ -n "$TAG" ] && tag=$TAG || tag="latest"
    if [ -n "$BUILD" ]; then
        echo "-- build minio init --" >&2
        docker build -t sw-paas-minio-init:$tag -f $SW_ROOT/paas/minio/Dockerfile-init-job $SW_ROOT/paas/minio
        docker tag sw-paas-minio-init:$tag sw-paas-minio-init:latest
    fi
    if [ -n "$PUSH_REPO" ]; then
        echo "-- push minio init --" >&2
        docker tag sw-paas-minio-init:$tag $PUSH_REPO/sw-paas-minio-init:$tag
        docker push $PUSH_REPO/sw-paas-minio-init:$tag
    fi
}

target_appmanager_cluster_init(){
    [ -n "$TAG" ] && tag=$TAG || tag="latest"
    if [ -n "$BUILD" ]; then
        echo "-- build appmanager cluster init --" >&2
        docker build -t sw-paas-appmanager-cluster-init:$tag -f $SW_ROOT/paas/appmanager/Dockerfile_cluster_init $SW_ROOT/paas/appmanager
        docker tag sw-paas-appmanager-cluster-init:$tag sw-paas-appmanager-cluster-init:latest
    fi
    if [ -n "$PUSH_REPO" ]; then
        echo "-- push appmanager cluster init --" >&2
        docker tag sw-paas-appmanager-cluster-init:$tag $PUSH_REPO/sw-paas-appmanager-cluster-init:$tag
        docker push $PUSH_REPO/sw-paas-appmanager-cluster-init:$tag
    fi
}

target_appmanager_kind_operator(){
    [ -n "$TAG" ] && tag=$TAG || tag="develop"
    if [ -n "$BUILD" ]; then
        echo "-- build appmanager kind operator --" >&2
        cd $SW_ROOT/paas/appmanager-kind-operator
        IMG=sw-paas-appmanager-operator:$tag make docker-build
        docker tag sw-paas-appmanager-operator:$tag sw-paas-appmanager-operator:latest
    fi
    if [ -n "$PUSH_REPO" ]; then
        echo "-- push appmanager kind operator --" >&2
        docker tag sw-paas-appmanager-operator:$tag $PUSH_REPO/sw-paas-appmanager-operator:$tag
        docker push $PUSH_REPO/sw-paas-appmanager-operator:$tag
    fi
}

target_swcli(){
    [ -n "$TAG" ] && tag=$TAG || tag="latest"    
    if [ -n "$BUILD" ]; then
        echo "-- build swcli --" >&2
        docker build -t swcli:$tag -f $SW_ROOT/paas/swcli/Dockerfile_sreworks $SW_ROOT/paas/swcli
        docker tag swcli:$tag swcli:latest
    fi
    if [ -n "$PUSH_REPO" ]; then
        docker tag swcli:$tag $PUSH_REPO/swcli:$tag
        docker tag swcli:$tag swcli:latest
        docker push $PUSH_REPO/swcli:$tag
    fi 
}

download_packages(){
   PKG_URL="https://sreworks.oss-cn-beijing.aliyuncs.com/packages/${tag}"

   mkdir -p $SW_ROOT/saas/desktop/ui/ && wget "${PKG_URL}/saas/desktop/ui/desktop-auto.zip" -O $SW_ROOT/saas/desktop/ui/desktop-auto.zip
   mkdir -p $SW_ROOT/saas/swadmin/ui/ && wget "${PKG_URL}/saas/swadmin/ui/swadmin-auto.zip" -O $SW_ROOT/saas/swadmin/ui/swadmin-auto.zip
   mkdir -p $SW_ROOT/saas/system/ui/ && wget "${PKG_URL}/saas/system/ui/system-auto.zip" -O $SW_ROOT/saas/system/ui/system-auto.zip
   mkdir -p $SW_ROOT/saas/upload/ui/ && wget "${PKG_URL}/saas/upload/ui/upload-auto.zip" -O $SW_ROOT/saas/upload/ui/upload-auto.zip
   mkdir -p $SW_ROOT/saas/team/ui/ && wget "${PKG_URL}/saas/team/ui/team-auto.zip" -O $SW_ROOT/saas/team/ui/team-auto.zip
   mkdir -p $SW_ROOT/saas/search/ui/ && wget "${PKG_URL}/saas/search/ui/search-auto.zip" -O $SW_ROOT/saas/search/ui/search-auto.zip
   mkdir -p $SW_ROOT/saas/ocenter/ui/ && wget "${PKG_URL}/saas/ocenter/ui/ocenter-auto.zip" -O $SW_ROOT/saas/ocenter/ui/ocenter-auto.zip
   mkdir -p $SW_ROOT/saas/aiops/ui/ && wget "${PKG_URL}/saas/aiops/ui/aiops-auto.zip" -O $SW_ROOT/saas/aiops/ui/aiops-auto.zip
   mkdir -p $SW_ROOT/saas/app/ui/ && wget "${PKG_URL}/saas/app/ui/app-auto.zip" -O $SW_ROOT/saas/app/ui/app-auto.zip
   mkdir -p $SW_ROOT/saas/cluster/ui/ && wget "${PKG_URL}/saas/cluster/ui/cluster-auto.zip" -O $SW_ROOT/saas/cluster/ui/cluster-auto.zip
   mkdir -p $SW_ROOT/saas/dataops/ui/data/ && wget "${PKG_URL}/saas/dataops/ui/data/data-auto.zip" -O $SW_ROOT/saas/dataops/ui/data/data-auto.zip
   mkdir -p $SW_ROOT/saas/healing/ui/ && wget "${PKG_URL}/saas/healing/ui/healing-auto.zip" -O $SW_ROOT/saas/healing/ui/healing-auto.zip
   mkdir -p $SW_ROOT/saas/health/ui/ && wget "${PKG_URL}/saas/health/ui/health-auto.zip" -O $SW_ROOT/saas/health/ui/health-auto.zip
   mkdir -p $SW_ROOT/saas/help/ui/ && wget "${PKG_URL}/saas/help/ui/help-auto.zip" -O $SW_ROOT/saas/help/ui/help-auto.zip
   mkdir -p $SW_ROOT/saas/job/ui/ && wget "${PKG_URL}/saas/job/ui/job-auto.zip" -O $SW_ROOT/saas/job/ui/job-auto.zip

   wget "${PKG_URL}/saas/aiops/aiops.zip" -O $SW_ROOT/saas/aiops/aiops.zip
   wget "${PKG_URL}/saas/app/app.zip" -O $SW_ROOT/saas/app/app.zip
   wget "${PKG_URL}/saas/cluster/cluster.zip" -O $SW_ROOT/saas/cluster/cluster.zip
   wget "${PKG_URL}/saas/dataops/data.zip" -O $SW_ROOT/saas/dataops/data.zip
   wget "${PKG_URL}/saas/health/health.zip" -O $SW_ROOT/saas/health/health.zip
   wget "${PKG_URL}/saas/job/job.zip" -O $SW_ROOT/saas/job/job.zip
   wget "${PKG_URL}/saas/search/search.zip" -O $SW_ROOT/saas/search/search.zip
   wget "${PKG_URL}/saas/swcore/flycore.zip" -O $SW_ROOT/saas/swcore/flycore.zip
   wget "${PKG_URL}/saas/system/system.zip" -O $SW_ROOT/saas/system/system.zip
   wget "${PKG_URL}/saas/team/team.zip" -O $SW_ROOT/saas/team/team.zip
   wget "${PKG_URL}/saas/upload/upload.zip" -O $SW_ROOT/saas/upload/upload.zip

}

target_swcli_builtin_package(){
    [ -n "$TAG" ] && tag=$TAG || tag="latest"    
    if [ -n "$BUILD" ]; then
        echo "-- build swcli builtin package --" >&2
        if [ -d $SW_ROOT/paas/swcli/builtin_package ]; then
            rm -rf $SW_ROOT/paas/swcli/builtin_package
        fi
        mkdir $SW_ROOT/paas/swcli/builtin_package
        download_packages
        cp -r $SW_ROOT/saas $SW_ROOT/paas/swcli/builtin_package/saas
        cp -r $SW_ROOT/chart $SW_ROOT/paas/swcli/builtin_package/chart
        docker build -t swcli-builtin-package:$tag -f $SW_ROOT/paas/swcli/Dockerfile_builtin_package $SW_ROOT/paas/swcli
        docker tag swcli-builtin-package:$tag swcli-builtin-package:latest
    fi
    if [ -n "$PUSH_REPO" ]; then
        docker tag swcli-builtin-package:$tag $PUSH_REPO/swcli-builtin-package:$tag
        docker push $PUSH_REPO/swcli-builtin-package:$tag
    fi 
}


target_base(){
    target_python27
    target_maven
    target_migrate
    target_openjdk8
    target_postrun
}

target_appmanager_base(){
    target_appmanager_db_migration
    target_appmanager_postrun
    target_appmanager_cluster_init
    target_appmanager_kind_operator
    target_swcli
    target_swcli_builtin_package
}

target_appmanager(){
    target_appmanager_server
    target_appmanager_db_migration
    target_appmanager_postrun
    target_appmanager_cluster_init
    target_appmanager_kind_operator
    target_swcli
    target_swcli_builtin_package
}


POSITIONAL=()
while [[ $# -gt 0 ]]; do
  key="$1"

  case $key in
    -p|--push)
      PUSH_REPO="$2"
      shift # past argument
      shift # past value
      ;;
    -b|--build)
      BUILD="YES"
      shift # past argument
      #shift # past value
      ;;
    -t|--target)
      TARGET="$2"
      shift # past argument
      shift # past value
      ;;
    --tag)
      TAG="$2"
      shift # past argument
      shift # past value
      ;; 
    --default)
      DEFAULT=YES
      shift # past argument
      ;;
    *)    # unknown option
      POSITIONAL+=("$1") # save it in an array for later
      shift # past argument
      ;;
  esac
done

set -- "${POSITIONAL[@]}" # restore positional parameters

if  [ ! -n "$TARGET" ] ;then
    echo "" >&2
    echo "      -p, --push          Push docker image to target repository (default no push) " >&2
    echo "      -b, --build         " >&2
    echo "      -t, --target        all, base, appmanager " >&2
    echo "      --tag               image tag" >&2
    echo "" >&2
else

    echo "SW_ROOT             = ${SW_ROOT}" >&2
    echo "PUSH_REPO           = ${PUSH_REPO}" >&2
    echo "BUILD               = ${BUILD}" >&2
    echo "TARGET              = ${TARGET}" >&2
    echo "TAG                 = ${TAG}" >&2

    case $TARGET in
    all)
        target_base
        target_appmanager
        ;;
    base)
        target_base
        ;;
    appmanager)
        target_appmanager
        ;;
    appmanager_base)
        target_appmanager_base
        ;;
    *)
        eval "target_${TARGET//\-/\_}"
    esac
fi





