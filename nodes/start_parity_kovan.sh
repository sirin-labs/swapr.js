#! /bin/bash

NODES_DIR=$(dirname "${BASH_SOURCE[0]}")
parity --config $NODES_DIR/kovan_config.toml
