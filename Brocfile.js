const babel            = require('broccoli-babel-transpiler')
const compileSass      = require('broccoli-sass')
const BroccoliCleanCss = require('broccoli-clean-css');
const Funnel           = require('broccoli-funnel')
const mergeTrees       = require('broccoli-merge-trees')
const Rollup           = require('broccoli-rollup')
const AssetRev         = require('broccoli-asset-rev')
const htmlmin          = require('broccoli-htmlmin');
const Babili           = require('./babili-plugin')

let cssTree = compileSass(['app'], 'app.scss','app.css', {})
cssTree = new BroccoliCleanCss(cssTree)

const babelOptions = { 
	browserPolyfill: true, 
	sourceMap: 'inline', 
}
const rollupOptions = {
	inputFiles: ['*.js'],
	rollup: {
		dest: 'app.js',
		entry: 'app.js',
		sourceMap: 'inline'
	}
}

let jsTree = new Rollup('app', rollupOptions)
jsTree = babel(jsTree, babelOptions)
jsTree = new Babili(jsTree)

const htmlTree = htmlmin(Funnel('app', {
	files: ['index.html'],
	destDir: '/'
}))

module.exports = new AssetRev(mergeTrees([jsTree, cssTree, htmlTree], { overwrite: true }))
