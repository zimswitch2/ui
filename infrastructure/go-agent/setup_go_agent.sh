sudo echo "deb http://dl.bintray.com/gocd/gocd-deb/ /" > /etc/apt/sources.list.d/go-cd.list
sudo apt-key adv --keyserver pgp.mit.edu --recv-keys 173454C7 # pubkey for GO packages
curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -

sudo apt-get -y install vnc4server go-agent maven3 nodejs build-essential subversion gnuplot

sudo apt-get -y remove ruby rubygems

sudo echo "export GO_SERVER=10.18.18.112
export GO_SERVER_PORT=8153
export AGENT_WORK_DIR=/var/lib/${SERVICE_NAME:-go-agent}
DAEMON=Y
VNC=Y
#Uncomment the following line and change display number when running multiple agents on one machine
#VNC_DISPLAY=:3
export JAVA_HOME=\"/usr/lib/jvm/java-7-oracle/jre\" # SET_BY_GO_INSTALLER__DONT_REMOVE
export PATH=\"$HOME/.rbenv/shims:$HOME/.rbenv/bin:$PATH\"" > /etc/default/go-agent

sudo su go

git clone https://github.com/sstephenson/rbenv.git ~/.rbenv
git clone https://github.com/sstephenson/ruby-build.git ~/.rbenv/plugins/ruby-build

export PATH="$HOME/.rbenv/bin:$PATH"
curl -fsSL https://gist.github.com/mislav/a18b9d7f0dc5b9efc162.txt | rbenv install --patch 2.1.1

rbenv local 2.1.1
gem install bundler
rbenv rehash

exit

sudo service go-agent start
