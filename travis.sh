#!/bin/bash
set -o errexit -o nounset -o pipefail

npm run eslint
npm run test-unit