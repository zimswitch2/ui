#!/usr/bin/env bash
# The purpose for this script is to automatically setup new dev machines for ubuntu
# What needs to be installed:
# 1) Install all Ubuntu dependencies
# 1.1) enable properties 
sudo sed -i "/^# deb .*partner/ s/^# //" /etc/apt/sources.list && apt-get update

# 1.2) Download and Install GetDeb and PlayDeb
echo "Downloading GetDeb and PlayDeb" &&
wget http://archive.getdeb.net/install_deb/getdeb-repository_0.1-1~getdeb1_all.deb http://archive.getdeb.net/install_deb/playdeb_0.3-1~getdeb1_all.deb &&

echo "Installing GetDeb" &&
sudo dpkg -i getdeb-repository_0.1-1~getdeb1_all.deb &&

echo "Installing PlayDeb" &&
sudo dpkg -i playdeb_0.3-1~getdeb1_all.deb &&

echo "Deleting Downloads" &&
rm -f getdeb-repository_0.1-1~getdeb1_all.deb &&
rm -f playdeb_0.3-1~getdeb1_all.deb

# 1.3) Add Personal Package Archives
sudo apt-get install -y --quiet ubuntu-restricted-extras

sudo add-apt-repository -y ppa:otto-kesselgulasch/gimp

sudo add-apt-repository -y ppa:gnome3-team/gnome3

sudo add-apt-repository -y ppa:webupd8team/java

sudo add-apt-repository -y ppa:webupd8team/y-ppa-manager

echo 'deb http://download.videolan.org/pub/debian/stable/ /' | sudo tee -a /etc/apt/sources.list.d/libdvdcss.list &&
echo 'deb-src http://download.videolan.org/pub/debian/stable/ /' | sudo tee -a /etc/apt/sources.list.d/libdvdcss.list &&
wget -O - http://download.videolan.org/pub/debian/videolan-apt.asc|sudo apt-key add -

# 1.4) Check for Updates
sudo apt-get update -y

# 1.5) Upgrade Packages
sudo apt-get upgrade -y

# 1.6) Major Upgrades 
sudo apt-get dist-upgrade -y

# 1.7) Install Essentials
echo 'Install Essentials'
sudo apt-get install -y --quiet synaptic vlc gimp gimp-data gimp-plugin-registry gimp-data-extras y-ppa-manager bleachbit openjdk-7-jre  flashplugin-installer unace unrar zip unzip p7zip-full p7zip-rar sharutils rar uudeview mpack arj cabextract file-roller libxine1-ffmpeg mencoder flac faac faad sox ffmpeg2theora libmpeg2-4 uudeview libmpeg3-1 mpeg3-utils mpegdemux liba52-dev mpeg2dec vorbis-tools id3v2 mpg321 mpg123 libflac++6 totem-mozilla icedax lame libmad0 libjpeg-progs libdvdcss2 libdvdread4 libdvdnav4 libswscale-extra-2 ubuntu-restricted-extras ubuntu-wallpapers*

# 1.8) Install chrome 
echo 'Install chrome'
if [[ $(getconf LONG_BIT) = "64" ]]
then
	echo "64bit Detected" &&
	echo "Installing Google Chrome" &&
	wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb &&
	sudo dpkg -i google-chrome-stable_current_amd64.deb &&
	rm -f google-chrome-stable_current_amd64.deb
else
	echo "32bit Detected" &&
	echo "Installing Google Chrome" &&
	wget https://dl.google.com/linux/direct/google-chrome-stable_current_i386.deb &&
	sudo dpkg -i google-chrome-stable_current_i386.deb &&
	rm -f google-chrome-stable_current_i386.deb
fi


# 1.9) Install java jdk
echo 'Install java jdk'
sudo apt-get install -y openjdk-7-jdk

# 1.10) remove ruby install from apt-get
sudo apt-get remove -y ruby rubygems

# 1.11) install depedcies needed for ruby
echo 'install depedcies needed for ruby'
sudo apt-get install -y git-core curl zlib1g-dev build-essential libssl-dev libreadline-dev libyaml-dev libsqlite3-dev sqlite3 libxml2-dev libxslt1-dev libcurl4-openssl-dev python-software-properties libffi-dev


# 2) Install Ruby env manager (rbenv) & ruby 2.1.1
echo 'Install Ruby env manager (rbenv) & ruby 2.1.1'
cd
git clone git://github.com/sstephenson/rbenv.git .rbenv
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(rbenv init -)"' >> ~/.bashrc
exec $SHELL

git clone git://github.com/sstephenson/ruby-build.git ~/.rbenv/plugins/ruby-build
echo 'export PATH="$HOME/.rbenv/plugins/ruby-build/bin:$PATH"' >> ~/.bashrc
exec $SHELL

git clone https://github.com/sstephenson/rbenv-gem-rehash.git ~/.rbenv/plugins/rbenv-gem-rehash

curl -fsSL https://gist.github.com/mislav/a18b9d7f0dc5b9efc162.txt | rbenv install --patch 2.1.1

rbenv local 2.1.1

echo "gem: --no-ri --no-rdoc" > ~/.gemrc

gem install bundler
rbenv rehash


# 3) install node version manager and nodejs - v0.10.32
echo 'install node version manager and nodejs - v0.10.32'
curl https://raw.githubusercontent.com/creationix/nvm/v0.29.0/install.sh | bash
source ~/.bashrc
nvm install 0.10.32
echo 'current version'
nvm current
nvm install stable
nvm use 0.10.32


#4 ) setting workspace - ib front code and back end code
echo 'setting workspace - ib front code and back end code'
cd ~

if [ ! -d "$HOME/workspace/standard-bank" ]; then
	echo 'Create workspace standard bank'
	mkdir -p $HOME/workspace/standard-bank
	cd $HOME/workspace/standard-bank
fi


if [ ! -d "$HOME/workspace/standard-bank/ib-rewrite" ]; then
	echo 'Create ib-rewrite directory'
	mkdir -p $HOME/workspace/standard-bank/ib-rewrite
	cd $HOME/workspace/standard-bank/ib-rewrite
fi

echo 'Start cloning ib web project'
git clone ssh://git@stash.standardbank.co.za:7999/ibr/ib.git

echo 'Finished cloning ib web project'
echo 'Start cloning ibr contracts project'

git clone ssh://git@stash.standardbank.co.za:7999/ibr/ibr-contracts.git
echo 'Finished cloning ibr contracts project'
echo 'Start cloning gateway projects'

if [ ! -d "$HOME/workspace/standard-bank/gateway" ]; then
	echo 'Create gateway directory'
	mkdir -p $HOME/workspace/standard-bank/gateway
	cd $HOME/workspace/standard-bank/gateway
fi

git svn clone https://svn.standardbank.co.za:449/svn/mca/channel/ib/gateways/sbg-gateway-ib/trunk/
mv trunk sbg-gateway-ib


git svn clone https://svn.standardbank.co.za:449/svn/mca/channel/ib/gateways/sbg-gateway-ib-config/trunk/
mv trunk sbg-gateway-ib-config
​
cd ..
echo 'Finished cloning gateway projects'

