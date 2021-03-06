/*global module:false*/
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        publicJs: "public/js",
        jsLib: "<%= publicJs %>/lib",
        jsExpress1: "<%= publicJs %>/express1",
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        // Task configuration.
        clean: {
            start: {
                src: ["<%= uglify.dist.dest %>"]
            },
            finish: {
                dot: true,
                src: [".tmp"]
            }
        },
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            dist: {
                src: [
                    '<%= jsLib %>/underscore.js',
                    '<%= jsLib %>/jquery.js',
                    '<%= jsLib %>/backbone.js',
                    '<%= jsLib %>/handlebars.js',
                    '<%= jsExpress1 %>/**/*.js'
                ],
                dest: '.tmp/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: '<%= publicJs %>/<%= pkg.name %>.min.js'
            }
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: true,
                boss: true,
                eqnull: true,
                globals: {
                    jQuery: true,
                    $: true,
                    Backbone: true,
                    Handlebars: true
                }
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            lib_test: {
                src: ['lib/**/*.js', 'test/**/*.js']
            },
            pub: {
                src: ['<%= publicJs %>/express1/**/*.js']
            }
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            lib_test: {
                files: '<%= jshint.lib_test.src %>',
                tasks: ['jshint:lib_test', 'nodeunit']
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon');

    grunt.registerTask('target', 'Set the deploy target', function(value){
        process.env.NODE_ENV = value;
    });

    grunt.registerTask('build', [
        'clean:start',
        'jshint:pub',
        'concat',
        'uglify',
        'clean:finish'
    ]);

    grunt.registerTask('dev', [
        'target:development'
    ]);

    grunt.registerTask('prod', [
        'target:production',
    ]);

    grunt.registerTask('default', [
        'dev'
    ]);
};


