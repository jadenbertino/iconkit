#!/usr/bin/env node

import { getVersionFromChangelog } from '../src/env/utils.ts'

const version = getVersionFromChangelog()
console.log(version)