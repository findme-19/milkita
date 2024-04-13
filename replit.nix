{ pkgs }: {
	deps = [
		pkgs.neofetch
		pkgs.imagemagick
		pkgs.nodejs-19_x
		pkgs.speedtest-cli
		pkgs.jellyfin-ffmpeg
		pkgs.git
		pkgs.python2
		pkgs.python310Packages.python
	];
}