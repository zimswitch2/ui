//install chefdk

mkdir ~/chop
cd ~/chop

//download vagrant box, yaml and chefdk (only for macs)

mkdir utils
//download chef rpm
echo "rpm -i /mnt/share/chef-12.0.3-1.x86_64.rpm" > utils/install_chef.sh

git clone ssh://git@stash.standardbank.co.za:7999/cce/databags.git
git clone ssh://git@stash.standardbank.co.za:7999/cc/ibrapp.git
git clone ssh://git@stash.standardbank.co.za:7999/cc/ibrweb.git
git clone ssh://git@stash.standardbank.co.za:7999/cc/java.git
git clone ssh://git@stash.standardbank.co.za:7999/cc/java-wrapper.git
git clone ssh://git@stash.standardbank.co.za:7999/cc/jboss-eap.git
git clone ssh://git@stash.standardbank.co.za:7999/cc/haproxy-mt.git
git clone ssh://git@stash.standardbank.co.za:7999/cccc/logrotate.git
git clone ssh://git@stash.standardbank.co.za:7999/cc/logstash-sbsa.git

vagrant box add redhat RHEL_65_vagrant_package.box

cd -

kitchen init

berks

kitchen create

kitchen converge