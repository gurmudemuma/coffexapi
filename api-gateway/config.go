package main

import (
	"os"

	"gopkg.in/yaml.v2"
)

type Config struct {
	Fabric struct {
		ChannelName       string `yaml:"channelName"`
		ChaincodeName     string `yaml:"chaincodeName"`
		ConnectionProfile string `yaml:"connectionProfile"`
	} `yaml:"fabric"`
	Server struct {
		Port string `yaml:"port"`
		Cors struct {
			AllowedOrigins []string `yaml:"allowedOrigins"`
		} `yaml:"cors"`
	} `yaml:"server"`
	Auth struct {
		JWTSecret string `yaml:"jwtSecret"`
	} `yaml:"auth"`
}

func LoadConfig(path string) (*Config, error) {
	config := &Config{}

	file, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	d := yaml.NewDecoder(file)

	if err := d.Decode(&config); err != nil {
		return nil, err
	}

	return config, nil
}
