module.exports = function(grunt) {
	grunt.initConfig({
		//run a static server that does not refresh with changes of files
	    connect: {
	      server: {
	        options: {
			  hostname: '*',
	          port: 9009,
	          useAvailablePort: true,
	          base: './',
	          keepalive: true
	    	}
		  }
	    },
		copy: {
			"sap.ui.core": {
				files: [
					{
						cwd: "bower_components/openui5-sap.ui.core/resources",
						src: [ "**/*" ],
						dots: true,
						expand: true,
						dest: "dist/resources/"
					},
				]
			},
			"sap.ui.layout": {
				files: [
					{
						cwd: "bower_components/openui5-sap.ui.layout/resources",
						src: [ "**/*" ],
						dots: true,
						expand: true,
						dest: "dist/resources/"
					},
				]
			},
			"sap.ui.table": {
				files: [
					{
						cwd: "bower_components/openui5-sap.ui.table/resources",
						src: [ "**/*" ],
						dots: true,
						expand: true,
						dest: "dist/resources/"
					},
				]
			},
			"sap.ui.unified": {
				files: [
					{
						cwd: "bower_components/openui5-sap.ui.unified/resources",
						src: [ "**/*" ],
						dots: true,
						expand: true,
						dest: "dist/resources/"
					},
				]
			},
			"sap.m": {
				files: [
					{
						cwd: "bower_components/openui5-sap.m/resources",
						src: [ "**/*" ],
						dots: true,
						expand: true,
						dest: "dist/resources/"
					},
				]
			}
		},
		concat: {
			"sap-ui-custom.js": {
				options: {
					banner: "window['sap-ui-optimized'] = true; ",
					process: function(src, filepath) {
						var moduleName = filepath.substr("bower_components/openui5-sap.ui.core/resources/".length);
						if (moduleName === "sap/ui/thirdparty/jquery-mobile-custom.js") {
							var preloadName = moduleName.replace(/\//g, ".").replace(/\.js$/, "-preload"); 
							var preload = {
								"version": "2.0",
								"name": preloadName,
								"modules": {}
							};
							preload.modules[moduleName] = src;
							return "jQuery.sap.registerPreloadedModules(" + JSON.stringify(preload) + ");";
						}
						return src;
					}
				},
				src: [
					"bower_components/openui5-sap.ui.core/resources/sap/ui/thirdparty/jquery.js",
					"bower_components/openui5-sap.ui.core/resources/sap/ui/thirdparty/jqueryui/jquery-ui-position.js",
					"bower_components/openui5-sap.ui.core/resources/sap/ui/Device.js",
					"bower_components/openui5-sap.ui.core/resources/sap/ui/thirdparty/URI.js",
					"bower_components/openui5-sap.ui.core/resources/jquery.sap.promise.js",
					"bower_components/openui5-sap.ui.core/resources/jquery.sap.global.js",
					"bower_components/openui5-sap.ui.core/resources/sap/ui/thirdparty/jquery-mobile-custom.js",
					"dist/resources/sap-ui-messagebundle-preload.js",
					"dist/resources/sap/ui/core/custom-library-preload.js"
				],
				dest: "dist/resources/sap-ui-custom.js"
			},
			"sap/ui/core/custom-library-preload.js": {
				options: {
					banner: "jQuery.sap.registerPreloadedModules(",
					footer: "); jQuery.sap.require('sap.ui.core.Core'); sap.ui.getCore().boot && sap.ui.getCore().boot();"
				},
				src: "bower_components/openui5-sap.ui.core/resources/sap/ui/core/library-preload.json",
				dest: "dist/resources/sap/ui/core/custom-library-preload.js"
			},
			"sap-ui-messagebundle-preload.js": {
				options: {
					process: function(src, filepath) {
						var moduleName = filepath.substr(filepath.indexOf("resources/") + "resources/".length);
						var preloadName = moduleName.replace(/\//g, ".").replace(/\.js$/, "-preload");
						var preload = {
							"version": "2.0",
							"name": preloadName,
							"modules": {}
						};
						preload.modules[moduleName] = src;
						return "jQuery.sap.registerPreloadedModules(" + JSON.stringify(preload) + ");";
					}
				},
				src: [
					"bower_components/openui5-sap.ui.core/resources/sap/ui/core/*.properties",
					"bower_components/openui5-sap.m/resources/sap/m/*.properties"
				],
				dest: "dist/resources/sap-ui-messagebundle-preload.js"
			}
		}
	});
	
	// Load the plugin that provides the "connect" task.
  	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.registerTask("build", [
		"copy",
		"concat:sap-ui-messagebundle-preload.js",
		"concat:sap/ui/core/custom-library-preload.js",
		"concat:sap-ui-custom.js"
	]);
	
	grunt.registerTask('default', ['connect:server']);

};
